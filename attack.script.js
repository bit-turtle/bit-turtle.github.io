/*
Attack of the Cubes v1.5 (The Squish Update)
250 lines of code!

Controls:
Mouse to move
Click to shoot

Sugestions
mspears.27@acsamman.edu.jo
Give me sugestions :)

Website:
Check out my website: bit-turtle.github.io
https://bit-turtle.github.io/attack.html

*/

var gamestarted = false;
var gameplayed = false;
var score = 0;
var enemys = [];
var enemysDead = [];
var lazers = [];
var cooldown = 0;
var difficulty = 0;
var damage = 0;
var lives = 3;
var gameSpeed = 0;
var timer = 0;
var i;
var i2;

function setup() {
  createCanvas(400, 400);
  stroke(240);
  strokeWeight(3);
}

function prepare() {
  gameplayed = true;
  enemys = [];
  enemysDead = [];
  lazers = [];
  difficulty = 0;
  score = 0;
  damage = 0;
  lives = 3;
  speed = 0;
  timer = 0;
  enemys.push({x:Math.floor(Math.random()*400),y:-10,type:0});
}

function draw() {
  if (gamestarted) {
    background(0+damage*8,0,0);
    damage-=0.6;
    cooldown-=1;
    if (lives <= 0 && damage < 0) {
      if (score > highscore) {highscore = score;}
      gamestarted = false;
    }
    timer++;
    if (timer >= 200 - gameSpeed*60) {
      if (difficulty >= 10 && Math.floor(Math.random()*20) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:-10,type:3,sheild:1,data:0});
      }
      else if (difficulty >= 5 && Math.floor(Math.random()*10) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:-10,type:2});
      }
      else if (difficulty >= 1 && Math.floor(Math.random()*5) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:-10,type:1});
      }
      else {
        if (difficulty > 8) {
          enemys.push({x:Math.floor(Math.random()*400),y:-10,type:1});
        }
        else {
          enemys.push({x:Math.floor(Math.random()*400),y:-10,type:0});
        }
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
    if (mouseIsPressed && cooldown < 0) {
      lazers.push({x:mouseX,y:400});
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
        enemys[i].y+=1;
        fill(255,0,0);
        rect(enemys[i].x-10,enemys[i].y-10,20,20);
      }
      else if (enemys[i].type === 1) {
        enemys[i].y+=2;
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
          if (Math.floor(Math.random()*200) === 0) {
            if (Math.floor(Math.random()*5) === 0) {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:1});
            }
            else {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:0});
            }
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
    }
    for(i = 0; i < enemys.length; i++) {
      for (i2 = 0; i2 < lazers.length; i2++) {
        if (enemys[i].type < 3) {
          if (lazers[i2].x > enemys[i].x - 10 && lazers[i2].x < enemys[i].x + 10 && lazers[i2].y > enemys[i].y - 10 && lazers[i2].y < enemys[i].y + 10) {
            enemysDead.push({x:enemys[i].x,y:enemys[i].y,type:enemys[i].type,squish:0});
            enemys.splice(i,1);
            lazers.splice(i2,1);
            score++;
            break;
          }
        }
        else if (enemys[i].type === 3) {
          if (lazers[i2].x > enemys[i].x - 15 && lazers[i2].x < enemys[i].x + 15 && lazers[i2].y > enemys[i].y - 10 && lazers[i2].y < enemys[i].y + 10) {
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
    //healthbar
    fill(0,0,180);
    rect(mouseX-10,380,20,20);
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
    background(0);
    if (mouseX < 280 && mouseX > 120 && mouseY < 250 && mouseY > 150) {
      fill(200,0,0);
      if (mouseIsPressed) {
        prepare();
        gamestarted = true;
      }
    }
    else {
      fill(220,0,0);
    }
    rect(120,150,160,100);
    fill(0);
    textSize(40);
    text("Attack of the Cubes",25,100);
    text("Highscore: "+highscore,15,380);
    text("Start",155,210);
    if (gameplayed) {
      text("Score: " + score,15,320);
      fill(200,0,0);
      text("Game Over!",80,50);
    }
    
  }
}
