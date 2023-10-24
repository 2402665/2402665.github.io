// Ball Object Notation Demo - Array Version
// Ethan
// Oct 5

let allBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  makeBall();
}

function draw() {
  background(220);
  for (let eachBall=0; eachBall<allBalls.length; eachBall++){
    moveBall(allBalls[eachBall]);
    drawBall(allBalls[eachBall]);
  }
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

function moveBall(theBall){
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

function drawBall(theBall){
  fill(theBall.r,theBall.g,theBall.b);
  circle(theBall.x,theBall.y,theBall.radius*2);
}

function makeBall(x,y){
  let theBall = spawnBall();
  if (x && y){
    theBall.x = x;
    theBall.y = y;
  }
  allBalls.push(theBall);
}

function mouseClicked(){
  makeBall(mouseX,mouseY);
}