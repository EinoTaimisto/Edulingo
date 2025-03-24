<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edulingo_db";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}


$tableName = $_GET['table'] ?? null;
if (!$tableName) {
    echo json_encode(["error" => "Table name is required"]);
    exit;
}

$validTables = ["verbeja", "apuvalineet", "keho"];
if (!in_array($tableName, $validTables)) {
    echo json_encode(["error" => "Invalid table name"]);
    exit;
}


$sql = "SELECT image, nimi, explanation, answer, audio FROM $tableName ORDER BY RAND() LIMIT 1";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode($row); 
} else {
    echo json_encode(["error" => "No words found"]);
}


$conn->close();
?>
