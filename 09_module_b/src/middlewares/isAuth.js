import { db } from "../db/db.js";
import { error } from "../utils/response.js";

export async function isAuthenticated(req, res, next) {
    const token = req.get("x-authorization").split(' ')[1];
    if (!token) {
        error(res, 401, 'Access Token is required')
    }
    try {
        const { username } = await db.one("SELECT username FROM sessions WHERE token=$1", [token])
        const user = await db.one("SELECT id, username, email, role, created_at, updated_at FROM users WHERE username=$1", [username])
        req.user = user;
        next()
    } catch (err) {
        console.log(err)
        error(res, 401, "Invalid Access Token")
    }
}