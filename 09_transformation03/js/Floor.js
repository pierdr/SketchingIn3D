var Floor = function()
{
  var self = this;
  self.mesh = {};
  self.init = function()
  {
    var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
		floorGeometry.rotateX(- Math.PI / 2);

		// vertex displacement
		var position = floorGeometry.attributes.position;

    // ensure each face has unique vertices
		floorGeometry = floorGeometry.toNonIndexed();

		var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9F9F9F,wireframe: false});

		self.mesh = new THREE.Mesh(floorGeometry, floorMaterial);

		self.mesh.name = "floor";

		self.mesh.castShadow = false;
		self.mesh.receiveShadow = true;


  }
  return self;
}
