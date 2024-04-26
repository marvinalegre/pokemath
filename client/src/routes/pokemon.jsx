import { useLoaderData } from "react-router-dom";

export const loader = async (request) => {
  const res = await fetch(
    import.meta.env.VITE_BE_SERVER + `/pokemon/${request.params.id}`
  );
  const json = await res.json();

  if (json.user === "nonexistent") {
    return false;
  } else {
    return json;
  }
};

export default function Pokemon() {
  const pokemon = useLoaderData();

  return (
    <>
      <div
        className="card"
        style={{
          backgroundColor: pokemon.color,
          border: "2px solid black",
          marginTop: 10,
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "30px" }}>
          {pokemon.name}
        </h1>
        <img
          src={pokemon.imageurl}
          style={{ width: "90%", margin: "0 auto", display: "block" }}
        />
        <p style={{ width: "90%", margin: "15px auto", fontSize: "16px" }}>
          {pokemon.description}
        </p>
      </div>
    </>
  );
}
