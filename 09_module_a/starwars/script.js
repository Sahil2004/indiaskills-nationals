const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const shots = []
const obstacles = []

let shipX = canvas.width / 2 - 25;
let shipY = canvas.height - 50 - 25;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        shipX -= 10;
    }
    if (e.key === "ArrowRight") {
        shipX += 10;
    }
    if (e.key === "ArrowUp") {
        shipY -= 10;
    }
    if (e.key === "ArrowDown") {
        shipY += 10;
    }
    if (e.key === " ") {
        fire()
    }
})

function drawShip() {
    ctx.fillStyle = "white";
    ctx.fillRect(shipX, shipY, 50, 50)
}

function drawFire(x, y) {
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, 4, 8)
}

function fire() {
    shots.push({
        x: shipX + 25,
        y: shipY,
    })
    drawFire(shipX + 25, shipY)
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function generateObstacle() {
    ctx.fillStyle = "white"
    for (let i = 0; i < getRandomInt(2, 6); i++) {
        const x = getRandomInt(100, canvas.width - 100);
        const y = 100;
        obstacles.push({
            x: x,
            y: y
        })
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 20, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill()
    }
}

function drawObstacle() {
    ctx.fillStyle = "white"
    for (let i = 0; i < obstacles.length; i++) {
        ctx.beginPath();
        ctx.ellipse(obstacles[i].x, obstacles[i].y, 20, 20, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill()
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        for (let j = 0; j < shots.length; j++) {
            if (shots[j].y <= obstacles[i].y && shots[j].y >= obstacles[i].y - 40) {
                if ((shots[j].x >= obstacles[i].x - 20 && (shots[j].x <= obstacles[i].x + 20))) {
                    shots.splice(j, 1)
                    obstacles.splice(i, 1)
                }
            }
        }
    }
}

function update() {
    checkCollision()
    ctx.fillStyle = "blue"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawShip()
    for (let i = 0; i < shots.length; i++) {
        shots[i].y -= 1;
        if (shots[i].y <= 0) {
            shots.splice(i, 1)
        }
        drawFire(shots[i].x, shots[i].y);
    }
    drawObstacle()
}

const obstacleInterval = setInterval(() => {
    generateObstacle()
}, 4000)

const updateObstacleInterval = setInterval(() => {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += 1;
        if (obstacles[i].y >= canvas.height) {
            obstacles.splice(i, 1)
            endGame()
        }
    }
}, 100)

const interval = setInterval(() => {
    update()
}, 20)

function endGame() {
    clearInterval(obstacleInterval)
    clearInterval(updateObstacleInterval)
    clearInterval(interval)
    alert("Game Over!")
}