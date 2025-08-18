# Dockerfile frontend optimizado para monorepo
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar package.json de la raíz y lockfile si existe
COPY package*.json ./

# Copiar package.json de los workspaces necesarios
COPY domain/package*.json ./domain/
COPY apps/frontend/package*.json ./apps/frontend/

# Instalar dependencias del monorepo
RUN npm install

# Copiar todo el código
COPY . .

# Comando por defecto para iniciar frontend
CMD ["npm", "run", "dev", "--workspace", "apps/frontend"]
