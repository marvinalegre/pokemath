import type { Route } from "./+types/caught";
import { Form, Link, redirect, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Latest Catch" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn } = await res.json();

  if (!loggedIn) {
    return redirect("/login");
  }

  const res2 = await fetch("/api/auth/latest");
  const { none, userPokemonExtId, pokemonId, csrfToken } = await res2.json();

  if (none) return redirect("/catch");
  return { userPokemonExtId, pokemonId, csrfToken };
};

export const clientAction = async ({ request }) => {
  const formData = await request.formData();
  if (formData.get("keep") === "") {
    return redirect("/catch");
  } else if (formData.get("release") === "") {
    await fetch("/api/auth/latest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPokemonExtId: formData.get("userPokemonExtId"),
        csrfToken: formData.get("csrfToken"),
      }),
    });
    return redirect("/catch");
  }

  return null;
};

export default function Caught() {
  const { userPokemonExtId, pokemonId, csrfToken } = useLoaderData();
  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
      </nav>

      <div className="mt-8 md:mt-20 px-2 md:px-8">
        <img
          className={`w-56 h-56 mb-20 md:w-64 md:h-64 mx-auto`}
          src={`https://pokemons.pages.dev/sprites/pm${pokemonId.padStart(
            4,
            "0"
          )}_00_00_00_big.png`}
        />
        <Form method="post" className="px-4 max-w-sm mx-auto space-y-4 md:px-8">
          <button
            name="keep"
            type="submit"
            className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
            autoFocus
          >
            keep
          </button>
          <button
            name="release"
            type="submit"
            className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
          >
            release
          </button>
          <input
            className="hidden"
            name="userPokemonExtId"
            defaultValue={userPokemonExtId}
          />
          <input className="hidden" name="csrfToken" defaultValue={csrfToken} />
        </Form>
      </div>
    </>
  );
}
