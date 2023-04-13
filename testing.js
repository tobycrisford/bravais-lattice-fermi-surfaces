function create_form() {
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
}

function test() {
    prim_vectors = [[],[],[]];
    for (let i = 0;i < 3;i++) {
        for (let j = 0;j < 3;j++) {
            prim_vectors[i].push(parseFloat(document.getElementById(i.toString() + "_" + j.toString()).value));
        }
    }
    let reciprocal_lattice_vectors = reciprocal_lattice(prim_vectors);
    let poly = create_first_brillouin_zone(reciprocal_lattice_vectors);
    document.getElementById("output").textContent = JSON.stringify(poly);
}