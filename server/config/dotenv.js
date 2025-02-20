const path = require("path");
const envFile = process.env.DEV_ENV ? ".env" : ".env.prod";
require("dotenv").config({
  path: path.resolve(__dirname, "../", envFile),
});

const vars = {
  DEV_ENV: process.env.DEV_ENV,
  IP: process.env.IP,
  DB_DIALECT: process.env.DB_DIALECT,
  PORT: process.env.PORT,
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
};

module.exports = vars;
