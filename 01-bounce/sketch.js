let x = 26;
let dx = 2;
let d = 50;

let canvasX = 400;
let canvasY = 400;

function setup() {
  createCanvas(canvasX, canvasY);
}

function draw() {
  background(220);
  circle(x, height/2, d);
  if (x>=width-d/2 || x<=0+d/2){
    dx = dx*-1;
  }
  x+=dx;
}