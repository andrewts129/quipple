FROM node:13.14 AS build

COPY . /app
WORKDIR /app

RUN npm install --unsafe-perm && npm run build

FROM node:13.14-alpine

COPY --from=build /app/client/build /client/build
COPY --from=build /app/server/package.json /app/server/package-lock.json /server/
COPY --from=build /app/server/dist /server/dist

WORKDIR /server

# Need build dependencies for sqlite
RUN apk add --update python make && npm install --only=production

EXPOSE 4000
CMD npm run start
