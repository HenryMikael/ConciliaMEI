import { Router } from "express";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

import {
    register,
    login,
    getCurrentUser,
    refresh,
    logout,
} from "../controllers/auth.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticateToken, getCurrentUser);

export default router;