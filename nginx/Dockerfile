FROM node:20.2.0-alpine3.17 AS builder
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
RUN npm install
COPY ./Frontend/ .
RUN npm run build

FROM nginx:1.21.6-alpine AS runtime
ENV NGINX_PORT 80
ENV NGINX_HTTPS_PORT 443
ENV FORCE_HTTPS false
ENV BACKEND_API backend:9000
COPY ./nginx/certificates/ /var/certificates
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

