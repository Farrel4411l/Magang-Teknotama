<?php
/**
 * Tekno AI Marketing - Authenticated API Endpoint (PHP 7.2+ Compatible)
 */
define('TEKNOTAMA_MARKETING_INTERNAL', true);

require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/mailer_notifier.php';
require_once __DIR__ . '/includes/ai_proxy.php';
require_once __DIR__ . '/includes/researcher.php';

$config = tkt_mkt_load_config();
$action = isset($_GET['action']) ? trim((string) $_GET['action']) : '';

if ($action === 'export_csv' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = tkt_mkt_require_auth(true);
    tkt_mkt_handle_export_csv($user);
    exit;
}

tkt_mkt_send_security_headers(true);

if ($action === 'health' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $setupStatus = tkt_mkt_setup_status($config);
    tkt_mkt_send_json(array(
        'ok'                 => true,
        'portal'             => 'Tekno AI Marketing',
        'php_version'        => PHP_VERSION,
        'setup_status'       => $setupStatus,
        'data_dir_writable'  => is_writable(dirname(__FILE__) . '/data') || is_writable(__DIR__),
    ), 200);
}

$user = tkt_mkt_require_auth(true);
$business = tkt_mkt_get_business_profile();

if ($action === 'bootstrap' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $safeUsers = array();
    if (isset($user['role']) && $user['role'] === 'admin') {
        foreach (tkt_mkt_load_users() as $u) {
            $safeUsers[] = array(
                'user_id'       => isset($u['user_id']) ? $u['user_id'] : '',
                'username'      => isset($u['username']) ? $u['username'] : '',
                'full_name'     => isset($u['full_name']) ? $u['full_name'] : '',
                'role'          => isset($u['role']) ? $u['role'] : 'staff',
                'active'        => !empty($u['active']),
                'last_login_at' => isset($u['last_login_at']) ? $u['last_login_at'] : '',
            );
        }
    }

    $leads = tkt_mkt_read_json('leads', array());
    foreach ($leads as $idx => $ld) {
        $waText = isset($ld['last_wa_draft']) && $ld['last_wa_draft'] !== ''
            ? $ld['last_wa_draft']
            : ('Halo Bapak/Ibu ' . (isset($ld['pic_name']) ? $ld['pic_name'] : '') . ' (' . (isset($ld['company_name']) ? $ld['company_name'] : '') . '), saya dari tim ' . $business['company_name'] . ' menindaklanjuti kebutuhan ' . (isset($ld['service_category']) ? $ld['service_category'] : 'infrastruktur IT') . '.');
        $leads[$idx]['wa_url'] = tkt_mkt_build_wa_url(isset($ld['whatsapp']) ? $ld['whatsapp'] : '', $waText);
    }

    $outbound = tkt_mkt_read_json('outbound', array());
    $researchAccounts = tkt_mkt_read_json('research_accounts', array());
    $rssFeeds = tkt_mkt_read_json('rss_feeds', array());
    $marketSignals = tkt_mkt_read_json('market_signals', array());
    $funnelTraffic = tkt_mkt_read_json('funnel_traffic', array('web_visits' => 0, 'boq_calculator_uses' => 0, 'period_label' => 'Bulan Berjalan'));
    $funnelStats = tkt_mkt_compute_funnel_stats($leads, $outbound, $researchAccounts, $marketSignals, $funnelTraffic);

    tkt_mkt_send_json(array(
        'ok'                => true,
        'user'              => $user,
        'csrf_token'        => tkt_mkt_get_csrf_token(),
        'business'          => $business,
        'leads'             => $leads,
        'pricing'           => tkt_mkt_read_json('pricing', array()),
        'outbound'          => $outbound,
        'case_studies'      => tkt_mkt_read_json('case_studies', array()),
        'research_accounts' => $researchAccounts,
        'rss_feeds'         => $rssFeeds,
        'market_signals'    => $marketSignals,
        'funnel_stats'      => $funnelStats,
        'logs'              => array_slice(tkt_mkt_read_json('logs', array()), 0, 60),
        'quota'             => tkt_mkt_get_outbound_quota($config),
        'users'        => $safeUsers,
        'integrations' => array(
            'parent_secrets_found'  => !empty($config['parent_secrets_found']),
            'ai_groq_ready'         => !empty($config['groq_api_key']),
            'ai_gemini_ready'       => !empty($config['gemini_api_key']),
            'ai_openrouter_ready'   => !empty($config['openrouter_api_key']),
            'telegram_configured'   => !empty($config['telegram_bot_token']) && !empty($config['telegram_chat_id']),
            'telegram_chat_id'      => isset($config['telegram_chat_id']) ? (string) $config['telegram_chat_id'] : '',
            'gas_configured'        => !empty($config['gas_webhook_url']),
            'gas_webhook_url'       => isset($config['gas_webhook_url']) ? (string) $config['gas_webhook_url'] : '',
            'outbound_daily_limit'  => (int) $config['outbound_daily_limit'],
            'email_reply_to'        => (string) $config['email_reply_to'],
            'alert_email_to'        => (string) $config['alert_email_to'],
        ),
    ), 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    tkt_mkt_send_json(array('ok' => false, 'error' => 'Method not allowed.'), 405);
}

$raw = file_get_contents('php://input');
$input = json_decode((string) $raw, true);
if (!is_array($input)) {
    tkt_mkt_send_json(array('ok' => false, 'error' => 'Payload JSON tidak valid.'), 400);
}

$csrfHeader = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? (string) $_SERVER['HTTP_X_CSRF_TOKEN'] : '';
$csrfBody = isset($input['csrf_token']) ? (string) $input['csrf_token'] : '';
if (!tkt_mkt_verify_csrf($csrfHeader !== '' ? $csrfHeader : $csrfBody)) {
    tkt_mkt_send_json(array('ok' => false, 'error' => 'Token keamanan CSRF tidak valid. Muat ulang halaman.'), 403);
}

/* ============================================================================
 * HELPER PENYIMPANAN UMUM
 * ============================================================================ */

function tkt_mkt_upsert_item($storeKey, $idField, $record, $prepend)
{
    $items = tkt_mkt_read_json($storeKey, array());
    if (!is_array($items)) {
        $items = array();
    }
    $found = -1;
    foreach ($items as $idx => $existing) {
        if (isset($existing[$idField]) && $existing[$idField] === $record[$idField]) {
            $found = $idx;
            break;
        }
    }
    if ($found >= 0) {
        $items[$found] = $record;
    } elseif ($prepend) {
        array_unshift($items, $record);
    } else {
        $items[] = $record;
    }
    tkt_mkt_write_json($storeKey, array_values($items));
    return array('items' => array_values($items), 'mode' => ($found >= 0 ? 'updated' : 'created'));
}

function tkt_mkt_find_item($storeKey, $idField, $idValue)
{
    $items = tkt_mkt_read_json($storeKey, array());
    foreach ($items as $item) {
        if (isset($item[$idField]) && $item[$idField] === $idValue) {
            return $item;
        }
    }
    return null;
}

function tkt_mkt_delete_item($storeKey, $idField, $idValue)
{
    $items = tkt_mkt_read_json($storeKey, array());
    $filtered = array();
    $deleted = false;
    foreach ($items as $item) {
        if (isset($item[$idField]) && $item[$idField] === $idValue) {
            $deleted = true;
            continue;
        }
        $filtered[] = $item;
    }
    tkt_mkt_write_json($storeKey, $filtered);
    return array('items' => $filtered, 'deleted' => $deleted);
}

function tkt_mkt_require_admin_role($user)
{
    if (!isset($user['role']) || $user['role'] !== 'admin') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Akses ditolak. Fitur ini khusus role Admin.'), 403);
    }
}

/* ============================================================================
 * ROUTER ACTIONS
 * ============================================================================ */

if ($action === 'lead_save') {
    $leadId = isset($input['lead_id']) ? tkt_mkt_clean_text($input['lead_id'], 40) : '';
    $existing = $leadId !== '' ? tkt_mkt_find_item('leads', 'lead_id', $leadId) : null;

    $company = tkt_mkt_clean_text(isset($input['company_name']) ? $input['company_name'] : '', 120);
    $pic = tkt_mkt_clean_text(isset($input['pic_name']) ? $input['pic_name'] : '', 80);
    $email = tkt_mkt_clean_text(isset($input['email']) ? $input['email'] : '', 120);
    $wa = tkt_mkt_clean_text(isset($input['whatsapp']) ? $input['whatsapp'] : '', 32);

    if ($company === '' || ($email === '' && $wa === '')) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Nama perusahaan dan minimal salah satu kontak (Email / WhatsApp) wajib diisi.'), 422);
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Format email tidak valid.'), 422);
    }

    $allowedStatus = array('New Lead', 'Contacted', 'Site Survey', 'Quotation', 'Won', 'Lost');
    $status = tkt_mkt_clean_text(isset($input['status']) ? $input['status'] : 'New Lead', 30);
    if (!in_array($status, $allowedStatus, true)) {
        $status = 'New Lead';
    }

    $record = array(
        'lead_id'          => $existing !== null ? $existing['lead_id'] : tkt_mkt_new_id('LD'),
        'created_at'       => $existing !== null ? $existing['created_at'] : date('Y-m-d H:i:s'),
        'source'           => tkt_mkt_clean_text(isset($input['source']) ? $input['source'] : ($existing !== null && isset($existing['source']) ? $existing['source'] : 'manual'), 40),
        'company_name'     => $company,
        'pic_name'         => $pic !== '' ? $pic : 'Bapak/Ibu',
        'email'            => $email,
        'whatsapp'         => $wa,
        'location'         => tkt_mkt_clean_text(isset($input['location']) ? $input['location'] : 'Jabodetabek', 120),
        'service_category' => tkt_mkt_clean_text(isset($input['service_category']) ? $input['service_category'] : 'Fiber Optic & LAN', 80),
        'boq_summary'      => tkt_mkt_clean_multiline(isset($input['boq_summary']) ? $input['boq_summary'] : '', 400),
        'status'           => $status,
        'next_followup_at' => tkt_mkt_clean_text(isset($input['next_followup_at']) ? $input['next_followup_at'] : date('Y-m-d', strtotime('+3 days')), 20),
        'last_contact_at'  => $existing !== null && isset($existing['last_contact_at']) ? $existing['last_contact_at'] : '',
        'notes'            => tkt_mkt_clean_multiline(isset($input['notes']) ? $input['notes'] : '', 800),
        'last_wa_draft'    => $existing !== null && isset($existing['last_wa_draft']) ? $existing['last_wa_draft'] : '',
    );

    $score = tkt_mkt_heuristic_lead_score($record);
    $record['ai_score'] = $score['tier'];
    $record['score_numeric'] = $score['score'];

    $saved = tkt_mkt_upsert_item('leads', 'lead_id', $record, true);
    $record['wa_url'] = tkt_mkt_build_wa_url($record['whatsapp'], "Halo Bapak/Ibu {$record['pic_name']} ({$record['company_name']}), kami dari {$business['company_name']} ingin menindaklanjuti rencana {$record['service_category']}.");

    if ($saved['mode'] === 'created') {
        tkt_mkt_log('leads', 'INFO', 'Lead baru ditambahkan: ' . $record['company_name'] . ' (' . $record['ai_score'] . ')', $user['username'], $config);
        tkt_mkt_send_telegram($config, "[Lead Baru - {$record['ai_score']}]\nPT: {$record['company_name']}\nLayanan: {$record['service_category']}\nLokasi: {$record['location']}\nOleh: {$user['username']}");
        tkt_mkt_push_gas_webhook($config, 'lead_upsert', $record);
    } else {
        tkt_mkt_log('leads', 'INFO', 'Lead diperbarui: ' . $record['lead_id'] . ' -> ' . $record['status'], $user['username'], $config);
        tkt_mkt_push_gas_webhook($config, 'lead_upsert', $record);
    }

    tkt_mkt_send_json(array('ok' => true, 'mode' => $saved['mode'], 'item' => $record), 200);
}

if ($action === 'lead_delete') {
    $leadId = tkt_mkt_clean_text(isset($input['lead_id']) ? $input['lead_id'] : '', 40);
    if ($leadId === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'lead_id wajib diisi.'), 400);
    }
    $res = tkt_mkt_delete_item('leads', 'lead_id', $leadId);
    tkt_mkt_log('leads', 'INFO', 'Lead dihapus: ' . $leadId, $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'lead_score_draft') {
    if (!tkt_mkt_check_rate_limit('ai_draft_' . $user['username'], 20, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas permintaan AI sementara tercapai. Tunggu beberapa menit.'), 429);
    }
    $leadId = tkt_mkt_clean_text(isset($input['lead_id']) ? $input['lead_id'] : '', 40);
    $lead = tkt_mkt_find_item('leads', 'lead_id', $leadId);
    if ($lead === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Lead tidak ditemukan.'), 404);
    }
    $result = tkt_mkt_ai_score_and_draft($config, $business, $lead);

    $lead['ai_score'] = $result['ai_score'];
    $lead['score_numeric'] = $result['score_numeric'];
    $lead['last_wa_draft'] = $result['wa_draft'];
    tkt_mkt_upsert_item('leads', 'lead_id', $lead, false);

    $result['wa_url'] = tkt_mkt_build_wa_url(isset($lead['whatsapp']) ? $lead['whatsapp'] : '', $result['wa_draft']);
    tkt_mkt_log('ai_proxy', 'INFO', 'AI draft dibuat untuk ' . $leadId . ' via ' . $result['engine'] . ' (' . $result['model'] . ')', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'draft' => $result), 200);
}

if ($action === 'lead_send_email') {
    $leadId = tkt_mkt_clean_text(isset($input['lead_id']) ? $input['lead_id'] : '', 40);
    $subject = tkt_mkt_clean_text(isset($input['subject']) ? $input['subject'] : '', 180);
    $body = tkt_mkt_clean_multiline(isset($input['body']) ? $input['body'] : '', 4000);
    $lead = tkt_mkt_find_item('leads', 'lead_id', $leadId);
    if ($lead === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Lead tidak ditemukan.'), 404);
    }
    if (empty($lead['email'])) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Lead ini tidak memiliki alamat email.'), 422);
    }
    if ($subject === '' || $body === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Subject dan isi email wajib diisi sebelum mengirim.'), 422);
    }

    $mailRes = tkt_mkt_send_email($config, $business, $lead['email'], $lead['pic_name'], $subject, $body);
    if (empty($mailRes['ok'])) {
        tkt_mkt_log('mailer', 'ERROR', 'Gagal mengirim email ke lead ' . $leadId . ': ' . $mailRes['error'], $user['username'], $config);
        tkt_mkt_send_json(array('ok' => false, 'error' => $mailRes['error']), 500);
    }

    $lead['last_contact_at'] = date('Y-m-d H:i:s');
    if ($lead['status'] === 'New Lead') {
        $lead['status'] = 'Contacted';
    }
    $lead['next_followup_at'] = date('Y-m-d', strtotime('+3 days'));
    tkt_mkt_upsert_item('leads', 'lead_id', $lead, false);
    tkt_mkt_log('mailer', 'INFO', 'Email human-approved terkirim ke lead ' . $leadId, $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'item' => $lead), 200);
}

if ($action === 'pricing_save') {
    $code = tkt_mkt_clean_text(isset($input['item_code']) ? $input['item_code'] : '', 32);
    $existing = $code !== '' ? tkt_mkt_find_item('pricing', 'item_code', $code) : null;
    $name = tkt_mkt_clean_text(isset($input['item_name']) ? $input['item_name'] : '', 120);
    $category = tkt_mkt_clean_text(isset($input['category']) ? $input['category'] : 'Cabling & FO', 60);
    $unit = tkt_mkt_clean_text(isset($input['unit']) ? $input['unit'] : 'titik', 30);
    $minPrice = max(0, (int) (isset($input['min_price_idr']) ? $input['min_price_idr'] : 0));
    $maxPrice = max($minPrice, (int) (isset($input['max_price_idr']) ? $input['max_price_idr'] : $minPrice));

    if ($name === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Nama item layanan/material wajib diisi.'), 422);
    }

    $record = array(
        'item_code'     => $existing !== null ? $existing['item_code'] : ($code !== '' ? strtoupper($code) : tkt_mkt_new_id('PRC')),
        'category'      => $category,
        'item_name'     => $name,
        'unit'          => $unit !== '' ? $unit : 'unit',
        'min_price_idr' => $minPrice,
        'max_price_idr' => $maxPrice,
        'spec_notes'    => tkt_mkt_clean_text(isset($input['spec_notes']) ? $input['spec_notes'] : '', 200),
        'is_active'     => isset($input['is_active']) ? (bool) $input['is_active'] : true,
        'updated_at'    => date('Y-m-d H:i:s'),
    );

    $saved = tkt_mkt_upsert_item('pricing', 'item_code', $record, false);
    tkt_mkt_log('pricing', 'INFO', 'Master harga ' . $saved['mode'] . ': ' . $record['item_code'], $user['username'], $config);
    tkt_mkt_push_gas_webhook($config, 'pricing_upsert', $record);
    tkt_mkt_send_json(array('ok' => true, 'mode' => $saved['mode'], 'item' => $record), 200);
}

if ($action === 'pricing_delete') {
    $code = tkt_mkt_clean_text(isset($input['item_code']) ? $input['item_code'] : '', 32);
    $res = tkt_mkt_delete_item('pricing', 'item_code', $code);
    tkt_mkt_log('pricing', 'INFO', 'Item harga dihapus: ' . $code, $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'pricing_load_starter') {
    $current = tkt_mkt_read_json('pricing', array());
    if (!empty($current)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Daftar harga sudah berisi item. Hapus atau edit langsung di tabel.'), 409);
    }
    // Template kategori standar dengan nominal awal 0 (tidak pernah hardcode harga material!)
    $now = date('Y-m-d H:i:s');
    $starter = array(
        array('item_code' => 'LAN-CAT6', 'category' => 'Structured Cabling', 'item_name' => 'Penarikan Kabel UTP Cat6 + Conduit & Terminasi', 'unit' => 'titik', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif aktual per titik (termasuk jasa & aksesori)', 'is_active' => true, 'updated_at' => $now),
        array('item_code' => 'LAN-CAT6A', 'category' => 'Structured Cabling', 'item_name' => 'Penarikan Kabel UTP Cat6A Shielded + Label TIA-568', 'unit' => 'titik', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif aktual per titik 10GbE', 'is_active' => true, 'updated_at' => $now),
        array('item_code' => 'TEST-FLUKE', 'category' => 'Sertifikasi & Uji', 'item_name' => 'Uji Sertifikasi Fluke DSX CableAnalyzer', 'unit' => 'titik', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif per titik uji + laporan PDF', 'is_active' => true, 'updated_at' => $now),
        array('item_code' => 'FO-SPLICE', 'category' => 'Fiber Optic', 'item_name' => 'Fusion Splicing Fiber Optic + Uji OTDR', 'unit' => 'core', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif per core splicing + OTB/pigtail', 'is_active' => true, 'updated_at' => $now),
        array('item_code' => 'CCTV-IP', 'category' => 'CCTV & Access', 'item_name' => 'Instalasi & Konfigurasi IP CCTV Enterprise PoE', 'unit' => 'kamera', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif instalasi per kamera (di luar unit NVR)', 'is_active' => true, 'updated_at' => $now),
        array('item_code' => 'RACK-TIDY', 'category' => 'Data Center & Rack', 'item_name' => 'Perapihan Rack Server & Patch Panel Labeling', 'unit' => 'rack', 'min_price_idr' => 0, 'max_price_idr' => 0, 'spec_notes' => 'Isi tarif jasa per rack 20U-42U', 'is_active' => true, 'updated_at' => $now),
    );
    tkt_mkt_write_json('pricing', $starter);
    tkt_mkt_log('pricing', 'INFO', 'Template kategori standar (nominal Rp 0) dimuat oleh ' . $user['username'], $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'items' => $starter), 200);
}

if ($action === 'estimate_calculate') {
    $quantities = isset($input['quantities']) && is_array($input['quantities']) ? $input['quantities'] : array();
    $pricing = tkt_mkt_read_json('pricing', array());
    $breakdown = array();
    $totalMin = 0;
    $totalMax = 0;
    $hasZeroPrice = false;

    foreach ($pricing as $item) {
        if (empty($item['is_active'])) {
            continue;
        }
        $code = isset($item['item_code']) ? $item['item_code'] : '';
        $qty = isset($quantities[$code]) ? max(0, (int) $quantities[$code]) : 0;
        if ($qty <= 0) {
            continue;
        }
        $minU = (int) $item['min_price_idr'];
        $maxU = (int) $item['max_price_idr'];
        if ($minU === 0 && $maxU === 0) {
            $hasZeroPrice = true;
        }
        $subMin = $qty * $minU;
        $subMax = $qty * $maxU;
        $totalMin += $subMin;
        $totalMax += $subMax;
        $breakdown[] = array(
            'item_code' => $code,
            'item_name' => $item['item_name'],
            'unit'      => $item['unit'],
            'qty'       => $qty,
            'sub_min'   => $subMin,
            'sub_max'   => $subMax,
        );
    }

    tkt_mkt_send_json(array(
        'ok'             => true,
        'breakdown'      => $breakdown,
        'total_min_idr'  => $totalMin,
        'total_max_idr'  => $totalMax,
        'has_zero_price' => $hasZeroPrice,
    ), 200);
}

if ($action === 'outbound_save') {
    $pid = isset($input['prospect_id']) ? tkt_mkt_clean_text($input['prospect_id'], 40) : '';
    $existing = $pid !== '' ? tkt_mkt_find_item('outbound', 'prospect_id', $pid) : null;
    $company = tkt_mkt_clean_text(isset($input['company_name']) ? $input['company_name'] : '', 120);
    $email = tkt_mkt_clean_text(isset($input['email']) ? $input['email'] : '', 120);

    if ($company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Nama perusahaan dan email target yang valid wajib diisi.'), 422);
    }

    $record = array(
        'prospect_id'      => $existing !== null ? $existing['prospect_id'] : tkt_mkt_new_id('OUT'),
        'segment'          => tkt_mkt_clean_text(isset($input['segment']) ? $input['segment'] : 'IT Manager', 50),
        'company_name'     => $company,
        'pic_name'         => tkt_mkt_clean_text(isset($input['pic_name']) ? $input['pic_name'] : 'Bapak/Ibu', 80),
        'pic_role'         => tkt_mkt_clean_text(isset($input['pic_role']) ? $input['pic_role'] : 'IT / Facility Manager', 80),
        'email'            => $email,
        'whatsapp'         => tkt_mkt_clean_text(isset($input['whatsapp']) ? $input['whatsapp'] : '', 32),
        'trigger_signal'   => tkt_mkt_clean_text(isset($input['trigger_signal']) ? $input['trigger_signal'] : '', 240),
        'ai_draft_subject' => $existing !== null && isset($existing['ai_draft_subject']) ? $existing['ai_draft_subject'] : '',
        'ai_draft_body'    => $existing !== null && isset($existing['ai_draft_body']) ? $existing['ai_draft_body'] : '',
        'approval_status'  => ($existing !== null && !empty($existing['approval_status'])) ? $existing['approval_status'] : 'Draft',
        'sent_at'          => ($existing !== null && isset($existing['sent_at'])) ? $existing['sent_at'] : '',
    );

    $saved = tkt_mkt_upsert_item('outbound', 'prospect_id', $record, true);
    tkt_mkt_log('outbound', 'INFO', 'Target outbound ' . $saved['mode'] . ': ' . $company, $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'mode' => $saved['mode'], 'item' => $record), 200);
}

if ($action === 'outbound_delete') {
    $pid = tkt_mkt_clean_text(isset($input['prospect_id']) ? $input['prospect_id'] : '', 40);
    $res = tkt_mkt_delete_item('outbound', 'prospect_id', $pid);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'outbound_generate_draft') {
    if (!tkt_mkt_check_rate_limit('ai_outbound_' . $user['username'], 20, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas permintaan AI tercapai. Tunggu beberapa menit.'), 429);
    }
    $pid = tkt_mkt_clean_text(isset($input['prospect_id']) ? $input['prospect_id'] : '', 40);
    $prospect = tkt_mkt_find_item('outbound', 'prospect_id', $pid);
    if ($prospect === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Target prospek tidak ditemukan.'), 404);
    }
    $draft = tkt_mkt_ai_outbound_draft($config, $business, $prospect);
    $prospect['ai_draft_subject'] = $draft['subject'];
    $prospect['ai_draft_body'] = $draft['body'];
    $prospect['approval_status'] = 'Ready Review';
    tkt_mkt_upsert_item('outbound', 'prospect_id', $prospect, false);
    tkt_mkt_log('ai_proxy', 'INFO', 'Draf outbound dibuat untuk ' . $pid . ' via ' . $draft['engine'], $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'draft' => $draft, 'item' => $prospect), 200);
}

if ($action === 'outbound_send_approved') {
    $pid = tkt_mkt_clean_text(isset($input['prospect_id']) ? $input['prospect_id'] : '', 40);
    $subject = tkt_mkt_clean_text(isset($input['subject']) ? $input['subject'] : '', 180);
    $body = tkt_mkt_clean_multiline(isset($input['body']) ? $input['body'] : '', 4000);
    $prospect = tkt_mkt_find_item('outbound', 'prospect_id', $pid);
    if ($prospect === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Target prospek tidak ditemukan.'), 404);
    }
    if ($subject === '' || $body === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Subject dan isi email hasil review manusia tidak boleh kosong.'), 422);
    }

    $quotaCheck = tkt_mkt_consume_outbound_quota($config);
    if (empty($quotaCheck['ok'])) {
        tkt_mkt_send_json(array(
            'ok'    => false,
            'error' => 'Batas aman pengiriman outbound harian (' . $quotaCheck['quota']['daily_limit'] . ' email/hari) tercapai untuk menjaga reputasi domain teknotama.com.',
            'quota' => $quotaCheck['quota'],
        ), 429);
    }

    $mailRes = tkt_mkt_send_email($config, $business, $prospect['email'], $prospect['pic_name'], $subject, $body);
    if (empty($mailRes['ok'])) {
        tkt_mkt_log('outbound', 'ERROR', 'Gagal kirim outbound ' . $pid . ': ' . $mailRes['error'], $user['username'], $config);
        tkt_mkt_send_json(array('ok' => false, 'error' => $mailRes['error'], 'quota' => $quotaCheck['quota']), 500);
    }

    $prospect['ai_draft_subject'] = $subject;
    $prospect['ai_draft_body'] = $body;
    $prospect['approval_status'] = 'Sent';
    $prospect['sent_at'] = date('Y-m-d H:i:s');
    tkt_mkt_upsert_item('outbound', 'prospect_id', $prospect, false);
    tkt_mkt_log('outbound', 'INFO', 'Email outbound human-approved terkirim ke ' . $pid, $user['username'], $config);
    tkt_mkt_push_gas_webhook($config, 'outbound_sent', $prospect);
    tkt_mkt_send_json(array('ok' => true, 'item' => $prospect, 'quota' => $quotaCheck['quota']), 200);
}

if ($action === 'casestudy_generate') {
    if (!tkt_mkt_check_rate_limit('ai_cs_' . $user['username'], 15, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas permintaan AI tercapai. Tunggu beberapa menit.'), 429);
    }
    $title = tkt_mkt_clean_text(isset($input['project_title']) ? $input['project_title'] : '', 140);
    $industry = tkt_mkt_clean_text(isset($input['industry']) ? $input['industry'] : '', 80);
    $problem = tkt_mkt_clean_multiline(isset($input['problem_summary']) ? $input['problem_summary'] : '', 500);
    $points = tkt_mkt_clean_text(isset($input['points_count']) ? $input['points_count'] : '', 200);
    $testResult = tkt_mkt_clean_text(isset($input['test_result']) ? $input['test_result'] : '', 200);

    if ($title === '' || $problem === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Judul proyek dan ringkasan masalah wajib diisi.'), 422);
    }

    $generated = tkt_mkt_ai_case_study_and_proposal($config, $business, array(
        'project_title'   => $title,
        'industry'        => $industry !== '' ? $industry : 'Perkantoran Korporat',
        'problem_summary' => $problem,
        'points_count'    => $points !== '' ? $points : 'Instalasi infrastruktur terstruktur',
        'test_result'     => $testResult !== '' ? $testResult : 'Terverifikasi uji fungsi dan pelabelan lengkap',
    ));

    $record = array(
        'case_id'           => tkt_mkt_new_id('CS'),
        'project_title'     => $title,
        'industry'          => $industry !== '' ? $industry : 'Perkantoran Korporat',
        'problem_summary'   => $problem,
        'points_count'      => $points,
        'test_result'       => $testResult,
        'seo_article_draft' => $generated['seo_article_draft'],
        'proposal_outline'  => $generated['proposal_outline'],
        'status'            => 'Draft Siap Review',
        'created_at'        => date('Y-m-d H:i:s'),
    );

    tkt_mkt_upsert_item('case_studies', 'case_id', $record, true);
    tkt_mkt_log('casestudy', 'INFO', 'Studi kasus & proposal dibuat: ' . $record['case_id'] . ' (' . $generated['engine'] . ')', $user['username'], $config);
    tkt_mkt_push_gas_webhook($config, 'casestudy_created', $record);
    tkt_mkt_send_json(array('ok' => true, 'item' => $record, 'engine' => $generated['engine']), 200);
}

if ($action === 'casestudy_delete') {
    $cid = tkt_mkt_clean_text(isset($input['case_id']) ? $input['case_id'] : '', 40);
    $res = tkt_mkt_delete_item('case_studies', 'case_id', $cid);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'business_save') {
    tkt_mkt_require_admin_role($user);
    $updated = array(
        'company_name'      => tkt_mkt_clean_text(isset($input['company_name']) ? $input['company_name'] : $business['company_name'], 120),
        'brand_short'       => tkt_mkt_clean_text(isset($input['brand_short']) ? $input['brand_short'] : $business['brand_short'], 80),
        'domain'            => tkt_mkt_clean_text(isset($input['domain']) ? $input['domain'] : $business['domain'], 120),
        'industry_focus'    => tkt_mkt_clean_text(isset($input['industry_focus']) ? $input['industry_focus'] : $business['industry_focus'], 160),
        'office_address'    => tkt_mkt_clean_text(isset($input['office_address']) ? $input['office_address'] : $business['office_address'], 240),
        'official_email'    => tkt_mkt_clean_text(isset($input['official_email']) ? $input['official_email'] : $business['official_email'], 120),
        'official_phone'    => tkt_mkt_clean_text(isset($input['official_phone']) ? $input['official_phone'] : $business['official_phone'], 40),
        'official_whatsapp' => tkt_mkt_normalize_phone_wa(isset($input['official_whatsapp']) ? $input['official_whatsapp'] : $business['official_whatsapp']),
        'services_summary'  => tkt_mkt_clean_multiline(isset($input['services_summary']) ? $input['services_summary'] : $business['services_summary'], 600),
        'value_proposition' => tkt_mkt_clean_multiline(isset($input['value_proposition']) ? $input['value_proposition'] : $business['value_proposition'], 500),
        'ai_tone'           => tkt_mkt_clean_text(isset($input['ai_tone']) ? $input['ai_tone'] : $business['ai_tone'], 300),
    );
    tkt_mkt_write_json('business', $updated);
    tkt_mkt_log('settings', 'INFO', 'Profil bisnis & modul AI diperbarui', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'business' => $updated), 200);
}

if ($action === 'integrations_save') {
    tkt_mkt_require_admin_role($user);
    $current = tkt_mkt_read_json('integrations', array());
    $newToken = trim((string) (isset($input['telegram_bot_token']) ? $input['telegram_bot_token'] : ''));
    $newSecret = trim((string) (isset($input['gas_shared_secret']) ? $input['gas_shared_secret'] : ''));

    $updated = array(
        'telegram_bot_token'   => $newToken !== '' ? $newToken : (isset($current['telegram_bot_token']) ? $current['telegram_bot_token'] : ''),
        'telegram_chat_id'     => tkt_mkt_clean_text(isset($input['telegram_chat_id']) ? $input['telegram_chat_id'] : '', 60),
        'gas_webhook_url'      => tkt_mkt_clean_text(isset($input['gas_webhook_url']) ? $input['gas_webhook_url'] : '', 260),
        'gas_shared_secret'    => $newSecret !== '' ? $newSecret : (isset($current['gas_shared_secret']) ? $current['gas_shared_secret'] : ''),
        'outbound_daily_limit' => max(1, min(200, (int) (isset($input['outbound_daily_limit']) ? $input['outbound_daily_limit'] : 25))),
        'email_reply_to'       => tkt_mkt_clean_text(isset($input['email_reply_to']) ? $input['email_reply_to'] : $config['email_reply_to'], 120),
        'alert_email_to'       => tkt_mkt_clean_text(isset($input['alert_email_to']) ? $input['alert_email_to'] : $config['alert_email_to'], 120),
    );
    tkt_mkt_write_json('integrations', $updated);
    tkt_mkt_log('settings', 'INFO', 'Pengaturan integrasi Telegram/GAS/Kuota diperbarui', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true), 200);
}

if ($action === 'test_telegram') {
    tkt_mkt_require_admin_role($user);
    $res = tkt_mkt_send_telegram($config, "[Uji Koneksi] Tekno AI Marketing berhasil terhubung ke Telegram Bot.\nDipicu oleh: " . $user['username'] . " (" . date('d M Y H:i') . " WIB)");
    if (empty($res['ok'])) {
        tkt_mkt_send_json(array('ok' => false, 'error' => $res['error']), 400);
    }
    tkt_mkt_log('settings', 'INFO', 'Tes notifikasi Telegram berhasil', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true), 200);
}

if ($action === 'sync_gas') {
    $res = tkt_mkt_push_gas_webhook($config, 'full_snapshot', array(
        'leads'             => tkt_mkt_read_json('leads', array()),
        'pricing'           => tkt_mkt_read_json('pricing', array()),
        'outbound'          => tkt_mkt_read_json('outbound', array()),
        'research_accounts' => tkt_mkt_read_json('research_accounts', array()),
        'market_signals'    => tkt_mkt_read_json('market_signals', array()),
        'case_studies'      => tkt_mkt_read_json('case_studies', array()),
    ));
    if (empty($res['ok'])) {
        tkt_mkt_send_json(array('ok' => false, 'error' => $res['error']), 400);
    }
    tkt_mkt_log('sync', 'INFO', 'Sinkronisasi snapshot ke Google Apps Script berhasil', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true), 200);
}

if ($action === 'research_analyze') {
    if (!tkt_mkt_check_rate_limit('ai_research_' . $user['username'], 25, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas riset AI sementara tercapai. Tunggu beberapa menit.'), 429);
    }

    $researchId = tkt_mkt_clean_text(isset($input['research_id']) ? $input['research_id'] : '', 40);
    $existing = $researchId !== '' ? tkt_mkt_find_item('research_accounts', 'research_id', $researchId) : null;
    $companyName = tkt_mkt_clean_text(isset($input['company_name']) ? $input['company_name'] : ($existing !== null ? $existing['company_name'] : ''), 140);
    $websiteUrl = tkt_mkt_clean_text(isset($input['website_url']) ? $input['website_url'] : ($existing !== null ? $existing['website_url'] : ''), 260);
    $industry = tkt_mkt_clean_text(isset($input['industry']) ? $input['industry'] : ($existing !== null ? $existing['industry'] : ''), 80);
    $notes = tkt_mkt_clean_multiline(isset($input['notes']) ? $input['notes'] : ($existing !== null ? $existing['notes'] : ''), 500);

    if ($companyName === '' && $websiteUrl === '') {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Nama perusahaan atau URL website wajib diisi.'), 422);
    }

    $crawl = array('ok' => false, 'pages_checked' => 0, 'emails' => array(), 'phones' => array(), 'locations' => array(), 'error' => '');
    if ($websiteUrl !== '') {
        $crawl = tkt_mkt_fetch_company_public_pages($websiteUrl);
        if (empty($crawl['ok']) && strpos((string) $crawl['error'], 'SSRF') !== false) {
            tkt_mkt_log('research', 'WARN', 'Percobaan URL terlarang diblokir: ' . $websiteUrl, $user['username'], $config);
            tkt_mkt_send_json(array('ok' => false, 'error' => $crawl['error']), 422);
        }
        if ($companyName === '' && !empty($crawl['host'])) {
            $companyName = ucfirst(preg_replace('/^www\./i', '', $crawl['host']));
        }
    }

    $analysis = tkt_mkt_analyze_company_account($config, $business, array(
        'company_name' => $companyName,
        'industry'     => $industry,
        'notes'        => $notes,
    ), $crawl);

    $record = array(
        'research_id'               => $existing !== null ? $existing['research_id'] : tkt_mkt_new_id('RES'),
        'created_at'                => $existing !== null ? $existing['created_at'] : date('Y-m-d H:i:s'),
        'company_name'              => $companyName,
        'website_url'               => !empty($crawl['url']) ? $crawl['url'] : ($websiteUrl !== '' ? tkt_mkt_normalize_target_url($websiteUrl) : ''),
        'industry'                  => $industry !== '' ? $industry : 'Korporat B2B',
        'notes'                     => $notes,
        'crawl_ok'                  => !empty($crawl['ok']),
        'crawl_note'                => !empty($crawl['ok']) ? ('Berhasil membaca ' . $crawl['pages_checked'] . ' halaman publik') : (isset($crawl['error']) && $crawl['error'] !== '' ? $crawl['error'] : 'Analisa dari profil input'),
        'emails_found'              => isset($crawl['emails']) ? $crawl['emails'] : array(),
        'phones_found'              => isset($crawl['phones']) ? $crawl['phones'] : array(),
        'locations_found'           => isset($crawl['locations']) ? $crawl['locations'] : array(),
        'icp_score'                 => $analysis['icp_score'],
        'icp_tier'                  => $analysis['icp_tier'],
        'company_summary'           => $analysis['company_summary'],
        'it_infrastructure_signals' => $analysis['it_infrastructure_signals'],
        'pain_points'               => $analysis['pain_points'],
        'decision_maker_roles'      => $analysis['decision_maker_roles'],
        'recommended_entry_offer'   => $analysis['recommended_entry_offer'],
        'approach_strategy'         => $analysis['approach_strategy'],
        'engine'                    => $analysis['engine'],
        'status'                    => ($existing !== null && !empty($existing['status'])) ? $existing['status'] : 'Analyzed',
    );

    tkt_mkt_upsert_item('research_accounts', 'research_id', $record, true);
    tkt_mkt_log('research', 'INFO', 'Riset akun selesai: ' . $record['company_name'] . ' (ICP ' . $record['icp_score'] . ')', $user['username'], $config);
    tkt_mkt_push_gas_webhook($config, 'research_upsert', $record);
    tkt_mkt_send_json(array('ok' => true, 'item' => $record), 200);
}

if ($action === 'research_batch_import') {
    $rawRows = isset($input['rows']) && is_array($input['rows']) ? $input['rows'] : array();
    if (empty($rawRows)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Daftar perusahaan kosong.'), 422);
    }

    $added = 0;
    foreach (array_slice($rawRows, 0, 20) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $comp = tkt_mkt_clean_text(isset($row['company_name']) ? $row['company_name'] : '', 140);
        $url = tkt_mkt_clean_text(isset($row['website_url']) ? $row['website_url'] : '', 260);
        $ind = tkt_mkt_clean_text(isset($row['industry']) ? $row['industry'] : '', 80);
        if ($comp === '' && $url === '') {
            continue;
        }
        if ($url !== '') {
            $urlCheck = tkt_mkt_validate_public_url($url);
            if (empty($urlCheck['ok'])) {
                continue;
            }
            $url = $urlCheck['url'];
            if ($comp === '') {
                $comp = ucfirst(preg_replace('/^www\./i', '', $urlCheck['host']));
            }
        }
        $heur = tkt_mkt_heuristic_company_icp($comp, $ind, '', false);
        $rec = array(
            'research_id'               => tkt_mkt_new_id('RES'),
            'created_at'                => date('Y-m-d H:i:s'),
            'company_name'              => $comp,
            'website_url'               => $url,
            'industry'                  => $ind !== '' ? $ind : 'Korporat B2B',
            'notes'                     => tkt_mkt_clean_text(isset($row['notes']) ? $row['notes'] : 'Diimpor dari batch CSV', 300),
            'crawl_ok'                  => false,
            'crawl_note'                => 'Siap diriset — klik Analisa AI untuk membaca situs publik',
            'emails_found'              => array(),
            'phones_found'              => array(),
            'locations_found'           => array(),
            'icp_score'                 => $heur['score'],
            'icp_tier'                  => $heur['tier'],
            'company_summary'           => 'Menunggu analisa website & profil mendalam.',
            'it_infrastructure_signals' => $heur['signals'],
            'pain_points'               => array(),
            'decision_maker_roles'      => array('IT Manager', 'GA Manager'),
            'recommended_entry_offer'   => 'Free Site Survey & Technical Audit',
            'approach_strategy'         => 'Klik Analisa AI terlebih dahulu untuk memindai profil website resmi.',
            'engine'                    => 'batch_queue',
            'status'                    => 'Queued',
        );
        tkt_mkt_upsert_item('research_accounts', 'research_id', $rec, true);
        $added++;
    }

    tkt_mkt_log('research', 'INFO', 'Impor batch riset: ' . $added . ' perusahaan ditambahkan ke antrean', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'added' => $added), 200);
}

if ($action === 'research_delete') {
    $rid = tkt_mkt_clean_text(isset($input['research_id']) ? $input['research_id'] : '', 40);
    $res = tkt_mkt_delete_item('research_accounts', 'research_id', $rid);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'research_promote_outbound') {
    $rid = tkt_mkt_clean_text(isset($input['research_id']) ? $input['research_id'] : '', 40);
    $account = tkt_mkt_find_item('research_accounts', 'research_id', $rid);
    if ($account === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Data riset perusahaan tidak ditemukan.'), 404);
    }

    $email = tkt_mkt_clean_text(isset($input['email']) ? $input['email'] : (!empty($account['emails_found'][0]) ? $account['emails_found'][0] : ''), 120);
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Email target belum ditemukan otomatis di website. Masukkan alamat email resmi perusahaan untuk masuk ke Outbound Console.'), 422);
    }

    $segment = tkt_mkt_clean_text(isset($input['segment']) ? $input['segment'] : 'IT Manager / Head of Infra', 60);
    $picName = tkt_mkt_clean_text(isset($input['pic_name']) ? $input['pic_name'] : 'Tim Manajemen / IT', 80);
    $picRole = tkt_mkt_clean_text(isset($input['pic_role']) ? $input['pic_role'] : (!empty($account['decision_maker_roles'][0]) ? $account['decision_maker_roles'][0] : 'IT Manager'), 80);
    $wa = tkt_mkt_clean_text(isset($input['whatsapp']) ? $input['whatsapp'] : (!empty($account['phones_found'][0]) ? $account['phones_found'][0] : ''), 32);
    $trigger = tkt_mkt_clean_text('Riset ICP ' . $account['icp_score'] . ' (' . $account['industry'] . '): ' . implode('; ', array_slice($account['it_infrastructure_signals'], 0, 2)), 240);

    $prospect = array(
        'prospect_id'      => tkt_mkt_new_id('OUT'),
        'segment'          => $segment,
        'company_name'     => $account['company_name'],
        'pic_name'         => $picName,
        'pic_role'         => $picRole,
        'email'            => $email,
        'whatsapp'         => $wa,
        'trigger_signal'   => $trigger,
        'ai_draft_subject' => '',
        'ai_draft_body'    => '',
        'approval_status'  => 'Draft',
        'sent_at'          => '',
    );

    $draft = tkt_mkt_ai_outbound_draft($config, $business, $prospect);
    $prospect['ai_draft_subject'] = $draft['subject'];
    $prospect['ai_draft_body'] = $draft['body'];
    $prospect['approval_status'] = 'Ready Review';

    tkt_mkt_upsert_item('outbound', 'prospect_id', $prospect, true);
    $account['status'] = 'Promoted Outbound';
    tkt_mkt_upsert_item('research_accounts', 'research_id', $account, false);

    tkt_mkt_log('research', 'INFO', 'Akun riset dipromosikan ke Outbound Console: ' . $account['company_name'], $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'prospect' => $prospect), 200);
}

if ($action === 'research_promote_lead') {
    $rid = tkt_mkt_clean_text(isset($input['research_id']) ? $input['research_id'] : '', 40);
    $account = tkt_mkt_find_item('research_accounts', 'research_id', $rid);
    if ($account === null) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Data riset perusahaan tidak ditemukan.'), 404);
    }

    $email = !empty($account['emails_found'][0]) ? $account['emails_found'][0] : '';
    $phone = !empty($account['phones_found'][0]) ? $account['phones_found'][0] : '';
    $loc = !empty($account['locations_found'][0]) ? $account['locations_found'][0] : 'Indonesia';

    $leadRecord = array(
        'lead_id'          => tkt_mkt_new_id('LD'),
        'created_at'       => date('Y-m-d H:i:s'),
        'source'           => 'research_ai',
        'company_name'     => $account['company_name'],
        'pic_name'         => !empty($account['decision_maker_roles'][0]) ? $account['decision_maker_roles'][0] : 'Tim IT / GA',
        'email'            => $email,
        'whatsapp'         => $phone,
        'location'         => $loc,
        'service_category' => 'Fiber Optic & LAN Cat6/Cat6A',
        'boq_summary'      => implode(' | ', array_slice($account['it_infrastructure_signals'], 0, 2)),
        'status'           => 'New Lead',
        'next_followup_at' => date('Y-m-d'),
        'last_contact_at'  => '',
        'notes'            => "Sumber: Riset AI ({$account['website_url']})\nICP: {$account['icp_score']} ({$account['icp_tier']})\nRekomendasi: {$account['recommended_entry_offer']}",
        'last_wa_draft'    => '',
        'ai_score'         => ($account['icp_score'] >= 75) ? 'High' : (($account['icp_score'] >= 55) ? 'Medium' : 'Low'),
        'score_numeric'    => (int) $account['icp_score'],
    );

    tkt_mkt_upsert_item('leads', 'lead_id', $leadRecord, true);
    $account['status'] = 'Promoted CRM';
    tkt_mkt_upsert_item('research_accounts', 'research_id', $account, false);
    tkt_mkt_log('research', 'INFO', 'Akun riset masuk ke Lead Pipeline: ' . $account['company_name'], $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'lead' => $leadRecord), 200);
}

if ($action === 'rss_feed_save') {
    $label = tkt_mkt_clean_text(isset($input['label']) ? $input['label'] : '', 60);
    $feedUrl = tkt_mkt_clean_text(isset($input['feed_url']) ? $input['feed_url'] : '', 300);
    $keywords = tkt_mkt_clean_text(isset($input['keywords']) ? $input['keywords'] : tkt_mkt_default_signal_keywords(), 300);

    $check = tkt_mkt_validate_public_url($feedUrl);
    if (empty($check['ok'])) {
        tkt_mkt_send_json(array('ok' => false, 'error' => $check['error']), 422);
    }

    $record = array(
        'feed_id'      => tkt_mkt_new_id('RSS'),
        'label'        => $label !== '' ? $label : $check['host'],
        'feed_url'     => $check['url'],
        'keywords'     => $keywords !== '' ? $keywords : tkt_mkt_default_signal_keywords(),
        'last_scan_at' => '',
        'active'       => true,
    );
    tkt_mkt_upsert_item('rss_feeds', 'feed_id', $record, true);
    tkt_mkt_log('rss', 'INFO', 'Feed RSS Radar ditambahkan: ' . $record['label'], $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'item' => $record), 200);
}

if ($action === 'rss_feed_delete') {
    $fid = tkt_mkt_clean_text(isset($input['feed_id']) ? $input['feed_id'] : '', 40);
    $res = tkt_mkt_delete_item('rss_feeds', 'feed_id', $fid);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'rss_scan_now') {
    if (!tkt_mkt_check_rate_limit('rss_scan_' . $user['username'], 15, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas scan RSS sementara tercapai. Tunggu beberapa menit.'), 429);
    }

    $feeds = tkt_mkt_read_json('rss_feeds', array());
    if (empty($feeds)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Tambahkan minimal 1 URL RSS / Google Alerts terlebih dahulu.'), 422);
    }

    $existingSignals = tkt_mkt_read_json('market_signals', array());
    $byId = array();
    foreach ($existingSignals as $sig) {
        if (!empty($sig['signal_id'])) {
            $byId[$sig['signal_id']] = $sig;
        }
    }

    $newCount = 0;
    $scanErrors = array();
    foreach ($feeds as $idx => $feed) {
        if (empty($feed['active'])) {
            continue;
        }
        $resp = tkt_mkt_fetch_public_http($feed['feed_url'], 260000, 6);
        if (empty($resp['ok'])) {
            $scanErrors[] = $feed['label'] . ': ' . $resp['error'];
            continue;
        }
        $parsed = tkt_mkt_parse_rss_xml($resp['body'], $feed['keywords'], $feed['label']);
        foreach ($parsed as $sig) {
            if (!isset($byId[$sig['signal_id']])) {
                $newCount++;
            }
            $byId[$sig['signal_id']] = $sig;
        }
        $feeds[$idx]['last_scan_at'] = date('Y-m-d H:i:s');
    }

    $merged = array_values($byId);
    usort($merged, function ($a, $b) {
        return ($b['relevance_score'] <=> $a['relevance_score']) ?: strcmp($b['published_at'], $a['published_at']);
    });
    if (count($merged) > 80) {
        $merged = array_slice($merged, 0, 80);
    }

    tkt_mkt_write_json('rss_feeds', $feeds);
    tkt_mkt_write_json('market_signals', $merged);
    tkt_mkt_log('rss', 'INFO', 'Scan RSS Radar selesai (' . $newCount . ' sinyal baru)', $user['username'], $config);
    tkt_mkt_send_json(array(
        'ok'          => true,
        'new_count'   => $newCount,
        'total'       => count($merged),
        'scan_errors' => $scanErrors,
    ), 200);
}

if ($action === 'signal_delete') {
    $sid = tkt_mkt_clean_text(isset($input['signal_id']) ? $input['signal_id'] : '', 40);
    $res = tkt_mkt_delete_item('market_signals', 'signal_id', $sid);
    tkt_mkt_send_json(array('ok' => true, 'deleted' => $res['deleted']), 200);
}

if ($action === 'funnel_traffic_save') {
    $traffic = array(
        'web_visits'          => max(0, (int) (isset($input['web_visits']) ? $input['web_visits'] : 0)),
        'boq_calculator_uses' => max(0, (int) (isset($input['boq_calculator_uses']) ? $input['boq_calculator_uses'] : 0)),
        'period_label'        => tkt_mkt_clean_text(isset($input['period_label']) ? $input['period_label'] : 'Bulan Berjalan', 50),
        'updated_at'          => date('Y-m-d H:i:s'),
    );
    tkt_mkt_write_json('funnel_traffic', $traffic);
    tkt_mkt_log('funnel', 'INFO', 'Metrik traffic TOFU diperbarui (' . $traffic['period_label'] . ')', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'traffic' => $traffic), 200);
}

if ($action === 'funnel_ai_coach') {
    if (!tkt_mkt_check_rate_limit('ai_funnel_' . $user['username'], 15, 600)) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Batas permintaan AI Funnel Coach tercapai. Tunggu beberapa menit.'), 429);
    }
    $stats = tkt_mkt_compute_funnel_stats(
        tkt_mkt_read_json('leads', array()),
        tkt_mkt_read_json('outbound', array()),
        tkt_mkt_read_json('research_accounts', array()),
        tkt_mkt_read_json('market_signals', array()),
        tkt_mkt_read_json('funnel_traffic', array())
    );
    $coach = tkt_mkt_ai_funnel_coach($config, $business, $stats);
    tkt_mkt_log('funnel', 'INFO', 'Diagnosa Funnel AI dijalankan (' . $coach['engine'] . ')', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true, 'coach' => $coach), 200);
}

if ($action === 'user_save') {
    tkt_mkt_require_admin_role($user);
    $username = strtolower(preg_replace('/[^a-zA-Z0-9._-]/', '', trim((string) (isset($input['username']) ? $input['username'] : ''))));
    $fullName = tkt_mkt_clean_text(isset($input['full_name']) ? $input['full_name'] : '', 80);
    $role = (isset($input['role']) && $input['role'] === 'admin') ? 'admin' : 'staff';
    $password = isset($input['password']) ? (string) $input['password'] : '';

    if (strlen($username) < 3 || strlen($password) < 8) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Username minimal 3 karakter dan password minimal 8 karakter.'), 422);
    }

    $users = tkt_mkt_load_users();
    foreach ($users as $u) {
        if (isset($u['username']) && $u['username'] === $username) {
            tkt_mkt_send_json(array('ok' => false, 'error' => 'Username sudah terdaftar.'), 409);
        }
    }

    $record = array(
        'user_id'       => tkt_mkt_new_id('USR'),
        'username'      => $username,
        'full_name'     => $fullName !== '' ? $fullName : $username,
        'role'          => $role,
        'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        'active'        => true,
        'created_at'    => date('Y-m-d H:i:s'),
        'last_login_at' => '',
    );
    $users[] = $record;
    tkt_mkt_write_json('users', $users);
    tkt_mkt_log('users', 'INFO', 'Akun staf baru dibuat: ' . $username . ' (' . $role . ')', $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true), 200);
}

if ($action === 'user_toggle') {
    tkt_mkt_require_admin_role($user);
    $uid = tkt_mkt_clean_text(isset($input['user_id']) ? $input['user_id'] : '', 40);
    if ($uid === $user['user_id']) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang login.'), 422);
    }
    $users = tkt_mkt_load_users();
    $found = false;
    foreach ($users as $idx => $u) {
        if (isset($u['user_id']) && $u['user_id'] === $uid) {
            $users[$idx]['active'] = empty($u['active']);
            $found = true;
            break;
        }
    }
    if (!$found) {
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Pengguna tidak ditemukan.'), 404);
    }
    tkt_mkt_write_json('users', $users);
    tkt_mkt_log('users', 'INFO', 'Status pengguna diubah: ' . $uid, $user['username'], $config);
    tkt_mkt_send_json(array('ok' => true), 200);
}

tkt_mkt_send_json(array('ok' => false, 'error' => 'Action tidak dikenal.'), 400);

/* ============================================================================
 * EKSPOR CSV (MICROSOFT EXCEL & GOOGLE SHEETS READY)
 * ============================================================================ */

function tkt_mkt_handle_export_csv($user)
{
    $module = isset($_GET['module']) ? trim((string) $_GET['module']) : 'leads';
    $schemas = array(
        'leads' => array(
            'store' => 'leads',
            'cols'  => array('lead_id', 'created_at', 'source', 'company_name', 'pic_name', 'email', 'whatsapp', 'location', 'service_category', 'boq_summary', 'ai_score', 'score_numeric', 'status', 'next_followup_at', 'last_contact_at', 'notes'),
        ),
        'pricing' => array(
            'store' => 'pricing',
            'cols'  => array('item_code', 'category', 'item_name', 'unit', 'min_price_idr', 'max_price_idr', 'spec_notes', 'is_active', 'updated_at'),
        ),
        'outbound' => array(
            'store' => 'outbound',
            'cols'  => array('prospect_id', 'segment', 'company_name', 'pic_name', 'pic_role', 'email', 'whatsapp', 'trigger_signal', 'ai_draft_subject', 'approval_status', 'sent_at'),
        ),
        'research' => array(
            'store' => 'research_accounts',
            'cols'  => array('research_id', 'created_at', 'company_name', 'website_url', 'industry', 'icp_score', 'icp_tier', 'emails_found', 'phones_found', 'locations_found', 'recommended_entry_offer', 'approach_strategy', 'status'),
        ),
        'signals' => array(
            'store' => 'market_signals',
            'cols'  => array('signal_id', 'published_at', 'source_label', 'title', 'link', 'matched_keywords', 'relevance_score', 'status'),
        ),
        'casestudies' => array(
            'store' => 'case_studies',
            'cols'  => array('case_id', 'project_title', 'industry', 'problem_summary', 'points_count', 'test_result', 'status', 'created_at'),
        ),
        'logs' => array(
            'store' => 'logs',
            'cols'  => array('log_id', 'created_at', 'module', 'level', 'actor', 'message'),
        ),
    );

    if (!isset($schemas[$module])) {
        tkt_mkt_send_security_headers(true);
        tkt_mkt_send_json(array('ok' => false, 'error' => 'Modul ekspor tidak valid.'), 400);
    }

    $spec = $schemas[$module];
    $rows = tkt_mkt_read_json($spec['store'], array());
    $filename = 'teknotama_' . $module . '_' . date('Ymd_His') . '.csv';

    header('X-Robots-Tag: noindex, nofollow, noarchive');
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    $out = fopen('php://output', 'w');
    // UTF-8 BOM agar Microsoft Excel otomatis mengenali karakter Unicode & pemisah koma
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, $spec['cols']);

    foreach ($rows as $row) {
        $line = array();
        foreach ($spec['cols'] as $col) {
            $val = isset($row[$col]) ? $row[$col] : '';
            if (is_array($val)) {
                $val = implode('; ', $val);
            } elseif (is_bool($val)) {
                $val = $val ? 'ACTIVE' : 'INACTIVE';
            }
            $line[] = tkt_mkt_csv_safe_cell($val);
        }
        fputcsv($out, $line);
    }
    fclose($out);
    tkt_mkt_log('export', 'INFO', 'Ekspor CSV modul ' . $module . ' (' . count($rows) . ' baris)', $user['username'], null);
}
