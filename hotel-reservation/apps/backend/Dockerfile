# Dockerfile backend optimizado para monorepo
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json de la raíz y lockfile si existe
COPY package*.json ./

# Copiar package.json de los workspaces necesarios
COPY domain/package*.json ./domain/
COPY apps/backend/package*.json ./apps/backend/

# Instalar dependencias del monorepo
RUN npm install

# Copiar todo el código
COPY . .

# Comando por defecto para iniciar backend
CMD ["npm", "run", "dev", "--workspace", "apps/backend"]
