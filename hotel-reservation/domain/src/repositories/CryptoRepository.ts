import { User } from "../entities/User";

export interface CryptoRepository {
    generateNewID(): Promise<string>;
    hastPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateJWT(user: User): Promise<string>;
    validateToken(token: string): Promise<User>;
}