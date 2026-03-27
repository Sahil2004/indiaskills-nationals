import express from "express"
import cors from "cors"
import path from "path"

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))

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