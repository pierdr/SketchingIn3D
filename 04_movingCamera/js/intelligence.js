
  //OBJECT VARIABLES
  const world = new WorldBuilder();

  //CALL FUNCTIONS
  world.setup();
  world.animate();

  //SETUP GUI
  var GUI = lil.GUI;
  var lilGUI = new GUI();

  var obj = {

  	randomizeCameraPosition: function() { world.randomizeCameraPosition() }
  }
  lilGUI.add( obj, 'randomizeCameraPosition' ); 	// button
