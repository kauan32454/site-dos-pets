<?php
session_start();

// Verificar se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Conectar ao banco de dados
$servername = "localhost";
$username = "root"; // Altere conforme sua configuração
$password = ""; // Altere conforme sua configuração
$dbname = "adocao_pets";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Buscar dados do usuário logado
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM usuarios WHERE id = '$user_id'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
} else {
    echo "Usuário não encontrado!";
}

$conn->close();
?>