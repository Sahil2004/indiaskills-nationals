import crypto from "crypto"

export function generateAccessToken(username) {
    return crypto.createHash("md5").update(username).digest("hex").toLowerCase()
}