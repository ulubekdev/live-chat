import { Sequelize } from "sequelize";
import { InternalServerError } from "../utils/errors.js";

import UserModel from "../models/User.js";
import MessageModel from "../models/Message.js";

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
        // connect to database
        await sequelize.authenticate()
        console.log('Database connected!')

        // load models
        await UserModel({ sequelize });
        await MessageModel({ sequelize });

        // sync to database
        await sequelize.sync({ alter: false });

        return sequelize;
    } catch (error) {
        console.log(error);
        console.log('Database error: ' + error.error);
        throw new InternalServerError(500, error.message);
    }
}