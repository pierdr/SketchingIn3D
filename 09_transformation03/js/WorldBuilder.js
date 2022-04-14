

var WorldBuilder = function()
{
  //This class creates the SCENE (aka the 3d world)

  //WORLD VARIABLES
  var self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  self.renderer = new THREE.WebGLRenderer();

  self.floor = {};

  var sphere = new Sphere();
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

    //CREATE SPHERE
    sphere.init();
    self.scene.add(sphere.mesh);


    self.camera.position.x = 0;
    self.camera.position.y = 200;
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
    //This line assures that animate is called at each Animation Frame
    requestAnimationFrame( self.animate );
  }

  //ADD KEY LISTENERS


  var onMouseMove = function(event)
  {
    if(document.pointerLockElement != undefined)
    {
      const scaleX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  		const scaleY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      sphere.mesh.scale.set(sphere.mesh.scale.x + scaleX*0.002,sphere.mesh.scale.y,sphere.mesh.scale.z + scaleY*0.002);
    }
  }
  var onMouseUp = function(event)
  {
    //
    document.getElementsByTagName("canvas")[0].requestPointerLock();
  }

  document.addEventListener('mouseup', onMouseUp, false);
  document.addEventListener('mousemove', onMouseMove, false);

  //CAMERA MOVEMENT PARAMETERS - NOTE: all the variables relative to camera motion are private variables (not added to self) just for convenience
  //UNDERSTANDING THE VARIABLES HERE IS PRETTY IMPORTANT

  //STATE Variables
  var movementFactor = 0.0;
  var isCameraMoving = false;

  //ROTATION AND POSITION TARGET AND START Variables (Rotation is expressed in quaternion)
  var startPosition = new THREE.Vector3();
  var targetPosition= new THREE.Vector3();



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



    //START UPDATING
    isCameraMoving = true;
    movementFactor = 0.0;
  }

  self.updateCameraPosition = function(){
    if(isCameraMoving)
    {
      movementFactor +=  0.005 ;
      let expFactor = movementFactor;

      //INTERPOLATE POSITION
      self.camera.position.x = startPosition.x * (1-expFactor) + targetPosition.x * expFactor;
      self.camera.position.y = startPosition.y * (1-expFactor) + targetPosition.y * expFactor;
      self.camera.position.z = startPosition.z * (1-expFactor) + targetPosition.z * expFactor;


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
