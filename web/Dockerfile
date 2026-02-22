FROM node:24-trixie-slim AS base
RUN mkdir -p /app && chown node:node /app
WORKDIR /app
USER node

FROM base AS deps
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node . ./

FROM deps AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM deps AS build
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
CMD ["node", "server.js"]
