const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const reader = new FileReader()
const imgEl = document.createElement("img")
const value = document.querySelector("#value")
let scale = 0;
let lock = false;

ctx.font = "24px serif"
ctx.fillText("Drop your image here", 400, 250)

document.addEventListener("dragover", (e) => {
    e.preventDefault()
    const isFile = e.dataTransfer.types.includes("File");
    if (isFile) {
        e.dataTransfer.dropEffect = "copy"
    }
})

document.addEventListener("drop", (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file.type.includes("image")) return;
    reader.readAsDataURL(file);
})

reader.onload = () => {
    imgEl.src = reader.result;
    imgEl.addEventListener("load", () => {
        scale = Math.min(canvas.width / (imgEl.naturalWidth + 0.0), canvas.height / (imgEl.naturalHeight + 0.0))
        update()
    })
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imgEl, 0, 0, imgEl.naturalWidth * scale, imgEl.naturalHeight * scale)
}

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2])
    if (!lock)
        value.value = hex;
})

canvas.addEventListener("click", (e) => {
    e.preventDefault()
    lock = !lock;
})

function rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

async function copy() {
    try {
        await navigator.clipboard.writeText(value.value)
        alert(`Copied! Hex Code: ${value.value}`)
    } catch (err) {
        alert("Error copying hex code to clipboard.")
    }
}