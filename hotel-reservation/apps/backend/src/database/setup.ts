// Por ejemplo, aquí podrías configurar variables de entorno de prueba o conectar a una base de datos de prueba

// database.test.ts
import { DataTypes } from 'sequelize';
import sequelizeConnection from './connection';

const sequelize = sequelizeConnection;

export const queryInterface = sequelize.getQueryInterface();
export const DataTypesTest = DataTypes; // Exporta DataTypes para que pueda ser usado en el test
export const sequelizeInstance = sequelize;

// Opcional: una función para sincronizar el modelo (útil si también tienes modelos para probar)
export const syncDatabase = async () => {
  await sequelize.sync({ force: true }); // `force: true` para recrear las tablas en cada prueba
};

// Opcional: una función para cerrar la conexión de la base de datos
export const closeDatabase = async () => {
  await sequelize.close();
};