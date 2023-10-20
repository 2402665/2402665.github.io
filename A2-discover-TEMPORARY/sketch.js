// Ethan Heshka
// Computer Science 30
// Arrays/Objects Assignment
// Finished on October 19 2023
// Project Name: Exploration Game - Discovery Update

// Project Desription:
// A fresh take on the previous room explorer, adding (new objects), reformatting the code to have arrays and objects, and bug fixes.

// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Click within the room (but not close to the room borders and not within an exit) to teleport the block and advance through rooms quickly.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// Added 2D arrays to create grid system for rooms

// Known Bugs:
// When there is an exit in any direction and you move into the walls adjacent to said exit, it may move you into the border and lock your controls. To get out of this situation, move in the opposite direction.
// In some cases due to the player speed making it reach into the border but not far enough into the exit, the player square cannot enter an exit. The collision acts as if there is no exit there. When this happens, the bug listed above does not occur.
// To fix the above, click the mouse to teleport to a different position. The next time you try is likely to let you in.

// Notes:
// Originally, it was planned to have a combat system in the game. This became scrapped, and might be added at a later date. Hence there is some remaining code where the combat system would need pieces implemented to work.
// north = 0, west = 1, south = 2, east = 3

// Code:

let colors = []; // adds in variables later
let colorIndex = 3; // total amount of color variables used in code
// 0 = background, 1 = border, 2 = player (currently unused due to player now an image)

let exits = [0,0,0,0];
let exitScale = 2; // tells how much grid slots an exit takes

let gridWidth = 10;
let gridHeight = 10;
let currentRoom = new Array(gridWidth);

let entityScale; // how big entities should be based on window and grid

let player = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  spd: 0,
  battleX: 0,
  battleY: 0,
  sprite: null,
};

let enemies = [];
//enemy spawn point index would be 2

let roomObjects = {
  // restrictions are the width and height of the object in relevance to the grid; [3,1] means 3 grid blocks long and 1 grid block tall
  treasureChest: {
    index: 3,
    restrictions: [1,1],
  },
  speedBooster: {
    index: 4,
    restrictions: [1,1],
  },
  something: {
    index: 5,
    restrictions: [1,3],
  }, 
  message: {
    index: 6,
    restrictions: [3,1],
  }, 
};

//REMEMBER TO CHANGE PLAYER RECTMODE TO CENTER, POSSIBLY OTHERS TOO

let state = "overworld";

function preload(){
  player.sprite = loadImage("link_temporary.png");
}

function setup() {
  if (windowWidth>windowHeight){
    canvas = createCanvas(windowHeight, windowHeight);
  } 
  else if (windowWidth<windowHeight){
    canvas = createCanvas(windowWidth, windowWidth);
  } 
  else {
    canvas = createCanvas(windowWidth, windowHeight);
  }

  createRoom(currentRoom);

  entityScale = (width+height) / (gridWidth+gridHeight);

  player.w = entityScale;
  player.h = entityScale;
  player.x = width / 2;
  player.y = height / 2;
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
    checkRoomChange();
  } 
  else if (state === "battle") {
    loadBattle();
  }
}

function createRoom(table) {
  for(let i=0; i<gridWidth; i++){
    if(i===0 || i===gridWidth-1){
     table[i] = new Array(gridHeight).fill(1);
    }
    else {
      table[i] = new Array(gridHeight).fill(0);
      table[i][0] = 1;
      table[i][gridHeight-1] = 1;
    }
  }
  console.log(table);
}

function loadRoom() {
  background(color(colors[0]));
  noStroke();
  createBorder(currentRoom);
  loadEntities(currentRoom);
}

function createBorder(table) {
  fill(color(colors[1]));
  for (let i=0; i<gridWidth; i++){
    for (let j=0; j<gridHeight; j++){
      if (table[i][j]===1){
        rect(width/gridWidth*j, height/gridHeight*i, width/gridWidth, height/gridHeight);
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
  let randomExitPosW = round(random(1,gridWidth-exitScale-1));
  let randomExitPosH = round(random(1,gridHeight-exitScale-1));
  if (direction === 0){
    for (let i=0; i<gridWidth; i++){
      if (i===randomExitPosW){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        table[i][0] = 0;
        table[i+1][0] = 0;
      }
    }
  }
  else if (direction === 1){
    for (let j=0; j<gridHeight; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        table[0][j] = 0;
        table[0][j+1] = 0;
      }
    }
  }
  else if (direction === 2){
    for (let i=0; i<gridWidth; i++){
      if (i===randomExitPosW){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        table[i][gridHeight-1] = 0;
        table[i+1][gridHeight-1] = 0;
      }
    }
  }
  else if (direction === 3){
    for (let j=0; j<gridHeight; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        table[gridWidth-1][j] = 0;
        table[gridWidth-1][j+1] = 0;
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
  imageMode(CENTER);
  image(player.sprite,player.x, player.y, player.w, player.h);
  pop();
}

function overworldControls() {
  if (state === "overworld") {
    if (keyIsDown(87)) {
      // w
      if (collisionCheck("up")) {
        player.y -= player.spd;
      }
    } 
    else if (keyIsDown(38)) {
      // up arrow
      if (collisionCheck("up")) {
        player.y -= player.spd;
      }
    }
    if (keyIsDown(83)) {
      // s
      if (collisionCheck("down")) {
        player.y += player.spd;
      }
    } 
    else if (keyIsDown(40)) {
      // down arrow
      if (collisionCheck("down")) {
        player.y += player.spd;
      }
    }
    if (keyIsDown(65)) {
      // a
      if (collisionCheck("left")) {
        player.x -= player.spd;
      }
    } 
    else if (keyIsDown(37)) {
      // left arrow
      if (collisionCheck("left")) {
        player.x -= player.spd;
      }
    }
    if (keyIsDown(68)) {
      // d
      if (collisionCheck("right")) {
        player.x += player.spd;
      }
    } 
    else if (keyIsDown(39)) {
      // right arrow
      if (collisionCheck("right")) {
        player.x += player.spd;
      }
    }
  }
}

function collisionCheck(direction) {
  return true;
}

function checkRoomChange() { //changes the current room if player left
  // let exitOptions = ["north","west","south","east"]
  // for (let exit in exitOptions){
  //   if (checkExitCollision(exit)){
  //     changeRoom(exit);
  //   }
  // }
}

function changeRoom(direction){
  let oppositeExit;
  let oldRoom = structuredClone(currentRoom);
  let oldExitPos = [];
  if (direction === "north") {
    oppositeExit = 2; //south
    randomExits();
    exits[0] = oppositeExit;
    player.y = height - roomBorder - player.h / 2;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[i][0])
    }
    createRoom(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[i][gridHeight-1] = oldExitPos[i]
    }
  } 
  else if (direction === "west") {
    oppositeExit = 3; //east
    randomExits();
    exits[0] = oppositeExit;
    player.x = width - roomBorder - player.w / 2;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[0][i])
    }
    createRoom(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[gridWidth-1][i] = oldExitPos[i]
    }
  } 
  else if (direction === "south") {
    oppositeExit = 0; //north
    randomExits();
    exits[0] = oppositeExit;
    player.y = player.h;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[i][gridHeight-1])
    }
    createRoom(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[i][0] = oldExitPos[i]
    }
  } 
  else if (direction === "east") {
    oppositeExit = 1; //west
    randomExits();
    exits[0] = oppositeExit;
    player.x = player.w;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[gridWidth-1][i])
    }
    createRoom(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[0][i] = oldExitPos[i]
    }
  }
  colors = allNewColors(colorIndex);
}

function checkExitCollision(direction) { //checks if a player left a currentRoom
  if (direction === "north") {
    return player.y <= -1 * player.h;
  } 
  else if (direction === "west") {
    return player.x <= -1 * player.w;
  } 
  else if (direction === "south") {
    return player.y >= height + player.h;
  } 
  else if (direction === "east") {
    return player.x >= width + player.w;
  }
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
  //teleports the player so long as the mouse is in the room.
  // if (
  //   mouseX > roomBorder &&
  //   mouseX < width - roomBorder &&
  //   mouseY > roomBorder &&
  //   mouseY < height - roomBorder
  // ) {
  //   player.x = mouseX;
  //   player.y = mouseY;
  // }
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
  let oldWidth = width;
  let oldHeight = height;

  if (windowWidth>windowHeight){
    canvas = createCanvas(windowHeight, windowHeight);
  } 
  else if (windowWidth<windowHeight){
    canvas = createCanvas(windowWidth, windowWidth);
  } 
  else {
    canvas = createCanvas(windowWidth, windowHeight);
  }

  entityScale = (width+height) / (gridWidth+gridHeight);
  
  player.w = entityScale;
  player.h = entityScale;
  player.spd = entityScale / 10;

  let percentOldX = player.x/oldWidth;
  let percentOldY = player.y/oldHeight;

  player.x = percentOldX*width;
  player.y = percentOldY*height;
  
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