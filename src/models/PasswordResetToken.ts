import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/db_connection.js";

interface PasswordResetTokenAttrs {
  id: number;
  user_id: bigint;           // FK a users.id
  token_hash: string;        // SHA-256 del token
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

type Creation = Optional<
  PasswordResetTokenAttrs,
  "id" | "used_at" | "created_at" | "updated_at"
>;

export class PasswordResetToken extends Model<PasswordResetTokenAttrs, Creation> {}

PasswordResetToken.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    token_hash: { type: DataTypes.STRING, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize: db,
    tableName: "password_reset_tokens",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default PasswordResetToken;
