// Walker OOP

class Walker {
  constructor(x,y,speed,color,size){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;
    this.size = size;
  }
  display(){
    noStroke();
    fill(this.color);
    circle(this.x,this.y,this.size);
  }
  move(){
    let theChoice = random(100);
    if (theChoice < 25){
      //down
      this.y += this.speed;
    }
    else if (theChoice < 50){
      //up
      this.y -= this.speed;
    }
    else if (theChoice < 75){
      //left
      this.x -= this.speed;
    }
    else{
      this.x += this.speed;
    }
  }
}

let gabe;
// let mario;
// let luigi;

let theWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("white");
  gabe = new Walker(width/2, height/2, 3, "blue", 5);
  theWalkers.push(gabe);
  // mario = new Walker(width/1.5, height/2, 7, "red", 10);
  // luigi = new Walker(width/2.5, height/2, 1, "green", 3);
}

function draw() {
  for (let person of theWalkers){
    person.display();
    person.move();
  }
}

function mousePressed(){
  let newPerson = new Walker(mouseX, mouseY, 3, "blue", 5);
  theWalkers.push(newPerson);
}