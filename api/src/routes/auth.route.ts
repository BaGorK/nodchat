import express from "express";
import { AuthController } from "../controllers";

const authController = new AuthController();

const router = express.Router();

router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/signup", (req, res) => authController.signup(req, res));

export default router;
