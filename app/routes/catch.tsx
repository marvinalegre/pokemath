import Question from "../components/question.tsx";
import { useState } from "react";
import type { Route } from "./+types/catch";
import { Link, Form, redirect, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Catch" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn } = await res.json();

  if (!loggedIn) {
    return redirect("/login");
  }

  // TODO: consider using Promise.all
  const res2 = await fetch("/api/auth/catch");
  const { questionCode, questionParameters } = await res2.json();

  return { questionCode, questionParameters };
};

export default function Catch() {
  const { questionCode, questionParameters } = useLoaderData();
  const [showQuestion, setShowQuestion] = useState(true);
  const [showNewPokemon, setShowNewPokemon] = useState(false);
  const [showGotAwayMessage, setShowGotAwayMessage] = useState(false);

  function handleSubmit() {
    const caughtSomething = Math.round(Math.random() * 10) % 2 === 1;

    if (caughtSomething) {
      setShowQuestion(false);
      setShowNewPokemon(true);
    } else {
      setShowQuestion(false);
      setShowGotAwayMessage(true);
    }
  }

  function handleOptionClick() {
    setShowQuestion(true);
    setShowNewPokemon(false);
  }

  function handleOkClick() {
    setShowQuestion(true);
    setShowGotAwayMessage(false);
  }

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
      </nav>
      {showQuestion && (
        <div className="md:h-36 flex justify-center justify-center items-center">
          {false && (
            <p className="text-lg max-w-72 bg-[#ffa500] mt-8 -mb-4 border-2 border-black border-solid p-2">
              Wrong answer.
            </p>
          )}
        </div>
      )}

      <div className="my-12 px-2 md:px-8">
        {showQuestion && (
          <Form
            method="post"
            className="px-4 max-w-sm mx-auto space-y-4 md:px-8"
          >
            <Question
              questionCode={questionCode}
              questionParameters={questionParameters}
            />
            <input
              name="answer"
              type="number"
              placeholder="answer"
              className="w-full p-2 border border-gray-400"
            />
            <div className="mt-8 space-x-6 text-right">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
              >
                submit
              </button>
            </div>
          </Form>
        )}
        {showGotAwayMessage && (
          <div className="md:mt-16 px-2 md:px-8">
            <div className="h-56 mb-4  md:h-64 flex justify-center justify-center items-center">
              <p className="text-lg max-w-72 bg-white border-2 border-black border-solid p-2">
                The pokemon got away.
              </p>
            </div>
            <Form
              method="post"
              className="px-4 max-w-sm mx-auto space-y-4 md:px-8"
            >
              <button
                type="button"
                onClick={handleOkClick}
                className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
              >
                ok
              </button>
            </Form>
          </div>
        )}
        {showNewPokemon && (
          <div className="md:mt-16 px-2 md:px-8">
            <img
              className={`w-56 h-56 mb-4 md:w-64 md:h-64 mx-auto`}
              src={`https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png`}
            />
            <Form
              method="post"
              className="px-4 max-w-sm mx-auto space-y-4 md:px-8"
            >
              <button
                type="button"
                onClick={handleOptionClick}
                className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
              >
                keep
              </button>
              <button
                type="button"
                onClick={handleOptionClick}
                className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
              >
                release
              </button>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
