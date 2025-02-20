const { Sequelize } = require("sequelize");
const dotenv = require("./dotenv");
const logger = require("../utils/logger");

// Novo ORM
const sequelize = new Sequelize(dotenv.DBASE, dotenv.USERS, dotenv.PASS, {
  host: dotenv.IP,
  dialect: dotenv.DB_DIALECT,
  port: dotenv.PORT,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    logger.error("db_connection", "Erro ao conectar com o banco de dados: ", error);
    console.error("Erro ao conectar com o banco de dados:", error);
  }
})();

module.exports = { sequelize };
