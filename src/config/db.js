require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // RDS endpoint (on EC2), or localhost (dev)
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
       // Make SSL optional and configurable for local development
    dialectOptions: (() => {
      const useSsl = process.env.DB_SSL === "true";
      if (process.env.NODE_ENV === "test") return {};
      if (useSsl) {
        return {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        };
      }
      return {};
    })(),
  }
);

module.exports = sequelize;
