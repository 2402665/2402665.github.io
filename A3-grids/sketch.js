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

const GRID_SIZE = 12;
let cellSize;

let currentRoom;

let playerMovementTime = 0; // time in millis() when player last moved
let movementCooldown = 200; // cooldown in milliseconds for player movement

let player = {
  x: GRID_SIZE/2,
  y: GRID_SIZE/2,
  battleX: 0,
  battleY: 0,
  sprite: null,
  exists: false,
};

let enemies = { // for future update
  // eID = enemy ID
  octorok: {
    eID: 1, 
    restrict: [1,1],
  },
};

let elites = { // for future update
  mario: {
    eID: 98,
    restrict: [1,2],
  },
  luigi: {
    eID: 99,
    restrict: [1,2],
  },
};

const roomObjects = {
  // didn't get into implementing this in time, will be implemented in future update
  // restrict are the width and height of the object in relevance to the grid; [3,1] means 3 grid blocks long and 1 grid block tall
  enemy: {enemies},
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

let imageAssets = {
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

let state = "explore";

function preload(){
  player.sprite = loadImage("link_temporary.png");
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
  // if (state === "start"){
  //   // If on the start screen
  //   loadStartScreen();
  // }
  // else if (state === "save") {
  //   // If picking a save file
    
  // } 
  if (state === "explore") {
    // If exploring
    loadRoom();
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
  if (currentRoom[mouseGridY][mouseGridX] === 0){
    currentRoom[player.y][player.x] = 0;
    currentRoom[mouseGridY][mouseGridX] = 2;
    player.x = mouseGridX;
    player.y = mouseGridY;
  }
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