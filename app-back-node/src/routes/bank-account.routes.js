import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

import {
    create,
    list,
} from "../controllers/bank-account.controller.js";

const router = Router();

router.use(authenticateToken);

router.post("/", create);
router.get("/", list);

export default router;
