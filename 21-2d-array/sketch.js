// 2D Arrays Demo - const as well
// const is for variables that NEVER get changed
// if code attempts to change a const variable, it will break

let grid;

let cellSize;
const GRID_SIZE = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (height > width){
    cellSize = width/GRID_SIZE;
  }
  else{
    cellSize = height/GRID_SIZE;
  }
  grid = returnGrid(GRID_SIZE,GRID_SIZE);
}

function draw() {
  background(220);
  displayGrid();
}

function returnGrid(wLimit,hLimit){
  let newGrid = [];
  for (let w = 0; w < wLimit; w++){
    let newColumn = [];
    for (let h = 0; h < hLimit; h++){
      let newBoolean = round(random(1));
      if (newBoolean === 1){
        newBoolean = true;
      }
      else {
        newBoolean = false;
      }
      newColumn.push(newBoolean);
    }
    newGrid.push(newColumn);
  }
  console.log(newGrid);
  return newGrid;
}

function displayGrid(){
  for (let x=0; x<GRID_SIZE; x++){
    for (let y=0; y<GRID_SIZE; y++){
      if (grid[x][y] === false){
        fill("white");
      }
      else if (grid[x][y] === true){
        fill("black");
      }
      noStroke();
      rect(cellSize*x,cellSize*y,cellSize,cellSize);
      if (grid[x][y] === null){
        background(220);
      }
    }
  }
}

function keyTyped(){
  if (key === "e" || key === "E"){
    for (let x=0; x<GRID_SIZE; x++){
      for (let y=0; y<GRID_SIZE; y++){
        grid[x][y] = false;
      }
    }
  }
  if (key === "r" || key === "R"){
    grid = returnGrid(GRID_SIZE, GRID_SIZE);
  }
}

function mousePressed(){
  let mouseGridX = floor(mouseX / cellSize);
  let mouseGridY = floor(mouseY / cellSize);
  grid[mouseGridX][mouseGridY] = !grid[mouseGridX][mouseGridY];
}