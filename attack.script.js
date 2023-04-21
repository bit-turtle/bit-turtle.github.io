/*
Attack of the Cubes v1.9 (A Returning Difficulty)
850+ lines of code!
Last update on: April 21 2023

Changelog:
*Adds click sounds to scoreboard button, and difficulty selector
*Fixes difficulty scaling bug
*Highscores For Each Difficulty
*Indicator nesxt to most recent score that shows which difficulty it was done in
*New text on start button that shows current difficulty
*Lazers Updated:
**Lazers now have a smoother animation after hitting an enemy cube
**Lazers now bounce back after hitting a boss cube such as the Spawner and the Splitter
**Lazers that bounce back and hit the player now do damage
**Lazers bounce back off of non-boss cubes half the time in hard difficulty, a quarter of the time in medium difficulty, and none of the time in easy difficulty
*Added April Fools Easter Egg

Controls:
Mouse:
Move the mouse to move 
Click to shoot
Keyboard:
Use Right and Left Arrow Keys or A and D keys to move
Use Up Arrow or W Key to shoot
Use Down Arrow or S mo move faster

Sugestions
I am making sigestion and bug tracker

Website:
Check out my website: bit-turtle.github.io
https://bit-turtle.github.io/attack.html
You probably found this game there anyway

Font from "https://fontesk.com/square-typeface"
Sound From "https://pixabay.com"

Icons by Me :)

*/
var version = "v1.9"

var controltype = 0;
var difficulty_level = 0;
var start_difficulty = 0;
var scoreboard_open = false;
var mouseWasPressed = false;
var clicked = false;
var playerX = 200;
var playerMove = 0;
var playerShoot = false;
var autoShoot = false;
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
var lazersDisabled = [];
var powerups = {speed:false,sheild:false,big:false};
var poweruptimer = {speed:0,big:0};
var hitbox = 10;
var spliteroffset = [{x:-10,y:-10},{x:10,y:-10},{x:10,y:10},{x:-10,y:10}];
var cooldown = 0;
var difficulty = 0;
var spawn = 0;
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
var trophy;
var soundmuted = true;
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
  trophy = loadImage('https://bit-turtle.github.io/scoreboard.png');
  if (month() === 4 && day() === 1) {
    font = loadFont('https://bit-turtle.github.io/aurebesh.otf');
  }
  else {
    font = loadFont('https://bit-turtle.github.io/square.otf');
  }
  soundFormats('mp3');
  clicksound = loadSound('https://bit-turtle.github.io/click');
  damagesound = loadSound('https://bit-turtle.github.io/damage');
  sheildsound = loadSound('https://bit-turtle.github.io/sheild');
  shootsound = loadSound('https://bit-turtle.github.io/shoot');
  squishsound = loadSound('https://bit-turtle.github.io/squish');
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
  splitsHit = 0;
  powerups = {speed:false,sheild:false,big:false};
  poweruptimer = {speed:0,big:0};
  timer = 0;
  enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false});
  autoShoot = true;
  start_difficulty = difficulty_level;
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
  if (mouseWasPressed && mouseIsPressed) {
    click = false;
  }
  else if (!mouseWasPressed && mouseIsPressed) {
    click = true;
    mouseWasPressed = true;
  }
  else {
    click = false;
    mouseWasPressed = false;
  }
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
      if (score > highscore) {highscore[start_difficulty] = score; setCookie("attackhighscore", JSON.stringify(highscore), 30);}
      newScore(score,difficulty_level);
      gamestarted = false;
    }
    timer++;
    gameSpeed++;
    if (timer >= 200 - gameSpeed/(400 - difficulty_level * 100)) {
      //Cube Spawn Code
      if (gameSpeed/200 < 8) {
        spawn = 0;
      }
      else if (gameSpeed/(400-difficulty_level*100) <= 16) {
        spawn = Math.floor(Math.random()*2);
      }
      else if (gameSpeed/(400-difficulty_level*100) <= 32) {
        spawn = Math.floor(Math.random()*3);
      }
      else if (gameSpeed/(400 - difficulty_level * 100) <= 64) {
        spawn = Math.floor(Math.random()*4);       
      }
      else if (gameSpeed/(400 - difficulty_level * 100) <= 128) {
        spawn = Math.floor(Math.random()*5);
      }
      else {
        spawn = Math.floor(Math.random()*4+1);
      }
      if (spawn === 4 && Math.floor(Math.random()*(16-difficulty_level/3)) != 0) {
        spawn = 3;
      }
      if (spawn === 3 && Math.floor(Math.random()*(8-difficulty_level/3)) != 0) {
        spawn = 2;
      }
      if (spawn === 2 && Math.floor(Math.random()*(4-difficulty_level/3)) != 0) {
        spawn = 1;
      }
      if (spawn === 1 && Math.floor(Math.random()*(2-difficulty_level/3)) == 0) {
        spawn = 0;
      }
      if (gameSpeed/(400 - difficulty_level * 100) >= 512) {
        if (spawn === 4) {
          enemys.push({x:Math.floor(Math.random()*300 + 50),y:-20,type:4,split:false,invis:{strength:1,timer:10,invisible:true}});
        }
        else if (spawn === 3) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:3,sheild:1,cooldown:0,data:Math.floor(Math.random()*2),split:false,invis:{strength:1,timer:10,invisible:true}});
        }
        else if (spawn === 2) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:2,split:false,invis:{strength:1,timer:10,invisible:true}});
        }
        else if (spawn === 1) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:1,split:false,invis:{strength:1,timer:10,invisible:true}});
        }
        else {
            enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false,invis:{strength:1,timer:10,invisible:true}}); 
        }
      }
      else if (gameSpeed/(400 - difficulty_level * 100) >= 256) {
        if (spawn === 4) {
          enemys.push({x:Math.floor(Math.random()*300 + 50),y:-20,type:4,split:false,invis:{strength:2,timer:0,invisible:false}});
        }
        else if (spawn === 3) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:3,sheild:1,cooldown:0,data:Math.floor(Math.random()*2),split:false,invis:{strength:2,timer:0,invisible:false}});
        }
        else if (spawn === 2) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:2,split:false,invis:{strength:2,timer:0,invisible:false}});
        }
        else if (spawn === 1) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:1,split:false,invis:{strength:2,timer:0,invisible:false}});
        }
        else {
            enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false,invis:{strength:2,timer:0,invisible:false}}); 
        }
      }
      else {
        if (spawn === 4) {
          enemys.push({x:Math.floor(Math.random()*300 + 50),y:-20,type:4,split:false,invis:{strength:0,timer:0,invisible:false}});
        }
        else if (spawn === 3) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:3,sheild:1,cooldown:0,data:Math.floor(Math.random()*2),split:false,invis:{strength:0,timer:0,invisible:false}});
        }
        else if (spawn === 2) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:2,split:false,invis:{strength:0,timer:0,invisible:false}});
        }
        else if (spawn === 1) {  
          enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:1,split:false,invis:{strength:0,timer:0,invisible:false}});
        }
        else {
            enemys.push({x:Math.floor(Math.random()*380 + 10),y:-10,type:0,split:false,invis:{strength:0,timer:0,invisible:false}}); 
        }
      }  
      timer = 0;
    }
    if (cooldown < 0 && playerShoot || autoShoot) {
      poweruptimer.big--;
      poweruptimer.speed--;
      if (poweruptimer.big === 0) {powerups.big = false;}
      if (poweruptimer.speed === 0) {powerups.speed = false;}
      if (powerups.speed) {cooldown = 10;}
      else {cooldown = 25;}
      lazers.push({x:playerX,y:400});
      shootsound.pan(playerX/200-1);
      if(soundmuted===false){shootsound.play();}
      autoShoot = false;
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
        enemys[i].y+=Math.floor(2+gameSpeed/(400000-difficulty_level*100000));
        fill(255,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 1) {
        enemys[i].y+=Math.floor(4+gameSpeed/(400000-difficulty_level*100000));
        fill(210,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 2) {
        enemys[i].y+=Math.floor(2+gameSpeed/(400000-difficulty_level*100000));
        enemys[i].x+=Math.floor(Math.random()*11-6);
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
            if (difficulty_level === 2 && Math.random() < 0.5) {
              lazersDisabled.push({x: lazers[i2].x, y: lazers[i2].y, timer: 0, bounce: true});
            }
            else if (difficulty_level === 1 && Math.random() < 0.25) {
              lazersDisabled.push({x: lazers[i2].x, y: lazers[i2].y, timer: 0, bounce: true});
            }
            else {
              lazersDisabled.push({x: lazers[i2].x, y: lazers[i2].y, timer: 0, bounce: false});
            }
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
            lazersDisabled.push({x: lazers[i2].x, y: lazers[i2].y, timer: 0, bounce: true});
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
            lazersDisabled.push({x: lazers[i2].x, y: lazers[i2].y, timer: 0, bounce: true});
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
          damagesound.pan(enemys[i].x/200-1);
          if(soundmuted===false){damagesound.play();}
        }
        enemys.splice(i,1);
      }
    }
    //Lazers Disabled (ALready Hit Something)
    for (i = 0; i < lazersDisabled.length; i++) {
      if (lazersDisabled[i].bounce) {lazersDisabled[i].y+=2;}
      else {lazersDisabled[i].y-=2;}
      lazersDisabled[i].timer++;
      fill(0,0,200);
      rect(lazersDisabled[i].x-(2.5+hitbox),lazersDisabled[i].y-(5+hitbox),5+(hitbox*2),10+(hitbox*2));
      if (lazersDisabled[i].bounce && lazersDisabled[i].x > playerX - (10+hitbox*1.5) && lazersDisabled[i].x < playerX + (10+hitbox*1.5) && lazersDisabled[i].y >= 390 && lazersDisabled[i].y <= 400) {
        //Bounce Back Damage
        damage = 20;
        lives -= 1;
        damagesound.pan(lazersDisabled[i].x/200-1);
        if(soundmuted===false){damagesound.play();}
        lazersDisabled.splice(i,1);
      }
      else if (lazersDisabled[i].y >= 410 || lazersDisabled.y <= -10 && lazersDisabled[i].bounce) {
        lazersDisabled.splice(i,1);
      }
      
    }
    //Squish
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
    background(0);
    if (!scoreboard_open) {
      if (mouseX < 275 && mouseX > 135 && mouseY < 275 && mouseY > 135) {
        fill(200,0,0);
        if (click) {
          prepare();
          gamestarted = true;
        }
      }
      else {
        fill(220,0,0);
      }
      rect(130,130,140,140);
      //difficulty select
      textAlign(CENTER);
      textSize(35);
      if (difficulty_level === 0) {
        fill(220,0,0);
        rect(290,130,35,70);
        noFill();
        if (mouseX > 295 && mouseX < 330 && mouseY > 205 && mouseY < 240) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 1;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,200,35,35);
        if (mouseX > 295 && mouseX < 330 && mouseY > 240 && mouseY < 275) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 2;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,235,35,35);
        fill(0);
        text("E",308,175);
      }
      else if (difficulty_level === 1) {
        if (mouseX > 295 && mouseX < 330 && mouseY > 135 && mouseY < 175) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 0;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,130,35);
        fill(220,0,0);
        rect(290,165,35,70);
        if (mouseX > 295 && mouseX < 330 && mouseY > 240 && mouseY < 275) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 2;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,235,35,35);
        fill(0);
        text("M",308,210);
      }
      else if (difficulty_level === 2) {
        if (mouseX > 295 && mouseX < 330 && mouseY > 135 && mouseY < 170) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 0;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,130,35,35);
        if (mouseX > 295 && mouseX < 330 && mouseY > 170 && mouseY < 205) {
          fill(180,0,0);
          if (click) {
            difficulty_level = 1;
            if (!soundmuted) {
              clicksound.play();
            }
          }
        }
        else {
          noFill();
        }
        rect(290,165,35,35);
        fill(220,0,0);
        rect(290,200,35,70);
        fill(0);
        text("H",308,245);
      }
    }
    else {
      noFill();
      rect(130,130,195,140);
    }
    if (mouseX > 80 && mouseX < 115 && mouseY > 135 && mouseY < 275) {
      fill(180,0,0)
      if (click) {
        if (scoreboard_open) {
          scoreboard_open = false;
        }
        else {
          scoreboard_open = true;
          scoreboard_loaded = false;
          getScoreboard();
        }
        if (!soundmuted) {
          clicksound.play();
        }
      }
    }
    else {
      if (scoreboard_open) {
        fill(220,0,0);
      }
      else {
        noFill();
      }
    }
    rect(75,130,35,140);
    image(trophy,80,160,55,55);
    //Settings
    fill(0);
    if (controltype === 0) {
      image(mouseicon,25,5,60,60);
    }
    else if (controltype === 1) {
      image(keyboardicon,25,5,60,60);
    }
    if (mouseX >= 30 && mouseX <= 90 && mouseY >= 10 && mouseY <= 70 && click) {
      if (controltype === 0) {
        controltype = 1;
      }
      else if (controltype === 1) {
        controltype = 0;
      }
      if (soundmuted!==true){clicksound.play();}
    }
    if (soundmuted) {
      image(soundoff,328,5,60,60)
    }
    else {
      image(soundon,328,5,60,60)
    }
    if (mouseX >= 335 && mouseX <= 395 && mouseY >= 10 && mouseY <= 70 && click) {
      if (soundmuted) {
        soundmuted = false;
      }
      else {
        soundmuted = true;
      }
      if (soundmuted!==true){clicksound.play();}
    }
    textSize(40);
    textAlign(LEFT);
    strokeWeight(3);
    text("Attack of the Cubes",25,100);
    text("Highscore: "+highscore[difficulty_level],15,380);
    text(version,320,380);
    if (scoreboard_open) {
      textSize(30);
      text("Scoreboard:",140,160);
      textSize(20);
      if (scoreboards_loaded !== 3) {
        text("Loading...",140,180);
      }
      else {
        text("#1: "+scoreboard[difficulty_level][0].name+" ( "+scoreboard[difficulty_level][0].score+" )",140,180);
        text("#2: "+scoreboard[difficulty_level][1].name+" ( "+scoreboard[difficulty_level][1].score+" )",140,200);
        text("#3: "+scoreboard[difficulty_level][2].name+" ( "+scoreboard[difficulty_level][2].score+" )",140,220);
        text("#4: "+scoreboard[difficulty_level][3].name+" ( "+scoreboard[difficulty_level][3].score+" )",140,240);
        text("#5: "+scoreboard[difficulty_level][4].name+" ( "+scoreboard[difficulty_level][4].score+" )",140,260);
      }
    }
    else {
      text("Start",150,210);
      textSize(25);
      text("Attack",160,165);
      switch(difficulty_level) {
        case 0:
          text("[Easy]",165,245);
          break;
        case 1:
          text("[Medium]",155,245);
          break;
        case 2:
          text("[Hard]",165,245);
          break;
        default:
          text("[Error]",160,245);
      }
    }
    textSize(40);
    if (gameplayed && gamestarted !== true) {
      switch(start_difficulty) {
        case 0:
          text("Score: " + score + " [Easy]",15,320);
          break;
        case 1:
          text("Score: " + score + " [Medium]",15,320);
          break;
        case 2:
          text("Score: " + score + " [Hard]",15,320);
          break;
        default:
          text("Score: " + score,15,320);
      }
      fill(240,0,0);
      text("Game Over!",108,50);
    }
  }
}
