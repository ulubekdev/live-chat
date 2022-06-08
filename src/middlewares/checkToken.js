import JWT from "../utils/jwt.js";
import { AuthorizationError, InternalServerError } from "../utils/errors.js";

export default async(req, res, next) => {
    try {
        let { token } = req.headers;
        if(!token) token = req.params.token;

        if (!token) {
            return next(new AuthorizationError(401, "No token provided"));
        }
        const { user_id, agent } = JWT.verify(token);

        const reqAgent = req.headers['user-agent'];

        if (agent !== reqAgent) {
            return next(new AuthorizationError(401, "Invalid token"));
        }

        const user = await req.models.User.findOne({
            where: {
                user_id
            },
        });

        if (!user) {
            return next(new AuthorizationError(401, "Invalid token"));
        }
        
        req.userId = user_id;

        return next();
    } catch (error) {
        return next(new InternalServerError(401, error.message));
    }
}