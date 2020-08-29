FROM node:14-alpine

RUN apk add git --no-cache

COPY . .

RUN npm i

CMD node "./src/core.js"
