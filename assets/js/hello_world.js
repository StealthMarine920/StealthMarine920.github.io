class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}

class Circle {
    constructor(x, y, r) {
        this.centerX = x;
        this.centerY = y;
        this.radius = r;
    }
    GetPointOnCircle(startAngle, angle) {
        let x = this.centerX;
        let y = this.centerY;
        let r = this.radius;
        let lth = 360 / angle;
        let list = []
        for (let i = 0; i < lth; i++) {
            list.push(new Point(x + (r * Math.cos((angle * i + startAngle) * Math.PI / 180)),
                y + (r * Math.sin((angle * i + startAngle) * Math.PI / 180))))
        }
        return list
    }
}

class Color {
    r
    g
    b
    a
    constructor(r,g,b,a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    RGBA(){
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    RGB(){
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
}

function drawTriangle(x, y, r, rotate, color) {
    let angle = 120;
    let circle = new Circle(x, y, r);
    var path = circle.GetPointOnCircle(rotate, angle);

    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

class DrawTriangle{
    posX
    posY
    radius
    rotate
    color
    constructor(posX,posY,radius,rotate,color){
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.rotate = rotate;
        this.color = color;
    }
}

let drawData = [];
let startRadius = 50;
let startRotation = 0;
let startColor = new Color(0,0,0,1.0);

function drawFrame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawData.push(new DrawTriangle(mouseX,mouseY,startRadius,startRotation,startColor));
    startRotation += 4;

    for(let key in drawData){
        drawTriangle(drawData[key].posX, drawData[key].posY, drawData[key].radius, drawData[key].rotate, drawData[key].color.RGBA());
        drawData[key].radius -= 3;
        drawData[key].rotate += 6;
        drawData[key].color = new Color(0,0,0,drawData[key].color.a - 0.05);
        
        if(drawData[key].radius <= 0){
            drawData.splice(key,1);
        }
    }

    raf = window.requestAnimationFrame(drawFrame);
}

var canvas = document.getElementById("hello_world_canvas");
canvas.width = window.screen.width;
canvas.height = window.screen.height;
//canvas.width = document.body.clientWidth;
//canvas.height = document.body.clientHeight;

var ctx = canvas.getContext("2d");

let mouseX;
let mouseY;

document.onmousemove = function(e){
    ev = e || window.event;
    mouseX = ev.clientX;
    mouseY = ev.clientY;
};

let raf;
drawFrame();

$(document).ready(function(){
    $(".content").mousedown(function(){
        console.log("x:" + mouseX + " y:" + mouseY);

    });
});