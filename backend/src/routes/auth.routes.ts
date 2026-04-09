import express from "express";
import {
  getCurrentUserController,
  loginController,
  registerController,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", requireAuth, getCurrentUserController);

export default router;
