import { useParams, useLoaderData, NavLink } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export const loader = async (request) => {
  const res = await fetch(
    import.meta.env.VITE_BE_SERVER + `/user/${request.params.username}`
  );
  const json = await res.json();

  if (json.user === "nonexistent") {
    return false;
  } else {
    return json;
  }
};

export default function UserPage() {
  const { username } = useParams();

  const pokemons = useLoaderData();

  return (
    <>
      <Header />

      {pokemons ? (
        <>
          <h3>/{username}</h3>
          <hr />
          {pokemons.length === 0 ? (
            <p>this user has no pokemon yet</p>
          ) : (
            pokemons.map((pokemon, i) => (
              <NavLink to={`/pokemon/${pokemon.pokemon_id}`} key={i}>
                <img src={pokemon.sprite} style={{ width: "90px" }} />
              </NavLink>
            ))
          )}
        </>
      ) : (
        <>
          <h3>/{username}</h3>
          <hr />
          <p>this user does not exist</p>
        </>
      )}

      <Footer />
    </>
  );
}
