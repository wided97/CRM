FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --no-audit --progress=false
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
