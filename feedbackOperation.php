<?php
require_once './feedbackAssets/php/DBOperation.php';

$DB = new DBOperation();

if ($_POST['operation'] === 'get') {
    $DB->get();
} else {
    $DB->add($_POST['name'], $_POST['company'], $_POST['text']);
}

