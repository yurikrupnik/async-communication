FROM node:16-alpine AS builder

WORKDIR /app

ENV NODE_ENV=$NODE_ENV
COPY ./dist .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install --production --force

CMD ["node", "main.js"]
