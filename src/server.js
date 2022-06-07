import ejs from 'ejs';
import cors from 'cors';
import path from 'path';
import './config/index.js';
import mock from './mock.js';
import express  from "express";
import database from './config/db.js';
import fileUpload from 'express-fileupload';

import UserRoute from './routes/users.js';
// import MessageRoute from './routes/message.js';

import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';

!async function() {
    const app = express();
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(process.cwd(), 'src', 'views'));

    app.use(cors());
    app.use(fileUpload());
    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'src', 'public')));

    // render html
    app.get('/', (req, res) => res.render('index'));
    app.get('/login', (req, res) => res.render('login'));
    app.get('/register', (req, res) => res.render('register'));

    // database connection
    const db = await database();
    await mock({ sequelize: db });

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        req.models = db.models;
        next();
    });

    // routes
    app.use(UserRoute);
    // app.use(MessageRoute)

    // error handler
    app.use(errorHandler);
    app.use(logger);

    app.listen(process.env.PORT, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
}()