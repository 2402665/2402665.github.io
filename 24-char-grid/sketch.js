// Game of Life

let grid;
const GRID_SIZE = 30;
let cellSize;
let player = {
  x:0,
  y:0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);

  // put player in grid
  grid[player.y][player.x] = 9;

  if (height > width) {
    cellSize = width/GRID_SIZE;
  }
  else {
    cellSize = height/GRID_SIZE;
  }
}

function draw() {
  background(220);
  displayGrid();
}

function keyTyped() {
  if (key === "r") {
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  }
  else if (key === "e") {
    grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  }
  else if (key === "w"){
    movePlayer(0,-1);
  }
  else if (key === "a"){
    movePlayer(-1,0);
  }
  else if (key === "s"){
    movePlayer(0,1);
  }
  else if (key === "d"){
    movePlayer(1,0);
  }
}

function movePlayer(x,y){
  // edge case check
  if (player.x + x >= 0 && player.x + x < GRID_SIZE && 
    player.y + y >= 0 && player.y + y < GRID_SIZE){
    // check if running into a wall
    if (grid[player.y + y][player.x + x] === 0){
      //update grid
      grid[player.y][player.x] = 0;
      grid[player.y + y][player.x + x] = 9;

      player.x += x;
      player.y += y;
    }
  }
}

function mousePressed() {
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);

  toggleCell(x, y);   //current cell
}

function toggleCell(x, y) {
  //check that we are within the grid, then toggle
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    if (grid[y][x] === 0 && grid[y][x] !== 9) {
      grid[y][x] = 1;
    }
    else if (grid[y][x] === 1 && grid[y][x] !== 9) {
      grid[y][x] = 0;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
      else if (grid[y][x] === 9) {
        fill("blue");
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
  newGrid[player.y][player.x] = 9;
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  newGrid[player.y][player.x] = 9;
  return newGrid;
}
