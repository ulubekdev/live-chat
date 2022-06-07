import { AuthorizationError, InternalServerError } from '../utils/errors.js'
import JWT from 'jsonwebtoken'

export default {
    sign: payload => {
        try {
            return JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION_TIME
            })
        } catch (error) {
            return new InternalServerError(500, error.message)
        }
    },

    verify: token => {
        try {
            return JWT.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return new AuthorizationError(401, error.message)
        }
    }
}