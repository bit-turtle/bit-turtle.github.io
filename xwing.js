
var player = {
  settings: {
    spin: 0.05, 
    speed: 2,
    slow: 0.0015,
    accel: 0.0220,
    multi: 0.1,
    limits: {
      top: 200,
      bottom: -200,
      left: -200,
      right: 200,
      spin: {
        max: 45,
        min: -45
      }
    }
  },
  position: {
    x: 0,
    y: 0,
    r: 0
  },
  movement: {
    x: 0,
    y: 0,
    r: 0
  },
  direction: {
    x: 0,
    y: 0
  },
  render: function() {
    push();
    translate(this.position.x,this.position.y,0);
    rotate(this.position.r);
    box(40);
    pop();
  },
  limitX: function() {
    if (this.position.x > this.settings.limits.right) this.position.x = this.settings.limits.right;
    else if (this.position.x < this.settings.limits.left) this.position.x = this.settings.limits.left;
    else return false;
    return true;
  },
  limitY: function() {
    if (this.position.y > this.settings.limits.top) this.position.y = this.settings.limits.top;
    else if (this.position.y < this.settings.limits.bottom) this.position.y = this.settings.limits.bottom;
    else return false;
    return true;
  },
limitSpin: function() {
  if (this.position.r > this.settings.limits.spin.max) this.position.r = this.settings.limits.spin.max;
    else if (this.position.r < this.settings.limits.spin.min) this.position.r = this.settings.limits.spin.min;
    else return false;
    return true;
},
  update: function() {
    if (Math.abs(this.movement.x) < this.settings.speed) this.movement.x += this.direction.x * (deltaTime * this.settings.accel);
    if (Math.abs(this.movement.y) < this.settings.speed) this.movement.y += this.direction.y * (deltaTime * this.settings.accel);
    this.position.x += this.movement.x * (deltaTime * this.settings.multi);
    if (!this.limitX()) this.movement.r += this.movement.x * (deltaTime * this.settings.multi) * this.settings.spin; //Spin
    this.position.y += this.movement.y * (deltaTime * this.settings.multi);
    this.limitY();
    this.position.r += this.movement.r * (deltaTime * this.settings.multi);
    this.limitSpin();
    this.render();
    //Slowing
    if (this.movement.x > 0) this.movement.x -= this.settings.slow * deltaTime;
    if (this.movement.x < 0) this.movement.x += this.settings.slow * deltaTime;
    if (this.movement.y > 0) this.movement.y -= this.settings.slow * deltaTime;
    if (this.movement.y < 0) this.movement.y += this.settings.slow * deltaTime;
    if (this.movement.r > 0) this.movement.r -= this.settings.slow * deltaTime;
    if (this.movement.r < 0) this.movement.r += this.settings.slow/10 * deltaTime;
    this.movement.r = 0; //Fix Spinning
    if (Math.abs(this.movement.x) < 0.1) this.movement.x = 0; //Stop drift
    if (Math.abs(this.movement.y) < 0.1) this.movement.y = 0; //Stop drift
    //Spin Back
    if (this.movement.r == 0) {
      if (this.position.r > 0) this.position.r-=deltaTime * 0.01;
      if (this.position.r < 0) this.position.r+=deltaTime * 0.01;
  
    }
  }
}

//Controls
function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      player.direction.x -= 1;
      break;
    case RIGHT_ARROW:
      player.direction.x += 1;
      break;
    case UP_ARROW:
      player.direction.y -= 1;
      break;
    case DOWN_ARROW:
      player.direction.y += 1;
      break;
  }
}
function keyReleased() {
  switch (keyCode) {
    case LEFT_ARROW:
      player.direction.x += 1;
      break;
    case RIGHT_ARROW:
      player.direction.x -= 1;
      break;
    case UP_ARROW:
      player.direction.y += 1;
      break;
    case DOWN_ARROW:
      player.direction.y -= 1;
      break;
  }
}

class ClassList {
  constructor() {
    this.list = [];
    this.create = 0;
  }
  load() {
    if (this.create > 0) {
      this.create--;
      return true;
    }
    else return false;
  }
  add(thing) {
    this.list.push(thing);
    return this.list.length-1;
  }
  remove() {
    for (var i in this.list) {
      if (this.list[i].z > 20) { 
        this.list.splice(i,1);
        this.create++;
      }
    }
  }
  move(distance) {
    for (var i in this.list) {
      this.list[i].move(distance);
    }
  }
  render() {
    for (var i in this.list) {
      this.list[i].render();
    }
  }
  collision() {
    for (var i in this.list) {
      if (this.list[i].collision()) return true;
    }
    return false;
  }
}

class Wall {
  constructor(list,type,z = -500) {
    this.type = type;
    this.z = z;
    this.id = list.add(this);
    this.hit = false;
  }
  move(distance) {
    this.z += distance;
  }
  render() {
    if (this.z > 20) return -1;
    push();
    switch(this.type) {
      case 0:
        translate(0,100,this.z);
        box(400,150,80);
        break;
      case 1:
        translate(-100,0,this.z);
        box(150,300,80);
        break;
      case 2:
        translate(100,0,this.z);
        box(150,400,80);
        break;
      case 3:
        translate(0,-100,this.z);
        box(400,150,80);
        break;
      case 4:
        translate(0,0,this.z);
        box(400,50,80);
    }
    pop();
  }
  collisionBox(x,y,x1,y1,x2,y2) {
    if (x >= x1 && x <= x2) {
      if (y >= y1 && y <= y2) {
        if (this.z >= 0 && !this.hit) {
          this.hit = false;
          return true;
        }
      }
    }
    return false;
  }
  collision(x,y) {
    switch (this.type) { 
      case 0:
        return this.collisionBox(x,y,200,200,-200,100); 
      case 1:
        return this.collisionBox(x,y,-200,-200,-100,200);
      case 2:
        return this.collisionBox(x,y,200,200,100,-200);
      case 3:
        return this.collisionBox(x,y,-200,-200,200,-100); 
      case 4:
        return this.collisionBox(x,y,-200,-25,200,25); 
    }
  }
}

var world = {
  level: new ClassList(),
  start() {
    for (var i = 0;i < 5;i++) {
      new Wall(this.level,Math.round(Math.random()*5),i*1000-5000);
    }
  },
  load: function() {
      new Wall(this.level,Math.round(Math.random()*5),-5000);
  },
  location: 0,
  render: function() {
    this.level.render();
  },
  speed: 0.1,
  update: function() {
    this.speed += deltaTime * 0.000001;
    this.level.move(this.speed * deltaTime);
    this.level.remove();
    if (Math.round(Math.random()*10) == 0) if (this.level.load()) this.load();
    this.render();
    if (this.level.collision()) console.log("c");
  }
}


function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  world.start();
}

function draw() {
  background(220);
  world.update();
  player.update();
}