FROM node:24-trixie-slim AS base
RUN mkdir -p /var/lib/pokemath && chown -R node:node /var/lib/pokemath
RUN mkdir -p /app && chown node:node /app
WORKDIR /app

FROM base AS build
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build

FROM build AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

FROM base AS final
ENV NODE_ENV=production
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build --chown=node:node /app/dist ./dist
CMD ["node", "dist/main.js"]
