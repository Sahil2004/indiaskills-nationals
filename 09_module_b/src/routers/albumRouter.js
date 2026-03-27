import { Router } from "express";
import { body } from "express-validator"
import { upload } from "../config/config.js";
import { isAuthenticated } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/admin.js";
import { createAlbum, deleteAlbum, getAlbum, getAlbums, getCover, getSongsInAlbum, updateAlbum } from "../controllers/album.js";
import { addSong, deleteSong, updateSong, updateSongOrder } from "../controllers/song.js";

const router = Router()

router.get("/", getAlbums)
router.get("/:album_id", getAlbum)
router.delete("/:album_id", deleteAlbum)
router.get("/:album_id/cover", getCover)
router.get("/:album_id/songs", getSongsInAlbum)
router.post("/", isAuthenticated, isAdmin, upload.none(), [body('title').notEmpty(), body('artist').notEmpty(), body('release_year').isNumeric().notEmpty(), body('genre').notEmpty(), body('description').notEmpty()], createAlbum)
router.put("/:album_id", isAuthenticated, isAdmin, updateAlbum)
router.post("/:album_id/songs", isAuthenticated, isAdmin, upload.single("cover_image"), [body('title').notEmpty(), body('duration_seconds').isNumeric().notEmpty(), body('label').isArray({ min: 0 }).optional(), body("lyrics").notEmpty(), body('is_cover').isBoolean().notEmpty()], addSong)
router.put("/:album_id/songs/order", isAuthenticated, isAdmin, [body('song_ids').isArray().notEmpty()], updateSongOrder)
router.post("/:album_id/songs/:song_id", isAuthenticated, isAdmin, upload.single("cover_image"), [body('title').notEmpty(), body('duration_seconds').isNumeric().notEmpty(), body('label').isArray({ min: 0 }).optional(), body("lyrics").notEmpty(), body('is_cover').isBoolean().notEmpty()], updateSong)
router.delete("/:album_id/songs/:song_id", isAuthenticated, isAdmin, deleteSong)

export { router as albumRouter }