FROM node:15.9.0-buster-slim

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

CMD ["yarn", "dev"]