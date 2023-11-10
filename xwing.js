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

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  player.update();
}