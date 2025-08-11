import { DataTypes, Model, Optional } from "sequelize";
import { RoomType, RoomStatus } from "../../../../../domain/src/entities/Room";
import sequelize from "sequelize/lib/sequelize";

interface RoomAttributes {
  id: string;
  number: number;
  type: RoomType;
  pricePerNight: number;
  status: RoomStatus;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, "id" | "status"> {}

export class RoomModel extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  public id!: string;
  public number!: number;
  public type!: RoomType;
  public pricePerNight!: number;
  public status!: RoomStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("single", "double", "suite"),
      allowNull: false,
    },
    pricePerNight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance"),
      allowNull: false,
      defaultValue: "available",
    },
  },
  {
    sequelize,
    tableName: "rooms",
    timestamps: true,
  }
);
