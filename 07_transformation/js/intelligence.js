
//OBJECT VARIABLES
const world = new WorldBuilder();

//CALL FUNCTIONS
world.setup();
world.animate();


//SETUP GUI
var GUI = lil.GUI;
var lilGUI = new GUI();

var paramGUI = {
  scale:0.5,
  rotate:0.5,
  translateZ:0.5
}


lilGUI.add( paramGUI, 'scale', 0.5,100  ).onChange( value => {
  world.scale(value);
} ).listen();

lilGUI.add( paramGUI, 'rotate',-6.28,6.28  ).onChange( value => {
  world.rotate(value);
} ).listen();

lilGUI.add( paramGUI, 'translateZ',-450,+450 ).onChange( value => {
  world.translateZ(value);
} ).listen();
