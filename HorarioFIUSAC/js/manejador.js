/* 
 * Archivo donde se maneja el DOM 
 */

var arrCursos = [];
var ltsHorario = new ListaHorario();
var selCurso = undefined;
var askAgregar = true;

//Funcion que agrega un curso al array general de cursos
function addCurso(cod, name, seccion, edificio, salon, inicio, fin, lu, ma, mi, ju, vi, sa, dom) {
    return arrCursos.push(new Curso(arrCursos.length, cod, name, seccion, edificio, salon, inicio, fin, lu, ma, mi, ju, vi, sa, dom));
}

//Funcion que obtiene un curso por el ID del array general de cursos
function getCurso(id) {
    if (arrCursos[id] !== undefined) {
        return arrCursos[id];
    } else {
        return undefined;
    }
}

//Retorna una X o - dependiento del valor booleano
function boolToX(valor) {
    if (valor === true) {
        return "x";
    } else {
        return "-";
    }
}

//Muestra el Mensaje Generico Creado
function showMsg(p_modal, titulo, texto, botones) {
    $("#msg_texto").text(texto);
    $("#msgGenerico").dialog("option", "modal", p_modal);
    $("#msgGenerico").dialog("option", "title", titulo);
    $("#msgGenerico").dialog("option", "buttons", botones);
    $("#msgGenerico").dialog("open");
}

//Agrega un curso como Normal
function addNormal(curso) {
    switch (ltsHorario.addCursoHorario([curso, true])) {
        case 0: //Agregado Correctamente
            //Agregar posilidad de eliminar curso de la lista
            var del = $("<a></a>").click(
                    function(event) {
                        var idCurso = parseInt($(this).parent().attr("id").replace("lc", ""));
                        ltsHorario.delCursoHorario(idCurso);
                        $(this).parent().remove();
                    }).attr("href", "#");

            $("<img>").attr("src", "images/delete.png").attr("width", "13").attr("height", "13").appendTo(del);
            del.appendTo($("<li></li>").text(curso.name + " ").attr("id", "lc" + curso.id).appendTo($("#lista_def")));

            $("#lista_def").find(".placeholder").remove();
            console.log("Curso Agregado.");
            break;
        case 1: //Curso ya agregado
            showMsg(true, "Error ...", "Curso ya agregado.", [{text: "Ok", click: function() {
                        $(this).dialog("close");
                    }}]);
            console.log("Ya se ha agregado el curso.");
            break;
        case 2: //Curso con traslape
            var botones = undefined;
            if (askAgregar === true) {
                botones = [
                    {
                        text: "Ok",
                        click: function() {
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "como Posible",
                        click: function() {
                            $(this).dialog("close");
                            addPosible(curso);
                        }
                    }];
            } else {
                botones = [
                    {
                        text: "Ok",
                        click: function() {
                            $(this).dialog("close");
                        }
                    }];
            }

            showMsg(true, "Traslape ...", "Exite un traslape", botones);
            console.log("Existe traslape de curso.");
            break;
        default: //No se pudo agregar el curso
            showMsg(true, "Error ...", "No se pudo agregar.", [{text: "Ok", click: function() {
                        $(this).dialog("close");
                    }}]);
            console.log("Error al agregar.");
    }
}

//Agregar un curso como Posible
function addPosible(curso) {
    $("#lista_pos").find(".placeholder").remove();
    $("<li></li>").text(curso.name).appendTo($("#lista_pos"));
    ltsHorario.addCursoHorario([curso, false]);
}

//Ventana de Agregar curso
function addCursoUI(curso) {
    selCurso = curso;
    if (curso !== undefined) {
        if (ltsHorario.find(curso.id) === undefined) {
            if (askAgregar === true) {
                showMsg(true, "Agergar Curso ...", "Como desea agergar el curso?", [
                    {
                        text: "Normal",
                        click: function() {
                            $(this).dialog("close");
                            addNormal(curso);
                        }
                    },
                    {
                        text: "Posible",
                        click: function() {
                            $(this).dialog("close");
                            addPosible(curso);
                        }
                    }]);
            } else {
                addNormal(curso);
            }
        } else {
            showMsg(true, "Error ...", "Curso ya agregado.", [{text: "Ok", click: function() {
                        $(this).dialog("close");
                    }}]);
        }
    } else {
        showMsg(true, "Error ...", "No encontrado.", [{text: "Ok", click: function() {
                    $(this).dialog("close");
                }}]);
    }
}

function dragCursos(val){
    if(val === true){
        $(".drag_curso").draggable( 'disable' );
    }else{
        $(".drag_curso").draggable( 'enable' );
    }
}

function cursosPosibles(val){
    askAgregar = val;
    if(val === true){
        $("#blockPos").show();
    }else{
        $("#blockPos").hide();
    }
}

function getTemplate(){
    return parseInt($("input[name=template]:checked").val());
}

//Funcion que comienza al estar listo el documento
$(document).ready(function() {

    //Recorre el array de cursos; agrega los cursos al html
    for (i = 0; i < arrCursos.length; i++) {
        var curso = arrCursos[i];
        var fila = $("<tr></tr>").attr("id", i).addClass("drag_curso");

        var add = $("<a></a>").click(
                function(event) {
                    addCursoUI(getCurso(parseInt($(this).parent().parent().attr("id"))));
                    console.log(curso);
                }).attr("href", "#").text("A");

        //$("<img>").attr("src", "images/delete.png").attr("width", "13").attr("height", "13").appendTo(add);

        add.appendTo($("<td></td>").appendTo($(fila)));
        $("<td></td>").text(curso.cod).appendTo($(fila));
        $("<td></td>").text(curso.name).appendTo($(fila));
        $("<td></td>").text(curso.seccion).appendTo($(fila));
        $("<td></td>").text(curso.edificio).appendTo($(fila));
        $("<td></td>").text(curso.salon).appendTo($(fila));
        $("<td></td>").text(curso.inicio).appendTo($(fila));
        $("<td></td>").text(curso.fin).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.lu)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.ma)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.mi)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.ju)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.vi)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.sa)).appendTo($(fila));
        $("<td></td>").text(boolToX(curso.dom)).appendTo($(fila));
        fila.appendTo($("#tablaCursos"));
    }

    //Para todas las ventanas
    //$(".msg").param();

    //Ventana horario. jqueryui
    $("#horario").dialog({
        autoOpen: true,
        draggable: true,
        title: "Mi Horario :)",
        minHeight: 40,
        minWidth: 5,
        height: 300,
        width: 600,
        dialogClass: "mi_horario",
        buttons: [{
                text: "Ver",
                click: function() {                    
                    //graficar(50);
                    graficar(getTemplate());
                    $("#msgImgHorario").dialog("open");
                }}, {
                text: "Opciones",
                click: function() {
                    $("#msgOpciones").dialog("open");
                }}]
    }).dialogExtend({
        closable: false,
        maximizable: false,
        minimizable: true,
        titlebar: false,
        minimizeLocation: "right"
    });
    $("#horario").dialog("option", "position", {my: "right-3% bottom-5%", at: "right bottom", of: window});

    //Ventana canvas horario. Vista malla. jqueryui
    $("#msgImgHorario").dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        height: "auto",
        width: "auto",
        dialogClass: "pr",
        buttons: [{
                text: "Descargar",
                click: function() {
                    window.open($(".kineticjs-content canvas")[0].toDataURL());
                }}]
    }).dialogExtend({
        closable: true,
        titlebar: "none",
        minimizeLocation: "right"
    });

    //Ventana Generica de un mensaje Mensaje. jquetyui
    $("#msgGenerico").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        height: 200,
        width: 300,
        dialogClass: "mi_horario"
    });
    
    //Ventana Opciones. jquetyui
    $("#msgOpciones").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        modal: true,
        height: 200,
        width: 400,
        title: "Opciones",
        dialogClass: "mi_horario"
    });
    
    //Activar checkbox
    $("#ckDrag").click(function() {
        if($("#ckPosible").is(':checked')) {  
            dragCursos(true);
        } else {  
            dragCursos(false);
        }
    });
    
    $("#ckPosible").click(function() {
        if($("#ckPosible").is(':checked')) {  
            cursosPosibles(true);
        } else {  
            cursosPosibles(false);
        }
    });

    //Activa Drag a la clase drag_cruso (elmentos de tabla) 
    $(".drag_curso").draggable({
        /*appendTo: "body",*/
        helper: "clone",
        cursor: "move",
        //opacity: 0.5,
        cursorAt: {left: 5}
    });

    //Activa Drop para soltar cursos
    $("#horario").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
        drop: function(event, ui) {
            addCursoUI(getCurso(ui.draggable.attr("id"))); //obtiene curso por id del array general
        }
    });

    //Activa posiblidad de mover los cursos agregados
    $("#lista_def").sortable({
        items: "li:not(.placeholder)",
        cursor: "move",
        opacity: 0.5,
        sort: function(event, ui) {
            $(this).removeClass("ui-state-default");
        }
    });

    //Activa posiblidad de mover los cursos agregados posibles 
    $("#lista_pos").sortable({
        items: "li:not(.placeholder)",
        cursor: "move",
        opacity: 0.5,
        sort: function(event, ui) {
            $(this).removeClass("ui-state-default");
        }
    });
});
