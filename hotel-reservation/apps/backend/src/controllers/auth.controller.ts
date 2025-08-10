import { UserLogin } from "../../../../domain/src/use-cases/user/UserLogin";

import { Request, Response } from "express";
import { AppError  } from "../../../../domain/src/errors/error";
import { cryptoService } from "../services/crypto.service";
import { userService } from "../services/user.service";

export function authController() {

    return {
        login: async (req: Request, res: Response) => {

            const { email, password } = req.body;
            try {
                const resp = await UserLogin({
                    userRepository: userService(),
                    cryptoRepository: cryptoService()
                }, {
                    email,
                    password
                });                
                return res.status(200).json({
                    ok: true,
                    data: {
                        token: resp instanceof Error ? '' : resp.token
                    },
                    message: "Inicio de sesión exitoso"
                });
            } catch (e) {
                const error =
                    e instanceof AppError
                        ? e
                        : createInternalServerError(
                            "Ups, hubo un error al iniciar sesión"
                        );                    
                return res.status(error.httpStatus).json({
                    ok: false,
                    message: error.message,
                });
            }
        }
    };
};