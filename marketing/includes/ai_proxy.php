<?php
/**
 * Tekno AI Marketing - Server-Side AI Proxy, Multi-Provider Failover & PII Masking Engine
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

function tkt_mkt_http_post_json($url, $headers, $payload, $timeoutSec)
{
    if (!function_exists('curl_init')) {
        return array('ok' => false, 'status' => 0, 'error' => 'cURL extension unavailable');
    }
    $ch = curl_init($url);
    $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_POSTFIELDS     => $encoded,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT        => (int) $timeoutSec,
        CURLOPT_SSL_VERIFYPEER => true,
    ));
    $body = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false || $httpCode < 200 || $httpCode >= 300) {
        return array(
            'ok'     => false,
            'status' => $httpCode,
            'error'  => $err !== '' ? $err : ('HTTP ' . $httpCode),
            'raw'    => is_string($body) ? substr($body, 0, 240) : '',
        );
    }

    $decoded = json_decode($body, true);
    if (!is_array($decoded)) {
        return array('ok' => false, 'status' => $httpCode, 'error' => 'Invalid JSON response');
    }
    return array('ok' => true, 'status' => $httpCode, 'data' => $decoded);
}

function tkt_mkt_clean_ai_text($text)
{
    $clean = trim((string) $text);
    $clean = preg_replace('/<think\b[^>]*>[\s\S]*?<\/think>/i', '', $clean);
    $clean = preg_replace('/<script\b[^>]*>[\s\S]*?<\/script>/i', '', $clean);
    return trim((string) $clean);
}

function tkt_mkt_scrub_pii_patterns($text)
{
    $out = (string) $text;
    $out = preg_replace('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/', '[EMAIL_REDACTED]', $out);
    $out = preg_replace('/(?:\+?62|0)[\s\-]?8[1-9][0-9\s\-]{7,13}/', '[PHONE_REDACTED]', $out);
    $out = preg_replace('/\b(?:\+?62|0)21[\s\-]?[0-9\s\-]{6,9}\b/', '[PHONE_REDACTED]', $out);
    return $out;
}

function tkt_mkt_mask_pii_text($text, $piiMap)
{
    $masked = (string) $text;
    foreach ($piiMap as $placeholder => $secretValue) {
        $val = trim((string) $secretValue);
        if (strlen($val) >= 3) {
            $masked = str_ireplace($val, $placeholder, $masked);
        }
    }
    return tkt_mkt_scrub_pii_patterns($masked);
}

function tkt_mkt_unmask_pii_text($text, $piiMap)
{
    $restored = (string) $text;
    foreach ($piiMap as $placeholder => $secretValue) {
        $val = trim((string) $secretValue);
        if ($val !== '') {
            $restored = str_replace($placeholder, $val, $restored);
        }
    }
    return $restored;
}

function tkt_mkt_call_groq($apiKey, $systemPrompt, $userPrompt)
{
    $models = array('qwen/qwen3.8-27b', 'openai/gpt-oss-120b');
    foreach ($models as $model) {
        $res = tkt_mkt_http_post_json(
            'https://api.groq.com/openai/v1/chat/completions',
            array(
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ),
            array(
                'model'       => $model,
                'temperature' => 0.35,
                'max_tokens'  => 1400,
                'messages'    => array(
                    array('role' => 'system', 'content' => $systemPrompt),
                    array('role' => 'user', 'content' => $userPrompt),
                ),
            ),
            8
        );
        if (!empty($res['ok']) && !empty($res['data']['choices'][0]['message']['content'])) {
            $text = tkt_mkt_clean_ai_text($res['data']['choices'][0]['message']['content']);
            if ($text !== '') {
                return array('text' => $text, 'engine' => 'groq', 'model' => $model);
            }
        }
    }
    return null;
}

function tkt_mkt_call_gemini($apiKey, $systemPrompt, $userPrompt)
{
    $models = array('gemini-3-flash-preview', 'gemini-flash-latest');
    foreach ($models as $model) {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($apiKey);
        $res = tkt_mkt_http_post_json(
            $url,
            array('Content-Type: application/json'),
            array(
                'systemInstruction' => array(
                    'parts' => array(array('text' => $systemPrompt)),
                ),
                'contents' => array(
                    array(
                        'role'  => 'user',
                        'parts' => array(array('text' => $userPrompt)),
                    ),
                ),
                'generationConfig' => array(
                    'temperature'     => 0.35,
                    'maxOutputTokens' => 1400,
                ),
            ),
            8
        );
        if (!empty($res['ok']) && !empty($res['data']['candidates'][0]['content']['parts'][0]['text'])) {
            $text = tkt_mkt_clean_ai_text($res['data']['candidates'][0]['content']['parts'][0]['text']);
            if ($text !== '') {
                return array('text' => $text, 'engine' => 'gemini', 'model' => $model);
            }
        }
    }
    return null;
}

function tkt_mkt_call_openrouter($apiKey, $systemPrompt, $userPrompt)
{
    $res = tkt_mkt_http_post_json(
        'https://openrouter.ai/api/v1/chat/completions',
        array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
            'HTTP-Referer: https://teknotama.com/marketing/',
            'X-Title: Tekno AI Marketing',
        ),
        array(
            'model'       => 'openrouter/free',
            'temperature' => 0.35,
            'max_tokens'  => 1400,
            'messages'    => array(
                array('role' => 'system', 'content' => $systemPrompt),
                array('role' => 'user', 'content' => $userPrompt),
            ),
        ),
        8
    );
    if (!empty($res['ok']) && !empty($res['data']['choices'][0]['message']['content'])) {
        $text = tkt_mkt_clean_ai_text($res['data']['choices'][0]['message']['content']);
        if ($text !== '') {
            return array('text' => $text, 'engine' => 'openrouter', 'model' => 'openrouter/free');
        }
    }
    return null;
}

function tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt)
{
    $start = microtime(true);
    $budgetSec = 14.0;
    if (!function_exists('curl_init')) {
        return null;
    }

    if (!empty($config['groq_api_key']) && (microtime(true) - $start) < $budgetSec) {
        $res = tkt_mkt_call_groq($config['groq_api_key'], $systemPrompt, $userPrompt);
        if ($res !== null) {
            return $res;
        }
    }
    if (!empty($config['gemini_api_key']) && (microtime(true) - $start) < $budgetSec) {
        $res = tkt_mkt_call_gemini($config['gemini_api_key'], $systemPrompt, $userPrompt);
        if ($res !== null) {
            return $res;
        }
    }
    if (!empty($config['openrouter_api_key']) && (microtime(true) - $start) < $budgetSec) {
        $res = tkt_mkt_call_openrouter($config['openrouter_api_key'], $systemPrompt, $userPrompt);
        if ($res !== null) {
            return $res;
        }
    }
    return null;
}

function tkt_mkt_heuristic_lead_score($lead)
{
    $haystack = strtolower(
        (isset($lead['service_category']) ? $lead['service_category'] : '') . ' ' .
        (isset($lead['boq_summary']) ? $lead['boq_summary'] : '') . ' ' .
        (isset($lead['notes']) ? $lead['notes'] : '') . ' ' .
        (isset($lead['location']) ? $lead['location'] : '')
    );

    $score = 45;
    $reasons = array();

    if (preg_match('/(data\s*center|server|fiber\s*optic|splicing|firewall|fortinet|cisco|multi[\s\-]*lantai|gedung|pabrik|gudang|kawasan\s*industri)/i', $haystack)) {
        $score += 30;
        $reasons[] = 'Skala proyek enterprise/infrastruktur inti';
    }
    if (preg_match('/(\d{2,4})\s*(titik|user|node|kamera|cctv|ap|lantai|core)/i', $haystack, $m)) {
        $qty = (int) $m[1];
        if ($qty >= 30) {
            $score += 20;
            $reasons[] = 'Volume perangkat/titik signifikan (' . $m[0] . ')';
        } elseif ($qty >= 10) {
            $score += 10;
            $reasons[] = 'Skala menengah (' . $m[0] . ')';
        }
    }
    if (!empty($lead['email']) && strpos((string) $lead['email'], '@gmail.') === false && strpos((string) $lead['email'], '@yahoo.') === false) {
        $score += 10;
        $reasons[] = 'Menggunakan domain email korporat';
    }
    if (preg_match('/(jakarta|tangerang|bekasi|depok|bogor|cikarang|karawang|bsd|scbd|tb\s*simatupang)/i', $haystack)) {
        $score += 5;
        $reasons[] = 'Area prioritas Free Site Survey Jabodetabek/Industri';
    }

    if ($score >= 75) {
        $tier = 'High';
    } elseif ($score >= 50) {
        $tier = 'Medium';
    } else {
        $tier = 'Low';
    }

    if (empty($reasons)) {
        $reasons[] = 'Kebutuhan standar — perlu klarifikasi titik & jadwal survei';
    }

    return array(
        'tier'    => $tier,
        'score'   => min(99, $score),
        'reasons' => $reasons,
    );
}

function tkt_mkt_ai_score_and_draft($config, $business, $lead)
{
    $scoring = tkt_mkt_heuristic_lead_score($lead);
    $piiMap = array(
        '[CLIENT_COMPANY]' => isset($lead['company_name']) ? $lead['company_name'] : '',
        '[CLIENT_PIC]'     => isset($lead['pic_name']) ? $lead['pic_name'] : '',
        '[CLIENT_EMAIL]'   => isset($lead['email']) ? $lead['email'] : '',
        '[CLIENT_PHONE]'   => isset($lead['whatsapp']) ? $lead['whatsapp'] : '',
    );

    $service = tkt_mkt_mask_pii_text(isset($lead['service_category']) ? $lead['service_category'] : 'Infrastruktur IT', $piiMap);
    $location = tkt_mkt_mask_pii_text(isset($lead['location']) ? $lead['location'] : 'Jabodetabek', $piiMap);
    $boqSummary = tkt_mkt_mask_pii_text(isset($lead['boq_summary']) ? $lead['boq_summary'] : '-', $piiMap);
    $notes = tkt_mkt_mask_pii_text(isset($lead['notes']) ? $lead['notes'] : '-', $piiMap);

    $systemPrompt = "Anda adalah Senior Pre-Sales & RevOps Strategist untuk {$business['company_name']} ({$business['industry_focus']}).\n"
        . "Aturan wajib:\n"
        . "1. JANGAN pernah menyebut angka nominal harga Rupiah spesifik karena penawaran resmi dikeluarkan setelah Site Survey.\n"
        . "2. Gunakan placeholder persis [CLIENT_COMPANY] dan [CLIENT_PIC] dalam draf (jangan mengarang nama).\n"
        . "3. Gaya bahasa: {$business['ai_tone']}\n"
        . "4. Balas HANYA JSON valid dengan struktur persis:\n"
        . '{"email_subject":"...","email_body":"...","wa_draft":"...","next_step_tip":"..."}';

    $userPrompt = "Buatkan draf respon awal B2B untuk prospek berikut (PII sudah disamarkan):\n"
        . "- Perusahaan: [CLIENT_COMPANY]\n"
        . "- PIC: [CLIENT_PIC]\n"
        . "- Prioritas Sistem: {$scoring['tier']} ({$scoring['score']}/100)\n"
        . "- Layanan: {$service}\n"
        . "- Lokasi: {$location}\n"
        . "- Ringkasan Teknis/BOQ: {$boqSummary}\n"
        . "- Catatan: {$notes}\n\n"
        . "Sertakan ajakan penjadwalan Site Survey Gratis, sertifikasi uji teknis (Fluke/OTDR bila relevan), dan eksekusi Zero-Downtime.";

    $maskedPreview = $userPrompt;
    $cloud = tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt);
    $usedEngine = 'local_revops_engine';
    $usedModel = 'teknotama-revops-template-v1';
    $parsed = null;

    if ($cloud !== null) {
        $rawText = $cloud['text'];
        if (preg_match('/\{[\s\S]*\}/', $rawText, $m)) {
            $decoded = json_decode($m[0], true);
            if (is_array($decoded) && !empty($decoded['email_body'])) {
                $parsed = $decoded;
                $usedEngine = $cloud['engine'];
                $usedModel = $cloud['model'];
            }
        }
    }

    if ($parsed === null) {
        $parsed = array(
            'email_subject' => 'Tindak Lanjut Kebutuhan ' . $service . ' — [CLIENT_COMPANY] | ' . $business['brand_short'],
            'email_body'    => "Yth. Bapak/Ibu [CLIENT_PIC],\n[CLIENT_COMPANY]\n\n"
                . "Terima kasih telah menghubungi {$business['company_name']}. Kami telah meninjau kebutuhan awal terkait {$service} untuk lokasi {$location}.\n\n"
                . "Ringkasan parameter yang kami catat:\n"
                . "- Ruang lingkup: {$boqSummary}\n"
                . "- Standar pelaksanaan: Pekerjaan mengikuti standar ANSI/TIA dengan dokumentasi label, manajemen rack rapi, serta opsi uji sertifikasi Fluke/OTDR dan jadwal kerja di luar jam operasional (Zero-Downtime).\n\n"
                . "Sebagai langkah lanjut tanpa komitmen biaya, tim Field Engineer kami siap melakukan Free Site Survey ke {$location} untuk memverifikasi jalur kabel, kebutuhan material presisi, dan menyusun BOQ serta penawaran resmi.\n\n"
                . "Kapan waktu yang paling nyaman minggu ini untuk survei singkat (30–45 menit)?\n\n"
                . "Hormat kami,\nTim Engineering & Marketing\n{$business['company_name']}\nTelp: {$business['official_phone']} | WA NOC: +{$business['official_whatsapp']}\n{$business['domain']}",
            'wa_draft'      => "Halo Bapak/Ibu [CLIENT_PIC] ([CLIENT_COMPANY]), saya dari tim {$business['company_name']}. Terkait kebutuhan {$service} di {$location} ({$boqSummary}), kami siap jadwalkan Free Site Survey agar tim engineer kami bisa ukur jalur & siapkan BOQ teknis yang akurat. Apakah ada slot waktu yang cocok minggu ini?",
            'next_step_tip' => 'Konfirmasi ketersediaan denah gedung & jadwal akses Site Survey; hindari memberi estimasi harga final sebelum pengecekan jalur fisik.',
        );
    }

    return array(
        'ai_score'              => $scoring['tier'],
        'score_numeric'         => $scoring['score'],
        'score_reasons'         => $scoring['reasons'],
        'email_subject'         => tkt_mkt_unmask_pii_text(isset($parsed['email_subject']) ? $parsed['email_subject'] : '', $piiMap),
        'email_body'            => tkt_mkt_unmask_pii_text(isset($parsed['email_body']) ? $parsed['email_body'] : '', $piiMap),
        'wa_draft'              => tkt_mkt_unmask_pii_text(isset($parsed['wa_draft']) ? $parsed['wa_draft'] : '', $piiMap),
        'next_step_tip'         => tkt_mkt_unmask_pii_text(isset($parsed['next_step_tip']) ? $parsed['next_step_tip'] : '', $piiMap),
        'masked_prompt_preview' => $maskedPreview,
        'engine'                => $usedEngine,
        'model'                 => $usedModel,
    );
}

function tkt_mkt_ai_outbound_draft($config, $business, $prospect)
{
    $piiMap = array(
        '[PROSPECT_COMPANY]' => isset($prospect['company_name']) ? $prospect['company_name'] : '',
        '[PROSPECT_PIC]'     => isset($prospect['pic_name']) ? $prospect['pic_name'] : '',
        '[PROSPECT_EMAIL]'   => isset($prospect['email']) ? $prospect['email'] : '',
        '[PROSPECT_PHONE]'   => isset($prospect['whatsapp']) ? $prospect['whatsapp'] : '',
    );

    $segment = tkt_mkt_mask_pii_text(isset($prospect['segment']) ? $prospect['segment'] : 'IT Manager', $piiMap);
    $role = tkt_mkt_mask_pii_text(isset($prospect['pic_role']) ? $prospect['pic_role'] : 'Manajemen / IT', $piiMap);
    $trigger = tkt_mkt_mask_pii_text(isset($prospect['trigger_signal']) ? $prospect['trigger_signal'] : 'Ekspansi / renovasi kantor', $piiMap);

    $systemPrompt = "Anda adalah B2B Outbound Copywriter untuk {$business['company_name']}.\n"
        . "Buat email perkenalan B2B yang ringkas (maksimal 180 kata), relevan dengan trigger bisnis prospek, ZERO clickbait, ZERO spam, ZERO nominal harga.\n"
        . "Gunakan placeholder persis [PROSPECT_COMPANY] dan [PROSPECT_PIC].\n"
        . "Balas HANYA JSON valid: {\"subject\":\"...\",\"body\":\"...\"}";

    $userPrompt = "Target Segmen: {$segment}\n"
        . "Jabatan PIC: {$role}\n"
        . "Perusahaan: [PROSPECT_COMPANY] | PIC: [PROSPECT_PIC]\n"
        . "Sinyal Trigger: {$trigger}\n"
        . "Layanan kami: {$business['services_summary']}\n"
        . "Nilai utama: {$business['value_proposition']}";

    $maskedPreview = $userPrompt;
    $cloud = tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt);
    $usedEngine = 'local_revops_engine';
    $usedModel = 'teknotama-outbound-template-v1';
    $parsed = null;

    if ($cloud !== null && preg_match('/\{[\s\S]*\}/', $cloud['text'], $m)) {
        $decoded = json_decode($m[0], true);
        if (is_array($decoded) && !empty($decoded['body'])) {
            $parsed = $decoded;
            $usedEngine = $cloud['engine'];
            $usedModel = $cloud['model'];
        }
    }

    if ($parsed === null) {
        $angle = 'dukungan subkontraktor infrastruktur jaringan, kabel Cat6/Cat6A, Fiber Optic & CCTV yang rapi sesuai timeline proyek Anda';
        if (stripos($segment, 'building') !== false) {
            $angle = 'perapihan backbone Fiber Optic gedung, pemetaan Wi-Fi tenant, dan sistem IP CCTV/Access Control terintegrasi';
        } elseif (stripos($segment, 'it') !== false) {
            $angle = 'audit & perapihan rack server, kabel bersertifikat uji Fluke/OTDR, serta firewall & failover jaringan tanpa mengganggu jam kerja';
        }
        $parsed = array(
            'subject' => 'Mitra Infrastruktur IT & Cabling Standar Enterprise untuk [PROSPECT_COMPANY]',
            'body'    => "Yth. Bapak/Ibu [PROSPECT_PIC] ({$role}),\n[PROSPECT_COMPANY]\n\n"
                . "Melihat aktivitas {$trigger}, kami dari {$business['company_name']} ingin memperkenalkan diri sebagai mitra kontraktor infrastruktur IT B2B ({$angle}).\n\n"
                . "Seluruh pekerjaan kami dilengkapi label port terstruktur, opsi uji sertifikasi Fluke/OTDR, dokumentasi as-built drawing, serta eksekusi malam/akhir pekan (Zero-Downtime).\n\n"
                . "Bila saat ini ada rencana pekerjaan atau membutuhkan vendor pembanding untuk survei lokasi gratis di area Jabodetabek, kami siap berdiskusi singkat 15 menit atau mengirimkan company profile.\n\n"
                . "Hormat kami,\n{$business['company_name']}\n{$business['official_email']} | WA: +{$business['official_whatsapp']}",
        );
    }

    return array(
        'subject'               => tkt_mkt_unmask_pii_text(isset($parsed['subject']) ? $parsed['subject'] : '', $piiMap),
        'body'                  => tkt_mkt_unmask_pii_text(isset($parsed['body']) ? $parsed['body'] : '', $piiMap),
        'masked_prompt_preview' => $maskedPreview,
        'engine'                => $usedEngine,
        'model'                 => $usedModel,
    );
}

function tkt_mkt_ai_case_study_and_proposal($config, $business, $input)
{
    $title = tkt_mkt_scrub_pii_patterns(isset($input['project_title']) ? $input['project_title'] : 'Modernisasi Infrastruktur Jaringan Kantor');
    $industry = tkt_mkt_scrub_pii_patterns(isset($input['industry']) ? $input['industry'] : 'Korporat B2B');
    $problem = tkt_mkt_scrub_pii_patterns(isset($input['problem_summary']) ? $input['problem_summary'] : 'Jaringan sering putus dan kabel rack tidak terstruktur');
    $points = tkt_mkt_scrub_pii_patterns(isset($input['points_count']) ? $input['points_count'] : '48 titik Cat6 + 2 link Fiber Optic');
    $testResult = tkt_mkt_scrub_pii_patterns(isset($input['test_result']) ? $input['test_result'] : '100% Pass uji Fluke/OTDR');

    $systemPrompt = "Anda adalah Technical Content & B2B Proposal Architect untuk {$business['company_name']}.\n"
        . "Jangan cantumkan nama klien rahasia dan jangan cantumkan nominal harga Rupiah.\n"
        . "Balas HANYA JSON valid: {\"seo_article_draft\":\"...\",\"proposal_outline\":\"...\"}";

    $userPrompt = "Buat 2 keluaran dari data proyek selesai berikut (dalam Bahasa Indonesia profesional):\n"
        . "1. seo_article_draft: Draf artikel studi kasus B2B SEO-friendly (format Markdown dengan H2/H3: Tantangan Awal, Solusi Teknis & Standar, Hasil Uji Lapangan, Dampak Bisnis).\n"
        . "2. proposal_outline: Outline struktur portofolio/proposal penawaran serupa untuk prospek di industri sejenis.\n\n"
        . "Data Proyek:\n"
        . "- Judul: {$title}\n"
        . "- Industri Klien (Anonim): {$industry}\n"
        . "- Masalah Awal: {$problem}\n"
        . "- Lingkup & Kuantitas: {$points}\n"
        . "- Hasil Uji / Verifikasi: {$testResult}\n"
        . "- Kontraktor: {$business['company_name']} ({$business['value_proposition']})";

    $cloud = tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt);
    $usedEngine = 'local_revops_engine';
    $usedModel = 'teknotama-casestudy-template-v1';
    $parsed = null;

    if ($cloud !== null && preg_match('/\{[\s\S]*\}/', $cloud['text'], $m)) {
        $decoded = json_decode($m[0], true);
        if (is_array($decoded) && !empty($decoded['seo_article_draft'])) {
            $parsed = $decoded;
            $usedEngine = $cloud['engine'];
            $usedModel = $cloud['model'];
        }
    }

    if ($parsed === null) {
        $parsed = array(
            'seo_article_draft' => "## Studi Kasus {$industry}: {$title}\n\n"
                . "### 1. Tantangan Operasional Awal\n"
                . "Klien di sektor **{$industry}** menghadapi kendala: {$problem}. Kondisi ini berisiko menurunkan produktivitas tim serta menyulitkan pelacakan gangguan (*troubleshooting*).\n\n"
                . "### 2. Arsitektur Solusi {$business['brand_short']}\n"
                . "Tim engineer {$business['company_name']} melaksanakan implementasi terstruktur meliputi **{$points}** dengan manajemen jalur pelindung (conduit/tray), pelabelan port standar ANSI/TIA-568, serta eksekusi bertahap di luar jam operasional (*Zero-Downtime*).\n\n"
                . "### 3. Hasil Pengujian & Serah Terima\n"
                . "- **Verifikasi Teknis:** {$testResult}\n"
                . "- **Dokumentasi:** As-built topology diagram, daftar label patch panel, dan berita acara serah terima.\n\n"
                . "### Konsultasi Infrastruktur Serupa\n"
                . "Jadwalkan **Free Site Survey** bersama tim {$business['company_name']} melalui `admin@teknotama.com` atau WhatsApp `+{$business['official_whatsapp']}`.",
            'proposal_outline' => "PROPOSAL & PORTOFOLIO REFERENSI — {$title}\n"
                . "Disiapkan oleh: {$business['company_name']}\n"
                . "Target Sektor: {$industry}\n\n"
                . "1. Latar Belakang & Risiko Teknis: {$problem}\n"
                . "2. Lingkup Pekerjaan Rekomendasi: {$points}\n"
                . "3. Standar Mutu & Pengujian: {$testResult} + garansi instalasi rapi\n"
                . "4. Timeline Eksekusi: Survei Lokasi -> Approval BOQ -> Instalasi Non-Disruptif -> Commissioning & Handover\n"
                . "5. Langkah Selanjutnya: Jadwalkan Site Survey Gratis untuk verifikasi panjang jalur & BOQ final.",
        );
    }

    return array(
        'seo_article_draft' => tkt_mkt_clean_ai_text(isset($parsed['seo_article_draft']) ? $parsed['seo_article_draft'] : ''),
        'proposal_outline'  => tkt_mkt_clean_ai_text(isset($parsed['proposal_outline']) ? $parsed['proposal_outline'] : ''),
        'engine'            => $usedEngine,
        'model'             => $usedModel,
    );
}
