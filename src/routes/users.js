import { Router } from "express";
import controller from '../controllers/users.js';
import validation from "../middlewares/validation.js";

const router = Router();

router.post('/login', validation, controller.login);
router.post('/register', validation, controller.register);
router.get('/users', controller.getAllUsers);
router.get('/users/:user_id', controller.getUserById);

export default router;