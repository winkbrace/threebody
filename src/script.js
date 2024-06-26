const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

// Initialize planets
const planets = [
    {name: "Aldebaran", img: "img/planet1.png", pos: {x: 100, y: 100}, mass: 5, V2: {angle: 120, speed: 4}},
    {name: "Bellatrix", img: "img/planet2.png", pos: {x: 600, y: 300}, mass: 5, V2: {angle: 260, speed: 3}},
    {name: "Castor",    img: "img/planet3.png", pos: {x: 200, y: 700}, mass: 5, V2: {angle: 30,  speed: 6}},
];

const clearCanvas = function ()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const drawArrowHead = function (pos, angle)
{
    const arrowSize = 20;
    const startAngle = angle - Math.PI - (Math.PI / 6);
    const endAngle = angle - Math.PI + (Math.PI / 6);
    // move starting point of arrow a little further to get a pretty point
    const x = pos.x + (ctx.lineWidth * Math.cos(angle));
    const y = pos.y + (ctx.lineWidth * Math.sin(angle));

    ctx.moveTo(x, y);
    ctx.arc(x, y, arrowSize, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fillStyle = "white";
    ctx.fill();
}

const drawVector = function (pos, V2)
{
    const center = {x: pos.x + 32, y: pos.y + 32}
    const magnitude = V2.speed * 20;
    const angle = (V2.angle - 90) * (Math.PI / 180);
    const end = {
        x: center.x + Math.cos(angle) * magnitude,
        y: center.y + Math.sin(angle) * magnitude
    };

    ctx.beginPath();

    // draw vector line
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // add arrow point
    drawArrowHead(end, angle);
}

const drawPlanets = function ()
{
    clearCanvas();

    for (let planet of planets) {
        // draw planet
        const img = new Image();
        img.onload = () => ctx.drawImage(img, planet.pos.x, planet.pos.y, 64, 64);
        img.src = planet.img;

        // draw vector
        drawVector(planet.pos, planet.V2);
    }
}

// initialize html form
for (let planet of planets) {
    const planetName = planet.name.toLowerCase();

    const inputMass = document.getElementById(planetName + '-mass');
    const inputSpeed = document.getElementById(planetName + '-speed');
    const inputAngle = document.getElementById(planetName + '-angle');
    inputMass.value = planet.mass;
    inputSpeed.value = planet.V2.speed;
    inputAngle.value = planet.V2.angle;

    inputMass.addEventListener('change', (e) => {
        planet.mass = parseInt(e.target.value);
        return drawPlanets();
    });
    inputSpeed.addEventListener('change', (e) => {
        planet.V2.speed = parseInt(e.target.value);
        return drawPlanets();
    });
    inputAngle.addEventListener('change', (e) => {
        planet.V2.angle = parseInt(e.target.value);
        return drawPlanets();
    });
}

document.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('change', (e) => {
        document.getElementById(e.target.id + '-value').innerText = e.target.value;
    });
    // trigger change event to show values
    input.dispatchEvent(new Event('change'));
});

drawPlanets();
