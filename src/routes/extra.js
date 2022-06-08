import { Router } from "express";
import controller from "../controllers/extra.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router();

router.get('/avatar/:token', checkToken, controller.getAvatar);
router.get('/username/:token', checkToken, controller.getUsername);

router.get('/file/:token/:fileName', checkToken, controller.getFile);
router.get('/download/:token/:fileName', checkToken, controller.downloadFile);

export default router;