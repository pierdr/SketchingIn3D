

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

  const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

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
    self.camera.far = 3500;

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
    self.updateCameraPosition();
    self.updateCameraRotation();
    self.renderer.render( self.scene, self.camera );
    //This line assures that animate is called at each Animation Frame
    requestAnimationFrame( self.animate );
  }

  //ADD KEY LISTENERS
  self.onKeyDown = function(event)
  {
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

  var rotationFactor = 0.0;
  var isCameraRotating = false;

  //ROTATION AND POSITION TARGET AND START Variables (Rotation is expressed in quaternion)
  var startPosition = new THREE.Vector3();
  var targetPosition= new THREE.Vector3();

  var startEuler = new THREE.Euler( 0, 0, 0, 'YXZ' );
  var endEuler = new THREE.Euler( 0, 0, 0, 'YXZ' );



  self.randomizeCameraPosition = function()
  {

    //SAVE POSITION
    startPosition.x = self.camera.position.x;
    startPosition.y = self.camera.position.y;
    startPosition.z = self.camera.position.z;

    //FIND NEW RANDOM POSiTION
    targetPosition.x = ((Math.random()-0.5)*2)*(5*125);
    targetPosition.y = ((Math.random()-0.5)*400)+700;
    targetPosition.z = ((Math.random()-0.5)*2)*(5*125);


    //START UPDATING
    isCameraMoving = true;
    movementFactor = 0.0;
  }

  self.updateCameraPosition = function(){
    if(isCameraMoving)
    {
      movementFactor +=  self.speed ;
      let expFactor =easeInOutBack( movementFactor);

      //INTERPOLATE POSITION
      self.camera.position.x = startPosition.x * (1-expFactor) + targetPosition.x * expFactor;
      self.camera.position.y = startPosition.y * (1-expFactor) + targetPosition.y * expFactor;
      self.camera.position.z = startPosition.z * (1-expFactor) + targetPosition.z * expFactor;


      //CHECK IF ANIMATION IS FINISHED
      if( movementFactor>=1.0)
      {
        isCameraMoving = false;
      }
    }
  }
  //UPDATE ROTATION
  self.updateCameraRotation = function()
  {
    if(isCameraRotating)
    {
      rotationFactor +=  self.speed ;
      let expFactor = easeInOutBack( rotationFactor);

      var currentEuler = new THREE.Euler(0, 0, 0, 'YXZ');
      currentEuler.x = startEuler.x * (1-expFactor) + endEuler.x * expFactor;
      currentEuler.y = startEuler.y * (1-expFactor) + endEuler.y * expFactor;
      currentEuler.z = startEuler.z * (1-expFactor) + endEuler.z * expFactor;

      self.camera.quaternion.setFromEuler( currentEuler );

      //CHECK IF ANIMATION IS FINISHED
      if( rotationFactor>=1.0)
      {
        isCameraRotating = false;
      }
    }
  }

  self.rotateCameraToCloserElement = function()
  {

      var closestObj = findClosestElement();
      self.rotateCameraToTarget(closestObj.position);
  }
  self.rotateCameraToTarget = function(target)
  {
    //save start rotation
    startEuler.setFromQuaternion(self.camera.quaternion);

    self.camera.lookAt(target);

    //save end rotation
    endEuler.setFromQuaternion(self.camera.quaternion);


    self.camera.quaternion.setFromEuler( startEuler );

    //start ANIMATION
    isCameraRotating = true;
    rotationFactor = 0.0;
  }
  self.moveAndRotate = function()
  {
    //FIND NEW RANDOM POSiTION
    targetPosition.x = ((Math.random()-0.5)*2)*(5*125);
    targetPosition.y = ((Math.random()-0.5)*400)+700;
    targetPosition.z = ((Math.random()-0.5)*2)*(5*125);

    //FIND CLOSEST ELEMENT TO RANDOMPOSITION

    var closest = findClosestElement(targetPosition);
    self.rotateCameraToDestination(targetPosition,closest.position);
  }
  self.rotateCameraToDestination = function(dest,target)
  {
    //save start rotation
    startPosition.x = self.camera.position.x;
    startPosition.y = self.camera.position.y;
    startPosition.z = self.camera.position.z;

    //save current rotation
    startEuler.setFromQuaternion(self.camera.quaternion);

    //set destination position
    self.camera.position.set(dest.x,dest.y,dest.z);

    //Find final rotation at destination
    self.camera.lookAt(target);

    //save end rotation at destination
    endEuler.setFromQuaternion(self.camera.quaternion);

    //set camera back to initial position
    self.camera.position.set(startPosition.x,startPosition.y,startPosition.z);

    //set camera back to initial rotation
    self.camera.quaternion.setFromEuler( startEuler );

    //start ANIMATION
    isCameraRotating = true;
    rotationFactor = 0.0;
    isCameraMoving = true;
    movementFactor = 0.0;

  }

  self.speed = 0.005;

  self.setSpeedRotation = function(speed)
  {
    self.speed = speed;
  }

  ///// UTILS

  //Find closest element
  function findClosestElement(originPos)
  {
    var cameraPos = originPos;
    if(originPos == undefined)
    {
        cameraPos = self.camera.position;
    }
    var minDist = 10000;
    var closestObj = {};

    for(var i = 0;i<self.scene.children.length;i++)
    {
      var objTmp = self.scene.children[i];
      var posObj = objTmp.position;
      ;
      var dist = posObj.distanceTo(cameraPos);
      if(dist<minDist)
      {
        closestObj = objTmp;
        minDist = dist;
      }
    }
    return closestObj;
  }
  //EASING
  /// function from: https://easings.net/
  function easeInOutBack(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }


  return self;
}
