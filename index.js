import {create_nth_brillouin_zone, reciprocal_lattice, polyhedron_to_threejs_geometry, get_fermi_sphere_radius} from "./geometry_calc.js" 
import * as THREE from 'three';
import standard_lattices from './standard_lattices.json';

function create_visualisation(poly, radius) {

    let first_time = true;
    if (obj !== null) {
        first_time = false;
        scene.remove(obj);
    }

    const material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
    obj = new THREE.Group();
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

    if (sphere !== null && sphere_visible) {
        scene.remove(sphere);
    }
    const sphere_geometry = new THREE.SphereGeometry(radius, 32, 16);
    const sphere_material = new THREE.MeshLambertMaterial({color: 0x0000FF});
    sphere = new THREE.Mesh(sphere_geometry, sphere_material);
    if (sphere_visible) {
        scene.add(sphere);
    }

    function animate() {
        requestAnimationFrame( animate );
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        renderer.render( scene, camera );
    }
    if (first_time) {
        animate();
    }
}

function toggle_sphere() {
    if (sphere_visible) {
        scene.remove(sphere);
        sphere_visible = false;
    }
    else {
        if (sphere !== null) {
            scene.add(sphere);
        }
        sphere_visible = true;
    }
}

const poly_cache = {};

function load_standard_lattice() {
    const standard_selection = document.getElementById("lattice").value;
    if (standard_selection === "-") {
        return;
    }
    const prim_vectors = standard_lattices[standard_selection];
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            document.getElementById(i.toString() + "_" + j.toString()).value = prim_vectors[i][j].toString();
        }
    }
}

function clear_lattice_selection() {
    document.getElementById("lattice").value = "-";
}

function validate_inputs() {
    const text_fields = ["valence-input"];
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            text_fields.push(i.toString() + "_" + j.toString());
        }
    }

    for (const text_field of text_fields) {
        const input = document.getElementById(text_field).value;
        if (isNaN(parseFloat(input))) {
            alert("You must enter numeric values");
            return false;
        }
    }
    return true;
}

function refresh_visualisation() {
    if (!validate_inputs()) {
        return;
    }
    let cache_key = '';

    let reciprocal_lattice_vectors = null;
    const prim_vectors = [[],[],[]];
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            const val = parseFloat(document.getElementById(i.toString() + "_" + j.toString()).value);
            prim_vectors[i].push(val);
            cache_key += val.toString() + ' ';
        }
    }
    reciprocal_lattice_vectors = reciprocal_lattice(prim_vectors);

    const zone_number = parseInt(document.getElementById("zone-input").value);
    cache_key += ' ' + zone_number.toString()

    if (cache_key in poly_cache) {
        poly = poly_cache[cache_key];
    }
    else {
        poly = create_nth_brillouin_zone(reciprocal_lattice_vectors, zone_number);
        poly_cache[cache_key] = poly;
    }
    
    const valence = parseInt(document.getElementById("valence-input").value);
    
    const radius = get_fermi_sphere_radius(reciprocal_lattice_vectors, valence);
    create_visualisation(poly, radius);
}

async function start_async_refresh() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            refresh_visualisation();
            resolve("");
        }, 500);
    })
}

function enable_button() {
    const test_button = document.getElementById("test-button");
    test_button.setAttribute("value", "Visualise");
    test_button.removeAttribute("disabled");
}

function disable_button() {
    const test_button = document.getElementById("test-button");
    test_button.setAttribute("value","Loading...");
    test_button.setAttribute("disabled", "true");
}

async function visualise_button() {
    disable_button();
    const refresh_promise = start_async_refresh().then((value) => (enable_button()));
}

// Create input form
const lattice_select = document.createElement("select");
lattice_select.setAttribute("name","lattice");
lattice_select.setAttribute("id","lattice");
function add_option(select, option) {
    const new_option = document.createElement("option");
    new_option.setAttribute("value",option);
    new_option.textContent = option;
    select.appendChild(new_option);
}
add_option(lattice_select, "-");
for (const lattice in standard_lattices) {
    add_option(lattice_select, lattice);
}
lattice_select.addEventListener("change", load_standard_lattice);
document.getElementById("standard-lattice-select").appendChild(lattice_select);
const form_element = document.getElementById("custom-prim-vectors");
for (let i = 0;i < 3;i++) {
    const vec_label = document.createElement("label");
    vec_label.textContent = "Vector " + (i+1).toString() + ":  "
    form_element.appendChild(vec_label);
    for (let j = 0;j < 3;j++) {
        const comp_input = document.createElement("input");
        comp_input.setAttribute("type","text");
        comp_input.setAttribute("id",i.toString() + "_" + j.toString());
        comp_input.setAttribute("size", 10);
        comp_input.addEventListener("change", clear_lattice_selection);
        form_element.appendChild(comp_input);
    }
    form_element.appendChild(document.createElement("br"));
}
const zone_select = document.getElementById("zone-number");
const zone_input = document.createElement("select");
zone_input.setAttribute("name","zone-input");
zone_input.setAttribute("id","zone-input");
for (let i = 1;i <= 3;i++) {
    add_option(zone_input, i.toString());
}
zone_select.appendChild(zone_input);

const valence = document.createElement("input");
valence.setAttribute("type","text");
valence.setAttribute("id","valence-input");
valence.setAttribute("value","1");
document.getElementById("valence").appendChild(valence);

document.getElementById("test-button").addEventListener("click",visualise_button);

const sphere_toggle = document.createElement("input");
sphere_toggle.setAttribute("type","checkbox");
document.getElementById("sphere_toggle").appendChild(sphere_toggle);
sphere_toggle.addEventListener("click", toggle_sphere);

// Create threejs scene

const width = window.innerWidth / 2;
const height = document.getElementById("test_input").clientHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 2000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height);
document.getElementById("output").appendChild( renderer.domElement );
let obj = null;
let sphere = null;
let sphere_visible = false;