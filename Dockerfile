FROM node:alpine

WORKDIR /src

# Install app dependencies
COPY package.json .
RUN yarn install && yarn cache clean --force && rm -Rf ~/.cache /tmp/*

COPY . .

CMD ["yarn", "start"]