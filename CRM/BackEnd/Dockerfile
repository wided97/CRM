FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV MONGO_URI=mongodb://host.docker.internal:27017/MiniCRM
CMD ["npm", "start"]
