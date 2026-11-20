# PokéMath

> Built with Claude. [View the full conversation](https://claude.ai/share/e3d98e5c-798a-44eb-a2a7-46a72c6a47f9)

A Pokémon catching game that teaches arithmetic. Solve math problems to catch wild Pokémon, then build and organize your collection.

## How it works

- **Sign up and log in** with a username and password.
- **Solve a problem** on the Catch page. Harder problems can yield rarer Pokémon, and wrong answers lock you out for 20 seconds.
- **Keep or release** the Pokémon you catch. Some wild Pokémon escape before you can catch them.
- **Organize your collection** by dragging to reorder, and release Pokémon you no longer want.
- **Visit other players** to see their collections.

Problems are chosen using an Elo rating. Your rating and each problem's rating update after every answer, so you're matched with problems at about your level.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with React and TypeScript
- [MongoDB](https://www.mongodb.com/) for users, active problems, and caught Pokémon
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- [iron-session](https://github.com/vvo/iron-session) for encrypted cookie sessions
- [KaTeX](https://katex.org/) for math rendering
- [dnd-kit](https://dndkit.com/) for drag-and-drop reordering
- `mathforge`, a local library that generates problems and their answers
