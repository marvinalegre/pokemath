import type { Route } from "./+types/players";
import { Link, useLoaderData } from "react-router";
import type { FC } from "react";
import { useState } from "react";
// import classNames from "classnames";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `PokéMath | ${params.username}` }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn, username } = await res.json();

  const res2 = await fetch("/api/players");
  const { players } = await res2.json();

  return { loggedIn, username, players };
};

export default function Players() {
  const { loggedIn, username, players } = useLoaderData();
  const [showMenu, setShowMenu] = useState(false);
  // const players = [
  //   {
  //     username: "lucas",
  //     achievements: [
  //       {
  //         type: "normal",
  //         count: 9,
  //       },
  //       {
  //         type: "dark",
  //         count: 2,
  //       },
  //       {
  //         type: "fire",
  //         count: 2,
  //       },
  //     ],
  //   },
  //   {
  //     username: "travis",
  //     achievements: [
  //       {
  //         type: "water",
  //         count: 25,
  //       },
  //       {
  //         type: "dragon",
  //         count: 8,
  //       },
  //     ],
  //   },
  //   {
  //     username: "miguel",
  //     achievements: [
  //       {
  //         type: "bug",
  //         count: 1,
  //       },
  //     ],
  //   },
  // ];

  function handleMenuClick() {
    setShowMenu(!showMenu);
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
      </nav>
      {!showMenu && (
        <ul className="py-8 text-xl flex flex-row flex-wrap justify-center items-center gap-4">
          {players.map((p, i) => (
            <Player
              key={i}
              username={p.username}
              // achievements={p.achievements}
            />
          ))}
        </ul>
      )}
      {showMenu && (
        <ul className="text-xl">
          <Link to={`/${username}`}>
            <li className="hover:bg-white p-2">{username}</li>
          </Link>
          <Link to="/logout">
            <li className="hover:bg-white p-2">log out</li>
          </Link>
        </ul>
      )}
    </>
  );
}

interface PlayerProps {
  username: string;
  // achievements: { type: string; count: number }[];
}

const Player: FC<PlayerProps> = ({ username }) => {
  const darkColoredTypes = [
    "dark",
    "dragon",
    "fighting",
    "ghost",
    "grass",
    "ground",
    "normal",
    "steel",
    "water",
  ];

  return (
    <Link to={`/${username}`}>
      <li className="bg-white py-2 px-3 text-xl w-[300px]">
        <h3>{username}</h3>
        {/* <p className="text-sm space-x-4 mb-2">
          {achievements.map((a, i) => {
            const achievementClass = classNames({
              "p-1": true,
              "text-gray-100": darkColoredTypes.includes(a.type),
              "bg-[#8fbe32]": a.type === "bug",
              "bg-[#444949]": a.type === "dark",
              "bg-[#0f66b7]": a.type === "dragon",
              "bg-[#f8d129]": a.type === "electric",
              "bg-[#ed8ded]": a.type === "fairy",
              "bg-[#aa2343]": a.type === "fighting",
              "bg-[#ff995b]": a.type === "fire",
              "bg-[#87b7e1]": a.type === "flying",
              "bg-[#696dc3]": a.type === "ghost",
              "bg-[#30941a]": a.type === "grass",
              "bg-[#bc5728]": a.type === "ground",
              "bg-[#6dcec2]": a.type === "ice",
              "bg-[#888e9d]": a.type === "normal",
              "bg-[#b15fd9]": a.type === "poison",
              "bg-[#fe6a76]": a.type === "psychic",
              "bg-[#c8b588]": a.type === "rock",
              "bg-[#277175]": a.type === "steel",
              "bg-[#0fa3f0]": a.type === "water",
            });

            return (
              <span key={i}>
                <span className={achievementClass}>{a.type}</span> x {a.count}
              </span>
            );
          })}
        </p> */}
      </li>
    </Link>
  );
};
