FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit
COPY . .
EXPOSE 5173
ENV HOST=0.0.0.0
CMD ["npm", "run", "build"]

