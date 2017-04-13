// step 1: init 3 basic variables: renderer, camera, scene
// step 1.1 init a renderer
var renderer = (function(width, height){
	var ret = new THREE.WebGLRenderer();
	ret.setSize(width, height);
	return ret;
})(window.innerWidth, window.innerHeight);
// step 1.2 init a camera
var camera = (function(){
	var ret = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	ret.position.z = 5;
	return ret;
})();

//step 1.3: init a scene
function makecube(posx, posy, posz, style, id){
	var shape = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial(style);
	var ret = new THREE.Mesh(shape, material);
	ret.position.x = posx;
	ret.position.y = posy;
	ret.position.z = posz;
	ret.userData.id = id;
	return ret;
};
var scene = (function(){
	var cube = makecube(0, 0, 0,{color: 0xffffff}, "center, white");
	var cube2 = makecube(1, 0, 0,{color: 0xff0000}, "right, red");
	var cube3 = makecube(-1, 0, 0,{color: 0x00ffff}, "left, light blue");
	var cube4 = makecube(0, 1.5, 0, {color:0x00ff00},"up, green");
	var cube5 = makecube(0, -1.5, 0,{color:0xff00ff},"down, pink");
	var cube6 = makecube(0, 0, 1, {color:0x0000ff}, "front, blue");
	var cube7 = makecube(0, 0, -1, {color:0xffff00}, "back, yellow");
	var ret = new THREE.Scene();
	ret.add(cube);
	ret.add(cube2);
	ret.add(cube3);
	ret.add(cube4);
	ret.add(cube5);
	ret.add(cube6);
	ret.add(cube7);
	return ret;
})();
// step 2: render the scene using renderer with camera
// step 2.1 render the scene when init
function onload(){
	document.body.appendChild(renderer.domElement);	
	renderer.render(scene, camera);
}
// step 2.2 rerender the scene when window resize
window.onresize = function(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
};
// step 2.3.1: rerender the scene when have mouse event using orbit controls
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change',function(){
	renderer.render(scene, camera);
});
// step 2.3.2: detect mouse in which object and write to <div id='info>	
window.addEventListener('mousemove', function (event){
	var raycaster = new THREE.Raycaster();	
	var mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length == 0) document.getElementById("info").innerHTML = "in blank area";
	else document.getElementById("info").innerHTML = "over " + intersects[0].object.userData.id + " obj";
});

