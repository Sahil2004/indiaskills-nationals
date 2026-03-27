import { db } from "../db/db.js";
import { error, success } from "../utils/response.js";
import path from "path"

export async function addSong(req, res) {
    const album_id = req.params.album_id;
    if (!album_id) {
        error(res, 401, "Validation Failed")
    }
    const { title, duration_seconds, label, lyrics, is_cover } = req.body;

    if (is_cover) {
        const album = await db.manyOrNone("SELECT * FROM songs WHERE album_id = $1 AND is_cover = true", [album_id])
        if (album.length === 3) {
            error(res, 400, "Too many covers provided")
        }
    }

    const song = await db.one("INSERT INTO songs (title, duration_seconds, lyrics, cover_image_url, is_cover, album_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [title, duration_seconds, lyrics, req.file.path, is_cover, album_id])
    song.label = []

    const labels = JSON.parse(label)
    for (let i = 0; i < labels.length; i++) {
        const label = await db.oneOrNone("SELECT id FROM labels WHERE name = $1", [labels[i]])
        if (!label.id) continue;
        await db.none("INSERT INTO song_labels (label_id, song_id) VALUES ($1, $2)", [label.id, song.id])
        song.label.push(labels[i])
    }

    success(res, 201, song)

}

export async function updateSongOrder(req, res) {
    const albumId = req.params.album_id;
    const songIds = req.body.song_ids
    for (let i = 0; i < songIds.length; i++) {
        await db.none('UPDATE songs SET "order"=$1 WHERE id = $2', [i + 1, songIds[i]])
    }
    res.status(200).json({
        success: true
    })
}

export async function updateSong(req, res) {
    const { title, duration_seconds, label, lyrics, is_cover } = req.body;
    const album_id = req.params.album_id
    const song_id = req.params.song_id
    if (!song_id || !album_id) {
        error(res, 401, "Validation Failed")
    }
    if (is_cover) {
        const album = await db.manyOrNone("SELECT * FROM songs WHERE album_id = $1 AND is_cover = true", [album_id])
        if (album.length === 3) {
            error(res, 400, "Too many covers provided")
        }
    }
    const song = await db.one("UPDATE songs SET title = $1, duration_seconds = $2, lyrics = $3, is_cover = $4, cover_image_url = $5 WHERE id = $6 RETURNING *", [title, duration_seconds, lyrics, is_cover, req.file.path, song_id])
    if (!label) {
        song.label = await db.manyOrNone("SELECT name FROM song_labels JOIN labels WHERE song_id = $1", [song.id])
        success(res, 200, song)
    }
    await db.none("DELETE FROM song_labels WHERE song_id = $1", [song.id])
    const labels = JSON.parse(label)
    song.label = []
    for (let i = 0; i < labels.length; i++) {
        const lab = await db.oneOrNone("SELECT id FROM labels WHERE name = $1", [labels[i]])
        if (!lab.id) continue;
        await db.none("INSERT INTO song_labels (label_id, song_id) VALUES ($1, $2)", [lab.id, song.id])
        song.label.push(labels[i])
    }
    success(res, 200, song)
}

export async function deleteSong(req, res) {
    const id = req.params.song_id
    if (!id) {
        error(res, 401, "Validation Failed")
    }
    await db.none("DELETE FROM songs WHERE id=$1", [id])
    res.status(200).json({
        success: true
    })
}

export async function getSongs(req, res) {
    let { limit = 10, cursor = null, keyword = null } = req.query;
    limit = parseInt(limit)
    let songs = []
    if (cursor !== null) {
        const id = JSON.parse(atob(cursor)).id
        if (keyword) {
            songs = await db.manyOrNone('SELECT id, album_id, title, duration_seconds, "order", is_cover, cover_image_url FROM songs WHERE id > $1 AND (title LIKE $3) LIMIT $2', [id, limit + 1, `%${keyword}%`])
        } else {
            songs = await db.manyOrNone('SELECT id, album_id, title, duration_seconds, "order", is_cover, cover_image_url FROM songs WHERE id > $1 LIMIT $2', [id, limit + 1])
        }
    } else {
        if (!keyword)
            songs = await db.manyOrNone('SELECT id, album_id, title, duration_seconds, "order", is_cover, cover_image_url FROM songs LIMIT $1', [limit + 1])
        else
            songs = await db.manyOrNone('SELECT id, album_id, title, duration_seconds, "order", is_cover, cover_image_url FROM songs WHERE (title LIKE $2) LIMIT $1', [limit + 1, `%${keyword}%`])
    }
    let next_cursor = null
    if (songs.length > limit) {
        songs.pop()
        next_cursor = btoa(JSON.stringify({ id: songs[songs.length - 1].id }))
    }
    for (let i = 0; i < songs.length; i++) {
        songs[i].label = []
        const labels = await db.manyOrNone("SELECT name FROM song_labels s INNER JOIN labels l ON s.label_id = l.id WHERE s.song_id = $1", [songs[i].id])
        for (const label of labels) {
            songs[i].label.push(label.name)
        }
    }
    success(res, 200, songs, {
        previous_cursor: cursor,
        next_cursor: next_cursor
    })
}


export async function getSongCover(req, res) {
    const { song_id } = req.params;
    if (!song_id) {
        error(res, 401, "Validation Failed")
    }
    const song = await db.one("SELECT cover_image_url FROM songs WHERE id = $1", [song_id])
    res.sendFile(path.resolve(process.cwd() + "/" + song.cover_image_url));
}


export async function getSong(req, res) {
    const { song_id } = req.params;
    if (!song_id) {
        error(res, 401, "Validation Failed")
    }
    const song = await db.one("UPDATE songs SET view_count = view_count + 1 WHERE id = $1 RETURNING *", [song_id])
    song.label = []
    const labels = await db.manyOrNone("SELECT name FROM song_labels s INNER JOIN labels l ON s.label_id = l.id WHERE s.song_id = $1", [song.id])
    for (const label of labels) {
        song.label.push(label.name)
    }
    success(res, 200, song)
}
