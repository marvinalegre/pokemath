import type { Route } from "./+types/login";
import { Link, Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Login" }];
}

export default function Login() {
  return (
    <>
      <nav className="flex justify-between items-center p-[10px_5px] relative h-9 text-black bg-[#c6c6c6] md:rounded-tl md:rounded-tr">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
          <li>
            <Link to="/signup" className="py-1 text-black">
              sign up
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-2 md:p-8 mt-[15vh] md:mt-[10vh]">
        <Form
          method="post"
          className="px-4 py-8 max-w-sm mx-auto bg-form-gray rounded-lg space-y-4 md:p-8"
        >
          <input
            autoComplete="off"
            name="username"
            minLength={3}
            maxLength={20}
            required
            placeholder="username"
            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            id="password"
            name="password"
            type="password"
            minLength={12}
            required
            placeholder="password"
            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <div className="mt-8 space-x-6 text-right">
            <button
              type="submit"
              className="rounded bg-[#333333] px-4 py-2 text-xl font-medium text-white hover:bg-sky-600 w-full"
            >
              log in
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
