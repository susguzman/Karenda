/*
 * Archivo que contiene las estructuras para guardar los cursos
*/

var diasR = ["lu", "ma", "mi", "ju", "vi", "sa", "dom"];

//Objeto curso
function Curso(id, cod, name, seccion, edificio, salon, inicio, fin, lu, ma, mi, ju, vi, sa, dom) {
    this.id = id;
    this.cod = cod;
    this.name = name;
    this.seccion = seccion;
    this.edificio = edificio;
    this.salon = salon;
    this.inicio = inicio;
    this.fin = fin;
    this.lu = lu;
    this.ma = ma;
    this.mi = mi;
    this.ju = ju;
    this.vi = vi;
    this.sa = sa;
    this.dom = dom;
}

//Objeto nodo Lista
function nLista() {
    this.dato = this.ant = this.sig = undefined;
}

//Obejeto Lista
function Lista() {
    this.primero = this.ultimo = undefined;
    this.size = 0;
}

//Objeto Lista horario. Una lista que guarda un array, en la posicion 0 es curso, 1 booleano
function ListaHorario() {
    this.cursoTraslape = undefined;
    Lista.call(this);
}

//Constructores de Lista horario
ListaHorario.prototype = Object.create(Lista.prototype);
ListaHorario.prototype.constructor = ListaHorario;

//Objeto Lista horario ordenado. Es una lista ordenada por horario
function ltshOrdenado() {
    Lista.call(this);
}

//Constructores de Lista horario ordenado
ltshOrdenado.prototype = Object.create(Lista.prototype);
ltshOrdenado.prototype.constructor = ltshOrdenado;

/********************** Funciones de Objetos creados **********************/

//Funcion de Lista. Indica si la lista esta vacia
Lista.prototype.vacia = function() {
    if (this.ultimo === undefined){
        return true;
    } else {
        return false;
    }
};

//Funcion de Lista Horario. Agrega curso verificando si es posible agregar
ListaHorario.prototype.addCursoHorario = function(dato) {
    if (this.find(dato[0].id) === undefined) { //Existe curso
        if (dato[1] === true) { //Definitivo
            if (this.existeTraslape(dato[0]) === false) {
                this.add(dato);
                return 0;   //Curso agregado
            } else {
                return 2;   //Curso que genera traslape
            }
        } else {
            this.add(dato);
            return 0;       //Curso agregado
        }
    } else {
        return 1;           //Ya se agregado el curso
    }
};

//Funcion de Lista Horario. Borra un nodo de la lista por el idCurso
ListaHorario.prototype.delCursoHorario = function(idCurso) {    
    var aux = this.primero;

    while (aux !== undefined) {
        var curso = aux.dato[0];
        if (curso.id === idCurso) {
            break;
        }
        aux = aux.sig;
    }
    
    if(aux === this.primero && aux === this.ultimo){
        this.primero = this.ultimo = undefined;
    }else if(aux === this.primero){
        this.primero = this.primero.sig;
        this.primero.ant = undefined;
    }else if(aux === this.ultimo){
        this.ultimo = this.ultimo.ant;
        this.ultimo.sig = undefined;
    }else if(aux !== undefined){
        aux.sig.ant = aux.ant;
        aux.ant.sig = aux.sig;
    }
};

//Funcion de Lista Horario. Agrega un nodo al final de la lista
ListaHorario.prototype.add = function(dato) {
    var nuevo = new nLista();
    nuevo.dato = dato;

    if (this.vacia() === true) {
        this.primero = this.ultimo = nuevo;
        nuevo.sig = nuevo.ant = undefined;
    } else {
        this.ultimo.sig = nuevo;
        nuevo.ant = this.ultimo;
        nuevo.sig = undefined;
        this.ultimo = nuevo;
    }
    this.size++;
};

//Funcion de Lista Horario. Encuentra un curso por idcurso
ListaHorario.prototype.find = function(idCurso) {
    var aux = this.primero;

    while (aux !== undefined) {
        var curso = aux.dato[0];
        if (curso.id === idCurso) {
            return aux.dato;
        }
        aux = aux.sig;
    }

    return undefined;
};

//Funcion de Lista Horario. Verifica si el curso ha agregar genera traslape con los cursos agredos
ListaHorario.prototype.existeTraslape = function(curso) {
    var aux = this.primero;

    while (aux !== undefined) {
        var t1 = aux.dato;

        if (t1[1] === true) { //Curso definitivo
            var curso2 = t1[0];

            for (i = 0; i < diasR.length; i++) {
                if (curso2[diasR[i]] === true && curso[diasR[i]] === true) {
                    if ((curso.inicio > curso2.inicio && curso.inicio < curso2.fin) || (curso.fin > curso2.inicio && curso.fin < curso2.fin) || (curso.inicio === curso2.inicio && curso.fin === curso2.fin)) {
                        this.cursoTraslape = curso2;
                        return true;
                    }
                }
            }
        }
        aux = aux.sig;
    }
    return false;
};

//Funcion de Lista Horario Ordenado. Agregar curso ordenado por horario
ltshOrdenado.prototype.agregar = function(curso) {
    if (this.vacia() === true) {
        var nuevo = new nLista();
        nuevo.dato = [curso.inicio, curso.fin, [curso]];

        this.primero = this.ultimo = nuevo;
        nuevo.sig = nuevo.ant = undefined;
        this.size++;

    } else {
        var aux = this.primero;

        while (aux !== undefined) {
            if (curso.inicio < aux.dato[0]) {
                break;
            } else if (curso.inicio > aux.dato[0]) {
                aux = aux.sig;
            } else { //son iguales
                if (curso.fin < aux.dato[1]) {
                    break;
                } else if (curso.fin > aux.dato[1]) {
                    aux = aux.sig;
                } else {
                    aux.dato[2].push(curso); //En este nodo
                    return;
                }
            }
        }

        var nuevo = new nLista();
        nuevo.dato = [curso.inicio, curso.fin, [curso]];
        this.size++;
        
        if (aux === this.primero) {             //Agregar de primero
            this.primero.ant = nuevo;
            nuevo.sig = this.primero;
            nuevo.ant = undefined;
            this.primero = nuevo;

        } else if (aux === undefined) {    //Agregar de ultimo
            this.ultimo.sig = nuevo;
            nuevo.ant = this.ultimo;
            nuevo.sig = undefined;
            this.ultimo = nuevo;

        } else {                            //Agregar en medio
            aux.ant.sig = nuevo;
            nuevo.ant = aux.ant;
            nuevo.sig = aux;
            aux.ant = nuevo;
        }
    }
};