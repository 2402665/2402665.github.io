// Dog OOP Demo

class Dog {

  constructor(name, color, breed, age, size){
    this.name = name;
    this.color = color;
    this.breed = breed;
    this.age = age;
    this.size = size;

  }

  bark(){
    console.log("Arf! says " + this.name);
  }

}

let spot = new Dog("Spot","Black", "Poodle", 3, "Smallish");
let rover = new Dog("Rover", "White", "German Shepherd", 5, "Big");

function setup() {
  createCanvas(windowWidth, windowHeight);
  spot.bark();
  rover.bark();
}

function draw() {
  background(220);
}
