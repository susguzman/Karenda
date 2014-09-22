<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>ParserFIUSAC</title>
    </head>
    <body>
        <?php
        //Variable que contiene el html de la pagina
        //$text_html = file_get_contents('https://portal.ingenieria.usac.edu.gt/index.php/estudiante/horarios/segundo-semestre/horariocursos');
        $text_html = file_get_contents("Files/HorarioCursos2S2014.htm");
        //Contadores, uno global, y otro para verificar los inserts
        $conteoGlobal = $conteoInsert = 0;
        //Variables necesarias para crear los INSERT
        $codCurso = $auxCodCurso = $iniCurso = $finCurso = 0;
        $lunes = $martes = $miercoles = $jueves = $viernes = $sabado = 0;
        $nomCurso = $seccion = $edificio = $salon = $catedratico = "";
        $inserts = array();

        //Escribir archivo
        $html = fopen("tmp/newfile.html", "w+") or die("Unable to open file!");
        fwrite($html, $text_html);
        fseek($html, 0);

        //Lectura del archivo hasta un EOF
        while (!feof($html)) {
            $cadena = fgets($html); //Lectura linea por linea
            
            htmlspecialchars_decode($cadena); //decodificar caracteres especiales de html
            trim($cadena);  //trim a las cadenas
            //Delimitadores
            $delimitador1 = "<td class='filaPar'><font color='#000000'>";
            $delimitador2 = "<td class='filaImpar'><font color='#000000'>";
            $contiene = strpos($cadena, $delimitador1); //verificar si contiene un delimitador
            $contiene2 = strpos($cadena, $delimitador2); //verificar si contiene un delimitador
            if ($contiene > 0 || $contiene2 > 0) { //Si contiene un delimintador
                if ($contiene > 0) {
                    $partes = explode($delimitador1, $cadena); //Split segun delimitador
                } else {
                    $partes = explode($delimitador1, $cadena); //Split segun delimitador
                }
                if (count($partes) > 1) { //
                    $divParte = explode("<", $partes[1]);
                    switch ($conteoInsert) {
                        case 0: $codCurso = trim($divParte[0]);
                            break;
                        case 1: $nomCurso = trim($divParte[0]);
                            if (strpos($cadena, "<font color='#FF0000'>")) {
                                $codCurso = trim($divParte[0]);
                                $conteoInsert = 0;
                            }
                            if (strpos($cadena, "<font color='#0000FF'>")) {
                                $codCurso = trim($divParte[0]);
                                $conteoInsert = 0;
                            }//#9400D3 color morado
                            if (strpos($cadena, "<font color='#9400D3'>")) {
                                $codCurso = trim($divParte[0]);
                                $conteoInsert = 0;
                            }
                            break;
                        case 2: $seccion = trim($divParte[0]);
                            break;
                        case 3: $edificio = trim($divParte[0]);
                            break;
                        case 4: $salon = trim($divParte[0]);
                            break;
                        case 5: $iniCurso = trim($divParte[0]);
                            break;
                        case 6: $finCurso = trim($divParte[0]);
                            break;
                        case 7: $lunes = trim($divParte[0]);
                            break;
                        case 8: $martes = trim($divParte[0]);
                            break;
                        case 9: $miercoles = trim($divParte[0]);
                            break;
                        case 10: $jueves = trim($divParte[0]);
                            break;
                        case 11: $viernes = trim($divParte[0]);
                            break;
                        case 12: $sabado = trim($divParte[0]);
                            break;
                        case 13: //Dia Domingo
                            break;
                        case 14:
                            $conteoInsert = 0;
                            if (strpos($partes[0], $delimitador2)) {
                                $divParte2 = explode($delimitador2, $partes[0]);
                                $divParte3 = explode("<", $divParte2[1]);
                                $catedratico = trim($divParte3[0]); //catedratico info
                                //Se cuenta con info necesaria para hacer el INSERT
                                addInsert($codCurso, $nomCurso, $seccion, $edificio, $salon, $iniCurso, $finCurso, $lunes, $martes, $miercoles, $jueves, $viernes, $sabado, "-", $catedratico);

                                //Guardando dato del Cod Curso
                                $codCurso = trim($divParte[0]);
                            } else {
                                //echo $divParte;
                                $catedratico = trim($divParte[0]);
                                $divParte2 = explode(">", $divParte[6]);
                                $auxCodCurso = trim($divParte2[1]);
                                //Se cuenta con info necesaria para hacer el INSERT
                                addInsert($codCurso, $nomCurso, $seccion, $edificio, $salon, $iniCurso, $finCurso, $lunes, $martes, $miercoles, $jueves, $viernes, $sabado, "-", $catedratico);
                            }
                            break;
                        default:
                            echo "ERROR == " . $conteoInsert . "<p>";
                            break;
                    }
                } else {
                    //La informacion viene en la parte 0, por así llamarlo
                    $divParte = explode($delimitador2, $partes[0]);
                    $divParte2 = explode("<", $divParte[1]);
                    switch ($conteoInsert) {
                        case 0: $codCurso = trim($divParte2[0]);
                            break;
                        case 1: $nomCurso = trim($divParte2[0]);
                            if (strpos($cadena, "<font color='#0000FF'>")) {
                                $codCurso = trim($divParte2[0]);
                                $conteoInsert = 0;
                            }
                            if (strpos($cadena, "<font color='#FF0000'>")) {
                                $codCurso = trim($divParte2[0]);
                                $conteoInsert = 0;
                            }//9400D3
                            if (strpos($cadena, "<font color='#9400D3'>")) {
                                $codCurso = trim($divParte2[0]);
                                $conteoInsert = 0;
                            }
                            break;
                        case 2: $seccion = trim($divParte2[0]);
                            break;
                        case 3: $edificio = trim($divParte2[0]);
                            break;
                        case 4: $salon = trim($divParte2[0]);
                            break;
                        case 5: $iniCurso = trim($divParte2[0]);
                            break;
                        case 6: $finCurso = trim($divParte2[0]);
                            break;
                        case 7: $lunes = trim($divParte2[0]);
                            break;
                        case 8: $martes = trim($divParte2[0]);
                            break;
                        case 9: $miercoles = trim($divParte2[0]);
                            break;
                        case 10: $jueves = trim($divParte2[0]);
                            break;
                        case 11: $viernes = trim($divParte2[0]);
                            break;
                        case 12: $sabado = trim($divParte2[0]);
                            break;
                        case 13: //Dia Domingo
                            break;
                        case 14: $catedratico = trim($divParte2[0]);
                            $conteoInsert = 0;
                            addInsert($codCurso, $nomCurso, $seccion, $edificio, $salon, $iniCurso, $finCurso, $lunes, $martes, $miercoles, $jueves, $viernes, $sabado, "-", $catedratico);
                            break;
                        default:
                            echo "ERROR == " . $conteoInsert . "<p>";
                            break;
                    }
                }
                $conteoInsert++; //con 14 se realiza el insert
                $conteoGlobal++; //Conteo de filas encontradas */
            }
        }

        //Cerrar archivo
        fclose($html);
        insertDB();

        echo "Proceso finalizado con exito. Insertados: " . $conteoGlobal;

        //Convertir el valor de un dia en booleano
        function convertirDia($dia) {
            if ($dia == 'X' || $dia == 'x') {
                return 1;
            } else {
                return 0;
            }
        }

        //Remover dos puntos de texto
        function rmPuntos($dato) {
            return str_replace(":", "", $dato);
        }

        //Inserta instruciones insert al array 
        function addInsert($codCur, $nomCur, $sec, $edi, $sal, $ini, $fin, $l, $m, $mi, $j, $v, $s, $d, $cate) {
            $sql = "INSERT INTO curso VALUES (NULL, '" . $codCur . "', '" . $nomCur . "', '" . $sec
                    . "', '" . $edi . "', '" . $sal . "', '" . rmPuntos($ini) . "', '" . rmPuntos($fin)
                    . "', '" . convertirDia($l) . "', '" . convertirDia($m) . "', '" . convertirDia($mi) . "', '" . convertirDia($j) . "', '" . convertirDia($v) . "', '" . convertirDia($s)
                    . "', '" . convertirDia($d) . "', '" . $cate . "');";

            global $inserts;
            array_push($inserts, $sql);
            //echo $sql;
        }

        function insertDB() {
            $con = mysqli_connect("localhost", "jguzman", "falcon20", "horario");

            // Check connection
            if (mysqli_connect_errno()) {
                die("Failed to connect to MySQL" . mysqli_connect_error());
            }

            global $inserts;
            $cantidad = count($inserts);
            for ($i = 0; $i < $cantidad; $i++) {
                echo $inserts[$i];
                if (!mysqli_query($con, $inserts[$i])) {
                    die('Error: ' . mysqli_error($con));
                }
            }
            
            mysqli_close($con);
        }
        ?>
    </body>
</html>
