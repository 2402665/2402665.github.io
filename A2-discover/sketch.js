// Ethan Heshka
// Computer Science 30
// Arrays/Objects Assignment
// Finished on October 19 2023
// Project Name: Exploration Game - Object Update

// Project Desription:
// A fresh take on the previous room explorer, reformatting the code to have arrays and objects, and bug fixes.

// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Click within the room (but not close to the room borders and not within an exit) to teleport the block and advance through rooms quickly.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// Fixed window.onResize() function, now places player correctly when resized and is fully functional

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

let roomBorder; // the width / height of the room border. Becomes defined later.
let exitScale = 2; // how large the exits should be

let exits = [0,0,0,0];

let gridWidth = 10;
let gridHeight = 10;
let room = new Array(gridWidth);

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
  // restrictions are the width and height of the object in relevance to the grid; [1,1] means 1 grid block tall and 1 grid block long
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

  roomBorder = (width + height) / 40;

  player.w = roomBorder;
  player.h = roomBorder;
  player.x = width / 2 - player.w / 2;
  player.y = height / 2 - player.h / 2;
  player.spd = roomBorder / 10;
  
  colors = allNewColors(colorIndex);

  randomExits();

  createRoom(room);


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
  for(let i=0; i<table.length; i++){
    if(i===0 || i===table.length-1){
      table[i] = new Array(gridHeight).fill(1);
    }
    else {
      table[i] = new Array(gridHeight).fill(0);
      table[i][0] = 1;
      table[i][table[i].length-1] = 1;
    }
  }
  console.log(table);
}

function loadRoom() {
  background(color(colors[0]));
  noStroke();
  createBorder();
  createExits();
  loadEntities();
}

function createBorder() {
  fill(color(colors[1]));
  rect(0, 0, width, roomBorder); // north border
  rect(0, 0, roomBorder, height); // west border
  rect(0, height - roomBorder, width, roomBorder); // south border
  rect(width - roomBorder, 0, roomBorder, height); // east border
}

function createExits() {
  for (let exitCheck = 0; exitCheck < 4; exitCheck++) {
    // running through each exit possibility and checking which exit exists
    for (let exit of exits){
      if (exit === exitCheck) {
        drawExit(exit);
      } 
    }
  }
}

function drawExit(direction) {
  //north = 0, west = 1, south = 2, east = 3
  fill(color(colors[0]));
  if (direction === 0) {
    rect(
      width / 2 - roomBorder * (exitScale - 0.5),
      0,
      roomBorder * (exitScale + 1),
      roomBorder
    );
  } 
  else if (direction === 1) {
    rect(
      0,
      height / 2 - roomBorder * (exitScale - 0.5),
      roomBorder,
      roomBorder * (exitScale + 1)
    );
  } 
  else if (direction === 2) {
    rect(
      width / 2 - roomBorder * (exitScale - 0.5),
      height - roomBorder,
      roomBorder * (exitScale + 1),
      roomBorder
    );
  } 
  else if (direction === 3) {
    rect(
      width - roomBorder,
      height / 2 - roomBorder * (exitScale - 0.5),
      roomBorder,
      roomBorder * (exitScale + 1)
    );
  }
}

function randomExits() {
  // for (let exit of exits){
  //   exit = floor(random(4));
  // }
  for (let i=0; i<exits.length; i++){
    exits[i] = floor(random(4));
  }
}

function loadEntities() {
  // if there were multiple entities, for example a treasure chest or enemy, they would have their seperate functions loaded here.
  loadPlayer();
}

function loadPlayer() {
  fill(color(colors[2]));
  image(player.sprite,player.x, player.y, player.w, player.h);
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
  if (direction === "up") {
    if (checkExitPosition("north")) {
      // checks if there's a north exit
      return player.y >= roomBorder ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w < width / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("west")) {
      // checks if there's a west exit
      return player.y >= roomBorder &&
          player.x >= roomBorder &&
          player.x < width - roomBorder ||
        player.x <= roomBorder &&
          player.y > height / 2 - roomBorder * (exitScale - 0.5)
      ;
    }
    if (checkExitPosition("east")) {
      // checks if there's an east exit
      return player.y >= roomBorder &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder - player.w ||
        player.x >= width - roomBorder - player.w &&
          player.y > height / 2 - roomBorder * (exitScale - 0.5)
      ;
    }
    return player.y > roomBorder + 1; // if only exit is south
  } 
  else if (direction === "down") {
    if (checkExitPosition("south")) {
      // checks if there's a south exit
      return player.y <= height - roomBorder - player.h ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w < width / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("west")) {
      // checks if there's a west exit
      return player.y <= height - roomBorder - player.h &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder ||
        player.x <= roomBorder &&
          player.y <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder);
    }
    if (checkExitPosition("east")) {
      // checks if there's an east exit
      return player.y <= height - roomBorder - player.h &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder - player.h ||
        player.x >= width - roomBorder - player.h &&
          player.y <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder);
    }

    return player.y <= height - roomBorder - player.h; // if only exit is north
  } 
  else if (direction === "left") {
    if (checkExitPosition("west")) {
      // checks if there's a west exit
      return player.x > 1 + roomBorder ||
        player.y > height / 2 - roomBorder * (exitScale - 0.5) &&
          player.y + player.h < height / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("south")) {
      // checks if there's a south exit
      return player.y <= height - roomBorder - player.h - 1 ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w <
            width / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("north")) {
      // checks if there's a north exit
      return player.y > roomBorder - 1 ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x < width / 2 + roomBorder * (exitScale - 0.5);
    }

    return player.x > roomBorder + 1; // if only exit is east
  } 
  else if (direction === "right") {
    if (checkExitPosition("east")) {
      // checks if there's a east exit
      return player.x < width - roomBorder - player.w - 1 ||
        player.y > height / 2 - roomBorder * (exitScale - 0.5) &&
          player.y + player.h < height / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("south")) {
      // checks if there's a south exit
      return player.y <= height - roomBorder - player.h ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w <
            width / 2 + roomBorder * (exitScale - 0.5);
    }
    if (checkExitPosition("north")) {
      // checks if there's a north exit
      return player.y > roomBorder - 1 ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x <
            width / 2 + roomBorder * (exitScale - 0.5) - player.w;
    }

    return player.x <= width - roomBorder - player.w; // if only exit is west
  }
}

function checkExitPosition(exitDirection){
  let foundExit = false;
  if (exitDirection === "north"){
    for (let exit of exits){
      if (foundExit === false){
        if (exit === 0 && player.y < roomBorder){
          foundExit = true;
        }
      }
    }
  }
  else if (exitDirection === "west"){
    for (let exit of exits){
      if (foundExit === false){
        if (exit === 1 && player.x <= roomBorder){
          foundExit = true;
        }
      }
    }
  }
  else if (exitDirection === "south"){
    for (let exit of exits){
      if (foundExit === false){
        if (exit === 2 && player.y > height - roomBorder - player.h){
          foundExit = true;
        }
      }
    }
  }
  else if (exitDirection === "east"){
    for (let exit of exits){
      if (foundExit === false){
        if (exit === 3 && player.x > width - roomBorder - player.w){
          foundExit = true;
        }
      }
    }
  }
  return foundExit;
}

function checkRoomChange() { //changes the current room if player left
  let exitOptions = ["north","west","south","east"];
  for (let i=0; i<4; i++){
    for (let exit of exits){
      if (exit===i && checkExitCollision(exitOptions[i])){
        changeRoom(exitOptions[i]);
      }
    }
  }
}

function changeRoom(direction){
  let oppositeExit;
  if (direction === "north") {
    oppositeExit = 2; //south
    randomExits();
    exits[0] = oppositeExit;
    player.y = height - roomBorder - player.h / 2;
  } 
  else if (direction === "west") {
    oppositeExit = 3; //east
    randomExits();
    exits[0] = oppositeExit;
    player.x = width - roomBorder - player.w / 2;
  } 
  else if (direction === "south") {
    oppositeExit = 0; //north
    randomExits();
    exits[0] = oppositeExit;
    player.y = player.h;
  } 
  else if (direction === "east") {
    oppositeExit = 1; //west
    randomExits();
    exits[0] = oppositeExit;
    player.x = player.w;
  }
  colors = allNewColors(colorIndex);
}

function checkExitCollision(direction) { //checks if a player left a room
  if (direction === "north") {
    return player.y <= 0;
  } 
  else if (direction === "west") {
    return player.x <= 0;
  } 
  else if (direction === "south") {
    return player.y >= height - player.h;
  } 
  else if (direction === "east") {
    return player.x >= width - player.w;
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
  //adds/subtracts player's width/height in formula to make sure you cannot teleport into a border, however this means you cannot teleport inside an exit.
  if (
    mouseX > roomBorder + player.w / 2 &&
    mouseX < width - roomBorder - player.w / 2 &&
    mouseY > roomBorder + player.h / 2 &&
    mouseY < height - roomBorder - player.h / 2
  ) {
    player.x = mouseX - player.w / 2;
    player.y = mouseY - player.h / 2;
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
  
  roomBorder = (width + height) / 40;
  
  player.w = roomBorder;
  player.h = roomBorder;

  let percentOldX = player.x/oldWidth;
  let percentOldY = player.y/oldHeight;

  player.x = percentOldX*width;
  player.y = percentOldY*height;
  
  player.spd = roomBorder / 10;
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