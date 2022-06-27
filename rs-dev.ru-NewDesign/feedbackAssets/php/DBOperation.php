<?php
require_once 'constants.php';

class DBOperation
{
    protected $con;

    public function __construct()
    {
        $this->con = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
        mysqli_query($this->con, "SET NAMES `UTF8`");
        mysqli_query ($this->con,"set character_set_results='utf8'");
    }

    public function get() {
        $query = mysqli_query($this->con, 'SELECT name, company, text, date FROM feedback WHERE active IS TRUE ORDER BY "date" DESC');
        $result = [];
        while ($data = mysqli_fetch_assoc($query)) {
            $result[] = $data;
        }

        echo json_encode($result);
    }

    public function add($name, $company, $text) {
        $query = 'INSERT INTO feedback(name, company, text, date, active) VALUES("'.$name.'","'.$company.'","'.$text.'","'.date("Y-m-d").'", TRUE)';
        mysqli_query($this->con, $query);
        header('Location: ./feedback.html');
    }

}