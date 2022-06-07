import JWT from "../utils/jwt.js";
import { AuthorizationError, InternalServerError } from "../utils/errors.js";

export default (req, res, next) => {
    try {
        const { token } = req.headers;
        const users = req.models.User.findAll(); 

        if (!token) {
            return next(new AuthorizationError(401, "No token provided"));
        }

        const { user_id, agent } = JWT.verify(token);

        const reqAgent = req.headers['user-agent'];

        if (agent !== reqAgent) {
            return next(new AuthorizationError(401, "Invalid token"));
        }

        if(users.find(user => user.user_id == user_id)) {
            return next(new AuthorizationError(401, "Invalid token"));
        }
        
        req.userId = user_id;

        return next();
    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
}