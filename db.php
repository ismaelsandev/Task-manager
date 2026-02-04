<?php
    $host = 'localhost:3306';
    $user = 'root';
    $password = '1234';
    $dbname = 'taskManagerDB';

    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }
?>