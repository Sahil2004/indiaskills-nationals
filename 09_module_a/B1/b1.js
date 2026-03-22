const reader = new FileReader()
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");
const heightBar = document.querySelector("#height")
const widthBar = document.querySelector("#width")
let fileContent = null;
let ar = 0;
ctx.font = "24px serif"
ctx.fillText("Drop your image here", 150, 250)
const imgEl = document.createElement("img")
let scaledWidth = 0;
let scaledHeight = 0;
document.addEventListener("dragover", (e) => {
    e.preventDefault()
    const isFile = e.dataTransfer.types.includes("Files")
    if (isFile) {
        e.dataTransfer.dropEffect = "copy"
    }
})

document.addEventListener("drop", (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    for (const file of files) {
        if (file.type.includes("image")) {
            reader.readAsDataURL(file)
        }
    }
})
reader.onload = () => {
    fileContent = reader.result
    if (fileContent) {
        imgEl.src = fileContent
        imgEl.addEventListener("load", () => {
            const width = imgEl.width;
            const height = imgEl.height;
            ar = width / height;
            ctx.clearRect(0, 0, 500, 500)
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, 500, 500)
            if (ar > 1) {
                // width > height
                scaledWidth = 500;
                scaledHeight = 500 * (2 - ar)
                widthBar.setAttribute("max", 500)
                heightBar.setAttribute("max", 500 * ar)
            } else if (ar < 1) {
                // width < height
                scaledWidth = 500 * ar;
                scaledHeight = 500;
                widthBar.setAttribute("max", 500 * ar)
                heightBar.setAttribute("max", 500)
            } else {
                // square
                scaledWidth = 500;
                scaledHeight = 500;
                widthBar.setAttribute("max", 500)
                heightBar.setAttribute("max", 500)
            }
            ctx.drawImage(imgEl, 0, 0, scaledWidth, scaledHeight)
            drawCropSq()
        })
    }
}
function drawCropSq() {
    ctx.strokeRect(100, 100, parseInt(widthBar.value), parseInt(heightBar.value))
}

function update(x = 100, y = 100) {
    ctx.clearRect(0, 0, 500, 500)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 500, 500)
    ctx.drawImage(imgEl, 0, 0, scaledWidth, scaledHeight)
    ctx.strokeRect(x, y, parseInt(widthBar.value), parseInt(heightBar.value))
}


let isDragging = false;
let lastX = 100;
let lastY = 100;
let prevX = 0;
let prevY = 0;

widthBar.addEventListener("input", () => {
    update(lastX, lastY)
})
heightBar.addEventListener("input", () => {
    update(lastX, lastY)
})
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect()
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top]
    if ((x >= lastX && x <= lastX + parseInt(widthBar.value)) && (y >= lastY && y <= lastY + parseInt(heightBar.value))) {
        isDragging = true;
        prevX = (x - lastX);
        prevY = y - lastY
    }
})

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect()
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top]
    lastX = x - prevX;
    lastY = y - prevY;
    prevX = x - lastX
    prevY = y - lastY
    update(lastX, lastY)
})

canvas.addEventListener("mouseup", () => {
    isDragging = false;
})
function download() {
    const newCanvas = document.createElement("canvas")
    const scaleX = imgEl.naturalWidth / scaledWidth;
    const scaleY = imgEl.naturalHeight / scaledHeight;
    newCanvas.width = parseInt(widthBar.value) * scaleX;
    newCanvas.height = parseInt(heightBar.value) * scaleY;
    const newCtx = newCanvas.getContext("2d")
    newCtx.drawImage(imgEl, lastX * scaleX, lastY * scaleY, newCanvas.width, newCanvas.height, 0, 0, newCanvas.width, newCanvas.height)
    const data = newCanvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = data;
    a.download = "result.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
