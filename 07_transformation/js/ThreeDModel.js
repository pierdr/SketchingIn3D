let ThreeDModel = function()
{
	let self = this;
	self.texUrl = "";
  self.objUrl = "";

	self.mesh = {};
	self.selectionBox = {};


  self.loadObjectWithTexture = function (x_,y_,z_,objectURL,textureURL,name, callback) {
      //LOAD TEXTURE
      self.texUrl = textureURL;


      var texturedMaterial;
      var texture = new THREE.TextureLoader().load(self.texUrl);
      texturedMaterial = new THREE.MeshStandardMaterial({ map: texture });


      self.loadObjectWithMaterial(x_,y_,z_,objectURL,texturedMaterial,name,callback);
  }
  self.loadObjectWithMaterial = function(x_,y_,z_,objectURL,material,name,callback)
  {
		self.objUrl = objectURL;


    //LOAD 3D model
		var loader = new 	THREE.GLTFLoader();
		let finishLoadingCallback = callback;
    //LOAD A GLB FILE
    loader.load( objectURL, function ( gltf ) {
      let objTmp = new THREE.Object3D( );
      for(var i = 0;i<gltf.scene.children.length;i++)
      {
        console.log("adding texture to object:"+i);
        if(material != undefined)
        {
          gltf.scene.children[i].material = material;
        }
        objTmp.add( gltf.scene.children[i] );
      }
      objTmp.position.set	(x_,y_,z_);


      self.mesh = objTmp;
			self.mesh.isSelected = false;
			self.mesh.isHovered = false;

			var arrTmp = objectURL.split("/");
			var arr2Tmp = arrTmp[arrTmp.length-1].split(".");

			self.mesh.name = name;

			finishLoadingCallback(  objTmp );

    }, undefined, function ( error ) {

      console.error( "error",error );

    } );



  }
  return self;
}
