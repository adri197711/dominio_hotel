import { Dialect, Sequelize } from 'sequelize';
import env from '../env';

const {db : {name,username,password,host, dialect, port, storage, logging}} = env;

let sequelizeConnection: Sequelize = new Sequelize(name, username, password, {
  host,
  dialect: dialect as Dialect,
  port : +port,
  storage,
  logging: false
});

export default sequelizeConnection;