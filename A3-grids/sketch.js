// Ethan Heshka
// Computer Science 30
// 2D Arrays Assignment
// Finished on November 10 2023
// Project Name: Exploration Game - Into The Grid

// Project Desription:
// A fresh take on the previous room explorer, redoing the game to be based on a 2D array
// Controls:
// Use the WSAD or arrow keys to control Link.
// Click the mouse in any empty area to teleport the player to that area.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// 

// Notes:
// Many "states" are present in the code, but for right now only the title screen and explore will trigger.
// north = 0, west = 1, south = 2, east = 3

// Code:

let colors = []; // adds in variables later
let colorIndex = 3; // total amount of color variables used in code
// 0 = background, 1 = border, 2 = player (currently unused due to player now an image)

let exits = [0,0,0,0];
let exitScale = 3; // tells how much grid slots an exit takes up

const GRID_SIZE = 12; // how wide/tall the grid will be
let cellSize; // will turn into a x/y value for scaling later

let currentRoom; // will turn into a 2D array later

let playerMovementTime = 0; // time in millis() when player last moved
let movementCooldown = 200; // cooldown in milliseconds for player movement

let player = { // player values
  x: GRID_SIZE/2, // x value in relevance to grid
  y: GRID_SIZE/2, // y value in relevance to grid
  battleX: 0, // x value during combat
  battleY: 0, // y value during combat
  exists: false, // a check to see if player already exists when loading a room, only used at the start of the game
};

const enemies = { // for future update
  // spawnID = the ID for an enemy spawn point, used in currentRoom
  // enemies themselves will not show up on the grid
  // however when checking if running into an enemy, it 
  // eID = enemy ID
  // restrict are the width and height of the object in relevance to the grid; [3,1] means 3 grid blocks long and 1 grid block tall
  spawnID: 3,
  octorok: {
    eID: 1, 
    restrict: [1,1],
  },
};

const elites = { // for future update
  // elites are special enemies, will be much stronger than normal enemies
  // may very rarely spawn in standard rooms, other times will have designated boss rooms
  spawnID: 4,
  mario: {
    eID: 1,
    restrict: [1,2],
  },
  luigi: {
    eID: 2,
    restrict: [1,2],
  },
};

const roomObjects = { // for future update
  // other objects in the game that can be used at different times
  treasureChest: {
    ID: 5,
    restrict: [1,1],
  },
  speedBooster: {
    ID: 6,
    restrict: [1,1],
  },
  something: {
    ID: 7,
    restrict: [1,3],
  }, 
  message: {
    ID: 8,
    restrict: [3,1],
  }, 
};

let imageAssets = { // list of all sprites/spritesheets in the game
  player: null,
  octorok: null,
  mario: null,
  luigi: null,
  title: null,
  treasureChest: null,
  speedBooster: null,
  something: null,
  message: null,
};

let state = "explore"; // current state of game

function preload(){
  imageAssets.player = loadImage("link_temporary.png");
  imageAssets.title = loadImage("title.png");
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
  
  colors = allNewColors(colorIndex);

  randomExits();

  findExits(currentRoom);

}

function draw() {
  if (state === "start"){
    // If on the start screen
    loadStartScreen();
  }
  else if (state === "save") {
    // If picking a save file
    
  } 
  else if (state === "explore") {
    // If exploring
    displayRoom();
    overworldControls();
  } 
  else if (state === "menu") {
    // If in the player menu

  } 
  else if (state === "battle") {
    // If entered a battle
    loadBattle();
  }
}

function loadStartScreen(){
  background(0);
  push();

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
    table[player.x][player.y] = 2; //player spawn point
    player.exists = !player.exists;
  }
  console.log(table);
  return table;
}

function displayRoom() {
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
        rect(cellSize*j, cellSize*i, cellSize, cellSize);
      }
    }
  }
}

function findExits(table) { // for each exit, uses addExits
  for (let exit of exits){
    addExits(exit,table);
  }
}

function addExits(direction,table){ // adds an exit to a given 2D array
  // creates a random position for the exit to exist in on the grid
  let randomExitPos = round(random(1,GRID_SIZE-exitScale-1));
  
  // depending on direction of exit, use randomExitPos to create the exit on the grid
  if (direction === 0){
    for (let i=0; i<GRID_SIZE; i++){
      if (i===randomExitPos){
        // adds 0s in table to create the exit
        for (let k=0; k<exitScale; k++){
          table[i+k][0] = 0;
        }
      }
    }
  }
  else if (direction === 1){
    for (let j=0; j<GRID_SIZE; j++){
      if (j===randomExitPos){
        // adds 0s in table to create the exit
        for (let k=0; k<exitScale; k++){
          table[0][j+k] = 0;
        }
      }
    }
  }
  else if (direction === 2){
    for (let i=0; i<GRID_SIZE; i++){
      if (i===randomExitPos){
        // adds 0s in table to create the exit
        for (let k=0; k<exitScale; k++){
          table[i+k][GRID_SIZE-1] = 0;
        }
      }
    }
  }
  else if (direction === 3){
    for (let j=0; j<GRID_SIZE; j++){
      if (j===randomExitPos){
        // adds 0s in table to create the exit
        for (let k=0; k<exitScale; k++){
          table[GRID_SIZE-1][j+k] = 0;
        }
      }
    }
  }
}

function randomExits() {
  // randomizes exits
  for (let i=0; i<exits.length; i++){
    exits[i] = floor(random(4));
  }
}

function loadEntities() {
  // if there were multiple entities, for example a treasure chest or enemy, they would have their seperate functions loaded here.
  loadPlayer();

}

function loadPlayer() {
  image(imageAssets.player, cellSize*player.x, cellSize*player.y, cellSize, cellSize);
}

function overworldControls() {
  let addedPos = {x: 0, y: 0};
  if (state === "explore") {
    if (millis() > playerMovementTime + movementCooldown){
      if (keyIsDown(87)  || keyIsDown(38) ) {
        // w or up arrow
        addedPos.y = -1;
        playerMovementTime = millis();
      } 
      else if (keyIsDown(83)  || keyIsDown(40)  ) {
        // s or down arrow
        addedPos.y = 1;
        playerMovementTime = millis();
      } 
      else if (keyIsDown(65)  || keyIsDown(37)  ) {
        // a or left arrow
        addedPos.x = -1;
        playerMovementTime = millis();
      } 
      else if (keyIsDown(68)  || keyIsDown(39)  ) {
        // d or right arrow
        addedPos.x = 1;
        playerMovementTime = millis();
      } 
    }
  }
  movePlayer(addedPos);
}

function movePlayer(addedPos) {
  // moves the player
  // moves into a new room given if player left the room
  if (player.y + addedPos.y < 0){ // if going into north exit
    changeRoom("north");
  }
  else if (player.y + addedPos.y >= GRID_SIZE){ // if going to south exit
    changeRoom("south");
  }
  else if (player.x + addedPos.x < 0){ // if going to west exit
    changeRoom("west");
  }
  else if (player.x + addedPos.x >= GRID_SIZE){ // if going to east exit
    changeRoom("east");
  }
  else if (currentRoom[player.y + addedPos.y][player.x + addedPos.x] === 0){ // if not running into something
    currentRoom[player.y][player.x] = 0;
    currentRoom[player.y + addedPos.y][player.x + addedPos.x] = 2;
    player.y += addedPos.y;
    player.x += addedPos.x;
  }
}

function changeRoom(direction){
  // creates a new room based on which exit the player took
  // done by copying the row/column of the exit taken, then placing that same row/column on the other side of a newly generated room
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
    player.y = GRID_SIZE-1;
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
    player.x = GRID_SIZE-1;
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
    player.y = 0;
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
    player.x = 0;
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
  // expands randomColor() to a function that can make multiple colors in a table
  let newColorTable = [];
  for (let i = 0; i < totalColors; i++){
    let newColor = randomColor();
    newColorTable.push(newColor);
  }
  return newColorTable;
}

function mousePressed() { 
  if (state === "explore"){
    // teleports player to location on the grid
    let mouseGridX = floor(mouseX / cellSize);
    let mouseGridY = floor(mouseY / cellSize);
    if (currentRoom[mouseGridY][mouseGridX] === 0){
      currentRoom[player.y][player.x] = 0;
      currentRoom[mouseGridY][mouseGridX] = 2;
      player.x = mouseGridX;
      player.y = mouseGridY;
    }
  }
  else if (state === "battle"){
    // activate some battle button, depending on where clicked
  }
}

function mouseWheel(event) { 
  //darkens or lightens all colors
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
};

function randomizeObjPos(objectTable){
  // a function that would randomize where objects are positioned given a table of object IDs, returns a table of positions
}

function loadBattle(){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}

function loadEnemies(){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}

function createEnemy(){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}

function battleControls(){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}

function battleUI(){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}

function battleButton(button){ // future function
  text("How are you seeing this?",0,0,width,height/5);
}