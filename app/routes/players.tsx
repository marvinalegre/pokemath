import type { Route } from "./+types/players";
import { Link } from "react-router";
import { useState } from "react";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `PokéMath | ${params.username}` }];
}

export default function Players({ params }) {
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
        <ul className="py-8 text-xl flex flex-row flex-wrap justify-center items-center gap-4">
          <Player username="lucas" />
          <Player username="travis" />
          <Player username="miguel" />
        </ul>
      )}
      {showMenu && (
        <ul className="text-xl">
          <MenuLink link="user" to="/user" />
          <MenuLink link="log out" to="/logout" />
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

function Player({ username }) {
  return (
    <Link to={`/${username}`}>
      <li className="bg-white py-2 px-3 text-xl w-full">
        <h3>{username}</h3>
        <p className="text-sm space-x-4 mb-2">
          <span>
            <span className="text-gray-100 bg-[#4a4b4b] p-1 rounded-sm">
              dark
            </span>{" "}
            x 50
          </span>
          <span>
            <span className="text-gray-100 bg-[#316e73] p-1 rounded-sm">
              steel
            </span>{" "}
            x 50
          </span>{" "}
          <span>
            <span className="text-gray-100 bg-[#c3581e] p-1 rounded-sm">
              ground
            </span>{" "}
            x 50
          </span>
        </p>
      </li>
    </Link>
  );
}
