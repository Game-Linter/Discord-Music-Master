FROM node:19-slim AS build

LABEL MAINTAINER="Mohamed Belkamel <belkamelmohamed@gmail.com>"

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY . .

RUN yarn run build

FROM node:19-slim


WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY --from=build /usr/app/dist ./dist

CMD [ "node", "." ]
