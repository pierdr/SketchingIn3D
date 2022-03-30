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

		var colors = [];
    var color 			= new THREE.Color();
		for (var i = 0, l = position.count; i < l; i++) {
			color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
			colors.push(color.r, color.g, color.b);
		}

		floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		var floorMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,wireframe: false});

		self.mesh = new THREE.Mesh(floorGeometry, floorMaterial);

		self.mesh.name = "floor";

		self.mesh.castShadow = false;
		self.mesh.receiveShadow = true;


  }
  return self;
}
