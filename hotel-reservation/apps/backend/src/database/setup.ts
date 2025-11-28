import { sequelize } from './connection';
import { UserModel, RoleModel } from './models/user.models';

async function initDatabase() {
  try {
      await sequelize.sync({ alter: true }); 
     console.log('✅ Modelos sincronizados con la base de datos.');
    
      const rolesCount = await RoleModel.count();
    if (rolesCount === 0) {
      console.log('⏳ Base de datos vacía, creando datos iniciales...');

    // Crear roles iniciales
    const adminRole = await RoleModel.create({ name: 'admin' });
    const userRole = await RoleModel.create({ name: 'user' });

    // Crear usuarios iniciales
    await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password_admin', // ojo, la contraseña debería estar hasheada
      validated: true,
      locked: false,
      rolId: adminRole.id,
    });

    await UserModel.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'hashed_password_user',
      validated: true,
      locked: false,
      rolId: userRole.id,
    });

    console.log('Base de datos sincronizada y datos iniciales creados.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

initDatabase();
