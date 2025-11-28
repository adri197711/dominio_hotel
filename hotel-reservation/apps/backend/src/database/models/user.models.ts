import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  validated: boolean;
  locked: boolean;
  rolId: number; 
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'validated' | 'locked'> {}


export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public validated!: boolean;
  public locked!: boolean;
  public rolId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rolId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }
  },
  {
    tableName: 'users',
    sequelize,
  }
);

interface RoleAttributes {
  id: number;
  name: string; 
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export class RoleModel extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    }
  },
  {
    tableName: 'roles',
    sequelize,
  }
);

UserModel.belongsTo(RoleModel, { as: 'role', foreignKey: 'rolId' });
RoleModel.hasMany(UserModel, { as: 'users', foreignKey: 'rolId' });
