import { InternalServerError, ValidationError } from "../utils/errors.js";
import { Op } from "sequelize";

const sendMessage = async(req, res) => {
    try {
        let { messageTo } = req.query;
        let { message_content } = req.body;

        messageTo = parseInt(messageTo);

        if(req.files) {
            const { file } = req.files;

            if(file.size > 1024 * 1024 * 50) {
                throw new ValidationError(401, 'File size is too big');
            }

            const fileName = Date.now() + file.name.replace(/\s/, '')
            await file.mv(path.join(process.cwd(), 'uploads', 'files', fileName));

            let msg = await req.models.Message.create({
                message_from: req.userId,
                message_to: messageTo,
                message_content: fileName,
                message_type: file.mimetype
            });

            return res.status(200).json({
                status: 200,
                message: 'Message sent',
                data: msg
            });
        } else {
            let msg = await req.models.Message.create({
                message_from: req.userId,
                message_to: messageTo,
                message_content,
                message_type: 'plain/text'
            });

            return res.status(200).json({
                status: 200,
                message: 'Message sent',
                data: msg
            });
        }

    } catch (error) {
        throw new InternalServerError(500, error.message);
    }

};

const getMessagesByUserId = async(req, res) => {
    try {
        let { userId } = req.query;
        userId = parseInt(userId);

        let messages = await req.models.Message.findAll({
            where: {
                [Op.or]: [
                    { 
                        message_from: userId,
                        message_to: req.userId 
                    },
                    { 
                        message_from: req.userId,
                        message_to: userId
                    }
                ]
            },
            order: [['message_id', 'ASC']]
        })

        return res.status(200).json({
            status: 200,
            message: 'Messages received',
            data: messages
        });

    } catch (error) {
        throw new InternalServerError(500, error.message);
    }
};

const updateMessage = async(req, res) => {
    try {
        let { messageId } = req.query;
        messageId = parseInt(messageId);

        let { message_content } = req.body;

        let msg = await req.models.Message.update({
            message_content
        }, {
            where: {
                message_id: messageId
            }
        });

        return res.status(200).json({
            status: 200,
            message: 'Message updated',
            data: msg
        });

    } catch (error) {
        throw new InternalServerError(500, error.message);
    }
};

const deleteMessage = async(req, res) => {
    try {
        let { messageId } = req.query;
        messageId = parseInt(messageId);

        let msg = await req.models.Message.destroy({
            where: {
                message_id: messageId
            }
        });

        return res.status(200).json({
            status: 200,
            message: 'Message deleted',
            data: msg
        });

    } catch (error) {
        throw new InternalServerError(500, error.message);
    }
};

export default {
    sendMessage,
    getMessagesByUserId,
    updateMessage,
    deleteMessage
}