import { Router } from "express";
import { getStatistics, login, logout, register } from "../controllers/auth.js";
import { body } from "express-validator"
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = Router()

router.post("/login", [body('username').notEmpty(), body('password').notEmpty()], login)
router.post("/register", [body('username').notEmpty(), body('password').notEmpty(), body('email').isEmail()], register)
router.post("/logout", isAuthenticated, logout)
router.get("/statistics", isAuthenticated, getStatistics)

export { router as authRouter }