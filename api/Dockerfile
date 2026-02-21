FROM node:24 AS base
RUN mkdir /var/lib/pokemath
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

FROM base AS dev
CMD ["npm", "run", "start:dev"]

FROM base AS build
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY --from=build /usr/local/app/dist ./dist
CMD ["npm", "run", "start:prod"]
