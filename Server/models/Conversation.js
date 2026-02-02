import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  }
);

export default Conversation;
