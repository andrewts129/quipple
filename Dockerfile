FROM node:13.14 AS build

COPY . /app
WORKDIR /app

RUN npm install --unsafe-perm && npm run build

FROM node:13.14-alpine

COPY --from=build /app/client/build /client/build
COPY --from=build /app/server/package.json /app/server/package-lock.json /server/
COPY --from=build /app/server/dist /server/dist

WORKDIR /server

# Need sqlite build dependencies because the binary sometimes fails to fetch
RUN apk add --update make python g++ && npm install --unsafe-perm --only=production && apk del make python g++

EXPOSE 4000
CMD npm run start
