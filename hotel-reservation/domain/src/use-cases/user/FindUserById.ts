import { User } from "../../entities/User";
import { createNotFoundError } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";

export interface UserFindByIdDependencies {
  userRepository: UserRepository;
}

export interface UserFindByIdRequestModel {
  id: string;
}

export async function findUserById(
  { userRepository }: UserFindByIdDependencies,
  { id }: UserFindByIdRequestModel
): Promise<Partial<User>> {
  const user = await userRepository.findById(id);
  if (!user) throw createNotFoundError("User not found");
  return user;
}