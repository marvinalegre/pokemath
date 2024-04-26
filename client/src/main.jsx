import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root, { loader as rootLoader } from "./routes/root";
import GotAwayPage from "./routes/gotaway";
import LoginPage, { action as loginAction } from "./routes/login";
import UserPage, { loader as userLoader } from "./routes/user-page";
import Pokemon, { loader as pokemonLoader } from "./routes/pokemon";
import QuestionPage, {
  loader as questionLoader,
  action as questionAction,
} from "./routes/question";
import LogoutPage, { loader as logoutLoader } from "./routes/logout";
import ErrorPage from "./error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:username",
    element: <UserPage />,
    loader: userLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/pokemon/:id",
    element: <Pokemon />,
    loader: pokemonLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/question",
    element: <QuestionPage />,
    loader: questionLoader,
    action: questionAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gotaway",
    element: <GotAwayPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
    loader: logoutLoader,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
