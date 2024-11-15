FROM node:20-alpine 
WORKDIR /usr/src/app
COPY  Backend/package*.json ./
RUN npm install
COPY Backend/ .
CMD [ "node",  "app.js" ]

 
