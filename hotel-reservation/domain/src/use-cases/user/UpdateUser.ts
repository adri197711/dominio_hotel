import { User } from "../../entities/User";
import { createNotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";

export interface UserUpdateDependencies {
  userRepository: UserRepository;
}

export interface UserUpdateRequestModel {
  userToUpdate: User;
}

export async function updateUser(
  { userRepository }: UserUpdateDependencies,
  { userToUpdate }: UserUpdateRequestModel
): Promise<Partial<User>> {
  const user = await userRepository.findById(userToUpdate.id);
  if (!user) throw createNotFoundError("User not found");
  const updatedUser = await userRepository.update(userToUpdate);
  return updatedUser;
}
