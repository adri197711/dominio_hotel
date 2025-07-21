# Hotel-Reservation-Domain

Este proyecto es un ejemplo de arquitectura limpia aplicada a un sistema de reservas de hotel, organizado como un monorepo con dos paquetes principales:

- `domain`: Contiene la lógica de negocio, entidades, repositorios, casos de uso y tests.
- `apps/backend`: Pensado para alojar la API u otros servicios conectados al dominio.

---

## Estructura

```
hotel-reservation-system/
├── apps/
│   └── backend/
├── domain/
│   ├── src/
│   │   ├── entities/
│   │   ├── repositories/
│   │   │   ├── interfaces/
│   │   │   └── mocks/
│   │   ├── services/
│   │   └── use-cases/
│   ├── tests/
│   ├── vitest.config.ts
│   └── tsconfig.json
├── package.json
├── tsconfig.base.json
```

---

## Scripts

Desde el directorio raíz:

```bash
npm install
npm run test
```

O desde el paquete `domain`:

```bash
cd domain
npm install
npm run test
```

---

## Pruebas

El proyecto utiliza **Vitest** con setup automatizado para inyectar repositorios in-memory.

- Las implementaciones in-memory se usan exclusivamente para pruebas y desarrollo local.

---

## Consideraciones

- El paquete `apps/backend` está vacío inicialmente, pensado para futuras integraciones con Express, Fastify, etc.
- La estructura favorece separación de responsabilidades: lógica de negocio independiente de frameworks.

---

## Requisitos

- Node.js 18+
- npm 9+ o pnpm 8+

---

## Créditos

Base creada con Clean Architecture y monorepo usando npm workspaces.
