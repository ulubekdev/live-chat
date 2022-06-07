import { Router } from "express";
import controller from "../controllers/messages.js";
import validation from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.post("/messages/:user_id", checkToken, validation, controller.sendMessage);
router.get("/messages/:user_id", checkToken, controller.getMessagesByUserId);

export default router;