import { Hono } from 'hono';
import type { FC } from 'hono/jsx';
import { html } from 'hono/html';
import katex from 'katex';

const app = new Hono();

const Layout: FC = (props) => {
    return (
        <>
            {html`<!doctype html>`}
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>PokeMath</title>

                    <link rel="stylesheet" href="/css/base.css" />
                    <link rel="stylesheet" href="/css/components.css" />
                    <link rel="stylesheet" href="/css/home.css" />
                    <link rel="stylesheet" href="/vendor/katex/katex.css" />

                    <script defer src="/js/home.js"></script>
                    <script defer src="/vendor/the-fixi-project/fixi-0.9.4.js"></script>
                </head>

                <body>{props.children}</body>
            </html>
        </>
    );
};

const Home: FC = () => {
    return (
        <Layout>
            <nav>
                <a href="/">PokeMath</a>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user-icon lucide-user"
                >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </nav>

            <main>
                <form fx-action="/api/active-question" fx-method="post" fx-target="#question" fx-swap="innerHTML">
                    <div id="question"></div>

                    <input id="answer" name="answer" type="number" placeholder="Enter your answer" required autocomplete="off" autofocus />

                    <button type="submit">Submit</button>
                </form>
            </main>

            <footer>
                <a href="https://github.com/marvinalegre/pokemath" target="_blank" rel="noopener noreferrer">
                    source code
                </a>
            </footer>
        </Layout>
    );
};

app.get('/', (c) => {
    return c.html(<Home />);
});

app.get('/api/active-question', (c) => {
    return c.html(katex.renderToString(`${Math.floor(Math.random() * 10)} + ${Math.floor(Math.random() * 10)} = \\text{?}`));
});

export default app;
