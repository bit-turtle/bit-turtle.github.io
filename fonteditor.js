/*
  Roxus Font Editor
    .sf (Sheikah Font)
*/

// Font
 var w = 8,h = 8;
 var character = -1;
 var characters = [
 ];
 var charmap = [];

// // File format
function readbit(value, index) {
  value &= (1 << (7-index) );
  value >>= (7-index);
  return value;
}
function writebit(value, index, bit) {
  value &= ~(1 << (7-index) );
  value |= bit << (7-index);
  return value;
}
function read3(buffer, base, index) {
  base += Math.floor(index*3/8);
  let offset = index*3%8;
  var value = 0;
  for (var i = 0; i < 3 && base < buffer.length; i++) {
    value |= readbit(buffer[base], offset) << i;
    offset++;
    if (offset > 7) {
      base++;
      offset=0;
    }
  }
  return value;
}
function write3(buffer, base, index, value) {
  base += Math.floor(index*3/8);
  let offset = index*3%8;
  for (var i = 0; i < 3 && base < buffer.length; i++) {
    buffer[base] = writebit(buffer[base], offset, value >> i & 1);
    offset++;
    if (offset > 7) {
      base++;
      offset=0;
    }
  }
}
function ch(width,height) {
  return Array.from({ length: width }, () => Array(height).fill(0));
}
function readchar(buffer, base, width, height) {
  var character = ch(width, height);
  for (var y = 0; y < height; y++) for (var x = 0; x < width; x++)
    character[x][y] = read3(buffer, base, y*width+x);
  return character;
}
function readfont(buffer, characters, charmap) {
  const width = buffer[0], height = buffer[1];
  const length = Math.ceil((width*height*3)/8)+4;
  characters.length = 0;
  charmap.length = 0;
  for (var c = 2; c < buffer.length-length+1; c += length) {
    charmap.push(String.fromCodePoint( (buffer[c+0] << 24) | (buffer[c+1] << 16) | (buffer[c+2] << 8) | (buffer[c+3]) ));
    characters.push(readchar(buffer, c+4, width, height));
  }
  return {width: width, height: height};
}
function writechar(buffer, base, character, width, height) {
  for (var y = 0; y < height; y++) for (var x = 0; x < width; x++)
    write3(buffer, base, y*width+x, character[x][y]);
}
function writefont(characters, charmap, width, height) {
  const length = Math.ceil((width*height*3)/8)+4;
  var buffer = new Uint8Array(2+length*characters.length);
  buffer[0] = width; buffer[1] = height;
  for (var c = 2, i = 0; c < buffer.length-length+1; c += length, i++) {
    var codePoint = charmap[i].codePointAt(0);
    buffer[c+3] = codePoint&0xff;
    buffer[c+2] = (codePoint>>8)&0xff;
    buffer[c+1] = (codePoint>>16)&0xff;
    buffer[c+0] = (codePoint>>24)&0xff;
    writechar(buffer, c+4, characters[i], width, height);
  }
  return buffer;
}
// Font
 function loadfont(file) {
   if (file.file) {
     let reader = new FileReader();

     reader.onloadend = function(event) {
       if (event.target.readyState === FileReader.DONE) {
         let arrayBuffer = event.target.result;
         let buffer = new Uint8Array(arrayBuffer);

         var dimensions = readfont(buffer, characters, charmap);
         w = dimensions.width;
         h = dimensions.height;
         if (characters.length > 0)
           character = 0;
       }
     };

     reader.onerror = function(event) {
       alert("Error while reading file");
     };

     reader.readAsArrayBuffer(file.file);
   }
 }
 function savefont(filename) {
   var font = writefont(characters, charmap, w, h);
   const blob = new Blob([font], { type: 'application/octet-stream' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = filename;
   document.body.appendChild(a); // Append to body (can be hidden)
   a.click();
   document.body.removeChild(a); // Remove the link
   URL.revokeObjectURL(url);
 }

 var size = 20;

 function tri(x, y, t) {
   let u = x+size, v = y+size;
   triangle(
     // Corner
     t%2 == 0 ? u : x, Math.floor(t/2) == 0 ? v : y,
     // Top
     t%2 == Math.floor(t/2) ? u : x, y,
     // Bottom
     t%2 == Math.floor(t/2) ? x : u, v
   )
 }

 function rec(x, y) {
   rect(x, y, size, size);
 }

 function dia(x, y, t) {
   if (t == 0) quad(
     x+size/2,y,
     x,y+size/2,
     x+size/2,y+size,
     x+size,y+size/2
   )
   else {
     let mid = size/2;
     triangle(x, y, x+mid, y, x, y+mid);
     triangle(x+size, y, x+mid, y, x+size, y+mid);
     triangle(x, y+size, x+mid, y+size, x, y+mid);
     triangle(x+size, y+size, x+mid, y+size, x+size, y+mid);
     push();
     noFill();
     strokeWeight(1);
     pop();
   }
 }

 function dis(x, y, t) {
   if (t == 1)
     rec(x,y);
   else if (t > 5)
     dia(x, y, t-6);
   else if (t > 1)
     tri(x, y, t-2);
 }

 var fileinput, savebutton;
 function setup() {
   createCanvas(400, 400);
   fileinput = createFileInput(loadfont, false);
   savebutton = createButton("Save Font")
   savebutton.mousePressed(
     function() {
       var filename = prompt("Filename:");
       savefont(filename == "" ? "font.sf" : filename);
     }
   )
 }

 var counter = 0;
 var speed = 1;
 var anim = true;
 var selection = 1;


 var offset = 100;

 function keyPressed() {
   if (key == "p") {
     anim = !anim;
     return;
   }
   if (key == "[") {
     speed++;
     return;
   }
   if (key == "]") {
     speed = (speed != 0) ? speed - 1 : speed;
     return;
   }
   if (keyCode == LEFT_ARROW) {
     character = (character <= 0) ? Math.min(0,characters.length-1) : character-1;
     return;
   }
   if (keyCode == RIGHT_ARROW) {
     character = (character >= characters.length-1) ? character : character+1;
     return;
   }
   if (keyCode == ENTER) {
     characters.splice(character+1, 0, ch(w,h));
     charmap.splice(character+1, 0, undefined);
     character++;
     return;
   }
   if (keyCode == BACKSPACE) {
     if (character < 0)
       return
     characters.splice(character, 1);
     charmap.splice(character, 1);
     character = (characters.length == 0) ? -1 : (character <= 0) ? 0 : character-1;
     return;
   }
   if (key == "c") {
     if (character < 0)
       return;
     characters[character] = ch(w,h);
     return;
   }
   if (key == "r") {
     var neww = parseInt(prompt("Width:"));
     var newh = parseInt(prompt("Height:"));
     if (isNaN(neww) || isNaN(newh))
       return;
     w = neww;
     h = newh;
   }
   if (key == "m") {
     var c =  prompt("Map Character:");
     if (c != null && c.length != 0)
       charmap[character] = c[0];
   }
   if (key == "s") {
     savefont("font.sf");
     return;
   }
   var newselection = parseInt(key);
   if (isNaN(newselection))
     return;
   if (newselection > 7)
     selection = 0;
   else
     selection = newselection;
 }

 function draw() {
   size = 20;
   background(0);
   stroke(255);
   fill(255);
   strokeWeight(0);
   if (anim) {
     for (let i = 0; i < width/size-1; i++)
       dis(size*i+size/2,size/2,(Math.floor(counter)+i)%8);
     counter += deltaTime / 1000 * speed;
   }
   // Selection
   dis(size/2, height-size*2+size/2, selection);
   // Character
   textAlign(RIGHT);
   textSize(size);
   text(character +" " + charmap[character], width-size+size/2, height-size+size/2);
   // Position
   var u = width-offset*2;
   var v = height-offset*2;
   size = Math.min(v/h,u/w);

   var x = Math.floor((mouseX-offset)/size);
   var y = Math.floor((mouseY-offset)/size);

   textAlign(CENTER);
   textSize(20);
   text("["+x+","+y+"]", width/2, height-10);
   noFill();
   strokeWeight(5);
   stroke(127);
   rect(offset-5/2, offset-5/2, w*size+5, h*size+5);
   fill(127);
   noStroke();
   dis(offset+size*x, offset+size*y, selection != 0 ? selection : 1);
   if (x >= 0 && y >= 0 && x < w && y < h) {
     if (mouseIsPressed && character < characters.length && character >= 0) {
       if (characters[character][x] == undefined)
         characters[character][x] = Array(h).fill(0);
       characters[character][x][y] = selection;
     }
   }
   // Render
   fill(255);
   strokeWeight(0);
   if (character < characters.length && character >= 0) {

     for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (characters[character][x] != undefined)
       dis(offset+size*x, offset+size*y, characters[character][x][y]);
   }
  else {
    textAlign(CENTER);
    text("Press Enter\nTo create a character\n\nControls:\nNumbers: Select Tile\nArrows: Characters\nM: Set Mapping\nR: Resize Font", width/2, offset+20);
  }
}
