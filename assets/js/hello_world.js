class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
}

class Circle {
    centerX
    centerY
    radius
    color
    constructor(x, y, r, c) {
        this.centerX = x;
        this.centerY = y;
        this.radius = r;
        this.color = c;
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
    Draw(){
        ctx.beginPath();
        ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = this.color.RGBA();
        ctx.stroke();
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
        let circle = new Circle(this.posX, this.posY, this.radius, null);
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
    static normal2 = 3
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
    PushNewTriangleByMousePos(x, y){
        this.drawData.push(new Triangle(x,y,this.startRadius,this.startRotation,this.startColor));
    }
    ChangeDrawData(index,p_x,p_y,p_radius,p_rotate,p_color){
        this.drawData[index].x += p_x;
        this.drawData[index].y += p_y;
        this.drawData[index].radius += p_radius;
        this.drawData[index].rotate += p_rotate;
        this.CheckRotate(index);
        this.drawData[index].color = new Color(
            this.drawData[index].color.r + p_color.r,
            this.drawData[index].color.g + p_color.g,
            this.drawData[index].color.b + p_color.b,
            this.drawData[index].color.a + p_color.a
        );
    }
    ChangeDrawDataPos(index,n_x,n_y){
        this.drawData[index].x = n_x;
        this.drawData[index].y = n_y;
    }
    ChangeDrawDataRotation(index,n_r){
        this.drawData[index].rotate = n_r;
        this.CheckRotate(index);
    }
    CheckRotate(index){
        if(this.drawData[index].rotate > 360){
            this.drawData[index].rotate -= 360;
        }
        if(this.drawData[index].rotate < -360){
            this.drawData[index].rotate += 360;
        }
    }
}

var drawNormalMouse = new DrawMouse(50,0,new Color(0,0,0,1.0));
var drawNormal2Mouse = new DrawMouse(1,0,new Color(256,256,256,1.0));
var drawPointerMouse = new DrawMouse(10,0,new Color(256,256,256,1.0));
var pointerMouseCircleRadius = 50;
var pointerMouseCircleRotate = 0;
var pointerMouseTurningFlag = true;
var mouseStatus = MouseStatus.normal;

function drawFrame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // let circle = new Circle(500, 500, 100, new Color(0,0,0,1.0));
    // circle.Draw();

    switch(mouseStatus){
        case MouseStatus.normal:
            drawNormalMouse.PushNewTriangleByMousePos(mouseX,mouseY);
            break;
        case MouseStatus.normal2:
            drawNormal2Mouse.PushNewTriangleByMousePos(mouseX,mouseY);
            break;
        case MouseStatus.pointer:
            let pointerMouseCircle = new Circle(mouseX,mouseY,pointerMouseCircleRadius,new Color(0,0,0,1.0));
            let pointerMousePath = pointerMouseCircle.GetPointOnCircle(pointerMouseCircleRotate,120);
            for(let i = 0 ; i < 3 ; i++){
                drawPointerMouse.PushNewTriangleByMousePos(pointerMousePath[i].x,pointerMousePath[i].y);
            }
            break;
        case MouseStatus.click:
            break;
        default:
            break;
    }

    drawNormalMouse.startRotation += 2;
    for(let key in drawNormalMouse.drawData){
        drawNormalMouse.drawData[key].Draw();

        drawNormalMouse.ChangeDrawData(key,0,0,-3,4, new Color(0,0,0,-0.06));
        
        if(drawNormalMouse.drawData[key].radius <= 0){
            drawNormalMouse.drawData.splice(key,1);
        }
    }

    drawNormal2Mouse.startRotation += 2;
    for(let key in drawNormal2Mouse.drawData){
        drawNormal2Mouse.drawData[key].Draw();

        drawNormal2Mouse.ChangeDrawData(key,0,0,3,4, new Color(0,0,0,-0.06));
        
        if(drawNormal2Mouse.drawData[key].radius <= 0){
            drawNormal2Mouse.drawData.splice(key,1);
        }
    }

    pointerMouseCircleRotate += 2;
    for(let key in drawPointerMouse.drawData){
        drawPointerMouse.drawData[0].Draw();
        drawPointerMouse.drawData.splice(0,1);
    }
    if(pointerMouseCircleRadius >= 40){
        pointerMouseTurningFlag = true;
    }else if(pointerMouseCircleRadius <= 10){
        pointerMouseTurningFlag = false;
    }
    if(pointerMouseTurningFlag){
        pointerMouseCircleRadius -= 1.6;
    }else{
        pointerMouseCircleRadius += 1.6;
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