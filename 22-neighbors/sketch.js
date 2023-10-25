// 2D Grid Neighbors Assignment - 2D Arrays Demo but all code by memory only until mousePressed which became a demo for 2D Array errors

let grid;
let cellSize;

const GRID_SIZE = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width < height){
    cellSize = width/GRID_SIZE;
  }
  else{
    cellSize = height/GRID_SIZE;
  }
  grid = newGrid();
}

function draw() {
  background(220);
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

function newGrid(){
  let returnedGrid = [];
  for (let x=0; x<GRID_SIZE; x++){
    returnedGrid.push([]);
    for (let y=0; y<GRID_SIZE; y++){
      // let randomBoolean = round(random(0,1));
      // if (randomBoolean === 0){
      //   randomBoolean = false;
      // }
      // else {
      //   randomBoolean = true;
      // }
      let randomBoolean = true;
      returnedGrid[x].push(randomBoolean);
    }
  }
  return returnedGrid;
}

function mousePressed(){
  let mouseGridX = floor(mouseX / cellSize);
  let mouseGridY = floor(mouseY / cellSize);
  toggleCell(mouseGridX,mouseGridY); //where you clicked
  toggleCell(mouseGridX,mouseGridY-1); // north neighbor
  toggleCell(mouseGridX,mouseGridY+1); // south neighbor
  toggleCell(mouseGridX-1,mouseGridY); // west neighbor
  toggleCell(mouseGridX+1,mouseGridY); // east neighbor
}

function toggleCell(x,y){
  if (x>=0 && x < GRID_SIZE && y>=0 && y < GRID_SIZE){
    grid[x][y] = !grid[x][y];
  }
}