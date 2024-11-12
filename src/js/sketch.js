var soundFile;
var fileName;
var hasFile = false;
var fft;
var spectrum;
var particles = [];
var wave;
var toggle = 0;
var canvas;
var currVisualizer = 1;
var particleR, particleG, particleB;
var visualizerR, visualizerG, visualizerB;
var sliderVisible = true;
var instructionVisible = true;
var song;

var playButton;

function preload() {
  if(!hasFile) {
  song = loadSound("audio/Couple N - Starry Night.mp3");
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  fft = new p5.FFT();
  
  // Assign song to soundFile if no file is loaded
  if (!hasFile) {
    soundFile = song;
    fileName = "Currently playing: Couple - Starry Night.mp3";
  }

  //On loading the program, when fileName is not detected set it to blank, otherwise display fileName.
  if(fileName == undefined) {
      fileName = ' ';
    } else {
      fileName = fileName;
    }
  
  playButton = createImg("images/playback.png");
  playButton.position(0, 100);
  playButton.size(100, 100);
  playButton.mousePressed(loaded); 

  //Sliders to change the R,G, and B values for the visualizers and particles
  visualizerR = createSlider(0, 255, 255);
  visualizerR.position(windowWidth-150, 0);
  
  visualizerG = createSlider(0, 255, 255);
  visualizerG.position(windowWidth-150, 25);
  
  visualizerB = createSlider(0, 255, 255);
  visualizerB.position(windowWidth-150, 50);
  
  particleR = createSlider(0, 255, 255);
  particleR.position(windowWidth-150, 90); 
  
  particleG = createSlider(0, 255, 255);
  particleG.position(windowWidth-150, 112); 

  particleB = createSlider(0, 255, 255);
  particleB.position(windowWidth-150, 135);

  //Create a div element to display the instructions
  instructions = createDiv("'1', '2', '3' - Toggle Visualizers <br>'SPACE' - Toggle playback<br>'H' - Hide colour sliders");
  instructions.position(0, 0);
  instructions.style("text-align", "left");
  instructions.style("color", "white");
  instructions.style("font-size", "20px");
  instructions.style("width", "250px");
  instructions.style("height", "70px"); 
  instructions.style("transition-property", "opacity");
  instructions.style("transition-duration", "1s");
  
  //Create a div for text of sliders and gives the option for users to hide it
  visualizers = createDiv(" Visualizer 'Red' <br> Visualizer 'Green' <br> Visualizer 'Blue'<br><br> Particle 'Red' <br> Particle 'Green' <br> Particle 'Blue'")
  
  visualizers.position(windowWidth-300, 0);
  visualizers.style("text-align", "left");
  visualizers.style("color", "white");
  visualizers.style("font-size", "20px");
  visualizers.style("width", "150px");
  visualizers.style("height", "70px"); 
  visualizers.style("transition-property", "opacity");
  visualizers.style("transition-duration", "1s");
  
  //Display the title and information, when loading audio set the opacity to 0;
  title = createDiv("MUSIC VISUALIZER");
  title.style("color", "white");
  title.style("font-size", "40px");
  title.style("text-align","left");
  title.style("font-weight", "bold");
  title.center();
  title.style("transition-property", "opacity");
  title.style("transition-duration", "2s");
  
  info = createDiv("<br><br><br><br>Drag & Drop audio file into browser window <br> (Press 'S' to hide keyboard controls)");
  info.style("color", "white");
  info.style("font-size", "30px");
  info.style("text-align","center");
  info.center();
  info.style("transition-property", "opacity");
  info.style("transition-duration", "2s");

  //Canvas detects when a file has been dropped
  canvas.drop(gotFile);
  
  /*Title and info divs cover canvas, if user drags onto div elements then load audio.
  This prevents audio from loading in a new tab which is not intended.*/
  title.drop(gotFile);
  info.drop(gotFile); 
 
}

function loaded() {
  if (!soundFile.isPlaying()) {
    soundFile.play();
  }
  else {
    soundFile.pause();
  }
}

function gotFile(file)  {
    // Load the sound file
  	// If sound file already exists, dispose and load new sound file
    if (soundFile) {
      soundFile.stop();
      soundFile.dispose();
    }
    soundFile = loadSound(file.data, loaded);
    // Display the audio file name
	  fileName = "Currently playing: " + file.name;
  	hasFile = true;
 
  	//Set the title and info div opacity to 0 when an audio file is detected
  	title.style("opacity", 0);
    info.style("opacity", 0);
}

function draw() {    
  	background(0);
    textFont("Times New Roman");

    spectrum = fft.analyze();
    amp = fft.getEnergy(20, 200);
    wave = fft.waveform();
    
    push();
  	//Disable the shadow effect on the track title
  drawingContext.shadowOffsetX = 0;
	drawingContext.shadowOffsetY = 0;
	drawingContext.shadowBlur = 0;
	drawingContext.shadowColor = "rgba(0,0,0)";
    
    textSize(24);
    fill(255);
    text(fileName, 0, height-5);
    textAlign(LEFT);
    pop();

  	//Switch between the visualizers or press spacebar to pause the audio
    switch(toggle) {
      case 49:
	    baseVisualizer();
        currVisualizer = 1;
        break;
      
      case 50: 
        secondaryVisualizer();
        currVisualizer = 2;
        break;
        
      case 51:
        polarVisualizer();
        currVisualizer = 3;
        break;
      
      case 32://Press space bar to toggle playblack
        toggle = 0;
        if(hasFile) {
          //If a new soundFilehas been loaded, control soundFile
          if(soundFile.isPlaying()) {
            soundFile.pause();
          } else {
            soundFile.play();
          }
        } else {
          // Otherwise, control the default song
          if (song.isPlaying()) {
            song.pause();
          } else {
            song.play();
          }
        }
		break;
        
      case 72:
        if(sliderVisible == true) {
          visualizers.style("opacity", 0);
          visualizerR.hide();
          visualizerG.hide();
          visualizerB.hide();
          particleR.hide();
          particleG.hide();
          particleB.hide();
          sliderVisible = false;
        } else {
          visualizers.style("opacity", 1);
          visualizerR.show();
          visualizerG.show();
          visualizerB.show();
          particleR.show();
          particleG.show();
          particleB.show();
          sliderVisible = true;
        }
        toggle = 0;
        break;
        
      case 83:
        toggle = 0;
        if(instructionVisible == true) {
          instructions.style("opacity", 0);
          instructionVisible = false;
        } else {
          instructions.style("opacity", 1);
          instructionVisible = true;
        }
        break;
        
      default:
        if (currVisualizer == 1) {
          baseVisualizer();
        }
        else if (currVisualizer == 2) {
          secondaryVisualizer();
        }
        else if (currVisualizer == 3) {
          polarVisualizer();
        } 
    }

  	//Display the particle effects and detects the beat of the audio
	push();
  	translate(width/2,height/2);
  	shadow();
    var p = new Particle();
    particles.push(p);
    
    for(var i = 0; i < particles.length; i++) {
      if(!particles[i].edges()) {
      particles[i].update(amp > 230);
      particles[i].show();
      } else {
        particles.splice(i, 1)
      }
    }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  title.center();
  info.center();
  
  visualizers.position(windowWidth-300, 0);
  visualizerR.position(windowWidth-150, 0);
  visualizerG.position(windowWidth-150, 25);
  visualizerB.position(windowWidth-150, 50);
  
  particleR.position(windowWidth-150, 90); 
  particleG.position(windowWidth-150, 112);
  particleB.position(windowWidth-150, 135);


}
//Base circular waveform
function baseVisualizer() {
  push();
  shadow();
  stroke(visualizerR.value(), visualizerG.value(), visualizerB.value());
    noFill();

  		translate(width/2, height/2);
        for(let t = -1; t <= 1; t += 2) {
        beginShape()
          for (let i = 0; i < 360; i += 0.5) {
            let index = floor(map(i, 0, 180, 0, wave.length -1))
            let r  = 1.5*(map(wave[index], -1, 1, 150, 350));
            let x = r * sin(i) * t
            let y = r * cos(i)
            strokeWeight(5);
            vertex(x, y)
        }
        endShape()
		}
  pop();
}
  
//Secondary waveform
function secondaryVisualizer() {
  push();
  stroke(255);
  noFill();

  	translate(width/2, height/2);
  shadow();
    //Secondary waveform
    for(let t = -1; t <= 1; t += 2) {
       for(let i = 0; i <= 180; i += 4) {
         let index = floor(map(i, 0, 180, 0, wave.length-1))
         let r = 2*(map(wave[index], -1, 1, 50, 300))
         let x = r * sin(i) * t
         let y = r * cos(i)
         line(0,0,x,y);
         strokeWeight(8);
         colorMode(HSB);

         stroke(i*2,255,255);
        }
    }
    noStroke();
    colorMode(RGB);
    fill(0);
    circle(0,0,255);
  pop();
}

//Waveform using polar coordinates to simulate a polar rose
function polarVisualizer() {
  push();
  shadow();
  stroke(visualizerR.value(), visualizerG.value(), visualizerB.value());
    noFill();

  	translate(width/2, height/2);
    beginShape()
  	for(let i = 0; i < 360; i += 0.5) {
      let index = floor(map(i, 0, 360, 0, wave.length))
      let r = 1.5*(map(wave[index], -1, 1, 100, 500));
      let x = (r * cos(8*i)) * cos(i);
      let y = (r * cos(8*i)) * sin(i);
      strokeWeight(5);
      vertex(x, y);
  	}
  	endShape()
   pop();
}

//Set the key as a toggle and detect the KeyCode casting it as a integer
function keyTyped() {
  toggle = int(keyCode);
}

//Shadow effect on the visualizers and particles to add a visual effect
function shadow(){
  drawingContext.shadowOffsetX = 1;
  drawingContext.shadowOffsetY = -1;
  drawingContext.shadowBlur = 14;
  drawingContext.shadowColor = 'rgba(255, 255, 255)';
}

//Particles
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
    this.color = [particleR.value(), particleG.value(), particleB.value()]
    this.w = random(3, 10)
  }
  
  //Updates the position by adding increments of velocity in accordance to the beat of the audio
  update(cond) {
    
    this.vel.add(this.acc)
    this.pos.add(this.vel)

    if(cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  
  //Determines when the particles reach the borders of the canvas
  edges() {
    if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height /2) {
      return true;
    } else {
      return false;
    }
  }
  
  show() {
    noStroke()
   	fill(this.color);
    ellipse(1.5*this.pos.x, 1.5*this.pos.y, this.w)
  }
}