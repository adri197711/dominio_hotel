import { Model, DataTypes } from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public image?: string;
  public token?: string;
  public locked!: boolean;
  public validated!: boolean;
  public rolId! : number;
  public role!: Rol;
  
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
   
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    locked: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    validated: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    rolId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'User',
  }
);

User.belongsTo(Rol, {
  foreignKey: 'rolId',
  targetKey: 'id',
  as: 'role',
});

export default User;