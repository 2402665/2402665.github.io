// Bouncing Ball OOP Demo

class Ball{
  constructor(x,y,radius,dx,dy,color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
  }
  display(){
    push();
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
    pop();
  }
  move(){
    this.x += this.dx;
    if (this.x <= this.radius && this.dx < 0){
      this.dx = this.dx * -1;
    }
    else if (this.x >= width-this.radius && this.dx > 0){
      this.dx = this.dx * -1;
    }
    this.y += this.dy;
    if (this.y <= this.radius && this.dy < 0){
      this.dy = this.dy * -1;
    }
    else if (this.y >= height-this.radius && this.dy > 0){
      this.dy = this.dy * -1;
    }
  }
  bounceOff(otherBall){
    let radiiSum = this.radius + otherBall.radius;
    let distanceApart = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (radiiSum >= distanceApart){
      //hitting each other
      let tempX = this.dx;
      let tempY = this.dy;

      this.dx = otherBall.dx;
      this.dy = otherBall.dy;

      otherBall.dx = tempX;
      otherBall.dy = tempY;
    }
  }
}

let allBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  let newBall = new Ball(width/2, height/2, random(50), random(-5, 5), random(-5, 5), color(newColor()));
  allBalls.push(newBall);
}

function draw() {
  background(220);
  checkForKey();
  for (let ball of allBalls){
    for (let i=0; i<allBalls.length; i++){
      if (ball !== allBalls[i]){
        ball.bounceOff(allBalls[i]);
      }
    }
    ball.move();
    ball.display();
  }
}

function mousePressed(){
  let newBall = new Ball(mouseX, mouseY, random(50), random(-5, 5), random(-5, 5), color(newColor()));
  allBalls.push(newBall);
}

function checkForKey(){
  if (keyIsDown(87)){
    let newBall = new Ball(mouseX, mouseY, random(50), random(-5, 5), random(-5, 5), color(newColor()));
    allBalls.push(newBall);
  }
}

function newColor(){
  let r = random(255);
  let g = random(255);
  let b = random(255);
  return [r,g,b];
}