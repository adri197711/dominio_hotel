FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY domain/package*.json ./domain/
COPY apps/backend/package*.json ./apps/backend/

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--workspace", "apps/backend"]
