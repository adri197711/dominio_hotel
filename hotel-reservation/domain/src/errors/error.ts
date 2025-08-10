// Tipos de error permitidos
export type AppErrorType =
    | "InvalidData"
    | "NotFound"
    | "AlreadyRegistered"
    | "CredentialsError"
    | "MissingDataError"
    | "Unauthorized"
    | "InternalServerError";

// Interface base para todos los errores
export interface AppError {
    type: AppErrorType;
    message: string;
    httpStatus: number;
}

// Error específico: datos inválidos
export interface InvalidDataError extends AppError {
    type: "InvalidData";
    httpStatus: 400;
}

// ---- Factories de errores ----

// 400 Bad Request - Datos inválidos
export const createInvalidDataError = (message: string): InvalidDataError => ({
    type: "InvalidData",
    message,
    httpStatus: 400
});

// 404 Not Found
export const createNotFoundError = (message: string = "Recurso no encontrado"): AppError => ({
    type: "NotFound",
    message,
    httpStatus: 404
});

// 409 Conflict - Ya registrado
export const createAlreadyRegisteredError = (message: string = "Recurso ya registrado"): AppError => ({
    type: "AlreadyRegistered",
    message,
    httpStatus: 409
});

// 400 Bad Request - Credenciales incorrectas
export const createCredentialsError = (message: string = "Credenciales inválidas"): AppError => ({
    type: "CredentialsError",
    message,
    httpStatus: 400
});

// 400 Bad Request - Datos faltantes
export const createMissingDataError = (message: string = "Faltan datos requeridos"): AppError => ({
    type: "MissingDataError",
    message,
    httpStatus: 400
});

// 401 Unauthorized
export const createUnauthorizedError = (message: string = "No autorizado"): AppError => ({
    type: "Unauthorized",
    message,
    httpStatus: 401
});

// 500 Internal Server Error
export const createInternalServerError = (message: string = "Error interno del servidor"): AppError => ({
    type: "InternalServerError",
    message,
    httpStatus: 500
});
