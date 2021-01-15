FROM node:15.5.0-alpine3.10 as base

WORKDIR /app

COPY package.json .

RUN yarn install --production=true


FROM base as dev

RUN yarn install --dev-dependencies

CMD ["yarn", "dev"]


FROM dev as build

COPY . .

RUN yarn build


FROM node:15.5.0-alpine3.10 as prod

ENV NODE_ENV production

COPY --from=build /app .

CMD ["yarn", "start"]