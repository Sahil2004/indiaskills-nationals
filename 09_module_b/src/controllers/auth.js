import { db } from "../db/db.js";
import { generateAccessToken } from "../utils/accessToken.js";
import { error, success, validationError } from "../utils/response.js";
import { validationResult } from "express-validator";

export async function login(req, res) {
    validationError(validationResult, req, res)
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await db.one("SELECT id, username, email, role, created_at, updated_at FROM users WHERE username = $1 AND password = $2", [username, password])
        const token = await db.oneOrNone("SELECT token FROM sessions WHERE username=$1", [user.username])
        if (token) {
            res.setHeader("X-Authorization", `Bearer ${token}`);
            success(res, 200, {
                token: token,
                user: user
            })
        } else {
            const token = generateAccessToken(username);
            await db.none("INSERT INTO sessions (token, username) VALUES ($1, $2)", [token, user.username])
            res.setHeader("X-Authorization", `Bearer ${token}`);
            success(res, 200, {
                token: token,
                user: user
            })
        }
    } catch (err) {
        error(res, 400, "Login failed")
    }
}

export async function register(req, res) {
    validationError(validationResult, req, res)
    const { username, password, email } = req.body;
    try {
        await db.one("SELECT * FROM users WHERE username = $1", [username])
        error(res, 409, "Username already taken")
    } catch (err) {
        try {
            const user = await db.one("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at, updated_at", [username, email, password])
            success(res, 201, {
                user: user
            })
        } catch (err) { }

    }
}

export async function logout(req, res) {
    try {
        await db.none("DELETE FROM sessions WHERE username=$1", [req.user.username])
        res.removeHeader("x-authorization")
        res.status(200).json({
            success: true
        })
    } catch (err) {

    }
}

export async function getStatistics(req, res) {
    const { metrics = null, labels = null } = req.query
    if (!["label", "album", "song"].includes(metrics)) {
        error(res, 401, "Validation Failed")
    }
    let result = []
    if (metrics === "album") {
        result = await db.manyOrNone("SELECT *, (SELECT SUM(view_count) FROM songs s WHERE s.album_id = a.id) AS total_view_count FROM album a ORDER BY total_view_count ASC")
        for (let i = 0; i < result.length; i++) {
            const pub = await db.one("SELECT id, username, email FROM users WHERE id=$1", [result[i].publisher_id])
            result[i].publisher = pub
            delete result[i].publisher_id
        }
    } else if (metrics === "label") {
        result = await db.manyOrNone("SELECT l.name AS label, SUM(so.view_count) AS total_view_count, array_agg(row_to_json(so)) AS songs FROM song_labels s INNER JOIN labels l ON s.label_id = l.id INNER JOIN songs so ON s.song_id = so.id GROUP BY l.name ORDER BY total_view_count DESC")
    } else if (metrics === "song") {
        result = await db.manyOrNone("SELECT s.* FROM songs s INNER JOIN song_labels sl ON s.id = sl.song_id INNER JOIN labels l ON l.id = sl.label_id WHERE l.name = $1 ORDER BY s.view_count DESC", [labels])
        for (let i = 0; i < result.length; i++) {
            const r = await db.manyOrNone("SELECT l.name FROM song_labels s INNER JOIN labels l ON s.label_id = l.id WHERE s.song_id = $1", [result[i].id])
            result[i].label = []
            for (let j = 0; j < r.length; j++) {
                result[i].label.push(r[j].name)
            }
        }
    }
    success(res, 200, result)
}