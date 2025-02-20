const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Diesel = sequelize.define(
  "Diesel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nivel: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },
    data_medicao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    abastecimento: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    abastecimento_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "diesel",
    schema: "public",
    timestamps: false,
  }
);

module.exports = Diesel;
