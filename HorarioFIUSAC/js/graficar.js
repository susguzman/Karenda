var dias = ["Hora", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
var diasl = ["L", "M", "M", "J", "V", "S", "D"];
var colores = ["Blue", "Red", "Green", "Orange", "Purple", "Yellow", "Gray", "Olive", "Aqua", "PowderBlue", "Brown", "White", "Crimson", "Chocolate", "Tan", "Teal"];

//Funcion que grafica el horario
function graficar(template) {
    if(template === 0){
        template0();
    }else{
        template1();
    }
}

function template0(){   //Cuadricula
    var orderHorario = crearLtsOrdenado();
    var filas = orderHorario.size;
    var filWidth = 60;
    var margen = 50;

    var escenario = new Kinetic.Stage({
        width: 1000,
        height: 40 + filas * filWidth + margen * 2,
        container: 'canvasHorario'
    });

    var malla = new Kinetic.Layer({
        x: margen,
        y: margen,
        width: escenario.getWidth() - margen * 2,
        height: escenario.getHeight() - margen * 2
                /*draggable: true*/
    });

    var colWidth = malla.getWidth() / 8;

    //Fondo
    var rect = new Kinetic.Rect({
        width: malla.getWidth(),
        height: malla.getHeight(),
        fill: "#E6E6E6",
        cornerRadius: 5,
        shadowColor: 'black',
        shadowBlur: 15,
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowOpacity: 0.4 //strokeWidth: 1, opacity: 0.2, stroke: "#000",
    });
    malla.add(rect);

    //Lineas horizontales
    for (i = 0; i < filas; i++) {
        if (i === 0) {
            var line = new Kinetic.Line({
                points: [0, 40, malla.getWidth(), 40],
                stroke: 'black',
                strokeWidth: 1.5,
                lineCap: 'miter',
                lineJoin: 'round'
            });
            malla.add(line);
        } else {
            var line = new Kinetic.Line({
                points: [0, 40 + filWidth * i, malla.getWidth(), 40 + filWidth * i],
                stroke: 'gray',
                strokeWidth: 1,
                lineCap: 'miter',
                lineJoin: 'round'
                        //dash: [10, 5]
            });
            malla.add(line);
        }
    }

    //Lineas verticales
    for (i = 1; i <= 7; i++) {
        var line = new Kinetic.Line({
            x: 0,
            y: 0,
            points: [colWidth * i, 0, colWidth * i, malla.getHeight()],
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'miter',
            lineJoin: 'round',
            dash: [10, 5, 2, 5]
        });
        malla.add(line);
    }

    //Textos Dias
    for (i = 0; i < dias.length; i++) {
        var texto = new Kinetic.Text({
            x: (colWidth * (i + 1)) - (colWidth / 2),
            y: 10,
            text: dias[i],
            fontSize: 20,
            fontFamily: 'Calibri',
            strokeWidth: 5,
            fill: 'green'
        });
        texto.offsetX(texto.width() / 2);
        malla.add(texto);
    }

    //Textos Horas y Cursos
    var aux = orderHorario.primero;
    var i = 1;
    var m = 0;
    while (aux !== undefined) {
        var h1 = aux.dato[0].toString();
        var h2 = aux.dato[1].toString();
        h1 = h1.substr(0, h1.length - 2) + ":" + h1.substr(h1.length - 2, h1.length);
        h2 = h2.substr(0, h2.length - 2) + ":" + h2.substr(h2.length - 2, h2.length);

        var texto = new Kinetic.Text({
            x: colWidth / 2,
            y: 40 + filWidth * i - (filWidth / 2),
            text: h1 + " - " + h2,
            fontSize: 16,
            fontFamily: 'Calibri',
            strokeWidth: 5,
            fill: 'black'
        });
        texto.offsetX(texto.width() / 2);
        texto.offsetY(texto.height() / 2);
        malla.add(texto);

        //Texto Cursos
        for (j = 0; j < aux.dato[2].length; j++) {
            var cursos = aux.dato[2];
            var curso = cursos[j];            
            m++;
            
            for (k = 0; k < diasR.length; k++) {
                if (curso[diasR[k]] === true) {
                    //Fondo
                    var rect = new Kinetic.Rect({
                        x : colWidth * (k + 1) + 5,
                        y : 40 + filWidth * (i - 1) + 5,
                        width: colWidth - 10,
                        height: filWidth - 10,
                        fill: colores[m],
                        cornerRadius: 1,
                        opacity: 0.7
                    });
                    malla.add(rect);
                    
                    //Texto
                    var texto = new Kinetic.Text({
                        x: (colWidth * (k + 2)) - (colWidth / 2),
                        y: 40 + filWidth * i - (filWidth / 2),
                        text: curso.name.substr(0,5),
                        fontSize: 16,
                        fontFamily: 'Calibri',
                        strokeWidth: 5,
                        fill: 'black'
                    });
                    texto.offsetX(texto.width() / 2);
                    texto.offsetY(texto.height() / 2);
                    malla.add(texto);                  
                }
            }
        }

        aux = aux.sig;
        i++;
    }

    escenario.add(malla);
    escenario.draw();
    $("#canvasHorario canvas").css("position", "absolute");
}

function template1(){   //Lineal
    var orderHorario = crearLtsOrdenado();
    var filas = ltsHorario.size;
    var titulo = 40;
    var filHeight = 50;
    var margen = 50;

    var escenario = new Kinetic.Stage({
        width: 1000,
        height: titulo + filas * filHeight + margen * 2,
        container: 'canvasHorario'
    });

    var malla = new Kinetic.Layer({
        x: margen,
        y: margen,
        width: escenario.getWidth() - margen * 2,
        height: escenario.getHeight() - margen * 2
                /*draggable: true*/
    });
    
    //Fondo
    var rect = new Kinetic.Rect({
        width: malla.getWidth(),
        height: malla.getHeight(),
        fill: "#E6E6E6",
        cornerRadius: 5,
        shadowColor: 'black',
        shadowBlur: 15,
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowOpacity: 0.4 //strokeWidth: 1, opacity: 0.2, stroke: "#000",
    });
    malla.add(rect);
    
    //Lineas horizontales
    for (var i = 0; i < filas; i++) {
        if (i === 0) {
            var line = new Kinetic.Line({
                points: [0, titulo, malla.getWidth(), titulo],
                stroke: 'black',
                strokeWidth: 1.5,
                lineCap: 'miter',
                lineJoin: 'round'
            });
            malla.add(line);
        } else {
            var line = new Kinetic.Line({
                points: [0, titulo + filHeight * i, malla.getWidth(), titulo + filHeight * i],
                stroke: 'gray',
                strokeWidth: 1,
                lineCap: 'miter',
                lineJoin: 'round'
                        //dash: [10, 5]
            });
            malla.add(line);
        }
    }

    //Lineas verticales
    var puntos;
    var name = 500;
    var hora = 100;
    var colWidth = (malla.getWidth() - name - hora) / 7;
    for (var i = 0; i < 8; i++) {
        if(i === 0){
            puntos = [hora, 0, hora, malla.getHeight()];
        }else if(i === 1){
            puntos = [hora + name, 0, hora + name, malla.getHeight()];
        }else{
            puntos = [hora + name + colWidth * (i - 1), 0, hora + name + colWidth * (i - 1), malla.getHeight()];
        }
        
        var line = new Kinetic.Line({
            x: 0,
            y: 0,
            points: puntos,
            stroke: 'gray',
            strokeWidth: 1,
            lineCap: 'miter',
            lineJoin: 'round',
            dash: [10, 5, 2, 5]
        });
        malla.add(line);
    }

    //Textos Dias
    var text;
    var posx;
    for (i = 0; i < diasl.length + 2; i++) {
        if(i === 0){
            text = "Hora"; 
            posx = hora / 2;
        }else if(i === 1){
            text = "Curso"; 
            posx = hora + name / 2;
        }else{
            text = diasl[i-2];
            posx = hora + name + (colWidth * (i - 1) - (colWidth /2 ));
        }
        var texto = new Kinetic.Text({
            x: posx,
            y: 10,
            text: text,
            fontSize: 20,
            fontFamily: 'Calibri',
            strokeWidth: 5,
            fill: 'green'
        });
        texto.offsetX(texto.width() / 2);
        malla.add(texto);
    }
    
    //Textos Horas y Cursos
    var aux = orderHorario.primero;
    var i = 1;
    //var m = 0;
    while (aux !== undefined) {
        //Recorriendo cursos
        for (var j = 0; j < aux.dato[2].length; j++) {
            var cursos = aux.dato[2];   //Cursos en ese horario
            var curso = cursos[j];      //Curso            
            //m++;
            
            //Texto horario
            var h1 = aux.dato[0].toString();    //hora de inicio
            var h2 = aux.dato[1].toString();    //hora de fin
            h1 = h1.substr(0, h1.length - 2) + ":" + h1.substr(h1.length - 2, h1.length);
            h2 = h2.substr(0, h2.length - 2) + ":" + h2.substr(h2.length - 2, h2.length);

            var texto = new Kinetic.Text({
                x: hora / 2,
                y: titulo + filHeight * i - (filHeight / 2),
                text: h1 + " - " + h2,
                fontSize: 16,
                fontFamily: 'Calibri',
                strokeWidth: 5,
                fill: 'black'
            });
            texto.offsetX(texto.width() / 2);
            texto.offsetY(texto.height() / 2);
            malla.add(texto);
            
            //Texto Curso
            var texto2 = new Kinetic.Text({
                x: hora + 20 /*margen*/,
                y: titulo + filHeight * i - (filHeight / 2),
                text: curso.name,
                fontSize: 16,
                fontFamily: 'Calibri',
                strokeWidth: 5,
                fill: 'black'
            });
            texto2.offsetY(texto2.height() / 2);
            malla.add(texto2);            
            
            //Dias en los que se inparte
            for (var k = 0; k < diasR.length; k++) {
                if (curso[diasR[k]] === true) {
                    text = "X";
                }else{
                    text = "-";
                }
                
                //Fondo
                /*var rect = new Kinetic.Rect({
                    x : colWidth * (k + 1) + 5,
                    y : 40 + filWidth * (i - 1) + 5,
                    width: colWidth - 10,
                    height: filWidth - 10,
                    fill: colores[m],
                    cornerRadius: 1,
                    opacity: 0.7
                });
                malla.add(rect);*/

                //Texto
                var texto = new Kinetic.Text({
                    x: hora + name + (colWidth * (k + 1)) - (colWidth / 2),
                    y: titulo + filHeight * i - (filHeight / 2),
                    text: text,
                    fontSize: 16,
                    fontFamily: 'Calibri',
                    strokeWidth: 5,
                    fill: 'black'
                });
                texto.offsetX(texto.width() / 2);
                texto.offsetY(texto.height() / 2);
                malla.add(texto);
            }
        }

        aux = aux.sig;
        i++;
    }
    
    escenario.add(malla);
    escenario.draw();
    $("#canvasHorario canvas").css("position", "absolute");
}

//Crea una lista de cursos hordenados por horario
function crearLtsOrdenado() {
    var l = new ltshOrdenado();

    var aux = ltsHorario.primero;
    while (aux !== undefined) {
        if (aux.dato[1] === true) {
            l.agregar(aux.dato[0]);
        }
        aux = aux.sig;
    }

    return l;
}