/*
Attack of the Cubes v1.6 beta (The Update Update)
250+ lines of code!

Changelog:
*Update: Keyboard Controls and Control Type toggle
*Update: New Font
*Update: Version number now is visible in start screen
*Update: Enemy outlines now are part of hitbox
*Update: New Enemy the spliter cube (appears after 60 enemys have appeared)
*Fix: Spawners can no longer spawn multiple cubes without delay
*Fix: Enemys no longer spawn half outside the screen


Controls:
Mouse:
Move the mouse to move 
Click to shoot
Keyboard:
Use Right and Left Arrow Keys and A and D keys to move


Sugestions
mspears.27@acsamman.edu.jo
Give me sugestions :)

Website:
Check out my website: bit-turtle.github.io
https://bit-turtle.github.io/attack.html

Font from "https://fontesk.com/square-typeface"

*/

var version = "v1.6";

var controltype = 0;
var controltoggle = 0;
var playerX = 200;
var playerMove = 0;
var playerShoot = false;
var rightArrowPressed = false;
var leftArrowPressed = false;
var upArrowPressed = false;
var keyAPressed = false;
var keyDPressed = false;
var keyWPressed = false;
var spacebarPressed = false;
var gamestarted = false;
var gameplayed = false;
var score = 0;
var enemys = [];
var enemysDead = [];
var lazers = [];
var spliteroffset = [{x:-10,y:-10},{x:-10,y:-10},{x:10,y:10},{x:10,y:-10}];
var cooldown = 0;
var difficulty = 0;
var damage = 0;
var lives = 3;
var misses = 0;
var gameSpeed = 0;
var timer = 0;
var i;
var i2;
var i3;
var mouseicon;
var keyboardicon;
var font;

function preload() {
  mouseicon = loadImage('https://bit-turtle.github.io/mouse.png');
  keyboardicon = loadImage('https://bit-turtle.github.io/keyboard.png');
  font = loadFont('https://bit-turtle.github.io/square.otf');
}

function setup() {
  createCanvas(400, 400);
  stroke(240);
  strokeWeight(3);
  textFont(font);
}

function prepare() {
  if (controltype === 1) {playerX = 200;}
  gameplayed = true;
  enemys = [];
  enemysDead = [];
  lazers = [];
  difficulty = 0;
  score = 0;
  misses = 0;
  damage = 0;
  lives = 3;
  speed = 0;
  timer = 0;
  enemys.push({x:Math.floor(Math.random()*400),y:-10,type:0});
}
function keyPressed() {
  if (key === "ArrowRight") {
    rightArrowPressed = true;
  }
  else if (key === "ArrowLeft") {
    leftArrowPressed = true;
  }
  else if (key === "ArrowUp") {
    upArrowPressed = true;
  }
  else if (key === "w") {
    keyWPressed = true;
  }
  else if (key === "a") {
     keyAPressed= true;
  }
  else if (key === "d") {
    keyDPressed = true;
  }
  else if (key === " ") {
    spacebarPressed = true;
  }
}
function keyReleased() {
  if (key === "ArrowRight") {
    rightArrowPressed = false;
  }
  else if (key === "ArrowLeft") {
    leftArrowPressed = false;
  }
  else if (key === "ArrowUp") {
    upArrowPressed = false;
  }
  else if (key === "w") {
    keyWPressed = false;
  }
  else if (key === "a") {
    keyAPressed= false;
  }
  else if (key === "d") {
    keyDPressed = false;
  }
  else if (key === " ") {
    spacebarPressed = false;
  }
}

function draw() {
  if (gamestarted) {
      if (controltype === 0) {
      playerX = mouseX;
      if (playerX < 0) {playerX = 0;}
      else if (playerX > 400) {playerX = 400;}
      if (controltype === 0 && mouseIsPressed) {
        playerShoot = true;
      }
      else {
        playerShoot = false;
      }
    }
    else if (controltype === 1) {
      if (rightArrowPressed||keyDPressed&&leftArrowPressed === false && keyAPressed === false) {
        playerX+=3;
      }
      if (leftArrowPressed||keyAPressed&&rightArrowPressed === false && keyDPressed === false) {
        playerX-=3;
      }
      if (playerX < 0) {playerX = 0;}
      else if (playerX > 400) {playerX = 400;}
      if (spacebarPressed||upArrowPressed||keyWPressed) {
        playerShoot = true;
      }
      else {
        playerShoot = false;
      }
    }
    background(0+damage*8,0,0);
    damage-=0.6;
    cooldown-=1;
    if (lives <= 0 && damage < 0) {
      if (score > highscore) {
        highscore = score;
        setCookie("attackhighscore",0,30);
      }
      gamestarted = false;
    }
    timer++;
    if (timer >= 200 - gameSpeed*60) {
      if (difficulty >= 15 && Math.floor(Math.random()*40) === 0) {
        enemys.push({x:Math.floor(Math.random()*300 + 50),y:-20,type:4});
      }
      else if (difficulty >= 10 && Math.floor(Math.random()*20) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:3,sheild:1,cooldown:0,data:0});
      }
      else if (difficulty >= 5 && Math.floor(Math.random()*10) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:2});
      }
      else if (difficulty >= 1 && Math.floor(Math.random()*5) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:1});
      }
      else {
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0}); 
      }
      difficulty+=0.25;
      if (difficulty === 8) {
        gameSpeed = 1;
      }
      else if (difficulty === 16) {
        gameSpeed = 2;
      }
      timer = 0;
    }
    if (cooldown < 0 && playerShoot) {
      lazers.push({x:playerX,y:400});
      cooldown = 25;
    }
    for (i = 0; i < lazers.length; i++) {
      lazers[i].y-=4;
      fill(0,0,200);
      rect(lazers[i].x-3,lazers[i].y-5,5,10);
    }
    for (i = 0; i < lazers.length; i++) {
      if (lazers[i].y < -10) {
        lazers.splice(i,1);
      }
    }
    for (i = 0; i < enemys.length; i++) {
      if (enemys[i].type === 0) {
        if (difficulty > 8) {
          enemys[i].y+=2;
          
        }
        else {
          enemys[i].y+=1;
        }
        fill(255,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 1) {
        if (difficulty > 12) {
          enemys[i].x+=4;
        }
        else if (difficulty > 8) {
          enemys[i].y+=3;
        }
        else {
          enemys[i].y+=2;
        }
        fill(210,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 2) {
        enemys[i].y+=2;
        enemys[i].x+=Math.floor(Math.random()*10-5);
        if (enemys[i].x < 0) {enemys[i].x = 0}
        if (enemys[i].x > 400) {enemys[i].x = 400}
        fill(180,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 3) {
        if (enemys[i].y !== 100) {enemys[i].y+=1}
        else {
          if(enemys[i].data === 0){
            enemys[i].x+=1;
            if (enemys[i].x > 400) {
               enemys[i].data = 1;
            }
          }
          if(enemys[i].data === 1){
            enemys[i].x-=1;
            if (enemys[i].x < 0) {
               enemys[i].data = 0;
            }
          }
          enemys[i].cooldown-=1;
          if (enemys[i].cooldown < 0) {
            if (Math.floor(Math.random()*5) === 0) {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:1});
            }
            else {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:0});
            }
            enemys[i].cooldown = 200;
          }
        }
        if (enemys[i].sheild === 1) {
          fill(62,12,94);
        }
        else {
          fill(255,0,0);
        }
        rect(enemys[i].x-15,enemys[i].y-10,30,20);
      }
      else if (enemys[i].type === 4) {
        enemys[i].y+=1;
        fill(255,0,0);
        rect(enemys[i].x-20,enemys[i].y-20,40,40);
      }
    }
    for(i = 0; i < enemys.length; i++) {
      for (i2 = 0; i2 < lazers.length; i2++) {
        if (enemys[i].type < 3) {
          if (lazers[i2].x > enemys[i].x - 15 && lazers[i2].x < enemys[i].x + 15 && lazers[i2].y > enemys[i].y - 15 && lazers[i2].y < enemys[i].y + 15) {
            enemysDead.push({x:enemys[i].x,y:enemys[i].y,type:enemys[i].type,squish:0});
            enemys.splice(i,1);
            lazers.splice(i2,1);
            score++;
            break;
          }
        }
        else if (enemys[i].type === 3) {
          if (lazers[i2].x > enemys[i].x - 20 && lazers[i2].x < enemys[i].x + 20 && lazers[i2].y > enemys[i].y - 15 && lazers[i2].y < enemys[i].y + 15) {
            if (enemys[i].sheild === 1) {
              enemys[i].sheild = 0;
            }
            else {
              enemysDead.push({x:enemys[i].x,y:enemys[i].y,type:enemys[i].type,squish:0});
              enemys.splice(i,1);
              score++;
            }
            lazers.splice(i2,1);
            break;
          }
        }
        if (enemys[i].type === 4) {
          if (enemys[i].y === 100) {
            for (i3 = 0; i3 < 4; i3++) {
              if (Math.floor(Math.random()*4) === 0) {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:2});
              }
              else if (Math.floor(Math.random()*2) === 0) {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:1});
              }
              else {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:0});
              }
            }
            enemys.splice(i,1);
          }
          if (lazers[i2].x > enemys[i].x - 20 && lazers[i2].x < enemys[i].x + 20 && lazers[i2].y > enemys[i].y - 20 && lazers[i2].y < enemys[i].y + 20) {
            lazers.splice(i2,1);
          }
        }
      }

    }
    for (i = 0; i < enemys.length; i++) {
      if (enemys[i].y > 390) {
        enemys.splice(i,1);
        damage = 20;
        lives -= 1;
      }
    }
    for (i = 0; i < enemysDead.length; i++) {
      enemysDead[i].squish++;
      if (enemysDead[i].type === 0) {
        fill(255,0,0);
        rect(enemysDead[i].x-10-enemysDead[i].squish,enemysDead[i].y-10+enemysDead[i].squish,20+enemysDead[i].squish*2,20-enemysDead[i].squish);
      }
      else if (enemysDead[i].type === 1) {
        fill(210,0,0);
        rect(enemysDead[i].x-10-enemysDead[i].squish,enemysDead[i].y-10+enemysDead[i].squish,20+enemysDead[i].squish*2,20-enemysDead[i].squish);
      }
      else if (enemysDead[i].type === 2) {
        fill(180,0,0);
        rect(enemysDead[i].x-10-enemysDead[i].squish,enemysDead[i].y-10+enemysDead[i].squish,20+enemysDead[i].squish*2,20-enemysDead[i].squish);
      }
      else if (enemysDead[i].type === 3) {
        fill(255,0,0);
        rect(enemysDead[i].x-15-enemysDead[i].squish,enemysDead[i].y-10+enemysDead[i].squish,30+enemysDead[i].squish*2,20-enemysDead[i].squish);
      }
      if (enemysDead[i].squish > 20) {
        enemysDead.splice(i,1);
      }
    }
    //player
    fill(0,0,180);
    rect(playerX-10,380,20,20);
    //healthbar
    fill(100,100,100);
    rect(25,25,80,20);
    fill(0,0,200);
    if (lives > 0) {
    rect(25,25,26.5*lives,20);
    }
    //score
    textAlign(RIGHT);
    textSize(30);
    text(score,375,50)
  }
  //main menu
  else if (gamestarted === false) {
    textAlign(LEFT);
    //textSize(40);
    background(0);
    if (mouseX < 280 && mouseX > 130 && mouseY < 280 && mouseY > 130) {
      fill(200,0,0);
      if (mouseIsPressed) {
        prepare();
        gamestarted = true;
      }
    }
    else {
      fill(220,0,0);
    }
    rect(130,130,140,140);
    fill(0);
    if (controltype === 0) {
      image(mouseicon,25,5);
    }
    else if (controltype === 1) {
      image(keyboardicon,25,5);
    }
    if (mouseX >= 25 && mouseX <= 85 && mouseY >= 5 && mouseY <= 65) {
      if (mouseIsPressed && controltoggle === 0) {
        if (controltype === 0) {
          controltype = 1;
          controltoggle = 1;
        }
        else if (controltype === 1) {
          controltype = 0;
          controltoggle = 1;
        }
      }
      else if (mouseIsPressed === false && controltoggle === 1) {
        controltoggle = 0;
      }
    }
    textSize(40);
    text("Attack of the Cubes",25,100);
    text("Highscore: "+highscore,15,380);
    text("Start",150,210);
    text(version,320,380);
    
    if (gameplayed && gamestarted !== true) {
      text("Score: " + score,15,320);
      fill(240,0,0);
      text("Game Over!",108,50);
    }
  }
}
