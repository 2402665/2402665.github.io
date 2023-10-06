// Ball Object Notation Demo
// Ethan
// Oct 5

let theBall;

function setup() {
  createCanvas(windowWidth, windowHeight);
  theBall = spawnBall();
}

function draw() {
  background(220);
  moveBall();
  drawBall();
}

function spawnBall(){
  let newBall = {
    radius: random(5,50),
    x: random(width),
    y: random(height),
    r: random(255),
    g: random(255),
    b: random(255),
    dx: random(-5,5),
    dy: random(-5,5),
  };
  return newBall;
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