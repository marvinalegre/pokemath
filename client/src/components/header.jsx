import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Link to={"/"}>
        <h1>PokéMath</h1>
      </Link>
      <hr />
    </>
  );
}
