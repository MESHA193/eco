<?php
// filepath: c:\codes\pro\sendmail.php

// Обрабатываем только POST-запросы
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    echo 'error';
    exit;
}

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

// Формируем корректный ASCII-домен для From, учитывая IDN (проэко.рф)
$serverName = $_SERVER['SERVER_NAME'] ?? 'example.com';
if (function_exists('idn_to_ascii')) {
    $idn = idn_to_ascii($serverName, 0, defined('INTL_IDNA_VARIANT_UTS46') ? INTL_IDNA_VARIANT_UTS46 : 0);
    if ($idn) {
        $serverName = $idn;
    }
}

// Заголовки — только если безопасны
$from = 'no-reply@' . $serverName;
if (!is_header_safe($from) || ($email && !is_header_safe($email))) {
    echo 'error';
    exit;
}

// Кодируем тему письма в UTF-8 (RFC 2047)
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// Заголовки письма
$headers = "From: " . $from . "\r\n";
if ($email) $headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "Date: " . date(DATE_RFC2822) . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправка письма (указываем envelope sender для SPF/DMARC)
$additionalParams = '-f ' . $from;
$sent = @mail($to, $encodedSubject, $body, $headers, $additionalParams);
echo $sent ? 'success' : 'error';
?>