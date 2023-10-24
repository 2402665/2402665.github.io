// random rectangles and circles demo

let x;
let y;

let w;
let h;

let radius;

let r;
let g;
let b;

let shapeScale = 20;

let randomCircleMin;

function setup() {
  createCanvas(400, 400);
  noStroke();
  w = width/shapeScale;
  h = height/shapeScale;
  radius = width/(shapeScale*2);
  background(255);
}

function draw() {
  randomColors();
  fill(r,g,b);
  controls();
}

function mousePressed() {
  if (keyIsDown(82)) { //r
    randomizeShape(false);
    rect(mouseX,mouseY,w,h);
  }
  if (keyIsDown(67)) { //c
    randomizeShape(true);
    circle(mouseX,mouseY,radius*2);
  } 
}

function controls(){
  if (keyIsDown(82)) { //r
    randomizeShape(false);
    rect(x,y,w,h);
  }
  if (keyIsDown(67)) { //c
    randomizeShape(true);
    circle(x,y,radius*2);
  } 
  if (keyIsDown(87)) { //w
    background(255);
  }
  if (keyIsDown(66)) { //b
    background(0);
  }
}

function randomizeShape(plusHalf) {
  x = random(0,width/2);
  y = random(0,height);
  if (plusHalf){
    x = x+width/2;
    x+=radius;
    radius;
  }
  else{
    x-=w;
  }
}

function randomColor(){
  let colorVal = random(0,256);
  return colorVal;
}

function randomColors(){
  r = randomColor();
  g = randomColor();
  b = randomColor();
}