/* Digital Scene (Nov 7 / 2024)
 * --------------
 * Featuring:
 * Gradiated Sky
 * Dotted Stars
 * Treed Parabolic Hills
 * Glowing Sun
 * Sine Birds
 * Puffy Clouds
 * --------------
 * Michael Spears
 * Website: https://bit-turtle.github.io
*/

// Draw the background
background();
// Cover the background in randomly sized dots
stars();
// Draw 2 hills with trees randomly placed on them
hills();
// Draw the sun
sun();
// Draw the birds
birds();
// Draw the clouds
clouds();
// Draw a very slight fog gradiet on top of everything
fog();

// Move the turtle to the center and hides the turtle
done();

function background() {
  // Draws a random blue vertical gradient that covers the entire screen as the background
  verticalgradient(
    randomNumber(120, 173),
    randomNumber(180, 216),
    randomNumber(190, 230),
    randomNumber(110, 163),
    randomNumber(170, 206),
    randomNumber(180, 220),
    1
  );
}

function fog() {
  // Draws a transparent random blue gradient over everything as fog
  verticalgradient(
    randomNumber(120, 173),
    randomNumber(180, 216),
    randomNumber(190, 230),
    randomNumber(110, 163),
    randomNumber(170, 206),
    randomNumber(180, 220),
    0.25
  );
}

// Draws a vertical gradient between two colors
function verticalgradient(r1, g1, b1, r2, g2, b2, a) {
  // Loop through every y position
  for (var y = 0; y < 450; y++) {
    penUp();
    moveTo(0, y);
    penDown();
    // Creates a gradient between two colors
    penRGB(
      r1+(r2-r1)/450*y,
      g1+(g2-g1)/450*y,
      b1+(b2-b1)/450*y,
      a
    );
    // Draw a line from left to right
    moveTo(320, y);
  }
}

// Covers the screen in random dots
function stars() {
  for (var s = 0; s < randomNumber(100,200); s++) star(randomNumber(0,320),randomNumber(0,450), randomNumber(1,5));
}

// Places a dot on the screen at a specific size
function star(x,y, size) {
  penUp();
  moveTo(x,y);
  penRGB(150,150,150,0.15);
  dot(size);
  penDown();
}

// Draws the sun on the screen
function sun() {
  // Generates a random position for the sun
  var x = randomNumber(150,250);
  var y = randomNumber(100, 200);
  // Draws sun rays at position
  sunrays(x, y);
  // Draws a dot at the center of the sun with a gradient between two shades of orange
  gradientdot(x, y, 50,
    // Color 1
    randomNumber(190,210),
    randomNumber(30,50),
    randomNumber(40,60),
    // Color 2
    randomNumber(245,255),
    randomNumber(105,125),
    randomNumber(10,30),
    1
  );
  // Draws glow radius around sun position
  gradientdot(x, y, 200,
    // Color 1
    randomNumber(190,210),
    randomNumber(30,50),
    randomNumber(40,60),
    // Color 2
    randomNumber(245,255),
    randomNumber(105,125),
    randomNumber(10,30),
    0.02
  );
}

// Draws sun rays around the sun
function sunrays(x, y) {
  penUp();
  // Draws sun rays in a circle around the position
  for (var i = 0; i < (360/20); i++) {
    moveTo(x, y);
    turnLeft(20);
    sunray(
      randomNumber(5, 10), 
      100,
      randomNumber(225, 255),
      randomNumber(95, 115),
      randomNumber(10, 20)
    );
  }
}

// Draws a sun ray
function sunray(width, length, r, g, b) {
  penUp();
  penWidth(2);
  turnLeft(90);
  moveForward(width/2);
  turnRight(90);
  // Loops to make the sides of the line fade out
  for (var i = 0; i < width; i++) {
    // Fades the line out as it gets to the end
    fadeline(r, g, b, 1-1/(width/2)*Math.abs(i-width/2), length);
    turnLeft(180);
    moveForward(length);
    turnLeft(90);
    moveForward(1);
    turnLeft(90);
  }
}

// Draws hills with random trees on the top
function hills() {
  // Generates a random position to be the space in between the two hills
  var middle = randomNumber(100,200);
  // Draws the left hill with a random gradient
  hill(
    0,
    middle,
    randomNumber(100, 200),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100)
  );
  // Draws the right hill with a random gradient
  hill(
    middle,
    320-middle,
    randomNumber(100, 200),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100),
    randomNumber(50,100)
  );
}

// The parabola function generates a parabola of a certain width and height (For the hills)
function parabola(x, w, h) {
  return (1-Math.pow((x-w/2)/(w/2),2))*h;
}

// Draws a hill with a gradient and a fade toward the top
function hill(x, width, height, r1, g1, b1, r2, g2, b2) {
  penUp();
  moveTo(x,450);
  penDown();
  penWidth(2);
  turnTo(0);
  // Loops through every x position
  for (var i = 0; i < width; i++) {
    penUp();
    moveTo(x+i, 450);
    penDown();
    fadeline(r1+(r2-r1)/width*i,g1+(g2-g1)/width*i,b1+(b2-b1)/width*i, 1, parabola(i,width,height));
    if (randomNumber(0, 50) == 0) // Randomly generates trees on the hill 1 in 50 chance
      tree(
        randomNumber(100, 150),
        randomNumber(100, 150),
        randomNumber(100, 150),
        x+i, 450-parabola(i,width,height)+50,
        randomNumber(50, 100)
      );
  }
}

// Draws a tree
function tree(r, g, b, x, y, size) {
  penUp();
  moveTo(x, y-size);
  turnTo(180);
  // Trunk
  fadeline(
    r, g, b, 1,
    size
  );
  // Leaves
  leaves(r, g, b, x, y, size);
  turnTo(0);
}

// Draws two stacked triangles with a fade toward the center
function leaves(r, g, b, x, y, size) {
  fadetriangle(
    r, g, b,
    x, y-size/3,
    size/3, size/3
  );
  fadetriangle(
    r, g, b,
    x, y-size/3*2,
    size/3/2, size/3  // Width of second triangle (top of tree) is half the width of the bottom set of leaves
  );
}

// Draws a triangle that has a fade that intensifies toward the center
function fadetriangle(r,g,b, x, y, width, height) {
  penUp();
  // Loops through y positions of the triangle
  for (var h = 0; h < height; h++) {
    moveTo(x, y-h);
    turnTo(0);
    // Right Side
    move(-width/2*(1-1/height*h), 0);
    turnTo(90);
    fadeline(r,g,b,0+1/height*h,
      width/2*(1-1/height*h)
    );
    // Left Side
    move(width/2*(1-1/height*h), 0);
    turnTo(-90);
    fadeline(r,g,b,0+1/height*h,
      width/2*(1-1/height*h)
    );
  }
  turnTo(0);
  penDown();
}

// Draws a line that fades out toward the end
function fadeline(r, g, b, a, length) {
  penDown();
  // Loops along the line changing the a value
  for (var i = 0; i < length; i++) {
    penRGB(r, g, b, a-a/length*i);
    moveForward(1);
  }
  penUp();
}

// Draws random transparent clouds
function clouds() {
  penUp();
  for (var i = randomNumber(5, 10); i > 0; i--) { // Generate a random number of clouds between
    penUp();
    moveTo(randomNumber(0, 320), randomNumber(0, 450)); // Move to a random position
    cloud(  // Draw the cloud
      randomNumber(50, 120),
      randomNumber(50, 150),
      randomNumber(140,160),
      randomNumber(140,160),
      randomNumber(140,160),
      randomNumber(140,160),
      randomNumber(140,160),
      randomNumber(140,160)
    );
  }
  penDown();
}

// Draws a cloud at a position
function cloud(length, height, r1, g1, b1, r2, g2, b2) {
  penUp();
  for (var i = 0; i < length; i++) {  // Loops through x positions
    // Does a gradient
    penRGB(
      r1+(r2-r1)/length*i,
      g1+(g2-g1)/length*i,
      b1+(b2-b1)/length*i,
    0.01);
    move(1,0);
    // Randomly makes the cloud thicker, intensifying the randomness closer to the center
    for (var s = -1; s <= 1; s+=2) for (var h = 0; h < randomNumber(1, height-height/(length/2)*Math.abs(i-length/2)); h++) {
      move(0,s*h);
      dot(10);
      move(0,-s*h);
    }
  }
  penDown();
}

// Draws birds
function birds() {
  for (var b = 0; b < randomNumber(5, 10); b++) { // Draws a random number of birds between 5 and 10
    bird(
      randomNumber(50, 75), 0.75, // Random shade of grey
      randomNumber(0,320),
      randomNumber(0,450),
      randomNumber(0, 50)/100+0.5,
      randomNumber(10, 60),
      randomNumber(10, 60)
    );
  }
}

// Draws a bird
function bird(c, a, x, y, stage, width, height) {
  // Setup
  penUp();
  // Right wing
  moveTo(x,y);
  turnTo(90);
  wing(c,c,c,a, stage, width, height, 1);
  // Left wing
  moveTo(x,y);
  turnTo(270);
  wing(c,c,c,a, stage, width, height, -1);
  // Cleanup
  moveTo(x,y);
  turnTo(0);
  penDown();
}

// Draws a bird wing
function wing(r,g,b,a, s, width, height, dir) {
  penDown();
  var y = 0;
  for (var x = 0; x < width; x++) { // Loops along the x axis
    penWidth(3-3/width*x);
    penRGB(r,g,b, a-a/width*x);
    move(
      dir,
      y-sinwing(x, s, width, height)  // Moves along a sine wave
    );
    y = sinwing(x, s, width, height);
  }
  penUp();
}

// The sine wave function for bird wings
function sinwing(x, s, w, h) {
  return Math.sin((Math.abs(x/w)*(Math.PI/2))/s)*s*h;
}

// Draws dots of repeatedly smaller sizes with a gradient
function gradientdot(x, y, size, r1, g1, b1, r2, g2, b2, a) {
  penUp();
  moveTo(x, y);
  for (var i = size; i > 0; i--) {  // Loops through dot sizes
    penRGB(
      r1+(r2-r1)/size*i,
      g1+(g2-g1)/size*i,
      b1+(b2-b1)/size*i,
      a-a/size*i
    );
    dot(1+i);
  }
  penDown();
}

// All done here, center and hide
function done() {
  penUp();
  moveTo(160,225);
  hide();
}
