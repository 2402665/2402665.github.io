function setup() {
  if (windowWidth>windowHeight){
    createCanvas(windowHeight, windowHeight);
  } else if (windowWidth<windowHeight){
    createCanvas(windowWidth, windowWidth);
  } else {
    createCanvas(windowWidth, windowHeight);
  }
}

function draw() {
  makeBoard();
}

function makeBoard(){
  let isBlack = false;
  for (let x=0;x<=width;x+=width/8){
    for (let y=0;y<=height;y+=height/8){
      fill(color(decideColor(isBlack)));
      rect(x,y,width/8,height/8)
      isBlack = !isBlack;
    }
  }
}

function decideColor(decision){
  if (decision){
    return 0;
  } else {
    return 255;
  }
}