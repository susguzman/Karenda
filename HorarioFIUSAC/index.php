<!DOCTYPE html>
<html lang="es">
    <head>
        <title>Horario Interactivo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/style.css" rel="stylesheet" type="text/css" media="screen"/>	
        <link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
        <script src="js/lib/jquery-1.11.1.min.js" type="text/javascript"></script>
        <script src="js/lib/jquery-ui.min.js" type="text/javascript"></script>
        <script src="js/lib/jquery.dialogextend.min.js" type="text/javascript"></script>
        <script src="js/lib/kinetic-v5.1.0.min.js" type="text/javascript"></script>
        <script src="js/curso.js" type="text/javascript"></script>
        <script src="js/manejador.js" type="text/javascript"></script>
        <script src="js/graficar.js" type="text/javascript"></script>
        <style type="text/css">
            .mi_horario { 
                position: fixed;
                opacity: 0.95; 
            } 

            .mi_horario .ui-dialog-titlebar {
                padding: 0.1em 1em;
            }

            .mi_horario .ui-button-text{
                padding: 0.2em 1em;
            }

            .mi_horario .ui-widget-header{
                border-style: none;
                background: gray;
            }

            .pr{
                position: fixed;
                opacity: 1;
            }

            .pr .ui-dialog-content{
                margin: auto;
                background: white;
            }

            .ui-dialog{
                padding: 0px;                    
            }

            .ui-dialog-title {
                font-size: 1em;                
            }

            #lista_def, #lista_pos, #msgOpciones div{
                font-size: 0.9em;
                font-style: italic;
            }

            #lista_def{
                color: #1c94c4;
            }

            #lista_pos{
                color: #999;
            }

            #horario div, #msgOpciones div{
                margin: 10px 10px 15px 10px;
            }

            #horario ol, #msgOpciones input{
                margin: 5px 0px 0px 50px;
            }
            
            #lista_def img, #lista_pos img{
                margin: 0px 0px 0px 10px;
            }
        </style>
        
        <!-- Cargar lista de cursos de DB, los agrega al array general de curos  -->
        <?php
        $con = mysqli_connect("localhost", "jguzman", "falcon20", "horario");

        // Check connection
        if (mysqli_connect_errno()) {
            die("Failed to connect to MySQL" . mysqli_connect_error());
        }

        //Funcion que retorna el texto true o false 
        function toBool($dato) {
            if ($dato == "1") {
                return "true";
            } else {
                return "false";
            }
        }

        $result = mysqli_query($con, "SELECT * FROM curso");

        //Imprimir codigo java scrip para agregar cursos
        echo "<script type=\"text/javascript\">\n";
        while ($row = mysqli_fetch_array($result)) {
            echo "addCurso(\"" . $row['cod'] . "\", \"" . $row['nombre'] . "\", \"" . $row['seccion'] . "\", \"" . $row['edificio'] . "\", \"" . $row['salon'] . "\", " . $row['inicio'] . ", " . $row['final'] . ", " . toBool($row['lu']) . ", " . toBool($row['ma']) . ", " . toBool($row['mi']) . ", " . toBool($row['ju']) . ", " . toBool($row['vi']) . ", " . toBool($row['sa']) . ", " . toBool($row['dom']) . ");\n";
        }
        echo "</script>\n";

        mysqli_close($con);
        ?>
    </head>
    <body>
        <div class="conteiner">
            <div class="header">
                <div class="left"><a href="index.php.html"><img src="images/logo2.png" alt="logo" class="logo"></a></div>
                <div class="right">
                    <div class="caja-redes">
                        <a href="#" class="icon-button twitter"><i class="fa fa-twitter"></i><span></span></a>
                        <a href="#" class="icon-button facebook"><i class="fa fa-facebook"></i><span></span></a>
                        <a href="#" class="icon-button google-plus"><i class="fa fa-google-plus"></i><span></span></a>
                    </div>
                </div>
            </div>
            <div id="busqueda">
                <div class="search"> 
                    <form name="" method="GET">
                        <input type="text" class="textbox" size="30" placeholder="Busqueda">
                        <select class="combosection">
                            <option value="1">Uno</option>
                            <option value="2">Dos</option>
                            <option value="3">Tres</option>
                        </select>
                    </form>	
                </div>
            </div>
            <div class="bodycontent">	
                <table id = "tablaCursos">
                    <tr>
                        <th style="width:3%"></th>
                        <th style="width:5%">Cod</th>
                        <th>Nombre</th> 
                        <th style="width:5%">Sec</th>
                        <th style="width:6%">Edificio</th>
                        <th style="width:5%">Salon</th>
                        <th style="width:5%">Inicio</th>
                        <th style="width:5%">Fin</th>
                        <th style="width:2%">L</th>
                        <th style="width:2%">M</th>
                        <th style="width:2%">M</th>
                        <th style="width:2%">J</th>
                        <th style="width:2%">V</th>
                        <th style="width:2%">S</th>
                        <th style="width:2%">D</th>
                    </tr>                    
                </table>

                <div id="horario" class="msg">
                    <div id="blockDef">
                        <h4>Cursos Definitivos</h4>
                        <ol id = "lista_def">
                            <li class="placeholder">Agrega tus cursos</li>
                        </ol>
                    </div>
                    <div id="blockPos">
                        <h4>Cursos Posibles</h4>
                        <ol id = "lista_pos">
                            <li class="placeholder">Posibles cursos</li>
                        </ol>
                    </div>
                </div>

                <div id="msgGenerico" class="msg">
                    <p style="margin: 10px 0px;"><i id = "msg_texto"></i></p>
                </div>
                
                <div id="msgOpciones" class="msg">
                    <div>
                        <h4>Comportamiento</h4>
                        <input type="checkbox" id="ckDrag" value="Bike" checked="true">Arrastrar cursos<br>
                        <input type="checkbox" id="ckPosible" value="Car" checked="true">Agregar como posible
                    </div>
                    <div>
                        <h4>Plantilla</h4>
                        <input type="radio" id="cuadro" name="template" value="0" checked="true">Cuadricula
                        <input type="radio" id="linea" name="template" value="1">Lineal
                    </div>                    
                </div>

                <div id="msgImgHorario" class="msg">
                    <div id = "canvasHorario"></div>
                </div>
            </div>
            <div id="footer">
                Abajo XD
            </div>
        </div>
    </body>
</html>