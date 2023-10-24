// Perlin Noise Demo

let allBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  noStroke();
  createBall();
  // spawn new ball every half second
  window.setInterval(createBall,2000);
}

function draw() {
  for (let theBall of allBalls){
    fill(theBall.color);
    //move
    theBall.x = noise(theBall.time) * width;
    theBall.y = noise(theBall.time+300) * height;
    //display
    circle(theBall.x, theBall.y, theBall.radius,);

    theBall.time+=0.01;
  }
}

function createBall(){
  let returnedBall = {
    x: random(width),
    y: random(height),
    radius: random(10,50),
    color: color(random(255), random(255), random(255)),
    time: random(1000),
  };
  allBalls.push(returnedBall);
}

function mousePressed(){
  createBall();
}