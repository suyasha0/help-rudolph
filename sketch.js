var world, gift, g;
let jingle, blip;
var framectr =0;

var count = 0;

/*

You, and elf, accidentally dropped all your presents while on your sleigh... Click and move through the snow to collect all the 
presents you dropped. Burgers are just a distraction- they are not harmful...or ARE they?

Collect TEN presents. 

*/

function preload(){

	jingle = loadSound("sounds/jingle.mp3");
	blip = loadSound("sounds/blip.mp3");
	snow = loadSound("sounds/snow.mp3");

}

function setup() {

  noCanvas();
  
  world = new World("VRScene");

  jingle.play();
  jingle.setVolume(.6);

	// create a plane to serve as our "ground"
	g = new Plane({
					x:0, y:0, z:0,
					width:100, height:100,
					asset: 'snow',
					repeatX: 100,
					repeatY: 500,
					rotationX:-90, metalness:0.25
				   });

	// add the plane to our world
	world.add(g);

}

var gifts = [];
var particles = [];
var burgers = [];

function draw() {

  framectr+=1;



	var part = new Particle(world.getUserPosition().x+ random(-4, 4), world.getUserPosition().y + 3, world.getUserPosition().z - random(.5, 6));
	particles.push( part );

for (var i = 0; i < particles.length; i++) {
	var result = particles[i].move();
	if (result == "gone") {
		particles.splice(i, 1);
		i-=1;
	}
} 


if (mouseIsPressed) {
	world.moveUserForward(0.05);
}

	for (var i = 0; i < gifts.length; i++) {
		var result = gifts[i].move();
		if (result == "gone") {
			gifts.splice(i, 1);
			i-=1;
		}
	} 

	for (var i = 0; i < burgers.length; i++) {
		var result = burgers[i].move();
		if (result == "gone") {
			burgers.splice(i, 1);
			i-=1;
		}
	} 

  if(count > 9){
	  if(jingle.isPlaying()){
	    jingle.stop();
	  }
	  if(!snow.isPlaying()){
	    snow.play();
	  }
	  return;
  }
  
  if(gifts.length < 10){
  	 if (framectr%30 ==0){
    var temp = new Gift(world.getUserPosition().x + random(-1, 1), g.getY()+1, world.getUserPosition().z - random(.5, 6));
    gifts.push(temp);
  }

  if (framectr%50 ==0){
    var temp = new Burger(world.getUserPosition().x + random(-1, 1), g.getY()+1, world.getUserPosition().z - random(.5, 6));
    burgers.push(temp);
  }
  }
 
	
}


function Particle(x,y,z) {

	this.myBox = new Sphere({
							x:x, y:y, z:z,
							red: 173, green: 216, blue: 230,
							radius: 0.1
	});

	// add the box to the world
	world.add(this.myBox);

	this.move = function(){
		this.myBox.nudge(0, -.05, 0);

		if(y<0){
			world.remove(this.myBox);
			return "gone";
		}

		if(z>world.getUserPosition().z){
			world.remove(this.myBox);
			return "gone";
		}
	}

}


function Gift(x,y,z){
  this.gift = new OBJ({
    asset: 'gift_obj',
    mtl: 'gift_mtl',
    x: x,
    y: y,
    z: z,
	rotationX:0,
	rotationY:180,
	scaleX:1.5,
	scaleY:1.5,
	scaleZ:1.5
  });
  world.add(this.gift);

this.move = function(){

	if(z>world.getUserPosition().z){
		world.remove(this.gift);
		return "gone";
	}

	  if(dist(this.gift.x, this.gift.y, this.gift.z, world.getUserPosition().x, world.getUserPosition().y, world.getUserPosition().z)<.18){
	  	
	  	console.log("HIT");
	  	count++;
	  	blip.play();
	  	world.remove(this.gift);
	  	return "gone";


      }
}
}

function Burger(x,y,z){
  this.burger = new OBJ({
    asset: 'burger_obj',
    mtl: 'burger_mtl',
	x: x,
	y: y,
	z: z,
	rotationX:0,
	rotationY:180,
	scaleX:.6,
	scaleY:.6,
	scaleZ:.6,
  });
  world.add(this.burger);

this.move = function(){

	this.burger.spinY(1);

	if(z>world.getUserPosition().z){
		world.remove(this.burger);
		return "gone";
	}
}
}


