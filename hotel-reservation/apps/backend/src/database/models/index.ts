// src/database/models/index.ts
import { UserModel, RoleModel } from './user.models';

// Definir asociaciones
UserModel.belongsTo(RoleModel, { as: 'role', foreignKey: 'rolId' });
RoleModel.hasMany(UserModel, { as: 'users', foreignKey: 'rolId' });

// Exportar todos los modelos para un fácil acceso desde otros archivos
export { UserModel, RoleModel };