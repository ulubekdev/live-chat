import path from 'path';
import { InternalServerError } from '../utils/errors.js';

const getAvatar = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({
            where: {
                user_id: req.userId
            }
        });
        res.sendFile(path.join(process.cwd(), 'uploads', 'images', user.userimg));
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const getUsername = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({
            where: {
                user_id: req.userId
            }
        });
        res.setHeader('Content-Type', 'plain/text');
        res.send(user.username);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const getFile = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        res.sendFile(path.join(process.cwd(), 'uploads', 'images', fileName));
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const downloadFile = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        res.download(path.join(process.cwd(), 'uploads', 'files', fileName));
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


export default {
    getAvatar,
    getUsername,
    getFile,
    downloadFile
}