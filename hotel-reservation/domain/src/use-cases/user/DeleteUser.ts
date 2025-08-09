import { createNotFoundError, /*NotFoundError*/ } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";

export interface DeleteUserDependencies {
  userRepository: UserRepository;
}

export interface DeleteUserRequestModel {
  id: string;
}

export async function deleteUser(
  { userRepository }: DeleteUserDependencies,
  { id }: DeleteUserRequestModel
): Promise<void > {
  const user = await userRepository.findById(id);
  if (!user) throw createNotFoundError("400 Bad Request");
  await userRepository.delete(id);
}