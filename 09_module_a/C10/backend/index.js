import { Server } from "socket.io"

const io = new Server(3000, {
    cors: { origin: "*" },
    path: "/chat/"
})

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("message", (msg, callback) => {
        callback("ACK")
        socket.broadcast.emit("message", msg)
    })
    socket.on("check", (msg, callback) => {
        if (msg === "hello") callback("hi")
    })
})
