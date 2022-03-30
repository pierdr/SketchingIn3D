var ThreeDModel = function()
{
	let self = this;
	self.texUrl = "";
  self.objUrl = "";
	self.mesh = {};

  self.loadObjectWithTexture = function (x_,y_,z_,objectURL,textureURL, callback) {
      //LOAD TEXTURE
      self.texUrl = textureURL;
      var texturedMaterial;
      var texture = new THREE.TextureLoader().load(self.texUrl);
      texturedMaterial = new THREE.MeshStandardMaterial({ map: texture });


      self.loadObjectWithMaterial(x_,y_,z_,objectURL,texturedMaterial,callback)
  }
  self.loadObjectWithMaterial = function(x_,y_,z_,objectURL,material,callback)
  {
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
      finishLoadingCallback(  objTmp );

      self.mesh = objTmp;

    }, undefined, function ( error ) {

      console.error( "error",error );

    } );

  }
  return self;
}
