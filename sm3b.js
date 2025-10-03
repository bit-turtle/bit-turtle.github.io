// Visual SM3B Virtual Machine using P5.js
// Works and looks cool, but not written very neatly

var reg = [0,0,0,-1,0,0];
/** Reg Ma
0: X
1: Y
2: A
3: I,
4: M,
5: C,
**/
var memsize = 2**16;
var speed = 0;
var mem = new Array(memsize).fill(0);
// Default program
var prg = "1+$@0+#1@1?";

function val(v, x,y) {
  if (v != undefined) v = v.toString();
  else v = "?";
  rect(x-25,y-25,50,50);
  textAlign(CENTER);
  textSize(v.length <= 3 ? 25 : 20 );
  text(v, x,y+25/3-(v.length <= 3 ? 0 : (v.length-3)/2));
}

function swap(x1,y1,x2,y2,v1,v2,t,p,one = false) {
  if (one || x1 == x2 && y1 == y2) {
    val (v1, x1, y1);
    return;
  }
  val(v1, x1+(x2-x1)*(t/p), y1+(y2-y1)*(t/p));
  val(v2, x2+(x1-x2)*(t/p), y2+(y1-y2)*(t/p));
}

var s1 = 0, s2 = 0;
var flag = 0;
var err = false;
var inc = true;
function inst() {
  inc = true;
  var inst = prg[reg[3]];
  flag -= 1;
  switch (inst) {
    case "+":
    case "-":
      s1 = 5;
      s2 = 0;
      break;
    case "0":
    case "1":
      s1 = 0;
      s2 = 0;
      if (flag < 0)
        reg[0] = 0;
      flag = 1;
      reg[0] = reg[0] << 1;
      if (inst == "1")
        reg[0]+=1;
      break;
    case "#":
      s1 = 0;
      s2 = 4;
      break;
    case "@":
      s1 = 0;
      s2 = 2;
      break;
    case "$":
      s1 = 0;
      s2 = 1;
      break;
    case "?":
      if (reg[0] != 0) {
        s1 = 2;
        s2 = 3;
        inc  = false;
        break;
      }
      s1 = 0;
      s2 = 0;
      break;
    default:
      // End
      s1 = 0;
      s2 = 0;
      end = true;
  }
}

var tick = 0;
var end = false;
var layout = [
  [200,200],
  [50,200],
  [350,200],
  [350,50],
  [200,350],
  [200,50]
];
var speed = 1;
var paused = false;
var memscroll = 0;
var memscrollspeed = 5;
function render() {
  reg[4] = mem[reg[2]];
  if (tick == -1) tick = 0;
  else if (!paused) tick += deltaTime/1000;
  // Render
  for (let i = 0; i < reg.length; i++) if (err || i != s1 && i != s2 && !((paused || end) && i == 4) )
    val(reg[i], layout[i][0],layout[i][1]);
  // Mem
  if (paused || end) {
    if (keyIsDown(RIGHT_ARROW))
      memscroll -= deltaTime/1000*memscrollspeed;
    if (keyIsDown(LEFT_ARROW))
      memscroll += deltaTime/1000*memscrollspeed;
    if (memscroll < 0-reg[2])
      memscroll = 0-reg[2];
    if (memscroll > mem.length-reg[2]-1)
      memscroll = mem.length-reg[2]-1;
  }
  let memslot = (paused || end) ? Math.round(memscroll) + reg[2] : reg[2];
  for (let i = -4; i <= 5+Math.round((width-425)/50); i++) if ((paused || end || i != 0) && memslot+i >= 0 && memslot+i<mem.length)
    val(mem[memslot+i], i*50+200-(paused || end ? memscroll*50-Math.round(memscroll)*50 : 0), layout[4][1]);
  // Swap
  push();
  if (flag > 0) {
    stroke(255);
  }
  swap(layout[s1][0],layout[s1][1],layout[s2][0],layout[s2][1], reg[s1], reg[s2], tick, speed);
  pop();
  // Math
  if (tick >= speed/2 && s1 == 5) {
    if (prg[reg[3]] == "+") {
      reg[5] += reg[s2];
      reg[s2] = reg[5];
    }
    else if (prg[reg[3]] == "-") {
      reg[5] -= reg[s2];
      reg[s2] = reg[5];
    }
    s1 = s2;
    s2 = 5;
  }
  // Inst
  textSize(50);
  textAlign(CENTER);
  text(((reg[3]<prg.length && reg[3]>=0)? prg[reg[3]]: "…" ), 50, 65);
  // Mem
  if (tick >= speed && !end) {
    let tmp = reg[s1];
    reg[s1] = reg[s2];
    reg[s2] = tmp;
    if (s1 == 4 || s2 == 4) {
      if (reg[2] < mem.length && reg[2] >= 0)
        mem[reg[2]] = reg[4];
      else if (reg[2] == -1) {
        // User input
        reg[s1] = parseInt(prompt("User Input"));
        if (isNaN(reg[s1])) reg[s1] = 0;
        tick = -1;
        s1 = 0;
        s2 = 0;
      }
      else {
        end = true;
        err = true;
      }
    }
  }
  // Run
  if (tick >= speed && !paused && !end) {
    speed = speedSlider.value();
    tick = 0;
    if (inc) reg[3]++;
    inst();
  }
  // End
  if (end || paused) {
    textSize(24);
    textAlign(CENTER);
    text((paused ? "Pause" : (err) ? "Error" : "End"), 50, 87);
    text(Math.round(memscroll) >= 0? "+" + Math.round(memscroll): Math.round(memscroll), 350, 250);
    textSize(40);
    text("←→", 200, 325);
  }
  else
    memscroll = 0;
}

function reset() {
  reg = [0,0,0,-1,0,0];
  mem = Array(memsize).fill(0);
  s1 = 0;
  s2 = 0;
  tick = 0;
  flag = 0;
  end = false;
  err = false;
  inc = true;
}
function load() {
  var newprg = prompt("Enter Program");
  if (newprg == null) return;
  prg = "";
  // Trim irrelevant characters
  for (var i = 0; i < newprg.length; i++)
    if (newprg[i] == "0" ||
        newprg[i] == "1" ||
        newprg[i] == "+" ||
        newprg[i] == "-" ||
        newprg[i] == "@" ||
        newprg[i] == "#" ||
        newprg[i] == "$" ||
        newprg[i] == "?"
    ) prg = prg + newprg[i];
  reset();
}
function pause() {
  paused = !paused;
  memscroll = 0;
}
function offset() {
  if (pause) {
    let newoffset = parseInt(prompt("Memory Offset"));
    if (!isNaN(newoffset))
      memscroll = newoffset;
  }
}
var loadButton, resetButton, speedSlider, pauseButton, offsetButton;
function setup() {
  createCanvas(windowWidth >= 400 ? windowWidth : 400, 400);
  loadButton = createButton("Load");
  loadButton.position(27,90);
  loadButton.mousePressed(load);
  resetButton = createButton("Reset");
  resetButton.position(25,110);
  resetButton.mousePressed(reset);
  speedSlider = createSlider(0,2,1,0.01);
  speedSlider.position(25,80);
  speedSlider.style("transform:rotate(-90deg)");
  pauseButton = createButton("Pause");
  pauseButton.position(24,130);
  pauseButton.mousePressed(pause);
  offsetButton = createButton("Offset");
  offsetButton.position(323, 255);
  offsetButton.mousePressed(offset);
  offsetButton.style("display:none");
}
function windowResized() {
  resizeCanvas(windowWidth >= 400 ? windowWidth : 400, 400);
}

function draw() {
  background(220);
  if (paused || end)
    offsetButton.style("display:block");
  else
    offsetButton.style("display:none");
  render();
}
