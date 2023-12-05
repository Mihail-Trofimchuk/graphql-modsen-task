FROM node:18-alpine

WORKDIR /usr/src/app/apps/account

COPY ../../package.json ../../package-lock.json ./
RUN npm install
ADD . .

RUN npm run build api-gateway

