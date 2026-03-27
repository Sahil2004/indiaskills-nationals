import express from "express"
import cors from "cors"
import { authRouter } from "./routers/authRouter.js"
import { albumRouter } from "./routers/albumRouter.js"
import { usersRouter } from "./routers/usersRouter.js"
import { songsRouter } from "./routers/songsRouter.js"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/uploads", express.static("uploads"))
app.use("/api/albums", albumRouter)
app.use('/api/users', usersRouter)
app.use("/api/songs", songsRouter)
app.use("/api", authRouter)

app.listen(3001, () => {
    console.log("Started server on http://localhost:3001")
})