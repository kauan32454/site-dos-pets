<?php
include 'config_pet.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome'];
    $raca = $_POST['raca'];
    $idade = $_POST['idade'];
    $cidade = $_POST['cidade'];
    $descricao = $_POST['descricao'];

    // Upload de Imagem
    $imagem = $_FILES['imagem']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($imagem);
    
    move_uploaded_file($_FILES['imagem']['tmp_name'], $target_file);

    // Inserir no banco de dados
    $sql = "INSERT INTO pets (nome, raca, idade, cidade, descricao, imagem) 
            VALUES ('$nome', '$raca', '$idade', '$cidade', '$descricao', '$imagem')";

    if ($conn->query($sql) === TRUE) {
        echo "Pet cadastrado com sucesso!";
    } else {
        echo "Erro: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
