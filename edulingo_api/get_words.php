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

$tables = ["keho", "verbeja", "elamanvaiheet"];
$words = [];

foreach ($tables as $table) {
    $sql = "SELECT nimi FROM $table"; 
    $result = $conn->query($sql);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $words[] = $row["nimi"];
        }
    }
}

$words = array_unique($words); 
sort($words);

echo json_encode(array_values($words));

$conn->close();
?>
