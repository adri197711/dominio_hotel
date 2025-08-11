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