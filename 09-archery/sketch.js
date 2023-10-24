// archery target demo

let x;
let y;

let targetScale=40;

let colors = ["white","black","lightblue","red","yellow"];

function setup() {
  createCanvas(400, 400);
  x = width/2;
  y = height/2;
}

function draw() {
  background(240);
  
  drawTarget();
}

function drawTarget(){
  let colorSwap = false;
  let colorNumber = 0;
  
  for (let targetStart=targetScale*10;targetStart>=targetScale;targetStart-=targetScale){
    fill(colors[colorNumber]);
    ellipse(x,y,targetStart,targetStart);
    if (colorSwap){
      colorNumber++;
    }
    colorSwap = !colorSwap;
  }
}