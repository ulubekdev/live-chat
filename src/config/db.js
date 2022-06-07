import { Sequelize } from "sequelize";
import models from "../models/index.js";
import { InternalServerError } from "../utils/errors.js";

const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
});

export default async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await models({ sequelize });
        await sequelize.sync({ force: true });

        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw new InternalServerError(500, error.message);
    }
}