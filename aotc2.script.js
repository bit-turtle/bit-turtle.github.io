function preload() {
  font = loadFont('https://bit-turtle.github.io/square.otf');
}

function setup() {
  createCanvas(600, 600);
  textFont(font);
}

var screen = 0;
var animation = {
  main: 0
};

function draw() {
  //Main
  background(0);
  noStroke();
  fill(32);
  rect(0,0,100,600);
  rect(500,0,100,600);
  stroke(255);
  strokeWeight(3)
  line(100,0,100,600);
  line(500,0,500,600);
  //Screens
  switch(screen) {
    case 0:
      //Main Screen
      fill(0);
      textAlign(CENTER);
      textSize(44);
      text("Attack Of The Cubes",300,40);
      textSize(64);
      text("Ultimate",300,110);
      rect(115,50,370,8);
      //Main Animation
      if (animation.main <= 60 && animation.main > 10) {
        rect(175-animation.main,120,250+2*animation.main,470);
      }
      else {
        rect(115,120,370,470);
      }
      animation.main++;
      break;
    case 1:
      //Play Screen
      break;
    case 2:
      //Game Over Screen
      break;
    case 3:
      //Join Screen
      break;
    default:
      //Error Screen
      fill(255,0,0);
      text("Error 404: Screen Not Found:  ["+screen+"]\nYou Will Be Returned To The Main Screen Now",200,300);
      console.log("Error 404: Screen Not Found:  ["+screen+"]");
      screen = 0;
  }
}
