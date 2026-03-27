import { db } from "../db/db.js";
import path from "path"
import { error, success } from "../utils/response.js";

export async function getAlbums(req, res) {
    let { year, limit = 10, cursor = null } = req.query;
    limit = parseInt(limit)
    let albums;
    if (cursor !== null) {
        const id = parseInt(JSON.parse(atob(cursor)).id)
        if (!year)
            albums = await db.manyOrNone("SELECT * FROM album WHERE id > $1 ORDER BY id ASC LIMIT $2", [id, limit + 1])
        else {
            const years = year.split("-")
            if (years.length === 1)
                albums = await db.manyOrNone("SELECT * FROM album WHERE id > $1 AND release_year = $3 ORDER BY id ASC LIMIT $2", [id, limit + 1, parseInt(years[0])])
            else
                albums = await db.manyOrNone("SELECT * FROM album WHERE id > $1 AND release_year BETWEEN $3 AND $4 ORDER BY id ASC LIMIT $2", [id, limit + 1, parseInt(years[0]), parseInt(years[1])])
        }
    } else {
        if (!year)
            albums = await db.manyOrNone("SELECT * FROM album ORDER BY id ASC LIMIT $1", [limit + 1])
        else {
            const years = year.split("-")
            if (years.length === 1)
                albums = await db.manyOrNone("SELECT * FROM album WHERE release_year = $1 ORDER BY id ASC LIMIT $2", [parseInt(years[0]), limit + 1])
            else {
                albums = await db.manyOrNone("SELECT * FROM album WHERE release_year BETWEEN $1 AND $2 ORDER BY id ASC LIMIT $3", [parseInt(years[0]), parseInt(years[1]), limit + 1])
            }
        }
    }
    let next_cursor = null
    if (albums.length > limit) {
        albums.pop()
        next_cursor = btoa(JSON.stringify({ id: albums[albums.length - 1].id }))
    }
    for (let i = 0; i < albums.length; i++) {
        const publisher = await db.one("SELECT id, username, email FROM users WHERE id = $1", [albums[i].publisher_id])
        delete albums[i].publisher_id
        albums[i].publisher = publisher
    }
    success(res, 200, albums, {
        next_cursor: next_cursor,
        previous_cursor: cursor
    })
}

export async function getAlbum(req, res) {
    const { album_id } = req.params;
    if (!album_id) {
        error(res, 401, "Validation Failed")
    }
    const album = await db.oneOrNone("SELECT * FROM album WHERE id = $1", [album_id])
    album.publisher = await db.one("SELECT id, username, email FROM users WHERE id = $1", [album.publisher_id])
    delete album.publisher_id
    success(res, 200, album)
}

export async function getCover(req, res) {
    const { album_id } = req.params;
    if (!album_id) {
        error(res, 401, "Validation Failed")
    }
    const album = await db.manyOrNone("SELECT cover_image_url FROM songs WHERE album_id = $1 AND is_cover = true", [album_id])
    switch (album.length) {
        case 0:
            error(res, 404, "Cover Not Found")
            break;
        case 1:
            res.sendFile(path.resolve(process.cwd() + "/" + album[0].cover_image_url));
            break;
        default:
            success(res, 200, "The cover image. Yet to be implemented")
    }
}

export async function getSongsInAlbum(req, res) {
    const { album_id } = req.params;
    if (!album_id) {
        error(res, 401, "Validation Failed")
    }
    const album = await db.manyOrNone('SELECT id, album_id, title, duration_seconds, "order", is_cover, cover_image_url FROM songs WHERE album_id = $1 ORDER BY "order" ASC', [album_id])
    for (let i = 0; i < album.length; i++) {
        album[i].label = []
        const labels = await db.manyOrNone("SELECT name FROM song_labels s INNER JOIN labels l ON s.label_id = l.id WHERE s.song_id = $1", [album[i].id])
        for (const label of labels) {
            album[i].label.push(label.name)
        }
    }
    success(res, 200, album)
}

export async function createAlbum(req, res) {
    const title = req.body.title;
    const artist = req.body.artist;
    const release_year = req.body.release_year;
    const genre = req.body.genre;
    const description = req.body.description;
    const user_id = req.user.id

    try {
        const album = await db.one("INSERT INTO album (title, artist, release_year, genre, description, publisher_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, artist, release_year, genre, description, created_at, updated_at", [title, artist, release_year, genre, description, user_id])
        album.publisher = {
            id: user_id,
            username: req.user.username,
            email: req.user.email
        }
        success(res, 201, album)
    } catch (err) {
        res.sendStatus(500)
    }
}

export async function updateAlbum(req, res) {
    const title = req.body.title
    const description = req.body.description;
    const id = req.params.album_id
    if (!id) {
        error(res, 401, "Validation Failed")
    }

    try {
        const album = await db.one("UPDATE album SET description = $1, title = $2 WHERE id = $3 RETURNING id, title, artist, release_year, publisher_id, genre, description, created_at, updated_at", [description, title, id])
        const publisher = await db.one("SELECT id, username, email FROM users WHERE id=$1", [album.publisher_id])
        album.publisher = publisher
        delete album.publisher_id
        success(res, 201, album)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function deleteAlbum(req, res) {
    const { album_id } = req.params;
    if (!album_id) {
        error(res, 401, "Validation Failed")
    }
    await db.none("DELETE FROM album WHERE id=$1", [album_id])
    res.status(200).json({
        success: true
    })
}