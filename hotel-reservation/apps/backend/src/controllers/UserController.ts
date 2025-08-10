import { Request, Response } from 'express';
import { UserRegister, UserRegisterDependencies, UserRegisterRequestModel } from '../services/UserRegister';
import { createInMemoryUserRepository } from '../database/ImMemoryUserRepository';

const crypto = {
  async hashPassword(p: string) { return `hashed-${p}`; },
  async generateRandomToken() { return Math.random().toString(36).slice(2); },
};

const users = createInMemoryUserRepository();
const dependencies: UserRegisterDependencies = { users, crypto };

export async function registerUserController(req: Request, res: Response) {
  const { email, password, name } = req.body as UserRegisterRequestModel;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email must not be empty' });
  }

  const result = await UserRegister(dependencies, { email, password, name });

  if (result) {
    return res.status(400).json({ error: result.message });
  }

  res.status(201).json({ message: 'User registered successfully' });
}
