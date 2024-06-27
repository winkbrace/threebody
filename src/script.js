const canvasPlanets = document.getElementById('planets');
const ctxPlanets = canvasPlanets.getContext("2d");

const canvas = document.getElementById('vectors');
const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

const G = 5000; // Gravitational constant. Change to alter gravitational force.
const speedMagnitude = 10;

// Initialize planets
const planets = {
    aldebaran: {
        name: "Aldebaran",
        img: "img/planet1.png",
        pos: {x: 100, y: 100},
        mass: 5,
        V2: {angle: 360, speed: 4},
        vectors: {current: {}, gravity: {}, combined: {}}
    },
    bellatrix: {
        name: "Bellatrix",
        img: "img/planet2.png",
        pos: {x: 600, y: 300},
        mass: 5,
        V2: {angle: 100, speed: 3},
        vectors: {current: {}, gravity: {}, combined: {}}
    },
    castor: {
        name: "Castor",
        img: "img/planet3.png",
        pos: {x: 200, y: 700},
        mass: 5,
        V2: {angle: 210, speed: 5},
        vectors: {current: {}, gravity: {}, combined: {}}
    },
};

const next = {
    aldebaran: {pos: {x: 100, y: 100}, V2: {}},
    bellatrix: {pos: {x: 600, y: 300}, V2: {}},
    castor:    {pos: {x: 200, y: 700}, V2: {}},
};

const clearCanvas = function () {
    ctxPlanets.clearRect(0, 0, canvasPlanets.width, canvasPlanets.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const drawArrowHead = function (pos, angle, color) {
    const arrowSize = 20;
    const startAngle = angle - Math.PI - (Math.PI / 6);
    const endAngle = angle - Math.PI + (Math.PI / 6);
    // move starting point of arrow a little further to get a pretty point
    const x = pos.x + (ctx.lineWidth * Math.cos(angle));
    const y = pos.y + (ctx.lineWidth * Math.sin(angle));

    ctx.moveTo(x, y);
    ctx.arc(x, y, arrowSize, startAngle, endAngle);
    ctx.lineTo(x, y);
    ctx.fillStyle = color;
    ctx.fill();
}

const drawVector = function (start, end, angle, color) {
    ctx.beginPath();

    // draw vector line
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.stroke();

    // add arrow point
    drawArrowHead(end, angle, color);
}

const drawPlanetVector = function (planet) {
    const magnitude = planet.V2.speed * speedMagnitude;
    const angle = (planet.V2.angle) * (Math.PI / 180);
    const start = {x: planet.pos.x, y: planet.pos.y}
    const end = {
        x: start.x + Math.cos(angle) * magnitude,
        y: start.y + Math.sin(angle) * magnitude
    };

    planet.vectors.current = {start, end};

    drawVector(start, end, angle, "yellow");
}

const calculateGravitationalVectorEndPosition = function (p1, p2) {
    const dx = p2.pos.x - p1.pos.x;
    const dy = p2.pos.y - p1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (G * p1.mass * p2.mass) / (distance * distance);
    const angle = Math.atan2(dy, dx);

    return {
        x: p1.pos.x + Math.cos(angle) * force,
        y: p1.pos.y + Math.sin(angle) * force
    };
}

const drawGravityVector = function (planet) {
    const [p1, p2] = Object.values(planets).filter((p) => p.name !== planet.name);
    const end1 = calculateGravitationalVectorEndPosition(planet, p1);
    const end2 = calculateGravitationalVectorEndPosition(planet, p2);

    const start = {x: planet.pos.x, y: planet.pos.y}
    const end = {x: end1.x + end2.x - start.x, y: end1.y + end2.y - start.y};
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    planet.vectors.gravity = {start, end};

    drawVector(start, end, angle, "red");
}

const drawCombinedVector = function (planet) {
    const start = {x: planet.pos.x, y: planet.pos.y}
    const end = {
        x: planet.vectors.current.end.x + planet.vectors.gravity.end.x - start.x,
        y: planet.vectors.current.end.y + planet.vectors.gravity.end.y - start.y
    };
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    planet.vectors.combined = {start, end};

    drawVector(start, end, angle, "orange");
}

const setNextValues = function (planet) {
    const planetId = planet.name.toLowerCase();
    const {start, end} = planet.vectors.combined;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const speed = Math.sqrt((dx * dx) + (dy * dy)) / speedMagnitude;

    next[planetId].pos.x += Math.cos(angle) * speed;
    next[planetId].pos.y += Math.sin(angle) * speed;
    next[planetId].V2.speed = speed;
    next[planetId].V2.angle = ((angle * (180 / Math.PI)) + 360) % 360;

    document.getElementById(planetId + '-speed-next').innerText = next[planetId].V2.speed.toFixed(1);
    document.getElementById(planetId + '-angle-next').innerText = next[planetId].V2.angle.toFixed(1);
}

const draw = function ()
{
    clearCanvas();

    for (let planetId in planets) {
        const planet = planets[planetId];
        // draw planet
        const size = planet.mass * 10;
        const img = new Image();
        img.onload = () => ctxPlanets.drawImage(img, planet.pos.x - (size / 2), planet.pos.y - (size / 2), size, size);
        img.src = planet.img;

        // draw vector
        drawPlanetVector(planet);
        drawGravityVector(planet);
        drawCombinedVector(planet);

        setNextValues(planet);
    }
}

const advance = function() {
    for (let planetId in planets) {
        planets[planetId].pos.x = next[planetId].pos.x;
        planets[planetId].pos.y = next[planetId].pos.y;
        planets[planetId].V2.speed = next[planetId].V2.speed;
        planets[planetId].V2.angle = next[planetId].V2.angle;
    }

    draw();
}

// initialize html form
for (let planetId in planets) {
    const planet = planets[planetId];
    const planetName = planet.name.toLowerCase();

    const inputMass = document.getElementById(planetName + '-mass');
    const inputSpeed = document.getElementById(planetName + '-speed');
    const inputAngle = document.getElementById(planetName + '-angle');
    inputMass.value = planet.mass;
    inputSpeed.value = planet.V2.speed;
    inputAngle.value = planet.V2.angle;

    inputMass.addEventListener('change', (e) => {
        planet.mass = parseInt(e.target.value);
        return draw();
    });
    inputSpeed.addEventListener('change', (e) => {
        planet.V2.speed = parseInt(e.target.value);
        return draw();
    });
    inputAngle.addEventListener('change', (e) => {
        planet.V2.angle = parseInt(e.target.value);
        return draw();
    });
}

document.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('change', (e) => {
        document.getElementById(e.target.id + '-value').innerText = e.target.value;
    });
    // trigger change event to show values
    input.dispatchEvent(new Event('change'));
});

document.getElementById('step').addEventListener('click', () => advance());
let playInterval;
document.getElementById('play').addEventListener('click', () => {
    playInterval = setInterval(() => advance(), 100);
    document.getElementById('stop').style.backgroundColor = 'red';
});
document.getElementById('stop').addEventListener('click', (e) => {
    clearInterval(playInterval);
    e.target.style.backgroundColor = 'darkorange';
});
