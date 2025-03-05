<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edulingo_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$tablesQuery = "SHOW TABLES";
$tablesResult = $conn->query($tablesQuery);

$wordsByTable = [];

if ($tablesResult->num_rows > 0) {
    while ($tableRow = $tablesResult->fetch_array()) {
        $tableName = $tableRow[0];

        $safeTableName = preg_replace('/[^a-zA-Z0-9_]/', '', $tableName);

        $sql = "SELECT nimi, audio FROM `$safeTableName`";
        $result = $conn->query($sql);

        $words = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $words[] = [
                    "word" => $row['nimi'],
                    "audio" => $row['audio']
                ];
            }
        }
        if (!empty($words)) {
            $wordsByTable[$safeTableName] = $words;
        }
    }
}
echo json_encode($wordsByTable);
$conn->close();

?>
