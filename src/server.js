import ejs from 'ejs';
import cors from 'cors';
import http from "http";
import path from 'path';
import './config/index.js';
import express  from "express";
import { Server } from "socket.io";
import socket from './socket/index.js';
import fileUpload from 'express-fileupload';

import database from './config/db.js';
import mockData from './mock.js'

import UserRoute from './routes/users.js';
import ExtraRoute from './routes/extra.js';
import MessageRoute from './routes/messages.js';

import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import databaseMiddleware from './middlewares/database.js';

!async function() {
    const app = express();
    const httpServer = http.createServer(app);

    app.use(cors());

    // database connection
    const db = await database();
    await mockData({ sequelize: db });

    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(process.cwd(), 'src', 'views'));
    
    app.use(express.static(path.join(process.cwd(), 'src', 'public')));
    app.use(databaseMiddleware({ sequelize: db }));
    app.use(express.json());
    app.use(fileUpload());

    // render html
    app.get('/', (req, res) => res.render('index'));
    app.get('/login', (req, res) => res.render('login'));
    app.get('/register', (req, res) => res.render('register'));

    // routes
    app.use(UserRoute);
    app.use(MessageRoute);
    app.use(ExtraRoute);

    // error handler
    app.use(errorHandler);
    app.use(logger);

    const io = new Server(httpServer);
    socket({ io, db });

    httpServer.listen(process.env.PORT, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
}();