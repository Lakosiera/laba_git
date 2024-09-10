// метод линейной интерполяции
function lerp(start, end, speed) {
    return (end - start) * speed + start;
}

// инициируем фрэймворк рэндэра
const render = Render();

let speed = -1;
let animate = false;

// координаты мыши
const mouse = {
    x: 0,
    y: 0,
};

// настраиваем канвас
render.setup((canvas) => {
    let move = true;

    // регистрируем событие одинарный щелчок
    canvas.addEventListener("click", (event) => {
        animate = true;
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    });

    // регистрируем событие двойной щелчок
    canvas.addEventListener("dblclick", (event) => {
        animate = false;

        move = !move;

        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!move) return;
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    });

    canvas.addEventListener("wheel", (event) => {
        speed += event.deltaY * 0.01;
    });
});

// создаем изображение
var funny = new Image();
// указываем что это svg
funny.src = "funny.svg";
// указываем hfpvth
funny.width = 150;


const posSol = { x: 0, y: 0 };

// переменная для анимации облаков
let offsetX = 0;

// TODO https://developer.mozilla.org/ru/docs/Web/API/Canvas_API/Tutorial/Basic_animations
// настраиваем сцену для рисования
render.scene((ctx, canvas) => {
    // считаем плавное движение солнца за мышкой
    posSol.x = lerp(posSol.x, mouse.x, 0.05);
    posSol.y = lerp(posSol.y, mouse.y, 0.05);

    // если анимируем
    if (animate) {
        // ограничиваем движение облаков шириной канваса
        if (Math.abs(offsetX) > canvas.width) {
            offsetX = canvas.width * -Math.sign(offsetX);
        }
        // считаем движение облаков
        offsetX = lerp(offsetX, offsetX + speed, 0.5);
    }

    // рисуем солнце
    sol(ctx);

    // рисуем траву
    grass(ctx, canvas);

    // сохраняем контекст рисования
    ctx.save();

    // онимируем движение облака
    ctx.translate(offsetX, 0);
    // рисуем облако 1
    cloudAndRain1(ctx, canvas, 110, 240);
    
    // онимируем движение облака
    ctx.translate(offsetX / 4, 0);
    ctx.translate(200, 10);
    // рисуем облако 2
    cloudAndRain2(ctx, canvas, 130, 330);

    // восстанавливаем контекст рисования
    ctx.restore();

    // рисуем линию до солнца
    dashLine(ctx);
});

// переменная для анимации дождя
let offsetY = 0;

// переменная для анимации количесво дождя
let steps = 0
function rain(ctx, canvas, width, height) {
    if (animate) {
        // если анимируем добавляем к числу рядов капель
        steps += 0.04
        steps = Math.min(steps, 12)
    }

    // сохраняем контекст рисования
    ctx.save()

    for (let i = 0; i < steps; i++) {
        ctx.translate(0,  30);
        // рисуем ряд капель в цикле
        dropRow(ctx, width);
    }
    // восстанавливаем контекст рисования
    ctx.restore();
}

// переменные для анимации дождя
let dropSpace = 40;
let time=0
let sin=0
let cos=0
function dropRow(ctx, width) {
    if (animate) {
        // меняем переменеую для анимации капли
        time += 0.004;
    }
    // сохраняем контекст рисования
    ctx.save();

    // параметры для рисования
    ctx.lineCap = "round";
    ctx.setLineDash([8, 12]);

    for (let i = 0; i < width / dropSpace; i++) {
        sin = Math.sin(time + i * 0.7)
        cos = Math.cos(time + i * 0.3)
        
        ctx.translate(dropSpace  + cos,  1 - sin*.2);
        // рисуем линия для капили дождя в цикле
        ctx.moveTo(cos*2, sin);
        ctx.lineTo(4-cos*4, 16-sin*4);

        ctx.stroke();
    }
    // восстанавливаем контекст рисования
    ctx.restore();
}
// рисуем облако и дождь
function cloudAndRain1(ctx, canvas, startY, width) {
    ctx.save();
    ctx.translate(20, startY  - 20);
    // дождь
    rain(ctx, canvas, width, canvas.height - startY);
    ctx.restore();
    
    // облако
    cloud1(ctx);
}

// рисуем облако и дождь
function cloudAndRain2(ctx, canvas, startY, width) {
    ctx.save();
    ctx.translate(10, startY-20);
    // дождь
    rain(ctx, canvas, width, canvas.height - startY);
    ctx.restore();
    
    // облако
    cloud2(ctx);
}

// рисуем облако
function cloud1(ctx) {
    // сохраняем контекст рисования
    ctx.save();

    // параметры для рисования
    ctx.fillStyle = "#9cd8ffff";
    ctx.strokeStyle = "#242136ff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    ctx.translate(-60, -70);

    ctx.beginPath();

    // рисем облако кривыми
    ctx.moveTo(130, 181);
    ctx.bezierCurveTo(94, 183, 96, 133, 139, 136);
    ctx.bezierCurveTo(154, 77, 226, 72, 250, 103);
    ctx.bezierCurveTo(279, 92, 325, 95, 337, 129);
    ctx.bezierCurveTo(383, 120, 394, 178, 353, 177);
    ctx.lineTo(130, 181);
    ctx.fill();

    ctx.stroke();

    // восстанавливаем контекст рисования
    ctx.restore();
}

function cloud2(ctx) {
    // сохраняем контекст рисования
    ctx.save();

    // параметры для рисования
    ctx.fillStyle = "#9cd8ffff";
    ctx.strokeStyle = "#242136ff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    ctx.beginPath();

    // рисем облако кривыми
    ctx.moveTo(50, 130);
    ctx.bezierCurveTo(54, 111, 71, 91, 96, 91);
    ctx.bezierCurveTo(91, 13, 212, 3, 266, 82);
    ctx.bezierCurveTo(295, 71, 338, 69, 350, 103);
    ctx.bezierCurveTo(385, 99, 400, 112, 400, 130);
    ctx.lineTo(50, 130);
    ctx.fill();
    ctx.stroke();

    // восстанавливаем контекст
    ctx.restore();
}

// переменные для анимации травы
let growSpeed1 = 0.007;
let growSpeed2 = 0.02;
let growProgress1 = -1; // отриуательное значени чобы отложить начало роста
let growProgress2 = -3; // отриуательное значени чобы отложить начало роста
let grassSize1 = 0;
let grassSize2 = 0;
// рисуем траву
function grass(ctx, canvas) {
    if (animate) {
        // меняем переменные при анимации
        growProgress1 = Math.min(growProgress1 + growSpeed1, 1);
        growProgress2 = Math.min(growProgress2 + growSpeed2, 1);

        grassSize1 = 300 * growProgress1;
        grassSize2 = 200 * growProgress2;
    }
    // рисем SVG картинку
    ctx.drawImage(
        funny,
        canvas.width * 0.25 - grassSize1 / 2,
        20 + canvas.height - grassSize1,
        grassSize1,
        grassSize1
    );
    // рисем SVG картинку
    ctx.drawImage(
        funny,
        canvas.width * 0.75 - grassSize2 / 2,
        canvas.height - grassSize2,
        grassSize2,
        grassSize2
    );
}

// рисуем линию до солнца
function dashLine(ctx) {
    // сохраняем контекст рисования
    ctx.save();

    // параметры для рисования
    ctx.strokeStyle = "rgb(255 0 0)";
    ctx.setLineDash([4, 8]);

    ctx.beginPath();
    ctx.moveTo(posSol.x, posSol.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();

    // восстанавливаем контекст рисования
    ctx.restore();
}

// рисование солнца из примера https://developer.mozilla.org/ru/docs/Web/API/Canvas_API/Tutorial/Basic_animations
function sol(ctx) {
    // сохраняем контекст рисования
    ctx.save();

    // параметры для рисования
    ctx.fillStyle = "rgb(0 0 0 / 40%)";
    ctx.strokeStyle = "rgb(0 153 255 / 40%)";

    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(posSol.x, posSol.y, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();
    ctx.restore();

    // Earth
    // сохраняем контекст чтобы игнорировать дальнейшие изменения после востановления
    ctx.save();

    ctx.translate(posSol.x, posSol.y);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 20, 0, 0, 2 * Math.PI);
    ctx.fill();

    const time = new Date();
    ctx.rotate(
        ((2 * Math.PI) / 60) * time.getSeconds() +
            ((2 * Math.PI) / 60000) * time.getMilliseconds()
    );
    ctx.translate(105, 0);

    const gradient = ctx.createLinearGradient(0, 0, 40, 0);

    gradient.addColorStop(0, "rgb(0 0 0 / 100%)");
    gradient.addColorStop(0.5, "rgb(0 0 0 / 40%)");
    gradient.addColorStop(1, "rgb(0 0 0 / 00%)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, -12, 40, 24);

    // земля
    ctx.fillStyle = "rgb(0 0 255 / 60%)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 12, 0, 0, 2 * Math.PI);
    ctx.fill();

    // луна
    // сохраняем контекст чтобы игнорировать дальнейшие изменения после востановления
    ctx.save();

    ctx.rotate(
        ((2 * Math.PI) / 6) * time.getSeconds() +
            ((2 * Math.PI) / 6000) * time.getMilliseconds()
    );
    ctx.translate(0, 28.5);

    // луна
    ctx.fillStyle = "rgb(255 255 255 / 40%)";
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 4, 0, 0, 2 * Math.PI);
    ctx.fill();

    // луна
    // восстанавливаем контекст рисования
    ctx.restore();

    // земля
    // восстанавливаем контекст рисования
    ctx.restore();
}

document.addEventListener("DOMContentLoaded", (event) => {
    // страница загруже можно запускать код
    // запускаем рисование для канваса с заданным id
    render.start("myCanvas");
});
