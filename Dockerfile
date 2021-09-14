FROM node:14-slim

WORKDIR /bot

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "bot.js"]