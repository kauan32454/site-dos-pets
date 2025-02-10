<?php 

require 'config_usuario.php';

if (_SERVER['REQUEST_METHOD'] == 'POST') {
    username = trim(_POST['new-username']);
    password = trim(_POST['new-password']);

    if (empty(username) || empty(password)) {
        die("Erro: Nome de usuário e senha são obrigatórios.");
    }
    if (strlen(password) < 8) {
        die("Erro: A senha deve ter pelo menos 8 caracteres.");
    }

    try {
        // Verificar se o usuário já existe
        stmt = conn->prepare("SELECT COUNT(*) FROM cadastro_usuarios WHERE username = :username");
        stmt->bindParam(':username', username);
        stmt->execute();
        if (stmt->fetchColumn() > 0) {
            die("Erro: Nome de usuário já está em uso.");
        }

        // Criar senha segura
        hashed_password = password_hash(password, PASSWORD_DEFAULT);

        // Inserir usuário no banco
        stmt = conn->prepare("INSERT INTO cadastro_usuarios (username, password) VALUES (:username, :password)");
        stmt->bindParam(':username', username);
        stmt->bindParam(':password', hashed_password);
        stmt->execute();

        echo "Registro realizado com sucesso! <a href='login.php'>Faça login</a>";
    } catch (PDOException e) {
        echo "Erro ao registrar: " . e->getMessage();
    }
}
?>
