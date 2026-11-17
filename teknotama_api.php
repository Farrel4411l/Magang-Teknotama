<?php
/**
 * Teknotama Production API Endpoint (PHP 7.2+ Compatible)
 * Menangani:
 *  - ?action=health   : Status kesiapan API & provider AI (tanpa membocorkan kunci)
 *  - ?action=chat     : AI Technical Field Engineer Chatbot (Multi-Provider Failover + Local Engine)
 *  - ?action=booking  : Pengiriman Formulir Survei & BOQ ke email resmi admin@teknotama.com
 */

error_reporting(0);
@ini_set('display_errors', '0');

define('TEKNOTAMA_API_INTERNAL', true);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

teknotama_apply_cors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = teknotama_load_config();
$action = isset($_GET['action']) ? trim((string) $_GET['action']) : '';

if ($action === 'health') {
    teknotama_send_json(array(
        'ok' => true,
        'php_version' => PHP_VERSION,
        'curl_available' => function_exists('curl_init'),
        'providers' => array(
            'groq' => !empty($config['groq_api_key']),
            'gemini' => !empty($config['gemini_api_key']),
            'openrouter' => !empty($config['openrouter_api_key']),
            'cohere' => !empty($config['cohere_api_key']) && !empty($config['enable_cohere']),
            'local_engine' => true,
        ),
        'booking_target' => $config['booking_email_to'],
    ), 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    teknotama_send_json(array(
        'ok' => false,
        'error' => 'Method not allowed. Gunakan POST.',
    ), 405);
}

$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true);
if (!is_array($input)) {
    teknotama_send_json(array(
        'ok' => false,
        'error' => 'Payload JSON tidak valid.',
    ), 400);
}

if ($action === 'chat') {
    teknotama_handle_chat($config, $input);
} elseif ($action === 'booking') {
    teknotama_handle_booking($config, $input);
} else {
    teknotama_send_json(array(
        'ok' => false,
        'error' => 'Action tidak dikenal.',
    ), 400);
}

/* ============================================================================
 * KONFIGURASI & KEAMANAN DASAR
 * ============================================================================ */

function teknotama_load_config()
{
    $defaults = array(
        'groq_api_key'       => getenv('TEKNOTAMA_GROQ_KEY') ?: '',
        'gemini_api_key'     => getenv('TEKNOTAMA_GEMINI_KEY') ?: '',
        'openrouter_api_key' => getenv('TEKNOTAMA_OPENROUTER_KEY') ?: '',
        'cohere_api_key'     => getenv('TEKNOTAMA_COHERE_KEY') ?: '',
        'enable_cohere'      => false,
        'booking_email_to'   => 'admin@teknotama.com',
        'booking_email_from' => 'noreply@teknotama.com',
        'whatsapp_number'    => '6285167694457',
    );

    $secretsFile = __DIR__ . '/teknotama_secrets.php';
    if (is_file($secretsFile) && is_readable($secretsFile)) {
        $loaded = include $secretsFile;
        if (is_array($loaded)) {
            $defaults = array_merge($defaults, $loaded);
        }
    }

    return $defaults;
}

function teknotama_apply_cors()
{
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin === '') {
        return;
    }

    $parsed = parse_url($origin);
    $host = isset($parsed['host']) ? strtolower($parsed['host']) : '';
    $serverHost = isset($_SERVER['HTTP_HOST']) ? strtolower(preg_replace('/:\d+$/', '', (string) $_SERVER['HTTP_HOST'])) : '';

    $allowedHosts = array('teknotama.com', 'www.teknotama.com', 'localhost', '127.0.0.1');
    if ($serverHost !== '') {
        $allowedHosts[] = $serverHost;
    }

    if (in_array($host, $allowedHosts, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

function teknotama_send_json($data, $statusCode)
{
    http_response_code((int) $statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function teknotama_get_client_ip()
{
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[0]);
    }
    return isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
}

function teknotama_check_rate_limit($bucket, $maxRequests, $windowSeconds)
{
    $tmpDir = sys_get_temp_dir();
    if (!$tmpDir || !is_writable($tmpDir)) {
        return true;
    }

    $ipHash = substr(hash('sha256', teknotama_get_client_ip() . '|teknotama_rl'), 0, 24);
    $file = rtrim($tmpDir, '/\\') . DIRECTORY_SEPARATOR . 'tkt_rl_' . $bucket . '_' . $ipHash . '.json';
    $now = time();
    $timestamps = array();

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        $decoded = json_decode((string) $raw, true);
        if (is_array($decoded)) {
            foreach ($decoded as $ts) {
                if (is_int($ts) && ($now - $ts) < $windowSeconds) {
                    $timestamps[] = $ts;
                }
            }
        }
    }

    if (count($timestamps) >= $maxRequests) {
        return false;
    }

    $timestamps[] = $now;
    @file_put_contents($file, json_encode($timestamps), LOCK_EX);
    return true;
}

/* ============================================================================
 * HANDLER AI CHATBOT TEKNIS LAPANGAN (?action=chat)
 * ============================================================================ */

function teknotama_handle_chat($config, $input)
{
    if (!teknotama_check_rate_limit('chat', 30, 600)) {
        teknotama_send_json(array(
            'ok' => false,
            'error' => 'Batas konsultasi sementara tercapai. Silakan tunggu beberapa menit atau lanjutkan melalui Formulir Survei.',
        ), 429);
    }

    $userMessage = isset($input['message']) ? trim((string) $input['message']) : '';
    if ($userMessage === '') {
        teknotama_send_json(array(
            'ok' => false,
            'error' => 'Pesan tidak boleh kosong.',
        ), 400);
    }

    if (strlen($userMessage) > 2000) {
        $userMessage = substr($userMessage, 0, 2000);
    }

    $history = teknotama_sanitize_history(isset($input['history']) ? $input['history'] : array());
    $calcContext = isset($input['calculator_context']) && is_array($input['calculator_context'])
        ? $input['calculator_context']
        : array();

    $systemPrompt = teknotama_build_system_prompt($calcContext);

    $reply = null;
    $usedEngine = 'local_expert';
    $usedModel = 'teknotama-sop-engine-v1';

    if (function_exists('curl_init')) {
        // 1. Primary: Groq (Sangat cepat & akurat untuk Bahasa Indonesia)
        if ($reply === null && !empty($config['groq_api_key'])) {
            $res = teknotama_call_groq($config['groq_api_key'], $systemPrompt, $history, $userMessage);
            if ($res !== null) {
                $reply = $res['text'];
                $usedEngine = 'groq';
                $usedModel = $res['model'];
            }
        }

        // 2. Failover 1: Google Gemini
        if ($reply === null && !empty($config['gemini_api_key'])) {
            $res = teknotama_call_gemini($config['gemini_api_key'], $systemPrompt, $history, $userMessage);
            if ($res !== null) {
                $reply = $res['text'];
                $usedEngine = 'gemini';
                $usedModel = $res['model'];
            }
        }

        // 3. Failover 2: OpenRouter Free Router
        if ($reply === null && !empty($config['openrouter_api_key'])) {
            $res = teknotama_call_openrouter($config['openrouter_api_key'], $systemPrompt, $history, $userMessage);
            if ($res !== null) {
                $reply = $res['text'];
                $usedEngine = 'openrouter';
                $usedModel = $res['model'];
            }
        }

        // 4. Optional Failover 3: Cohere (hanya jika diaktifkan eksplisit)
        if ($reply === null && !empty($config['enable_cohere']) && !empty($config['cohere_api_key'])) {
            $res = teknotama_call_cohere($config['cohere_api_key'], $systemPrompt, $history, $userMessage);
            if ($res !== null) {
                $reply = $res['text'];
                $usedEngine = 'cohere';
                $usedModel = $res['model'];
            }
        }
    }

    // 5. Guaranteed Zero-Downtime Fallback: Mesin Pakar SOP Teknis Lokal
    if ($reply === null || trim($reply) === '') {
        $reply = teknotama_local_technical_engine($userMessage, $calcContext);
        $usedEngine = 'local_expert';
        $usedModel = 'teknotama-sop-engine-v1';
    }

    $actions = teknotama_extract_suggested_actions($userMessage, $reply);

    teknotama_send_json(array(
        'ok' => true,
        'reply' => $reply,
        'engine' => $usedEngine,
        'model' => $usedModel,
        'suggested_actions' => $actions,
    ), 200);
}

function teknotama_sanitize_history($rawHistory)
{
    if (!is_array($rawHistory)) {
        return array();
    }

    $clean = array();
    $slice = array_slice($rawHistory, -10);
    foreach ($slice as $item) {
        if (!is_array($item)) {
            continue;
        }
        $role = isset($item['role']) ? (string) $item['role'] : '';
        $content = isset($item['content']) ? trim((string) $item['content']) : '';
        if (($role === 'user' || $role === 'assistant') && $content !== '') {
            if (strlen($content) > 1500) {
                $content = substr($content, 0, 1500);
            }
            $clean[] = array('role' => $role, 'content' => $content);
        }
    }
    return $clean;
}

function teknotama_build_system_prompt($calcContext)
{
    $prompt = "Anda adalah **TeknoAssist**, Senior Solutions Architect & Field Execution Engineer di **PT Teknotama Prakarsa Mulia** (`teknotama.com`).\n"
        . "Tugas utama Anda adalah membantu calon klien melakukan **konsultasi teknis & pre-booking triage** sebelum mereka mengirim Formulir Survei / Penawaran ke `admin@teknotama.com`.\n\n"
        . "### IDENTITAS & FAKTA PERUSAHAAN\n"
        . "- Nama: PT Teknotama Prakarsa Mulia (berdiri sejak 2021).\n"
        . "- Kantor: Infiniti Office, Belleza BSA, 1st Floor Unit 106, Jl. Letjen Soepeno, Grogol Utara, Jakarta Selatan 12210.\n"
        . "- Kontak Resmi: Email `admin@teknotama.com`, Telepon `+62-21 58905002`, WhatsApp NOC/Sales `+62 851-6769-4457`.\n"
        . "- Layanan Utama: Enterprise Network & Structured Cabling (UTP/Fiber Optic), Data Center & Cloud Virtualization (VMware ESXi/Proxmox/AWS), Cybersecurity Perimeter (Fortinet/Palo Alto NGFW, IPsec VPN, IPS/IDS), Managed IT & NOC 24/7, Smart Office & IP Surveillance (CCTV HD/4K, NVR, Biometric/RFID Door Access), serta Pengadaan Hardware Resmi.\n"
        . "- Jaminan & Cakupan: Garansi penataan kabel terstruktur 1 tahun, garansi hardware resmi distributor 1-3 tahun, respons emergency NOC < 2 jam (Jabodetabek), melayani proyek di seluruh Indonesia.\n\n"
        . "### SOP TEKNIS EKSEKUSI LAPANGAN TEKNOTAMA (WAJIB DIKUASAI)\n"
        . "1. **Audit & Site Survey**: Cek rute shaft/riser vertikal antar lantai, kondisi plafon/drop ceiling, posisi ruang server (MDF) & sub-rack lantai (IDF), ketersediaan power/grounding, dan izin kerja Building Management.\n"
        . "2. **Standar Kabel Horizontal (ANSI/TIA-568)**: Panjang UTP Cat6/Cat6A maksimal **90m permanent link** (+10m patch cord). Jarak kabel data dan kabel listrik minimal 30 cm (persilangan wajib 90 derajat). Bend radius minimal 4x diameter kabel.\n"
        . "3. **Fiber Optic Backbone**: Untuk tarikan >90m, antar lantai, atau antar gedung. Menggunakan FO Singlemode OS2 atau Multimode OM3/OM4 (Armored untuk area gudang/outdoor), terminasi di **OTB/Patch Panel FO**, Fusion Splicing (toleransi loss < 0.1 dB), uplink **SFP/SFP+ 1G/10G**.\n"
        . "4. **Proteksi Jalur & Kerapihan Rack**: Wajib memakai Pipa Conduit High-Impact (20/25mm) di plafon, Galvanized Cable Tray/Wiremesh (kapasitas isi maks 40-50%), Flexible Conduit di titik turun, Patch Panel Modular 24-Port, Horizontal/Vertical Cable Manager, Blank Panel, dan **Thermal Wrap-Around Labeling (TIA-606-B)** di kedua ujung.\n"
        . "5. **Eksekusi Zero-Downtime**: Perangkat (Router, Switch, Firewall, AP, NVR) di-*staging* & *pre-configure* lebih dulu di workshop Teknotama. Penarikan kasar/pengeboran berisik dikerjakan di luar jam operasional (*night shift*/akhir pekan) sehingga kantor tetap produktif.\n"
        . "6. **Testing & Serah Terima**: Wajib uji sertifikasi **Fluke Cable Certifier** (UTP) dan **OTDR + OPM** (Fiber Optic), pembuatan **As-Built Drawing Topologi & Rack Elevation**, serta penandatanganan **UAT (User Acceptance Test)**.\n"
        . "7. **Segregasi Keamanan & CCTV**: Pisahkan VLAN (Management, Staff, Guest, CCTV/IoT, Server). Perhitungan NVR memakai estimasi codec H.265+ agar hemat disk namun tetap tajam, serta **Online Sinewave UPS** untuk menjaga kestabilan perangkat.\n\n"
        . "### ATURAN ADAPTASI USER & GUARDRAILS KETAT\n"
        . "- **Adaptasi Profil Penanya**: Jika penanya awam/pemilik bisnis, jelaskan manfaat praktis dengan bahasa mudah dipahami terlebih dulu. Jika penanya IT Manager/Engineer, langsung bahas spesifikasi, port, PoE budget, VLAN, standar TIA/EIA, dan cutover. Jika Procurement, tekankan item BOQ (tanpa harga), deliverables dokumentasi, dan estimasi durasi.\n"
        . "- **DILARANG MENYEBUT NOMINAL HARGA RUPIAH**: Teknotama tidak memberikan estimasi harga Rp di chat/kalkulator sebelum Site Survey karena kondisi jalur fisik gedung berbeda-beda. Fokus pada rincian teknis, kuantitas perangkat (BOQ), dan ajak user menjadwalkan Site Survey Gratis melalui Formulir Booking.\n"
        . "- **DILARANG MENGARANG URL/HALAMAN PALSU**: Jangan pernah membuat tautan seperti `/survey` atau halaman lain yang tidak ada. Arahkan user ke **Formulir Survei & Penawaran** di halaman ini (atau tombol **Terapkan ke Form Booking**), email `admin@teknotama.com`, atau WhatsApp `+62 851-6769-4457`.\n"
        . "- **TOLAK HAL DI LUAR KONTEKS IT**: Jika ditanya hal di luar infrastruktur IT/layanan Teknotama (politik, coding tugas sekolah tidak relevan, gosip, dll), tolak dengan sopan dan arahkan kembali ke konsultasi infrastruktur IT.\n"
        . "- **FORMAT CHAT RINGKAS & RAPI**: Gunakan poin/bullet pendek (hindari tabel lebar agar rapi di layar mobile/widget), target panjang ~180-280 kata, padat, langsung ke inti teknis, dan akhiri dengan ajakan menerapkan ringkasan ke Formulir Booking.\n";

    if (!empty($calcContext)) {
        $summaryJson = json_encode($calcContext, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if (strlen((string) $summaryJson) > 2500) {
            $summaryJson = substr((string) $summaryJson, 0, 2500);
        }
        $prompt .= "\n### KONTEKS KALKULATOR BOQ USER SAAT INI (REAL-TIME)\n"
            . "User sedang membuka halaman dengan konfigurasi simulasi kalkulator berikut:\n"
            . $summaryJson . "\n"
            . "Gunakan angka-angka ini jika user bertanya tentang rancangannya, berikan review teknis singkat yang konstruktif (misal cek kewajaran PoE budget, kebutuhan FO antar lantai, atau storage NVR).\n";
    }

    return $prompt;
}

function teknotama_http_post_json($url, $headers, $payload, $timeout)
{
    $ch = curl_init($url);
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $opts = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_TIMEOUT => (int) $timeout,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    );

    if (defined('PHP_OS_FAMILY') && PHP_OS_FAMILY === 'Windows' && defined('CURLSSLOPT_NATIVE_CA')) {
        $opts[CURLOPT_SSL_OPTIONS] = CURLSSLOPT_NATIVE_CA;
    }

    curl_setopt_array($ch, $opts);
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($response === false || $err !== '' || $httpCode < 200 || $httpCode >= 300) {
        return null;
    }

    $decoded = json_decode($response, true);
    return is_array($decoded) ? $decoded : null;
}

function teknotama_clean_model_output($text)
{
    $text = preg_replace('/<think>[\s\S]*?<\/think>/i', '', (string) $text);
    return trim((string) $text);
}

function teknotama_call_groq($apiKey, $systemPrompt, $history, $userMessage)
{
    $messages = array(array('role' => 'system', 'content' => $systemPrompt));
    foreach ($history as $h) {
        $messages[] = $h;
    }
    $messages[] = array('role' => 'user', 'content' => $userMessage);

    $models = array('qwen/qwen3.8-27b', 'openai/gpt-oss-120b');
    foreach ($models as $model) {
        $payload = array(
            'model' => $model,
            'messages' => $messages,
            'max_tokens' => 2048,
            'temperature' => 0.35,
        );
        $headers = array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        );
        $res = teknotama_http_post_json('https://api.groq.com/openai/v1/chat/completions', $headers, $payload, 18);
        if (isset($res['choices'][0]['message']['content'])) {
            $text = teknotama_clean_model_output($res['choices'][0]['message']['content']);
            if ($text !== '') {
                return array('text' => $text, 'model' => $model);
            }
        }
    }
    return null;
}

function teknotama_call_gemini($apiKey, $systemPrompt, $history, $userMessage)
{
    $contents = array();
    foreach ($history as $h) {
        $role = ($h['role'] === 'assistant') ? 'model' : 'user';
        $contents[] = array(
            'role' => $role,
            'parts' => array(array('text' => $h['content'])),
        );
    }
    $contents[] = array(
        'role' => 'user',
        'parts' => array(array('text' => $userMessage)),
    );

    $models = array('gemini-3-flash-preview', 'gemini-flash-latest');
    foreach ($models as $model) {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . $model . ':generateContent';
        $payload = array(
            'systemInstruction' => array(
                'parts' => array(array('text' => $systemPrompt)),
            ),
            'contents' => $contents,
            'generationConfig' => array(
                'maxOutputTokens' => 2048,
                'temperature' => 0.35,
            ),
        );
        $headers = array(
            'Content-Type: application/json',
            'x-goog-api-key: ' . $apiKey,
        );
        $res = teknotama_http_post_json($url, $headers, $payload, 20);
        if (isset($res['candidates'][0]['content']['parts'][0]['text'])) {
            $text = teknotama_clean_model_output($res['candidates'][0]['content']['parts'][0]['text']);
            if ($text !== '') {
                return array('text' => $text, 'model' => $model);
            }
        }
    }
    return null;
}

function teknotama_call_openrouter($apiKey, $systemPrompt, $history, $userMessage)
{
    $messages = array(array('role' => 'system', 'content' => $systemPrompt));
    foreach ($history as $h) {
        $messages[] = $h;
    }
    $messages[] = array('role' => 'user', 'content' => $userMessage);

    $payload = array(
        'model' => 'openrouter/free',
        'messages' => $messages,
        'max_tokens' => 2048,
        'temperature' => 0.35,
    );
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
        'HTTP-Referer: https://www.teknotama.com',
        'X-Title: Teknotama Technical AI Assistant',
    );
    $res = teknotama_http_post_json('https://openrouter.ai/api/v1/chat/completions', $headers, $payload, 22);
    if (isset($res['choices'][0]['message']['content'])) {
        $text = teknotama_clean_model_output($res['choices'][0]['message']['content']);
        if ($text !== '') {
            $used = isset($res['model']) ? (string) $res['model'] : 'openrouter/free';
            return array('text' => $text, 'model' => $used);
        }
    }
    return null;
}

function teknotama_call_cohere($apiKey, $systemPrompt, $history, $userMessage)
{
    $messages = array(array('role' => 'system', 'content' => $systemPrompt));
    foreach ($history as $h) {
        $messages[] = $h;
    }
    $messages[] = array('role' => 'user', 'content' => $userMessage);

    $payload = array(
        'model' => 'command-a-03-2025',
        'messages' => $messages,
        'max_tokens' => 1200,
        'temperature' => 0.35,
    );
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    );
    $res = teknotama_http_post_json('https://api.cohere.com/v2/chat', $headers, $payload, 20);
    if (isset($res['message']['content'][0]['text'])) {
        $text = teknotama_clean_model_output($res['message']['content'][0]['text']);
        if ($text !== '') {
            return array('text' => $text, 'model' => 'command-a-03-2025');
        }
    }
    return null;
}

function teknotama_local_technical_engine($userMessage, $calcContext)
{
    $q = strtolower($userMessage);

    // Deteksi angka user/lantai/cctv bila disebutkan dalam teks
    $users = 0;
    $floors = 0;
    if (preg_match('/(\d+)\s*(user|orang|karyawan|staf|staff|pc|titik|endpoint)/i', $userMessage, $m)) {
        $users = (int) $m[1];
    }
    if (preg_match('/(\d+)\s*(lantai|tingkat|floor)/i', $userMessage, $m)) {
        $floors = (int) $m[1];
    }

    if ($users > 0 || $floors > 0) {
        $u = $users > 0 ? $users : 50;
        $f = $floors > 0 ? $floors : 2;
        $switches = (int) ceil(($u * 1.25) / 24);
        $aps = max((int) ceil($u / 25), $f * 2);
        $foNote = ($f > 1)
            ? "Karena bangunan **{$f} lantai**, antar lantai wajib menggunakan **Fiber Optic Backbone (OM3/OS2)** + **OTB & SFP+ 10G** (bukan tarikan UTP panjang antar lantai agar bebas drop sinyal & interferensi)."
            : "Untuk 1 lantai, seluruh distribusi memakai kabel horizontal **UTP Cat6/Cat6A (maks 90m/link)** ke MDF Rack.";

        return "Berikut estimasi teknis cepat untuk kebutuhan **~{$u} user di {$f} lantai** sesuai SOP lapangan Teknotama:\n\n"
            . "- **Core & Access Switching**: Minimal **{$switches}x Managed PoE+ Switch 24-Port** (atau konsolidasi 48-Port) dengan 20% *spare port* dan uplink SFP+.\n"
            . "- **Wireless Wi-Fi 6**: Rekomendasi awal **{$aps} unit Access Point** dengan segregasi VLAN (Staff, Guest, Management).\n"
            . "- **Infrastruktur Kabel**: {$foNote}\n"
            . "- **Eksekusi Lapangan**: Menggunakan Pipa Conduit High-Impact / Cable Tray, labeling TIA-606-B di kedua ujung, serta uji sertifikasi **Fluke & OTDR** sebelum serah terima (UAT).\n\n"
            . "Anda dapat menyesuaikan parameter detail (luas $m^2$, sekat beton, CCTV, dan UPS) pada **Kalkulator IT** di halaman ini lalu klik **Lanjut Booking Survei** agar tim kami mengirim penawaran resmi ke `admin@teknotama.com`.";
    }

    if (strpos($q, 'harga') !== false || strpos($q, 'biaya') !== false || strpos($q, 'rp') !== false || strpos($q, 'budget') !== false) {
        return "PT Teknotama tidak menerbitkan nominal harga mengikat secara otomatis sebelum survei karena kondisi lapangan gedung sangat memengaruhi kebutuhan material (panjang rute plafon/shaft, kebutuhan pipa conduit/tray, sekat beton, dan izin kerja gedung).\n\n"
            . "Langkah terbaik:\n"
            . "1. Susun kebutuhan teknis Anda di **Kalkulator BOQ IT** untuk mendapatkan daftar kuantitas perangkat (*Bill of Quantities*).\n"
            . "2. Jadwalkan **Audit & Site Survey Gratis** melalui Formulir Booking di bawah—tim kami akan mengirimkan penawaran resmi dari `admin@teknotama.com`.";
    }

    if (strpos($q, 'kabel') !== false || strpos($q, 'fiber') !== false || strpos($q, 'cat6') !== false || strpos($q, 'fluke') !== false || strpos($q, 'otdr') !== false || strpos($q, 'conduit') !== false) {
        return "Berikut **SOP Eksekusi Pengkabelan & Fiber Optic Teknotama**:\n\n"
            . "- **Batas Jarak TIA-568**: Tarikan UTP Cat6/Cat6A dibatasi **maksimal 90 meter** (*permanent link*). Di atas jarak tersebut atau antar lantai/gedung, wajib memakai **Fiber Optic Backbone (OS2 Singlemode / OM3-OM4 Multimode)**.\n"
            . "- **Proteksi Jalur**: Penarikan di plafon menggunakan **Pipa Conduit High-Impact 20/25mm** atau **Cable Tray** (terisi maks 40-50%), dengan jarak minimal **30 cm dari jalur listrik**.\n"
            . "- **Terminasi & Kerapihan**: Semua kabel diterminasi ke *Patch Panel Modular* / *OTB* di dalam rack, dirapikan dengan *Cable Manager*, dan diberi **Thermal Label** di kedua ujung.\n"
            . "- **Sertifikasi Uji**: Kabel UTP diuji dengan **Fluke Cable Certifier** dan kabel Fiber diuji dengan **OTDR/OPM** (loss fusion splicing < 0.1 dB), dilengkapi **As-Built Drawing**.";
    }

    if (strpos($q, 'downtime') !== false || strpos($q, 'jam kerja') !== false || strpos($q, 'malam') !== false || strpos($q, 'cutover') !== false || strpos($q, 'sop') !== false) {
        return "Teknotama menerapkan metode **Zero-Downtime Execution** agar operasional kantor Anda tidak terganggu:\n\n"
            . "1. **Staging di Workshop**: Seluruh Router, Switch, Firewall, Access Point, dan NVR dikonfigurasi dan diuji terlebih dahulu di kantor Teknotama sebelum dibawa ke lokasi.\n"
            . "2. **Penjadwalan Off-Hours**: Pekerjaan pengeboran, pemasangan tray/conduit, dan penarikan kabel utama dikerjakan pada **shift malam atau akhir pekan** sesuai izin Building Management.\n"
            . "3. **Parallel Cutover & Rollback Plan**: Jaringan baru dinyalakan paralel lalu dipindahkan secara bertahap dengan jaminan *rollback* cepat.\n"
            . "4. **Garansi & SLA**: Garansi kerapihan kabel 1 tahun dan respons emergency NOC **< 2 jam** (area Jabodetabek).";
    }

    if (strpos($q, 'cctv') !== false || strpos($q, 'nvr') !== false || strpos($q, 'kamera') !== false || strpos($q, 'access') !== false) {
        return "Untuk sistem **IP Surveillance (CCTV) & Door Access**, standar teknis Teknotama meliputi:\n\n"
            . "- **Kalkulasi Storage Presisi**: Menggunakan kompresi **H.265+** (2MP ~2 Mbps, 4MP ~4 Mbps, 8MP ~8 Mbps per kamera) agar kapasitas HDD NVR (*Surveillance Grade*) cukup untuk retensi 14–90 hari.\n"
            . "- **Segregasi VLAN**: Kamera ditempatkan pada **VLAN khusus CCTV** terpisah dari jaringan kerja staf demi keamanan.\n"
            . "- **Daya PoE & Backup**: Kamera ditenagai langsung melalui **PoE+ Switch** yang terhubung ke **UPS Online Sinewave**, sehingga tetap merekam saat listrik gedung padam.\n\n"
            . "Anda dapat memilih jumlah kamera Indoor/Outdoor, resolusi, dan hari simpan di **Modul 3 Kalkulator IT** pada halaman ini.";
    }

    if (strpos($q, 'firewall') !== false || strpos($q, 'vpn') !== false || strpos($q, 'security') !== false || strpos($q, 'fortinet') !== false) {
        return "Untuk keamanan jaringan kantor (**Cybersecurity & Perimeter Defense**), Teknotama mengimplementasikan:\n\n"
            . "- **Next-Gen Firewall (Fortinet FortiGate / Palo Alto)** dengan fitur IPS/IDS, Web Filtering, dan Application Control.\n"
            . "- **Multi-WAN Failover / SD-WAN**: Menggabungkan 2+ ISP sehingga jika satu ISP gangguan, koneksi otomatis berpindah tanpa memutus sistem.\n"
            . "- **Encrypted Site-to-Site IPsec VPN**: Menghubungkan kantor pusat, cabang, dan server cloud secara aman.\n"
            . "- **Network Segmentation**: Pemisahan VLAN Management, Staff, Guest Wi-Fi, dan IoT/CCTV.";
    }

    if (!empty($calcContext) && !empty($calcContext['users'])) {
        $u = (int) $calcContext['users'];
        $f = isset($calcContext['floors']) ? (int) $calcContext['floors'] : 1;
        return "Saya melihat simulasi kalkulator Anda saat ini diset untuk **{$u} user di {$f} lantai**. Konfigurasi tersebut sudah memperhitungkan 20% *spare port* switch, pembagian Wi-Fi berdasarkan redaman sekat ruangan, kabel horizontal, dan kebutuhan rack/UPS.\n\n"
            . "Silakan tanyakan aspek spesifik yang ingin Anda dalami (misalnya: *jalur penarikan kabel di plafon, kebutuhan Fiber Optic antar lantai, strategi migrasi tanpa downtime, atau sizing NVR CCTV*), atau klik **Terapkan ke Form Booking** untuk menjadwalkan Site Survey Gratis.";
    }

    return "Halo! Saya **TeknoAssist**, Asisten Teknis Lapangan **PT Teknotama Prakarsa Mulia**.\n\n"
        . "Saya dapat membantu Anda mendiskusikan:\n"
        . "- **SOP Eksekusi Lapangan**: Tarikan kabel Cat6/Cat6A (TIA-568), Fiber Optic Backbone & Splicing, Pipa Conduit/Tray, Rack Management, serta uji sertifikasi **Fluke & OTDR**.\n"
        . "- **Zero-Downtime Migration**: Staging perangkat di workshop & *cutover* di luar jam kerja.\n"
        . "- **Desain Topologi & BOQ**: Kalkulasi switch PoE+, cakupan Wi-Fi 6, Firewall/VPN, kapasitas NVR CCTV, hingga Server & UPS.\n\n"
        . "Ceritakan kondisi gedung Anda (jumlah lantai, user, atau kendala jaringan saat ini) agar saya bantu siapkan ringkasan teknis sebelum Anda mengirim booking ke `admin@teknotama.com`.";
}

function teknotama_extract_suggested_actions($userMessage, $reply)
{
    $actions = array();
    $combined = strtolower($userMessage . ' ' . $reply);

    if (strpos($combined, 'survei') !== false || strpos($combined, 'survey') !== false || strpos($combined, 'booking') !== false || strpos($combined, 'admin@teknotama.com') !== false) {
        $actions[] = 'apply_to_form';
    }
    if (strpos($combined, 'kalkulator') !== false || strpos($combined, 'boq') !== false || strpos($combined, 'switch') !== false || strpos($combined, 'user') !== false) {
        $actions[] = 'scroll_to_calculator';
    }
    return array_values(array_unique($actions));
}

/* ============================================================================
 * HANDLER BOOKING SURVEI & EMAIL KE admin@teknotama.com (?action=booking)
 * ============================================================================ */

function teknotama_handle_booking($config, $input)
{
    if (!teknotama_check_rate_limit('booking', 8, 3600)) {
        teknotama_send_json(array(
            'ok' => false,
            'error' => 'Terlalu banyak pengiriman dalam waktu singkat. Silakan hubungi langsung admin@teknotama.com atau WhatsApp +62 851-6769-4457.',
        ), 429);
    }

    // Honeypot anti-bot check
    $honeypot = isset($input['website_hp']) ? trim((string) $input['website_hp']) : '';
    if ($honeypot !== '') {
        teknotama_send_json(array(
            'ok' => true,
            'mail_sent' => true,
            'reference_id' => 'TKT-OK',
            'message' => 'Permintaan diterima.',
        ), 200);
    }

    $company = isset($input['company']) ? trim((string) $input['company']) : '';
    $email = isset($input['email']) ? trim((string) $input['email']) : '';
    $phone = isset($input['phone']) ? trim((string) $input['phone']) : '';
    $service = isset($input['service']) ? trim((string) $input['service']) : 'Enterprise Network & Cabling';
    $message = isset($input['message']) ? trim((string) $input['message']) : '';
    $surveyDate = isset($input['survey_date']) ? trim((string) $input['survey_date']) : '';
    $aiSummary = isset($input['ai_summary']) ? trim((string) $input['ai_summary']) : '';
    $boqData = isset($input['boq']) && is_array($input['boq']) ? $input['boq'] : array();

    if ($company === '' || $email === '' || $phone === '' || $message === '') {
        teknotama_send_json(array(
            'ok' => false,
            'error' => 'Mohon lengkapi Nama Perusahaan, Email Bisnis, Nomor Telepon/WA, dan Rincian Kebutuhan Proyek.',
        ), 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        teknotama_send_json(array(
            'ok' => false,
            'error' => 'Format email bisnis tidak valid.',
        ), 400);
    }

    // Sanitasi newline untuk mencegah header injection email
    $safeEmail = str_replace(array("\r", "\n"), '', $email);
    $safeCompany = str_replace(array("\r", "\n"), ' ', $company);
    $refId = 'TKT-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid('', true)), 0, 5));

    $to = $config['booking_email_to'];
    $from = $config['booking_email_from'];
    $subject = "[Permintaan Survei & BOQ] {$safeCompany} - {$service} ({$refId})";

    $htmlBody = teknotama_build_booking_email_html(array(
        'ref_id' => $refId,
        'company' => $safeCompany,
        'email' => $safeEmail,
        'phone' => $phone,
        'service' => $service,
        'survey_date' => $surveyDate,
        'message' => $message,
        'ai_summary' => $aiSummary,
        'boq' => $boqData,
    ));

    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/html; charset=UTF-8';
    $headers[] = 'From: Teknotama Web System <' . $from . '>';
    $headers[] = 'Reply-To: ' . $safeCompany . ' <' . $safeEmail . '>';
    $headers[] = 'X-Mailer: PHP/' . PHP_VERSION;

    $mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));

    // Susun tautan WhatsApp opsional bila klien ingin follow-up instan setelah submit email
    $waText = "Halo Tim Teknotama (Ref: {$refId}),\n"
        . "Saya baru saja mengirim Formulir Survei melalui website:\n"
        . "- Perusahaan/Klien: {$safeCompany}\n"
        . "- Email: {$safeEmail}\n"
        . "- Layanan: {$service}\n"
        . ($surveyDate !== '' ? "- Rencana Survei: {$surveyDate}\n" : '')
        . "- Kebutuhan: " . substr($message, 0, 450);

    $waUrl = 'https://wa.me/' . $config['whatsapp_number'] . '?text=' . rawurlencode($waText);

    teknotama_send_json(array(
        'ok' => true,
        'mail_sent' => (bool) $mailSent,
        'reference_id' => $refId,
        'target_email' => $to,
        'whatsapp_url' => $waUrl,
        'message' => $mailSent
            ? "Permintaan survei & lampiran teknis (Ref: {$refId}) berhasil dikirim ke {$to}. Tim NOC/Architect Teknotama akan menghubungi Anda dalam 1x24 jam."
            : "Permintaan Anda (Ref: {$refId}) telah tercatat. Server lokal saat ini tidak mengaktifkan relay mail(), silakan klik tombol WhatsApp atau kirim salinan langsung ke {$to}.",
    ), 200);
}

function teknotama_build_booking_email_html($data)
{
    $esc = function ($val) {
        return htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8');
    };

    $boqRowsHtml = '';
    if (!empty($data['boq']['items']) && is_array($data['boq']['items'])) {
        foreach ($data['boq']['items'] as $item) {
            if (!is_array($item)) {
                continue;
            }
            $cat = isset($item['category']) ? $esc($item['category']) : '-';
            $name = isset($item['name']) ? $esc($item['name']) : '-';
            $spec = isset($item['spec']) ? $esc($item['spec']) : '-';
            $qty = isset($item['qty']) ? $esc($item['qty']) : '-';
            $boqRowsHtml .= "<tr>"
                . "<td style='padding:8px;border:1px solid #e2e8f0;font-size:12px;color:#475569;'>{$cat}</td>"
                . "<td style='padding:8px;border:1px solid #e2e8f0;font-size:12px;font-weight:bold;color:#0f172a;'>{$name}</td>"
                . "<td style='padding:8px;border:1px solid #e2e8f0;font-size:12px;color:#334155;'>{$spec}</td>"
                . "<td style='padding:8px;border:1px solid #e2e8f0;font-size:12px;font-weight:bold;color:#dc2626;text-align:center;'>{$qty}</td>"
                . "</tr>";
        }
    }

    $boqSection = '';
    if ($boqRowsHtml !== '') {
        $summaryLine = isset($data['boq']['summary']) ? $esc($data['boq']['summary']) : '';
        $boqSection = "<h3 style='color:#0f172a;margin:24px 0 8px;'>Lampiran Simulasi BOQ Teknis (Tanpa Harga)</h3>"
            . ($summaryLine !== '' ? "<p style='font-size:13px;color:#475569;margin:0 0 12px;'>{$summaryLine}</p>" : '')
            . "<table style='width:100%;border-collapse:collapse;font-family:Arial,sans-serif;'>"
            . "<thead><tr style='background:#fef2f2;'>"
            . "<th style='padding:8px;border:1px solid #fecaca;text-align:left;font-size:12px;color:#991b1b;'>Modul</th>"
            . "<th style='padding:8px;border:1px solid #fecaca;text-align:left;font-size:12px;color:#991b1b;'>Komponen / Perangkat</th>"
            . "<th style='padding:8px;border:1px solid #fecaca;text-align:left;font-size:12px;color:#991b1b;'>Spesifikasi Teknis</th>"
            . "<th style='padding:8px;border:1px solid #fecaca;text-align:center;font-size:12px;color:#991b1b;'>Kuantitas</th>"
            . "</tr></thead><tbody>{$boqRowsHtml}</tbody></table>";
    }

    $aiSection = '';
    if ($data['ai_summary'] !== '') {
        $aiSection = "<h3 style='color:#0f172a;margin:24px 0 8px;'>Ringkasan Pre-Booking AI Consultation</h3>"
            . "<div style='background:#f8fafc;border-left:4px solid #dc2626;padding:12px;font-size:13px;color:#334155;white-space:pre-line;'>"
            . $esc($data['ai_summary'])
            . "</div>";
    }

    return "<!DOCTYPE html><html><body style='margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;'>"
        . "<div style='max-width:720px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;'>"
        . "<div style='background:#090d16;padding:20px 24px;border-bottom:3px solid #dc2626;'>"
        . "<h2 style='margin:0;color:#ffffff;font-size:18px;'>PT TEKNOTAMA PRAKARSA MULIA — Permintaan Survei &amp; Penawaran Baru</h2>"
        . "<p style='margin:6px 0 0;color:#f87171;font-size:13px;'>Nomor Referensi: <strong>" . $esc($data['ref_id']) . "</strong> | Waktu: " . date('d M Y H:i') . " WIB</p>"
        . "</div>"
        . "<div style='padding:24px;'>"
        . "<table style='width:100%;border-collapse:collapse;font-size:14px;'>"
        . "<tr><td style='padding:6px 0;color:#64748b;width:180px;'>Perusahaan / Klien</td><td style='padding:6px 0;font-weight:bold;color:#0f172a;'>" . $esc($data['company']) . "</td></tr>"
        . "<tr><td style='padding:6px 0;color:#64748b;'>Email Bisnis</td><td style='padding:6px 0;color:#0f172a;'>" . $esc($data['email']) . "</td></tr>"
        . "<tr><td style='padding:6px 0;color:#64748b;'>Telepon / WhatsApp</td><td style='padding:6px 0;color:#0f172a;'>" . $esc($data['phone']) . "</td></tr>"
        . "<tr><td style='padding:6px 0;color:#64748b;'>Kategori Layanan</td><td style='padding:6px 0;font-weight:bold;color:#dc2626;'>" . $esc($data['service']) . "</td></tr>"
        . ($data['survey_date'] !== '' ? "<tr><td style='padding:6px 0;color:#64748b;'>Preferensi Jadwal Survei</td><td style='padding:6px 0;color:#0f172a;'>" . $esc($data['survey_date']) . "</td></tr>" : '')
        . "</table>"
        . "<h3 style='color:#0f172a;margin:20px 0 8px;'>Rincian Kebutuhan Proyek</h3>"
        . "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;font-size:13px;color:#1e293b;white-space:pre-line;'>" . $esc($data['message']) . "</div>"
        . $aiSection
        . $boqSection
        . "</div></div></body></html>";
}
