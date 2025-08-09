import { User } from "../entities/User";

export interface CryptoRepository {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateJWT(user: User): Promise<string>;
    validateToken(token: string): Promise<User>;
    generateRandomToken(): Promise<string>;
}