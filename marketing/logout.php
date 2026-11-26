<?php
/**
 * Tekno AI Marketing - Session Logout Handler
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
define('TEKNOTAMA_MARKETING_INTERNAL', true);

require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/auth.php';

tkt_mkt_send_security_headers(false);
tkt_mkt_start_session();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrf = isset($_POST['csrf_token']) ? (string) $_POST['csrf_token'] : '';
    if (!tkt_mkt_verify_csrf($csrf)) {
        http_response_code(403);
        exit('CSRF token mismatch');
    }
    $user = tkt_mkt_current_user();
    if ($user !== null) {
        tkt_mkt_log('auth', 'INFO', 'Logout dari portal', $user['username'], null);
    }
    tkt_mkt_logout();
}

header('Location: ./login.php');
exit;
