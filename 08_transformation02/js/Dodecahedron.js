var Dodecahedron = function()
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

    const geometryDod = new THREE.DodecahedronGeometry( 25,0 );
    const colorDod = new THREE.Color( Math.random(), Math.random(), Math.random() );
    const materialDod = new THREE.MeshBasicMaterial( {color: colorDod,wireframe:false} );
    self.mesh = new THREE.Mesh( geometryDod, materialDod );
    const wireframe = new THREE.MeshBasicMaterial( {color: 0xffffff,wireframe:true} );
    self.mesh.add(new THREE.Mesh( geometryDod, wireframe ));
    self.mesh.position.set((Math.random()*400)+200, (Math.random()*400)+200, (Math.random()*400)+200);

  }
  self.move = function(newPos)
  {
    self.mesh.position.set(newPos.x,self.mesh.position.y,newPos.z);
  }

  return self;
}
