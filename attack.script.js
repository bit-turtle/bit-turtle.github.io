/*
Attack of the Cubes v1.7 beta (The power of sound update)
440+ lines of code!

Changelog:
*Update:Powerups now exist and are dropped by different enemys
-Update:Added speed powerup that lets you shoot faster (dodger)
-Update:Added sheild powerup that gives you more health (spawner) 
-Update:Added big powerup which makes your bullets bigger (spliter)
*Update:Sound exists now
-Update:Added toggle sound option
-Update:Sound uses stereo to indicate where the sound came from
-

Controls:
Mouse:
Move the mouse to move 
Click to shoot
Keyboard:
Use Right and Left Arrow Keys or A and D keys to move
Use Up Arrow or W Key to shoot
Use Down Arrow or S mo move faster

Sugestions
mspears.27@acsamman.edu.jo
Give me sugestions :)

Website:
Check out my website: bit-turtle.github.io
https://bit-turtle.github.io/attack.html

Font from "https://fontesk.com/square-typeface"
Sound From "https://pixabay.com"

*/

var version = "v1.7";

var controltype = 0;
var controltoggle = 0;
var playerX = 200;
var playerMove = 0;
var playerShoot = false;
var rightArrowPressed = false;
var leftArrowPressed = false;
var upArrowPressed = false;
var downArrowPressed = false;
var keyAPressed = false;
var keyDPressed = false;
var keyWPressed = false;
var keySPressed = false;
var spacebarPressed = false;
var gamestarted = false;
var gameplayed = false;
var score = 0;
var enemys = [];
var enemysDead = [];
var lazers = [];
var powerups = {speed:false,sheild:false,big:false};
var poweruptimer = {speed:0,big:0};
var hitbox = 10;
var spliteroffset = [{x:-10,y:-10},{x:10,y:-10},{x:10,y:10},{x:-10,y:10}];
var cooldown = 0;
var difficulty = 0;
var damage = 0;
var sheild = 0;
var lives = 3;
var misses = 0;
var splitsHit = 0;
var gameSpeed = 0;
var timer = 0;
var i;
var i2;
var i3;
var i4;
var mouseicon;
var keyboardicon;
var soundon;
var soundoff;
var soundmuted = false;
var clicksound;
var damagesound;
var sheildsound;
var shootsound;
var squishsound;
var font;

function preload() {
  mouseicon = loadImage('https://bit-turtle.github.io/mouse.png');
  keyboardicon = loadImage('https://bit-turtle.github.io/keyboard.png');
  soundon = loadImage('https://bit-turtle.github.io/soundnotmuted.png')
  soundoff = loadImage('https://bit-turtle.github.io/soundmuted.png')
  font = loadFont('https://bit-turtle.github.io/square.otf');
  soundFormats('mp3');
  clicksound = loadSound('https://bit-turtle.github.io/click')
  damagesound = loadSound('https://bit-turtle.github.io/damage')
  sheildsound = loadSound('https://bit-turtle.github.io/sheild')
  shootsound = loadSound('https://bit-turtle.github.io/shoot')
  squishsound = loadSound('https://bit-turtle.github.io/squish')
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
  points = [];
  difficulty = 0;
  gameSpeed = 0;
  score = 0;
  misses = 0;
  damage = 0;
  lives = 3;
  gameSpeed = 0;
  splitsHit= 0;
  powerups = {speed:false,sheild:false,big:false};
  poweruptimer = {speed:0,big:0};
  timer = 0;
  enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false});
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
  else if (key === "ArrowDown") {
    downArrowPressed = true;
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
  else if (key === "s") {
    keySPressed = true;
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
  else if (key === "ArrowDown") {
    downArrowPressed = false;
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
  else if (key === "s") {
    keySPressed = false;
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
        if (downArrowPressed||keySPressed) {
          playerX+=6;
        }
        else {
          playerX+=3;
        }
      }
      if (leftArrowPressed||keyAPressed&&rightArrowPressed === false && keyDPressed === false) {
        if (downArrowPressed||keySPressed) {
          playerX-=6;
        }
        else {
          playerX-=3;
        }
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
    
    if (splitsHit === 4) {
      powerups.big = true;
      poweruptimer.big = 21;
      splitsHit = 0;
    }
    if (powerups.big) {hitbox = 10;}
    else {hitbox = 0;}
    if (sheild > 0) {
      background(0,0,0+sheild*8);
    }
    else {
      background(0+damage*8,0,0);
    }
    damage-=0.6;
    sheild-=0.6;
    cooldown-=1;
    if (lives <= 0 && damage < 0 && sheild < 0) {
      if (score > highscore) {highscore = score;}
      gamestarted = false;
    }
    timer++;
    if (timer >= 200 - gameSpeed*60) {
      if (difficulty >= 15 && Math.floor(Math.random()*50) === 0) {
        enemys.push({x:Math.floor(Math.random()*300 + 50),y:-20,type:4,split:false});
      }
      else if (difficulty >= 10 && Math.floor(Math.random()*40) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:3,sheild:1,cooldown:0,data:0,split:false});
      }
      else if (difficulty >= 5 && Math.floor(Math.random()*10) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:2,split:false});
      }
      else if (difficulty >= 1 && Math.floor(Math.random()*5) === 0) {  
        enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:1,split:false});
      }
      else {
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false}); 
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
      poweruptimer.big--;
      poweruptimer.speed--;
      if (poweruptimer.big === 0) {powerups.big = false;}
      if (poweruptimer.speed === 0) {powerups.speed = false;}
      if (powerups.speed) {cooldown = 10;}
      else {cooldown = 25;}
      lazers.push({x:playerX,y:400});
      shootsound.pan(playerX/200-1);
      if(soundmuted===false){shootsound.play();}
    }
    //lazersss
    for (i = 0; i < lazers.length; i++) {
      lazers[i].y-=4;
      fill(0,0,200);
      rect(lazers[i].x-(2.5+hitbox),lazers[i].y-(5+hitbox),5+(hitbox*2),10+(hitbox*2));
    }
    for (i = 0; i < lazers.length; i++) {
      if (lazers[i].y < -10) {
        misses++;
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
          enemys[i].y+=4;
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
            if (enemys[i].x >= 400) {
               enemys[i].data = 1;
            }
          }
          if(enemys[i].data === 1){
            enemys[i].x-=1;
            if (enemys[i].x <= 0) {
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
      var enemyDelete = false;
      squishsound.pan(enemys[i].x/200-1)
      for (i2 = 0; i2 < lazers.length; i2++) {
        if (enemys[i].type < 3) {
          if (lazers[i2].x > enemys[i].x - (15+hitbox) && lazers[i2].x < enemys[i].x + (15+hitbox) && lazers[i2].y > enemys[i].y - (15+hitbox) && lazers[i2].y < enemys[i].y + (15+hitbox)) {
            if (enemys[i].type === 2) {
              powerups.speed = true;
              poweruptimer.speed = 20;
            }
            if (enemys[i].split) {splitsHit++;}
            enemyDelete = true;
            lazers.splice(i2,1);
            score++;
            break;
          }
        }
        else if (enemys[i].type === 3) {
          if (lazers[i2].x > enemys[i].x - (20+hitbox) && lazers[i2].x < enemys[i].x + (20+hitbox) && lazers[i2].y > enemys[i].y - (15+hitbox) && lazers[i2].y < enemys[i].y + (15+hitbox)) {
            if (enemys[i].sheild === 1) {
              enemys[i].sheild = 0;
            }
            else {
              enemyDelete = true;
              powerups.sheild = true;
              score+=2;
            }
            lazers.splice(i2,1);
            break;
          }
        }
        if (enemys[i].type === 4) {
          if (lazers[i2].x > enemys[i].x - (25+hitbox) && lazers[i2].x < enemys[i].x + (25+hitbox) && lazers[i2].y > enemys[i].y - (25+hitbox) && lazers[i2].y < enemys[i].y + (25+hitbox)) {
            for (i3 = 0; i3 < 4; i3++) {
              if (Math.floor(Math.random()*10) === 0) {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:2,split:true});
              }
              else if (Math.floor(Math.random()*5) === 0) {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:1,split:true});
              }
              else {
                enemys.push({x:enemys[i].x+spliteroffset[i3].x,y:enemys[i].y+spliteroffset[i3].y,type:0,split:true});
              }
            }
            enemys.splice(i,1);
            lazers.splice(i2,1);
            if(soundmuted===false){squishsound.play();}
          }
        }
      }
      if (enemyDelete) {
        enemysDead.push({x:enemys[i].x,y:enemys[i].y,type:enemys[i].type,squish:0});
        enemys.splice(i,1);
        if(soundmuted===false){squishsound.play();}
      }
    }
    for (i = 0; i < enemys.length; i++) {
      if (enemys[i].y > 390) {
        if (enemys[i].split) {splitsHit = false;}
        if (powerups.sheild) {
          powerups.sheild = false;
          sheild = 20;
          sheildsound.pan(enemys[i].x/200-1);
          if(soundmuted===false){sheildsound.play();}
        }
        else {
          damage = 20;
          lives -= 1;
          damagesound.pan(enemys[i].x/200-1)
          if(soundmuted===false){damagesound.play();}
        }
        enemys.splice(i,1);
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
    if (powerups.speed) {
      fill(0,0,140);
    }
    else {
      fill(0,0,180);
    }
    rect(playerX-(10+hitbox*1.5),380-hitbox/2,(20+hitbox*3),20+hitbox);
    //healthbar
    fill(100,100,100);
    rect(25,25,80,20);
    fill(0,0,200);
    if (powerups.sheild) {
      rect(120,25,20,20);
    }
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
        if (soundmuted!==true){clicksound.play();}
      }
      else if (mouseIsPressed === false && controltoggle === 1) {
        controltoggle = 0;
      }
    }
    if (soundmuted) {
      image(soundoff,330,5)
    }
    else {
      image(soundon,330,5)
    }
    if (mouseX >= 330 && mouseX <= 390 && mouseY >= 5 && mouseY <= 65) {
      if (mouseIsPressed && controltoggle === 0) {
        if (soundmuted) {
          soundmuted = false;
          controltoggle = 1;
        }
        else {
          soundmuted = true;
          controltoggle = 1;
        }
        if (soundmuted!==true){clicksound.play();}
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
