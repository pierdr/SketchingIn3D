var WorldBuilder = function()
{
  //This class creates the SCENE (aka the 3d world)

  //WORLD VARIABLES
  var self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  self.renderer = new THREE.WebGLRenderer();

  self.objects = [];
  self.floor = {};

  //WORLD SETUP
  self.setup = function()
  {
    //CREATE THE RENDERER
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xE8F9E5, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //GENERATE NEW OBJECTES
    //CREATE FLOOR
    self.floor = new Floor();
    self.floor.init();
    self.scene.add( self.floor.mesh );

    //CREATE CENTER OBJECT
    self.centerObject = new ThreeDModel();

    //NOTE: if the object already has a texture, make sure that the image is in the same path to the 3d model (better if kept in the same folder)
    //if the object has the texture pass undefined in the 5th argument in this method
    //otherwise pass your own material
    const materialCone = new THREE.MeshBasicMaterial( {color: 0x5CB9FF,wireframe:false} );
    self.centerObject.loadObjectWithMaterial(0,0,0,"data/mac.glb",undefined, function(obj){
      obj.scale.set(25.0,25.0,25.0);
      self.scene.add(obj);
      console.log("added object");
    });


    self.camera.position.x = 0;
    self.camera.position.y = 400;
    self.camera.position.z = 400;

    const hemi = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    self.scene.add( hemi );

    var light2 = new THREE.DirectionalLight(0xfafafa, 0.75);
    light2.position.set( 0, 50, 0 );
    light2.target.position.set(50,25,50);
    self.scene.add( light2 );
    self.scene.add( light2.target );

    self.camera.lookAt(new THREE.Vector3(0,0,0));

  }

  //WORLD LOOP
  self.animate = function()
  {
    self.renderer.render( self.scene, self.camera );

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

  //HANDLE MOUSE INTERACTION
  self.posMouseDownOrigin = {};
  self.isMouseDown = false;
  document.addEventListener("mousemove", function (e) {
    if(self.isMouseDown)
    {

      // CALCULATE THE DISTANCE BETWEEN THE MOUSE ORIGINAL PRESS AND CURRENT DRAG POSITION
      var vectorTmp = new THREE.Vector2(e.x,e.y);
      var subVecTmp = vectorTmp.subVectors(self.posMouseDownOrigin,vectorTmp);

      //COMPUTE DIRECTION
      var direction = Math.sign(subVecTmp.normalize().x);

      //AMOUNT CAN BE MAXIMUM THE SCREEN WIDTH
      var amount = subVecTmp.length() * direction;
      amount *= 2.5;

      var angle = self.map(amount,window.innerWidth/2,-window.innerWidth/2,-Math.PI,Math.PI);

      //MOVE THE CAMERA PLANARLY (IGNORE Y or height) and move on a circle
      var camPos = new THREE.Vector2(self.camera.position.x,self.camera.position.z);
      var rotPos = new THREE.Vector2(self.centerObject.x,self.centerObject.z);
      var newPos = camPos.rotateAround(rotPos,angle);

      //ASSIGN NEW ROTATION TO THE CAMERA
      self.camera.position.set(newPos.x,self.camera.position.y,newPos.y);
      self.camera.lookAt(0,25,0);
    }
  });
  document.addEventListener("mousedown", function(e){
    self.posMouseDownOrigin = new THREE.Vector2( e.x, e.y );
    self.isMouseDown = true;
  });
  document.addEventListener("mouseup", function(e){
    self.isMouseDown = false;
  });

  document.addEventListener('keydown', self.onKeyDown, false);
  document.addEventListener('keyup', self.onKeyUp, false);

  self.map = function( value,  istart,  istop,  ostart,  ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

  return self;
}
