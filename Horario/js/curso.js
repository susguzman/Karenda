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

Curso.prototype.hola = function() {
    console.log("hola");
};

//Lista
function nLista() {
    this.dato = this.ant = this.sig = undefined;
}

function Lista() {
    this.primero = this.ultimo = undefined;
    this.size = 0;
}

Lista.prototype.vacia = function() {
    if (this.ultimo === undefined) {
        return true;
    } else {
        return false;
    }
};

//Lista horario
function ListaHorario() {
    this.cursoTraslape = undefined;
    Lista.call(this);
}

ListaHorario.prototype = Object.create(Lista.prototype);
ListaHorario.prototype.constructor = ListaHorario;

//Lista horario ordenado
function ltshOrdenado() {
    Lista.call(this);
}

ltshOrdenado.prototype = Object.create(Lista.prototype);
ltshOrdenado.prototype.constructor = ltshOrdenado;

ListaHorario.prototype.addCursoHorario = function(dato) {
    if (this.find(dato[0].id) === undefined) { //Existe curso
        if (dato[1] === true) { //Definitivo
            if (this.existeTraslape(dato[0]) === false) {
                this.add(dato);
                return 0;
            } else {
                return 2;
            }
        } else {
            this.add(dato);
            return 0;
        }
    } else {
        return 1;
    }
};

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

ListaHorario.prototype.find = function(id_curso) {
    var aux = this.primero;

    while (aux !== undefined) {
        var curso = aux.dato[0];
        if (curso.id === id_curso) {
            return aux.dato;
        }
        aux = aux.sig;
    }

    return undefined;
};

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