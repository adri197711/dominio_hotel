import { User } from '../entities/User';
import { AuthService } from '../services/AuthService';

export class RegisterUser {
  constructor(private authService: AuthService) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    return await this.authService.register(name, email, password);
  }
}
