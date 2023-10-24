// Traffic Light Practice Problem
// Ethan Heshka
// Oct 2 2023

// color speed variables is in seconds

let greenSPD = 6;
let yellowSPD = 2;
let redSPD = 5;

let swapCounter = 0; // ALWAYS keep this at 0

let state = "red";

function setup() {
  createCanvas(100, 300);
}

function draw() {
  background(255);
  drawOutlineOfLights();
  lightColor();
  stateChange();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(color(255,255,0));
  rect(width / 2, height / 2, 75, 200, 10);

  //lights
  
  fillEllipses();
}

function lightColor(){
  fill(state);
  if (state === "red"){
    ellipse(width / 2, height / 2 - 65, 50, 50); //top
  } 
  else if  (state === "yellow"){
    ellipse(width / 2, height / 2, 50, 50); //middle
  } 
  else if (state === "green"){
    ellipse(width / 2, height / 2 + 65, 50, 50); //bottom
  }
}

function stateChange(){
  if (state === "red" && millis()>=redSPD*1000+swapCounter*1000){
    state = "green";
    swapCounter+=redSPD;
  } 
  else if  (state === "yellow" && millis()>=yellowSPD*1000+swapCounter*1000){
    state = "red";
    swapCounter+=yellowSPD;
  } 
  else if (state === "green" && millis()>=greenSPD*1000+swapCounter*1000){
    state = "yellow";
    swapCounter+=greenSPD;
  }
}

function fillEllipses(){
  fill(0);
  ellipse(width / 2, height / 2 - 65, 50, 50); //top
  ellipse(width / 2, height / 2, 50, 50); //middle
  ellipse(width / 2, height / 2 + 65, 50, 50); //bottom
}