var Tetrahedron = function()
{
  var self = this;
  self.mesh = {};

  self.init = function(){
    self.geometry = new THREE.TetrahedronGeometry(0.5,0);
    self.material = new THREE.MeshBasicMaterial( {color: 0x025974 }  );
    self.mesh = new THREE.Mesh( self.geometry, self.material );
  }
  self.move = function(x,y,z)
  {
    if(self.mesh != undefined)
    {
      self.mesh.position.set(x,y,z);
    }
  }
  self.rotate = function(rotAmountX,rotAmountY,rotAmountZ)
  {
    if(self.mesh != undefined)
    {
      self.mesh.rotation.x += rotAmountX;
      self.mesh.rotation.y += rotAmountY;
      self.mesh.rotation.z += rotAmountZ;
    }
  }
  return self;
}
