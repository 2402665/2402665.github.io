//start screen and "state"s demo

let state = "start screen";

let leftSide = 200;
let topSide = 150;
let boxWidth = 75;
let boxHeight = 50;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  if (state === "start screen") {
    startScreen();
  } 
  else {
    background("black");
  }
}

function startScreen() {
  background("white");

  fill("black");
  rect(leftSide, topSide, boxWidth, boxHeight);
}

function mousePressed() {
  if (state === "start screen"){
    if (isInRect(mouseX, mouseY, leftSide, topSide, boxWidth + leftSide, boxHeight + topSide)){
      state = "your mom";
    }
  }
}

function isInRect(x,y,rectX, rectY, rectWidth,rectHeight){
  return x >= rectX && x <= rectWidth && y >= rectY && y <= rectHeight;
}