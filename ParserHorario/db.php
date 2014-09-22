<?php

$con = mysqli_connect("localhost", "jguzman", "falcon20", "horario");
// Check connection
if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL" . mysqli_connect_error());
}else{
    echo "Conectado a BD";
} 

mysqli_close($con);