var CenterObject = function()
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

    const geometryCone = new THREE.ConeGeometry( 100, (Math.random()*400)+500, 3 );
    const materialCone = new THREE.MeshBasicMaterial( {color: 0xA9B9AB,wireframe:false} );
    self.mesh = new THREE.Mesh( geometryCone, materialCone );
    const wireframe = new THREE.MeshBasicMaterial( {color: 0xffffff,wireframe:true} );
    self.mesh.add(new THREE.Mesh( geometryCone, wireframe ));


  }
  self.move = function(newPos)
  {
    self.mesh.position.set(newPos.x,self.mesh.position.y,newPos.z);
  }

  return self;
}
