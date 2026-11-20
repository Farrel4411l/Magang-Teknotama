<?php
/**
 * Template Konfigurasi Rahasia Teknotama API
 * Salin file ini menjadi `teknotama_secrets.php` lalu isi API Key aktif.
 * File `teknotama_secrets.php` diabaikan oleh .gitignore agar aman saat push ke Git.
 */
if (!defined('TEKNOTAMA_API_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

return array(
    'groq_api_key'         => '',
    'gemini_api_key'       => '',
    'openrouter_api_key'   => '',
    'cohere_api_key'       => '',
    // Cohere Trial Key dibatasi non-komersial oleh Cohere; set true hanya jika sudah memakai Production Key.
    'enable_cohere'        => false,

    // Konfigurasi Email Tujuan Booking, WhatsApp CS, & Kode Akses CMS Testimoni
    'booking_email_to'     => 'admin@teknotama.com',
    'booking_email_from'   => 'noreply@teknotama.com',
    'whatsapp_number'      => '6285167694457',
    'cms_admin_key'        => 'GANTI_KODE_ADMIN_CMS_ANDA',
);
