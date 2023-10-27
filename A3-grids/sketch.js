// Ethan Heshka
// Computer Science 30
// 2D Arrays Assignment
// Finished on October 19 2023
// Project Name: Exploration Game - Discovery Update

// Project Desription:
// A fresh take on the previous room explorer, redoing the game to be based on a 2D array, adding spawning objects
// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Click the mouse in any empty area to teleport the player.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// Used break to stop loops once a certain condition is filled

// Notes:
// Originally, it was planned to have a combat system in the game. This became scrapped, and might be added at a later date. Hence there is some remaining code where the combat system would need pieces implemented to work.
// north = 0, west = 1, south = 2, east = 3

// Code:

let colors = []; // adds in variables later
let colorIndex = 3; // total amount of color variables used in code
// 0 = background, 1 = border, 2 = player (currently unused due to player now an image)

let exits = [0,0,0,0];
let exitScale = 3; // tells how much grid slots an exit takes up

const GRID_SIZE = 10;
let cellSize;

let currentRoom;

let entityScale; // how big entities should be based on window and grid

let playerMovementTime = 0; // time in millis() when player last moved
let movementCooldown = 200; // cooldown in milliseconds for player movement

let player = { // some parts currently rendered useless as part of the grid integration for now
  w: 0,
  h: 0,
  battleX: 0,
  battleY: 0,
  sprite: null,
  exists: false,
};

let enemies = [];
//enemy ID would be 3, elite enemy ID will be 4

let roomObjects = {
  // didn't get into implementing this in time, will be implemented in future update
  // restrictions are the width and height of the object in relevance to the grid; [3,1] means 3 grid blocks long and 1 grid block tall
  treasureChest: {
    ID: 5,
    restrictions: [1,1],
  },
  speedBooster: {
    ID: 6,
    restrictions: [1,1],
  },
  something: {
    ID: 7,
    restrictions: [1,3],
  }, 
  message: {
    ID: 8,
    restrictions: [3,1],
  }, 
};

let state = "overworld";

function preload(){
  player.sprite = loadImage("link_temporary.png");
}

function setup() {
  if (windowWidth>windowHeight){
    canvas = createCanvas(windowHeight, windowHeight);
    cellSize = height/GRID_SIZE;
  } 
  else if (windowWidth<windowHeight){
    canvas = createCanvas(windowWidth, windowWidth);
    cellSize = width/GRID_SIZE;
  } 
  else {
    canvas = createCanvas(windowWidth, windowHeight);
    cellSize = width/GRID_SIZE;
  }

  currentRoom = createRoom();

  entityScale = (width+height) / (GRID_SIZE*2);

  player.w = entityScale;
  player.h = entityScale;
  player.spd = entityScale / 10;
  
  colors = allNewColors(colorIndex);

  randomExits();

  findExits(currentRoom);

}

function draw() {
  if (state === "overworld") {
    // If the player is not in combat
    loadRoom();
    overworldControls();
  } 
  else if (state === "battle") {
    loadBattle();
  }
}

function createRoom() {
  let table = new Array(GRID_SIZE);
  for(let i=0; i<GRID_SIZE; i++){
    if(i===0 || i===GRID_SIZE-1){
      table[i] = new Array(GRID_SIZE).fill(1);
    }
    else {
      table[i] = new Array(GRID_SIZE).fill(0);
      table[i][0] = 1;
      table[i][GRID_SIZE-1] = 1;
    }
  }
  if (!player.exists){
    table[GRID_SIZE/2][GRID_SIZE/2] = 2; //player spawn point
    player.exists = !player.exists;
  }
  console.log(table);
  return table;
}

function loadRoom() {
  background(color(colors[0]));
  noStroke();
  displayBorders();
  loadEntities();
}

function displayBorders() {
  fill(color(colors[1]));
  for (let i=0; i<GRID_SIZE; i++){
    for (let j=0; j<GRID_SIZE; j++){
      if (currentRoom[i][j]===1){
        rect(width/GRID_SIZE*j, height/GRID_SIZE*i, width/GRID_SIZE, height/GRID_SIZE);
      }
    }
  }
}

function findExits(table) {
  for (let exit of exits){
    addExits(exit,table);
  }
}

function addExits(direction,table){
  let randomExitPosW = round(random(1,GRID_SIZE-exitScale-1));
  let randomExitPosH = round(random(1,GRID_SIZE-exitScale-1));
  if (direction === 0){
    for (let i=0; i<GRID_SIZE; i++){
      if (i===randomExitPosW){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[i+k][0] = 0;
        }
      }
    }
  }
  else if (direction === 1){
    for (let j=0; j<GRID_SIZE; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[0][j+k] = 0;
        }
      }
    }
  }
  else if (direction === 2){
    for (let i=0; i<GRID_SIZE; i++){
      if (i===randomExitPosW){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[i+k][GRID_SIZE-1] = 0;
        }
      }
    }
  }
  else if (direction === 3){
    for (let j=0; j<GRID_SIZE; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[GRID_SIZE-1][j+k] = 0;
        }
      }
    }
  }
}

function randomExits() {
  for (let i=0; i<exits.length; i++){
    exits[i] = floor(random(4));
  }

}

function loadEntities() {
  // if there were multiple entities, for example a treasure chest or enemy, they would have their seperate functions loaded here.
  loadPlayer();
}

function loadPlayer() {
  push();
  fill(color(colors[2]));
  for (let i=0; i<GRID_SIZE; i++){
    for (let j=0; j<GRID_SIZE; j++){
      if (currentRoom[i][j]===2){
        image(player.sprite, width/GRID_SIZE*j, height/GRID_SIZE*i, width/GRID_SIZE, height/GRID_SIZE);
      }
    }
  }
  pop();
}

function overworldControls() {
  let direction;
  if (state === "overworld") {
    if (keyIsDown(87) && millis() > playerMovementTime + movementCooldown || keyIsDown(38) && millis() > playerMovementTime + movementCooldown) {
      // w or up arrow
      direction = "north";
      playerMovementTime = millis();
    } 
    if (keyIsDown(83) && millis() > playerMovementTime + movementCooldown || keyIsDown(40) && millis() > playerMovementTime + movementCooldown ) {
      // s or down arrow
      direction = "south";
      playerMovementTime = millis();
    } 
    if (keyIsDown(65) && millis() > playerMovementTime + movementCooldown || keyIsDown(37) && millis() > playerMovementTime + movementCooldown ) {
      // a or left arrow
      direction = "west";
      playerMovementTime = millis();
    } 
    if (keyIsDown(68) && millis() > playerMovementTime + movementCooldown || keyIsDown(39) && millis() > playerMovementTime + movementCooldown ) {
      // d or right arrow
      direction = "east";
      playerMovementTime = millis();
    } 
  }
  movePlayer(direction);
}

function movePlayer(direction) {
  let notMoved = true;
  if (direction){
    for (let i=0; i<GRID_SIZE; i++){
      for (let j=0; j<GRID_SIZE; j++){
        if (currentRoom[i][j]===2 && notMoved){
          if (direction === "north"){
            if (i-1 >= 0){
              if (currentRoom[i-1][j] !== 1){
                currentRoom[i][j] = 0;
                currentRoom[i-1][j] = 2;
              }
            }
            else {
              changeRoom(direction);
            }
            notMoved = false;
          }
          else if (direction === "west"){
            if (j-1 >= 0){
              if (currentRoom[i][j-1] !== 1){
                currentRoom[i][j] = 0;
                currentRoom[i][j-1] = 2;
              }
            }
            else {
              changeRoom(direction);
            }
            notMoved = false;
          }
          else if (direction === "south"){
            if (i+1 < GRID_SIZE){
              if (currentRoom[i+1][j] !== 1){
                currentRoom[i][j] = 0;
                currentRoom[i+1][j] = 2;
              }
            }
            else {
              changeRoom(direction);
            }
            notMoved = false;
          }
          else if (direction === "east"){
            if (j+1 < GRID_SIZE){
              if (currentRoom[i][j+1] !== 1){
                currentRoom[i][j] = 0;
                currentRoom[i][j+1] = 2;
              }
            }
            else {
              changeRoom(direction);
            }
            notMoved = false;
          }
          break;
        }
      }
    }
  }
}

function changeRoom(direction){
  let oppositeExit;
  let oldRoom = structuredClone(currentRoom);
  let oldExitPos = [];
  if (direction === "north") {
    oppositeExit = 2; //south
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<GRID_SIZE; i++){
      oldExitPos.push(oldRoom[0][i]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<GRID_SIZE; i++){
      currentRoom[GRID_SIZE-1][i] = oldExitPos[i];
    }
    for (let i=0; i<GRID_SIZE; i++){
      for (let j=0; j<GRID_SIZE; j++){
        if (oldRoom[i][j]===2){
          currentRoom[GRID_SIZE-1][j] = 2;
        }
      }
    }
  } 
  else if (direction === "west") {
    oppositeExit = 3; //east
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<GRID_SIZE; i++){
      oldExitPos.push(oldRoom[i][0]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<GRID_SIZE; i++){
      currentRoom[i][GRID_SIZE-1] = oldExitPos[i];
    }
  } 
  else if (direction === "south") {
    oppositeExit = 0; //north
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<GRID_SIZE; i++){
      oldExitPos.push(oldRoom[GRID_SIZE-1][i]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<GRID_SIZE; i++){
      currentRoom[0][i] = oldExitPos[i];
    }
  } 
  else if (direction === "east") {
    oppositeExit = 1; //west
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<GRID_SIZE; i++){
      oldExitPos.push(oldRoom[i][GRID_SIZE-1]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<GRID_SIZE; i++){
      currentRoom[i][0] = oldExitPos[i];
    }
  }
  colors = allNewColors(colorIndex);
}

function randomColor() {
  let r = random(255);
  let g = random(255);
  let b = random(255);
  return [r, g, b];
}

function allNewColors(totalColors){
  let newColorTable = [];
  for (let i = 0; i < totalColors; i++){
    let newColor = randomColor();
    newColorTable.push(newColor);
  }
  return newColorTable;
}

function mousePressed() { 
  let mouseGridX = floor(mouseX / cellSize);
  let mouseGridY = floor(mouseY / cellSize);
  //same code from demo 21, next class implement checking that cell selected is empty, then teleport player
  
}

function mouseWheel(event) { //darkens or lightens all colors
  // event.delta is how much the mouse has scrolled, and since this value is decently high, it is divided by 10 in the formula to keep colors similar.
  for (let aColor of colors){
    for (let i=0; i<aColor.length; i++){
      aColor[i] += event.delta / 10;
    }
  }
}

window.onresize = function() { // if the window gets resized
  if (windowWidth>windowHeight){
    canvas = createCanvas(windowHeight, windowHeight);
    cellSize = height/GRID_SIZE;
  } 
  else if (windowWidth<windowHeight){
    canvas = createCanvas(windowWidth, windowWidth);
    cellSize = width/GRID_SIZE;
  } 
  else {
    canvas = createCanvas(windowWidth, windowHeight);
    cellSize = width/GRID_SIZE;
  }

  entityScale = (width+height) / (GRID_SIZE*2);
  
  player.w = entityScale;
  player.h = entityScale;
  player.spd = entityScale / 10;
  
  player.spd = entityScale / 10;

};

function randomizeObjPos(){

}

function loadBattle(){
  text("How are you seeing this?",0,0,width,height/5);
}

function loadEnemies(){
  text("How are you seeing this?",0,0,width,height/5);
}

function createEnemy(){
  text("How are you seeing this?",0,0,width,height/5);
}

function battleControls(){
  text("How are you seeing this?",0,0,width,height/5);
}

function battleUI(){
  text("How are you seeing this?",0,0,width,height/5);
}

function battleButton(){
  text("How are you seeing this?",0,0,width,height/5);
}