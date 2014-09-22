<?php

$con = mysqli_connect("localhost", "jguzman", "falcon20", "horario");
// Check connection
if (mysqli_connect_errno()) {
    die("Failed to connect to MySQL" . mysqli_connect_error());
} 

if (!mysqli_query($con,$sql)) {
  die('Error: ' . mysqli_error($con));
}

mysqli_close($con);

