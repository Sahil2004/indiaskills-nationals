import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/admin.js";
import { unbanUser, banUser, updateRole, getUsers } from "../controllers/user.js";

const router = Router()

router.get("/", isAuthenticated, isAdmin, getUsers)
router.put("/:user_id", isAuthenticated, isAdmin, updateRole)
router.put("/:user_id/ban", isAuthenticated, isAdmin, banUser)
router.put("/:user_id/unban", isAuthenticated, isAdmin, unbanUser)

export { router as usersRouter }