import { Router } from "express";
import controller from "../controllers/extra.js";

const router = Router();

router.get('/avatar/:token', controller.getAvatar);
router.get('/avatar/:token', controller.getUsername);

router.get('/download/:token/:fileName', controller.downloadFile);
router.get('/file/:token/:fileName', controller.getFile);

export default router;