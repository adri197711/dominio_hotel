# Base
FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
COPY domain/package*.json ./domain/
COPY apps/backend/package*.json ./apps/backend/
RUN npm install

# Dev
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev", "--workspace", "apps/backend"]

# Prod
FROM base AS prod
COPY . .
RUN npm run build --workspace apps/backend
CMD ["node", "dist/apps/backend/main.js"]
