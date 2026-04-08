# PokéMath

Catch Pokémon by answering questions matched to your skill level. An ELO rating system tracks both you and every question type, so the challenge always meets you where you are.

|               |                                       |
| ------------- | ------------------------------------- |
| **Runtime**   | Cloudflare Workers (V8 isolate model) |
| **Database**  | Cloudflare D1 (SQLite-compatible)     |
| **Framework** | React Router v7                       |

---

## Getting Started

### Setup

Create the D1 database:

```bash
pnpm wrangler login
pnpm wrangler d1 create pokemath
```

Copy the database ID from the output and add it to `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "pokemath",
      "database_id": "your-database-id-here",
    },
  ],
}
```

### Development

Copy the environment files:

```bash
cp sample.env .env.development
cp sample.dev.vars .dev.vars
```

Now run startup scripts:

```bash
pnpm install
pnpm run migrate
pnpm run seed
pnpm run dev
```

### Deployment

Copy the environment files and fill in the values:

```bash
cp sample.env .env.production
```

`.env.*` holds non-secret config. `.dev.vars` holds secrets for local development. For production secrets in sample.dev.vars, set each one via Wrangler:

```bash
pnpm wrangler secret put SECRET_NAME
```

We recommend using OpenSSL in generating JWT_SECRET:

```bash
openssl rand -base64 32
```

Now deploy with:

```bash
pnpm run deploy
```

---

## Project Structure

```
app/
├── routes.ts                     # route config
├── routes/
│   ├── catch-page.tsx
│   ├── players-page.tsx
    └── ...
├── engine/
│   ├── selector.ts               # ELO-based question selection
│   ├── question.ts               # generate, validate, persist
│   └── elo.ts                    # rating updates
└── question-types/
    ├── registry.ts               # in-memory Map of generators
    ├── register.ts               # explicit registration at startup
    ├── index.ts                  # barrel re-export
    ├── addition.ts
    ├── subtraction.ts
    ├── multiplication.ts
    └── ...                       # 100+ generator modules
```

---

## Architecture

### Routes

**`/`** — guest account is created automatically on first visit. No login required.

**`/catch`** — active question loop. Loads the current `active_questions` row for the user and submits answers via a React Router action. If a cooldown is active, the loader returns the remaining wait time so the countdown is restored on page refresh.

### Engine

**`selector.ts`** — reads `question_types` and `users.rating` from D1 and picks the next question type using ELO-based matching.

- Filters to question types within `MAX_RATING_DIFF` (default 200) of the player's rating.
- Question types with fewer than 20 attempts are always eligible so new types get calibrated against real players.
- Uses inverse-distance weighting — types closer in rating are more likely to be picked, but all candidates have a non-zero chance.
- Falls back to all active question types if the candidate pool is empty.

**`question.ts`** — generates and validates questions.

- Calls `generate()` on the selected module, passing `generator_params` from the DB row.
- Writes the generated question to `active_questions` (upsert).
- On every answer (correct or incorrect): deletes the `active_questions` row and generates a new question.
- On wrong answer: sets `retry_after` on the new `active_questions` row to enforce a 20-second cooldown before the user can submit again.
- Always writes to `answer_logs` regardless of outcome.

**`elo.ts`** — updates ratings after every answer.

- Updates both `users.rating` and `question_types.rating` in one transaction.
- The question "wins" if the player answers incorrectly, "loses" if correctly.

```
new_rating = old_rating + K × (score − expected)
expected   = 1 / (1 + 10^((opponent_rating − own_rating) / 400))
score      = 1 (win) or 0 (loss)
K          = 32 (default)
```

### Question Registry

**`registry.ts`** — an in-memory `Map<generatorKey, QuestionType>` populated at isolate startup. The `QuestionType` interface:

```ts
interface QuestionType {
  id: string; // handler key, e.g. "addition"
  generate: (params: unknown) => Question; // produces a random question
  validate: (question, answer) => boolean; // checks correctness
  component: ComponentType<QuestionProps>; // renderer
}
```

**`register.ts`** — calls `registerQuestionType()` for every module explicitly. Imported once at the Worker entry point. Registration is idempotent.

**`index.ts`** — re-exports all question type modules. `register.ts` iterates `Object.values()` to register them all.

**Generator modules** — one file per generator key (`addition.ts`, `subtraction.ts`, etc.). Each exports a `QuestionType` object and does not self-register. `generate()` accepts `generator_params` from the DB row so the same handler covers multiple difficulty variants (e.g. `max_sum: 10` vs `max_sum: 20`).

**Renderer components** — shared across question types, one file per format:

| Component            | Description              |
| -------------------- | ------------------------ |
| `NumericInput.tsx`   | free-text numeric answer |
| `MultipleChoice.tsx` | pick from options        |
| `TrueFalse.tsx`      | binary choice            |

### Answer Cooldown

Wrong answers trigger a 20-second cooldown before the user can submit again. The cooldown is enforced server-side via `retry_after` on the `active_questions` row, so it survives page refreshes.

The `SubmitResult` type is a discriminated union:

```ts
export type SubmitResult =
  | { correct: true }
  | { correct: false; cooldown?: { msLeft: number } };
```

The loader also checks `retry_after` on mount and returns `cooldown: { msLeft }` if one is active, allowing the frontend to restore the countdown timer on refresh.

---

## Database Schema

```sql
CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT    NOT NULL UNIQUE,
  rating     REAL    NOT NULL DEFAULT 1500,
  role       TEXT    NOT NULL DEFAULT 'guest',
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE question_types (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  category         TEXT    NOT NULL,
  generator        TEXT    NOT NULL,
  generator_params TEXT    NOT NULL DEFAULT '{}',
  renderer         TEXT    NOT NULL,
  renderer_options TEXT    NOT NULL DEFAULT '{}',
  rating           REAL    NOT NULL DEFAULT 1500,
  is_active        INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (generator, generator_params)
);

CREATE TABLE active_questions (
  user_id          INTEGER NOT NULL UNIQUE REFERENCES users(id),
  question_type_id INTEGER NOT NULL REFERENCES question_types(id),
  question_text    TEXT    NOT NULL,
  answer           TEXT    NOT NULL,
  retry_after      TEXT,
  assigned_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE answer_logs (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  question_type_id INTEGER NOT NULL REFERENCES question_types(id),
  question_text    TEXT    NOT NULL,
  user_answer      TEXT    NOT NULL,
  correct_answer   TEXT    NOT NULL,
  is_correct       INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  answered_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
```

`active_questions` holds one row per user at a time — replaced with a new question after every answer. `retry_after` is set on wrong answers and cleared once the cooldown expires. `answer_logs` is append-only and is the source of truth for ELO history and analytics.

---

## Answer Flow

```
1. User visits /catch — guest account created if not exists
2. Loader checks retry_after — if still in cooldown, returns msLeft to client
3. question.ts validate() compares against active_questions.answer
4. answer_logs row written (always, win or lose)
5. elo.ts updates users.rating + question_types.rating in one transaction
6. active_questions row deleted → selector picks next → new row generated
7. Correct  → retry_after left null
   Incorrect → retry_after set to now + 20s → client shows countdown
```

---

## Adding Question Types

**New variant of an existing generator** (e.g. addition with `max_sum: 20`) — insert a row into `question_types`. No code change needed provided the generator already accepts that param.

**New generator** (e.g. `division`):

1. Create `app/question-types/division.ts` implementing `QuestionType`.
2. Re-export it in `index.ts`.
3. Add a `registerQuestionType()` call in `register.ts`.
4. Insert one or more rows in `question_types` pointing to `generator: 'division'`.
5. Re-run `pnpm run seed`.

---

## Cloudflare Workers Notes

The question registry is rebuilt in every V8 isolate from static source code. This is safe because registration is deterministic — all isolates produce the same `Map` from the same modules.

Anything that must survive across requests lives in D1, not memory: ELO ratings, active question state, answer history, and cooldown timestamps.

`PRAGMA foreign_keys = ON` must be set on every D1 connection for FK cascade behaviour to fire. No cascades are currently defined — FKs are declared for documentation and future use.
