import {create_first_brillouin_zone, reciprocal_lattice, polyhedron_to_threejs_geometry} from "./geometry_calc.js" 
import * as THREE from 'three';

function create_visualisation(poly) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
    const obj = new THREE.Group();
    const faces = polyhedron_to_threejs_geometry(poly, material);
    for (const face of faces) {
        obj.add(face);
    }
    scene.add(obj);

    const lights = [];
    const lightValues = [
        {colour: 0xE60000, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
        {colour: 0xBE61CF, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
        {colour: 0xFF0000, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
        {colour: 0xFF00FF, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
        {colour: 0x990000, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
        {colour: 0xFF9933, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
    ];
    for (let i=0; i<lightValues.length; i++) {
        lights[i] = new THREE.PointLight(
            lightValues[i]['colour'], 
            lightValues[i]['intensity'], 
            lightValues[i]['dist']);
        lights[i].position.set(
            lightValues[i]['x'], 
            lightValues[i]['y'], 
            lightValues[i]['z']);
        scene.add(lights[i]);
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame( animate );
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        renderer.render( scene, camera );
    }
    animate();
}

function test() {
    let prim_vectors = [[],[],[]];
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            prim_vectors[i].push(parseFloat(document.getElementById(i.toString() + "_" + j.toString()).value));
        }
    }
    let reciprocal_lattice_vectors = reciprocal_lattice(prim_vectors);
    let poly = create_first_brillouin_zone(reciprocal_lattice_vectors);

    create_visualisation(poly);

}

// Create input form

let form_element = document.getElementById("test_input");
for (let i = 0;i < 3;i++) {
    for (let j = 0;j < 3;j++) {
        let comp_input = document.createElement("input");
        comp_input.setAttribute("type","text");
        comp_input.setAttribute("id",i.toString() + "_" + j.toString());
        form_element.appendChild(comp_input);
    }
    form_element.appendChild(document.createElement("br"));
}

document.getElementById("test-button").addEventListener("click",test);


