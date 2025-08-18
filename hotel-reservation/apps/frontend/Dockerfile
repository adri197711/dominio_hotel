# Base
FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
COPY domain/package*.json ./domain/
COPY apps/frontend/package*.json ./apps/frontend/
RUN npm install

# Dev
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev", "--workspace", "apps/frontend", "--", "--host", "0.0.0.0"]

# Build (para producción)
FROM base AS build
COPY . .
RUN npm run build --workspace apps/frontend

# Nginx (prod)
FROM nginx:alpine AS nginx
COPY --from=build /usr/src/app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
