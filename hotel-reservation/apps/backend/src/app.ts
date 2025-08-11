FAIL  hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts [ hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts ]
Error: Cannot find module '../../../../domain/src/use-cases/reservation' imported from 'C:/Users/Familia/Desktop/domain-hotel/hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts' 
 ❯ hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts:4:1
      2| 
      3| // Ajustá la ruta relativa según tu estructura real:
      4| import {
       | ^
      5|   CreateReservation,
      6|   CancelReservation,
Caused by: Error: Failed to load url ../../../../domain/src/use-cases/reservation (resolved id: ../../../../domain/src/use-cases/reservation) in C:/Users/Familia/Desktop/domain-hotel/hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts. Does the file exist?
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-Bg4HVnP5.js:26447:33

Editar
This error indicates that the import path in your test file is incorrect. The module ../../../../domain/src/use-cases/reservation cannot be found from the location hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts.

Let's analyze the path structure and fix this:

Current import path breakdown:

From: apps/backend/src/tests/reservation/reservation.test.ts
Trying to reach: ../../../../domain/src/use-cases/reservation
This resolves to: domain/src/use-cases/reservation
To fix this, you need to:

Verify the actual file structure - Check if the file exists at the expected location:
hotel-reservation/
├── domain/
│   └── src/
│       └── use-cases/
│           └── reservation/
│               ├── index.ts (or)
│               ├── CreateReservation.ts
│               ├── CancelReservation.ts
│               └── ... other files
Check the exact file names and extensions - The import might be looking for:
reservation/index.ts
reservation.ts
Individual files like CreateReservation.ts, CancelReservation.ts
Possible solutions: Option A: If it's an index file:
typescript
import {
  CreateReservation,
  CancelReservation,
} from '../../../../domain/src/use-cases/reservation/index';
Option B: If they're separate files:
typescript
import { CreateReservation } from '../../../../domain/src/use-cases/reservation/CreateReservation';
import { CancelReservation } from '../../../../domain/src/use-cases/reservation/CancelReservation';
Option C: If the domain folder is at a different level:
typescript
// Try different relative paths:
import { ... } from '../../../domain/src/use-cases/reservation';
// or
import { ... } from '../../domain/src/use-cases/reservation';
Quick debugging steps:
Navigate to your test file location in the terminal
Use ls ../../../../domain/src/use-cases/ to see what actually exists there
Check if there's a reservation folder or reservation.ts file
Verify the exports in the target file match what you're trying to import
Alternative: Use absolute imports if your project supports them:
typescript
import { CreateReservation, CancelReservation } from '@domain/use-cases/reservation';
Can you check your actual folder structure and let me know what files exist in the domain/src/use-cases/ directory? This will help me provide a more specific solution.





❯ hotel-reservation/apps/backend/src/tests/reservation/reservation.test.ts:154:26
    152|     mockReservationRepo.findById.mockResolvedValue(null);
    153| 
    154|     const result = await GetReservationById({ reservationRepository: mockReservationRepo }…       |                          ^
    155| 
    156|     expect(result).toBeNull();

Editar
This error indicates that the GetReservationById function is being called incorrectly. Based on the error location and context, it seems like there's an issue with how you're invoking the use case.

Here are the most likely solutions:

Solution 1: Missing function call
The GetReservationById might be a function that returns another function (a factory pattern). Try this:

typescript
const result = await GetReservationById({ reservationRepository: mockReservationRepo })('some-reservation-id');
Solution 2: Direct function call with parameters
If GetReservationById expects both the repository and the ID as parameters:

typescript
const result = await GetReservationById(
  { reservationRepository: mockReservationRepo }, 
  'some-reservation-id'
);
Solution 3: Instantiate the use case first
If it's a class or needs to be instantiated:

typescript
const getReservationUseCase = new GetReservationById({ reservationRepository: mockReservationRepo });
const result = await getReservationUseCase.execute('some-reservation-id');
Solution 4: Check the use case signature
Look at your GetReservationById implementation to see what it expects. It might look like:

typescript
// If it's a factory function:
export const GetReservationById = (dependencies) => async (id) => {
  // implementation
};

// If it's a direct function:
export const GetReservationById = async (dependencies, id) => {
  // implementation
};

// If it's a class:
export class GetReservationById {
  constructor(dependencies) {}
  async execute(id) {
    // implementation
  }
}
Most likely fix based on common patterns:
typescript
// Around line 154, change from:
const result = await GetReservationById({ reservationRepository: mockReservationRepo }

// To:
const result = await GetReservationById({ reservationRepository: mockReservationRepo })('reservation-id-to-test');
Could you share:

How GetReservationById is implemented?
The complete line 154 and a few lines around it?
This will help me provide the exact fix you need.





Mientras UserController.ts inyecta las dependencias explícitamente (userService(), cryptoService()), reservationController.ts parece usar req.app.locals.dependencies para la inyección de repositorios, lo que introduce inconsistencia en la estrategia de inyección dentro del mismo backend.  analizar los controladores y adaptar reservationcontroller import { Request, Response } from "express";
import { createReservationService } from "../services/reservationServices";

export function createReservationController(reservationService: ReturnType<typeof createReservationService>) {
  return {
    createReservation: async (req: Request, res: Response) => {
      try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json(reservation);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    cancelReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.cancelReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    completeReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.completeReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    getReservationById: async (req: Request, res: Response) => {
      try {
        const reservation = await reservationService.getReservationById(req.params.id);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(reservation);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    getAllReservations: async (_req: Request, res: Response) => {
      try {
        const reservations = await reservationService.getAllReservations();
        res.json(reservations);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    deleteReservation: async (req: Request, res: Response) => {
      try {
        await reservationService.deleteReservation(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },
  };
}
import { Request, Response } from 'express';

export function createUserController(deps: {
  registerUserService: (data: any) => Promise<any>;
  loginUserService: (data: any) => Promise<any>;
  getAllUsersService: () => Promise<any[]>;
  getUserByIdService: (id: string) => Promise<any>;
  updateUserService: (data: any) => Promise<any>;
  deleteUserService: (id: string) => Promise<void>;
}) {
  const {
    registerUserService,
    loginUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
  } = deps;

  return {
    registerUser: async (req: Request, res: Response) => {
      try {
        const result = await registerUserService(req.body);
        if (result?.message) return res.status(400).json(result);
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
      }
    },

    loginUser: async (req: Request, res: Response) => {
      try {
        const tokenData = await loginUserService(req.body);
        res.json(tokenData);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    getAllUsers: async (_req: Request, res: Response) => {
      try {
        const users = await getAllUsersService();
        res.json(users);
      } catch (error: any) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
      }
    },

    getUserById: async (req: Request, res: Response) => {
      try {
        const user = await getUserByIdService(req.params.id);
        res.json(user);
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    updateUser: async (req: Request, res: Response) => {
      try {
        const updated = await updateUserService(req.body);
        res.json(updated);
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },

    deleteUser: async (req: Request, res: Response) => {
      try {
        await deleteUserService(req.params.id);
        res.status(204).send();
      } catch (error: any) {
        res.status(404).json({ message: error.message });
      }
    },
  };
}

Editar
Tienes razón, hay una inconsistencia clara en las estrategias de inyección de dependencias. Analicemos ambos controladores:

Análisis de la inconsistencia:
UserController (Patrón consistente):
✅ Recibe servicios ya configurados como parámetros
✅ Inyección explícita de dependencias
✅ No depende de req.app.locals
ReservationController (Necesita mejora):
✅ Ya implementado correctamente, similar a UserController
✅ Recibe reservationService ya configurado
❌ Pero hay inconsistencia en cómo se está instanciando en algún lugar
Solución: Estandarizar ReservationController
El reservationController.ts ya tiene la estructura correcta, pero necesitamos asegurar consistencia en la instanciación. Aquí está la versión mejorada:


Controladores Estandarizados
Código 
Beneficios de esta estandarización:
✅ Consistencia
Ambos controladores siguen el mismo patrón de factory function
Inyección explícita de dependencias
No dependen de req.app.locals
✅ Testabilidad
Fácil de mockear dependencias
Tests aislados y predecibles
No necesitas configurar req.app.locals en tests
✅ Mantenibilidad
Dependencias claras y explícitas
Fácil refactoring
Mejor IntelliSense/TypeScript support
Cambios clave aplicados:
ReservationController:
Cambié reservationService: ReturnType<typeof createReservationService> por un objeto de dependencias más explícito
Agregué destructuring consistente con UserController
UserController:
Mantenido tal como está (ya es consistente)
Agregué algunos return explícitos para mejor flujo
Instanciación:
Ejemplo de cómo instanciar ambos controladores de manera consistente
Eliminación completa de req.app.locals.dependencies
Para implementar:
Actualiza tu reservationController.ts con la versión del artifact
Modifica donde instancias los controladores para usar el patrón consistente
Elimina cualquier uso de req.app.locals.dependencies en favor de inyección explícita
¿Te gustaría que ajuste algún aspecto específico de esta estandarización?




import { Request, Response } from "express";
import { createRoomService } from "../services/roomServices";

export function createRoomController(roomService: ReturnType<typeof createRoomService>) {
  return {
    createRoom: async (req: Request, res: Response) => {
      try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(room);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    getAllRooms: async (_req: Request, res: Response) => {
      try {
        const rooms = await roomService.getAllRooms();
        res.json(rooms);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    getRoomById: async (req: Request, res: Response) => {
      try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },

    updateRoom: async (req: Request, res: Response) => {
      try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        res.json(room);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },

    deleteRoom: async (req: Request, res: Response) => {
      try {
        const success = await roomService.deleteRoom(req.params.id);
        if (!success) return res.status(404).json({ message: "Room not found" });
        res.status(204).send();
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
  };
}

Editar
Perfecto, aquí tienes el RoomController estandarizado para mantener consistencia con los otros controladores:


Controladores Estandarizados
Código ∙ Versión 2 
Cambios aplicados al RoomController:
✅ Estandarización completa
Patrón de dependencias consistente:
Cambié roomService: ReturnType<typeof createRoomService>
Por deps: { roomService: RoomService }
Agregué destructuring explícito const { roomService } = deps;
Returns explícitos:
Cambié if (!room) return res.status(404)...
Por if (!room) { return res.status(404)... }
Mismo tratamiento para deleteRoom
Consistencia visual:
Misma estructura que ReservationController y UserController
Manejo de errores unificado
Formato consistente de respuestas
Ahora tienes 3 controladores completamente consistentes:
🏗️ Patrón unificado:
typescript
export function createXController(deps: { service: XService }) {
  const { service } = deps;
  return { /* methods */ };
}
📦 Instanciación unificada:
typescript
const controller = createXController({ service: configuredService });
🧪 Testing unificado:
typescript
const mockService = { /* mocked methods */ };
const controller = createXController({ service: mockService });
Beneficios logrados:
✅ Eliminación de req.app.locals en todos los controladores
✅ Inyección explícita de dependencias
✅ Testabilidad mejorada
✅ Consistencia total en el codebase
✅ TypeScript support mejorado
✅ Maintainability aumentada
¿Necesitas ayuda con la implementación de estos cambios en tu proyecto o con la actualización de las rutas correspondientes?





import { Router, Request, Response } from 'express'; import { reservationController } from '../controllers/reservationController';  const router = Router();  // CRUD endpoints router.post('/', reservationController.create); router.get('/:id', reservationController.findById); router.put('/:id', reservationController.update); router.delete('/:id', reservationController.delete);  // Operaciones específicas de reservaciones router.put('/:id/complete', reservationController.complete); router.put('/:id/cancel', reservationController.cancel);  export default router;                            import { Router } from 'express';
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
} from '../controllers/roomController';

const router = Router();

router.post('/', createRoom);

router.get('/', getAllRooms);

router.get('/:id', getRoomById);

router.put('/:id', updateRoom);

router.delete('/:id', deleteRoom);

export default router;
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

Editar
Veo que hay inconsistencias en cómo se están importando y usando los controladores en las rutas. Necesitamos estandarizar las rutas para que funcionen con el patrón de factory functions que establecimos. Aquí está la solución:


Rutas Estandarizadas
Código 
Problemas identificados en las rutas actuales:
🔴 Inconsistencias encontradas:
ReservationRoutes:
Importa reservationController directamente (no factory)
Usa métodos que no existen (create, findById, update, delete)
RoomRoutes:
Importa funciones individuales en lugar del controlador
Desestructura métodos inexistentes
UserRoutes:
Mismo problema que RoomRoutes
Desestructura métodos directamente
Soluciones proporcionadas:
✅ Opción 1: Factory Functions completas (Recomendada)
Las rutas también son factories que reciben dependencias
Configuración completamente centralizada
Máxima testabilidad y flexibilidad
✅ Opción 2: Setup Functions simples (Más directa)
Las rutas reciben controladores ya configurados
Más simple de implementar
Mantiene la separación de responsabilidades
Pasos para implementar:
Si eliges Opción 1 (Factory Functions):
bash
# 1. Reemplaza tus archivos de rutas con las versiones factory
# 2. Modifica tu app.ts para usar setupRoutes()
# 3. Pasa los repositories centralizadamente
Si eliges Opción 2 (Setup Functions):
bash
# 1. Reemplaza tus archivos de rutas con las versiones setup
# 2. Configura controladores en app.ts 
# 3. Pasa controladores a las rutas
Corrección de nombres de métodos:
Tus rutas actuales usan:

reservationController.create → reservationController.createReservation
reservationController.findById → reservationController.getReservationById
reservationController.complete → reservationController.completeReservation
etc.
¿Cuál prefieres implementar?
Opción 1: Máxima consistencia con factory pattern
Opción 2: Más simple y directa
Una vez que elijas, puedo ayudarte con los detalles específicos de implementación y cualquier ajuste necesario.





import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Importa tus routers (debes tenerlos definidos)
import userRouter from './routes/userRoutes';
import roomRouter from './routes/roomRoutes';
import reservationRouter from './routes/reservationRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/reservations', reservationRouter);

// Ruta raíz (opcional)
app.get('/', (_req, res) => {
  res.send('API running...');
});

// Middleware para manejar rutas no definidas
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;

Editar
Veo el problema. Tu app.ts está importando directamente los routers, pero necesitamos integrar el patrón de dependency injection que establecimos. Aquí está la solución completa:


Configuración Completa de App con DI
Código 
Cambios clave implementados:
🔄 De importaciones estáticas a factory pattern:
ANTES:

typescript
import userRouter from './routes/userRoutes';
import roomRouter from './routes/roomRoutes';
import reservationRouter from './routes/reservationRoutes';
DESPUÉS:

typescript
import { createReservationRoutes } from './routes/reservationRoutes';
import { createRoomRoutes } from './routes/roomRoutes';
import { createUserRoutes } from './routes/userRoutes';
⚙️ Configuración de dependencias centralizada:
Repositorios → Servicios → Controladores → Rutas
Todo configurado en createApp()
Sin uso de req.app.locals o variables globales
📁 Dos enfoques proporcionados:
createApp(): Factory completo con rutas como factories
setupAppWithControllers(): Alternativa con setup functions
Para implementar esta solución:
Opción 1: Migración completa (Recomendada)
Reemplaza tu app.ts con la función createApp() del artifact
Actualiza tus rutas usando las factory functions del artifact anterior
Crea server.ts como punto de entrada
Ajusta las importaciones de repositorios según tu implementación
Opción 2: Migración gradual
Usa setupAppWithControllers() temporalmente
Mantén tus archivos de rutas actuales pero créales setup functions
Migra gradualmente a factory pattern completo
Archivos que necesitas ajustar:
bash
├── app.ts                 # ✅ Usar createApp() del artifact  
├── server.ts              # ✅ Nuevo archivo del artifact
├── routes/
│   ├── userRoutes.ts      # 🔄 Convertir a factory function
│   ├── roomRoutes.ts      # 🔄 Convertir a factory function
│   └── reservationRoutes.ts # 🔄 Convertir a factory function
└── repositories/          # ⚠️  Ajustar importaciones según tu BD
Beneficios inmediatos:
✅ Eliminación total de req.app.locals
✅ Testing mucho más fácil
✅ Dependency injection explícita
✅ Configuración centralizada
✅ TypeScript support completo
✅ Escalabilidad mejorada
¿Prefieres implementar la Opción 1 (migración completa) o la Opción 2 (gradual)? También necesito saber cómo tienes configurados tus repositorios para ajustar esas importaciones.





const reservationService = createReservationService(.reservationRepository);
  const roomService = createRoomService(repositories.roomRepository);

Editar
Veo el error de sintaxis. Hay un punto antes de reservationRepository que está causando el problema. Aquí está la corrección:


Configuración Completa de App con DI
Código ∙ Versión 2 
El error era simplemente un punto extra antes de reservationRepository. La línea correcta debe ser:

typescript
const reservationService = createReservationService(repositories.reservationRepository);
NO:

typescript
const reservationService = createReservationService(.reservationRepository); // ❌ Punto extra
Correcciones aplicadas:

✅ repositories.reservationRepository (correcto)
✅ repositories.roomRepository (ya estaba correcto)
Ahora la configuración de servicios debería funcionar correctamente. ¿Hay algún otro error de sintaxis que necesites que revise?








// app.ts - VERSIÓN CON DEPENDENCY INJECTION
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Importar factory functions en lugar de routers directos
import { createReservationRoutes } from './routes/reservationRoutes';
import { createRoomRoutes } from './routes/roomRoutes';
import { createUserRoutes } from './routes/userRoutes';

// Importar servicios
import { createReservationService } from './services/reservationServices';
import { createRoomService } from './services/roomServices';
import { userService } from './services/userServices';

// Importar repositorios (ajusta según tu implementación)
import { createReservationRepository } from './repositories/reservationRepository';
import { createRoomRepository } from './repositories/roomRepository';
import { createUserRepository } from './repositories/userRepository';

export function createApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // ===== CONFIGURACIÓN DE DEPENDENCIAS =====
  
  // 1. Configurar repositorios (ajusta según tu implementación de BD)
  const repositories = {
    reservationRepository: createReservationRepository(),
    roomRepository: createRoomRepository(),
    userRepository: createUserRepository()
  };

  // 2. Configurar servicios
  const reservationService = createReservationService(repositories.reservationRepository);
  const roomService = createRoomService(repositories.roomRepository);
  
  // 3. Configurar rutas con dependencias inyectadas
  const reservationRouter = createReservationRoutes({ reservationService });
  const roomRouter = createRoomRoutes({ roomService });
  const userRouter = createUserRoutes({
    registerUserService: userService(),
    loginUserService: userService(),
    getAllUsersService: userService(),
    getUserByIdService: userService(),
    updateUserService: userService(),
    deleteUserService: userService(),
  });

  // ===== MONTAR RUTAS =====
  app.use('/api/users', userRouter);
  app.use('/api/rooms', roomRouter);
  app.use('/api/reservations', reservationRouter);

  // Ruta raíz
  app.get('/', (_req, res) => {
    res.json({ 
      message: 'Hotel Reservation API running...',
      version: '1.0.0',
      endpoints: {
        users: '/api/users',
        rooms: '/api/rooms', 
        reservations: '/api/reservations'
      }
    });
  });

  // Middleware para manejar rutas no definidas
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
}