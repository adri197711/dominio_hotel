FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY domain/package*.json ./domain/
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--workspace", "apps/frontend"]
