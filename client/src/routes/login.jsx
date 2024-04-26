import { Form, redirect, useActionData } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export const action = async ({ request }) => {
  const formData = await request.formData();

  const res = await fetch(import.meta.env.VITE_BE_SERVER + "/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });
  const json = await res.json();

  if (json.success) {
    return redirect("/");
  } else {
    return true;
  }
};

export default function LoginPage() {
  const actionData = useActionData();

  return (
    <>
      <Header />

      {actionData && (
        <p className="error-message">Incorrect username or password</p>
      )}

      <Form method="post" action="/login">
        <label>username: </label>
        <input type="text" name="username" maxLength={15} minLength={3}></input>
        <br />
        <label>password: </label>
        <input
          type="password"
          name="password"
          maxLength={16}
          minLength={8}
        ></input>
        <br />
        <button type="submit" className="regular-button">
          Login
        </button>
      </Form>

      <hr />

      <p>Don't have an account? You can try this: guest, secretpassword.</p>

      <Footer />
    </>
  );
}
