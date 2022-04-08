var Sphere = function()
{

  var self = this;
  self.mesh = {};
  self.init = function(color)
  {
    //if color is not passed in init than assign an arbitrary color;
    if(color == undefined)
    {
      color = 0xFA5974;
    }

    const geometrySphere = new THREE.SphereGeometry( 15, 32, 16 );;
    const materialSphere = new THREE.MeshBasicMaterial( {color: 0x56ABFA,wireframe:false} );
    self.mesh = new THREE.Mesh( geometrySphere, materialSphere );
    const wireframe = new THREE.MeshBasicMaterial( {color: 0xffffff,wireframe:true} );
    self.mesh.add(new THREE.Mesh( geometrySphere, wireframe ));

    self.mesh.scale.set(5,5,5);
  }
  self.move = function(newPos)
  {
    self.mesh.position.set(newPos.x,self.mesh.position.y,newPos.z);
  }

  return self;
}
