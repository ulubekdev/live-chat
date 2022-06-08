import { Router } from "express";
import controller from "../controllers/messages.js";
import validation from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.post("/messages", checkToken, validation, controller.sendMessage);
router.get("/messages", checkToken, controller.getMessagesByUserId);
router.put("/messages", checkToken, validation, controller.updateMessage);
router.delete("/messages", checkToken, validation, controller.deleteMessage);

export default router;