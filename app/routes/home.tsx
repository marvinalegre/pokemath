import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath" }];
}

export default function Home() {
  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
          <li>
            <button className="py-1 text-black">menu</button>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-center h-[calc(100vh-2.25rem)] md:h-[70vh]">
        <Link to="catch">
          <div className="pokeball">
            <div className="pokeball-button"></div>
          </div>
        </Link>
      </div>
    </>
  );
}
