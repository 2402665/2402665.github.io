let x;
let y;
let w;
let l;

let detailX;
let detailY;

function setup() {
  createCanvas(400, 400);
  x = width/2;
  y = height/2;
  w = 50;
  l = 50;
  detailX = [5,5];
  detailY = [5,5];
}

function draw() {
  background(220);
  rect(x,y,w,l,detailX[0], detailX[1],detailY[0], detailY[1]);
}

function keyTyped() {
  if (key === "w") {
    x++;
  }
  else if (key === "a") {
    y--;
  }
  else if (key === "s") {
    x--;
  }
  else if (key === "d") {
    y++;
  }
  else if (key === "q") {
    fill("black");
  }
}