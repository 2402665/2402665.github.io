// parsing booleans - demonstrating I can read the code - part one

let button = false;
let x = 50;
let y = 50;
let w = 100;
let h = 75;

function setup() {
  createCanvas(480, 270);
}

function draw() {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && mouseIsPressed) {
    button = true;
  } 
  else {
    button = false;
  }
  
  if (button) {
    background(255);
    stroke(0);
    x = mouseX-w/2;
    y = mouseY-h/2;
  } 
  else {
    background(0);
    stroke(255);
  }
  
  fill(175);
  rect(x,y,w,h);
}