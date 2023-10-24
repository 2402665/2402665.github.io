// Bouncing Ball Across Screen

let x;
let y;
let dx;
let dy;
let radius;

let r;
let g;
let b;


  
function changeColor() {
  r = random(0,256);
  g = random(0,256);
  b = random(0,256);
}

function changeDirection() {
  if (dx >= 0) {
    dx = random(1,10);
  }
  else {
    dx = random(1,10);
    dx = dx * -1;
  }
  if (dy >= 0) {
    dy = random(1,10);
  }
  else {
    dy = random(1,10);
    dy = dy * -1;
  }
}

function displayBall() {
  noStroke();
  fill(r, g, b);
  circle(x, y, radius*2);
}

function moveBall() {
  x+=dx;
  y+=dy;
}

function bounce() {
  if (x+radius>=width || x-radius<=0){
    dx = dx*-1;
    changeColor();
  }
  if (y+radius>=height || y-radius<=0){
    dy = dy*-1;
    changeColor();
  }
}

function setup() {
  createCanvas(400, 400);
  x=width/2;
  y=height/2;
  dx=2;
  dy=1.5;
  radius=25;
  changeColor();
}

function draw() {
  background(220);
  displayBall();
  moveBall();
  bounce();
}

function mousePressed() {
  changeDirection();
}