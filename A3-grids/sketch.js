// Ethan Heshka
// Computer Science 30
// 2D Arrays Assignment
// Finished on November 13 2023
// Project Name: Exploration Game - Into The Grid

// Project Desription:
// A fresh take on the previous room explorer, redoing the game to be based on a 2D array
// Controls:
// Use the WSAD or arrow keys to control Link.
// Click the mouse in any empty area to teleport Link to that area.

// Extras for Experts:
// - Background Music/Sound Effects present and functional
// - Used playMode() to ensure footsteps play over each other
// - Used formulas with millis() to create a cooldown for player movement on the grid
// - Consistent use and bending of images to fit in grid and create the rooms

// Notes:
// Many "states" are present in the code, but for right now only "start" and "explore" will trigger.
// north = 0, west = 1, south = 2, east = 3

// Code:

let exits = [0,0,0,0];
let exitScale = 3; // tells how much grid slots an exit takes up

const GRID_SIZE = 12; // how wide/tall the grid will be, game still functions if changed though will break if extremely small value
let cellSize; // will turn into a x/y value for scaling later

let loadedRoom; // will turn into a 2D array later

let playerAbleToMove = true; // variable used to check if player should be able to move, used for cutscenes/fades
let playerMovementTime = 0; // time in millis() when player last moved
let movementCooldown = 200; // cooldown in milliseconds for player movement

// let fadeScale = 200 // time in millis() that fade in/out room happens

let player = { // player values
  x: GRID_SIZE/2, // x value in relevance to grid
  y: GRID_SIZE/2, // y value in relevance to grid
  battleX: 0, // x value during combat
  battleY: 0, // y value during combat
};

const enemies = { // for future update
  // spawnID = the ID for an enemy spawn point, used in loadedRoom
  // enemies themselves will not show up on the grid
  // however when checking if running into an enemy, it will look at the player and enemy x/y values
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
  fadeBlack: null,
  floor: null,
  wall: null,
  player: null,
  octorok: null,
  mario: null,
  luigi: null,
  title: null,
  clicktostart: null,
  treasureChest: null,
  speedBooster: null,
  something: null,
  message: null,
};

let bgm = { // list of all background music in the game
  title: null,
  overworld: null,
};

let sfx = { // list of all sound effects in the game
  click: null,
  footstep: null,
  hit_wall: null,
};

let state = "start"; // current state of game

function preload(){
  // load images
  imageAssets.fadeBlack = loadImage("assets/images/fadeblack.png");
  imageAssets.floor = loadImage("assets/images/floor-temp.png");
  imageAssets.wall = loadImage("assets/images/wall-temp.png");
  imageAssets.player = loadImage("assets/images/link_temporary.png");
  imageAssets.title = loadImage("assets/images/title.png");
  imageAssets.clicktostart = loadImage("assets/images/click-to-start.png");

  // set up sound formats to be used
  soundFormats("mp3", "wav");

  // load background music
  bgm.title = loadSound("assets/bgm/title.mp3");
  bgm.title.setVolume(0.5);
  bgm.overworld = loadSound("assets/bgm/overworld.mp3");
  bgm.overworld.setVolume(0.5);


  // load sound effects
  sfx.click = loadSound("assets/sfx/click.wav");
  sfx.footstep = loadSound("assets/sfx/footstep.wav");
  sfx.hit_wall = loadSound("assets/sfx/hit_wall.wav");
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

  imageMode(CENTER);
  rectMode(CENTER);

  loadedRoom = createEmptyRoom();

  randomExits();

  findExits(loadedRoom);

  bgm.title.loop();

  sfx.footstep.playMode("sustain");
}

function draw() {
  if (state === "start"){
    // If on the start screen
    loadStartScreen();
  }
  else if (state === "save") {
    // If picking a save file (future update)
    
  } 
  else if (state === "explore") {
    // If exploring
    displayRoom();
    overworldControls();
  } 
  else if (state === "menu") {
    // If in the player menu (future update)

  } 
  else if (state === "battle") {
    // If entered a battle (future update)
    loadBattle();
  }
}

function loadStartScreen(){
  background(0);
  image(imageAssets.title, width/2, height/2, width-cellSize, cellSize/1.5);
  image(imageAssets.clicktostart, width/2, height-cellSize, width/2.5, cellSize/2.5);
}

function createEmptyRoom() {
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
  console.log(table);
  return table;
}

function displayRoom() {
  noStroke();
  displayBorders();
  loadEntities();
}

function displayBorders() {
  for (let i=0; i<GRID_SIZE; i++){
    for (let j=0; j<GRID_SIZE; j++){
      if (loadedRoom[i][j]===0){
        image(imageAssets.floor, cellSize*j+cellSize/2, cellSize*i+cellSize/2, cellSize, cellSize);
      }
      else if (loadedRoom[i][j]===1){
        image(imageAssets.wall, cellSize*j+cellSize/2, cellSize*i+cellSize/2, cellSize, cellSize);
      }
    }
  }
}

function findExits(table) { // for each exit, uses addExits
  for (let exit of exits){
    addExits(exit,table);
  }
}

function addExits(direction,table){ // adds an "exit" to a given 2D array
  // creates a random position for the exit to exist in on the grid
  let randomExitPos = round(random(1,GRID_SIZE-exitScale-1));
  
  // depending on direction of exit, use randomExitPos to create the exit on the grid
  if (direction === 0){
    // adds 0s in table to create the exit
    for (let k=0; k<exitScale; k++){
      table[randomExitPos+k][0] = 0;
    }
  }
  else if (direction === 1){
    // adds 0s in table to create the exit
    for (let k=0; k<exitScale; k++){
      table[0][randomExitPos+k] = 0;
    }
  }
  else if (direction === 2){
    // adds 0s in table to create the exit
    for (let k=0; k<exitScale; k++){
      table[randomExitPos+k][GRID_SIZE-1] = 0;
    }
  }
  else if (direction === 3){
    // adds 0s in table to create the exit
    for (let k=0; k<exitScale; k++){
      table[GRID_SIZE-1][randomExitPos+k] = 0;
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
  image(imageAssets.player, cellSize*player.x+cellSize/2, cellSize*player.y+cellSize/2, cellSize, cellSize);
}

function overworldControls() {
  let addedPos = {x: 0, y: 0};
  if (state === "explore") {
    if (millis() > playerMovementTime + movementCooldown && playerAbleToMove){
      if (keyIsDown(87) || keyIsDown(38) ) {
        // w or up arrow
        addedPos.y = -1;
        playerMovementTime = millis();
        sfx.footstep.play();
      } 
      else if (keyIsDown(83) || keyIsDown(40)  ) {
        // s or down arrow
        addedPos.y = 1;
        playerMovementTime = millis();
        sfx.footstep.play();
      } 
      else if (keyIsDown(65) || keyIsDown(37)  ) {
        // a or left arrow
        addedPos.x = -1;
        playerMovementTime = millis();
        sfx.footstep.play();
      } 
      else if (keyIsDown(68) || keyIsDown(39)  ) {
        // d or right arrow
        addedPos.x = 1;
        playerMovementTime = millis();
        sfx.footstep.play();
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
  else if (loadedRoom[player.y + addedPos.y][player.x + addedPos.x] === 0){ // if not running into something
    player.y += addedPos.y;
    player.x += addedPos.x;
  }
  else if (loadedRoom[player.y + addedPos.y][player.x + addedPos.x] === 1){ // if running into a wall
    sfx.hit_wall.play();
  }
}

function changeRoom(direction){
  // creates a new room based on which exit the player took
  // done by copying the row/column of the exit taken, then placing that same row/column on the other side of a newly generated room
  let oppositeExit;
  let oldRoom = structuredClone(loadedRoom);
  let oldExitPos = [];
  if (direction === "north") {
    oppositeExit = 2; //south
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<GRID_SIZE; i++){
      oldExitPos.push(oldRoom[0][i]);
    }
    loadedRoom = createEmptyRoom();
    findExits(loadedRoom);
    for (let i=0; i<GRID_SIZE; i++){
      loadedRoom[GRID_SIZE-1][i] = oldExitPos[i];
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
    loadedRoom = createEmptyRoom();
    findExits(loadedRoom);
    for (let i=0; i<GRID_SIZE; i++){
      loadedRoom[i][GRID_SIZE-1] = oldExitPos[i];
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
    loadedRoom = createEmptyRoom();
    findExits(loadedRoom);
    for (let i=0; i<GRID_SIZE; i++){
      loadedRoom[0][i] = oldExitPos[i];
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
    loadedRoom = createEmptyRoom();
    findExits(loadedRoom);
    for (let i=0; i<GRID_SIZE; i++){
      loadedRoom[i][0] = oldExitPos[i];
    }
    player.x = 0;
  }
}

// function fadeIntoBlack(){
//   for (let i=0; i>256; i++){
//     push();
//     tint(255, i);
//     image(imageAssets.fadeBlack, 0, 0, width, height);
//   }
// }

// function fadeOutBlack(){
//   for (let i=255; i<=0; i++){
//     push();
//     tint(255, i);
//     image(imageAssets.fadeBlack, 0, 0, width, height);
//   }
// }

function mousePressed() { 
  if (state === "start"){
    bgm.title.stop();
    bgm.overworld.loop();
    state = "explore";
  }
  else if (state === "explore"){
    // teleports player to location on the grid
    let mouseGridX = floor(mouseX / cellSize);
    let mouseGridY = floor(mouseY / cellSize);
    if (loadedRoom[mouseGridY][mouseGridX] === 0){
      player.x = mouseGridX;
      player.y = mouseGridY;
      sfx.click.play();
    }
  }
  else if (state === "battle"){
    // activate some battle button, depending on where clicked
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

function randomizeObjPos(objectTable){ // future function
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