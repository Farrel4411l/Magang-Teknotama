<?php
/**
 * Tekno AI Marketing - Core Bootstrap, Config Loader, Atomic JSON Storage & Alerting
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

error_reporting(0);
@ini_set('display_errors', '0');

function tkt_mkt_is_https()
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
        return true;
    }
    if (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443) {
        return true;
    }
    return false;
}

function tkt_mkt_is_local_dev()
{
    $host = isset($_SERVER['HTTP_HOST']) ? strtolower(preg_replace('/:\d+$/', '', (string) $_SERVER['HTTP_HOST'])) : '';
    $remote = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    $localHosts = array('localhost', '127.0.0.1', '[::1]');
    $localIps = array('127.0.0.1', '::1');
    return in_array($host, $localHosts, true) && in_array($remote, $localIps, true);
}

function tkt_mkt_send_security_headers($isJson)
{
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    if ($isJson) {
        header('Content-Type: application/json; charset=UTF-8');
    } else {
        header('Content-Type: text/html; charset=UTF-8');
    }
}

function tkt_mkt_send_json($data, $statusCode)
{
    http_response_code((int) $statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function tkt_mkt_get_client_ip()
{
    return isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
}

function tkt_mkt_data_path($storeKey)
{
    $map = array(
        'users'             => 'users.json',
        'leads'             => 'leads.json',
        'pricing'           => 'pricing.json',
        'outbound'          => 'outbound.json',
        'case_studies'      => 'case_studies.json',
        'logs'              => 'system_logs.json',
        'business'          => 'business_profile.json',
        'integrations'      => 'integrations.json',
        'outbound_quota'    => 'outbound_quota.json',
        'research_accounts' => 'research_accounts.json',
        'rss_feeds'         => 'rss_feeds.json',
        'market_signals'    => 'market_signals.json',
        'funnel_traffic'    => 'funnel_traffic.json',
    );
    if (!isset($map[$storeKey])) {
        return '';
    }
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    return $dir . '/' . $map[$storeKey];
}

function tkt_mkt_read_json($storeKey, $default)
{
    $file = tkt_mkt_data_path($storeKey);
    if ($file === '') {
        return $default;
    }
    if (is_file($file) && is_readable($file)) {
        $raw = @file_get_contents($file);
        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }
    }
    return $default;
}

function tkt_mkt_utf8_substr($val, $maxLen)
{
    $str = (string) $val;
    if ($maxLen <= 0) {
        return '';
    }
    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        if (mb_strlen($str, 'UTF-8') > $maxLen) {
            return mb_substr($str, 0, $maxLen, 'UTF-8');
        }
        return $str;
    }
    return strlen($str) > $maxLen ? substr($str, 0, $maxLen) : $str;
}

function tkt_mkt_write_json($storeKey, $data)
{
    $file = tkt_mkt_data_path($storeKey);
    if ($file === '') {
        return false;
    }
    $flags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    $json = json_encode($data, $flags);
    if (!is_string($json) || $json === '') {
        return false;
    }
    return @file_put_contents($file, $json, LOCK_EX) !== false;
}

function tkt_mkt_clean_text($val, $maxLen)
{
    $raw = (string) $val;
    $raw = preg_replace('#<(script|style|iframe|object|embed)\b[^>]*>.*?</\1>#is', '', $raw);
    $clean = trim(strip_tags($raw));
    $clean = preg_replace("/[ \t]+/", ' ', $clean);
    if ($maxLen > 0) {
        $clean = tkt_mkt_utf8_substr($clean, $maxLen);
    }
    return $clean;
}

function tkt_mkt_clean_multiline($val, $maxLen)
{
    $raw = (string) $val;
    $raw = preg_replace('#<(script|style|iframe|object|embed)\b[^>]*>.*?</\1>#is', '', $raw);
    $clean = trim(strip_tags($raw));
    $clean = str_replace(array("\r\n", "\r"), "\n", $clean);
    if ($maxLen > 0) {
        $clean = tkt_mkt_utf8_substr($clean, $maxLen);
    }
    return $clean;
}

function tkt_mkt_default_business_profile()
{
    return array(
        'company_name'       => 'PT Teknotama Prakarsa Mulia',
        'brand_short'        => 'Teknotama IT Solution',
        'domain'             => 'https://teknotama.com/',
        'industry_focus'     => 'B2B IT System Integrator & Enterprise Infrastructure Contractor',
        'office_address'     => 'Infiniti Office, Belleza BSA Lt. 1 Unit 106, Jl. Letjen Soepeno, Jakarta Selatan 12210',
        'official_email'     => 'admin@teknotama.com',
        'official_phone'     => '+62-21 58905002',
        'official_whatsapp'  => '6285167694457',
        'services_summary'   => 'Instalasi Kabel LAN Cat6/Cat6A + Uji Fluke, Fusion Splicing Fiber Optic + OTDR, Perapihan Rack & Data Center ANSI/TIA-942, Next-Gen Firewall (Fortinet/Cisco/MikroTik), Enterprise Wi-Fi Heatmap, IP CCTV & Door Access Control, Managed IT NOC 24/7',
        'value_proposition'  => 'Eksekusi Zero-Downtime, Standar ANSI/TIA-568 & TIA-942, Garansi Uji Sertifikasi Fluke/OTDR, Free Site Survey Jabodetabek & Kawasan Industri',
        'ai_tone'            => 'Profesional B2B, solutif, akurat secara teknis namun tetap mudah dipahami manajemen/pengambil keputusan non-IT, tanpa mengarang angka harga jika belum disurvei.',
    );
}

function tkt_mkt_get_business_profile()
{
    $defaults = tkt_mkt_default_business_profile();
    $saved = tkt_mkt_read_json('business', array());
    if (!is_array($saved) || empty($saved)) {
        return $defaults;
    }
    return array_merge($defaults, $saved);
}

function tkt_mkt_load_config()
{
    $defaults = array(
        'groq_api_key'         => getenv('TEKNOTAMA_GROQ_KEY') ?: '',
        'gemini_api_key'       => getenv('TEKNOTAMA_GEMINI_KEY') ?: '',
        'openrouter_api_key'   => getenv('TEKNOTAMA_OPENROUTER_KEY') ?: '',
        'email_from'           => 'noreply@teknotama.com',
        'email_reply_to'       => 'admin@teknotama.com',
        'alert_email_to'       => 'admin@teknotama.com',
        'whatsapp_number'      => '6285167694457',
        'cms_admin_key'        => getenv('TEKNOTAMA_CMS_KEY') ?: '',
        'setup_secret_key'     => '',
        'bootstrap_admin_user' => 'admin',
        'bootstrap_admin_hash' => '',
        'telegram_bot_token'   => '',
        'telegram_chat_id'     => '',
        'gas_webhook_url'      => '',
        'gas_shared_secret'    => '',
        'outbound_daily_limit' => 25,
        'parent_secrets_found' => false,
    );

    // 1. Baca teknotama_secrets.php milik server utama (di /public_html/ atau 1 level di atasnya)
    if (!defined('TEKNOTAMA_API_INTERNAL')) {
        define('TEKNOTAMA_API_INTERNAL', true);
    }
    $parentCandidates = array(
        dirname(__DIR__) . '/teknotama_secrets.php',
        dirname(dirname(__DIR__)) . '/teknotama_secrets.php',
    );
    foreach ($parentCandidates as $secretPath) {
        if (is_file($secretPath) && is_readable($secretPath)) {
            $loaded = include $secretPath;
            if (is_array($loaded)) {
                $defaults['parent_secrets_found'] = true;
                $mapKeys = array(
                    'groq_api_key'       => 'groq_api_key',
                    'gemini_api_key'     => 'gemini_api_key',
                    'openrouter_api_key' => 'openrouter_api_key',
                    'booking_email_to'   => 'alert_email_to',
                    'booking_email_from' => 'email_from',
                    'whatsapp_number'    => 'whatsapp_number',
                    'cms_admin_key'      => 'cms_admin_key',
                );
                foreach ($mapKeys as $srcKey => $dstKey) {
                    if (!empty($loaded[$srcKey])) {
                        $defaults[$dstKey] = $loaded[$srcKey];
                    }
                }
                if (!empty($loaded['booking_email_to'])) {
                    $defaults['email_reply_to'] = $loaded['booking_email_to'];
                }
                break;
            }
        }
    }

    // 2. Override dari config/portal_config.php lokal bila ada
    $localConfig = dirname(__DIR__) . '/config/portal_config.php';
    if (is_file($localConfig) && is_readable($localConfig)) {
        $loadedLocal = include $localConfig;
        if (is_array($loadedLocal)) {
            foreach ($loadedLocal as $k => $v) {
                if ($v !== '' && $v !== null) {
                    $defaults[$k] = $v;
                }
            }
        }
    }

    // 3. Pengaturan integrasi yang disimpan via UI (di data/integrations.json, terproteksi .htaccess)
    $savedIntegrations = tkt_mkt_read_json('integrations', array());
    if (is_array($savedIntegrations)) {
        $allowedUiKeys = array(
            'telegram_bot_token',
            'telegram_chat_id',
            'gas_webhook_url',
            'gas_shared_secret',
            'outbound_daily_limit',
            'email_reply_to',
            'alert_email_to',
        );
        foreach ($allowedUiKeys as $k) {
            if (isset($savedIntegrations[$k]) && $savedIntegrations[$k] !== '') {
                $defaults[$k] = $savedIntegrations[$k];
            }
        }
    }

    $limit = (int) $defaults['outbound_daily_limit'];
    if ($limit < 1) {
        $limit = 1;
    }
    if ($limit > 200) {
        $limit = 200;
    }
    $defaults['outbound_daily_limit'] = $limit;

    return $defaults;
}

function tkt_mkt_check_rate_limit($bucket, $maxRequests, $windowSeconds)
{
    $ipHash = hash('sha256', tkt_mkt_get_client_ip() . '|' . $bucket);
    $rateDir = dirname(__DIR__) . '/data/ratelimit';
    if (!is_dir($rateDir)) {
        @mkdir($rateDir, 0755, true);
        @file_put_contents($rateDir . '/.htaccess', "Require all denied\n", LOCK_EX);
    }
    $file = $rateDir . '/' . $ipHash . '.json';
    $now = time();
    $entries = array();

    if (is_file($file) && is_readable($file)) {
        $raw = @file_get_contents($file);
        $decoded = json_decode((string) $raw, true);
        if (is_array($decoded)) {
            foreach ($decoded as $ts) {
                if (is_int($ts) && ($now - $ts) < $windowSeconds) {
                    $entries[] = $ts;
                }
            }
        }
    }

    if (count($entries) >= $maxRequests) {
        return false;
    }

    $entries[] = $now;
    @file_put_contents($file, json_encode($entries), LOCK_EX);
    return true;
}

function tkt_mkt_log($module, $level, $message, $actor, $config)
{
    $logs = tkt_mkt_read_json('logs', array());
    if (!is_array($logs)) {
        $logs = array();
    }
    $entry = array(
        'log_id'     => 'LOG-' . date('YmdHis') . '-' . substr(md5(uniqid('', true)), 0, 4),
        'created_at' => date('Y-m-d H:i:s'),
        'module'     => tkt_mkt_clean_text($module, 40),
        'level'      => strtoupper(tkt_mkt_clean_text($level, 12)),
        'message'    => tkt_mkt_clean_text($message, 400),
        'actor'      => tkt_mkt_clean_text($actor !== '' ? $actor : 'system', 60),
    );
    array_unshift($logs, $entry);
    if (count($logs) > 200) {
        $logs = array_slice($logs, 0, 200);
    }
    tkt_mkt_write_json('logs', $logs);

    if ($entry['level'] === 'ERROR' && is_array($config) && function_exists('tkt_mkt_dispatch_error_alert')) {
        tkt_mkt_dispatch_error_alert($config, $entry);
    }
}

function tkt_mkt_new_id($prefix)
{
    return $prefix . '-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid((string) mt_rand(), true)), 0, 5));
}

function tkt_mkt_csv_safe_cell($value)
{
    $str = str_replace(array("\r\n", "\r", "\n"), ' ', (string) $value);
    if ($str !== '' && in_array($str[0], array('=', '+', '-', '@', "\t"), true)) {
        return "'" . $str;
    }
    return $str;
}
