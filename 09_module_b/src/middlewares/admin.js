import { error } from "../utils/response.js";

export function isAdmin(req, res, next) {
    const user = req.user;
    if (user.role !== "admin") {
        error(res, 403, "Admin access required")
    }
    next()
}