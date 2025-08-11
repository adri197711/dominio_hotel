import { Router } from 'express';
import { createUserController } from '../controllers/userController';

export function createUserRoutes(deps: {
  registerUserService: (data: any) => Promise<any>;
  loginUserService: (data: any) => Promise<any>;
  getAllUsersService: () => Promise<any[]>;
  getUserByIdService: (id: string) => Promise<any>;
  updateUserService: (data: any) => Promise<any>;
  deleteUserService: (id: string) => Promise<void>;
}) {
  const router = Router();
  const userController = createUserController(deps);

  router.post('/register', userController.registerUser);
  router.post('/login', userController.loginUser);
  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);

  return router;
}
