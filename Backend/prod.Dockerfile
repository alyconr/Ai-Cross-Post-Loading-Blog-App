FROM node:20.2.0-alpine3.17 as builder
WORKDIR /usr/src/app
COPY package*.json ./
ADD package.json /usr/src/app/package.json
RUN npm install
COPY . .
RUN npm run build

 
FROM node:20.2.0-alpine3.17 as runner
WORKDIR /usr/src/app
COPY package*.json ./
ADD package.json /usr/src/app/package.json
RUN npm install
COPY  --from=builder /usr/src/app/build ./build
CMD ["npm", "start"]