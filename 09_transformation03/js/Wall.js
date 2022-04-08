var Wall = function()
{
  var self = this;
  self.mesh = {};

  self.init = function(color){
    //if color is not passed in init than assign an arbitrary color;
    if(color == undefined)
    {
      color = 0x025974;
    }

    self.geometry = new THREE.BoxGeometry(10,50,0.5);
    self.material = new THREE.MeshBasicMaterial( {color: color }  );
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
