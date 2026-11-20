"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/session";
import { getCaughtPokemon } from "@/lib/mongodb";

export async function reorderCaught(orderedIds: string[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = new ObjectId(user.id);
  const ids = orderedIds.filter((id) => ObjectId.isValid(id));
  if (ids.length === 0) return;

  const caught = await getCaughtPokemon();

  // Filtering on userId means a crafted request can't reorder someone else's Pokémon.
  await caught.bulkWrite(
    ids.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id), userId },
        update: { $set: { position: index } },
      },
    })),
  );
}

export async function releasePokemon(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!ObjectId.isValid(id)) return;

  const caught = await getCaughtPokemon();
  await caught.deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(user.id),
  });

  revalidatePath("/collection");
}
