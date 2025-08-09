
import { User } from "../../entities/User";
import { createNotFoundError} from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";

export interface FindUsersDependencies {
  userRepository: UserRepository;
}

export async function findUsers(
  { userRepository }: FindUsersDependencies,
): Promise<Partial<User>[] > {
  const users = await userRepository.findAll();
  return users;
}