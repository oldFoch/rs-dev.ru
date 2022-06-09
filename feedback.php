<?php
$to = 'mail@rs-dev.ru';
$subject = 'Заявка с сайта';
$message = "На сайте была оставлена просьба на обратный звонок: \n";
foreach (array_keys($_POST) as $key) {
    $message .= $key.': '.$_POST[$key]."\n";
}
$message = wordwrap($message, 70);
if (mail($to, $subject, $message)) {
    echo('Message sent');
}
else {
    echo('Error: '.mail($to, $subject, $message));
}
