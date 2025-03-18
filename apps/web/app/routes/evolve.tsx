import Question from "../components/question.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import type { Route } from "./+types/evolve";
import { useEffect } from "react";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import classNames from "classnames";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Evolve" }];
}

export const clientLoader = async ({ params }) => {
  const responses = await Promise.all([
    fetch("/api/user"),
    fetch("/api/auth/catch"),
    fetch(`/api/auth/evolve/${params.extId}`),
  ]);

  const user = await responses[0].json();
  const { loggedIn } = user;
  if (!loggedIn) {
    return redirect("/login");
  }

  const evolveRes = await responses[2].json();
  const { unauthorized } = evolveRes;
  if (unauthorized) return redirect("/");

  const { questionCode, questionParameters } = await responses[1].json();
  const { pokemon } = evolveRes;
  pokemon.id = String(pokemon.id);
  return { questionCode, questionParameters, pokemon, username: user.username };
};

export const clientAction = async ({ request }) => {
  const formData = await request.formData();
  if (formData.get("answer").length > 20) return { err: "Wrong answer." };

  const res = await fetch("/api/auth/evolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer: formData.get("answer"),
      userPokemonId: formData.get("userpokemonid"),
    }),
  });

  const { err, evolved, username } = await res.json();
  if (evolved) return redirect(`/${username}`);
  else return { err };
};

export default function Evolve({ params }) {
  const actionData = useActionData();
  const { questionCode, questionParameters, pokemon, username } =
    useLoaderData();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const submitBtnClass = classNames({
    "px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full": true,
    "bg-black": !submitting,
    "bg-[#3f3f3f]": submitting,
  });

  useEffect(() => {
    document.getElementById("answer").value = "";
  }, [questionCode, questionParameters]);

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to={`/${username}`}>
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
      </nav>

      <div className="md:h-36 flex justify-center justify-center items-center">
        {actionData?.err && !submitting && (
          <p className="text-lg max-w-72 bg-[#ffa500] mt-8 -mb-4 border-2 border-black border-solid p-2">
            {actionData.err}
          </p>
        )}
        {actionData?.gotaway && !submitting && (
          <p className="text-lg max-w-72 bg-white mt-8 -mb-4 border-2 border-black border-solid p-2">
            The pokemon got away.
          </p>
        )}
      </div>

      <div className="my-12 px-2 md:px-8 overflow-hidden">
        <Form method="post" className="px-4 max-w-sm mx-auto space-y-4 md:px-8">
          <Question
            questionCode={questionCode}
            questionParameters={questionParameters}
          />
          <input
            className="hidden"
            name="userpokemonid"
            value={params.extId}
            readOnly
          />
          <input
            id="answer"
            name="answer"
            type="number"
            placeholder="answer"
            className="w-full p-2 border border-gray-400"
            autoFocus
            required
          />
          <div className="mt-8 space-x-6 text-right">
            <button type="submit" className={submitBtnClass}>
              {submitting ? "submitting" : "submit"}
            </button>
          </div>
        </Form>

        <img
          className={`w-56 h-56 mb-20 md:w-64 md:h-64 mx-auto mt-12`}
          src={`https://pokemons.pages.dev/sprites/pm${pokemon.id.padStart(
            4,
            "0"
          )}_00_00_00_big.png`}
        />
        <ProgressBar
          current={Number(pokemon.experience)}
          max={Number(pokemon.evolution_condition)}
        />
      </div>
    </>
  );
}
