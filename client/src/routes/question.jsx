import { Form, redirect, useActionData, useLoaderData } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export const loader = async () => {
  const res = await fetch(import.meta.env.VITE_BE_SERVER + "/question", {
    credentials: "include",
  });
  const json = await res.json();

  if (json.loggedIn) {
    return json;
  } else {
    return redirect("/login");
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  const res = await fetch(import.meta.env.VITE_BE_SERVER + "/question", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      answer: formData.get("answer"),
    }),
  });
  const json = await res.json();

  if (json.caught) {
    return redirect(`/${json.username}`);
  } else if (json.gotaway) {
    return redirect("/gotaway");
  } else {
    return {
      wrong: true,
    };
  }
};

export default function QuestionPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  const dots = [];
  if (loaderData.count) {
    const maxDotsPerRow = 5;
    const pad =
      Number(loaderData.count) % maxDotsPerRow === 0
        ? 0
        : maxDotsPerRow - (Number(loaderData.count) % maxDotsPerRow);
    for (let i = 0; i < loaderData.count; i++) {
      dots.push(1);
    }
    for (let i = 0; i < pad; i++) {
      dots.push(0);
    }
  }

  return (
    <>
      <Header />

      {actionData && <p className="error-message">Wrong answer</p>}

      <p>{loaderData.question}</p>

      {loaderData.count && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            maxWidth: 180,
            margin: "0 auto",
            padding: "20px 10px",
            border: "1px solid black",
          }}
        >
          {dots.map((dot, i) => (
            <div
              key={i}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: dot === 1 ? "black" : "#e4e4e4",
              }}
            ></div>
          ))}
        </div>
      )}

      <Form action="/question" method="post" style={{ marginTop: 20 }}>
        <input maxLength={20} name="answer"></input>
        <button type="submit" className="regular-button">
          Submit
        </button>
      </Form>

      <Footer />
    </>
  );
}
