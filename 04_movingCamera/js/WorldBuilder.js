

var WorldBuilder = function()
{
  //This class creates the SCENE (aka the 3d world)

  //WORLD VARIABLES
  var self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  self.renderer = new THREE.WebGLRenderer();

  self.walls = [];
  self.floor = {};


  //WORLD SETUP
  self.setup = function()
  {
    //CREATE THE RENDERER
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xFAFAFA, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //GENERATE NEW OBJECTES
    //CREATE FLOOR
    self.floor = new Floor();
    self.floor.init();
    self.scene.add( self.floor.mesh );

    //CREATE CENTER OBJECTES
    for(var x = -5;x<5;x++)
    {
      for(var y =-5;y<5;y++ )
      {
        self.centerObject = new CenterObject();
        self.centerObject.init();
        self.centerObject.move(new THREE.Vector3(x*125,self.centerObject.mesh.position.y,y*125));
        self.scene.add(self.centerObject.mesh);
      }
    }


    self.camera.position.x = 0;
    self.camera.position.y = 800;
    self.camera.position.z = 0;

    var light2 = new THREE.DirectionalLight(0xfafafa, 0.75);
    light2.position.set( 0, 50, 0 );
    light2.target.position.set(50,25,50);
    self.scene.add( light2 );
    self.scene.add( light2.target );


    self.camera.rotation.order = 'YXZ';
    self.camera.rotateY(Math.PI);
    self.camera.lookAt(new THREE.Vector3(1,50,1));
  }

  //WORLD LOOP
  self.animate = function()
  {
    self.renderer.render( self.scene, self.camera );
    self.updateCameraPosition();
    //This line assures that animate is called at each Animation Frame
    requestAnimationFrame( self.animate );
  }

  //ADD KEY LISTENERS
  self.onKeyDown = function(event)
  {
    console.log("key pressed:",event.keyCode);
    switch(event.keyCode)
    {
      case 38:
      self.camera.position.z -= 5;

      break;
      case 40:
      self.camera.position.z += 5;

      break;
    }

  }

  self.onKeyUp = function(event)
  {
    console.log("key released:",event.keyCode);
  }

  document.addEventListener('keydown', self.onKeyDown, false);
  document.addEventListener('keyup', self.onKeyUp, false);

  //CAMERA MOVEMENT PARAMETERS - NOTE: all the variables relative to camera motion are private variables (not added to self) just for convenience
  //UNDERSTANDING THE VARIABLES HERE IS PRETTY IMPORTANT

  //STATE Variables
  var movementFactor = 0.0;
  var isCameraMoving = false;

  //ROTATION AND POSITION TARGET AND START Variables (Rotation is expressed in quaternion)
  var startPosition = new THREE.Vector3();
  var targetPosition= new THREE.Vector3();

  var startQuaternion = new THREE.Quaternion();
  var targetQuaternion = new THREE.Quaternion();

  var startRotation = new THREE.Vector3();
  var targetRotation = new THREE.Vector3();

  self.randomizeCameraPosition = function()
  {

    //SAVE POSITION
    startPosition.x = self.camera.position.x;
    startPosition.y = self.camera.position.y;
    startPosition.z = self.camera.position.z;

    //FIND NEW RANDOM POSiTION
    targetPosition.x = ((Math.random()-0.5)*2)*(5*125);
    targetPosition.y = self.camera.position.y;
    targetPosition.z = ((Math.random()-0.5)*2)*(5*125);

    //SAVE ROTATION
    // startQuaternion = new THREE.Quaternion().copy( self.camera.quaternion );
    // self.camera.position.x = targetPosition.x;
    // self.camera.position.y = targetPosition.y;
    // self.camera.position.z = targetPosition.z;
    // self.camera.lookAt(new THREE.Vector3(0,0,0));
    // endQuaternion = new THREE.Quaternion().copy( self.camera.quaternion );


    //RESET TO START POSITION
    // self.camera.applyQuaternion(startQuaternion);
    self.camera.position.x = startPosition.x;
    self.camera.position.y = startPosition.y;
    self.camera.position.z = startPosition.z;


    //START UPDATING
    isCameraMoving = true;
    movementFactor = 0.0;
  }

  self.updateCameraPosition = function(){
    if(isCameraMoving)
    {
      movementFactor +=  0.01 ;
      let expFactor = movementFactor;

      //INTERPOLATE POSITION
      self.camera.position.x = startPosition.x * (1-expFactor) + targetPosition.x * expFactor;
      self.camera.position.y = startPosition.y * (1-expFactor) + targetPosition.y * expFactor;
      self.camera.position.z = startPosition.z * (1-expFactor) + targetPosition.z * expFactor;

      //INTERPOLATE ROTATION
      // THREE.Quaternion.slerp(startQuaternion, targetQuaternion, self.camera.quaternion, expFactor);

      //CHECK IF ANIMATION IS FINISHED
      if( movementFactor>=1.0)
      {
        isCameraMoving = false;
      }
      console.log("camera",self.camera.position,"start",startPosition,"target",targetPosition,"mov",movementFactor);
    }
  }


  return self;
}
