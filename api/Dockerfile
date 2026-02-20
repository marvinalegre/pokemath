FROM node:24 AS base
RUN mkdir /var/lib/pokemath
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

FROM base AS dev
CMD ["npm", "run", "start:dev"]

