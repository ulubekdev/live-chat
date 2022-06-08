import { Router } from "express";
import controller from "../controllers/messages.js";
import validation from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.post("/messages", checkToken, controller.sendMessage);
router.get("/messages", checkToken, controller.getUserMessage);
router.put("/messages/:messageId", checkToken, controller.updateMessage);
router.delete("/messages/:messageId", checkToken, controller.deleteMessage);

router.get("/all", async(req, res) => {
    let msgs = await req.models.Message.findAll();
    res.status(200).json({data: msgs});
});
export default router;