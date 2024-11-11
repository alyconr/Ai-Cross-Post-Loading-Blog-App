FROM node:20.2.0-alpine3.17
WORKDIR /usr/src/app
COPY package*.json ./
ADD package.json /usr/src/app/package.json
RUN npm install
COPY . .
CMD ["npm", "start"]