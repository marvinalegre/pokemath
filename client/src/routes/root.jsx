import { Link, redirect, useLoaderData } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export const loader = async () => {
  const res = await fetch(import.meta.env.VITE_BE_SERVER + "/root", {
    credentials: "include",
  });
  const json = await res.json();

  if (json.loggedIn) {
    return json;
  } else {
    return redirect("/login");
  }
};

export default function Root() {
  const loaderData = useLoaderData();

  return (
    <>
      <Header />

      <Link to={"/question"} className="root-botton">
        Catch a pokemon
      </Link>
      <Link to={`/${loaderData.username}`} className="root-botton">
        Show my pokemons
      </Link>
      {loaderData.otherUsers.map((user) => (
        <Link
          key={user.username}
          to={`/${user.username}`}
          className="root-botton"
        >
          {user.username}
        </Link>
      ))}
      <Link to={"/logout"} className="root-botton">
        Logout
      </Link>

      <Footer />
    </>
  );
}
