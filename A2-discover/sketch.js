// Ethan Heshka
// Computer Science 30
// Interactive Scene Assignment
// Finished on October 1st 2023
// Project Name: Exploration Game

// Project Desription:
// A simple blocky game where you walk around an endless maze where the exits and colors are constantly changing.

// Controls:
// Use the WSAD or arrow keys to control the tiny block in the middle.
// Click within and not close to the room borders, however not within an exit, to teleport the block and advance through rooms quickly.
// Scroll the mouse wheel forward to make everything darker.
// Scroll the mouse wheel backward to make everything lighter.

// Extras for Experts:
// The mouse wheel has functionality.
// When the browser is resized, so is the room.

// Known Bugs:
// When there is an exit in the north or south direction and you move upward/downward into a wall adjacent to said exit, it may lock your controls. To fix this, move in the opposite direction.
// In some cases for an unknown reason, the player square cannot enter the north exit. The collision acts as if there is no exit there. When this happens, the bug listed above does not occur.
// When the room becomes resized, the player position becomes thrown all over. For now, when the room gets resized, the player's position is reset to the direct middle of the room.
// When the room becomes resized, there's a scroller that allows you to see past the room's border. This does not affect the game itself.

// Notes:
// Originally, it was planned to have a combat system in the game. This became scrapped, and might be added at a later date. Hence there is some remaining code where the combat system needed to be checked for.
// north = 0, west = 1, south = 2, east = 3

// Code:

let canvasW;
let canvasH;

let borderColor;
let backgroundColor;
let playerColor;

let roomBorder; // the width / height of the room border. Becomes defined later.
let exitScale = 2; // how large the exits should be

let exit0;
let exit1;

let playerX;
let playerY;

let playerWidth;
let playerHeight;

let playerSPD;

//let battlePlayerX;
//let battlePlayerY;
//let battleEnemyX;
//let battleEnemyY;

let state = "overworld";

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  roomBorder = (width + height) / 40;

  playerWidth = roomBorder;
  playerHeight = roomBorder;

  playerX = width / 2 - playerWidth / 2;
  playerY = height / 2 - playerHeight / 2;

  playerSPD = roomBorder / 10;

  randomExits();

  borderColor = randomColors();
  backgroundColor = randomColors();
  playerColor = randomColors();
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
  background(color(backgroundColor[0], backgroundColor[1], backgroundColor[2]));
  noStroke();
  createBorder();
  createExits();
  loadEntities();
}

function createBorder() {
  fill(color(borderColor[0], borderColor[1], borderColor[2]));
  rect(0, 0, width, roomBorder); // north border
  rect(0, 0, roomBorder, height); // west border
  rect(0, height - roomBorder, width, roomBorder); // south border
  rect(width - roomBorder, 0, roomBorder, height); // east border
}

function createExits() {
  for (let exitCheck = 0; exitCheck < 4; exitCheck += 1) {
    // running through each exit possibility and checking which exit exists
    if (exit0 === exitCheck) {
      drawExit(exitCheck);
    } 
    else if (exit1 === exitCheck) {
      drawExit(exitCheck);
    }
  }
}

function drawExit(direction) {
  //north = 0, west = 1, south = 2, east = 3
  fill(color(backgroundColor[0], backgroundColor[1], backgroundColor[2]));
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
  exit0 = floor(random(4));
  exit1 = floor(random(4));
}

function loadEntities() {
  // if there were multiple entities, for example a treasure chest or enemy, they would have their seperate functions loaded here.
  loadPlayer();
}

function loadPlayer() {
  fill(color(playerColor[0], playerColor[1], playerColor[2]));
  rect(playerX, playerY, playerWidth, playerHeight);
}

function overworldControls() {
  if (state === "overworld") {
    if (keyIsDown(87)) {
      // w
      if (collisionCheck("up")) {
        playerY -= playerSPD;
      }
    } 
    else if (keyIsDown(38)) {
      // up arrow
      if (collisionCheck("up")) {
        playerY -= playerSPD;
      }
    }
    if (keyIsDown(83)) {
      // s
      if (collisionCheck("down")) {
        playerY += playerSPD;
      }
    } 
    else if (keyIsDown(40)) {
      // down arrow
      if (collisionCheck("down")) {
        playerY += playerSPD;
      }
    }
    if (keyIsDown(65)) {
      // a
      if (collisionCheck("left")) {
        playerX -= playerSPD;
      }
    } 
    else if (keyIsDown(37)) {
      // left arrow
      if (collisionCheck("left")) {
        playerX -= playerSPD;
      }
    }
    if (keyIsDown(68)) {
      // d
      if (collisionCheck("right")) {
        playerX += playerSPD;
      }
    } 
    else if (keyIsDown(39)) {
      // right arrow
      if (collisionCheck("right")) {
        playerX += playerSPD;
      }
    }
  }
}

function collisionCheck(direction) {
  if (direction === "up") {
    if (
      exit0 === 0 && playerY <= roomBorder ||
      exit1 === 0 && playerY <= roomBorder
    ) {
      // checks if there's a north exit
      return (
        playerY >= roomBorder ||
        playerX >= width / 2 - roomBorder * (exitScale - 0.5) &&
          playerX + playerWidth < width / 2 + roomBorder * (exitScale - 0.5)
      );
    }
    if (
      exit0 === 1 && playerX < roomBorder ||
      exit1 === 1 && playerX < roomBorder
    ) {
      // checks if there's a west exit
      return playerY >= roomBorder &&
          playerX >= roomBorder &&
          playerX < width - roomBorder ||
        playerX <= roomBorder &&
          playerY > height / 2 - roomBorder * (exitScale - 0.5) + 2
      ;
    }
    if (
      exit0 === 3 && playerX >= width - roomBorder - playerWidth ||
      exit1 === 3 && playerX >= width - roomBorder - playerWidth
    ) {
      // checks if there's an east exit
      return (
        playerY >= roomBorder &&
          playerX >= roomBorder &&
          playerX <= width - roomBorder - playerWidth ||
        playerX >= width - roomBorder - playerWidth &&
          playerY > height / 2 - roomBorder * (exitScale - 0.5) + 2)
      ;
    }
    return playerY > roomBorder + 1; // if only exit is south
  } 
  else if (direction === "down") {
    if (
      exit0 === 2 && playerY > height - roomBorder - playerHeight ||
      exit1 === 2 && playerY > height - roomBorder - playerHeight
    ) {
      // checks if there's a south exit
      return (
        playerY <= height - roomBorder - playerHeight ||
        playerX > width / 2 - roomBorder * (exitScale - 0.5) &&
          playerX + playerWidth < width / 2 + roomBorder * (exitScale - 0.5)
      );
    }
    if (
      exit0 === 1 && playerX < roomBorder ||
      exit1 === 1 && playerX < roomBorder
    ) {
      // checks if there's a west exit
      return (
        playerY <= height - roomBorder - playerHeight &&
          playerX >= roomBorder &&
          playerX <= width - roomBorder ||
        playerX <= roomBorder &&
          playerY <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder - 2))
      ;
    }
    if (
      exit0 === 3 && playerX > width - roomBorder - playerWidth ||
      exit1 === 3 && playerX > width - roomBorder - playerWidth
    ) {
      // checks if there's an east exit
      return playerY <= height - roomBorder - playerHeight &&
          playerX >= roomBorder &&
          playerX <= width - roomBorder - playerHeight ||
        playerX >= width - roomBorder - playerHeight &&
          playerY <
            height / 2 + (roomBorder * (exitScale - 0.5) - roomBorder - 2)
      ;
    }

    return playerY <= height - roomBorder - playerHeight; // if only exit is north
  } 
  else if (direction === "left") {
    if (
      exit0 === 1 && playerX <= roomBorder + 1 ||
      exit1 === 1 && playerX <= roomBorder + 1
    ) {
      // checks if there's a west exit
      return playerX > 1 + roomBorder ||
        playerY > height / 2 - roomBorder * (exitScale - 0.5) &&
          playerY + playerHeight < height / 2 + roomBorder * (exitScale - 0.5)
      ;
    }
    if (
      exit0 === 2 && playerY > height - roomBorder - playerHeight + 1 ||
      exit1 === 2 && playerY > height - roomBorder - playerHeight + 1
    ) {
      // checks if there's a south exit
      return playerY <= height - roomBorder - playerHeight - 1 ||
        playerX > width / 2 - roomBorder * (exitScale - 0.5) + 2 &&
          playerX + playerWidth <
            width / 2 + roomBorder * (exitScale - 0.5) + 2
      ;
    }
    if (
      exit0 === 0 && playerY <= roomBorder - 1 ||
      exit1 === 0 && playerY <= roomBorder - 1
    ) {
      // checks if there's a north exit
      return playerY > roomBorder - 1 ||
        playerX >= width / 2 - roomBorder * (exitScale - 0.5) + 2.5 &&
          playerX < width / 2 + roomBorder * (exitScale - 0.5) + 2
      ;
    }

    return playerX > roomBorder + 1; // if only exit is east
  } 
  else if (direction === "right") {
    if (
      exit0 === 3 && playerX > width - roomBorder - playerWidth - 1 ||
      exit1 === 3 && playerX > width - roomBorder - playerWidth - 1
    ) {
      // checks if there's a east exit
      return playerX < width - roomBorder - playerWidth - 1 ||
        playerY > height / 2 - roomBorder * (exitScale - 0.5) &&
          playerY + playerHeight < height / 2 + roomBorder * (exitScale - 0.5)
      ;
    }
    if (
      exit0 === 2 && playerY > height - roomBorder - playerHeight + 1 ||
      exit1 === 2 && playerY > height - roomBorder - playerHeight + 1
    ) {
      // checks if there's a south exit
      return playerY <= height - roomBorder - playerHeight ||
        playerX > width / 2 - roomBorder * (exitScale - 0.5) - 2 &&
          playerX + playerWidth <
            width / 2 + roomBorder * (exitScale - 0.5) - 2
      ;
    }
    if (
      exit0 === 0 && playerY < roomBorder + 1 ||
      exit1 === 0 && playerY < roomBorder + 1
    ) {
      // checks if there's a north exit
      return playerY > roomBorder - 1 ||
        playerX >= width / 2 - roomBorder * (exitScale - 0.5) - 2.5 &&
          playerX <
            width / 2 + roomBorder * (exitScale - 0.5) - playerWidth - 2
      ;
    }

    return playerX <= width - roomBorder - playerWidth; // if only exit is west
  }
}

function checkRoomChange() { //changes the current room if player left
  let oppositeExit;
  if (
    exit0 === 0 && checkExitCollision("north") ||
    exit1 === 0 && checkExitCollision("north")
  ) {
    oppositeExit = 2; //south
    randomExits();
    exit0 = oppositeExit;
    playerY = height - roomBorder - playerHeight / 2;
    borderColor = randomColors();
    backgroundColor = randomColors();
    playerColor = randomColors();
  } 
  else if (
    exit0 === 1 && checkExitCollision("west") ||
    exit1 === 1 && checkExitCollision("west")
  ) {
    oppositeExit = 3; //east
    randomExits();
    exit0 = oppositeExit;
    playerX = width - roomBorder - playerWidth / 2;
    borderColor = randomColors();
    backgroundColor = randomColors();
    playerColor = randomColors();
  } 
  else if (
    exit0 === 2 && checkExitCollision("south") ||
    exit1 === 2 && checkExitCollision("south")
  ) {
    oppositeExit = 0; //north
    randomExits();
    exit0 = oppositeExit;
    playerY = playerHeight;
    borderColor = randomColors();
    backgroundColor = randomColors();
    playerColor = randomColors();
  } 
  else if (
    exit0 === 3 && checkExitCollision("east") ||
    exit1 === 3 && checkExitCollision("east")
  ) {
    oppositeExit = 1; //west
    randomExits();
    exit0 = oppositeExit;
    playerX = playerWidth;
    borderColor = randomColors();
    backgroundColor = randomColors();
    playerColor = randomColors();
  }
}

function checkExitCollision(direction) { //checks if a player left a room
  if (direction === "north") {
    return playerY <= 0;
  } 
  else if (direction === "west") {
    return playerX <= 0;
  } 
  else if (direction === "south") {
    return playerY >= height - playerHeight;
  } 
  else if (direction === "east") {
    return playerX >= width - playerWidth;
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
    mouseX > roomBorder + playerWidth / 2 &&
    mouseX < width - roomBorder - playerWidth / 2 &&
    mouseY > roomBorder + playerHeight / 2 &&
    mouseY < height - roomBorder - playerHeight / 2
  ) {
    playerX = mouseX - playerWidth / 2;
    playerY = mouseY - playerHeight / 2;
  }
}

function mouseWheel(event) { //darkens or lightens all colors
  // event.delta is how much the mouse has scrolled, and since this value is decently high, it is divided by 10 in the formula to keep colors similar.
  borderColor = [
    borderColor[0] + event.delta / 10,
    borderColor[1] + event.delta / 10,
    borderColor[2] + event.delta / 10,
  ];
  backgroundColor = [
    backgroundColor[0] + event.delta / 10,
    backgroundColor[1] + event.delta / 10,
    backgroundColor[2] + event.delta / 10,
  ];
  playerColor = [
    playerColor[0] + event.delta / 10,
    playerColor[1] + event.delta / 10,
    playerColor[2] + event.delta / 10,
  ];
}

window.onresize = function() { // if the window gets resized
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;  
  canvas.size = (newWidth,newHeight);
  width = newWidth;
  height = newHeight;
  
  roomBorder = (width + height) / 40;
  
  playerWidth = roomBorder;
  playerHeight = roomBorder;
  
  playerX = width / 2 - playerWidth / 2;
  playerY = height / 2 - playerHeight / 2;
  
  playerSPD = roomBorder / 10;
};

// function loadBattle(){

// }
