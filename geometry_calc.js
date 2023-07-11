import { det, lusolve } from 'mathjs';
import * as THREE from 'three';

function dot(a,b) {
    if (a.length != b.length) {
        throw new Error("Trying to dot product vectors of different lengths");
    }
    let r = 0;
    for (let i = 0;i < a.length;i++) {
        r += a[i] * b[i];
    }
    return r;
}

function cross(a,b) {
    if (a.length != 3 || b.length != 3) {
        throw new Error("Cross product vectors must be 3 dimensional");
    }
    return [a[1]*b[2] - a[2]*b[1],
            a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0]];
}

function scal_mult(v, s) {
    let r = [];
    for (let i = 0;i < v.length;i++) {
        r.push(v[i] * s);
    }
    return r;
}

function vec_add(a,b) {
    if (a.length != b.length) {
        throw new Error("Trying to add vectors of different lengths");
    }
    let r = [];
    for (let i = 0;i < a.length;i++) {
        r.push(a[i] + b[i]);
    }
    return r;
}

function dist(a,b) {
    let diff = vec_add(a, scal_mult(b, -1));
    return Math.sqrt(dot(diff, diff));
}

/*
Return primitive vectors for reciprocal lattice given primitive vectors for lattice
(we factorize out the 2pi scaling for numerical simplicity)
*/
export function reciprocal_lattice(lattice) {
    let triple_product = dot(lattice[0], cross(lattice[1],lattice[2]));

    return [scal_mult(cross(lattice[1],lattice[2]), 1/triple_product),
            scal_mult(cross(lattice[2],lattice[0]), 1/triple_product),
            scal_mult(cross(lattice[0],lattice[1]), 1/triple_product)];
}


/*
Return Bragg plane given a reciprocal lattice point
*/
function bragg_plane(rl_point) {
    let d = Math.sqrt(dot(rl_point,rl_point));
    
    return {n: scal_mult(rl_point, 1/d),
            a: d / 2,
            edges: [],
            active: true};
}

/*
Find edge given by intersection of two planes, return null if no intersection
*/
function plane_intersection(plane_a, plane_b) {
    
    let tangent = cross(plane_a.n, plane_b.n);
    let tangent_length = Math.sqrt(dot(tangent, tangent));
    if (Math.abs(tangent_length) < 10**(-6)) {
        return null; //Planes never cross, or are identical
    }

    let m = [plane_a.n, plane_b.n, [0,0,0]];
    let answer = null;
    for (let i = 0;i < 3;i++) {
        m[2] = [0,0,0];
        m[2][i] = 1;
        if (Math.abs(det(m)) > 10**(-6)) { 
            answer = lusolve(m, [plane_a.a, plane_b.a, 0]);
            break;
        }
    }
    let clean_answer = [];
    for (const c of answer) {
        clean_answer.push(c[0]);
    }
    return {t: scal_mult(tangent, 1/tangent_length),
            a: clean_answer,
            vertices: [],
            active: true};
}

/*
Find vertex given by intersection of two edges, return null if no intersection
*/
function edge_intersection(edge_a, edge_b) {
    let m = [[edge_a.t[0],-edge_b.t[0]],
             [edge_a.t[1],-edge_b.t[1]],
             [edge_a.t[2],-edge_b.t[2]]];
    let v = [-edge_a.a[0] + edge_b.a[0],
             -edge_a.a[1] + edge_b.a[1],
             -edge_a.a[2] + edge_b.a[2]];
    let sub_m = [];
    let sub_v = [];
    for (let i = 0;i < 3;i++) {
        if (dot(m[i],m[i])**2 < 10**(-6)) {
            if (Math.abs(v[i]) > 10**(-6)) {
                return null;
            }
        }
        else {
            if (sub_m.length == 0) {
                sub_m.push(m[i]);
                sub_v.push(v[i]);
            }
            else {
                let test_m = sub_m.concat([m[i]]);
                if (Math.abs(det(test_m)) > 10**(-6)) {
                    sub_m.push(m[i]);
                    sub_v.push(v[i]);
                    break;
                }
            }
        }
    }
    if (sub_m.length < 2) {
        return null;
    }
    
    let potential_crossing = lusolve(sub_m, sub_v);
    a_point = vec_add(scal_mult(edge_a.t, potential_crossing[0][0]), edge_a.a);
    b_point = vec_add(scal_mult(edge_b.t, potential_crossing[1][0]), edge_b.a);
    for (let i = 0;i < a_point.length;i++) {
        if (Math.abs(a_point[i] - b_point[i]) > 10**(-6)) {
            return null; // Is not a crossing point
        }
    }
    return {v: a_point,
            active: true};
}

function check_active(sub_components) {
    let some_inactive = false;
    for (const sc of sub_components) {
        if (sc.active) {
            return true; // If any sub-components active then keep this component active
        }
        else {
            some_inactive = true;
        }
    }
    if (some_inactive) {
        return false;
    }
    return true; // If no sub-components, want to keep it
}

function polyhedron(zone_number) {
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.zone_number = zone_number;
}

/*
Prune inactive vertices, edges, and faces
Can also be used on a face or an edge
*/
function prune_polyhedron(polyhedron) {

    if ('edges' in polyhedron) {
        for (const edge of polyhedron.edges) {
            if (!(check_active(edge.vertices))) {
                edge.active = false;
            }
        }
    }
    if ('faces' in polyhedron) {
        for (const face of polyhedron.faces) {
            if (!(check_active(face.edges))) {
                face.active = false;
            }
        }
    }
    for (const comp_label of ['faces','edges','vertices']) {
        if (comp_label in polyhedron) {
            let new_array = [];
            for (const comp of polyhedron[comp_label]) {
                if (comp.active) {
                    new_array.push(comp);
                }
            }
            polyhedron[comp_label] = new_array;
        }
    }
}

function deactivate_external_vertices(polyhedron) {
    for (const vertex of polyhedron.vertices) {
        let plane_count = 0;
        for (const face of polyhedron.faces) {
            if (dot(vertex.v, face.n) > face.a + 10**(-6)) {
                plane_count += 1;
                if (plane_count >= polyhedron.zone_number) {
                    vertex.active = false;
                    break;
                }
            }
        }
    }
}

/*
Add new plane to working polyhedron construction - might leave duplicate vertices
*/
function add_plane_to_polyhedron(polyhedron, plane) {
    
    for (const face of polyhedron.faces) {
        let edge = plane_intersection(face, plane);
        if (edge !== null) {
            for (const face_edge of face.edges) {
                let vertex = edge_intersection(edge, face_edge);
                if (vertex !== null) {
                    edge.vertices.push(vertex);
                    face_edge.vertices.push(vertex);
                    polyhedron.vertices.push(vertex);
                }
            }
            face.edges.push(edge);
            plane.edges.push(edge);
            polyhedron.edges.push(edge);
        }
    }
    polyhedron.faces.push(plane);

    // Now clean up
    deactivate_external_vertices(polyhedron);
    prune_polyhedron(polyhedron);
}

function deactivate_singular_components(polyhedron) {
    for (const face of polyhedron.faces) {
        if (face.edges.length < 3) {
            face.active = false;
        }
    }
    for (const edge of polyhedron.edges) {
        if (edge.vertices.length < 2) {
            edge.active = false;
        }
    }
}

function compare_faces(face_a, face_b) {
    const n_diff = vec_add(face_a.n, scal_mult(face_b.n, -1));
    const a_diff = Math.abs(face_a.a - face_b.a)
    if (dot(n_diff, n_diff) < 10**(-6) && a_diff < 10**(-6)) {
        return true;
    }
    return false;
}

/*
Create nth brilluoin zone polyhedron given primitive lattice vectors, and faces to exclude
*/
export function create_nth_brillouin_zone(reciprocal_vectors, zone_number) {

    let poly = new polyhedron(zone_number);

    // Should have proper way of figuring out how many reciprocal lattice vectors i need to look at
    // but for now just try this fairly brute force way that should normally work
    let check_limit = 3;
    let bragg_planes = [];
    for (let i = -check_limit;i < check_limit+1;i++) {
        for (let j = -check_limit;j < check_limit+1;j++) {
            for (let k = -check_limit;k < check_limit+1;k++) {
                if (i != 0 || j != 0 || k != 0) {
                    let reciprocal_lattice_point = [0,0,0];
                    reciprocal_lattice_point = vec_add(reciprocal_lattice_point, scal_mult(reciprocal_vectors[0],i));
                    reciprocal_lattice_point = vec_add(reciprocal_lattice_point, scal_mult(reciprocal_vectors[1],j));
                    reciprocal_lattice_point = vec_add(reciprocal_lattice_point, scal_mult(reciprocal_vectors[2],k));
                    bragg_planes.push([bragg_plane(reciprocal_lattice_point), dot(reciprocal_lattice_point, reciprocal_lattice_point)]);
                }
            }
        }
    }

    // Now sort bragg planes by distance for efficient polyhedron construction,
    // and to make sure pruning works correctly.
    bragg_planes.sort(function(a,b){return a[1] - b[1]});

    // Now build polyhedron
    for (const bragg_plane of bragg_planes) {
        add_plane_to_polyhedron(poly, bragg_plane[0]);
    }

    //deactivate_duplicate_vertices(poly);
    prune_polyhedron(poly);
    for (sc of ['faces','edges']) {
        for (sce of poly[sc]) {
            prune_polyhedron(sce);
        }
    }
    deactivate_singular_components(poly);
    prune_polyhedron(poly);

    console.log(poly);
    return poly;
}

function line_segment(a, b) {
    this.a = a
    this.b = b
    this.v = vec_add(b.v, scal_mult(a.v, -1));
}

function segment_endpoint(v) {
    this.v = v;
    this.start_of_segments = [];
    this.end_of_segments = [];
}

function add_endpoint(v, endpoints) {
    for (const endpoint of endpoints) {
        if (dist(v, endpoint) < 10**(-6)) {
            return endpoint;
        }
    }
    const new_endpoint = new segment_endpoint(v);
    endpoints.push(new_endpoint);
    return new_endpoint;
}

function add_segment(a, b, existing_segments, existing_endpoints) {
    // Adds new segment, and its endpoints, ensuring uniqueness of segments and endpoints in the two lists

    const endpoints = [add_endpoint(a, existing_endpoints), add_endpoint(b, existing_endpoints)];
    
    for (const segment of endpoints[0].start_of_segments) {
        if (segment.b === endpoints[1]) {
            return;
        }
    }
    for (const segment of endpoints[0].end_of_segments) {
        if (segment.a === endpoints[1]) {
            return;
        }
    }

    const new_segment = new line_segment(endpoints[0], endpoints[1]);
    endpoints[0].start_of_segments.push(new_segment);
    endpoints[1].end_of_segments.push(new_segment);
    existing_segments.push(new_segment);
}

/*
Take edge object and add to line segment data structure
*/
function add_edge(edge, segments, endpoints) {
    const points = [];
    for (const vertex of edge.vertices) {
        const t_val = dot(edge.t, vec_add(vertex.v, scal_mult(edge.a,-1)));
        points.push({t_val: t_val, point: vertex.v});
    }
    points.sort(function(a,b) {a.t_val - b.t_val});

    for (let i = 0;i < points.length - 1;i++) {
        if (dist(points[i].point,points[i+1].point) > 10**(-6)) {
            add_segment(points[i].point, points[i+1].point, segments, endpoints);
        }
    }

}

// Find the interior angle in a polygon formed by going along a then b
function find_angle(a, b) {
    ...
}

// Create an anti-clockwise loop starting from given line segment
function create_loop(segment) {
    let current_segment = segment;
    let reversed = false;
    const loop = [segment];
    while (true) {
        current_segment.visited = true;
        let current_vertex = null;
        let v = null;
        if (reversed) {
            current_vertex = current_segment.a;
            v = scal_mult(current_segment.v, -1);
        }
        else {
            current_vertex = current_segment.b;
            v = current_segment.v
        }
        
        let best_option = null;
        let best_angle = 360;
        for (const seg of current_vertex.start_of_segments) {
            const angle = find_angle(v, seg.v);
            if (angle < best_angle) {
                best_option = {seg: seg, reversed: false};
                best_angle = angle;
            }
        }
        for (const seg of current_vertex.end_of_segments) {
            const angle = find_angle(v, scal_mult(seg.v,-1));
            if (angle < best_angle) {
                best_option = {seg: seg, reversed: true};
                best_angle = angle;
            }
        }

        if (best_option.seg === segment && (!best_option.reversed)) {
            break;
        }
        loop.push(best_option.seg);
        current_segment = best_option.seg;
        reversed = best_option.reversed;
    }

    return loop;
}

// Given a line segments data structure, find all the shapes required to fill it in.
function find_paths(segments, normal) {
    const paths = [];
    for (const segment of segments) {
        if (segment.visited === undefined) {
            paths.push(create_loop(segment, segments));
        }
    }
    return paths;
}


function point_in_loops(point, loops) {
    for (const loop of loops) {
        for (const loop_point of loop) {
            if (dist(point, loop_point) < 10**(-6)) {
                return true;
            }
        }
    }
    return false;
}

function segment_in_segments(segment, segments) {
    for (const s of segments) {
        if (dist(segment[0],s.points[0]) < 10**(-6)) {
            if (dist(segment[1],s.points[1]) < 10**(-6)) {
                return true;
            }
        }
        else if (dist(segment[0],s.points[1]) < 10**(-6)) {
            if (dist(segment[1],s.points[0]) < 10**(-6)) {
                return true;
            }
        }
    }
    return false;
}

function find_midpoint(a, b) {
    return scal_mult(vec_add(a,b),0.5);
}

function segment_in_zone(segment, polyhedron) {
    const midpoint = find_midpoint(segment[0],segment[1]);
    let plane_count = 0;
    for (const face of polyhedron.faces) {
        if (dot(midpoint, face.n) > face.a + 10**(-6)) {
            plane_count += 1;
            if (plane_count >= polyhedron.zone_number) {
                console.log(plane_count);
                return false;
            }
        }
    }
    console.log(plane_count);
    return true;
    //return plane_count == polyhedron.zone_number - 1;
}

function find_edge_traversals(face, poly) {

    let line_segments = [];
    for (const edge of face.edges) {
        const edge_segments = dedupe_edge(edge);
        for (const segment of edge_segments) {
            if (!segment_in_segments(segment, line_segments)) {
                if (segment_in_zone(segment, poly)) {
                    line_segments.push({used: false, points: segment});
                }
            }
        }
    }

    const loops = [];
    for (const segment of line_segments) {
        for (let i = 0;i < 2;i++) {
            if (!point_in_loops(segment.points[i],loops)) {
                const new_loops = find_paths(line_segments, [segment.points[i]], segment.points[i], segment.points[i]);
                for (const loop of new_loops) {
                    if (loop.length > 1) {
                        loops.push(loop);
                        //break; // Should only need to keep 1 loop per point
                    }
                }
            }
        }
    }

    return loops;
}

// Turns 3d coordinates for v into 2d coords on face
function project_to_plane_coords(face_basis, v) {
    return [dot(v, face_basis[0]),dot(v, face_basis[1])];
}

// Construct 2 orthonormal basis vectors parallel to given face
function construct_face_basis(face) {
    let face_basis = [];
    for (const b of [[1,0,0],[0,1,0],[0,0,1]]) {
        let test = cross(b, face.n);
        if (dot(test,test) > 10**(-6)) {
            face_basis.push(test);
            break;
        }
    }
    face_basis.push(cross(face.n, face_basis[0]));
    for (let i = 0;i < 2;i++) {
        face_basis[i] = scal_mult(face_basis[i],1/Math.sqrt(dot(face_basis[i],face_basis[i])));
    }
    return face_basis;
}

function face_to_threejs_mesh(face, poly, material) {
    let edge_traversals = find_edge_traversals(face, poly);

    if (edge_traversals.length === 0) {
        return null;
    }

    let face_basis = construct_face_basis(face);
    const meshes = [];
    for (const edge_traversal of edge_traversals) {
        
        let shape_points = [];
        for (let i = 0;i < edge_traversal.length;i++) {
            let coords = project_to_plane_coords(face_basis, edge_traversal[i]);
            shape_points.push(new THREE.Vector2(coords[0],coords[1]));
        }
        const shape = new THREE.Shape(shape_points);
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);

        // Shift shape back to 3D coords in right place
        let translation = scal_mult(face.n, face.a);
        let mt_elements = [];
        for (const v of [face_basis[0],face_basis[1],face.n,translation]) {
            for (let i = 0;i < v.length;i++) {
                mt_elements.push(v[i]);
            }
            mt_elements.push(0);
        }
        mt_elements[15] = 1;
        let mt = new THREE.Matrix4();
        mt.set(...mt_elements);
        mt.transpose();

        mesh.applyMatrix4(mt);

        meshes.push(mesh);
    }

    return meshes;
}

export function polyhedron_to_threejs_geometry(polyhedron, material) {
    let shapes = [];
    for (const face of polyhedron.faces) {
        let face_shapes = face_to_threejs_mesh(face, polyhedron, material);
        if (face_shapes !== null) {
            for (const shape of face_shapes) {
                shapes.push(shape);
            }
        }
    }

    return shapes;
}

export function get_fermi_sphere_radius(reciprocal_vectors, valence) {
    const zone_volume = dot(reciprocal_vectors[0], cross(reciprocal_vectors[1],reciprocal_vectors[2]));
    const sphere_volume = zone_volume * 0.5 * valence;
    const radius = Math.cbrt(sphere_volume/((4.0/3.0)*Math.PI));
    return radius;
}