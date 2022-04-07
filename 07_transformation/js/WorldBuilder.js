var WorldBuilder = function()
{
  //This class creates the SCENE (aka the 3d world)

  //WORLD VARIABLES
  var self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  self.renderer = new THREE.WebGLRenderer();

  //RAYCASTING
  self.raycaster = new THREE.Raycaster();
  var selectableElements = [];

  //SELECTION LOGIC
  var nameOfSelectedObject = "";
  var nameOfHoveredObject = "";

  //WORLD SETUP
  self.setup = function()
  {
    //CREATE THE RENDERER
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xA6AF82, 1 );

    //ADD THE RENDERER TO THE DOCUMENT
    document.body.appendChild( self.renderer.domElement );

    //ADD MONKEY
    monkey = new ThreeDModel();
    monkey.loadObjectWithTexture(0,0,0,"data/monkey.glb","data/paint.jpg","monkey", function(obj){
      obj.scale.set(25.0,25.0,25.0);
      obj.position.set(300,0,0);
      self.scene.add(obj);
      selectableElements.push(obj);
      console.log("added " + obj.name);
    });

    //ADD SECOND MONKEY
    var monkey2= new ThreeDModel();
    monkey2.loadObjectWithTexture(0,0,0,"data/monkey.glb","data/wood.jpg", "monkey2",function(obj){
      obj.scale.set(25.0,25.0,25.0);
      obj.position.set(-300,0,0);
      self.scene.add(obj);
      selectableElements.push(obj);
      console.log("added " + obj.name);
    });

    //ADD TEAPOT
    var teapot = new ThreeDModel();
    teapot.loadObjectWithTexture(0,0,0,"data/teapot.glb","data/marble.jpg","teapot", function(obj){
      obj.scale.set(25.0,25.0,25.0);
      obj.position.set(0,0,0);
      self.scene.add(obj);
      selectableElements.push(obj);
      console.log("added " + obj.name);
    });

    //ADD FEEDBACK BOX FOR SELECTED ITEMS
    const geometryBox = new THREE.BoxGeometry(9.5, 9.5,9.5);
    const materialBox = new THREE.MeshBasicMaterial( {color: 0x00ff00,wireframe:true }  );
    self.selectionBox = new THREE.Mesh( geometryBox, materialBox );
    // self.selectionBox.visible = false;
    self.scene.add(self.selectionBox);

    //ADDED FLOOR
    self.floor = new Floor();
    self.floor.init();
    self.floor.mesh.position.set(0,0,0);
    self.scene.add( self.floor.mesh );

    //ADD LIGHTS
    const hemi = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    self.scene.add( hemi );

    var light2 = new THREE.DirectionalLight(0xfafafa, 0.75);
    light2.position.set( 0, 50, 0 );
    light2.target.position.set(50,25,50);
    self.scene.add( light2 );
    self.scene.add( light2.target );


    //CAMERA POSITION
    self.camera.position.set(0,350,300);
    self.camera.lookAt(0,0,0);

  }

  //WORLD LOOP
  self.animate = function()
  {
    self.renderer.render( self.scene, self.camera );

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
    const intersections = self.raycaster.intersectObjects( selectableElements );

    for ( let i = 0; i < selectableElements.length; i ++ ) {
      if(selectableElements[ i ].isSelected)
      {
        selectableElements[ i ].children[0].material.color.set( 0x777777 );
      }
      else {
          selectableElements[ i ].children[0].material.color.set( 0xffffff );
      }

    }

    for ( let i = 0; i < intersections.length; i ++ ) {

      if( intersections[ i ].object.parent.isSelected )
      {
        intersections[ i ].object.material.color.set( 0x777777);
      }
      else {
        intersections[ i ].object.material.color.set( 0xff0000 );
      }
    }


    if(intersections.length > 0)
    {
      nameOfHoveredObject = intersections[0].object.parent.name;
    }
    else {
      nameOfHoveredObject = undefined;
    }


  };
  document.addEventListener("mousemove",onMouseMove );

  var onMouseClicked = function(e)
  {
    //WITH THE MOUSE I'm HOVERING OVER AN OBJECT
    if(nameOfHoveredObject != undefined)
    {
      //JUST IN CASE DESELECT ALL THE OBJECTS
      for(var i = 0;i<selectableElements.length;i++)
      {
          selectableElements[i].isSelected = false;
          selectableElements[i].children[0].material.color.set( 0xffffff );
      }

      nameOfSelectedObject = nameOfHoveredObject;
      var selectedObject = getObjectWith(nameOfSelectedObject);
      selectedObject.isSelected = true;
      selectedObject.children[0].material.color.set( 0x777777 );

      //UPDATE SELECTION BOX
      self.selectionBox.position.set(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z);
      self.selectionBox.rotation.set(selectedObject.rotation.x,selectedObject.rotation.y,selectedObject.rotation.z);
      self.selectionBox.scale.set(selectedObject.scale.x,selectedObject.scale.y,selectedObject.scale.z);

      //SET GUI
      paramGUI.scale    = selectedObject.scale.x;
      paramGUI.rotate        = selectedObject.rotation.y;
      paramGUI.translateZ    = selectedObject.position.z;

    }
    //I'M CLICKING OUTSIDE THE SELECTABLE OBJECTS
    else {
      nameOfSelectedObject = undefined;
      for(var i = 0;i<selectableElements.length;i++)
      {
        selectableElements[i].isSelected = false;
        self.selectionBox.scale.set(0,0,0);
        selectableElements[i].children[0].material.color.set( 0xffffff );
      }
    }

  }
  document.addEventListener("click",onMouseClicked);

  //TRANSFORM METHODS:
  self.scale = function(value)
  {
    if(nameOfSelectedObject != undefined)
    {
      var selectedObject = getObjectWith(nameOfSelectedObject);
      selectedObject.scale.set(value,value,value);
      self.selectionBox.scale.set(selectedObject.scale.x,selectedObject.scale.y,selectedObject.scale.z);
    }
  }
  self.rotate = function(value)
  {
    if(nameOfSelectedObject != undefined)
    {
      var selectedObject = getObjectWith(nameOfSelectedObject);
      selectedObject.rotation.set(0,value,0);
      self.selectionBox.rotation.set(selectedObject.rotation.x,selectedObject.rotation.y,selectedObject.rotation.z);
    }
  }
  self.translateZ = function(value)
  {
    if(nameOfSelectedObject != undefined)
    {
      var selectedObject = getObjectWith(nameOfSelectedObject);
      selectedObject.position.set(selectedObject.position.x,selectedObject.position.y,value);
      self.selectionBox.position.set(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z);
    }
  }
  //UTILS METHODS
  function getObjectWith(name)
  {
    for(var i = 0;i<selectableElements.length;i++)
    {
      if(selectableElements[i].name == name)
      {
        return selectableElements[i];
      }
    }
  }

  return self;
}
