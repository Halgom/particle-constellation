const color = "#8ffff8";
const densityFact = 1;
const lineLengthFactor = 250;
const xSpeedFunc = () => Math.random() - 0.5;
const ySpeedFunc = () => Math.random() - 0.5;
const zSpeedFunc = () => Math.random() - 0.5;
const maxLinkLength = lineLengthFactor / densityFact;
const canvasContainer = document.querySelector("*:has(>canvas#particle-constellation)");
const canvas = canvasContainer.querySelector("canvas");
function resizeCanvas() {
    let canvasWidth = canvasContainer.clientWidth;
    let canvasHeigth = canvasContainer.clientHeight;
    canvas.setAttribute("width", `${canvasWidth}`);
    canvas.setAttribute("height", `${canvasHeigth}`);
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
}
resizeCanvas();
addEventListener("resize", resizeCanvas);
const c = canvas.getContext("2d", { alpha: true });
const depth = lineLengthFactor;
class Point {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * (depth - 1) + depth;
        this.xSpeed = xSpeedFunc();
        this.ySpeed = ySpeedFunc();
        this.zSpeed = zSpeedFunc();
    }
    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.z += this.zSpeed;
        if (this.x < 0)
            this.x += canvas.width;
        if (this.x > canvas.width)
            this.x -= canvas.width;
        if (this.y < 0)
            this.y += canvas.height;
        if (this.y > canvas.height)
            this.y -= canvas.height;
        if (this.z < 0 || this.z > depth)
            this.zSpeed = -this.zSpeed;
    }
}
const points = [];
const nbPoint = densityFact * (canvas.width * canvas.height) / 2e4;
for (let i = 0; i < nbPoint; i++) {
    points.push(new Point());
}
requestAnimationFrame(draw);
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = color;
    c.strokeStyle = color;
    for (let i = 0; i < points.length; i++) {
        c.globalAlpha = 1;
        c.beginPath();
        c.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        c.fill();
        for (let j = 0; j < points.length; j++) {
            let distance = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2 + (points[i].z - points[j].z) ** 2);
            if (distance > 2 && distance < maxLinkLength) {
                c.globalAlpha = (maxLinkLength - distance) / maxLinkLength;
                c.beginPath();
                c.moveTo(points[i].x, points[i].y);
                c.lineTo(points[j].x, points[j].y);
                c.stroke();
            }
        }
        points[i].update();
    }
    requestAnimationFrame(draw);
}
