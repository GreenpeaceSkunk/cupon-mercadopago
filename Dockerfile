FROM node:16 as base

WORKDIR /home/app/coupon

ENV PATH /home/app/coupon/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install react-scripts -g
RUN npm install
RUN npm run types

COPY . .

RUN pwd
RUN ls -la .

FROM base as production

# Used in the package json file
ENV NODE_PATH=./build

RUN npm run client:start:production
