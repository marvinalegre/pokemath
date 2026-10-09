import { html } from "hono/html";
import { PropsWithChildren } from "hono/jsx";

export const HtmlDocument = ({ children }: PropsWithChildren) => {
  return html`<!doctype html>${children}`;
};
