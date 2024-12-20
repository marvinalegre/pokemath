import type { Route } from "./+types/user";
import { Form, Link, useLoaderData } from "react-router";
import { useState } from "react";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `PokéMath | ${params.username}` }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn, username } = await res.json();

  const res2 = await fetch("/api/auth/userpokemons");
  const { pinned, unpinned } = await res2.json();

  return { loggedIn, username, pinned, unpinned };
};

export default function User({ params }: Route.ComponentProps) {
  const { loggedIn, username, pinned, unpinned } = useLoaderData();
  const [showMenu, setShowMenu] = useState(false);
  const [showPokemons, setShowPokemons] = useState(true);
  const [showPokemonOptions, setShowPokemonOptions] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPinned, setIsPinned] = useState(false);

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  function handlePokemonClick(e) {
    if (e.target.getAttribute("data-pokemonid")) {
      setSelectedPokemon(e.target.getAttribute("data-pokemonid"));
    } else {
      setSelectedPokemon(null);
    }

    if (e.target.getAttribute("data-pinned")) {
      setIsPinned(true);
    } else {
      setIsPinned(false);
    }

    setShowPokemonOptions(!showPokemonOptions);
    setShowPokemons(!showPokemons);
  }

  function handleShowCardClick() {
    setShowCard(true);
    setShowPokemonOptions(false);
  }

  function handleCloseCardClick() {
    setShowCard(false);
    setShowPokemonOptions(true);
  }

  return (
    <>
      <nav className="sticky top-0 flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        {loggedIn && (
          <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
            <li>
              <button onClick={handleMenuClick} className="py-1 text-black">
                {showMenu ? "close menu" : "menu"}
              </button>
            </li>
          </ul>
        )}
        {!loggedIn && (
          <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
            <li>
              <Link to="/players" className="py-1 text-black">
                players
              </Link>
            </li>
          </ul>
        )}
      </nav>
      {!showMenu && (
        <>
          <p className="sticky top-9 bg-white p-2 text-xl">{params.username}</p>
          {showPokemons && (
            <>
              <div className="flex flex-row flex-wrap justify-center items-center max-w-[1400px] mx-auto gap-2">
                {pinned.map((p) => (
                  <img
                    data-userpokemonid={p.user_pokemon_ext_id}
                    data-pinned
                    data-pokemonid={p.pokemon_id}
                    key={p.user_pokemon_ext_id}
                    onClick={handlePokemonClick}
                    className={`w-40 md:w-48`}
                    src={`https://pokemons.pages.dev/sprites/pm${String(
                      p.pokemon_id
                    ).padStart(4, "0")}_00_00_00_big.png`}
                  />
                ))}
              </div>
              <div className="my-12 md:pb-12 flex flex-row flex-wrap justify-center items-center max-w-[1400px] mx-auto gap-1">
                {unpinned.map((p) => (
                  <img
                    data-userpokemonid={p.user_pokemon_ext_id}
                    data-pokemonid={p.pokemon_id}
                    key={p.user_pokemon_ext_id}
                    onClick={handlePokemonClick}
                    className={`w-28 md:w-32`}
                    src={`https://pokemons.pages.dev/sprites/pm${String(
                      p.pokemon_id
                    ).padStart(4, "0")}_00_00_00_big.png`}
                  />
                ))}
              </div>
            </>
          )}
          {showPokemonOptions && (
            <div className="md:mt-16 px-2 md:px-8">
              <img
                className={`w-56 mb-4 md:w-64 mx-auto`}
                src={`https://pokemons.pages.dev/sprites/pm${String(
                  selectedPokemon
                ).padStart(4, "0")}_00_00_00_big.png`}
              />
              <Form
                method="post"
                className="px-4 max-w-sm mx-auto space-y-4 md:px-8"
              >
                <button
                  type="button"
                  onClick={handleShowCardClick}
                  className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
                >
                  show card
                </button>
                {params.username === username && (
                  <>
                    <button
                      type="button"
                      className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
                    >
                      {isPinned ? "unpin" : "pin"}
                    </button>
                    <button
                      type="button"
                      className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
                    >
                      release
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={handlePokemonClick}
                  className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full"
                >
                  hide options
                </button>
              </Form>
            </div>
          )}
          {showCard && (
            <div className="flex items-center justify-center">
              <div
                onClick={handleCloseCardClick}
                className="mx-auto border-4 border-black my-8 md:my-16 w-80 bg-[#f9e1c4]"
              >
                <h3 className="text-3xl text-center my-3">Dragonite</h3>
                <img
                  src="https://pokemons.pages.dev/sugimori/149.png"
                  className="w-80 h-80"
                />
                <p className="m-6 text-justify">
                  An extremely rarely seen marine POKéMON. Its intelligence is
                  said to match that of humans.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {showMenu && (
        <ul className="text-xl">
          {params.username !== username && (
            <Link to={`/${username}`} onClick={handleMenuClick}>
              <li className="hover:bg-white p-2">{username}</li>
            </Link>
          )}
          <Link to="/players">
            <li className="hover:bg-white p-2">players</li>
          </Link>
          <Link to="/logout">
            <li className="hover:bg-white p-2">log out</li>
          </Link>
        </ul>
      )}
    </>
  );
}
