

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

  //GESTURE VARIABLES
  var startX;
  var startY;
  var rotationCamera = 0;
  var scaleCamera = 1;
  var posX = 0;
  var posY = 0;
  var gestureStartRotation = 0;
  var gestureStartScale = 0;

  //WORLD SETUP
  self.setup = function()
  {
    //CREATE THE RENDERER
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xFAFAFA, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //GENERATE NEW OBJECTES

    //CREATE FLOATING OBJECTES
    for(var x = -10;x<10;x++)
    {
      for(var y =-10;y<10;y++ )
      {
        var tmpDod = new Dodecahedron();
        tmpDod.init();
        tmpDod.move(new THREE.Vector3(x*125,tmpDod.mesh.position.y,y*125));
        self.scene.add(tmpDod.mesh);
      }
    }


    self.camera.position.x = 0;
    self.camera.position.y = 800;
    scaleCamera = 800;
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

  //ADD GESTURE LISTENERS
  //THIS WORKS ONLY IN SAFARI



  //GESTURE START
  let onGestureStart = function(e)
  {
    e.preventDefault();
    startX = e.pageX - posX;
    startY = e.pageY - posY;
    gestureStartRotation = rotationCamera;
    gestureStartScale = scaleCamera;
  }
  window.addEventListener("gesturestart", onGestureStart);

//GESTURE CHANGE
  let onGestureChange = function(e)
  {
    e.preventDefault();

    rotationCamera = gestureStartRotation + e.rotation;
    scaleCamera =  (gestureStartScale * e.scale);

    posX = e.pageX - startX;
    posY = e.pageY - startY;

    self.camera.rotation.set(self.camera.rotation.x,THREE.Math.degToRad( rotationCamera ),self.camera.rotation.y);
    self.camera.position.set(posX,scaleCamera,posY);
  }

  window.addEventListener("gesturechange", onGestureChange);

//GESTURE END
  let onGestureEnd = function(e){
      e.preventDefault();
  }
  window.addEventListener("gestureend", onGestureEnd);


  //GESTURE TWO FINGER PAN
  let onWheelEvent = function(e)
  {
    e.preventDefault();

    if (e.ctrlKey) {
      scale -= e.deltaY * 0.01;
    } else {
      posX -= e.deltaX * 2;
      posY -= e.deltaY * 2;
      self.camera.position.set(posX,scaleCamera,posY);
    }
  }
    window.addEventListener('wheel',onWheelEvent);





  return self;
}
