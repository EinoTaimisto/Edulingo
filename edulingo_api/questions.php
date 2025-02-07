<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edulingo_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

//Etsii oikean taulun
$tableName = $_GET['table'] ?? null;
if (!$tableName) {
    echo json_encode(["error" => "Table name is required"]);
    exit;
}


$validTables = ["verbeja", "questions", "elamanvaiheet", "keho"];
if (!in_array($tableName, $validTables)) {
    echo json_encode(["error" => "Invalid table name"]);
    exit;
}

$sql = "SELECT image, nimi, explanation, answer, audio FROM $tableName";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $questions = [];
    while ($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    echo json_encode($questions);
} else {
    echo json_encode([]);
}

$conn->close();
?>
