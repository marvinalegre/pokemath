import type { Route } from "./+types/login";
import { Link, Form, redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Login" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn } = await res.json();

  if (loggedIn) {
    return redirect("/home");
  }

  return null;
};

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
              sign up
            </Link>
          </li>
        </ul>
      </nav>

      <div className="h-36 flex justify-center justify-center items-center">
        {false && (
          <p className="text-lg max-w-72 bg-[#ffa500] border-2 border-black border-solid p-2">
            Invalid username
          </p>
        )}
      </div>

      <div className="px-2 md:px-8">
        <Form method="post" className="px-4 max-w-sm mx-auto space-y-4 md:px-8">
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
          <div className="mt-8 space-x-6 text-right">
            <button
              type="submit"
              className="bg-black px-4 py-2 text-xl font-medium text-white hover:bg-gray-600 w-full"
            >
              log in
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
