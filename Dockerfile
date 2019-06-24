FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm run build

COPY . .

EXPOSE 8081
CMD [ "npm", "run", "server"]
