import type { Route } from "./+types/signup";
import { Link, Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Signup" }];
}

export default function Login() {
  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
          <li>
            <Link to="/signup" className="py-1 text-black">
              log in
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-2 md:p-8 mt-[15vh] md:mt-[10vh]">
        <Form
          method="post"
          className="px-4 py-8 max-w-sm mx-auto space-y-4 md:p-8"
        >
          <input
            name="username"
            placeholder="username"
            className="w-full p-2 border border-gray-400"
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            className="w-full p-2 border border-gray-400"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="confirm password"
            className="w-full p-2 border border-gray-400"
          />
          <div className="mt-8 space-x-6 text-right">
            <button
              type="submit"
              className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
            >
              sign up
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
