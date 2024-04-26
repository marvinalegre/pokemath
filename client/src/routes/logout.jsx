import { redirect, useLoaderData } from "react-router-dom";
import Header from "../components/header";

export const loader = async () => {
  const res = await fetch(import.meta.env.VITE_BE_SERVER + "/logout", {
    credentials: "include",
  });
  const json = await res.json();

  if (json.success) {
    return redirect("/login");
  } else {
    return redirect("/");
  }
};

export default function LogoutPage() {
  return (
    <>
      <Header />

      <p>Logging out...</p>
    </>
  );
}
