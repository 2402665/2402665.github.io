let y;
let radius = 10;

let r;
let g;
let b;

function setup() {
  createCanvas(400, 400);
  y = height/2;
}

function draw() {
  background(220);
  drawCircles();
}

function drawCircles(){
  for (let x=0; x<15;x++) {
    randomizeColors();
    fill(color(r,g,b));
    circle(x*25+20,y,radius*2);
  }
}

function randomizeColors(){
  r = random(256);
  g = random(256);
  b = random(256);
}