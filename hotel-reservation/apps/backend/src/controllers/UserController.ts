import { UserRegister, UserRegisterRequestModel } from "../../../../domain/src/use-cases/user/RegisterUser";
import { findUserById } from "../../../../domain/src/use-cases/user/FindUserById";
import { updateUser } from "../../../../domain/src/use-cases/user/UpdateUser";
import { deleteUser } from "../../../../domain/src/use-cases/user/DeleteUser";
import { Request, Response } from "express";
import { cryptoService } from "../services/crypto.service";
import { userService } from "../services/user.service";
import {
    createInvalidDataError, createInternalServerError
} from "../../../../domain/src/errors/error";

export function userController() {
    return {

        registerNewUser: async (req: Request, res: Response) => {
            try {
                const { email, password, name }: UserRegisterRequestModel = req.body;
                const user = await UserRegister(
                    {
                        users: userService(),
                        crypto: cryptoService()
                    },
                    { email, password, name });

                return res.status(200).json({
                    ok: true,
                    data: user,
                    message: "Usuario registrado con éxito"
                });
            } catch (e) {
                const error =
                    e instanceof
                        Error
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al registrar el usuario"
                        );
                return res.status(error.message).json({
                    ok: false,
                    message: error.message,
                });
            }
        },


        // Get user data
        findById: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const user = await findUserById({ userRepository: userService() }, { id });

                return res.status(200).json({
                    ok: true,
                    data: user,
                    message: "Perfil de usuario"
                });
            } catch (e) {
                const error =
                    e instanceof Error
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al obtener el perfil de usuario"
                        );
                return res.status(error.message).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
        // Get all users
        getAllUsers: async (req: Request, res: Response) => {
            try {
                const users = await userService().getAll();
                return res.status(200).json({
                    ok: true,
                    data: users.map(user => {
                        return {
                            ...user,
                            url: `${req.protocol}://${req.get('host')}/users/${user.id}`
                        }
                    }),
                    message: "Lista de usuarios"
                });
            } catch (e) {
                const error =
                    e instanceof
                        Error
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al obtener la lista de usuarios"
                        );
                return res.status(error.message).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
        getUserById: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const user = await findUserById(
                    { userRepository: userService() },
                    { id }
                );

                if (!user) {
                    return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
                }

                return res.status(200).json({ ok: true, data: user });
            } catch (e) {
                const error =
                    e instanceof
                        Error
                        ? e
                        : createInternalServerError("Error al obtener usuario");
                return res.status(error.message).json({ ok: false, message: error.message });
            }
        },

        updateUser: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const updatedUser = await updateUser(
                    { userRepository: userService() },
                    { id, ...req.body }
                );

                return res.status(200).json({
                    ok: true,
                    data: updatedUser,
                    message: "Usuario actualizado con éxito"
                });
            } catch (e) {
                const error =
                    e instanceof
                        Error
                        ? e
                        : createInternalServerError("Error al actualizar usuario");
                return res.status(error.message).json({ ok: false, message: error.message });
            }
        },


        deleteUser: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                await deleteUser({ userRepository: userService() }, { id });

                return res.status(200).json({
                    ok: true,
                    message: "Usuario eliminado con éxito"
                });
            } catch (e) {
                const error =
                    e instanceof Error
                        ? e
                        : createInternalServerError("Error al eliminar usuario");
                return res.status(error.message).json({ ok: false, message: error.message });
            }
        }
    };
}