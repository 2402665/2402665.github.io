// Images and Sounds Demo

let mario;
let yahoo;
let bgm;

let playMode = "restart";

function preload(){
  mario = loadImage("mario.png");
  yahoo = loadSound("mario-yahoo.mp3");
  bgm = loadSound("01-ground.mp3");

  bgm.setVolume(0.5);
  yahoo.setVolume(1.0);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  if (!bgm.isPlaying()){
    bgm.loop();
  }
}

function draw() {
  background(220);

  image(mario,mouseX,mouseY,mario.width/2,mario.height/2);
}

function mousePressed(){
  yahoo.play(); 
}