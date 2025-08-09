import { CryptoRepository } from "../../repositories/CryptoRepository";
import { createUnauthorizedError, UnauthorizedError } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";

export interface UserLoginDependencies {
  userRepository: UserRepository;
  cryptoRepository : CryptoRepository
}

export interface UserLoginRequestModel {
  email: string;
  password: string;
}

export interface UserLoginResponseModel {
  token : string
}

export async function login(
  { userRepository, cryptoRepository }: UserLoginDependencies,
  { email, password }: UserLoginRequestModel
): Promise<UserLoginResponseModel | UnauthorizedError > {  
  const user = await userRepository.findByEmail(email);
  
  if(user){
    const isPasswordValid = await cryptoRepository.comparePassword(password, user.password);
    
    if(!isPasswordValid) throw createUnauthorizedError("Invalid credentials");
    return {
      token : await cryptoRepository.generateJWT(user)
    }
  }
  throw createUnauthorizedError("Invalid credentials");
}