import { User } from "../entities/User";
import { createInvalidDataError, InvalidDataError } from "../errors/error";
import { UserRepository } from "../repositories/UserRepository"

export interface UserRegisterDependencies {
    users: UserRepository;
}
export type UserRegisterRequestModel = Omit<User, 'id' | 'role'>;


export async function UserRegister(
    { users }: UserRegisterDependencies,
    { email, password, name }: UserRegisterRequestModel
): Promise<InvalidDataError | void> {

    const hasErrors = validateData(email, password, name);
    if (hasErrors) return hasErrors; 

    const existingUser = await users.findByEmail(email); 
    if (existingUser) return createInvalidDataError("Email already in use"); 

    // Create the user object
    const user: User = {
        id: crypto.randomUUID(), 
        email,
        password, 
        name,
        role: "guest" 
    };

    await users.save(user); 
}

// Validation function
function validateData(email: string, password: string, name: string): InvalidDataError | void {
    if (email.trim() === "") {
        return createInvalidDataError("Email must not be empty");
    }
    if (password.trim() === "") {
        return createInvalidDataError("Password must not be empty");
    }
    if (name.trim() === "") {
        return createInvalidDataError("Name must not be empty");
    }


}
