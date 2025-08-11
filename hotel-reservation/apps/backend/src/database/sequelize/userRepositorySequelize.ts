import { User } from "../../../../../domain/src/entities/User";
import { UserRepository } from "../../../../../domain/src/repositories/UserRepository";
import { UserModel } from "../../database/models/user.models";

export function createSequelizeUserRepository(): UserRepository {
  return {
    async findAll() {
      const users = await UserModel.findAll();
      return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
      }));
    },

    async findById(id: string) {
      const user = await UserModel.findByPk(id);
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      };
    },

    async findByEmail(email: string) {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      };
    },

    async register(user: User) {
      const newUser = await UserModel.create(user);
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };
    },

    async update(user: User) {
      const userToUpdate = await UserModel.findByPk(user.id);
      if (!userToUpdate) return null;
      await userToUpdate.update(user);
      return {
        id: userToUpdate.id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        password: userToUpdate.password,
        role: userToUpdate.role,
      };
    },

    async delete(id: string) {
      const userToDelete = await UserModel.findByPk(id);
      if (!userToDelete) return false;
      await userToDelete.destroy();
      return true;
    },
  };
}
