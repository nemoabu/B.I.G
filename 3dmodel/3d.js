import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { OBJLoader } from "jsm/loaders/OBJLoader.js"; // Import OBJLoader

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000);
scene.add(hemiLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let humanModel = null; // Store the loaded model




// Load Human OBJ Model
const objLoader = new OBJLoader();
objLoader.load(
    "human2.obj", // Change this to the correct path
    (object) => {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    flatShading: true
                });
            }
        });

        object.position.set(0, -1.2, 0);
        object.scale.set(0.1, 0.1, 0.1);

        scene.add(object);
        humanModel = object; // Store reference for interaction
    },
    undefined,
    (error) => console.error("Error loading model:", error)
);

function onMouseMove(event) {
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;
}

document.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onMouseClick, false);

function onMouseClick(event) {
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        console.log("Redirecting to URL...");
        window.location.href = "https://www.youtube.com/watch?v=QO92JBY9ZuE&list=RDfCeiUX59_FM&index=4";
    }
}

function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        if (selectedObject) selectedObject.material.color.set(0xffffff);
        selectedObject = intersects[0].object;
        selectedObject.material.color.set(0xffff00);
    } else {
        if (selectedObject) {
            selectedObject.material.color.set(0xffffff);
            selectedObject = null;
        }
    }

    renderer.render(scene, camera);
    controls.update();
}

animate();


/*
import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js"
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);


const dragThreshold = 5;  
const fov = 75;
const aspect = w /h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2;
const scene = new THREE.Scene();
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading:true
});
const mesh = new THREE.Mesh(geo, mat);
mesh.position.x = -0.5; // Shift left by 0.5 units


scene.add(mesh);
const wireMat =new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe:true
})
const wireMesh= new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000) 
scene.add(hemiLight);

controls.target.copy(mesh.position);

// Add this below your existing code

// Raycaster and mouse vector for detecting hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;  // Track the object that is hovered over

// Mouse move event listener
function onMouseMove(event) {
    // Normalize mouse coordinates to [-1, 1] range
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;
}

// Add the event listener for mouse move
document.addEventListener('mousemove', onMouseMove);
// Event listener for mouse click
window.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
    // Update the mouse coordinates to normalized device coordinates (-1 to 1)
    mouse.x = (event.clientX / w) * 2 - 1;
    mouse.y = -(event.clientY / h) * 2 + 1;

    // Update the raycaster with the current mouse position
    raycaster.setFromCamera(mouse, camera);

    // Get the objects intersected by the raycaster
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log('Intersects:', intersects);
    console.log('Ray Direction:', raycaster.ray.direction);
    // If the raycaster intersects the mesh
    if (intersects.length > 0 ) {
        // Redirect to a URL when the mesh is clicked

        console.log("Redirecting to URL...");  // Debugging log
        window.location.href = 'https://www.youtube.com/watch?v=QO92JBY9ZuE&list=RDfCeiUX59_FM&index=4';
    }
}

function animate(t=0){
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Check if intersects has any elements, meaning an object was hit
    if (intersects.length > 0) {
        // Reset the previously highlighted object if any
        if (selectedObject) {
            selectedObject.material.color.set(0xffffff); // Reset color to original (white)
        }

        // Highlight the first intersected object
        selectedObject = intersects[0].object;
        selectedObject.material.color.set(0xffff00); // Set color to yellow
    } else {
        // If no intersection, reset the previous object (if any)
        if (selectedObject) {
            selectedObject.material.color.set(0xffffff); // Reset color to original (white)
            selectedObject = null;
        }
    }
    //mesh.rotation.y=t*0.0001;
    renderer.render(scene, camera);
    controls.update();
}
animate();

*/