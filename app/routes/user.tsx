import type { Route } from "./+types/user";
import { Link } from "react-router";
import { useState } from "react";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `PokéMath | ${params.username}` }];
}

export default function User({ params }) {
  const [showMenu, setShowMenu] = useState(false);

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }
  return (
    <>
      <nav className="sticky top-0 flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
          <li>
            <button onClick={handleMenuClick} className="py-1 text-black">
              {showMenu ? "close menu" : "menu"}
            </button>
          </li>
        </ul>
      </nav>
      {!showMenu && (
        <>
          <p className="sticky top-9 bg-white p-2 text-xl">{params.username}</p>
          <div className="flex flex-row flex-wrap justify-center items-center max-w-[1400px] mx-auto gap-2">
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0002_00_00_00_big.png"
            />
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0150_00_00_00_big.png"
            />
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0146_00_00_00_big.png"
            />
            <img
              className={`w-40 md:w-48`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
          </div>
          <div className="my-12 md:pb-12 flex flex-row flex-wrap justify-center items-center max-w-[1400px] mx-auto gap-1">
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0003_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0006_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
            <img
              className={`w-28 md:w-32`}
              src="https://pokemons.pages.dev/sprites/pm0001_00_00_00_big.png"
            />
          </div>
        </>
      )}
      {showMenu && (
        <ul className="text-xl">
          <MenuLink link="players" to="players" />{" "}
          <MenuLink link="log out" to="logout" />
        </ul>
      )}
    </>
  );
}

function MenuLink({ link, to }) {
  return (
    <Link to={to}>
      <li className="hover:bg-white p-2">{link}</li>
    </Link>
  );
}