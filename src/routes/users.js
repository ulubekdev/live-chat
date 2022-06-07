import { Router } from "express";
import controller from '../controllers/users.js';
import validation from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.post('/login', validation, controller.login);
router.post('/register', validation, controller.register);
router.get('/users', checkToken, controller.getAllUsers);
// router.get('/users/:user_id', checkToken, controller.getUserById);

export default router;