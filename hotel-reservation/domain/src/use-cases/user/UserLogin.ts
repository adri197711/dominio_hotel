import { User } from "../../entities/User";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { UserRepository } from "../../repositories/UserRepository";
import { CryptoRepository } from "../../repositories/CryptoRepository";
import { TokenRepository } from "../../repositories/TokenRepository";

export interface UserLoginDependencies {
    users: UserRepository;
    crypto: CryptoRepository;
    tokens: TokenRepository; // Para generar JWT u otro tipo de token
}

export type UserLoginRequestModel = {
    email: string;
    password: string;
};

export type UserLoginResponseModel = {
    token: string;
    user: Omit<User, "password">;
};

export async function UserLogin(
    { users, crypto, tokens }: UserLoginDependencies,
    { email, password }: UserLoginRequestModel
): Promise<UserLoginResponseModel> {
validateLoginData(email, password);

    const existingUser = await users.findByEmail(email);
    if (!existingUser) {
      throw createInvalidDataError("Invalid email or password");
    }

    const isPasswordValid = await crypto.comparePasswords(password, existingUser.password);
    if (!isPasswordValid) {
    throw createInvalidDataError("Invalid email or password");
    }

    const token = await tokens.generateToken({
        id: existingUser.id,
        role: existingUser.role
    });

    return {
        token,
        user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role
        }
    };
}

function validateLoginData(email: string, password: string): InvalidDataError | void {
    if (!email.trim()) {
        return createInvalidDataError("Email must not be empty");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return createInvalidDataError("Invalid email format");
    }
    if (!password.trim()) {
        return createInvalidDataError("Password must not be empty");
    }
}
