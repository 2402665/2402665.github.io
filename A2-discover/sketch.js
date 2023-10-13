// Ethan Heshka
// Computer Science 30
// Arrays/Objects Assignment
// Finished on October ??? 2023
// Project Name: Exploration Game - Discovery Update

// Project Desription:
// A fresh take on the previous room explorer, adding (new objects), reformatting the code to have arrays and objects, and bug fixes.

// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Click within the room (but not close to the room borders and not within an exit) to teleport the block and advance through rooms quickly.
// Scroll the mouse wheel forward to make all colors darker.
// Scroll the mouse wheel backward to make all colors lighter.

// Extras for Experts:
// 

// Known Bugs:
// When there is an exit in any direction and you move into the walls adjacent to said exit, it may lock your controls. To get out of this situation, move in the opposite direction.
// In some cases for an unknown reason, the player square cannot enter the north exit. The collision acts as if there is no exit there. When this happens, the bug listed above does not occur.

// Notes:
// Originally, it was planned to have a combat system in the game. This became scrapped, and might be added at a later date. Hence there is some remaining code where the combat system would need pieces implemented to work.
// north = 0, west = 1, south = 2, east = 3

// Code:

let colors = {
  bg: 0,
  border: 0,
  player: 0,
};

let roomBorder; // the width / height of the room border. Becomes defined later.
let exitScale = 2; // how large the exits should be

let exits = {
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
};

let player = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  spd: 0,
  battleX: 0,
  battleY: 0,
};

let enemies = [];

let roomObjects = {
  treasureChest: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    visible: false,
  },
  speedBooster: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    visible: false,
  },
  something: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    visible: false,
  }, 
  message: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    visible: false,
  }, 
};

//REMEMBER TO CHANGE PLAYER RECTMODE TO CENTER, POSSIBLY OTHERS TOO
//ALSO CHANGE EXIT OBJECT INTO A TABLE

let state = "overworld";

// function preload(){

// }

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
  


  randomExits();

  colors.bg = randomColors();
  colors.border = randomColors();
  colors.player = randomColors();

  // for (let property in colors){
  //   property = randomColors();
  // }
}

function draw() {
  if (state === "overworld") {
    // If the player is not in combat
    loadRoom();
    overworldControls();
    checkRoomChange();
  } //else if (state === "battle") {
  //   loadBattle();
  // }
}

function loadRoom() {
  background(colors.bg);
  noStroke();
  createBorder();
  createExits();
  loadEntities();
}

function createBorder() {
  fill(colors.border);
  rect(0, 0, width, roomBorder); // north border
  rect(0, 0, roomBorder, height); // west border
  rect(0, height - roomBorder, width, roomBorder); // south border
  rect(width - roomBorder, 0, roomBorder, height); // east border
}

function createExits() {
  for (let exitCheck = 0; exitCheck < 4; exitCheck += 1) {
    // running through each exit possibility and checking which exit exists
    if (exits.num1 === exitCheck) {
      drawExit(exitCheck);
    } 
    else if (exits.num2 === exitCheck) {
      drawExit(exitCheck);
    }
    else if (exits.num3 === exitCheck) {
      drawExit(exitCheck);
    } 
    else if (exits.num4 === exitCheck) {
      drawExit(exitCheck);
    }
  }
}

function drawExit(direction) {
  //north = 0, west = 1, south = 2, east = 3
  fill(colors.bg);
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
  exits.num1 = floor(random(4));
  exits.num2 = floor(random(4));
  exits.num3 = floor(random(4));
  exits.num4 = floor(random(4));
}

function loadEntities() {
  // if there were multiple entities, for example a treasure chest or enemy, they would have their seperate functions loaded here.
  loadPlayer();
}

function loadPlayer() {
  fill(colors.player);
  rect(player.x, player.y, player.w, player.h);
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
    if (
      exits.num1 === 0 && player.y <= roomBorder ||
      exits.num2 === 0 && player.y <= roomBorder ||
      exits.num3 === 0 && player.y <= roomBorder ||
      exits.num4 === 0 && player.y <= roomBorder
    ) {
      // checks if there's a north exit
      return (
        player.y >= roomBorder ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w < width / 2 + roomBorder * (exitScale - 0.5)
      );
    }
    if (
      exits.num1 === 1 && player.x < roomBorder ||
      exits.num2 === 1 && player.x < roomBorder ||
      exits.num3 === 1 && player.x < roomBorder ||
      exits.num4 === 1 && player.x < roomBorder
    ) {
      // checks if there's a west exit
      return player.y >= roomBorder &&
          player.x >= roomBorder &&
          player.x < width - roomBorder ||
        player.x <= roomBorder &&
          player.y > height / 2 - roomBorder * (exitScale - 0.5) + 2
      ;
    }
    if (
      exits.num1 === 3 && player.x >= width - roomBorder - player.w ||
      exits.num2 === 3 && player.x >= width - roomBorder - player.w ||
      exits.num3 === 3 && player.x >= width - roomBorder - player.w ||
      exits.num4 === 3 && player.x >= width - roomBorder - player.w
    ) {
      // checks if there's an east exit
      return (
        player.y >= roomBorder &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder - player.w ||
        player.x >= width - roomBorder - player.w &&
          player.y > height / 2 - roomBorder * (exitScale - 0.5) + 2)
      ;
    }
    return player.y > roomBorder + 1; // if only exit is south
  } 
  else if (direction === "down") {
    if (
      exits.num1 === 2 && player.y > height - roomBorder - player.h ||
      exits.num2 === 2 && player.y > height - roomBorder - player.h ||
      exits.num3 === 2 && player.y > height - roomBorder - player.h ||
      exits.num4 === 2 && player.y > height - roomBorder - player.h
    ) {
      // checks if there's a south exit
      return (
        player.y <= height - roomBorder - player.h ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) &&
          player.x + player.w < width / 2 + roomBorder * (exitScale - 0.5)
      );
    }
    if (
      exits.num1 === 1 && player.x < roomBorder ||
      exits.num2 === 1 && player.x < roomBorder ||
      exits.num3 === 1 && player.x < roomBorder ||
      exits.num4 === 1 && player.x < roomBorder
    ) {
      // checks if there's a west exit
      return (
        player.y <= height - roomBorder - player.h &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder ||
        player.x <= roomBorder &&
          player.y <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder - 2))
      ;
    }
    if (
      exits.num1 === 3 && player.x > width - roomBorder - player.w ||
      exits.num2 === 3 && player.x > width - roomBorder - player.w || 
      exits.num3 === 3 && player.x > width - roomBorder - player.w ||
      exits.num4 === 3 && player.x > width - roomBorder - player.w
    ) {
      // checks if there's an east exit
      return player.y <= height - roomBorder - player.h &&
          player.x >= roomBorder &&
          player.x <= width - roomBorder - player.h ||
        player.x >= width - roomBorder - player.h &&
          player.y <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder - 2)
      ;
    }

    return player.y <= height - roomBorder - player.h; // if only exit is north
  } 
  else if (direction === "left") {
    if (
      exits.num1 === 1 && player.x <= roomBorder + 1 ||
      exits.num2 === 1 && player.x <= roomBorder + 1 ||
      exits.num3 === 1 && player.x <= roomBorder + 1 ||
      exits.num4 === 1 && player.x <= roomBorder + 1
    ) {
      // checks if there's a west exit
      return player.x > 1 + roomBorder ||
        player.y > height / 2 - roomBorder * (exitScale - 0.5) &&
          player.y + player.h < height / 2 + roomBorder * (exitScale - 0.5)
      ;
    }
    if (
      exits.num1 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num2 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num3 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num4 === 2 && player.y > height - roomBorder - player.h + 1
    ) {
      // checks if there's a south exit
      return player.y <= height - roomBorder - player.h - 1 ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) + 2 &&
          player.x + player.w <
            width / 2 + roomBorder * (exitScale - 0.5) + 2
      ;
    }
    if (
      exits.num1 === 0 && player.y <= roomBorder - 1 ||
      exits.num2 === 0 && player.y <= roomBorder - 1 ||
      exits.num3 === 0 && player.y <= roomBorder - 1 ||
      exits.num4 === 0 && player.y <= roomBorder - 1
    ) {
      // checks if there's a north exit
      return player.y > roomBorder - 1 ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) + 2.5 &&
          player.x < width / 2 + roomBorder * (exitScale - 0.5) + 2
      ;
    }

    return player.x > roomBorder + 1; // if only exit is east
  } 
  else if (direction === "right") {
    if (
      exits.num1 === 3 && player.x > width - roomBorder - player.w - 1 ||
      exits.num2 === 3 && player.x > width - roomBorder - player.w - 1 ||
      exits.num3 === 3 && player.x > width - roomBorder - player.w - 1 ||
      exits.num4 === 3 && player.x > width - roomBorder - player.w - 1
    ) {
      // checks if there's a east exit
      return player.x < width - roomBorder - player.w - 1 ||
        player.y > height / 2 - roomBorder * (exitScale - 0.5) &&
          player.y + player.h < height / 2 + roomBorder * (exitScale - 0.5)
      ;
    }
    if (
      exits.num1 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num2 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num3 === 2 && player.y > height - roomBorder - player.h + 1 ||
      exits.num4 === 2 && player.y > height - roomBorder - player.h + 1
    ) {
      // checks if there's a south exit
      return player.y <= height - roomBorder - player.h ||
        player.x > width / 2 - roomBorder * (exitScale - 0.5) - 2 &&
          player.x + player.w <
            width / 2 + roomBorder * (exitScale - 0.5) - 2
      ;
    }
    if (
      exits.num1 === 0 && player.y < roomBorder + 1 ||
      exits.num2 === 0 && player.y < roomBorder + 1 ||
      exits.num3 === 0 && player.y < roomBorder + 1 ||
      exits.num4 === 0 && player.y < roomBorder + 1
    ) {
      // checks if there's a north exit
      return player.y > roomBorder - 1 ||
        player.x >= width / 2 - roomBorder * (exitScale - 0.5) - 2.5 &&
          player.x <
            width / 2 + roomBorder * (exitScale - 0.5) - player.w - 2
      ;
    }

    return player.x <= width - roomBorder - player.w; // if only exit is west
  }
}

function checkRoomChange() { //changes the current room if player left
  let oppositeExit;
  if (
    exits.num1 === 0 && checkExitCollision("north") ||
    exits.num2 === 0 && checkExitCollision("north") ||
    exits.num3 === 0 && checkExitCollision("north") ||
    exits.num4 === 0 && checkExitCollision("north")
  ) {
    oppositeExit = 2; //south
    randomExits();
    exits.num1 = oppositeExit;
    player.y = height - roomBorder - player.h / 2;
    colors.border = randomColors();
    colors.bg = randomColors();
    colors.player = randomColors();
  } 
  else if (
    exits.num1 === 1 && checkExitCollision("west") ||
    exits.num2 === 1 && checkExitCollision("west") ||
    exits.num3 === 1 && checkExitCollision("west") ||
    exits.num4 === 1 && checkExitCollision("west")
  ) {
    oppositeExit = 3; //east
    randomExits();
    exits.num1 = oppositeExit;
    player.x = width - roomBorder - player.w / 2;
    colors.border = randomColors();
    colors.bg = randomColors();
    colors.player = randomColors();
  } 
  else if (
    exits.num1 === 2 && checkExitCollision("south") ||
    exits.num2 === 2 && checkExitCollision("south") ||
    exits.num3 === 2 && checkExitCollision("south") ||
    exits.num4 === 2 && checkExitCollision("south")
  ) {
    oppositeExit = 0; //north
    randomExits();
    exits.num1 = oppositeExit;
    player.y = player.h;
    colors.border = randomColors();
    colors.bg = randomColors();
    colors.player = randomColors();
  } 
  else if (
    exits.num1 === 3 && checkExitCollision("east") ||
    exits.num2 === 3 && checkExitCollision("east") ||
    exits.num3 === 3 && checkExitCollision("east") ||
    exits.num4 === 3 && checkExitCollision("east")
  ) {
    oppositeExit = 1; //west
    randomExits();
    exits.num1 = oppositeExit;
    player.x = player.w;
    colors.border = randomColors();
    colors.bg = randomColors();
    colors.player = randomColors();
  }
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

function randomColors() {
  let r = random(255);
  let g = random(255);
  let b = random(255);
  return [r, g, b];
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
  for (let i=0; i<colors.bg.length; i++){
    colors.bg[i] += event.delta / 10;
  }
  for (let i=0; i<colors.border.length; i++){
    colors.border[i] += event.delta / 10;
  }
  for (let i=0; i<colors.player.length; i++){
    colors.player[i] += event.delta / 10;
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

// function loadBattle(){

// }

// function loadEnemies(){

// }

// function createEnemy(){

// }

// function battleControls(){

// }

// function battleUI(){

// }

// function battleButton(){

// }