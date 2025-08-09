import { userCreate } from "@domain/use-cases/RegisterUser";
import { userService } from "@services/user.service";

import { cryptoService } from "@services/crypto.service";
import { AppError, createInternalServerError } from "@domain/errors/AppError";
import { findUserById } from "@domain/use-cases/FindUserById";

export function userController() {
    return {
        // Register new user
        registerNewUser: async (req: Request, res: Response) => {
            try {
                const { email, password, name, surname, role }: UserCreateRequestModel = req.body;

                const user = await userCreate(
                    {
                        userRepository: userService(),
                        cryptoRepository: cryptoService()
                    },
                    { email, password, name, surname, role }
                );

                return res.status(200).json({
                    ok: true,
                    data: user,
                    message: "Usuario registrado con éxito"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al registrar el usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },

        // Get user data
        getUserById: async (req: Request, res: Response) => {
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
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al obtener el perfil de usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },

        // Get all users
        getAllUsers: async (req: Request, res: Response) => {
            try {
                const users = await userService().findAll();

                return res.status(200).json({
                    ok: true,
                    data: users.map(user => ({
                        ...user,
                        url: `${req.protocol}://${req.get('host')}/users/${user.id}`
                    })),
                    message: "Lista de usuarios"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al obtener la lista de usuarios"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },

        // Update user
        updateUser: async (req: Request, res: Response) => {
            try {
                return res.status(200).json({
                    ok: true,
                    data: null,
                    message: "Usuario actualizado con éxito"
                });
            } catch (e) {
                console.log(e);

                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al actualizar el usuario"
                        );
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },

        // Delete user
        deleteUser: async (req: Request, res: Response) => {
            try {
                return res.status(200).json({
                    ok: true,
                    message: "Usuario eliminado con éxito"
                });
            } catch (e) {
                const error =
                    createInternalServerError(
                        "Ups, hubo un error al eliminar el usuario"
                    ) || e;
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        },
    };
}
