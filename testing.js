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
    console.log(prim_vectors);
    document.getElementById("output").textContent = "reciprocal lattice: " + reciprocal_lattice(prim_vectors).toString();
}