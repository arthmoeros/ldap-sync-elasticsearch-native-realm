FROM node:12-alpine

RUN apk add git --no-cache

COPY . .

RUN npm i

CMD npm start
