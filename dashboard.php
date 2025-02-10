<?php
require 'config.php';

if (!isset(_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

echo "Bem-vindo, " . htmlspecialchars(_SESSION['username']) . "! <a href='logout.php'>Sair</a>";
?>