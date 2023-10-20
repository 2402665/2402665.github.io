// Ethan Heshka
// Computer Science 30
// 2D Arrays Assignment
// Finished on October 19 2023
// Project Name: Exploration Game - Discovery Update

// Project Desription:
// A fresh take on the previous room explorer, redoing the game to be based on a 2D array, adding spawning objects
// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// Used try/catch to try to do things just in case things are undefined or error out
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

let gridWidth = 10;
let gridHeight = 10;
let currentRoom;

let entityScale; // how big entities should be based on window and grid

let player = { // some parts currently rendered useless as part of the grid integration for now
  x: 0, // x and y will be implemented back into the game at a later date
  y: 0,
  w: 0,
  h: 0,
  spd: 0, // speed will be implemented back into the game at a later date
  battleX: 0,
  battleY: 0,
  sprite: null,
};

let enemies = [];
//enemy spawn point index would be 3

let roomObjects = {
  // didn't get into implementing this in time, will be implemented in future update
  // restrictions are the width and height of the object in relevance to the grid; [3,1] means 3 grid blocks long and 1 grid block tall
  treasureChest: {
    index: 4,
    restrictions: [1,1],
  },
  speedBooster: {
    index: 5,
    restrictions: [1,1],
  },
  something: {
    index: 6,
    restrictions: [1,3],
  }, 
  message: {
    index: 7,
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
  } 
  else if (windowWidth<windowHeight){
    canvas = createCanvas(windowWidth, windowWidth);
  } 
  else {
    canvas = createCanvas(windowWidth, windowHeight);
  }

  currentRoom = createRoom();

  entityScale = (width+height) / (gridWidth+gridHeight);

  player.w = entityScale;
  player.h = entityScale;
  // player.x = width / 2;
  // player.y = height / 2;
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
  let table = new Array(gridWidth);
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
  table[gridWidth/2][gridHeight/2] = 2; //player spawn point
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
  for (let i=0; i<gridWidth; i++){
    for (let j=0; j<gridHeight; j++){
      if (currentRoom[i][j]===1){
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
        for (let k=0; k<exitScale; k++){
          table[i+k][0] = 0;
        }
      }
    }
  }
  else if (direction === 1){
    for (let j=0; j<gridHeight; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[0][j+k] = 0;
        }
      }
    }
  }
  else if (direction === 2){
    for (let i=0; i<gridWidth; i++){
      if (i===randomExitPosW){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[i+k][gridHeight-1] = 0;
        }
      }
    }
  }
  else if (direction === 3){
    for (let j=0; j<gridHeight; j++){
      if (j===randomExitPosH){
        //ADD 0s IN TABLE FOR EXIT POSITIONING
        for (let k=0; k<exitScale; k++){
          table[gridWidth-1][j+k] = 0;
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
  for (let i=0; i<gridWidth; i++){
    for (let j=0; j<gridHeight; j++){
      if (currentRoom[i][j]===2){
        image(player.sprite, width/gridWidth*j, height/gridHeight*i, width/gridWidth, height/gridHeight);
      }
    }
  }
  pop();
}

function overworldControls() {
  let direction;
  if (state === "overworld") {
    if (keyIsDown(87) || keyIsDown(38)) {
      // w or up arrow
      direction = "north";
    } 
    if (keyIsDown(83) || keyIsDown(40)) {
      // s or down arrow
      direction = "south";
    } 
    if (keyIsDown(65) || keyIsDown(37)) {
      // a or left arrow
      direction = "west";
    } 
    if (keyIsDown(68) || keyIsDown(39)) {
      // d or right arrow
      direction = "east";
    } 
  }
  movePlayer(direction);
}

function movePlayer(direction) {
  if (direction){
    for (let i=0; i<gridWidth; i++){
      for (let j=0; j<gridHeight; j++){
        if (currentRoom[i][j]===2){
          if (direction === "north"){
            try{
              if (currentRoom[i-1][j] !== 1){
                currentRoom[i-1][j] = 2;
                currentRoom[i][j] = 0;
              }
            }
            catch {
              changeRoom(direction);
            }
          }
          else if (direction === "west"){
            try{
              if (currentRoom[i][j-1] !== 1){
                currentRoom[i][j-1] = 2;
                currentRoom[i][j] = 0;
              }
            }
            catch {
              changeRoom(direction);
            }
          }
          else if (direction === "south"){
            try{
              if (currentRoom[i+1][j] !== 1){
                currentRoom[i+1][j] = 2;
                currentRoom[i][j] = 0;
              }
            }
            catch {
              changeRoom(direction);
            }
          }
          else if (direction === "east"){
            try{
              if (currentRoom[i][j+1] !== 1){
                currentRoom[i][j+1] = 2;
                currentRoom[i][j] = 0;
              }
            }
            catch {
              changeRoom(direction);
            }
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
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[i][0]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[i][gridHeight-1] = oldExitPos[i];
    }
    for (let i=0; i<gridWidth; i++){
      for (let j=0; j<gridHeight; j++){
        if (oldRoom[i][j]===2){
          currentRoom[i][gridHeight-1] = 2;
        }
      }
    }
  } 
  else if (direction === "west") {
    oppositeExit = 3; //east
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[0][i]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[gridWidth-1][i] = oldExitPos[i];
    }
    for (let i=0; i<gridWidth; i++){
      for (let j=0; j<gridHeight; j++){
        if (oldRoom[i][j]===2){
          currentRoom[gridWidth-1][j] = 2;
        }
      }
    }
  } 
  else if (direction === "south") {
    oppositeExit = 0; //north
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[i][gridHeight-1]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[i][0] = oldExitPos[i];
    }
    for (let i=0; i<gridWidth; i++){
      for (let j=0; j<gridHeight; j++){
        if (oldRoom[i][j]===2){
          currentRoom[i][0] = 2;
        }
      }
    }
  } 
  else if (direction === "east") {
    oppositeExit = 1; //west
    randomExits();
    exits[0] = oppositeExit;
    for (let i=0; i<gridWidth; i++){
      oldExitPos.push(oldRoom[gridWidth-1][i]);
    }
    currentRoom = createRoom();
    findExits(currentRoom);
    for (let i=0; i<gridWidth; i++){
      currentRoom[0][i] = oldExitPos[i];
    }
    for (let i=0; i<gridWidth; i++){
      for (let j=0; j<gridHeight; j++){
        if (oldRoom[i][j]===2){
          currentRoom[0][j] = 2;
        }
      }
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
  //teleports the player so long as the mouse is in the room.
  // if (
  //   mouseX > roomBorder &&
  //   mouseX < width - roomBorder &&
  //   mouseY > roomBorder &&
  //   mouseY < height - roomBorder
  // ) {
  //  player.x = mouseX;
  //  player.y = mouseY;
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
  // let oldWidth = width;
  // let oldHeight = height;

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

  // let percentOldX = player.x/oldWidth;
  // let percentOldY = player.y/oldHeight;

  // player.x = percentOldX*width;
  // player.y = percentOldY*height;
  
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