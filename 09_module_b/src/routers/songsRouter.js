import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuth.js";
import { getSong, getSongCover, getSongs } from "../controllers/song.js";

const router = Router()

router.get("/", getSongs)
router.get("/:song_id/cover", getSongCover)
router.get("/:song_id", isAuthenticated, getSong)

export { router as songsRouter }