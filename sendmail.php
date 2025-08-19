<?php
// filepath: c:\codes\pro\sendmail.php

// Простая валидация и защита от header-injection
function sanitize($s) {
    return trim(htmlspecialchars($s, ENT_QUOTES, 'UTF-8'));
}
function is_header_safe($s) {
    return (strpos($s, "\r") === false && strpos($s, "\n") === false);
}

$name = sanitize($_POST['name'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL) ? sanitize($_POST['email']) : '';
$message = sanitize($_POST['message'] ?? '');

// Кому отправлять
$to = "mafonin474@gmail.com";
$subject = "Заявка с сайта ПРОЭКО";
$body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСообщение:\n$message\n";

// Заголовки — только если безопасны
$from = 'no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'example.com');
if (!is_header_safe($from) || ($email && !is_header_safe($email))) {
    echo 'error';
    exit;
}

$headers = "From: " . $from . "\r\n";
if ($email) $headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

// Отправка письма
$sent = @mail($to, $subject, $body, $headers);
echo $sent ? 'success' : 'error';
?>