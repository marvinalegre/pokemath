FROM node:24 AS base
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

FROM base AS dev
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY --from=build /usr/local/app/public ./public
COPY --from=build /usr/local/app/.next/standalone ./
COPY --from=build /usr/local/app/.next/static ./.next/static
CMD ["node", "server.js"]
