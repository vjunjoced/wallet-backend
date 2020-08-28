FROM node:12-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production

#

FROM node:12-alpine
ARG NODE_ENV
WORKDIR /app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY ./dist ./
EXPOSE 3000
CMD [ "node", "main.js" ]