const boxes = document.querySelectorAll(".box")
const threshold = 150;
document.body.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    boxes.forEach(box => {
        const rect = box.getBoundingClientRect()
        const [centerX, centerY] = [rect.left + rect.width / 2, rect.top + rect.height / 2]
        const distX = centerX - x;
        const distY = centerY - y;
        const dist = Math.sqrt(distX ** 2 + distY ** 2)
        if (dist < threshold) {
            box.style.scale = 1 + (1 - dist / threshold) * 0.3
            const glow = box.children.item(0);
            glow.style.left = `${x - rect.left}px`;
            glow.style.top = `${y - rect.top}px`;
        } else {
            box.style.scale = "1";
        }
    })
})