import { type Child } from "hono/jsx";

import { HtmlDocument } from "@/components/html-document";

interface Props {
  children: Child;
}

export const Layout = ({ children }: Props) => {
  return (
    <HtmlDocument>
      <html lang="en" data-theme="dark">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>PokéMath</title>

          <link rel="stylesheet" href="/vendor/pico.grey.min.css" />
          <link rel="stylesheet" href="/css/app.css" />

          <script defer src="/vendor/fixi-0.9.4.js"></script>
          <script defer src="/js/app.js"></script>
        </head>
        <body>{children}</body>
      </html>
    </HtmlDocument>
  );
};
