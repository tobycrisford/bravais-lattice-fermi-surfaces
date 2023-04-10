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

/*
Return primitive vectors for reciprocal lattice given primitive vectors for lattice
(we factorize out the 2pi scaling for numerical simplicity)
*/
function reciprocal_lattice(lattice) {
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
        if (Math.abs(math.det(m)) > 10**(-6)) { 
            answer = math.lusolve(m, [plane_a.a, plane_b.a, 0]);
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
    let m = [[edge_a.t[0],-edge_b.t[0]],[edge_a.t[1],-edge_b.t[1]]];
    if (Math.abs(math.det(m)) < 10**(-6)) {
        return null;
    }
    let v = [-edge_a.a[0] + edge_b.a[0], -edge_a.a[1] + edge_b.a[1]];
    let potential_crossing = math.lusolve(m, v);
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

/*
Add new plane to working polyhedron construction
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
    for (const vertex of polyhedron.vertices) {
        if (dot(vertex.v, plane.n) > plane.a) {
            vertex.active = false;
        }
    }
    for (const edge of polyhedron.edges) {
        if (!(check_active(edge.vertices))) {
            edge.active = false;
        }
    }
    for (const face of polyhedron.faces) {
        if (!(check_active(face.edges))) {
            face.active = false;
        }
    }
    for (const comp_label of ['faces','edges','vertices']) {
        let new_array = [];
        for (const comp of polyhedron[comp_label]) {
            if (comp.active) {
                new_array.push(comp);
            }
        }
        polyhedron[comp_label] = new_array;
    }
}