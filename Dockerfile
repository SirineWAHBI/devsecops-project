FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk update && apk upgrade --no-cache

COPY nginx-security.conf /etc/nginx/conf.d/security-headers.conf
COPY --from=build /app/dist/devsecops-project/browser /usr/share/nginx/html

EXPOSE 80
