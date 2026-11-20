import "server-only";
import { MongoClient, type Db } from "mongodb";
import { env } from "./env";
import type { ObjectId } from "mongodb";
import type { Problem } from "mathforge";
import { problemGradeLevels } from "@/lib/problem-grade-levels";

export type ProblemRatingDoc = {
  _id: string; // the ProblemId
  rating: number;
  attempts: number;
};

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
  rating?: number;
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

  const db = client.db();
  await seedProblemRatings(db);

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

export async function getProblemRatings() {
  const client = await clientPromise;
  return client.db().collection<ProblemRatingDoc>("problemRatings");
}

// Idempotent: existing problems keep their stored rating. Changing a seed
// value later won't overwrite what players have already moved.
async function seedProblemRatings(db: Db) {
  await db.collection<ProblemRatingDoc>("problemRatings").bulkWrite(
    problemGradeLevels.map(({ id, rating }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $setOnInsert: { rating, attempts: 0 } },
        upsert: true,
      },
    })),
  );
}
