FROM node:alpine


WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY . .

RUN yarn run build

FROM node:slim


WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn --forzen-lockfile

COPY --from=0 /usr/app/dist ./

CMD [ "node", "." ]