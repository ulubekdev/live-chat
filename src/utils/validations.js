import Joi from 'joi'

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

export const registerSchema = Joi.object({
    username: Joi.string().min(2).max(15).alphanum().required(),
    password: Joi.string().min(5).max(20).alphanum().required(),
    userimg: Joi.string().uri().required()
});

export const messageSchema = Joi.object({
    message_from: Joi.number().required(),
    message_to: Joi.number().required(),
    message_content: Joi.string().max(200).required(),
    message_type: Joi.string().valid('plain/text', 'image/jpeg', 'image/png', 'video/mp4', 'image/gif', 'application/pdf', 'audio/aac', 'audio/mpeg').required()
});