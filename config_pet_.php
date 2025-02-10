<?php
host = 'localhost';
dbname = 'cadastro';
username_db = 'root'; // Altere se necessário
password_db = ''; // Altere se necessário


try {
    conn = new PDO("mysql:host=host;dbname=dbname;charset=utf8", username_db, password_db);
    conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    session_start(); // Inicia a sessão
} catch (PDOException e) {
    die("Erro ao conectar ao banco de dados: " . e->getMessage());
}
?>
