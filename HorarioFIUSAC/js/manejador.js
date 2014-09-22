var arrCursos = [];
var ltsHorario = new ListaHorario();
var selCurso = undefined;
var askAgregar = true;

function addCurso(cod, name, seccion, edificio, salon, inicio, fin, lu, ma, mi, ju, vi, sa, dom) {
    return arrCursos.push(new Curso(arrCursos.length, cod, name, seccion, edificio, salon, inicio, fin, lu, ma, mi, ju, vi, sa, dom));
}

function getCurso(id) {
    if (arrCursos[id] !== undefined) {
        return arrCursos[id];
    } else {
        return undefined;
    }
}

//Agregar Cursos prueba
/*for (i = 1; i <= 5; i++) {
    addCurso("07" + i, "Curso" + i, "A", "T3", "105", 700, 800, false, true, false, true, false, false, false);
}
addCurso("076", "Curso6", "A", "T3", "105", 630, 730, false, true, false, true, false, false, false);
addCurso("077", "Curso7", "A", "T3", "105", 800, 900, false, true, false, true, false, false, false);
addCurso("078", "Curso8", "A", "T3", "105", 730, 800, true, false, false, false, false, false, false);
addCurso("079", "Curso9", "A", "T3", "105", 700, 800, false, false, true, false, true, false, false);*/

//Al estar listo el documento
$(document).ready(function() {

    //Agregando Cursos a Tabla Lista
    for (i = 0; i < arrCursos.length; i++) {
        var curso = arrCursos[i];
        var fila = $("<tr></tr>").attr("id", i).addClass("drag_curso");

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

    function boolToX(valor) {
        if (valor === true) {
            return "x";
        } else {
            return "-";
        }
    }

    //Ventana Horario
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
                    graficar(50);
                    $("#msgHorario").dialog("open");                    
                }}]
    }).dialogExtend({
        closable: false,
        maximizable: false,
        minimizable: true,
        titlebar: false,
        minimizeLocation: "right"
    });
    $("#horario").dialog("option", "position", {my: "right-3% bottom-5%", at: "right bottom", of: window});

    //Ventana canvas horario
    $("#msgHorario").dialog({
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
                    //graficar(50);
                    //$("#msgHorario").dialog("open");                    
                }}]
    }).dialogExtend({
        closable: true,
        titlebar: "none",
        minimizeLocation: "right"
    });

    //Ventana Mensaje
    $("#mensaje").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        height: 200,
        width: 300
    });

    //Drag Horario definitivo
    $(".drag_curso").draggable({
        /*appendTo: "body",*/
        helper: "clone",
        cursor: "move",
        opacity: 0.5,
        cursorAt: {left: 5}
    });

    //Mostrar Mensaje
    function showMsg(p_modal, titulo, texto, botones) {
        $("#msg_texto").text(texto);
        $("#mensaje").dialog("option", "modal", p_modal);
        $("#mensaje").dialog("option", "title", titulo);
        $("#mensaje").dialog("option", "buttons", botones);
        $("#mensaje").dialog("open");
    }

    //Agregar Normal
    function addNormal(curso) {
        switch (ltsHorario.addCursoHorario([curso, true])) {
            case 0:
                $("#lista_def").find(".placeholder").remove();
                $("<li></li>").text(curso.name).appendTo($("#lista_def"));
                console.log("Curso Agregado.");
                break;
            case 1:
                showMsg(true, "Error ...", "Curso ya agregado.", [{text: "Ok", click: function() {
                            $(this).dialog("close");
                        }}]);
                console.log("Ya se ha agregado el curso.");
                break;
            case 2:
                showMsg(true, "Traslape ...", "Exite un traslape", [
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
                    }]);
                console.log("Existe traslape de curso.");
                break;
            default:
                showMsg(true, "Error ...", "No se pudo agregar.", [{text: "Ok", click: function() {
                            $(this).dialog("close");
                        }}]);
                console.log("Error al agregar.");
        }
    }

    //Agregar Posible
    function addPosible(curso) {
        $("#lista_pos").find(".placeholder").remove();
        $("<li></li>").text(curso.name).appendTo($("#lista_pos"));
        ltsHorario.addCursoHorario([curso, false]);
    }

    /*Drop sobre horario*/
    $("#horario").droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
        drop: function(event, ui) {
            selCurso = getCurso(ui.draggable.attr("id"));

            if (selCurso !== undefined) {
                if (ltsHorario.find(selCurso.id) === undefined) {
                    if (askAgregar === true) {
                        showMsg(true, "Agergar Curso ...", "Como desea agergar el curso?", [
                            {
                                text: "Normal",
                                click: function() {
                                    $(this).dialog("close");
                                    addNormal(selCurso);
                                }
                            },
                            {
                                text: "Posible",
                                click: function() {
                                    $(this).dialog("close");
                                    addPosible(selCurso);
                                }
                            }]);
                    } else {
                        addNormal(selCurso);
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
    });

    $("#lista_def").sortable({
        items: "li:not(.placeholder)",
        cursor: "move",
        opacity: 0.5,
        sort: function(event, ui) {
            $(this).removeClass("ui-state-default");
        }
    });

    $("#lista_pos").sortable({
        items: "li:not(.placeholder)",
        cursor: "move",
        opacity: 0.5,
        sort: function(event, ui) {
            $(this).removeClass("ui-state-default");
        }
    });
});
