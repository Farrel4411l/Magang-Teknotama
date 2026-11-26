<?php
/**
 * Tekno AI Marketing - Session Hardening, BCRYPT Auth, CSRF & Safe First-Run Setup
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

function tkt_mkt_send_session_cookie_header($isHttps)
{
    if (headers_sent()) {
        return;
    }
    $cookie = session_name() . '=' . rawurlencode(session_id())
        . '; path=/marketing/'
        . '; HttpOnly'
        . ($isHttps ? '; Secure' : '')
        . '; SameSite=Strict';
    header('Set-Cookie: ' . $cookie, false);
}

function tkt_mkt_start_session()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps = tkt_mkt_is_https();
    session_name('TKT_MKT_SESS');
    @ini_set('session.use_strict_mode', '1');
    @ini_set('session.use_only_cookies', '1');

    if (PHP_VERSION_ID >= 70300) {
        session_set_cookie_params(array(
            'lifetime' => 0,
            'path'     => '/marketing/',
            'domain'   => '',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Strict',
        ));
        session_start();
    } else {
        session_set_cookie_params(0, '/marketing/', '', $isHttps, true);
        session_start();
        tkt_mkt_send_session_cookie_header($isHttps);
    }

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}

function tkt_mkt_get_csrf_token()
{
    tkt_mkt_start_session();
    return isset($_SESSION['csrf_token']) ? (string) $_SESSION['csrf_token'] : '';
}

function tkt_mkt_verify_csrf($token)
{
    tkt_mkt_start_session();
    $expected = isset($_SESSION['csrf_token']) ? (string) $_SESSION['csrf_token'] : '';
    $provided = is_string($token) ? trim($token) : '';
    if ($expected === '' || $provided === '') {
        return false;
    }
    return hash_equals($expected, $provided);
}

function tkt_mkt_load_users()
{
    $users = tkt_mkt_read_json('users', array());
    return is_array($users) ? $users : array();
}

function tkt_mkt_has_any_user($config)
{
    $users = tkt_mkt_load_users();
    foreach ($users as $u) {
        if (!empty($u['username']) && !empty($u['password_hash'])) {
            return true;
        }
    }
    if (!empty($config['bootstrap_admin_user']) && !empty($config['bootstrap_admin_hash'])) {
        return true;
    }
    return false;
}

function tkt_mkt_setup_status($config)
{
    if (tkt_mkt_has_any_user($config)) {
        return 'ready';
    }
    $hasKey = !empty($config['cms_admin_key']) || !empty($config['setup_secret_key']);
    if ($hasKey) {
        return 'needs_setup_with_key';
    }
    if (tkt_mkt_is_local_dev()) {
        return 'needs_setup_local';
    }
    return 'blocked_missing_secret';
}

function tkt_mkt_create_first_admin($config, $username, $fullName, $password, $setupKey)
{
    $status = tkt_mkt_setup_status($config);
    if ($status === 'ready') {
        return array('ok' => false, 'error' => 'Portal sudah diinisialisasi. Silakan login.');
    }
    if ($status === 'blocked_missing_secret') {
        return array('ok' => false, 'error' => 'Setup diblokir: teknotama_secrets.php (cms_admin_key) atau config/portal_config.php belum tersedia di server.');
    }

    if ($status === 'needs_setup_with_key') {
        $provided = trim((string) $setupKey);
        $validCms = !empty($config['cms_admin_key']) && $provided !== '' && hash_equals((string) $config['cms_admin_key'], $provided);
        $validSetup = !empty($config['setup_secret_key']) && $provided !== '' && hash_equals((string) $config['setup_secret_key'], $provided);
        if (!$validCms && !$validSetup) {
            return array('ok' => false, 'error' => 'Kode Verifikasi Server (cms_admin_key / setup_secret_key) tidak valid.');
        }
    }

    $cleanUser = strtolower(preg_replace('/[^a-zA-Z0-9._-]/', '', trim((string) $username)));
    $cleanName = tkt_mkt_clean_text($fullName, 80);
    if (strlen($cleanUser) < 3 || strlen($cleanUser) > 32) {
        return array('ok' => false, 'error' => 'Username minimal 3 karakter (huruf, angka, titik, atau strip).');
    }
    if (strlen((string) $password) < 8) {
        return array('ok' => false, 'error' => 'Password minimal 8 karakter.');
    }

    $record = array(
        'user_id'       => 'USR-001',
        'username'      => $cleanUser,
        'full_name'     => $cleanName !== '' ? $cleanName : 'Admin Marketing',
        'role'          => 'admin',
        'password_hash' => password_hash((string) $password, PASSWORD_BCRYPT),
        'active'        => true,
        'created_at'    => date('Y-m-d H:i:s'),
        'last_login_at' => '',
    );

    if (!tkt_mkt_write_json('users', array($record))) {
        return array('ok' => false, 'error' => 'Gagal menyimpan data pengguna ke folder data/. Pastikan izin tulis folder data/ aktif.');
    }

    tkt_mkt_log('auth', 'INFO', 'Akun admin pertama berhasil diaktivasi: ' . $cleanUser, $cleanUser, $config);
    return array('ok' => true, 'user' => $record);
}

function tkt_mkt_attempt_login($config, $username, $password)
{
    if (!tkt_mkt_check_rate_limit('login_fail', 8, 600)) {
        return array('ok' => false, 'error' => 'Terlalu banyak percobaan login. Silakan tunggu 10 menit.');
    }

    $cleanUser = strtolower(trim((string) $username));
    $rawPass = (string) $password;
    if ($cleanUser === '' || $rawPass === '') {
        return array('ok' => false, 'error' => 'Username dan password wajib diisi.');
    }

    $users = tkt_mkt_load_users();
    $matchedUser = null;
    $matchedIdx = -1;

    foreach ($users as $idx => $u) {
        if (isset($u['username']) && strtolower((string) $u['username']) === $cleanUser) {
            $matchedUser = $u;
            $matchedIdx = $idx;
            break;
        }
    }

    if ($matchedUser === null && !empty($config['bootstrap_admin_user']) && !empty($config['bootstrap_admin_hash'])) {
        if (strtolower((string) $config['bootstrap_admin_user']) === $cleanUser) {
            $matchedUser = array(
                'user_id'       => 'USR-BOOT',
                'username'      => $cleanUser,
                'full_name'     => 'Administrator',
                'role'          => 'admin',
                'password_hash' => (string) $config['bootstrap_admin_hash'],
                'active'        => true,
            );
        }
    }

    if ($matchedUser === null || empty($matchedUser['active']) || !password_verify($rawPass, (string) $matchedUser['password_hash'])) {
        tkt_mkt_log('auth', 'WARN', 'Percobaan login gagal untuk username: ' . $cleanUser . ' dari IP ' . tkt_mkt_get_client_ip(), 'security', $config);
        return array('ok' => false, 'error' => 'Username atau password salah.');
    }

    tkt_mkt_start_session();
    session_regenerate_id(true);
    if (PHP_VERSION_ID < 70300) {
        tkt_mkt_send_session_cookie_header(tkt_mkt_is_https());
    }

    $_SESSION['tkt_mkt_user'] = array(
        'user_id'   => isset($matchedUser['user_id']) ? $matchedUser['user_id'] : 'USR',
        'username'  => $matchedUser['username'],
        'full_name' => isset($matchedUser['full_name']) ? $matchedUser['full_name'] : $matchedUser['username'],
        'role'      => isset($matchedUser['role']) ? $matchedUser['role'] : 'staff',
        'login_at'  => date('Y-m-d H:i:s'),
    );
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    if ($matchedIdx >= 0) {
        $users[$matchedIdx]['last_login_at'] = date('Y-m-d H:i:s');
        tkt_mkt_write_json('users', $users);
    }

    tkt_mkt_log('auth', 'INFO', 'Login berhasil ke Tekno AI Marketing', $matchedUser['username'], $config);
    return array('ok' => true, 'user' => $_SESSION['tkt_mkt_user']);
}

function tkt_mkt_current_user()
{
    tkt_mkt_start_session();
    if (!empty($_SESSION['tkt_mkt_user']) && is_array($_SESSION['tkt_mkt_user'])) {
        return $_SESSION['tkt_mkt_user'];
    }
    return null;
}

function tkt_mkt_require_auth($isApi)
{
    $user = tkt_mkt_current_user();
    if ($user !== null) {
        return $user;
    }
    if ($isApi) {
        tkt_mkt_send_json(array(
            'ok' => false,
            'error' => 'Sesi login tidak aktif atau telah kedaluwarsa. Silakan login kembali.',
            'auth_required' => true,
        ), 401);
    }
    header('Location: ./login.php');
    exit;
}

function tkt_mkt_logout()
{
    tkt_mkt_start_session();
    $_SESSION = array();
    if (ini_get('session.use_cookies')) {
        $isHttps = tkt_mkt_is_https();
        if (PHP_VERSION_ID >= 70300) {
            setcookie(session_name(), '', array(
                'expires'  => time() - 3600,
                'path'     => '/marketing/',
                'domain'   => '',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Strict',
            ));
        } else {
            setcookie(session_name(), '', time() - 3600, '/marketing/', '', $isHttps, true);
        }
    }
    session_destroy();
}
