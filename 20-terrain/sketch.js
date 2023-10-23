// Terrain Generation
// mario is buggy, rest works just fine

let terrain = [];
let xOffset = 0;
let xOffsetSPD = 10;
let noiseLength = 10000;

let mario = {
  image: 0,
  w: 100,
  h: 100,
  x: 20,
  y: 0,
};

function preload(){
  mario.image = loadImage("Mario Silhouette.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnRectangles();
  mario.x += mario.h;
}

function draw() {
  background(220);

  if (keyIsDown(RIGHT_ARROW)){
    if (xOffset < noiseLength){
      xOffset += xOffsetSPD;
    }
  }

  if (keyIsDown(LEFT_ARROW)){
    if (xOffset > xOffsetSPD){
      xOffset -= xOffsetSPD;
    }
  }

  displayTerrain();
}

function displayTerrain(){
  for (let i=xOffset; i<width+xOffset; i++){
    rect(terrain[i].x - xOffset, height-terrain[i].h, 1, terrain[i].h);
    mario.y = terrain[i].h - mario.h/2;
    image(mario.image, mario.x,mario.y,mario.w,mario.h);
  }
}

function spawnRectangles(){
  let time = 0;
  for (let x = 0; x < noiseLength; x++){
    let h = noise(time) * height;
    let thisRect = {
      x: x,
      h: h,
    };
    terrain.push(thisRect);
    time += 0.001; //shrink for smooth, enlarge value for spiky
  }
}