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
	ret.position.z = 20;
	return ret;
})();
// step 1.3 init a scene
function make_cylinder(id, radiu_top, radiu_bot, height, style)
{
	var shape = new THREE.CylinderGeometry(radiu_top, radiu_bot, height, 100);
	var material = new THREE.MeshBasicMaterial(style);
 	var ret = new THREE.Mesh(shape, material);
	ret.userData.id = id;
	return ret;
}
function make_box(id)
{
	var shape = new THREE.BoxGeometry(0.2, 0.2, 0.01);
	var material = new THREE.MeshBasicMaterial({color:0xffffff});
	var ret = new THREE.Mesh(shape, material);
	ret.userData.id = id;
	return ret;
}
var scene = (function(){
	var ret = new THREE.Scene();
	var cyl = make_cylinder("main", 1, 2, 30, {color: 0x660000}); 
	var child_cyl = make_cylinder("left", 0.5, 0.5, 10, {color: 0x663300});
	child_cyl.position.y = 10;
	child_cyl.position.x = -10 / 2 / 1.414;
	child_cyl.rotation.z = Math.PI / 6; 
	var child2 = make_cylinder("right", 0.4, 0.4, 8, {color: 0x663300});
	child2.position.y = 11;
	child2.position.x = 10 / 2 / 2 ;
	child2.rotation.z = -Math.PI / 5;
	ret.add(cyl);
	ret.add(child_cyl);
	ret.add(child2);
	return ret;
})();
// step 2: basic render and rerender
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
// step 2.3: rerender the scene when have mouse event using orbit controls
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change',function(){
	renderer.render(scene, camera);
});
// step 3 specilized rerender
// step 3.1 add letter when  click
var id = 0;
document.addEventListener('mouseup', function (event){
	var raycaster = new THREE.Raycaster();	
	var mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length == 0) return;
	else {
		var over_id = intersects[0].object.userData.id;
		if (over_id == "left" || over_id == "right"){
			var box = make_box("letter");

			box.position.x = intersects[0].point.x;
			box.position.y = intersects[0].point.y;
			box.position.z = intersects[0].point.z;
			box.userData.text = window.prompt("请输入祝福", "新年快乐");
			scene.add(box);
			renderer.render(scene, camera);
		}
	}
});
// step 3.2 display content when mouse over
document.addEventListener('mousemove', function (event){
	var raycaster = new THREE.Raycaster();	
	var mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	var to_set = "";
	if (intersects.length == 0) return;
	else {
		var over_id = intersects[0].object.userData.id;
		if (over_id == "letter")
		{
			to_set = intersects[0].object.userData.text;
		}
	}
	document.getElementById("content").innerHTML = to_set;
});
