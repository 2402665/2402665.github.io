let canvasW = 400;
let canvasH = 400;

let x;
let y;

let w;
let h;

let globalDirection = "right";

let speed = 5;

function setup() {
  createCanvas(canvasW, canvasH);
  x=0;
  y=0;
  
  w=50;
  h=50;
}

function draw() {
  background("white");
  fill("black")
  rect(x,y,w,h);
  moveSquare(globalDirection);
}

function moveSquare(direct){
  if (direct === "right"){
    x+=speed;
    if (x>=width-w){
      changeDirection(direct);
    }
  } else if (direct === "down"){
    y+=speed;
    if (y>=height-h){
      changeDirection(direct);
    }
  } else if (direct === "left"){
    x-=speed;
    if (x<=0){
      changeDirection(direct);
    }
  } else if (direct === "up"){
    y-=speed;
    if (y<=0){
      changeDirection(direct);
    }
  }
}

function changeDirection(direct){
  if (direct === "right"){
    globalDirection = "down";
  } else if (direct === "down"){
    globalDirection = "left";
  } else if (direct === "left"){
    globalDirection = "up";
  } else if (direct === "up"){
    globalDirection = "right";
  }
}