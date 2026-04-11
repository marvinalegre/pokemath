export interface CatchResult {
  id: number;
  name: string;
  description: string;
  color: string;
  isNew: boolean;
  availability: string;
  roll: number;
}

/**
 * Maps the raw million-point roll to the intended availability code.
 */
function getTierFromRoll(r: number): string | "got away" {
  if (r <= 333_333) return "got away";
  else if (r <= 871_799) return "C";
  else if (r <= 950_000) return "CE";
  else if (r <= 971_799) return "CEE";
  else if (r <= 980_799) return "R";
  else if (r <= 982_799) return "RE";
  else if (r <= 983_599) return "REE";
  else if (r <= 995_599) return "T";
  else if (r <= 997_599) return "TE";
  else if (r <= 998_399) return "TEE";
  else if (r <= 999_399) return "H";
  else if (r <= 999_899) return "HE";
  else if (r <= 999_999) return "HEE";
  else return "L";
}

/**
 * Hierarchy of rarity: 0 is rarest, 12 is most common.
 */
const HIERARCHY = [
  "L",
  "HEE",
  "HE",
  "H",
  "TEE",
  "TE",
  "T",
  "REE",
  "RE",
  "R",
  "CEE",
  "CE",
  "C",
];

/**
 * Determines the final availability code based on the user's rating and their luck.
 * This prevents low-level players from catching "L" but lets high-level players catch "C".
 */
function getAllowedAvailability(
  rating: number,
  roll: number,
): string | "got away" {
  const rolledCode = getTierFromRoll(roll);
  if (rolledCode === "got away") return "got away";

  // Determine the "Ceiling" (rarest allowed code) for this rating
  let ceilingCode: string;
  if (rating < 1100) ceilingCode = "CEE";
  else if (rating < 1400) ceilingCode = "REE";
  else if (rating < 1800) ceilingCode = "TEE";
  else if (rating < 2200) ceilingCode = "HEE";
  else ceilingCode = "L";

  const ceilingIndex = HIERARCHY.indexOf(ceilingCode);
  const rolledIndex = HIERARCHY.indexOf(rolledCode);

  // If the player rolled something rarer than their ceiling (rolledIndex < ceilingIndex),
  // downgrade the result to their current maximum allowed rarity.
  if (rolledIndex < ceilingIndex) {
    return ceilingCode;
  }

  return rolledCode;
}

export async function attemptCapture(
  db: D1Database,
  userId: number,
  userElo: number,
): Promise<CatchResult | null> {
  // 1. Roll the dice
  const roll = Math.floor(Math.random() * 1_000_000) + 1;
  const finalCode = getAllowedAvailability(userElo, roll);

  // 2. Handle failure
  if (finalCode === "got away") {
    return null;
  }

  // 3. Find a random Pokémon matching the calculated availability
  const pokemon = await db
    .prepare(
      "SELECT id, name, description, color, availability FROM pokemons WHERE availability = ? ORDER BY RANDOM() LIMIT 1",
    )
    .bind(finalCode)
    .first<Omit<CatchResult, "isNew" | "roll">>();

  // Fallback: If the specific tier is empty in your DB, pull a basic Common
  if (!pokemon) {
    const fallback = await db
      .prepare(
        "SELECT id, name, description, color, availability FROM pokemons WHERE availability = 'C' LIMIT 1",
      )
      .first<Omit<CatchResult, "isNew" | "roll">>();
    if (!fallback) return null;
    return { ...fallback, isNew: false, roll };
  }

  // 4. Check Pokedex for "New" status
  const existing = await db
    .prepare(
      "SELECT id FROM captured_pokemons WHERE user_id = ? AND pokemon_id = ?",
    )
    .bind(userId, pokemon.id)
    .first();

  const isNew = !existing;

  // 5. Save the capture
  await db
    .prepare(
      "INSERT INTO captured_pokemons (user_id, pokemon_id, caught_at_rating) VALUES (?, ?, ?)",
    )
    .bind(userId, pokemon.id, userElo)
    .run();

  return {
    ...pokemon,
    isNew,
    roll,
  };
}
