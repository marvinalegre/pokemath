import type { Route } from "./+types/signup";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { validateUsername } from "../utils/validateUsername";
import zxcvbn from "zxcvbn";
import { useState } from "react";
import classNames from "classnames";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Signup" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn } = await res.json();

  if (loggedIn) {
    return redirect("/");
  }

  return null;
};

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formData = await request.formData();
  const usernameValidation = validateUsername(String(formData.get("username")));
  if (usernameValidation !== "Username is valid.")
    return { err: usernameValidation };

  if (formData.get("password") !== formData.get("confirmPassword"))
    return { err: "The passwords do not match." };

  if (String(formData.get("password")).length < 8)
    return { err: "The password must contain a minimum of 8 characters." };

  if (String(formData.get("password")).length > 40)
    return { err: "The password must contain a maximum of 40 characters." };

  if (
    zxcvbn(formData.get("password")).crack_times_display
      .online_throttling_100_per_hour !== "centuries"
  )
    return {
      err: "The password is too weak. Please choose a stronger password.",
    };

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });
  const { err, success } = await res.json();
  if (err) return { err };
  if (success) return redirect("/");
};

export default function Signup() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const [passwordType, setPasswordType] = useState("password");

  const signupBtnClass = classNames({
    "px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full": true,
    "bg-black": !submitting,
    "bg-[#3f3f3f]": submitting,
  });

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
        <ul className="flex text-gray-300 space-x-8 ml-10 text-xl">
          <li>
            <Link to="/login" className="py-1 text-black">
              log in
            </Link>
          </li>
        </ul>
      </nav>

      <div className="h-36 flex justify-center justify-center items-center">
        {!submitting && actionData?.err && (
          <p className="text-md max-w-72 bg-[#ffa500] border-2 border-black border-solid p-2">
            {actionData.err}
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
            type={passwordType}
            placeholder="password"
            className="w-full p-2 border border-gray-400"
          />
          <input
            name="confirmPassword"
            type={passwordType}
            placeholder="confirm password"
            className="w-full p-2 border border-gray-400"
          />
          <input
            onClick={() => {
              if (passwordType === "password") {
                setPasswordType("text");
              } else {
                setPasswordType("password");
              }
            }}
            type="checkbox"
            id="show-passwords"
          />{" "}
          <label
            className="text-sm mt-4 cursor-pointer"
            htmlFor="show-passwords"
          >
            show passwords
          </label>
          <div className="mt-8 space-x-6 text-right">
            <button
              type="submit"
              disabled={submitting}
              className={signupBtnClass}
            >
              {submitting ? "signing up" : "sign up"}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
