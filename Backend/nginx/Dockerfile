FROM node:20.2.0-alpine3.17 as builder
WORKDIR /usr/src/app
COPY Frontend/package*.json ./
ADD Frontend/package.json /usr/src/app/package.json
RUN npm install
COPY Frontend/ .
RUN npm run build


FROM nginx:alpine as runner
ENV NGINX_PORT 80
ENV NGINX_HTTPS_PORT 443
ENV FORCE_HTTPS false
ENV BACKEND_API http://host.docker.internal:5000
COPY ./nginx/default.conf.template /etc/nginx/templates
COPY ./nginx/certificates /var/certificates
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

