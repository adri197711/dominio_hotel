import { User } from "../../entities/User";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";
import { CryptoRepository } from "../../repositories/CryptoRepository";

export interface UserRegisterDependencies {
    users: UserRepository;
    crypto: CryptoRepository;
}

export type UserRegisterRequestModel = Omit<User, 'id' | 'role'>;

export async function UserRegister(
  { users, crypto }: UserRegisterDependencies,
  { email, password, name }: UserRegisterRequestModel
): Promise<InvalidDataError | void> {
  const validationError = validateData(email, password, name);
  if (validationError) return validationError;

  const existingUser = await users.findByEmail(email);
  if (existingUser) return createInvalidDataError("Email already in use");

  const hashedPassword = await crypto.hashPassword(password);
  const generatedId = await crypto.generateRandomToken();

  const user: User = {
    id: generatedId,
    email,
    password: hashedPassword,
    name,
    role: "guest",
  };

  await users.register(user);
  return; // void indicates success
}

function validateData(email: string, password: string, name: string): InvalidDataError | void {
  if (!email.trim()) return createInvalidDataError("Email must not be empty");
  if (!/\S+@\S+\.\S+/.test(email)) return createInvalidDataError("Invalid email format");
  if (!password.trim()) return createInvalidDataError("Password must not be empty");
  if (password.length < 6) return createInvalidDataError("Password must be at least 6 characters");
  if (!name.trim()) return createInvalidDataError("Name must not be empty");
}
