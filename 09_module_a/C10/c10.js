import "./node_modules/socket.io-client/dist/socket.io.js"
const socket = io("http://3.25.73.121", {
    path: "/09_module_a/c10/api/chat/"
})

const inpt = document.querySelector(".input-control")
const inptForm = document.querySelector(".input-box")
const messageBox = document.querySelector(".message-wrapper")

socket.on("connect", () => {
    console.log("Connected: ", socket.id)
    socket.emit("ping", "hello", (ack) => {
        console.log("Ping ack: ", ack)
    })
})

socket.on("message", (message) => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("message-item")
    const msg = document.createElement("div")
    msg.classList.add("message-content")
    msg.innerText = message
    wrapper.appendChild(msg)
    messageBox.appendChild(wrapper)
})

inptForm.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("message", inpt.value, (ack) => {
        if (ack === "ACK") {
            const wrapper = document.createElement("div")
            wrapper.classList.add("message-item")
            wrapper.classList.add("my")
            const msg = document.createElement("div")
            msg.classList.add("message-content")
            msg.innerText = inpt.value
            wrapper.appendChild(msg)
            messageBox.appendChild(wrapper)
            inpt.value = ""
            return;
        } else {
            setTimeout(() => {
                send()
            }, 100)
        }
    })
})
