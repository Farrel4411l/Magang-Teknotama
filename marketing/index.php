<?php
/**
 * Tekno AI Marketing - Authenticated B2B RevOps & Marketing Automation Console
 * Strictly compatible with PHP 7.2+ (ea-php72).
 */
define('TEKNOTAMA_MARKETING_INTERNAL', true);

require_once __DIR__ . '/includes/bootstrap.php';
require_once __DIR__ . '/includes/auth.php';

tkt_mkt_send_security_headers(false);
$user = tkt_mkt_require_auth(false);
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
    <title>Tekno AI Marketing — RevOps &amp; Automation Console | <?php echo $esc($business['company_name']); ?></title>
    <meta name="robots" content="noindex, nofollow, noarchive">
    <meta name="googlebot" content="noindex, nofollow">
    <meta name="csrf-token" content="<?php echo $esc($csrfToken); ?>">
    <link rel="icon" type="image/svg+xml" href="./assets/favicon.svg">

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="./assets/tailwind-config.js?v=20261124"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="./assets/style.css?v=20261124">
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col lg:flex-row">

    <!-- Mobile Overlay -->
    <div id="mobile-sidebar-backdrop" class="hidden fixed inset-0 bg-slate-950/60 z-40 lg:hidden"></div>

    <!-- Sidebar Dark Corporate -->
    <aside id="portal-sidebar" class="fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-[#090d16] text-slate-100 border-r border-slate-800/80 flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-200 flex-shrink-0 no-print">
        <div class="p-5 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <div class="flex items-center gap-3 min-w-0">
                <img src="./assets/favicon.svg" alt="Teknotama" class="w-9 h-9 rounded-xl flex-shrink-0">
                <div class="min-w-0">
                    <span class="block text-sm font-extrabold text-white tracking-tight truncate">Tekno AI Marketing</span>
                    <span id="sidebar-brand-sub" class="block text-[10px] font-semibold text-red-400 uppercase tracking-wider truncate"><?php echo $esc($business['brand_short']); ?></span>
                </div>
            </div>
            <button id="mobile-sidebar-close" type="button" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white" aria-label="Tutup Menu">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto tkt-scroll p-3.5 space-y-1.5" aria-label="Menu Console">
            <button type="button" data-view="overview" class="nav-pill active w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <i data-lucide="layout-dashboard" class="w-4 h-4 flex-shrink-0"></i>
                <span>Ringkasan &amp; Monitoring</span>
            </button>
            <button type="button" data-view="research" class="nav-pill w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <span class="flex items-center gap-3">
                    <i data-lucide="radar" class="w-4 h-4 flex-shrink-0"></i>
                    <span>Riset &amp; Prospek AI</span>
                </span>
                <span id="badge-research-count" class="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-200">0</span>
            </button>
            <button type="button" data-view="funnel" class="nav-pill w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <i data-lucide="filter" class="w-4 h-4 flex-shrink-0"></i>
                <span>Marketing Funnel</span>
            </button>
            <button type="button" data-view="leads" class="nav-pill w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <span class="flex items-center gap-3">
                    <i data-lucide="users" class="w-4 h-4 flex-shrink-0"></i>
                    <span>Lead Pipeline (CRM)</span>
                </span>
                <span id="badge-leads-count" class="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-200">0</span>
            </button>
            <button type="button" data-view="outbound" class="nav-pill w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <span class="flex items-center gap-3">
                    <i data-lucide="send" class="w-4 h-4 flex-shrink-0"></i>
                    <span>Outbound Console (HITL)</span>
                </span>
                <span id="badge-outbound-count" class="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-200">0</span>
            </button>
            <button type="button" data-view="pricing" class="nav-pill w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <i data-lucide="calculator" class="w-4 h-4 flex-shrink-0"></i>
                <span>Master Harga &amp; Estimasi</span>
            </button>
            <button type="button" data-view="casestudy" class="nav-pill w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <i data-lucide="file-text" class="w-4 h-4 flex-shrink-0"></i>
                <span>AI Case Study &amp; Proposal</span>
            </button>
            <button type="button" data-view="settings" class="nav-pill w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left">
                <i data-lucide="sliders-horizontal" class="w-4 h-4 flex-shrink-0"></i>
                <span>Integrasi, SOP &amp; Logs</span>
            </button>
        </nav>

        <div class="p-4 border-t border-slate-800/80 space-y-3">
            <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-[11px] space-y-1">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Kuota Outbound Hari Ini</span>
                    <span id="sidebar-quota-label" class="font-bold text-emerald-400">0 / 25</span>
                </div>
                <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div id="sidebar-quota-bar" class="h-full bg-emerald-500 transition-all" style="width: 0%;"></div>
                </div>
            </div>

            <div class="flex items-center justify-between gap-2">
                <div class="min-w-0">
                    <span class="block text-xs font-bold text-white truncate"><?php echo $esc($user['full_name']); ?></span>
                    <span class="block text-[10px] text-slate-400 uppercase tracking-wider"><?php echo $esc($user['role']); ?></span>
                </div>
                <form method="POST" action="./logout.php">
                    <input type="hidden" name="csrf_token" value="<?php echo $esc($csrfToken); ?>">
                    <button type="submit" title="Keluar" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#d9141d] text-slate-200 hover:text-white text-[11px] font-bold transition-colors flex items-center gap-1">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>Keluar</span>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <!-- Main Content Shell -->
    <div class="flex-1 min-w-0 flex flex-col">
        <!-- Top Header -->
        <header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 no-print">
            <div class="flex items-center gap-3 min-w-0">
                <button id="mobile-sidebar-open" type="button" class="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-[#d9141d]" aria-label="Buka Menu">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
                <div class="min-w-0">
                    <h1 id="header-view-title" class="text-sm sm:text-base font-extrabold text-slate-950 truncate">Ringkasan &amp; Monitoring RevOps</h1>
                    <p id="header-company-name" class="text-[11px] text-slate-500 truncate"><?php echo $esc($business['company_name']); ?> &bull; Stack Rp 0</p>
                </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
                <span id="ai-engine-pill" class="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>AI Proxy Ready</span>
                </span>
                <button id="header-sync-gas-btn" type="button" class="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                    <span>Sync Sheets</span>
                </button>
                <a href="https://teknotama.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white transition-colors">
                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                    <span class="hidden sm:inline">Web Publik</span>
                </a>
            </div>
        </header>

        <!-- Dynamic Views Container -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

            <!-- VIEW 1: OVERVIEW & MONITORING -->
            <section id="view-overview" class="portal-view space-y-6">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Total Leads Pipeline</span>
                        <div class="mt-2 flex items-baseline justify-between">
                            <span id="kpi-total-leads" class="text-2xl sm:text-3xl font-extrabold text-slate-950">0</span>
                            <span class="text-[11px] font-semibold text-slate-500">CRM</span>
                        </div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Prioritas High / Survey</span>
                        <div class="mt-2 flex items-baseline justify-between">
                            <span id="kpi-high-leads" class="text-2xl sm:text-3xl font-extrabold text-[#d9141d]">0</span>
                            <span class="text-[11px] font-semibold text-red-600">Hot B2B</span>
                        </div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Proyek Won</span>
                        <div class="mt-2 flex items-baseline justify-between">
                            <span id="kpi-won-leads" class="text-2xl sm:text-3xl font-extrabold text-emerald-600">0</span>
                            <span class="text-[11px] font-semibold text-emerald-700">Closing</span>
                        </div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Outbound Terkirim</span>
                        <div class="mt-2 flex items-baseline justify-between">
                            <span id="kpi-outbound-sent" class="text-2xl sm:text-3xl font-extrabold text-slate-950">0</span>
                            <span class="text-[11px] font-semibold text-slate-500">HITL</span>
                        </div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-12 gap-6">
                    <!-- Follow-Up Radar -->
                    <div class="lg:col-span-7 tkt-card rounded-2xl p-5 space-y-4">
                        <div class="flex items-center justify-between gap-2">
                            <div>
                                <h2 class="text-sm font-extrabold text-slate-950">Antrean Follow-Up H+3 / H+7</h2>
                                <p class="text-xs text-slate-500">Prospek yang jatuh tempo tindak lanjut hari ini atau terlewat.</p>
                            </div>
                            <button type="button" data-jump-view="leads" class="text-xs font-bold text-[#d9141d] hover:underline">Buka CRM &rarr;</button>
                        </div>
                        <div id="overview-followup-list" class="space-y-2.5 text-xs"></div>
                    </div>

                    <!-- Export & Health -->
                    <div class="lg:col-span-5 space-y-5">
                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <h2 class="text-sm font-extrabold text-slate-950">Ekspor Laporan Excel &amp; Google Sheets</h2>
                            <p class="text-xs text-slate-500">Unduh file CSV (UTF-8 BOM) yang langsung rapi dibuka di Excel atau di-impor ke Google Sheets / Looker Studio.</p>
                            <div class="grid grid-cols-2 gap-2.5 pt-1">
                                <a href="./api.php?action=export_csv&module=leads" class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <i data-lucide="download" class="w-3.5 h-3.5 text-[#d9141d]"></i>
                                    <span>Leads CSV</span>
                                </a>
                                <a href="./api.php?action=export_csv&module=pricing" class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <i data-lucide="download" class="w-3.5 h-3.5 text-[#d9141d]"></i>
                                    <span>Harga CSV</span>
                                </a>
                                <a href="./api.php?action=export_csv&module=outbound" class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <i data-lucide="download" class="w-3.5 h-3.5 text-[#d9141d]"></i>
                                    <span>Outbound CSV</span>
                                </a>
                                <a href="./api.php?action=export_csv&module=casestudies" class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors">
                                    <i data-lucide="download" class="w-3.5 h-3.5 text-[#d9141d]"></i>
                                    <span>Studi Kasus CSV</span>
                                </a>
                            </div>
                        </div>

                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <h2 class="text-sm font-extrabold text-slate-950">Status Integrasi Sistem</h2>
                            <div id="overview-integration-badges" class="space-y-2 text-xs"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW 2: LEAD PIPELINE (MINI-CRM) -->
            <section id="view-leads" class="portal-view hidden space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <input id="leads-search" type="search" placeholder="Cari perusahaan, PIC, lokasi..." class="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                        <select id="leads-status-filter" class="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#d9141d]">
                            <option value="all">Semua Status</option>
                            <option value="New Lead">New Lead</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Survey">Site Survey</option>
                            <option value="Quotation">Quotation</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                    <button id="btn-open-add-lead" type="button" class="px-4 py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Tambah Lead Baru</span>
                    </button>
                </div>

                <div class="tkt-card rounded-2xl overflow-hidden">
                    <div class="overflow-x-auto tkt-scroll">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600">
                                <tr>
                                    <th class="py-3 px-4">Perusahaan &amp; PIC</th>
                                    <th class="py-3 px-4">Kebutuhan &amp; Lokasi</th>
                                    <th class="py-3 px-4">Skor AI</th>
                                    <th class="py-3 px-4">Status Pipeline</th>
                                    <th class="py-3 px-4">Follow-Up</th>
                                    <th class="py-3 px-4 text-right">Aksi Cepat</th>
                                </tr>
                            </thead>
                            <tbody id="leads-table-body" class="divide-y divide-slate-100"></tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- VIEW 3: OUTBOUND CONSOLE (HITL) -->
            <section id="view-outbound" class="portal-view hidden space-y-5">
                <div class="bg-[#090d16] text-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-red-400">Human-in-the-Loop Prospecting</span>
                        <h2 class="text-base font-extrabold mt-0.5">Konsol Outbound Terkurasi (Tanpa Auto-Blast Buta)</h2>
                        <p class="text-xs text-slate-300 mt-1">AI menyusun draf berdasarkan sinyal bisnis (dengan PII masking). Pengiriman email wajib persetujuan staf dan dibatasi kuota harian.</p>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <div class="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-center">
                            <span id="outbound-quota-pill" class="block text-sm font-extrabold text-emerald-400">0 / 25</span>
                            <span class="block text-[10px] text-slate-400">Limit Harian</span>
                        </div>
                        <button id="btn-open-add-outbound" type="button" class="px-4 py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold flex items-center gap-1.5">
                            <i data-lucide="user-plus" class="w-4 h-4"></i>
                            <span>Tambah Prospek</span>
                        </button>
                    </div>
                </div>

                <div class="tkt-card rounded-2xl overflow-hidden">
                    <div class="overflow-x-auto tkt-scroll">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600">
                                <tr>
                                    <th class="py-3 px-4">Target Perusahaan &amp; PIC</th>
                                    <th class="py-3 px-4">Segmen</th>
                                    <th class="py-3 px-4">Sinyal / Trigger</th>
                                    <th class="py-3 px-4">Status Approval</th>
                                    <th class="py-3 px-4 text-right">Aksi AI &amp; Kirim</th>
                                </tr>
                            </thead>
                            <tbody id="outbound-table-body" class="divide-y divide-slate-100"></tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- VIEW 4: MASTER HARGA & ESTIMATOR INTERNAL -->
            <section id="view-pricing" class="portal-view hidden space-y-6">
                <div class="grid lg:grid-cols-12 gap-6 items-start">
                    <!-- Editable Pricing Table -->
                    <div class="lg:col-span-7 tkt-card rounded-2xl p-5 space-y-4">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 class="text-sm font-extrabold text-slate-950">Master Harga Internal (Non-IT Editable)</h2>
                                <p class="text-xs text-slate-500">Hanya untuk referensi sales internal. Kalkulator publik tetap bebas nominal Rupiah.</p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button id="btn-load-pricing-starter" type="button" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold">Muat Template (Rp 0)</button>
                                <button id="btn-open-add-pricing" type="button" class="px-3 py-2 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">+ Item Harga</button>
                            </div>
                        </div>

                        <div class="overflow-x-auto tkt-scroll">
                            <table class="w-full text-left border-collapse text-xs">
                                <thead class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-600">
                                    <tr>
                                        <th class="py-2.5 px-3">Kode / Item</th>
                                        <th class="py-2.5 px-3">Satuan</th>
                                        <th class="py-2.5 px-3">Rentang (IDR)</th>
                                        <th class="py-2.5 px-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="pricing-table-body" class="divide-y divide-slate-100"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Dynamic Sales Quick Estimator -->
                    <div class="lg:col-span-5 bg-[#090d16] text-white rounded-2xl p-5 space-y-4 border border-slate-800">
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-red-400">Sales Internal Tool</span>
                            <h2 class="text-sm font-extrabold mt-0.5">Kalkulator Rentang Estimasi Cepat</h2>
                            <p class="text-xs text-slate-400">Dihitung dinamis dari Master Harga di samping (bukan angka hardcode).</p>
                        </div>

                        <div id="estimator-inputs-list" class="space-y-2.5 max-h-64 overflow-y-auto tkt-scroll pr-1"></div>

                        <button id="btn-run-internal-estimate" type="button" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold transition-colors">
                            Hitung Estimasi Internal
                        </button>

                        <div id="estimator-result-box" class="hidden bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-2 text-xs">
                            <span class="text-[10px] uppercase font-bold text-slate-400">Rentang Estimasi Kasar (Internal Sales)</span>
                            <div id="estimator-range-text" class="text-lg font-extrabold text-emerald-400"></div>
                            <ul id="estimator-breakdown-list" class="space-y-1 text-[11px] text-slate-300"></ul>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW 5: AI CASE STUDY & PROPOSAL GENERATOR -->
            <section id="view-casestudy" class="portal-view hidden space-y-6">
                <div class="grid lg:grid-cols-12 gap-6 items-start">
                    <form id="casestudy-form" class="lg:col-span-5 tkt-card rounded-2xl p-5 space-y-3.5 no-print">
                        <div>
                            <h2 class="text-sm font-extrabold text-slate-950">Form Proyek Selesai (3 Menit)</h2>
                            <p class="text-xs text-slate-500">Ubah catatan lapangan menjadi Draf Artikel Studi Kasus SEO + Outline Proposal B2B.</p>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Judul Proyek *</label>
                            <input id="cs-title" type="text" required placeholder="Re-Cabling Cat6A & Perapihan Rack Server 2 Lantai" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sektor Industri *</label>
                                <input id="cs-industry" type="text" required placeholder="Logistik / Manufaktur" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Jumlah Titik / Perangkat</label>
                                <input id="cs-points" type="text" placeholder="64 titik Cat6A + 4 link FO" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Masalah Awal Klien *</label>
                            <textarea id="cs-problem" rows="3" required placeholder="Kabel antar switch semrawut tanpa label, sering loop/packet loss di jam operasional..." class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]"></textarea>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Hasil Uji (Fluke / OTDR / Zero-Downtime)</label>
                            <input id="cs-test" type="text" placeholder="64/64 titik Pass Fluke DSX, eksekusi Sabtu-Minggu Zero-Downtime" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                        </div>
                        <button type="submit" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold shadow-md shadow-red-600/20">
                            Generate Studi Kasus &amp; Proposal AI
                        </button>
                    </form>

                    <div class="lg:col-span-7 space-y-4 print-area">
                        <div class="tkt-card rounded-2xl p-5 space-y-4">
                            <div class="flex flex-wrap items-center justify-between gap-2 no-print">
                                <h2 class="text-sm font-extrabold text-slate-950">Hasil Draf &amp; Arsip Studi Kasus</h2>
                                <button id="btn-print-casestudy" type="button" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800">Cetak / Simpan PDF</button>
                            </div>
                            <div id="casestudy-preview-box" class="space-y-4 text-xs">
                                <p class="text-slate-500">Pilih arsip di bawah atau isi form untuk menghasilkan studi kasus &amp; proposal baru.</p>
                            </div>
                        </div>
                        <div id="casestudy-history-list" class="space-y-2.5 no-print"></div>
                    </div>
                </div>
            </section>

            <!-- VIEW 6: INTEGRASI, PROFIL MODULAR, USERS, LOGS & SOP -->
            <section id="view-settings" class="portal-view hidden space-y-6">
                <div class="grid lg:grid-cols-12 gap-6 items-start">
                    <!-- Modular Business Profile & Integrations -->
                    <div class="lg:col-span-6 space-y-6">
                        <form id="business-profile-form" class="tkt-card rounded-2xl p-5 space-y-3.5">
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-[#d9141d]">Modular White-Label Config</span>
                                <h2 class="text-sm font-extrabold text-slate-950">Profil Bisnis &amp; Konteks AI</h2>
                                <p class="text-xs text-slate-500">Diubah lewat UI tanpa mengedit kode (mendukung adaptasi multi-bisnis).</p>
                            </div>
                            <div class="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama Perusahaan</label>
                                    <input id="biz-company" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Brand Singkat</label>
                                    <input id="biz-short" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Resmi</label>
                                    <input id="biz-email" type="email" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">No. WhatsApp (628...)</label>
                                    <input id="biz-wa" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Ringkasan Layanan &amp; Standar Teknis</label>
                                <textarea id="biz-services" rows="2" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Proposisi Nilai Utama</label>
                                <textarea id="biz-value" rows="2" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                            </div>
                            <button type="submit" class="px-4 py-2 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white text-xs font-bold transition-colors">Simpan Profil Bisnis</button>
                        </form>

                        <form id="integrations-form" class="tkt-card rounded-2xl p-5 space-y-3.5">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-sm font-extrabold text-slate-950">Integrasi Rp 0 (Telegram, Google Sheets &amp; Kuota)</h2>
                                    <p class="text-xs text-slate-500">Token tersimpan di server (terproteksi 403), tidak pernah dikirim kembali ke browser.</p>
                                </div>
                                <button id="btn-test-telegram" type="button" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800">Tes Telegram</button>
                            </div>
                            <div class="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Telegram Bot Token (kosongkan jika tetap)</label>
                                    <input id="int-tg-token" type="password" placeholder="123456:ABC..." class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Telegram Chat ID</label>
                                    <input id="int-tg-chat" type="text" placeholder="-100..." class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Google Apps Script Web App URL (Opsional)</label>
                                <input id="int-gas-url" type="url" placeholder="https://script.google.com/macros/s/.../exec" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            </div>
                            <div class="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">GAS Shared Secret</label>
                                    <input id="int-gas-secret" type="password" placeholder="Opsional jika tetap" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Batas Email Outbound / Hari</label>
                                    <input id="int-daily-limit" type="number" min="1" max="200" value="25" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                            </div>
                            <button type="submit" class="px-4 py-2 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Simpan Pengaturan Integrasi</button>
                        </form>
                    </div>

                    <!-- Users, SOP & Logs -->
                    <div class="lg:col-span-6 space-y-6">
                        <!-- User Management (Admin) -->
                        <div id="users-management-card" class="tkt-card rounded-2xl p-5 space-y-4">
                            <div>
                                <h2 class="text-sm font-extrabold text-slate-950">Manajemen Akun Staf Marketing</h2>
                                <p class="text-xs text-slate-500">Tambah akun sales/marketing tanpa menyentuh file PHP lewat FTP.</p>
                            </div>
                            <form id="user-add-form" class="grid sm:grid-cols-4 gap-2">
                                <input id="new-user-name" type="text" required placeholder="Nama Lengkap" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <input id="new-user-username" type="text" required minlength="3" placeholder="username" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <input id="new-user-password" type="password" required minlength="8" placeholder="Pass min 8 char" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <button type="submit" class="px-3 py-2 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white text-xs font-bold">Tambah Staf</button>
                            </form>
                            <div id="users-list-box" class="space-y-2 text-xs"></div>
                        </div>

                        <!-- 1-Page SOP Ringkas -->
                        <div class="tkt-card rounded-2xl p-5 space-y-3 text-xs leading-relaxed text-slate-700">
                            <h2 class="text-sm font-extrabold text-slate-950">SOP 1 Halaman (Staf Non-IT)</h2>
                            <ol class="list-decimal ml-4 space-y-1.5">
                                <li><strong>Cek Antrean Harian:</strong> Buka tab <em>Ringkasan</em> setiap pagi untuk melihat lead jatuh tempo follow-up H+3/H+7.</li>
                                <li><strong>Balas Lead &lt; 1 Jam:</strong> Di <em>Lead Pipeline</em>, klik <strong>AI Score &amp; Balas</strong> &rarr; review draf (PII disamarkan otomatis saat ke AI) &rarr; klik <strong>Kirim Email</strong> atau <strong>Buka WhatsApp</strong>.</li>
                                <li><strong>Outbound Terukur:</strong> Jangan mengirim di luar jam kerja atau melebihi batas harian (25/hari). Wajib review manual sebelum klik kirim.</li>
                                <li><strong>Update Harga &amp; Laporan:</strong> Ubah tarif di tab <em>Master Harga</em> kapan saja; unduh CSV di tab <em>Ringkasan</em> untuk rapat mingguan Excel / Google Sheets / Looker Studio.</li>
                            </ol>
                        </div>

                        <!-- System Logs -->
                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <div class="flex items-center justify-between">
                                <h2 class="text-sm font-extrabold text-slate-950">Log Aktivitas &amp; Error Alerting</h2>
                                <a href="./api.php?action=export_csv&module=logs" class="text-xs font-bold text-[#d9141d] hover:underline">Ekspor Logs CSV</a>
                            </div>
                            <div id="system-logs-list" class="max-h-60 overflow-y-auto tkt-scroll space-y-1.5 text-[11px]"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW 7: AI ACCOUNT RESEARCHER & RSS SIGNAL RADAR -->
            <section id="view-research" class="portal-view hidden space-y-6">
                <div class="grid lg:grid-cols-12 gap-6 items-start">
                    <!-- Left: Analyze Single Website / Batch CSV / RSS Radar Config -->
                    <div class="lg:col-span-5 space-y-5">
                        <form id="research-form" class="tkt-card rounded-2xl p-5 space-y-3.5">
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-[#d9141d]">AI Account Intelligence</span>
                                <h2 class="text-sm font-extrabold text-slate-950">Riset &amp; Analisa Website Perusahaan</h2>
                                <p class="text-xs text-slate-500">Masukkan nama &amp; website perusahaan target. Sistem membaca halaman publik (aman SSRF), mengekstrak kontak resmi, &amp; menilai kecocokan ICP.</p>
                            </div>
                            <div class="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama Perusahaan</label>
                                    <input id="res-company" type="text" placeholder="PT Mitra Logistik Nusantara" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sektor / Industri</label>
                                    <input id="res-industry" type="text" placeholder="Logistik / Manufaktur / Fit-Out" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Website Resmi Perusahaan</label>
                                <input id="res-url" type="text" placeholder="https://perusahaantarget.co.id" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Konteks / Sinyal Tambahan (Opsional)</label>
                                <textarea id="res-notes" rows="2" placeholder="Misal: Buka gudang baru di Cikarang atau lowongan IT Support..." class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#d9141d]"></textarea>
                            </div>
                            <button id="btn-run-research" type="submit" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5">
                                <i data-lucide="search-check" class="w-4 h-4"></i>
                                <span>Riset Website &amp; Analisa AI</span>
                            </button>
                        </form>

                        <!-- Batch Domain Import -->
                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <div>
                                <h3 class="text-sm font-extrabold text-slate-950">Impor Daftar Prospek Massal (Batch)</h3>
                                <p class="text-xs text-slate-500">Tempel daftar target (1 baris = <code>Nama Perusahaan, Website, Industri</code>) untuk masuk antrean riset.</p>
                            </div>
                            <textarea id="res-batch-text" rows="3" placeholder="PT Maju Jaya, https://majujaya.co.id, Logistik&#10;PT Karya Bangun, https://karyabangun.id, Fit-Out Interior" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#d9141d]"></textarea>
                            <button id="btn-research-batch" type="button" class="w-full py-2 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white text-xs font-bold transition-colors">
                                Masukkan ke Antrean Riset
                            </button>
                        </div>

                        <!-- RSS / Google Alerts Market Radar -->
                        <div class="tkt-card rounded-2xl p-5 space-y-3.5">
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <h3 class="text-sm font-extrabold text-slate-950">Radar Sinyal Pasar (RSS / Google Alerts)</h3>
                                    <p class="text-[11px] text-slate-500">Tangkap berita ekspansi kantor, pabrik baru, &amp; tender secara gratis.</p>
                                </div>
                                <button id="btn-rss-scan" type="button" class="px-3 py-1.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-[11px] font-bold flex-shrink-0">Scan Sekarang</button>
                            </div>
                            <form id="rss-feed-form" class="space-y-2.5">
                                <div class="grid grid-cols-2 gap-2">
                                    <input id="rss-label" type="text" placeholder="Label (mis: Google Alert Pabrik)" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                    <input id="rss-url" type="url" required placeholder="https://www.google.co.id/alerts/feeds/..." class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <input id="rss-keywords" type="text" placeholder="Kata kunci (pisah koma, opsional)" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <button type="submit" class="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold">+ Tambah Feed RSS</button>
                            </form>
                            <div id="rss-feeds-list" class="space-y-1.5 text-xs"></div>
                        </div>
                    </div>

                    <!-- Right: Research Results & Market Signals Feed -->
                    <div class="lg:col-span-7 space-y-5">
                        <div id="research-detail-card" class="tkt-card rounded-2xl p-5 space-y-4">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <h2 class="text-sm font-extrabold text-slate-950">Analisa Lengkap Company Profile &amp; Kontak</h2>
                                <div class="flex items-center gap-2">
                                    <a href="./api.php?action=export_csv&module=research" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-800">Ekspor Riset CSV</a>
                                </div>
                            </div>
                            <div id="research-detail-body" class="text-xs text-slate-500">
                                Pilih perusahaan dari daftar di bawah atau jalankan riset website baru untuk melihat analisa ICP, kontak publik yang ditemukan, dan kebutuhan IT-nya.
                            </div>
                        </div>

                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <div class="flex items-center justify-between gap-2">
                                <h3 class="text-sm font-extrabold text-slate-950">Daftar Perusahaan Hasil Riset</h3>
                                <input id="research-search" type="search" placeholder="Cari perusahaan / industri..." class="w-48 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            </div>
                            <div id="research-accounts-list" class="space-y-2.5 max-h-80 overflow-y-auto tkt-scroll"></div>
                        </div>

                        <div class="tkt-card rounded-2xl p-5 space-y-3">
                            <div class="flex items-center justify-between gap-2">
                                <h3 class="text-sm font-extrabold text-slate-950">Sinyal Peluang Pasar (RSS Radar)</h3>
                                <a href="./api.php?action=export_csv&module=signals" class="text-[11px] font-bold text-[#d9141d] hover:underline">Ekspor Sinyal CSV</a>
                            </div>
                            <div id="market-signals-list" class="space-y-2 max-h-72 overflow-y-auto tkt-scroll text-xs"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VIEW 8: MARKETING FUNNEL ANALYTICS (TOFU -> MOFU -> BOFU) -->
            <section id="view-funnel" class="portal-view hidden space-y-6">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Lead &rarr; Qualified</span>
                        <div class="mt-2 text-2xl font-extrabold text-slate-950" id="funnel-rate-qualified">0%</div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Lead &rarr; Site Survey</span>
                        <div class="mt-2 text-2xl font-extrabold text-[#d9141d]" id="funnel-rate-survey">0%</div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Survey &rarr; Quotation</span>
                        <div class="mt-2 text-2xl font-extrabold text-slate-950" id="funnel-rate-quote">0%</div>
                    </div>
                    <div class="tkt-card rounded-2xl p-4 sm:p-5">
                        <span class="text-[11px] font-bold uppercase text-slate-500">Win Rate (Lead &rarr; Won)</span>
                        <div class="mt-2 text-2xl font-extrabold text-emerald-600" id="funnel-rate-won">0%</div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-12 gap-6 items-start">
                    <!-- Funnel Stages Bar Visualization -->
                    <div class="lg:col-span-7 tkt-card rounded-2xl p-5 space-y-4">
                        <div>
                            <h2 class="text-sm font-extrabold text-slate-950">Alur Marketing Funnel (TOFU &rarr; MOFU &rarr; BOFU)</h2>
                            <p class="text-xs text-slate-500">Dihitung real-time dari data Riset AI, Outbound Console, dan Lead Pipeline (Website + Manual).</p>
                        </div>
                        <div id="funnel-stages-bars" class="space-y-3 text-xs"></div>

                        <div class="pt-3 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
                            <div>
                                <h3 class="text-xs font-extrabold text-slate-900 mb-2">Leads Berdasarkan Sumber</h3>
                                <div id="funnel-source-breakdown" class="space-y-1.5 text-xs"></div>
                            </div>
                            <div>
                                <h3 class="text-xs font-extrabold text-slate-900 mb-2">Permintaan per Kategori Layanan</h3>
                                <div id="funnel-service-breakdown" class="space-y-1.5 text-xs"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Top-of-Funnel Traffic Input + AI Funnel Coach -->
                    <div class="lg:col-span-5 space-y-5">
                        <form id="funnel-traffic-form" class="tkt-card rounded-2xl p-5 space-y-3">
                            <div>
                                <h3 class="text-sm font-extrabold text-slate-950">Catat Traffic Web / GA4 (TOFU)</h3>
                                <p class="text-xs text-slate-500">Masukkan ringkasan pengunjung dari GTM/GA4 agar rasio konversi Web &rarr; Lead terhitung lengkap.</p>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Pengunjung Web</label>
                                    <input id="fn-web-visits" type="number" min="0" value="0" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Pakai Kalkulator BOQ</label>
                                    <input id="fn-boq-uses" type="number" min="0" value="0" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Label Periode</label>
                                <input id="fn-period" type="text" value="Bulan Berjalan" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            </div>
                            <button type="submit" class="w-full py-2 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white text-xs font-bold transition-colors">Simpan Metrik TOFU</button>
                        </form>

                        <div class="bg-[#090d16] text-white rounded-2xl p-5 space-y-3 border border-slate-800">
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-red-400">AI Funnel Coach</span>
                                    <h3 class="text-sm font-extrabold">Diagnosa Bottleneck &amp; Strategi</h3>
                                </div>
                                <button id="btn-run-funnel-coach" type="button" class="px-3 py-1.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Analisa AI</button>
                            </div>
                            <pre id="funnel-coach-output" class="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">Klik "Analisa AI" untuk membaca bottleneck konversi funnel saat ini dan prioritas aksi minggu ini.</pre>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- MODAL: ADD / EDIT LEAD -->
    <div id="modal-lead" class="hidden fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto tkt-scroll p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between">
                <h3 id="modal-lead-title" class="text-base font-extrabold text-slate-950">Tambah Lead B2B</h3>
                <button type="button" data-close-modal="modal-lead" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <form id="lead-form" class="space-y-3">
                <input type="hidden" id="lead-id" value="">
                <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Perusahaan *</label>
                        <input id="lead-company" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama PIC</label>
                        <input id="lead-pic" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Kerja</label>
                        <input id="lead-email" type="email" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">No. WhatsApp</label>
                        <input id="lead-wa" type="text" placeholder="0812..." class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Lokasi Proyek</label>
                        <input id="lead-location" type="text" placeholder="Jakarta Selatan / Cikarang" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Kategori Layanan</label>
                        <select id="lead-service" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <option value="Fiber Optic & LAN Cat6/Cat6A">Fiber Optic &amp; LAN Cat6/Cat6A</option>
                            <option value="Server, Rack & Data Center">Server, Rack &amp; Data Center</option>
                            <option value="Firewall Security & VPN">Firewall Security &amp; VPN</option>
                            <option value="IP CCTV & Access Control">IP CCTV &amp; Access Control</option>
                            <option value="Enterprise Wi-Fi & Heatmap">Enterprise Wi-Fi &amp; Heatmap</option>
                            <option value="Managed IT & NOC 24/7">Managed IT &amp; NOC 24/7</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Status Pipeline</label>
                        <select id="lead-status" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <option value="New Lead">New Lead</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Survey">Site Survey</option>
                            <option value="Quotation">Quotation</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Jadwal Follow-Up</label>
                        <input id="lead-followup" type="date" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Ringkasan BOQ / Parameter Teknis</label>
                    <textarea id="lead-boq" rows="2" placeholder="Misal: 45 titik Cat6A, 2 link FO OS2, 1 rack server 24U" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Catatan Sales</label>
                    <textarea id="lead-notes" rows="2" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Simpan Data Lead</button>
            </form>
        </div>
    </div>

    <!-- MODAL: AI LEAD SCORE & HUMAN-APPROVED QUICK RESPONSE -->
    <div id="modal-lead-ai" class="hidden fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto tkt-scroll p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">PII Masking Aktif</span>
                    <h3 id="ai-lead-modal-title" class="text-base font-extrabold text-slate-950 mt-1">AI Lead Scoring &amp; Draf Balas Cepat</h3>
                </div>
                <button type="button" data-close-modal="modal-lead-ai" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div id="ai-lead-score-banner" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"></div>
            <details class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px]">
                <summary class="font-bold text-slate-700 cursor-pointer">Audit Masking PII (Data yang Dikirim ke LLM Free-Tier)</summary>
                <pre id="ai-lead-masked-preview" class="mt-2 whitespace-pre-wrap text-slate-600 font-mono text-[10px]"></pre>
            </details>
            <div class="space-y-3">
                <input type="hidden" id="ai-lead-id" value="">
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Subject Email (Dapat Diedit)</label>
                    <input id="ai-lead-email-subject" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Isi Email Penawaran / Survei (Review Manusia)</label>
                    <textarea id="ai-lead-email-body" rows="7" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Draf WhatsApp Click-to-Chat</label>
                    <textarea id="ai-lead-wa-draft" rows="3" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
                </div>
            </div>
            <div class="flex flex-wrap gap-2.5 pt-2">
                <button id="btn-lead-send-approved-email" type="button" class="flex-1 py-2.5 px-4 rounded-xl bg-[#090d16] hover:bg-[#d9141d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <i data-lucide="mail" class="w-4 h-4"></i>
                    <span>Kirim Email (Human-Approved)</span>
                </button>
                <a id="btn-lead-open-wa" href="#" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>Buka WhatsApp (wa.me) dengan Draf</span>
                </a>
            </div>
        </div>
    </div>

    <!-- MODAL: ADD / EDIT OUTBOUND PROSPECT -->
    <div id="modal-outbound" class="hidden fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-950">Tambah Target Outbound B2B</h3>
                <button type="button" data-close-modal="modal-outbound" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <form id="outbound-form" class="space-y-3">
                <input type="hidden" id="out-id" value="">
                <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Segmen Target</label>
                        <select id="out-segment" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <option value="Kontraktor Interior / Fit-Out">Kontraktor Interior / Fit-Out</option>
                            <option value="Pengelola Gedung / Building Mgmt">Pengelola Gedung / Building Mgmt</option>
                            <option value="IT Manager / Head of Infra">IT Manager / Head of Infra</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Perusahaan *</label>
                        <input id="out-company" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama PIC</label>
                        <input id="out-pic" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Jabatan PIC</label>
                        <input id="out-role" type="text" placeholder="Project Manager / IT Lead" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Target *</label>
                        <input id="out-email" type="email" required class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">WhatsApp</label>
                        <input id="out-wa" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sinyal Trigger Bisnis *</label>
                    <input id="out-trigger" type="text" required placeholder="Misal: Baru buka cabang SCBD / tender renovasi kantor 3 lantai" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                </div>
                <button type="submit" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Simpan Prospek Outbound</button>
            </form>
        </div>
    </div>

    <!-- MODAL: OUTBOUND HUMAN-IN-THE-LOOP REVIEW & SEND -->
    <div id="modal-outbound-review" class="hidden fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto tkt-scroll p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-950">Review Draf Outbound (Human-in-the-Loop)</h3>
                <button type="button" data-close-modal="modal-outbound-review" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <input type="hidden" id="rev-out-id" value="">
            <div>
                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Subject Email</label>
                <input id="rev-out-subject" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            </div>
            <div>
                <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Isi Email Personalisasi (Wajib Review Staf)</label>
                <textarea id="rev-out-body" rows="8" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"></textarea>
            </div>
            <button id="btn-outbound-send-approved" type="button" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">
                Setujui &amp; Kirim Email (Kurangi Kuota Harian)
            </button>
        </div>
    </div>

    <!-- MODAL: ADD / EDIT PRICING ITEM -->
    <div id="modal-pricing" class="hidden fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-950">Item Master Harga Internal</h3>
                <button type="button" data-close-modal="modal-pricing" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <form id="pricing-form" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Kode Item</label>
                        <input id="prc-code" type="text" placeholder="Otomatis jika kosong" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Satuan *</label>
                        <input id="prc-unit" type="text" required value="titik" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nama Material / Jasa *</label>
                    <input id="prc-name" type="text" required class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Kategori</label>
                    <input id="prc-category" type="text" value="Structured Cabling" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Harga Min (IDR)</label>
                        <input id="prc-min" type="number" min="0" value="0" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Harga Max (IDR)</label>
                        <input id="prc-max" type="number" min="0" value="0" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Catatan Teknis</label>
                    <input id="prc-notes" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                </div>
                <button type="submit" class="w-full py-2.5 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Simpan Item Harga</button>
            </form>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast-container" class="hidden fixed bottom-5 right-5 z-[60] bg-[#090d16] text-white border border-red-500/60 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold no-print"></div>

    <script src="./assets/app.js?v=20261126" defer></script>
</body>
</html>
