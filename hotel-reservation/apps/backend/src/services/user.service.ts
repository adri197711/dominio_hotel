import { User, UserRole } from "../../../../domain/src/entities/User";
import { User } from '../database/models/user.models'

import { UserRepository } from "../../../../domain/src/repositories/UserRepository";
import { createNotFoundError } from "../../../../domain/src/errors/error";

export function userService(): UserRepository {
    const _mapToUserResponseDto = (user: UserModel): Partial<User> => {
        
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role : user.role?.name as UserRole
        };
    };
    return {
        findAll : async function() {
            const users = await UserModel.findAll({
                include : ['role']
            });
            return users.map(_mapToUserResponseDto);
        },
        findByEmail: async function (email: string) {
            const user = await UserModel.findOne({
                where: { email },
                include : ['role']
            });

            return user ? {
                id : user.id.toString(),
                name : user.name,
                email : user.email,
                role : user.role.name as UserRole,
                password : user.password,
                validated : user.validated,
                locked : user.locked,
            } : null ;
        },
        findById: async function (id: string) {
            const user = await UserModel.findByPk(id,{
                include : ['role']
            });
            if (!user)
                throw createNotFoundError(
                    "No existe un usuario con el ID " + id
                );
            return _mapToUserResponseDto(user);
        },
        create: async function (user: Pick<User, "name" | "email" | "password" | "role">) {
            
            const role = await RoleModel.findOne({
                where : {
                    name : user.role
                }
            });
            const dataUser = {
                ...user,
                rolId : role?.id as number,
            }            
            const newUser = await UserModel.create(dataUser);
            
            return _mapToUserResponseDto(await newUser.reload({
                include : ['role']
            }));
        },
        update: async function (user: User) {
            const userToUpdate = await UserModel.findByPk(user.id);
            if (!userToUpdate)
                throw createNotFoundError(
                    "No existe un usuario con el ID " + user.id
                );
            userToUpdate.update(user);
            const userUpdated = await userToUpdate.save();
            return _mapToUserResponseDto(userUpdated);
        },
        delete: async function (id: string) {
            const userToDelete = await UserModel.findByPk(id);
            if (!userToDelete) {
                throw createNotFoundError(
                    "No existe un usuario con el ID " + id
                );
            }
            await userToDelete.destroy();
        },
    }
}