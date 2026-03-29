import express from "express"
import cors from "cors"
import { authRouter } from "./routers/authRouter.js"
import { albumRouter } from "./routers/albumRouter.js"
import { usersRouter } from "./routers/usersRouter.js"
import { songsRouter } from "./routers/songsRouter.js"

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:3000", "http://3.25.73.121/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use("/api/uploads", express.static("uploads"))
app.use("/api/albums", albumRouter)
app.use('/api/users', usersRouter)
app.use("/api/songs", songsRouter)
app.use("/api", authRouter)

app.listen(3001, () => {
    console.log("Started server on http://localhost:3001")
})