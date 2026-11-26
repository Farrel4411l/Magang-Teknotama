<?php
/**
 * Tekno AI Marketing - Secure Internal Login & First-Run Setup Gate
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
define('TEKNOTAMA_MARKETING_INTERNAL', true);

require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/auth.php';

$config = tkt_mkt_load_config();
tkt_mkt_send_security_headers(false);
tkt_mkt_start_session();

if (tkt_mkt_current_user() !== null) {
    header('Location: ./index.php');
    exit;
}

$setupStatus = tkt_mkt_setup_status($config);
$errorMsg = '';
$successMsg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrf = isset($_POST['csrf_token']) ? (string) $_POST['csrf_token'] : '';
    if (!tkt_mkt_verify_csrf($csrf)) {
        $errorMsg = 'Sesi formulir tidak valid. Silakan muat ulang halaman dan coba lagi.';
    } else {
        $mode = isset($_POST['form_mode']) ? (string) $_POST['form_mode'] : 'login';
        if ($mode === 'setup' && ($setupStatus === 'needs_setup_with_key' || $setupStatus === 'needs_setup_local')) {
            $setupRes = tkt_mkt_create_first_admin(
                $config,
                isset($_POST['username']) ? $_POST['username'] : '',
                isset($_POST['full_name']) ? $_POST['full_name'] : '',
                isset($_POST['password']) ? $_POST['password'] : '',
                isset($_POST['setup_key']) ? $_POST['setup_key'] : ''
            );
            if (!empty($setupRes['ok'])) {
                $setupStatus = 'ready';
                $successMsg = 'Akun admin pertama berhasil diaktivasi. Silakan login dengan username dan password yang baru dibuat.';
            } else {
                $errorMsg = isset($setupRes['error']) ? $setupRes['error'] : 'Gagal mengaktifkan akun admin.';
            }
        } elseif ($mode === 'login' && $setupStatus === 'ready') {
            $loginRes = tkt_mkt_attempt_login(
                $config,
                isset($_POST['username']) ? $_POST['username'] : '',
                isset($_POST['password']) ? $_POST['password'] : ''
            );
            if (!empty($loginRes['ok'])) {
                header('Location: ./index.php');
                exit;
            }
            $errorMsg = isset($loginRes['error']) ? $loginRes['error'] : 'Login gagal.';
        }
    }
}

$csrfToken = tkt_mkt_get_csrf_token();
$business = tkt_mkt_get_business_profile();
$esc = function ($val) {
    return htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8');
};
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <!-- GTM: Tekno AI Marketing -->
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-NK99NBN3"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Tekno AI Marketing | <?php echo $esc($business['company_name']); ?></title>
    <meta name="robots" content="noindex, nofollow, noarchive">
    <meta name="googlebot" content="noindex, nofollow">
    <link rel="icon" type="image/svg+xml" href="./assets/favicon.svg">

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="./assets/tailwind-config.js?v=20261124"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="./assets/style.css?v=20261124">
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col justify-between">
    <header class="bg-white border-b border-slate-200 py-4 px-4 sm:px-8">
        <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <img src="./assets/logo-teknotama.svg" alt="Tekno AI Marketing" class="h-10 w-auto">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#d9141d]"></i>
                Internal Portal • No-Index
            </span>
        </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-10">
        <div class="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div class="bg-[#090d16] px-6 py-5 border-b-2 border-[#d9141d] text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-red-400">B2B RevOps &amp; AI Marketing</span>
                        <h1 class="text-lg font-extrabold mt-0.5">
                            <?php echo ($setupStatus === 'ready') ? 'Masuk ke Konsol Marketing' : 'Aktivasi Admin Pertama'; ?>
                        </h1>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-[#d9141d] flex items-center justify-center flex-shrink-0">
                        <i data-lucide="lock" class="w-5 h-5 text-white"></i>
                    </div>
                </div>
            </div>

            <div class="p-6 space-y-4">
                <?php if ($errorMsg !== ''): ?>
                    <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-start gap-2">
                        <i data-lucide="alert-circle" class="w-4 h-4 text-[#d9141d] flex-shrink-0 mt-0.5"></i>
                        <span><?php echo $esc($errorMsg); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($successMsg !== ''): ?>
                    <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2">
                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                        <span><?php echo $esc($successMsg); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($setupStatus === 'blocked_missing_secret'): ?>
                    <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
                        <p class="font-bold">Aktivasi Pertama Membutuhkan Kunci Verifikasi Server</p>
                        <p>Untuk mencegah pendaftaran akun ilegal di server produksi, pastikan salah satu file berikut tersedia di server:</p>
                        <ul class="list-disc ml-4 space-y-1">
                            <li><code>teknotama_secrets.php</code> (berisi <code>cms_admin_key</code>) di <code>/public_html/</code> atau 1 tingkat di atasnya, atau</li>
                            <li><code>config/portal_config.php</code> berisi <code>setup_secret_key</code> / <code>bootstrap_admin_hash</code>.</li>
                        </ul>
                    </div>
                <?php elseif ($setupStatus === 'needs_setup_with_key' || $setupStatus === 'needs_setup_local'): ?>
                    <form method="POST" action="./login.php" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?php echo $esc($csrfToken); ?>">
                        <input type="hidden" name="form_mode" value="setup">

                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                            <?php if ($setupStatus === 'needs_setup_with_key'): ?>
                                Masukkan <strong>CMS Admin Key</strong> (dari <code>teknotama_secrets.php</code>) untuk membuat akun admin pertama portal ini.
                            <?php else: ?>
                                Mode Staging Lokal terdeteksi (<code>localhost</code>). Buat akun admin uji coba lokal Anda di bawah ini.
                            <?php endif; ?>
                        </div>

                        <div>
                            <label for="setup-fullname" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama Lengkap *</label>
                            <input id="setup-fullname" name="full_name" type="text" required placeholder="Farrel / Tim Marketing" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>

                        <div>
                            <label for="setup-username" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Username Admin *</label>
                            <input id="setup-username" name="username" type="text" required minlength="3" placeholder="admin.marketing" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>

                        <div>
                            <label for="setup-password" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Password Baru (Min. 8 Karakter) *</label>
                            <input id="setup-password" name="password" type="password" required minlength="8" autocomplete="new-password" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>

                        <?php if ($setupStatus === 'needs_setup_with_key'): ?>
                        <div>
                            <label for="setup-key" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Kode Verifikasi Server (cms_admin_key) *</label>
                            <input id="setup-key" name="setup_key" type="password" required placeholder="Masukkan cms_admin_key server..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>
                        <?php endif; ?>

                        <button type="submit" class="w-full bg-[#d9141d] hover:bg-[#b50e16] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-red-600/20 transition-all">
                            Aktifkan Akun Admin Pertama
                        </button>
                    </form>
                <?php else: ?>
                    <form method="POST" action="./login.php" class="space-y-4">
                        <input type="hidden" name="csrf_token" value="<?php echo $esc($csrfToken); ?>">
                        <input type="hidden" name="form_mode" value="login">

                        <div>
                            <label for="login-username" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Username</label>
                            <input id="login-username" name="username" type="text" required autocomplete="username" placeholder="Masukkan username..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>

                        <div>
                            <label for="login-password" class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Password</label>
                            <input id="login-password" name="password" type="password" required autocomplete="current-password" placeholder="Masukkan password..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d] focus:bg-white">
                        </div>

                        <button type="submit" class="w-full bg-[#d9141d] hover:bg-[#b50e16] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2">
                            <i data-lucide="log-in" class="w-4 h-4"></i>
                            <span>Masuk ke Dashboard</span>
                        </button>
                    </form>
                <?php endif; ?>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span><?php echo $esc($business['company_name']); ?></span>
                    <span>PII Masking &amp; BCRYPT Protected</span>
                </div>
            </div>
        </div>
    </main>

    <footer class="py-4 text-center text-[11px] text-slate-400">
        Tekno AI Marketing Internal Portal &bull; <?php echo date('Y'); ?> &bull; <a href="https://teknotama.com/" class="hover:text-[#d9141d]">teknotama.com</a>
    </footer>
    <script>
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    </script>
</body>
</html>
