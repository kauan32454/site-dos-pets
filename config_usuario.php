<?php
host = 'localhost';
dbname = 'cadastro';
username = 'root';
password = '';

try {
    conn = new PDO("mysql:host=host;dbname=dbname;charset=utf8", username, password);
    // Ativar modo de erro para exceções
    conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException e) {
    die("Conexão falhou: " . e->getMessage());
}
?>
