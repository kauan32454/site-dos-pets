<?php
// Configuração da conexão
$servername = "localhost"; // Nome do servidor (localhost para local)
$username = "root";        // Nome de usuário do banco
$password = "";            // Senha do banco (vazia por padrão no XAMPP)
$database = "RegistroLoginSimples"; // Nome do banco de dados
 
// Criar a conexão
$conn = new mysqli($servername, $username, $password, $database);
 
// Verificar a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>