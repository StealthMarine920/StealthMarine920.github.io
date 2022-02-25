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

/*function drawTriangle(x, y, r, rotate, color) {
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
}*/

class Triangle{
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
    Draw(){
        let angle = 120;
        let circle = new Circle(this.posX, this.posY, this.radius);
        var path = circle.GetPointOnCircle(this.rotate, angle);

        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.color.RGBA();
        ctx.stroke();
    }
}

class MouseStatus{
    static normal = 0
    static pointer = 1
    static click = 2
}

class DrawMouse{
    drawData = []
    startRadius
    startRotation
    startColor
    constructor(startRadius,startRotation,startColor){
        this.startRadius = startRadius;
        this.startRotation = startRotation;
        this.startColor = startColor;
    }
    PushNewByMousePos(x, y){
        this.drawData.push(new Triangle(x,y,this.startRadius,this.startRotation,this.startColor));
    }
    ChangeDrawData(index,p_x,p_y,p_radius,p_rotate,p_color){

    }
}

var drawNormalMouse = new DrawMouse(50,0,new Color(0,0,0,1.0));
var drawPointerMouse = new DrawMouse(1,0,new Color(256,256,256,1.0));
var mouseStatus = MouseStatus.normal;

function drawFrame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    switch(mouseStatus){
        case MouseStatus.normal:
            drawNormalMouse.PushNewByMousePos(mouseX,mouseY);
            break;
        case MouseStatus.pointer:
            drawPointerMouse.PushNewByMousePos(mouseX,mouseY);
            break;
        case MouseStatus.click:
            break;
        default:
            break;
    }

    drawNormalMouse.startRotation += 2;
    for(let key in drawNormalMouse.drawData){
        drawNormalMouse.drawData[key].Draw();

        drawNormalMouse.drawData[key].radius -= 3;
        drawNormalMouse.drawData[key].rotate += 4;
        drawNormalMouse.drawData[key].color = new Color(0,0,0,drawNormalMouse.drawData[key].color.a - 0.05);
        
        if(drawNormalMouse.drawData[key].radius <= 0){
            drawNormalMouse.drawData.splice(key,1);
        }
    }

    drawPointerMouse.startRotation += 2;
    for(let key in drawPointerMouse.drawData){
        drawPointerMouse.drawData[key].Draw();

        drawPointerMouse.drawData[key].radius += 3;
        drawPointerMouse.drawData[key].rotate += 4;
        drawPointerMouse.drawData[key].color = new Color(256,256,256,drawPointerMouse.drawData[key].color.a - 0.05);
        
        if(drawPointerMouse.drawData[key].radius <= 0){
            drawPointerMouse.drawData.splice(key,1);
        }
    }

    raf = window.requestAnimationFrame(drawFrame);
}

var canvas = document.getElementById("hello_world_canvas");
//canvas.width = window.screen.width;
//canvas.height = window.screen.height;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

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
    $(window).resize(function() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
    });
    $(".content").on("mousedown", function(){
        console.log("x:" + mouseX + " y:" + mouseY);

    });
    $(".hello_world").on("mouseover", function(){
        mouseStatus = MouseStatus.pointer;
    });
    $(".hello_world").on("mouseleave", function(){
        mouseStatus = MouseStatus.normal;
    });
});