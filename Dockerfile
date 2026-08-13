FROM node:20.20.2-alpine3.23

WORKDIR /app

RUN apk add --no-cache \
    curl \
    unzip \
    ca-certificates \
    less \
    aws-cli

RUN npm install -g npm@11.6.4

COPY package.json ./

RUN npm install

COPY ./app ./

EXPOSE 3000

CMD ["npm", "start"]
