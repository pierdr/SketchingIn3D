var CenterObject = function()
{

  var self = this;
  self.mesh = {};
  self.init = function(color)
  {
    //if color is not passed in init than assign an arbitrary color;
    if(color == undefined)
    {
      color = 0x025974;
    }

    const geometryCone = new THREE.ConeGeometry( 100, 300, 12 );
    const materialCone = new THREE.MeshBasicMaterial( {color: 0x5CB9FF,wireframe:false} );
    self.mesh = new THREE.Mesh( geometryCone, materialCone );
    const wireframe = new THREE.MeshBasicMaterial( {color: 0xffffff,wireframe:true} );
    self.mesh.add(new THREE.Mesh( geometryCone, wireframe ));

    const geometryTorus = new THREE.TorusGeometry( 50, 15, 12,100 );
    const materialTorus = new THREE.MeshBasicMaterial( {color: 0xC2936F} );
    const torus = new THREE.Mesh( geometryTorus, materialTorus );

    const torusWireframe = new THREE.WireframeGeometry( geometryTorus );

    const torusLine = new THREE.LineSegments( torusWireframe );
    torusLine.material.depthTest = false;
    torusLine.material.opacity = 0.25;
    torusLine.material.transparent = true;

    torus.rotateX(Math.PI/2);
    torus.position.set(150,0,150);

    torusLine.rotateX(Math.PI/2);
    torusLine.position.set(150,0,150);

    self.mesh.add(torus);
    self.mesh.add(torusLine);
  }

  return self;
}
