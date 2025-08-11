import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "sequelize/lib/sequelize";
import { ReservationStatus } from "../../../../../domain/src/entities/Reservation";



interface ReservationAttributes {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice?: number;
  status: ReservationStatus;
}

type ReservationCreationAttributes = Optional<ReservationAttributes, "id" | "totalPrice">;

export class ReservationModel extends Model<ReservationAttributes, ReservationCreationAttributes>
  implements ReservationAttributes {
  public id!: string;
  public userId!: string;
  public roomId!: string;
  public checkInDate!: Date;
  public checkOutDate!: Date;
  public totalPrice?: number;
  public status!: ReservationStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReservationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled", "available"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Reservation",
    tableName: "reservations",
    timestamps: true,
  }
);
