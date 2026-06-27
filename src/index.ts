import katex from 'katex';

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const url = new URL(request.url);
        switch (url.pathname.slice(4)) {
            case '/active-question':
                return new Response(`${katex.renderToString('10 + 10 = \\text{?}')}`, {
                    headers: { 'Content-Type': 'text/html' },
                });
            case '/random':
                return new Response(crypto.randomUUID());
            default:
                return new Response('Not Found', { status: 404 });
        }
    },
} satisfies ExportedHandler<Env>;
