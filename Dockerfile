FROM node:16 as base

WORKDIR /home/app/coupon

COPY package*.json ./

RUN npm install react-scripts -g
RUN npm install
RUN npm run types

COPY . .

FROM base as production

# Used in the package json file
ENV NODE_PATH=./build

RUN npm run client:start:production
