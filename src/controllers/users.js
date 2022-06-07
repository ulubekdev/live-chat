import path from 'path';
import sha256 from 'sha256';
import JWT from '../utils/jwt.js';
import { AuthorizationError, ValidationError, NotFoundError, InternalServerError } from '../utils/errors.js';

const register = async (req, res, next) => {
    try {
        let userimg = req.files;
        if(userimg.size > 1024 * 1024 * 2) {
            return next(new ValidationError(400, 'Image size is too big'));
        }
        if(!userimg.mimetype.includes('image')) {
            return next(new ValidationError(400, 'File is not an image'));
        }
    
        let fileName = Date.now() + '-' + userimg.image.name;
        let filePath = path.join(process.cwd(), 'src', 'uploads', 'images', fileName);

        userimg.image.mv(filePath, (error) => {
            if(error) {
                return next(new InternalServerError(500, error.message));
            }
        });

        const user = await req.models.User.create({
            username: req.body.username,
            password: sha256(req.body.password),
            userimg: fileName
        }, {
            returning: true,
            fields: ['username', 'userimg']
        });

        res.status(201).json({
            status: 201,
            message: 'User created',
            data: user,
            token: JWT.sign({
                user_id: user.user_id,
                agent: req.headers['user-agent']
            })
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

const login = async (req, res, next) => {
    try {
        let { username, password } = req.body;
        let user = await req.models.User.findOne({
            where: {
                username,
                password: sha256(password)
            },
            attributes: {
                exclude: ['password']
            }
        });

        if(!user) {
            return next(new AuthorizationError(401, 'Invalid username or password'));
        }
        res.status(200).json({
            status: 200,
            message: 'User logged in',
            data: user,
            token: JWT.sign({
                user_id: user.user_id,
                agent: req.headers['user-agent']
            })
        });
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        let users = await req.models.User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        res.status(200).json({
            status: 200,
            message: 'Users fetched',
            data: users,
            token: null
        });
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
};

// const getUserById = async (req, res, next) => {
//     try {
//         let user = await req.models.User.findOne({
//             where: {
//                 user_id: req.params.user_id
//             },
//             attributes: {
//                 exclude: ['password']
//             }
//         });
        
//         if(!user) {
//             return next(new NotFoundError(404, 'User not found'));
//         }
//         res.status(200).json({
//             status: 200,
//             message: 'User fetched',
//             data: user,
//             token: null
//         });
//     } catch (error) {
//         return next(new InternalServerError(500, error.message));
//     }
// };

export default {
    register,
    login,
    getAllUsers,
    // getUserById
}