FROM node:lts as build


WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY . .

RUN yarn run build

FROM node:lts


WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY --from=build /usr/app/dist ./

CMD [ "node", "." ]