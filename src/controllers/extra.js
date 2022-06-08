import path from 'path';
import { InternalServerError } from '../utils/errors.js';

const getAvatar = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({
            where: {
                user_id: req.userId
            }
        });
        const filePath = path.join('src', 'uploads', 'avatars', user.userimg);
        res.sendFile(filePath);
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

const downloadFile = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join('src', 'uploads', 'files', fileName);
        res.download(filePath);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const getFile = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join('src', 'uploads', 'files', fileName);
        res.sendFile(filePath);
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


export default {
    getAvatar,
    getUsername,
    downloadFile,
    getFile
}