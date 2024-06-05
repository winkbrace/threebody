const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

startPos = {
    1: {x: 100, y: 100},
    2: {x: 600, y: 300},
    3: {x: 200, y: 700},
};

for (let i = 1; i <= 3; i++) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, startPos[i].x, startPos[i].y, 64, 64);
    img.src = `planet${i}.png`
}

// TODO make proper data objects for each planet
