import { User } from "../../../../domain/src/entities/User";
import { UserRepository } from "../../../../domain/src/repositories/UserRepository";
import { CryptoRepository } from "../../../../domain/src/repositories/CryptoRepository";

export function createUserService(userRepo: UserRepository, crypto: CryptoRepository) {
  return {
    async findUsers(): Promise<Partial<User>[]> {
      return userRepo.findAll();
    },

    async findUserById(id: string): Promise<Partial<User> | null> {
      const user = await userRepo.findById(id);
      if (!user) throw new Error("User not found");
      return user;
    },

    async registerUser(userData: Omit<User, "id" | "role">): Promise<void> {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Invalid input data");
      }

      const existingUser = await userRepo.findByEmail(userData.email);
      if (existingUser) throw new Error("Email already in use");

      const hashedPassword = await crypto.hashPassword(userData.password);
      const id = await crypto.generateRandomToken();

      const newUser: User = {
        id,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: "guest",
      };

      await userRepo.register(newUser);
    },

    async updateUser(userToUpdate: User): Promise<Partial<User>> {
      const existingUser = await userRepo.findById(userToUpdate.id);
      if (!existingUser) throw new Error("User not found");
      return userRepo.update(userToUpdate) as Promise<Partial<User>>;
    },

    async deleteUser(id: string): Promise<void> {
      const user = await userRepo.findById(id);
      if (!user) throw new Error("User not found");
      const deleted = await userRepo.delete(id);
      if (!deleted) throw new Error("Failed to delete user");
    },
  };
}
