FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-audit --progress=false

COPY . .

# Default to the compose service host but allow overriding at build time for other runtimes.
ARG MONGO_HOST=mongodb
ENV MONGO_URI=mongodb://${MONGO_HOST}:27017/MiniCRM

RUN chown -R node:node /app
USER node

EXPOSE 5000

CMD ["npm", "start"]
