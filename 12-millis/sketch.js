let theTime;
let timeScalar;

function setup() {
  createCanvas(400, 400);
  theTime = 2000;
  timeScalar = theTime;
}

function draw() {
  if (millis()<theTime){
    background("white");
  } 
  else {
    background("black");
    if (millis()>theTime+timeScalar){
      theTime+=timeScalar*2;
    }
  }
}