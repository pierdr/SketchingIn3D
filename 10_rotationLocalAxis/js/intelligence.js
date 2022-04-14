
  //OBJECT VARIABLES
  const world = new WorldBuilder();

  //CALL FUNCTIONS
  world.setup();
  world.animate();

  //SETUP GUI
  var GUI = lil.GUI;
  var lilGUI = new GUI();

  var obj = {

  	randomizeCameraPosition: function() { world.randomizeCameraPosition() },
    lookAtClosestObject: function() { world.rotateCameraToCloserElement() },
    moveAndRotate: function() { world.moveAndRotate()
    },
    speed:0.005
  }
  lilGUI.add( obj, 'randomizeCameraPosition' );
  lilGUI.add( obj, 'lookAtClosestObject' );
  lilGUI.add( obj, 'moveAndRotate' );
  lilGUI.add( obj, 'speed', 0.0001,0.1  ).onChange( value => {
    world.setSpeedRotation(value);
  } );
