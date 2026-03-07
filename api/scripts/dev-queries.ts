// Dev only - do not use in production

import { drizzle } from 'drizzle-orm/better-sqlite3';
import { users } from '../src/database/schema';

const db = drizzle('/var/lib/pokemath/pokemath.db');

async function main() {
  const result = await db.select().from(users);
  console.log(result);
}

main();
