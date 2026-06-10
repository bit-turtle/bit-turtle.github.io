/****\
|Made|
|With|
| P5 |
| .  |
| js |
| v2 |
\****/

/*******\
|  Bit  |
|   -   |
| Turtl |
| Prsnt |
\*******/

/***********\
|     A     |
|  Squishy  |
| Cube Game |
\***********/

/*****************\
|      Using      |
|    p5.strands   |
\*****************/

/*****************************\
| Mouse and Keyboard Controls |
\*****************************/

// Levels
var currentLevel = 0;
var levels = [
  [  // Tutorial  
    "Cube Game!",  // Start message
    [  // Spike positions
      [500, 100]
    ],
    [  // Block positions
      [120, 100]
    ],
    600,  // Win distance
    "Squish!",  // Win message
    "Click to play!"  // Tip
  ],
  
  [  // Level 1
    "Level 1",  // Start message
    [  // Spike positions
      [100, 100],
      [200, 100],
      [400, 100],
      [400, 90],
      [400, 80],
      [400, 70],
      [800, 100],
      [840, 100],
      [880, 100]
    ],
    [
      [830, 50],
      [850, 50]
    ],
    1200,  // Win distance
    "You Win!"  // Win message
  ],
];

// Shaders

let bloomShader;
let originalImage;

// Filter shaders
function bloomCallback() {
  // Receive the original image for use
  // in our shader.
  const preBlur = uniformTexture(originalImage);

  filterColor.begin();
  const blurred = getTexture(filterColor.canvasContent,
                             filterColor.texCoord);
  const original = getTexture(preBlur, 
                              filterColor.texCoord);
  
  const intensity = max(original, 0.2) * 8;
    
  const bloom = original + blurred * intensity;
  filterColor.set([bloom.rgb, 1]);
  filterColor.end();
}

// Material shaders
let squishShader;
let squishParam;  // [centerX, centerY, squishX, squishY]
function squishCallback() {
  const squish = uniformVector4(squishParam);
  cameraInputs.begin();
  cameraInputs.position.x = (cameraInputs.position.x - squish.x) * squish.b + squish.x;
  cameraInputs.position.y = (cameraInputs.position.y - squish.y) * squish.a + squish.y;
  cameraInputs.end();
}

// Instancing shaders
function starModel() {
  box(5);
}

let font;
let creditText;
async function setup() {
  createCanvas(400, 400, WEBGL);
  pixelDensity(1);
  font = await loadFont('font.ttf');
  creditText = await loadStrings("credits.txt")
  originalImage= createFramebuffer();
  squishParam = createVector(0, 0, 1, 1);
  bloomShader = buildFilterShader(bloomCallback);
  squishShader = buildMaterialShader(squishCallback);
  loadLevel();
}

const gamespeed = 1000;

var credits = false;
var creditscroll = 0;
var flash = false;
var fade = true;
var flashoverlay = 255;

const squishfactor = 0.0195;

var playerx = 0;
var playery = 100;
var prevplayery = 0;
var playervy = 0;
var playerrot = 0;
var playersquish = 1;
const startingsquish = 1;

var hitbox = {
  x: -10,
  y: -10,
  w: 20,
  h: 20
};

var spikes = [
  [100, 100],
  [200, 100],
  [400, 100],
  [400, 90],
  [400, 80],
  [400, 70],
  [800, 100],
  [880, 100]
];
var blocks = [];
var windist = 1200;
var winmessage = "You Win!";
var startmessage = "Click to Play!";

function loadLevel() {
  let i = 0;
  startmessage = levels[currentLevel][i++];
  spikes = levels[currentLevel][i++];
  blocks = levels[currentLevel][i++];
  windist = levels[currentLevel][i++];
  winmessage = levels[currentLevel][i++];
  if (levels[currentLevel].length <= i)
    tip = "";
  else
    tip = levels[currentLevel][i];
}

var spikeboxes = [];
var blockboxes = [];

// debug
var hitboxes = false;
var directview = false;
var orbit = false;
var win = 0;

var titlescale = 0;
const titlesize = 2;

var spiketimer = 0; 
var spiked = false;
const spiketimescale = 0.002;

var dead = true;


var blocksquish = false;
var blocky = 0;

var tip = "";

function aabbHit(hitbox1, hitbox2) {
  return (
    hitbox1.x < hitbox2.x + hitbox2.w &&
    hitbox1.x + hitbox1.w > hitbox2.x &&
    hitbox1.y < hitbox2.y + hitbox2.h &&
    hitbox1.y + hitbox1.h > hitbox2.y
  );
}

var clickCooldown = false;
function draw() {
  
  
  let click = keyIsPressed || mouseIsPressed;
  if (!click)
    clickCooldown = false;
  if (clickCooldown || credits)
    click = false;
  // Controls
  if (playerx > windist)
    flash = true;
  
  if (spiked && spiketimer >= 1) {
      spiketimer = 0;
      dead = true;
      spiked = false;
    }
  if (!dead && !spiked && !(flash && flashoverlay > 255)) {
  if (click) {
    playervy = -0.25;
    if (blocksquish) {
      playery = blocky;
      blocksquish = false; 
    }
  }
      playerx += gamespeed*0.0001*deltaTime;
  
    prevplayery = playery;
  playery += playervy*deltaTime;
  if (!blocksquish) playervy += 0.001*deltaTime;
    
  playerrot += 0.008*deltaTime;
  
  // Collision
  if (playery >= 100 || blocksquish) {
    playersquish += squishfactor * deltaTime*0.06;
    playery = (blocksquish) ? blocky : 100;
    playervy = 0;
    playerrot = 0;
  }
  else {
    playersquish -= squishfactor * deltaTime*0.06;
  }
  if (playersquish < 0) {
    playersquish = 0;
    dead = true;
  }
  if (playersquish > 2) {
    playersquish = 0;
    dead = true;
  }
  }
  else if (!spiked) {
    playersquish = 1+sin(millis()*0.01)/2;
    playerx = 0;
    playery = 100;
    playervx = 0;
    playervy = 0;
    playerrot = 0;
    
    if (click && !fade && !flash) {
      dead = false;
      clickCooldown = true;
    }
  }
  
  // Calculate hitboxes
  hitbox.x = -(20*playersquish)/2;
  hitbox.y = playery+10-20*(1-playersquish/2)
  hitbox.w = 20*playersquish
  hitbox.h = 20*(1-playersquish/2);
  spikeboxes = [];
  for (let i = 0; i < spikes.length; i++) {
    let spikebox = {
      x: spikes[i][0]-playerx-8,
      y: spikes[i][1]-8,
      w: 16,
      h: 18
    };
    spikeboxes.push(spikebox);
  }
  blockboxes = [];
  for (let i = 0; i < blocks.length; i++) {
    let block = {
      x: blocks[i][0]-10-playerx,
      y: blocks[i][1]-10,
      w: 20,
      h: 20
    };
    blockboxes.push(block);
  }  
    
  // Lights
  ambientLight(150, 150, 150);
  directionalLight(255, 255, 255, 0, 0, -1);
  pointLight(40, 120, 255, 0, playery, 0);
  
  
  // Stars
  
  // Collision
  if (!dead && !spiked) {
    for (let i = 0; i < spikeboxes.length; i++) {
    if (aabbHit(hitbox, spikeboxes[i])) {
      spiked = true;
      spiketimer = 0;
      break;
    }
    }
    
    let blockofsquish = blocksquish;
    blocksquish = false;
    for (let i = 0; i < blockboxes.length; i++) {
      blockboxes[i].y -= 0.1;
      if (aabbHit(hitbox, blockboxes[i])) {
        blockboxes[i].y += 0.1;
        if (prevplayery <= blockboxes[i].y-10) {
          blocky = blockboxes[i].y-10;
          playery = blocky;
          playervy = 0;
          // Compensate for the 1 frame delay of this system
          if (!blockofsquish) playersquish += squishfactor * deltaTime*0.06;
          playerrot = 0;
          blocksquish = true;
        }
        else if (blockofsquish) {
          blocksquish = true;
        }
        else { // Crash
          spiked = true;
        }
        break;
      }
    }
  }
  
  // Draw the previous code to a framebuffer
  // so that we can store it before the blur
  originalImage.begin();
  
  if (!flash) background(0);
  if (orbit) orbitControl();
  clearDepth();
  
  

  
    if (!directview) rotateY(PI/8);
  
  push();
    translate(0,playery,1);
  rotateX(sin(playerrot)/4);
  rotateZ(playerrot);
  squishParam.x = 0;
  squishParam.y = playery+10;
  squishParam.z = playersquish;
  squishParam.w = 1-playersquish/2;
  if (spiked) {
    spiketimer += deltaTime*spiketimescale;
    squishParam.z = playersquish-playersquish*spiketimer;
    squishParam.w = 1-playersquish/2-(1-playersquish/2)*spiketimer;
  }
  shader(squishShader);
  fill(40, 120, 255);
  noStroke();
  
  // Player
  box(20);
  
  pop();
  squishParam.y = 0;
  squishParam.z = 0;
  squishParam.w = 0;
  
  // Level
  
  // Spike
  push();
  translate(-playerx, 0, 0);
  for (let i = 0; i < spikes.length; i++) {
    push();
  translate(spikes[i][0],spikes[i][1],0);
  rotateX(PI);
  rotateY(PI/2);
  fill(200, 100, 25);
  noStroke();
  cone(20,20,4);
    pop();
  }
  // Block
  for (let i = 0; i < blocks.length; i++) {
    push();
    noStroke();
    translate(blocks[i][0], blocks[i][1], 0);
    fill(75,100,75);
    box(20);
    pop();
  }
  pop();
  
    push();
    fill(40, 120, 255);
    textFont(font);
    textAlign(CENTER);
    rotateY(sin(millis()*0.002)*0.1);
  rotateZ(cos(millis()*0.001)*0.2);
    titlescale += ((dead ? titlesize : 0)-titlescale)*(dead ? 0.005 : 0.01)*deltaTime;
    scale(titlescale);
    text(startmessage, 0, 0);
    pop();
  
  // Floor
  fill(20);
  translate(0, 125, 0);
  box(1000, 30, 100);
  
  resetMatrix();
  clearDepth();
  
  if (credits) {
    fill(0,0,0,creditText.length*20-creditscroll/2+height*2);
    currentLevel = 0;
    win = 0;
    loadLevel();
    rect(-5-width/2,-5-height/2,width+10,height+10);
    for (let i = 0; i < creditText.length; i++) {
        fill(40, 120, 255);
      if (creditText[i] == "")
        continue;
      else if (creditText[i] == "[cube]") {
        push();
        squishParam.x = 0;
  squishParam.y = 10+i*20-creditscroll/2+height;
  squishParam.z = playersquish;
  squishParam.w = 1-playersquish/2;
        shader(squishShader);
        translate(0, i*20-creditscroll/2+height, 0);
        rotateY(PI/8);
        fill(40, 120, 255);
        noStroke();

        // Player
        clearDepth();
        box(20);
        pop();
        
        squishParam.x = 0;
        squishParam.y = 0;
        squishParam.z = 0;
        squishParam.w = 0;
      }
      else if (creditText[i] == "[spike]") {
        push();
        squishParam.x = 0;
  squishParam.y = 10+i*20-creditscroll/2+height;
  squishParam.z = playersquish;
  squishParam.w = 1-playersquish/2;
        shader(squishShader);
  translate(0,i*20-creditscroll/2+height,0);
        rotateY(PI/8);
  rotateX(PI);
        
  rotateY(PI/2);
  fill(200, 100, 25);
  noStroke();
  cone(20,20,4);
        
    pop();
        
        squishParam.x = 0;
        squishParam.y = 0;
        squishParam.z = 0;
        squishParam.w = 0;
      }
      else {
    textFont(font);
    textAlign(CENTER);
      text(creditText[i], 0, i*20-creditscroll/2+height);
      }
    }
    if (creditText.length*20-creditscroll/2+height*2 <= 0) {
      credits = false;
      creditscroll = 0;
      fade = false;
      flashoverlay = 0;
      flash = false;
    }
  }
  
  originalImage.end();

  imageMode(CENTER);
  image(originalImage, 0, 0);

  // changing this value affects the spread of the bloom
  filter(BLUR, 15);
  filter(bloomShader);
  
  if (flash || fade || credits) {
    if (credits) {
      creditscroll += deltaTime*0.15;
      translate(0,-creditscroll*2,0);
    }
    if (flash) {
      flashoverlay += deltaTime*0.15;
    }
    if (fade) {
      currentLevel = win;
      loadLevel();
      if (flashoverlay > 255)
        flashoverlay = 255;
      flashoverlay -= deltaTime*0.15;
      if (flashoverlay <= 0) {
        flashoverlay = 0;
        fade = false;
      }
    }
    fill(255,255,255,flashoverlay);
    rect(-5-width/2,-5-height/2,width+10,height+10);
    if (flashoverlay > 320) {
      
      fill(0);
    textFont(font);
    textAlign(CENTER);
      scale(2);
      text(winmessage, 0, 0);
      if (flashoverlay > 500 || click) {
        flash = false;
        fade = true;
        dead = true;
        if (currentLevel < levels.length-1)
        win = currentLevel+1;
      else {
        // Game complete
        credits = true;
        fade = false;
        flash = false;
        flashoverlay = 255;
      }
      }
    }
  }
  
  push();
  
  // Debug
  if (hitboxes){
    fill(200);
  rect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    for (let i = 0; i < spikeboxes.length; i++) {
      fill(200,100,100);
      rect(spikeboxes[i].x, spikeboxes[i].y, spikeboxes[i].w, spikeboxes[i].h);
    }
    for (let i = 0; i < blockboxes.length; i++) {
      fill(100,200,100);
      rect(blockboxes[i].x, blockboxes[i].y, blockboxes[i].w, blockboxes[i].h);
    }
  }
  pop();
  
}