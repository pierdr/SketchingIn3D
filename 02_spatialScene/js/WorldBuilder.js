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
    self.renderer.setClearColor( 0xE8F9E5, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //GENERATE NEW OBJECTES
      //CREATE FLOOR
      self.floor = new Floor();
      self.floor.init();
      self.scene.add( self.floor.mesh );

      //CREATE CENTER OBJECT
      self.centerObject = new CenterObject();
      self.centerObject.init();
      self.scene.add(self.centerObject.mesh);

    self.camera.position.x = 0;
    self.camera.position.y = 400;
    self.camera.position.z = 400;

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

  document.addEventListener('keydown', self.onKeyDown, false);
  document.addEventListener('keyup', self.onKeyUp, false);

  return self;
}
