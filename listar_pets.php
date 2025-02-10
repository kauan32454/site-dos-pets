<?php
include 'config.php';

$sql = "SELECT * FROM pets";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<div>";
        echo "<h3>" . $row["nome"] . " (" . $row["raca"] . ")</h3>";
        echo "<p>Idade: " . $row["idade"] . " anos</p>";
        echo "<p>Cidade: " . $row["cidade"] . "</p>";
        echo "<p>Descrição: " . $row["descricao"] . "</p>";
        if (!empty($row["imagem"])) {
            echo "<img src='uploads/" . $row["imagem"] . "' width='150'>";
        }
        echo "</div><hr>";
    }
} else {
    echo "Nenhum pet cadastrado.";
}

$conn->close();
?>
