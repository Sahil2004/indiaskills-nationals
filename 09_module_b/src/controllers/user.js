import { db } from "../db/db.js";
import { error, success } from "../utils/response.js";

export async function updateRole(req, res) {
    const id = req.params.user_id;
    if (!id) {
        error(res, 401, "Validation Failed")
    }
    const admins = await db.many("SELECT * FROM users WHERE role='admin'")
    if (admins.length === 1) {
        error(res, 403, "Last admin demotion forbidden")
    }
    const user = await db.one("UPDATE users SET role=$1 WHERE id=$2 RETURNING id, username, email, role, is_banned, created_at, updated_at", [req.body.role, id])
    success(res, 200, user)
}

export async function banUser(req, res) {
    const id = req.params.user_id
    if (!id) {
        error(res, 401, "Validation Failed")
    }
    if (id === req.user.id) {
        error(res, 400, "Cannot ban self")
    }
    const user = await db.one("UPDATE users SET is_banned=true WHERE id=$1 RETURNING id, username, email, role, is_banned, updated_at", [id])
    success(res, 200, user)
}

export async function unbanUser(req, res) {
    const id = req.params.user_id
    if (!id) {
        error(res, 401, "Validation Failed")
    }
    const user = await db.one("UPDATE users SET is_banned=false WHERE id=$1 RETURNING id, username, email, role, is_banned, updated_at", [id])
    success(res, 200, user)
}

export async function getUsers(req, res) {
    const cursor = req.query.cursor ?? null;
    const limit = req.query.limit ?? 10;
    if (cursor) {
        const id = JSON.parse(atob(cursor)).id
        const users = await db.manyOrNone("SELECT id, username, role, email, is_banned, created_at FROM users WHERE id > $2 ORDER BY id ASC LIMIT $1", [parseInt(limit) + 1, id])
        let next = null
        if (users.length > limit) {
            users.pop()
            next = btoa(JSON.stringify({ id: users[users.length - 1].id }))
        }
        success(res, 200, users, {
            next_cursor: next,
            previous_cursor: cursor
        })
    }
    const users = await db.manyOrNone("SELECT id, username, role, email, is_banned, created_at FROM users ORDER BY id ASC LIMIT $1", [parseInt(limit) + 1])
    let next = null
    if (users.length > limit) {
        users.pop()
        next = btoa(JSON.stringify({ id: users[users.length - 1].id }))
    }
    success(res, 200, users, {
        next_cursor: next,
        previous_cursor: cursor
    })
}