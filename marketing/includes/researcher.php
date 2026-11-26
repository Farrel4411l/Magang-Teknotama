<?php
/**
 * Tekno AI Marketing - SSRF-Safe Company Researcher, ICP Analyzer, RSS Signal Radar & Funnel Coach
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
if (!defined('TEKNOTAMA_MARKETING_INTERNAL')) {
    http_response_code(403);
    exit('Forbidden');
}

function tkt_mkt_normalize_target_url($rawUrl)
{
    $url = trim((string) $rawUrl);
    if ($url === '') {
        return '';
    }
    if (!preg_match('#^https?://#i', $url)) {
        $url = 'https://' . ltrim($url, '/');
    }
    return $url;
}

function tkt_mkt_is_public_ip($ip)
{
    return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
}

function tkt_mkt_validate_public_url($rawUrl)
{
    $url = tkt_mkt_normalize_target_url($rawUrl);
    if ($url === '' || strlen($url) > 300 || !filter_var($url, FILTER_VALIDATE_URL)) {
        return array('ok' => false, 'error' => 'Format URL website tidak valid.');
    }

    $parts = parse_url($url);
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
        return array('ok' => false, 'error' => 'URL harus memiliki skema http/https dan nama domain.');
    }

    $scheme = strtolower($parts['scheme']);
    if ($scheme !== 'http' && $scheme !== 'https') {
        return array('ok' => false, 'error' => 'Hanya protokol HTTP/HTTPS publik yang diizinkan.');
    }
    if (isset($parts['user']) || isset($parts['pass'])) {
        return array('ok' => false, 'error' => 'URL dengan kredensial tersemat tidak diizinkan.');
    }
    if (isset($parts['port']) && (int) $parts['port'] !== 80 && (int) $parts['port'] !== 443) {
        return array('ok' => false, 'error' => 'Hanya port standar HTTP (80) atau HTTPS (443) yang diizinkan.');
    }

    $host = strtolower(trim($parts['host'], '.'));
    $blockedHosts = array('localhost', 'localhost.localdomain', 'ip6-localhost', 'metadata.google.internal');
    if (in_array($host, $blockedHosts, true) || preg_match('/\.(local|internal|localhost|lan|home)$/i', $host)) {
        return array('ok' => false, 'error' => 'Host internal/lokal diblokir oleh proteksi SSRF.');
    }

    if (filter_var($host, FILTER_VALIDATE_IP)) {
        if (!tkt_mkt_is_public_ip($host)) {
            return array('ok' => false, 'error' => 'Alamat IP privat atau reserved diblokir oleh proteksi SSRF.');
        }
        return array('ok' => true, 'url' => $url, 'host' => $host, 'port' => ($scheme === 'https' ? 443 : 80), 'ip' => $host);
    }

    $ips = @gethostbynamel($host);
    $resolvedIp = '';
    if (is_array($ips) && !empty($ips)) {
        foreach ($ips as $ip) {
            if (!tkt_mkt_is_public_ip($ip)) {
                return array('ok' => false, 'error' => 'Domain mengarah ke IP privat/lokal dan diblokir.');
            }
        }
        $resolvedIp = $ips[0];
    }

    if (function_exists('dns_get_record')) {
        $aaaa = @dns_get_record($host, DNS_AAAA);
        if (is_array($aaaa)) {
            foreach ($aaaa as $rec) {
                if (!empty($rec['ipv6']) && !tkt_mkt_is_public_ip($rec['ipv6'])) {
                    return array('ok' => false, 'error' => 'Domain mengarah ke IPv6 privat/lokal dan diblokir.');
                }
            }
        }
    }

    if ($resolvedIp === '') {
        return array('ok' => false, 'error' => 'Domain target tidak dapat di-resolve melalui DNS publik.');
    }

    return array(
        'ok'   => true,
        'url'  => $url,
        'host' => $host,
        'port' => isset($parts['port']) ? (int) $parts['port'] : ($scheme === 'https' ? 443 : 80),
        'ip'   => $resolvedIp,
    );
}

function tkt_mkt_resolve_relative_url($baseUrl, $rel)
{
    $rel = trim((string) $rel);
    if ($rel === '' || strpos($rel, '#') === 0 || stripos($rel, 'javascript:') === 0 || stripos($rel, 'mailto:') === 0 || stripos($rel, 'tel:') === 0) {
        return '';
    }
    if (preg_match('#^https?://#i', $rel)) {
        return $rel;
    }
    $base = parse_url($baseUrl);
    if (!is_array($base) || empty($base['scheme']) || empty($base['host'])) {
        return '';
    }
    $prefix = $base['scheme'] . '://' . $base['host'];
    if (substr($rel, 0, 2) === '//') {
        return $base['scheme'] . ':' . $rel;
    }
    if (substr($rel, 0, 1) === '/') {
        return $prefix . $rel;
    }
    $path = isset($base['path']) ? $base['path'] : '/';
    $dir = rtrim(dirname($path), '/');
    return $prefix . ($dir === '' ? '' : $dir) . '/' . $rel;
}

function tkt_mkt_fetch_public_http($rawUrl, $maxBytes, $timeoutSec)
{
    if (!function_exists('curl_init')) {
        return array('ok' => false, 'error' => 'cURL tidak tersedia di server.');
    }

    $currentUrl = $rawUrl;
    $maxRedirects = 2;

    for ($hop = 0; $hop <= $maxRedirects; $hop++) {
        $check = tkt_mkt_validate_public_url($currentUrl);
        if (empty($check['ok'])) {
            return $check;
        }

        $body = '';
        $limit = (int) $maxBytes;
        $ch = curl_init($check['url']);
        $opts = array(
            CURLOPT_RETURNTRANSFER => false,
            CURLOPT_HEADER         => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT        => (int) $timeoutSec,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_USERAGENT      => 'TeknotamaResearchBot/1.0 (+https://teknotama.com/)',
            CURLOPT_HTTPHEADER     => array('Accept: text/html,application/xhtml+xml,application/xml,text/plain;q=0.9'),
            CURLOPT_WRITEFUNCTION  => function ($curl, $chunk) use (&$body, $limit) {
                $remain = $limit - strlen($body);
                if ($remain <= 0) {
                    return 0;
                }
                if (strlen($chunk) > $remain) {
                    $body .= substr($chunk, 0, $remain);
                    return strlen($chunk);
                }
                $body .= $chunk;
                return strlen($chunk);
            },
        );
        if (!empty($check['ip']) && $check['ip'] !== $check['host'] && defined('CURLOPT_RESOLVE')) {
            $opts[CURLOPT_RESOLVE] = array($check['host'] . ':' . $check['port'] . ':' . $check['ip']);
        }
        curl_setopt_array($ch, $opts);
        curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $err = curl_error($ch);
        curl_close($ch);

        $rawHeaders = substr($body, 0, $headerSize);
        $payload = substr($body, $headerSize);

        if ($httpCode >= 300 && $httpCode < 400 && preg_match('/^Location:\s*(.+)$/im', $rawHeaders, $locM)) {
            $nextUrl = tkt_mkt_resolve_relative_url($check['url'], trim($locM[1]));
            if ($nextUrl === '') {
                return array('ok' => false, 'error' => 'Redirect tujuan tidak valid.');
            }
            $currentUrl = $nextUrl;
            continue;
        }

        if ($httpCode < 200 || $httpCode >= 300 || ($payload === '' && $err !== '')) {
            return array('ok' => false, 'status' => $httpCode, 'error' => $err !== '' ? $err : ('HTTP ' . $httpCode));
        }

        return array('ok' => true, 'status' => $httpCode, 'url' => $check['url'], 'host' => $check['host'], 'body' => $payload);
    }

    return array('ok' => false, 'error' => 'Terlalu banyak redirect pada URL target.');
}

function tkt_mkt_is_robots_disallow_all($robotsTxt)
{
    $lines = preg_split("/\r?\n/", (string) $robotsTxt);
    $inStar = false;
    foreach ($lines as $line) {
        $line = trim(preg_replace('/#.*$/', '', $line));
        if ($line === '') {
            continue;
        }
        if (preg_match('/^User-agent:\s*(.+)$/i', $line, $m)) {
            $agent = trim($m[1]);
            $inStar = ($agent === '*');
        } elseif ($inStar && preg_match('/^Disallow:\s*(.*)$/i', $line, $m)) {
            if (trim($m[1]) === '/') {
                return true;
            }
        }
    }
    return false;
}

function tkt_mkt_extract_company_intel_from_html($html, $baseUrl)
{
    $rawHtml = (string) $html;
    $title = '';
    if (preg_match('#<title[^>]*>([\s\S]*?)</title>#i', $rawHtml, $m)) {
        $title = tkt_mkt_clean_text(html_entity_decode($m[1], ENT_QUOTES, 'UTF-8'), 180);
    }
    $metaDesc = '';
    if (preg_match('#<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']#i', $rawHtml, $m)
        || preg_match('#<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']#i', $rawHtml, $m)) {
        $metaDesc = tkt_mkt_clean_text(html_entity_decode($m[1], ENT_QUOTES, 'UTF-8'), 320);
    }

    $emails = array();
    if (preg_match_all('/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}/', $rawHtml, $emMatches)) {
        foreach ($emMatches[0] as $em) {
            $emLow = strtolower($em);
            if (preg_match('/\.(png|jpg|jpeg|webp|gif|svg|css|js)$/i', $emLow)) {
                continue;
            }
            if (strpos($emLow, 'example.') !== false || strpos($emLow, 'sentry.') !== false || strpos($emLow, 'wixpress.') !== false) {
                continue;
            }
            $emails[$emLow] = $emLow;
        }
    }

    $phones = array();
    if (preg_match_all('/(?:tel:|href=["\']tel:|\b)(?:\+?62|0)(?:21|8[1-9])[0-9\-\s\(\)]{6,15}/i', $rawHtml, $phMatches)) {
        foreach ($phMatches[0] as $ph) {
            $cleanPh = trim(preg_replace('/^(?:tel:|href=["\']tel:)/i', '', $ph));
            $digits = preg_replace('/\D+/', '', $cleanPh);
            if (strlen($digits) >= 9 && strlen($digits) <= 15) {
                $phones[$digits] = $cleanPh;
            }
        }
    }

    $baseHost = strtolower((string) parse_url($baseUrl, PHP_URL_HOST));
    $candidateLinks = array();
    if (preg_match_all('#<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)</a>#i', $rawHtml, $lkMatches, PREG_SET_ORDER)) {
        foreach ($lkMatches as $lk) {
            $href = $lk[1];
            $anchor = strip_tags($lk[2]);
            if (preg_match('/(tentang|about|profil|profile|kontak|contact|hubungi|layanan|services|cabang|karir|career)/i', $href . ' ' . $anchor)) {
                $resolved = tkt_mkt_resolve_relative_url($baseUrl, $href);
                if ($resolved !== '') {
                    $lh = strtolower((string) parse_url($resolved, PHP_URL_HOST));
                    if ($lh === $baseHost && $resolved !== $baseUrl) {
                        $candidateLinks[$resolved] = $resolved;
                    }
                }
            }
        }
    }

    $noScripts = preg_replace('#<(script|style|noscript|svg)\b[^>]*>[\s\S]*?</\1>#is', ' ', $rawHtml);
    $plain = html_entity_decode(strip_tags((string) $noScripts), ENT_QUOTES, 'UTF-8');
    $plain = trim(preg_replace('/\s+/', ' ', $plain));

    $locations = array();
    if (preg_match_all('/\b(Jakarta(?:\s+(?:Selatan|Pusat|Barat|Timur|Utara))?|Tangerang(?:\s+Selatan)?|Bekasi|Depok|Bogor|Cikarang|Karawang|BSD|SCBD|Surabaya|Bandung|Semarang|Medan|Bali|Balikpapan)\b/i', $plain, $locMatches)) {
        foreach ($locMatches[1] as $loc) {
            $norm = strlen($loc) <= 4 ? strtoupper($loc) : ucwords(strtolower($loc));
            $locations[$norm] = $norm;
        }
    }

    return array(
        'title'           => $title,
        'meta_desc'       => $metaDesc,
        'text_excerpt'    => substr($plain, 0, 2600),
        'emails'          => array_values(array_slice($emails, 0, 6)),
        'phones'          => array_values(array_slice($phones, 0, 5)),
        'locations'       => array_values(array_slice($locations, 0, 6)),
        'candidate_links' => array_values(array_slice($candidateLinks, 0, 2)),
    );
}

function tkt_mkt_fetch_company_public_pages($rawUrl)
{
    $check = tkt_mkt_validate_public_url($rawUrl);
    if (empty($check['ok'])) {
        return array('ok' => false, 'error' => $check['error'], 'pages_checked' => 0, 'robots_blocked' => false);
    }

    // Cek robots.txt secara ringan (hanya memblokir jika Disallow: / penuh)
    $robotsUrl = parse_url($check['url'], PHP_URL_SCHEME) . '://' . $check['host'] . '/robots.txt';
    $robotsRes = tkt_mkt_fetch_public_http($robotsUrl, 30000, 3);
    if (!empty($robotsRes['ok']) && tkt_mkt_is_robots_disallow_all($robotsRes['body'])) {
        return array(
            'ok'             => false,
            'robots_blocked' => true,
            'error'          => 'Website target memasang Disallow: / di robots.txt sehingga crawler menghormati larangan tersebut.',
            'pages_checked'  => 0,
            'url'            => $check['url'],
        );
    }

    $homeRes = tkt_mkt_fetch_public_http($check['url'], 240000, 5);
    if (empty($homeRes['ok'])) {
        return array(
            'ok'             => false,
            'robots_blocked' => false,
            'error'          => isset($homeRes['error']) ? $homeRes['error'] : 'Gagal mengakses website target.',
            'pages_checked'  => 0,
            'url'            => $check['url'],
        );
    }

    $homeIntel = tkt_mkt_extract_company_intel_from_html($homeRes['body'], $homeRes['url']);
    $allEmails = $homeIntel['emails'];
    $allPhones = $homeIntel['phones'];
    $allLocations = $homeIntel['locations'];
    $combinedText = "TITLE: {$homeIntel['title']}\nDESC: {$homeIntel['meta_desc']}\nHOME: {$homeIntel['text_excerpt']}";
    $pagesChecked = 1;

    foreach ($homeIntel['candidate_links'] as $subUrl) {
        $subRes = tkt_mkt_fetch_public_http($subUrl, 160000, 4);
        if (!empty($subRes['ok'])) {
            $pagesChecked++;
            $subIntel = tkt_mkt_extract_company_intel_from_html($subRes['body'], $subRes['url']);
            $allEmails = array_values(array_unique(array_merge($allEmails, $subIntel['emails'])));
            $allPhones = array_values(array_unique(array_merge($allPhones, $subIntel['phones'])));
            $allLocations = array_values(array_unique(array_merge($allLocations, $subIntel['locations'])));
            $combinedText .= "\nSUBPAGE ({$subUrl}): " . substr($subIntel['text_excerpt'], 0, 1400);
        }
    }

    return array(
        'ok'             => true,
        'robots_blocked' => false,
        'url'            => $homeRes['url'],
        'host'           => $homeRes['host'],
        'title'          => $homeIntel['title'],
        'meta_desc'      => $homeIntel['meta_desc'],
        'text_excerpt'   => substr($combinedText, 0, 4500),
        'emails'         => array_slice($allEmails, 0, 6),
        'phones'         => array_slice($allPhones, 0, 5),
        'locations'      => array_slice($allLocations, 0, 6),
        'pages_checked'  => $pagesChecked,
    );
}

function tkt_mkt_heuristic_company_icp($companyName, $industry, $contextText, $crawlOk)
{
    $haystack = strtolower($companyName . ' ' . $industry . ' ' . $contextText);
    $score = 48;
    $signals = array();

    if (preg_match('/(pabrik|manufaktur|gudang|logistik|industri|ekspedisi|distribusi|cold\s*storage)/i', $haystack)) {
        $score += 20;
        $signals[] = 'Fasilitas multi-area / gudang: butuh jaringan Fiber Optic antar gedung, Wi-Fi cakupan luas & IP CCTV terpusat';
    }
    if (preg_match('/(kantor|korporat|tower|gedung|properti|fit[\s\-]*out|interior|kontraktor|arsitek)/i', $haystack)) {
        $score += 16;
        $signals[] = 'Operasional gedung/fit-out: relevan dengan instalasi kabel terstruktur Cat6/Cat6A + uji sertifikasi Fluke & Access Control';
    }
    if (preg_match('/(cabang|branch|multi[\s\-]*site|nasional|jakarta|cikarang|karawang|tangerang|bekasi|surabaya)/i', $haystack)) {
        $score += 12;
        $signals[] = 'Skala multi-lokasi / area Jabodetabek-Industri: cocok untuk IPsec VPN, Next-Gen Firewall, & Free Site Survey';
    }
    if (preg_match('/(server|cloud|erp|data|rumah\s*sakit|klinik|sekolah|kampus|perbankan|fintech)/i', $haystack)) {
        $score += 14;
        $signals[] = 'Beban aplikasi kritikal: butuh perapihan Rack Server ANSI/TIA-942, redundansi UPS, & Managed IT NOC 24/7';
    }
    if ($crawlOk) {
        $score += 5;
    }

    if (empty($signals)) {
        $signals[] = 'Evaluasi kelayakan kabel LAN Cat6, stabilitas Wi-Fi ruang meeting, & sistem keamanan jaringan/CCTV kantor';
    }

    $score = min(98, $score);
    $tier = $score >= 75 ? 'High Fit' : ($score >= 55 ? 'Medium Fit' : 'Low Fit');

    return array('score' => $score, 'tier' => $tier, 'signals' => $signals);
}

function tkt_mkt_analyze_company_account($config, $business, $input, $crawlResult)
{
    $companyName = isset($input['company_name']) ? $input['company_name'] : '';
    $industry = isset($input['industry']) ? $input['industry'] : '';
    $notes = isset($input['notes']) ? $input['notes'] : '';
    $websiteText = !empty($crawlResult['text_excerpt']) ? $crawlResult['text_excerpt'] : '';

    $heuristic = tkt_mkt_heuristic_company_icp($companyName, $industry, $websiteText . ' ' . $notes, !empty($crawlResult['ok']));

    // Bersihkan pola email/telepon dari teks sebelum dikirim ke LLM free-tier
    $scrubbedText = tkt_mkt_scrub_pii_patterns(substr($websiteText, 0, 3200));
    $scrubbedNotes = tkt_mkt_scrub_pii_patterns($notes);

    $systemPrompt = "Anda adalah Principal B2B Account Researcher & Solutions Strategist untuk {$business['company_name']} ({$business['industry_focus']}).\n"
        . "Layanan kami: {$business['services_summary']}.\n"
        . "Tugas: Analisa profil perusahaan calon klien B2B berdasarkan teks publik situsnya, identifikasi potensi kebutuhan infrastruktur IT yang relevan dengan Teknotama, dan susun strategi pendekatan.\n"
        . "Dilarang menyebut nominal harga Rupiah. Balas HANYA JSON valid dengan struktur:\n"
        . '{"icp_score":80,"company_summary":"...","it_infrastructure_signals":["..."],"pain_points":["..."],"decision_maker_roles":["..."],"recommended_entry_offer":"...","approach_strategy":"..."}';

    $userPrompt = "Analisa Akun B2B:\n"
        . "- Nama Perusahaan: {$companyName}\n"
        . "- Industri / Sektor: " . ($industry !== '' ? $industry : 'Umum / Terdeteksi dari website') . "\n"
        . "- Catatan Tambahan / Trigger: " . ($scrubbedNotes !== '' ? $scrubbedNotes : '-') . "\n"
        . "- Status Crawl Situs Publik: " . (!empty($crawlResult['ok']) ? 'Berhasil (' . $crawlResult['pages_checked'] . ' halaman)' : 'Tidak terbaca / hanya analisa profil') . "\n"
        . "- Konten Publik (PII scrubbed):\n{$scrubbedText}";

    $cloud = tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt);
    $usedEngine = 'local_research_engine';
    $usedModel = 'teknotama-icp-analyzer-v1';
    $parsed = null;

    if ($cloud !== null && preg_match('/\{[\s\S]*\}/', $cloud['text'], $m)) {
        $decoded = json_decode($m[0], true);
        if (is_array($decoded) && !empty($decoded['company_summary'])) {
            $parsed = $decoded;
            $usedEngine = $cloud['engine'];
            $usedModel = $cloud['model'];
        }
    }

    if ($parsed === null) {
        $metaSummary = !empty($crawlResult['meta_desc']) ? $crawlResult['meta_desc'] : (!empty($crawlResult['title']) ? $crawlResult['title'] : "Perusahaan di sektor {$industry}");
        $parsed = array(
            'icp_score'               => $heuristic['score'],
            'company_summary'         => "{$companyName} — {$metaSummary}. Memiliki potensi kecocokan {$heuristic['tier']} untuk solusi infrastruktur IT terstruktur.",
            'it_infrastructure_signals' => $heuristic['signals'],
            'pain_points'             => array(
                'Risiko downtime jaringan atau blind-spot Wi-Fi saat ekspansi tim/operasional',
                'Kebutuhan dokumentasi topologi, pelabelan port, & sertifikasi kabel standar enterprise (Fluke/OTDR)',
                'Keamanan akses antar cabang & pengawasan CCTV terintegrasi',
            ),
            'decision_maker_roles'    => array('IT Manager / Head of IT', 'General Affairs (GA) / Facility Manager', 'Procurement / Project Manager'),
            'recommended_entry_offer' => 'Free Site Survey & Audit Kelayakan Jaringan/Rack/CCTV tanpa komitmen biaya',
            'approach_strategy'       => "Kirim email pengantar B2B yang menyoroti eksekusi Zero-Downtime di luar jam operasional serta tawarkan Free Site Survey 30 menit di lokasi " . (!empty($crawlResult['locations'][0]) ? $crawlResult['locations'][0] : 'kantor klien') . '.',
        );
    }

    $scoreVal = isset($parsed['icp_score']) ? max(10, min(99, (int) $parsed['icp_score'])) : $heuristic['score'];
    $tierVal = $scoreVal >= 75 ? 'High Fit' : ($scoreVal >= 55 ? 'Medium Fit' : 'Low Fit');

    return array(
        'icp_score'                 => $scoreVal,
        'icp_tier'                  => $tierVal,
        'company_summary'           => tkt_mkt_clean_text(isset($parsed['company_summary']) ? $parsed['company_summary'] : '', 600),
        'it_infrastructure_signals' => isset($parsed['it_infrastructure_signals']) && is_array($parsed['it_infrastructure_signals']) ? array_slice($parsed['it_infrastructure_signals'], 0, 5) : $heuristic['signals'],
        'pain_points'               => isset($parsed['pain_points']) && is_array($parsed['pain_points']) ? array_slice($parsed['pain_points'], 0, 4) : array(),
        'decision_maker_roles'      => isset($parsed['decision_maker_roles']) && is_array($parsed['decision_maker_roles']) ? array_slice($parsed['decision_maker_roles'], 0, 4) : array('IT Manager', 'GA Manager'),
        'recommended_entry_offer'   => tkt_mkt_clean_text(isset($parsed['recommended_entry_offer']) ? $parsed['recommended_entry_offer'] : 'Free Site Survey & Technical Audit', 240),
        'approach_strategy'         => tkt_mkt_clean_text(isset($parsed['approach_strategy']) ? $parsed['approach_strategy'] : '', 450),
        'engine'                    => $usedEngine,
        'model'                     => $usedModel,
    );
}

function tkt_mkt_default_signal_keywords()
{
    return 'kantor baru,pindah kantor,gudang baru,pabrik baru,kawasan industri,data center,fit-out,renovasi kantor,ekspansi cabang,tender jaringan,server,cctv,cikarang,karawang,jakarta selatan';
}

function tkt_mkt_parse_rss_xml($xmlString, $keywordsCsv, $sourceLabel)
{
    $xmlStr = trim((string) $xmlString);
    if ($xmlStr === '') {
        return array();
    }

    $prev = libxml_use_internal_errors(true);
    $opts = LIBXML_NOCDATA | (defined('LIBXML_NONET') ? LIBXML_NONET : 0);
    $doc = @simplexml_load_string($xmlStr, 'SimpleXMLElement', $opts);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    if ($doc === false) {
        return array();
    }

    $keywords = array();
    foreach (explode(',', (string) $keywordsCsv) as $kw) {
        $kw = strtolower(trim($kw));
        if ($kw !== '') {
            $keywords[] = $kw;
        }
    }

    $rawItems = array();
    // RSS 2.0 (<channel><item>)
    if (isset($doc->channel->item)) {
        foreach ($doc->channel->item as $it) {
            $rawItems[] = array(
                'title'   => (string) $it->title,
                'link'    => (string) $it->link,
                'pub'     => (string) $it->pubDate,
                'summary' => (string) $it->description,
            );
        }
    } elseif (isset($doc->entry)) {
        // Atom (<feed><entry> - format Google Alerts RSS!)
        foreach ($doc->entry as $entry) {
            $linkHref = '';
            if (isset($entry->link)) {
                foreach ($entry->link as $lk) {
                    $attrs = $lk->attributes();
                    if (isset($attrs['href'])) {
                        $linkHref = (string) $attrs['href'];
                        break;
                    }
                }
            }
            $rawItems[] = array(
                'title'   => (string) $entry->title,
                'link'    => $linkHref,
                'pub'     => !empty($entry->published) ? (string) $entry->published : (string) $entry->updated,
                'summary' => !empty($entry->content) ? (string) $entry->content : (string) $entry->summary,
            );
        }
    }

    $signals = array();
    foreach (array_slice($rawItems, 0, 25) as $item) {
        $cleanTitle = tkt_mkt_clean_text(html_entity_decode($item['title'], ENT_QUOTES, 'UTF-8'), 200);
        $cleanSummary = tkt_mkt_clean_text(html_entity_decode($item['summary'], ENT_QUOTES, 'UTF-8'), 360);
        $cleanLink = trim((string) $item['link']);

        // Unwrap Google Alerts redirect URL (?url=https://...)
        if (strpos($cleanLink, 'google.com/url?') !== false) {
            $qStr = parse_url($cleanLink, PHP_URL_QUERY);
            $qParams = array();
            parse_str((string) $qStr, $qParams);
            if (!empty($qParams['url'])) {
                $cleanLink = $qParams['url'];
            }
        }

        $haystack = strtolower($cleanTitle . ' ' . $cleanSummary);
        $matched = array();
        foreach ($keywords as $kw) {
            if (strpos($haystack, $kw) !== false) {
                $matched[] = $kw;
            }
        }

        $relevance = 40 + (count($matched) * 18);
        $relevance = min(99, $relevance);

        $signals[] = array(
            'signal_id'        => 'SIG-' . substr(md5($cleanTitle . '|' . $cleanLink), 0, 10),
            'title'            => $cleanTitle,
            'link'             => $cleanLink,
            'published_at'     => $item['pub'] !== '' ? date('Y-m-d', strtotime($item['pub']) ?: time()) : date('Y-m-d'),
            'summary'          => $cleanSummary,
            'source_label'     => tkt_mkt_clean_text($sourceLabel, 60),
            'matched_keywords' => array_slice($matched, 0, 5),
            'relevance_score'  => $relevance,
            'status'           => 'New Signal',
        );
    }

    usort($signals, function ($a, $b) {
        return $b['relevance_score'] - $a['relevance_score'];
    });

    return $signals;
}

function tkt_mkt_compute_funnel_stats($leads, $outbound, $researchAccounts, $marketSignals, $trafficConfig)
{
    $statusCounts = array(
        'New Lead'    => 0,
        'Contacted'   => 0,
        'Site Survey' => 0,
        'Quotation'   => 0,
        'Won'         => 0,
        'Lost'        => 0,
    );
    $sourceCounts = array('web_booking' => 0, 'research_ai' => 0, 'manual' => 0);
    $serviceCounts = array();

    foreach ($leads as $l) {
        $st = isset($l['status']) ? $l['status'] : 'New Lead';
        if (isset($statusCounts[$st])) {
            $statusCounts[$st]++;
        }
        $src = isset($l['source']) ? $l['source'] : 'manual';
        if ($src === 'web_booking') {
            $sourceCounts['web_booking']++;
        } elseif ($src === 'research_ai' || $src === 'outbound') {
            $sourceCounts['research_ai']++;
        } else {
            $sourceCounts['manual']++;
        }
        $svc = isset($l['service_category']) && $l['service_category'] !== '' ? $l['service_category'] : 'Lainnya';
        if (!isset($serviceCounts[$svc])) {
            $serviceCounts[$svc] = 0;
        }
        $serviceCounts[$svc]++;
    }

    $outboundSent = 0;
    foreach ($outbound as $o) {
        if (isset($o['approval_status']) && $o['approval_status'] === 'Sent') {
            $outboundSent++;
        }
    }

    $totalLeads = count($leads);
    $qualifiedLeads = $statusCounts['Contacted'] + $statusCounts['Site Survey'] + $statusCounts['Quotation'] + $statusCounts['Won'];
    $surveyPlus = $statusCounts['Site Survey'] + $statusCounts['Quotation'] + $statusCounts['Won'];
    $quotationPlus = $statusCounts['Quotation'] + $statusCounts['Won'];
    $wonDeals = $statusCounts['Won'];

    $webVisits = isset($trafficConfig['web_visits']) ? max(0, (int) $trafficConfig['web_visits']) : 0;
    $boqUsers = isset($trafficConfig['boq_calculator_uses']) ? max(0, (int) $trafficConfig['boq_calculator_uses']) : 0;

    $rate = function ($num, $den) {
        if ($den <= 0) {
            return 0;
        }
        return round(($num / $den) * 100, 1);
    };

    return array(
        'traffic' => array(
            'web_visits'          => $webVisits,
            'boq_calculator_uses' => $boqUsers,
            'period_label'        => isset($trafficConfig['period_label']) ? (string) $trafficConfig['period_label'] : 'Bulan Berjalan',
        ),
        'stages' => array(
            array('key' => 'tofu_signals',   'zone' => 'TOFU', 'label' => 'Sinyal Pasar & Riset Perusahaan', 'count' => count($marketSignals) + count($researchAccounts)),
            array('key' => 'mofu_outbound',  'zone' => 'MOFU', 'label' => 'Prospek Outbound (Total / Terkirim)', 'count' => count($outbound), 'sub' => $outboundSent . ' terkirim'),
            array('key' => 'mofu_leads',     'zone' => 'MOFU', 'label' => 'Total Leads Masuk (Web + Riset + Manual)', 'count' => $totalLeads),
            array('key' => 'mofu_qualified', 'zone' => 'MOFU', 'label' => 'Terhubung / Qualified (Contacted+)', 'count' => $qualifiedLeads, 'rate_from_leads' => $rate($qualifiedLeads, $totalLeads)),
            array('key' => 'bofu_survey',    'zone' => 'BOFU', 'label' => 'Tahap Site Survey & Quotation', 'count' => $surveyPlus, 'rate_from_leads' => $rate($surveyPlus, $totalLeads)),
            array('key' => 'bofu_won',       'zone' => 'BOFU', 'label' => 'Proyek Closing (Won)', 'count' => $wonDeals, 'rate_from_leads' => $rate($wonDeals, $totalLeads)),
        ),
        'conversions' => array(
            'lead_to_qualified_pct' => $rate($qualifiedLeads, $totalLeads),
            'lead_to_survey_pct'    => $rate($surveyPlus, $totalLeads),
            'survey_to_quote_pct'   => $rate($quotationPlus, $surveyPlus),
            'lead_to_won_pct'       => $rate($wonDeals, $totalLeads),
            'web_to_lead_pct'       => $rate($sourceCounts['web_booking'], $webVisits),
        ),
        'source_counts'  => $sourceCounts,
        'status_counts'  => $statusCounts,
        'service_counts' => $serviceCounts,
    );
}

function tkt_mkt_ai_funnel_coach($config, $business, $funnelStats)
{
    $stagesSummary = array();
    foreach ($funnelStats['stages'] as $st) {
        $stagesSummary[] = $st['zone'] . ' - ' . $st['label'] . ': ' . $st['count'];
    }
    $conv = $funnelStats['conversions'];

    $systemPrompt = "Anda adalah B2B RevOps & Marketing Funnel Coach untuk {$business['company_name']}.\n"
        . "Berikan analisa singkat, objektif, dan actionable dalam Bahasa Indonesia (maksimal 220 kata) tanpa mengarang data baru dan tanpa menyebut harga Rupiah.";

    $userPrompt = "Analisa performa Marketing Funnel berikut:\n"
        . implode("\n", $stagesSummary) . "\n"
        . "Konversi: Lead->Qualified {$conv['lead_to_qualified_pct']}%, Lead->Survey {$conv['lead_to_survey_pct']}%, Lead->Won {$conv['lead_to_won_pct']}%\n"
        . "Sumber Lead: Web Booking={$funnelStats['source_counts']['web_booking']}, Riset/Outbound={$funnelStats['source_counts']['research_ai']}, Manual={$funnelStats['source_counts']['manual']}\n"
        . "Sebutkan: (1) Bottleneck utama saat ini, (2) 3 aksi prioritas minggu ini untuk meningkatkan konversi ke Site Survey.";

    $cloud = tkt_mkt_run_cloud_llm($config, $systemPrompt, $userPrompt);
    if ($cloud !== null && !empty($cloud['text'])) {
        return array('advice' => $cloud['text'], 'engine' => $cloud['engine'], 'model' => $cloud['model']);
    }

    $advice = "### Ringkasan Diagnosa Funnel\n"
        . "- **Tahap Aktif:** Lead->Qualified **{$conv['lead_to_qualified_pct']}%** | Lead->Site Survey **{$conv['lead_to_survey_pct']}%** | Closing **{$conv['lead_to_won_pct']}%**.\n"
        . "- **Rekomendasi Aksi Minggu Ini:**\n"
        . "  1. Pastikan setiap lead baru dari web (`Web Kontak`) mendapat respon teknis awal + tawaran *Free Site Survey* dalam < 1 jam.\n"
        . "  2. Tambah minimal 10 perusahaan target baru per minggu lewat **Riset & Prospek AI** (prioritaskan segmen *Fit-Out Interior*, *Gudang/Pabrik*, dan *Gedung Perkantoran* Jabodetabek).\n"
        . "  3. Gunakan **AI Case Study Generator** setelah setiap proyek selesai untuk memperkuat kepercayaan prospek di tahap *Quotation*.";

    return array('advice' => $advice, 'engine' => 'local_funnel_coach', 'model' => 'teknotama-funnel-v1');
}
