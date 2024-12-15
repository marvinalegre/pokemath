import type { Route } from "./+types/home";
import { Link, redirect, useLoaderData } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn, username } = await res.json();

  if (loggedIn) {
    return { username };
  }

  return redirect("/login");
};

export default function Home() {
  const { username } = useLoaderData();
  const [showMenu, setShowMenu] = useState(false);

  function handleMenuClick() {
    setShowMenu(!showMenu);
  }

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
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
        <div className="flex items-center justify-center h-[calc(100vh-2.25rem)] md:h-[70vh]">
          <Link to="catch">
            <div className="pokeball">
              <div className="pokeball-button"></div>
            </div>
          </Link>
        </div>
      )}
      {showMenu && (
        <ul className="text-xl">
          <MenuLink link={username} to={`/${username}`} />
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
