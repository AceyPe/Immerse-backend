FROM node:current-alpine3.20

WORKDIR /calma-backend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 2226

CMD ["npm", "start"]
