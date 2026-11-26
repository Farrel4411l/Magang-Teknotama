<?php
/**
 * Template Konfigurasi Portal Tekno AI Marketing (PHP 7.2+ Compatible).
 * Salin file ini menjadi `config/portal_config.php` jika ingin override konfigurasi server.
 * Catatan: API Key Groq/Gemini/OpenRouter & `cms_admin_key` otomatis dibaca dari
 * `/public_html/teknotama_secrets.php` (atau 1 tingkat di atasnya) bila tersedia.
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

return array(
    // Opsional: Override AI keys jika tidak memakai teknotama_secrets.php di root
    'groq_api_key'         => '',
    'gemini_api_key'       => '',
    'openrouter_api_key'   => '',

    // Email & WhatsApp defaults
    'email_from'           => 'noreply@teknotama.com',
    'email_reply_to'       => 'admin@teknotama.com',
    'alert_email_to'       => 'admin@teknotama.com',
    'whatsapp_number'      => '6285167694457',

    // Opsional: Telegram Bot API untuk notifikasi lead & error alerting (Rp 0)
    'telegram_bot_token'   => '',
    'telegram_chat_id'     => '',

    // Opsional: Google Apps Script Web App URL untuk sinkronisasi ke Google Sheets
    'gas_webhook_url'      => '',
    'gas_shared_secret'    => '',

    // Throttling outbound harian (jaga reputasi domain)
    'outbound_daily_limit' => 25,

    // Opsional: Kunci aktivasi awal atau hash admin (generate via password_hash('password', PASSWORD_BCRYPT))
    'setup_secret_key'     => '',
    'bootstrap_admin_user' => 'admin',
    'bootstrap_admin_hash' => '',
);
