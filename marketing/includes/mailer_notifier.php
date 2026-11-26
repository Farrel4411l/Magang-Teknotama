<?php
/**
 * Tekno AI Marketing - Official Email Sender, Daily Quota Throttle, Telegram Alerter & GAS Webhook
 * Strictly compatible with PHP 7.2+ (ea-php72). Zero unofficial WhatsApp APIs.
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

function tkt_mkt_normalize_phone_wa($rawPhone)
{
    $digits = preg_replace('/\D+/', '', (string) $rawPhone);
    if ($digits === '') {
        return '';
    }
    if (substr($digits, 0, 1) === '0') {
        return '62' . substr($digits, 1);
    }
    if (substr($digits, 0, 2) !== '62') {
        return '62' . $digits;
    }
    return $digits;
}

function tkt_mkt_build_wa_url($rawPhone, $message)
{
    $waDigits = tkt_mkt_normalize_phone_wa($rawPhone);
    if ($waDigits === '') {
        return '';
    }
    return 'https://wa.me/' . $waDigits . '?text=' . rawurlencode((string) $message);
}

function tkt_mkt_get_outbound_quota($config)
{
    $today = date('Y-m-d');
    $limit = isset($config['outbound_daily_limit']) ? (int) $config['outbound_daily_limit'] : 25;
    $quota = tkt_mkt_read_json('outbound_quota', array('date' => $today, 'sent_count' => 0));
    if (!is_array($quota) || !isset($quota['date']) || $quota['date'] !== $today) {
        $quota = array('date' => $today, 'sent_count' => 0);
    }
    $sent = isset($quota['sent_count']) ? (int) $quota['sent_count'] : 0;
    return array(
        'date'       => $today,
        'sent_count' => $sent,
        'daily_limit' => $limit,
        'remaining'  => max(0, $limit - $sent),
    );
}

function tkt_mkt_consume_outbound_quota($config)
{
    $quota = tkt_mkt_get_outbound_quota($config);
    if ($quota['remaining'] <= 0) {
        return array('ok' => false, 'quota' => $quota);
    }
    $updated = array(
        'date'       => $quota['date'],
        'sent_count' => $quota['sent_count'] + 1,
    );
    tkt_mkt_write_json('outbound_quota', $updated);
    $quota['sent_count'] = $updated['sent_count'];
    $quota['remaining'] = max(0, $quota['daily_limit'] - $quota['sent_count']);
    return array('ok' => true, 'quota' => $quota);
}

function tkt_mkt_send_email($config, $business, $toEmail, $toName, $subject, $bodyText)
{
    $safeTo = str_replace(array("\r", "\n"), '', trim((string) $toEmail));
    if (!filter_var($safeTo, FILTER_VALIDATE_EMAIL)) {
        return array('ok' => false, 'error' => 'Alamat email tujuan tidak valid.');
    }

    $safeSubject = str_replace(array("\r", "\n"), ' ', trim((string) $subject));
    $safeFrom = str_replace(array("\r", "\n"), '', (string) $config['email_from']);
    $safeReplyTo = str_replace(array("\r", "\n"), '', (string) $config['email_reply_to']);
    $companyName = preg_replace('/["<>]/', '', str_replace(array("\r", "\n"), ' ', (string) $business['company_name']));
    $safeToName = preg_replace('/["<>]/', '', str_replace(array("\r", "\n"), ' ', trim((string) $toName)));

    $esc = function ($val) {
        return htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8');
    };

    $htmlBody = "<!DOCTYPE html><html><body style='margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;'>"
        . "<div style='max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;'>"
        . "<div style='background:#090d16;padding:18px 24px;border-bottom:3px solid #d9141d;'>"
        . "<strong style='color:#ffffff;font-size:15px;'>" . $esc($companyName) . "</strong>"
        . "<span style='display:block;color:#cbd5e1;font-size:11px;margin-top:3px;'>" . $esc($business['industry_focus']) . "</span>"
        . "</div>"
        . "<div style='padding:24px;font-size:14px;line-height:1.65;color:#1e293b;white-space:pre-line;'>"
        . $esc($bodyText)
        . "</div>"
        . "<div style='background:#f1f5f9;padding:14px 24px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0;'>"
        . $esc($companyName) . " • " . $esc($business['office_address']) . "<br>"
        . "Email: " . $esc($business['official_email']) . " | Telp: " . $esc($business['official_phone']) . " | " . $esc($business['domain'])
        . "</div></div></body></html>";

    $headers = array(
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $companyName . ' <' . $safeFrom . '>',
        'Reply-To: ' . $companyName . ' <' . $safeReplyTo . '>',
        'X-Mailer: PHP/' . PHP_VERSION,
    );

    $recipientHeader = $safeToName !== '' ? ($safeToName . ' <' . $safeTo . '>') : $safeTo;
    $sent = @mail($recipientHeader, $safeSubject, $htmlBody, implode("\r\n", $headers));
    if (!$sent) {
        return array(
            'ok' => false,
            'mail_sent' => false,
            'error' => 'Server PHP mail() gagal mengirim atau belum mengaktifkan SMTP relay di lingkungan lokal.',
        );
    }

    return array('ok' => true, 'mail_sent' => true);
}

function tkt_mkt_send_telegram($config, $messageText)
{
    $token = isset($config['telegram_bot_token']) ? trim((string) $config['telegram_bot_token']) : '';
    $chatId = isset($config['telegram_chat_id']) ? trim((string) $config['telegram_chat_id']) : '';
    if ($token === '' || $chatId === '') {
        return array('ok' => false, 'skipped' => true, 'error' => 'Telegram bot token / chat_id belum dikonfigurasi.');
    }
    if (!function_exists('curl_init')) {
        return array('ok' => false, 'error' => 'cURL tidak tersedia.');
    }

    $url = 'https://api.telegram.org/bot' . rawurlencode($token) . '/sendMessage';
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS     => json_encode(array(
            'chat_id'                  => $chatId,
            'text'                     => (string) $messageText,
            'disable_web_page_preview' => true,
        )),
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_SSL_VERIFYPEER => true,
    ));
    $body = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false || $httpCode < 200 || $httpCode >= 300) {
        return array('ok' => false, 'error' => $err !== '' ? $err : ('HTTP ' . $httpCode));
    }
    return array('ok' => true);
}

function tkt_mkt_push_gas_webhook($config, $eventType, $payload)
{
    $url = isset($config['gas_webhook_url']) ? trim((string) $config['gas_webhook_url']) : '';
    if ($url === '') {
        return array('ok' => false, 'skipped' => true, 'error' => 'Google Apps Script Webhook URL belum diisi.');
    }
    if (stripos($url, 'https://script.google.com/') !== 0) {
        return array('ok' => false, 'error' => 'URL Webhook harus mengarah ke https://script.google.com/...');
    }
    if (!function_exists('curl_init')) {
        return array('ok' => false, 'error' => 'cURL tidak tersedia.');
    }

    $envelope = array(
        'event'         => $eventType,
        'shared_secret' => isset($config['gas_shared_secret']) ? (string) $config['gas_shared_secret'] : '',
        'timestamp'     => date('c'),
        'payload'       => $payload,
    );

    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS     => json_encode($envelope, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_SSL_VERIFYPEER => true,
    ));
    $body = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false || $httpCode < 200 || $httpCode >= 400) {
        return array('ok' => false, 'error' => $err !== '' ? $err : ('HTTP ' . $httpCode));
    }
    return array('ok' => true, 'status' => $httpCode);
}

function tkt_mkt_dispatch_error_alert($config, $logEntry)
{
    // Rate-limit alert agar tidak terjadi flood email/Telegram saat error berulang
    if (!tkt_mkt_check_rate_limit('err_alert_' . $logEntry['module'], 2, 600)) {
        return;
    }
    $text = "[ALERT Tekno AI Marketing]\n"
        . "Waktu: " . $logEntry['created_at'] . "\n"
        . "Modul: " . $logEntry['module'] . "\n"
        . "Actor: " . $logEntry['actor'] . "\n"
        . "Pesan: " . $logEntry['message'];

    if (!empty($config['telegram_bot_token']) && !empty($config['telegram_chat_id'])) {
        tkt_mkt_send_telegram($config, $text);
    }
}
