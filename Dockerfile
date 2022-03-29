FROM node:14 as base

WORKDIR /home/app/coupon

ENV PATH /home/app/coupon/node_modules/.bin:$PATH

# COPY package*.json ./
COPY package.json ./

RUN npm install react-scripts -g
RUN npm install
RUN npm run types

COPY . .

FROM base as production

# Used in the package json file
ENV NODE_PATH=./build
CMD [ "npm", "run", "client:start:production" ]
# RUN npm run client:start:production

FROM base as staging

# Used in the package json file
ENV NODE_PATH=./build
CMD [ "npm", "run", "client:start:test" ]

# RUN npm run client:start:test
# "client:start:test": "npm run client:env:test && node -r dotenv/config ./node_modules/.bin/react-scripts start dotenv_config_path=$PWD/.env",
# RUN npm run client:env:test
# RUN pwd
# RUN node -r dotenv/config ./node_modules/.bin/react-scripts start dotenv_config_path=$PWD/.env
