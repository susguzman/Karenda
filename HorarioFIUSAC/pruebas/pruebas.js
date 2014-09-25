function suma(val1, val2) {
    return val1 + val2;
}

test("Prueba 1", function() {
    //instancia nueva lista horario
    var lista = new ListaHorario();
    var curso = new Curso(1, 123, "name", "seccion", "edificio", 110, 700, 900, true, false, true, false, false, false, false);
    
    //prueba lista vacia
    ok(lista.vacia(), "prueba lista vacia");

    //prueba eliminar
    ok((lista.delCursoHorario(112) == false), "prueba eliminar de la lista");
    
    //agregar curso
    ok(lista.addCursoHorario([curso,true]) == 0, "prueba agregar curso");
    
    //prueba lista no vacia, fallo a proposito
    ok((lista.vacia() == false), "prueba lista no vacia");

    //prueba busqueda
    console.log(lista.find(1));
    ok((lista.find(1)[0].id == 1), "prueba busqueda en lista");
    
    //prueba eliminar curso
    ok(lista.delCursoHorario(1), "prueba eliminar curso");
    
    //prueba lista vacia
    ok(lista.vacia(), "prueba lista vacia luego de eliminar");

    //prueba funcion suma
    ok((suma(2, 2) == 4), "prueba suma");
})