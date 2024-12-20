import Question from "../components/question.tsx";
import type { Route } from "./+types/catch";
import { useEffect } from "react";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import classNames from "classnames";

export function meta({}: Route.MetaArgs) {
  return [{ title: "PokéMath | Catch" }];
}

export const clientLoader = async () => {
  const res = await fetch("/api/user");
  const { loggedIn } = await res.json();

  if (!loggedIn) {
    return redirect("/login");
  }

  // TODO: consider using Promise.all
  const res2 = await fetch("/api/auth/catch");
  const { questionCode, questionParameters } = await res2.json();

  return { questionCode, questionParameters };
};

export const clientAction = async ({ request }) => {
  const formData = await request.formData();
  if (formData.get("answer").length > 20) return { err: "Wrong answer." };

  const res = await fetch("/api/auth/catch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer: formData.get("answer"),
    }),
  });
  const { err, caught, gotaway } = await res.json();
  if (caught) return redirect("/catch/latest");
  else return { err, gotaway };
};

export default function Catch() {
  const actionData = useActionData();
  const { questionCode, questionParameters } = useLoaderData();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const submitBtnClass = classNames({
    "px-4 py-2 text-xl font-medium text-white hover:bg-[#3f3f3f] w-full": true,
    "bg-black": !submitting,
    "bg-[#3f3f3f]": submitting,
  });

  useEffect(() => {
    document.getElementById("answer").value = "";
  }, [questionCode, questionParameters]);

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-1 relative h-9 text-black bg-gray-400">
        <Link to="/">
          <div className="font-semibold text-3xl italic">PokéMath</div>
        </Link>
      </nav>

      <div className="md:h-36 flex justify-center justify-center items-center">
        {actionData?.err && (
          <p className="text-lg max-w-72 bg-[#ffa500] mt-8 -mb-4 border-2 border-black border-solid p-2">
            {actionData.err}
          </p>
        )}
        {actionData?.gotaway && (
          <p className="text-lg max-w-72 bg-white mt-8 -mb-4 border-2 border-black border-solid p-2">
            The pokemon got away.
          </p>
        )}
      </div>

      <div className="my-12 px-2 md:px-8">
        <Form method="post" className="px-4 max-w-sm mx-auto space-y-4 md:px-8">
          <Question
            questionCode={questionCode}
            questionParameters={questionParameters}
          />
          <input
            id="answer"
            name="answer"
            type="number"
            placeholder="answer"
            className="w-full p-2 border border-gray-400"
            required
          />
          <div className="mt-8 space-x-6 text-right">
            <button type="submit" className={submitBtnClass}>
              {submitting ? "submitting" : "submit"}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
