var gamestarted = false;
var highscore = 0;
var score = 0;
var enemys = [];
var lazers = [];
var cooldown = 0;
var difficulty = 0;
var damage = 0;
var lives = 3;
var timer = 0;
var i;
var i2;

function setup() {
  createCanvas(400, 400);
  stroke(240);
  strokeWeight(3);
}

function prepare() {
  enemys = [];
  lazers = [];
  difficulty = 0;
  score = 0;
  damage = 0;
  lives = 3;
  timer = 0;
  enemys.push({x:Math.floor(Math.random()*400),y:0,type:0});
}

function draw() {
  if (gamestarted) {
    background(0+damage*8,0,0);
    damage-=0.6;
    cooldown-=1;
    if (lives <= 0 && damage < 0) {
      gamestarted = false;
    }
    timer++;
    if (timer >= 200) {
      if (difficulty >= 10 && Math.floor(Math.random()*20) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:0,type:3,data:0});
      }
      else if (difficulty >= 5 && Math.floor(Math.random()*10) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:0,type:2});
      }
      else if (difficulty >= 1 && Math.floor(Math.random()*5) === 0) {  enemys.push({x:Math.floor(Math.random()*400),y:0,type:1});
      }
      else {  enemys.push({x:Math.floor(Math.random()*400),y:0,type:0});
      }
      difficulty+=0.25;
      timer = 0;
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
          if (Math.floor(Math.random()*100) === 0) {
            if (Math.floor(Math.random()*5) === 0) {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:1});
            }
            else {  enemys.push({x:enemys[i].x,y:enemys[i].y,type:0});
            }
          }
        }
        fill(255,0,0);
        rect(enemys[i].x-15,enemys[i].y-10,30,20);
      }
    }
    for(i = 0; i < enemys.length; i++) {
      for (i2 = 0; i2 < lazers.length; i2++) {
        if (enemys[i].type < 3) {
          if (lazers[i2].x > enemys[i].x - 10 && lazers[i2].x < enemys[i].x + 10 && lazers[i2].y > enemys[i].y - 10 && lazers[i2].y < enemys[i].y + 10) {
            enemys.splice(i,1);
            lazers.splice(i,1);
            score++;
            break;
          }
        }
        else if (enemys[i].type === 3) {
          if (lazers[i2].x > enemys[i].x - 15 && lazers[i2].x < enemys[i].x + 15 && lazers[i2].y > enemys[i].y - 10 && lazers[i2].y < enemys[i].y + 10) {
            enemys.splice(i,1);
            lazers.splice(i,1);
            score++;
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
    if (mouseIsPressed && cooldown < 0) {
      lazers.push({x:mouseX,y:400});
      cooldown = 25;
    }
    for (i = 0; i < lazers.length; i++) {
      lazers[i].y-=2;
      fill(0,0,200);
      rect(lazers[i].x-3,lazers[i].y-5,5,10);
    }
    for (i = 0; i < lazers.length; i++) {
      if (lazers[i].y < -10) {
        lazers.splice(i,1);
      }
    }
    fill(0,0,180);
    rect(mouseX-10,380,20,20);
  }
  else {
    background(0);
    if (mouseX < 280 && mouseX > 120 && mouseY < 250 && mouseY > 150) {
      fill(220,0,0);
      if (mouseIsPressed) {
        prepare();
        gamestarted = true;
      }
    }
    else {
      fill(240,0,0);
    }
    rect(120,150,160,100);
    fill(255);
    textSize(40);
    text("Attack of the Cubes",25,100);
    text("Highscore: "+highscore,15,380);
    fill(0);
    text("Start",155,210);
  }
}