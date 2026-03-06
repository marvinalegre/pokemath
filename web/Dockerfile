FROM node:24-trixie-slim AS base
RUN mkdir -p /app && chown node:node /app
WORKDIR /app
USER node

FROM base AS deps
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node . ./

FROM deps AS dev
ENV NEXT_PUBLIC_API_URL=http://localhost/api
ENV NODE_ENV=development
ENV INTERNAL_API_BASE_URL=http://pokemath-api:3000
CMD ["npm", "run", "dev"]

FROM deps AS build
ENV NEXT_PUBLIC_API_URL=https://pokemath.testingg.bid/api
RUN npm run build

FROM base AS final
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
CMD ["node", "server.js"]
