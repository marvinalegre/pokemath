import "server-only";
import { MongoClient } from "mongodb";
import { env } from "./env";
import type { ObjectId } from "mongodb";
import type { Problem } from "mathforge";

export type PendingCatch = {
  pokemonId: number | null;
};

type CaughtPokemonDoc = {
  userId: ObjectId;
  pokemonId: number;
  caughtAt: Date;
  position: number;
};

type ActiveProblemDoc = {
  userId: ObjectId;
  problemId: Problem["id"];
  data: Problem["data"];
  answer: Problem["answer"];
  lockedUntil?: Date;
  pendingCatch?: PendingCatch;
};

export type UserDoc = {
  username: string;
  passwordHash: string;
  createdAt: Date;
  dismissedCatchIntro?: boolean;
};

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

async function connectAndPrepare(): Promise<MongoClient> {
  const client = await new MongoClient(env.MONGODB_URI).connect();

  // Idempotent: a no-op if the index already exists with the same options.
  await client
    .db()
    .collection("users")
    .createIndex({ username: 1 }, { unique: true });

  await client
    .db()
    .collection("caughtPokemon")
    .createIndex({ userId: 1, position: 1 });

  return client;
}

const clientPromise = globalForMongo.mongoClientPromise ?? connectAndPrepare();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

export default clientPromise;

export async function getUsers() {
  const client = await clientPromise;
  return client.db().collection<UserDoc>("users");
}

export async function getActiveProblems() {
  const client = await clientPromise;
  return client.db().collection<ActiveProblemDoc>("activeProblems");
}

export async function getCaughtPokemon() {
  const client = await clientPromise;
  return client.db().collection<CaughtPokemonDoc>("caughtPokemon");
}
