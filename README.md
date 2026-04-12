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

Copy the database ID from the output and add it to `wrangler.jsonc`.

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

Now deploy with:

```bash
pnpm run deploy
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

---

## Adding Question Types

**New variant of an existing generator** (e.g. addition with `max_sum: 20`) — insert a row into `question_types`. No code change needed provided the generator already accepts that param.

---

## Cloudflare Workers Notes

The question registry is rebuilt in every V8 isolate from static source code. This is safe because registration is deterministic — all isolates produce the same `Map` from the same modules.

Anything that must survive across requests lives in D1, not memory: ELO ratings, active question state, answer history, and cooldown timestamps.

`PRAGMA foreign_keys = ON` must be set on every D1 connection for FK cascade behaviour to fire. No cascades are currently defined — FKs are declared for documentation and future use.
