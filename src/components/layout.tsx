import { Child } from "hono/jsx";

import { HtmlDocument } from "@/components/html-document";

interface Props {
  children: Child;
}

export const Layout = ({ children }: Props) => {
  return (
    <HtmlDocument>
      <html lang="en" data-theme="light">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>PokéMath</title>

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.grey.min.css"
          />
        </head>
        <body>{children}</body>
      </html>
    </HtmlDocument>
  );
};
