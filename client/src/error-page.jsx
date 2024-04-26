import { NavLink, useRouteError } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <Header />

      <h2>Oops!</h2>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>

      <Footer />
    </div>
  );
}
