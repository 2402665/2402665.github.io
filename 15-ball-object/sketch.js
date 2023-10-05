// Ball Object Notation Demo
// Ethan
// Oct 5

let theBall = {
  x: 50,
  y: 50,
  radius: 50,
  r: 255,
  g: 0,
  b: 0,
  dx: -4,
  dy: -3,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  moveBall();
  drawBall();
}

function moveBall(){
  theBall.x+= theBall.dx;
  theBall.y+= theBall.dy;
  if (theBall.x>=width+theBall.radius){
    theBall.x = 0 - theBall.radius;
  }
  else if (theBall.x<=0-theBall.radius){
    theBall.x = width + theBall.radius;
  }
  if (theBall.y>=height+theBall.radius){
    theBall.y = 0 - theBall.radius;
  }
  else if (theBall.y<=0-theBall.radius){
    theBall.y = height + theBall.radius;
  }
}

function drawBall(){
  fill(theBall.r,theBall.g,theBall.b);
  circle(theBall.x,theBall.y,theBall.radius*2);
}