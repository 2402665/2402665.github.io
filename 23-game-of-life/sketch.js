// Game of Life Activity
//INCREDIBLY BUGGED

let grid;
let cellSize;

let autoplay = false;

const GRID_SIZE = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width < height){
    cellSize = width/GRID_SIZE;
  }
  else{
    cellSize = height/GRID_SIZE;
  }
  grid = newGrid(false);
}

function draw() {
  background(220);
  if (autoplay && frameRate % 10 === 0){
    nextTurn();
  }
  drawGrid(grid);
}

function drawGrid(theGrid){
  for (let x=0; x<GRID_SIZE; x++){
    for (let y=0; y<GRID_SIZE; y++){
      if (theGrid[x][y]){
        fill("white");
      }
      else{
        fill("black");
      }
      rect(cellSize*x,cellSize*y,cellSize,cellSize);
    }
  }
}

function newGrid(empty){
  let returnedGrid = [];
  for (let x=0; x<GRID_SIZE; x++){
    returnedGrid.push([]);
    for (let y=0; y<GRID_SIZE; y++){
      let randomBoolean = round(random(0,1));
      if (empty){
        randomBoolean = true;
      }
      else {
        if (randomBoolean === 0){
          randomBoolean = false;
        }
        else {
          randomBoolean = true;
        }
      }
      // let randomBoolean = true;
      returnedGrid[x].push(randomBoolean);
    }
  }
  return returnedGrid;
}

function nextTurn(){
  let nextTurnGrid = newGrid(true);
  for (let x=0; x<GRID_SIZE; x++){
    for (let y=0; y<GRID_SIZE; y++){
      //count neighbors
      let neighbors = 0;
      //look at all cells around in a 3x3 grid
      for (let i=-1; i<=1; i++){
        for (let j=-1; j<=1; j++){
          if (x+i>=0 && x+i < GRID_SIZE && y+j>=0 && y+j < GRID_SIZE){
            if (grid[x+i][y+j] === false){
              neighbors++;
            }
          }
        }
      }
      // apply rules
      if (grid[x][y] === false){ //alive - filled
        neighbors--;
        if (neighbors < 2 || neighbors > 3){
          nextTurnGrid[x][y] = false;
        }
        else {
          nextTurnGrid[x][y] = true;
        }
      }
      else if (grid[x][y] === true){ //dead - empty
        if (neighbors===3){
          nextTurnGrid[x][y] = true;
        }
        else{
          nextTurnGrid[x][y] = false;
        }
      }
    }
  }
  return nextTurnGrid;
}

function mousePressed(){
  let mouseGridX = floor(mouseX / cellSize);
  let mouseGridY = floor(mouseY / cellSize);
  toggleCell(mouseGridX,mouseGridY); //where you clicked
}

function toggleCell(x,y){
  if (x>=0 && x < GRID_SIZE && y>=0 && y < GRID_SIZE){
    grid[x][y] = !grid[x][y];
  }
}

function keyTyped(){
  if (key === "e"){
    grid = newGrid(true);
  }
  else if (key === "r"){
    grid = newGrid(false);
  }
  else if (key === " "){
    grid = nextTurn();
  }
  else if (key === "a"){
    autoplay = !autoplay;
  }
}