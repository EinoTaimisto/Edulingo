<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edulingo_db";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}


if (!isset($_GET["theme"])) {
    die(json_encode(["error" => "No theme specified"]));
}

$theme = $conn->real_escape_string($_GET["theme"]);


$sql = "SHOW TABLES LIKE '$theme'";
$result = $conn->query($sql);
if ($result->num_rows === 0) {
    die(json_encode(["error" => "Table '$theme' does not exist"]));
}

$sql = "SELECT image, nimi AS name, audio FROM $theme";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $images = [];
    while ($row = $result->fetch_assoc()) {
        $images[] = [
            "image" => $row["image"], 
            "name" => $row["name"], 
            "audio" => $row["audio"]
        ];
    }
    echo json_encode($images);
} else {
    echo json_encode(["error" => "No data found"]);
}

$conn->close();
?>