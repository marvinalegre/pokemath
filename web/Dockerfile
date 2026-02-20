FROM node:24 AS base
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./

FROM base AS dev
CMD ["npm", "run", "dev"]
