var WorldBuilder = function()
{
  //This class creates the SCENE (aka the 3d world)

  //WORLD VARIABLES
  var self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  self.renderer = new THREE.WebGLRenderer();

  var elements = [];

  //RAYCASTING
  self.raycaster = new THREE.Raycaster();


  //WORLD SETUP
  self.setup = function()
  {
    //CREATE THE RENDERER
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xA6AF82, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //GENERATE NEW OBJECTES
    for(var i = 0;i<10;i++)
    {
      for(var j = 0; j <10;j++)
      {
        var tetrahedronTmp = new Tetrahedron();
        tetrahedronTmp.init();
        tetrahedronTmp.move(i,j,0);
        self.scene.add( tetrahedronTmp.mesh );
        elements.push(tetrahedronTmp);
      }
    }


    self.camera.position.x = 5;
    self.camera.position.y = 5;
    self.camera.position.z = 5;

  }

  //WORLD LOOP
  self.animate = function()
  {
    self.renderer.render( self.scene, self.camera );
    for(let i = 0; i < elements.length; i ++)
    {
      elements[i].rotate(0.01,0,0.01);
    }
    //This line assures that animate is called at each Animation Frame
    requestAnimationFrame( self.animate );
  }

  //HANDLE MOUSE INTERACTION
  var onMouseMove = function (e) {

    var pointer = new THREE.Vector2(e.x,e.y);

    //NORMALIZE
    pointer.x = ( pointer.x/ window.innerWidth ) * 2 - 1;
    pointer.y = - ( pointer.y / window.innerHeight ) * 2 + 1;

    self.raycaster.setFromCamera( pointer, self.camera );
    const intersections = self.raycaster.intersectObjects( self.scene.children );


    for ( let i = 0; i < elements.length; i ++ ) {
      elements[ i ].mesh.material.color.set( 0x025974 );
    }
    
    for ( let i = 0; i < intersections.length; i ++ ) {
      intersections[ i ].object.material.color.set( 0xff0000 );
    }


  };
  document.addEventListener("mousemove",onMouseMove );

  return self;
}
