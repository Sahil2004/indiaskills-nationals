import express from "express"
import cors from "cors"
import path from "path"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import lusca from "lusca"
import session from "express-session"

const limiter = rateLimit({
    windowMs: 15 * 1000 * 60, // 15 minutes
    limit: 100
})

const app = express()
app.use(helmet())

app.use(session({
    secret: "some-secret-key",
    resave: false,
    saveUninitialized: true
}))

app.use(cors({
    origin: ["http://localhost:3002", "http://3.25.73.121"],
    methods: ["GET", "POST"],
    credentials: true,
}))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(limiter)
app.use(lusca.csrf())

app.set('trust proxy', 1);

app.set("view engine", "ejs")
app.set("views", path.resolve("./src/views"))

const names = []

app.get("/", (req, res) => {
    res.render("home", {
        name: "Sahil"
    })
})

app.post("/names", (req, res) => {
    const name = req.body.name
    names.push(name)
    res.render("home", {
        name: "Sahil",
        names: names
    })
})

app.listen(3002, () => {
    console.log("Listening on http://localhost:3002")
})