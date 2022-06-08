import { InternalServerError, NotFoundError, ValidationError } from "../utils/errors.js";
import { Op } from "sequelize";
import fs from 'fs/promises';

const sendMessage = async (req, res, next) => {
    try {
        let { message_to, message_content } = req.body;
        message_to = parseInt(message_to);

        let message;
        
        if (req.files) {
            const { file } = req.files;

            if (!file) {
                throw new ValidationError(400, "No file provided");
            }

            if (file.size > 1024 * 1024 * 50) {
                throw new ValidationError(401, 'File size is too big');
            }

            const fileName = Date.now() + file.name.replace(/\s/, '');
            await file.mv(path.join(process.cwd(), 'uploads', 'files', fileName));

            message = {
                message_from: req.userId,
                message_to,
                message_content: fileName,
                message_type: file.mimetype
            }

        } else {
            message = {
                message_from: req.userId,
                message_to,
                message_content,
                message_type: 'plain/text'
            }
        }

        let msg = await req.models.Message.create(message);

        msg.message_from = await req.models.User.findOne({
            where: { user_id: message.message_from },
            attributes: {
                exclude: ['password']
            }
        })

        msg.message_to = await req.models.User.findOne({
            where: { user_id: message.message_to },
            attributes: {
                exclude: ['password']
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'Message sent',
            data: msg
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }

};

const getUserMessage = async (req, res, next) => {
    try {
        let { userId } = req.query;
        userId = parseInt(userId);

        let messages = await req.models.Message.findAll({
            where: {
                [Op.or]: [{
                        message_from: userId,
                        message_to: req.userId
                    },
                    {
                        message_from: req.userId,
                        message_to: userId
                    }
                ]
            },
            order: [
                ['message_id', 'ASC']
            ]
        });

        messages = await Promise.all(
            JSON.parse(JSON.stringify(messages)).map(async message => {

                message.message_from = await req.models.User.findOne({
                    where: {
                        user_id: message.message_from
                    },
                    attributes: {
                        exclude: ['password', 'socket_id']
                    }
                })

                message.message_to = await req.models.User.findOne({
                    where: {
                        user_id: message.message_to
                    },
                    attributes: {
                        exclude: ['password', 'socket_id']
                    }
                })

                return message
            })
        );

        return res.status(200).json({
            status: 200,
            message: 'Messages received',
            data: messages
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const updateMessage = async (req, res, next) => {
    try {
        let { messageId } = req.params;
        let { message_content } = req.body;
        
        messageId = parseInt(messageId);

        let msg = await req.models.Message.findOne({
            where: {
                message_id: messageId
            }
        });

        if (!msg) {
            throw new NotFoundError(404, "Message not found");
        }

        if(msg.message_from !== req.userId && msg.message_type !== 'plain/text') {
            throw new ValidationError(401, "You are not allowed to edit this message");
        }

        await req.models.Message.update({
            message_content
        }, {
            where: {
                message_id: messageId
            }
        });

        await msg.reload();

        msg.message_from = await req.models.User.findOne({
            where: { user_id: msg.message_from },
            attributes: {
                exclude: ['password']
            }
        })

        msg.message_to = await req.models.User.findOne({
            where: { user_id: msg.message_to },
            attributes: {
                exclude: ['password']
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'Message updated',
            data: msg
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        let { messageId } = req.params;
        messageId = parseInt(messageId);

        let msg = await req.models.Message.findOne({
            where: {
                message_id: messageId
            }
        });

        if (!msg) {
            throw new NotFoundError(404, "Message not found");
        }

        if(msg.message_from !== req.userId) {
            throw new ValidationError(401, "You are not allowed to delete this message");
        }

        await req.models.Message.destroy({
            where: {
                message_id: messageId
            }
        });

        if(msg.message_type !== 'plain/text') {
            fs.unlinkSync(path.join(process.cwd(), 'uploads', 'files', msg.message_content));
        }

        msg.message_from = await req.models.User.findOne({
            where: { user_id: msg.message_from },
            attributes: {
                exclude: ['password']
            }
        });

        msg.message_to = await req.models.User.findOne({
            where: { user_id: msg.message_to },
            attributes: {
                exclude: ['password']
            }
        });

        return res.status(200).json({
            status: 200,
            message: 'Message deleted',
            data: msg
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

export default {
    sendMessage,
    getUserMessage,
    updateMessage,
    deleteMessage
}