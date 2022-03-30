var Block = function()
{
  var self = this;
  self.cube = {};

  self.init = function(){
    self.geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
    self.material = new THREE.MeshBasicMaterial( {color: 0x025974 }  );
    self.cube = new THREE.Mesh( self.geometry, self.material );
  }
  self.move = function(x,y,z)
  {
    if(self.cube != undefined)
    {
      self.cube.position.set(x,y,z);
    }
  }
  self.rotate = function(rotAmountX,rotAmountY,rotAmountZ)
  {
    if(self.cube != undefined)
    {
      self.cube.rotation.x += rotAmountX;
      self.cube.rotation.y += rotAmountY;
      self.cube.rotation.z += rotAmountZ;
    }
  }
  return self;
}
