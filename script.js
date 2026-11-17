/**
 * PT Teknotama Prakarsa Mulia - Main Frontend Logic
 * Modul:
 *  1. Navigasi, Portfolio Filter & FAQ Accordion
 *  2. Enterprise IT Scope & Technical BOQ Configurator (Tanpa Nominal Harga)
 *  3. TeknoAssist AI Field Engineer (Floating Widget + Pre-Booking Triage)
 *  4. Pengiriman Formulir Survei & BOQ ke teknotama_api.php (admin@teknotama.com)
 */

(function () {
    'use strict';

    /* ========================================================================
     * 1. STATE GLOBAL APLIKASI
     * ======================================================================== */

    const BUILDING_PRESETS = {
        office: {
            label: 'Kantor Korporat / Startup',
            users: 60,
            floors: 2,
            areaPerFloor: 350,
            partition: 'gypsum',
            cableType: 'cat6',
            foType: 'om3',
            pathway: 'existing_tray',
            vendorTier: 'tier2',
            wanCount: 2,
            vpnBranches: 2,
            flukeTest: true,
            enableCctv: true,
            cctvIndoor: 8,
            cctvOutdoor: 4,
            cctvRes: '4mp',
            cctvDays: 30,
            enableAccess: true,
            accessDoors: 2,
            enableServer: true,
            serverMode: 'single_host',
            cloudBackup: true,
            upsMinutes: 30
        },
        warehouse: {
            label: 'Gudang / Pabrik / Logistik',
            users: 40,
            floors: 1,
            areaPerFloor: 1500,
            partition: 'open',
            cableType: 'cat6a',
            foType: 'os2',
            pathway: 'new_conduit',
            vendorTier: 'tier2',
            wanCount: 2,
            vpnBranches: 3,
            flukeTest: true,
            enableCctv: true,
            cctvIndoor: 16,
            cctvOutdoor: 12,
            cctvRes: '4mp',
            cctvDays: 60,
            enableAccess: true,
            accessDoors: 4,
            enableServer: true,
            serverMode: 'nas',
            cloudBackup: true,
            upsMinutes: 30
        },
        clinic: {
            label: 'Klinik / Rumah Sakit / Sekolah',
            users: 120,
            floors: 3,
            areaPerFloor: 500,
            partition: 'concrete',
            cableType: 'cat6a',
            foType: 'os2',
            pathway: 'new_conduit',
            vendorTier: 'tier3',
            wanCount: 2,
            vpnBranches: 1,
            flukeTest: true,
            enableCctv: true,
            cctvIndoor: 20,
            cctvOutdoor: 6,
            cctvRes: '4mp',
            cctvDays: 60,
            enableAccess: true,
            accessDoors: 6,
            enableServer: true,
            serverMode: 'ha_cluster',
            cloudBackup: true,
            upsMinutes: 60
        },
        retail: {
            label: 'Ruko / Kantor Cabang / Retail',
            users: 20,
            floors: 2,
            areaPerFloor: 120,
            partition: 'gypsum',
            cableType: 'cat6',
            foType: 'om3',
            pathway: 'new_conduit',
            vendorTier: 'tier1',
            wanCount: 2,
            vpnBranches: 1,
            flukeTest: true,
            enableCctv: true,
            cctvIndoor: 6,
            cctvOutdoor: 2,
            cctvRes: '2mp',
            cctvDays: 30,
            enableAccess: false,
            accessDoors: 0,
            enableServer: false,
            serverMode: 'nas',
            cloudBackup: false,
            upsMinutes: 15
        }
    };

    const VENDOR_CATALOG = {
        tier1: {
            name: 'Tier 1 — Value Enterprise',
            router: 'MikroTik CCR2004-16G-2S+ / RB5009',
            firewall: 'MikroTik Stateful Firewall + IPS/IDS Ruleset',
            coreSwitch: 'Ruijie Reyee RG-NBS5100-24GT4SFP-P',
            accessSwitch24: 'Ruijie Reyee 24-Port Gigabit PoE+ (SFP Uplink)',
            accessSwitch48: 'Ruijie Reyee 48-Port Gigabit PoE+ (SFP+ Uplink)',
            ap: 'Ruijie / UniFi U6+ Dual-Band Wi-Fi 6 Ceiling AP',
            nvr: 'Hikvision AcuSense 4K NVR',
            server: 'Synology RackStation RS822+ / Entry Server'
        },
        tier2: {
            name: 'Tier 2 — Corporate Standard',
            router: 'Fortinet FortiGate 60F / 100F NGFW UTM',
            firewall: 'Fortinet FortiGate Next-Gen Firewall (IPS + Web Filter)',
            coreSwitch: 'Cisco Business CBS350 / Aruba Instant On 1960 10G',
            accessSwitch24: 'Cisco Business CBS250-24FP / Aruba 24G PoE+',
            accessSwitch48: 'Cisco Business CBS250-48PP / Aruba 48G PoE+',
            ap: 'Cisco Business 150AX / Aruba Instant On AP22 Wi-Fi 6',
            nvr: 'Hikvision / Dahua Enterprise RAID NVR',
            server: 'Dell PowerEdge R350 + Synology Enterprise NAS'
        },
        tier3: {
            name: 'Tier 3 — Mission Critical HA',
            router: 'Fortinet FortiGate 200F HA Pair / Palo Alto PA-1410',
            firewall: 'High-Availability NGFW Active-Passive Cluster',
            coreSwitch: 'Cisco Catalyst 9200L / 9300 L3 Stackable 10G SFP+',
            accessSwitch24: 'Cisco Catalyst 1300 / 9200 24-Port PoE+ Redundant',
            accessSwitch48: 'Cisco Catalyst 1300 / 9200 48-Port PoE+ Redundant',
            ap: 'Cisco Catalyst 9115AX / Aruba AP-515 Wi-Fi 6 Enterprise',
            nvr: 'Enterprise NVR Dual-NIC RAID5/6 Hot-Swap',
            server: 'Dell PowerEdge R650 HA Cluster (VMware ESXi / Proxmox)'
        }
    };

    const SOP_KNOWLEDGE_BASE = [
        {
            id: 'sop-utp-90m',
            title: 'Batas Jarak Kabel UTP (90m) & Pemilihan Cat6 vs Cat6A',
            tags: 'kabel utp cat6 cat6a tia-568 jarak 90 meter permanent link',
            summary: 'Sesuai standar ANSI/TIA-568, tarikan horizontal UTP dibatasi maksimal 90m permanent link (+10m patch cord). Cat6 cukup untuk 1 Gbps hingga 90m, sedangkan Cat6A Shielded direkomendasikan untuk 10 Gbps penuh & area interferensi tinggi.'
        },
        {
            id: 'sop-fiber-optic',
            title: 'Kapan Wajib Memakai Fiber Optic Backbone & Standar Splicing',
            tags: 'fiber optic fo om3 om4 os2 singlemode multimode otb splicing sfp+',
            summary: 'Tarikan antar lantai, antar gedung, atau jarak >90 meter wajib memakai Fiber Optic (Singlemode OS2 / Multimode OM3-OM4) yang diterminasi di OTB menggunakan Fusion Splicer dengan toleransi splice loss di bawah 0.1 dB.'
        },
        {
            id: 'sop-conduit-tray',
            title: 'SOP Pipa Conduit, Cable Tray & Jarak Kabel Listrik',
            tags: 'conduit pipa tray wiremesh plafon listrik interferensi kerapihan',
            summary: 'Penarikan di atas plafon dilindungi Pipa Conduit High-Impact 20/25mm atau Galvanized Cable Tray (isi maksimal 40–50%). Jarak aman dari kabel listrik tegangan tinggi minimal 30 cm dan persilangan wajib tegak lurus 90 derajat.'
        },
        {
            id: 'sop-zero-downtime',
            title: 'Metode Kerja Tanpa Mengganggu Operasional (Zero-Downtime)',
            tags: 'downtime jam kerja malam sabtu minggu cutover staging workshop',
            summary: 'Perangkat aktif di-staging & pre-configure di workshop Teknotama. Pengeboran, pemasangan tray, dan tarikan utama dijadwalkan di luar jam operasional (night shift/weekend) lalu dilakukan parallel cutover.'
        },
        {
            id: 'sop-fluke-otdr',
            title: 'Uji Sertifikasi Fluke, OTDR & Dokumentasi As-Built Drawing',
            tags: 'fluke otdr opm sertifikasi test report as-built drawing uat label',
            summary: 'Setiap titik kabel diberi thermal wrap-around label di kedua ujung (TIA-606-B), diuji memakai Fluke Cable Certifier (UTP) & OTDR/OPM (FO), serta diserahkan lengkap bersama As-Built Drawing dan berita acara UAT.'
        },
        {
            id: 'sop-wifi-redaman',
            title: 'Perhitungan Access Point Wi-Fi 6 Berdasarkan Sekat & Kepadatan',
            tags: 'wifi access point ap tembok beton partisi gypsum coverage roaming',
            summary: 'Jumlah AP ditentukan oleh kapasitas user (~25 user/AP) sekaligus redaman bangunan (Open Space ~150m², Partisi Kaca/Gypsum ~90m², Dinding Beton ~55m²) agar roaming antar ruangan tetap mulus tanpa dead-zone.'
        },
        {
            id: 'sop-cctv-nvr',
            title: 'Sizing Storage NVR CCTV (H.265+) & Backup Daya UPS',
            tags: 'cctv nvr kamera harddisk storage hdd tb h265 ups poe',
            summary: 'Perhitungan kapasitas HDD menggunakan bitrate H.265+ (2MP/4MP/8MP) dikali hari retensi + 15% overhead. Kamera dipisah ke VLAN khusus dan ditenagai PoE+ Switch yang dibackup Online Sinewave UPS.'
        },
        {
            id: 'sop-sla-garansi',
            title: 'Garansi Pekerjaan, Hardware Resmi & SLA Emergency < 2 Jam',
            tags: 'garansi sla noc emergency jabodetabek luar kota pulau',
            summary: 'Teknotama memberi garansi penataan kabel 1 tahun, garansi hardware resmi distributor 1–3 tahun, pemantauan NOC 24/7, respons emergency onsite < 2 jam (Jabodetabek), serta layanan proyek ke seluruh Indonesia.'
        }
    ];

    const calcState = Object.assign({}, BUILDING_PRESETS.office, {
        mode: 'quick', // 'quick' | 'tech'
        preset: 'office',
        activeTechTab: 'dimensi'
    });

    let lastComputedBoq = null;
    let attachBoqToBooking = false;
    let chatHistory = [];
    let isChatBusy = false;
    let widgetOpen = false;
    let widgetActiveTab = 'home'; // 'home' | 'chat'

    /* ========================================================================
     * 2. UTILITAS UMUM & MARKDOWN PARSER AMAN
     * ======================================================================== */

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderSafeMarkdown(rawText) {
        const escaped = escapeHtml(rawText);
        const lines = escaped.split(/\r?\n/);
        let html = '';
        let inUl = false;
        let inOl = false;

        function closeLists() {
            if (inUl) {
                html += '</ul>';
                inUl = false;
            }
            if (inOl) {
                html += '</ol>';
                inOl = false;
            }
        }

        function formatInline(line) {
            return line
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>');
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') {
                closeLists();
                continue;
            }

            if (/^[-*_]{3,}$/.test(line)) {
                closeLists();
                html += '<hr class="border-red-950/60 my-2">';
            } else if (/^\|.+\|$/.test(line)) {
                closeLists();
                if (!/^\|[\s:|-]+\|$/.test(line)) {
                    const cells = line.split('|').slice(1, -1).map(function (c) { return c.trim(); }).filter(Boolean);
                    if (cells.length > 0) {
                        html += '<p class="text-[11px] bg-[#080d1a] px-2 py-1 rounded border border-red-950/60">' + formatInline(cells.join(' • ')) + '</p>';
                    }
                }
            } else if (/^#{2,4}\s+/.test(line)) {
                closeLists();
                html += '<h4>' + formatInline(line.replace(/^#{2,4}\s+/, '')) + '</h4>';
            } else if (/^[-*•]\s+/.test(line)) {
                if (inOl) {
                    html += '</ol>';
                    inOl = false;
                }
                if (!inUl) {
                    html += '<ul>';
                    inUl = true;
                }
                html += '<li>' + formatInline(line.replace(/^[-*•]\s+/, '')) + '</li>';
            } else if (/^\d+\.\s+/.test(line)) {
                const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
                const startNum = olMatch ? parseInt(olMatch[1], 10) : 1;
                const itemText = olMatch ? olMatch[2] : line;
                if (inUl) {
                    html += '</ul>';
                    inUl = false;
                }
                if (!inOl) {
                    html += startNum > 1 ? '<ol start="' + startNum + '">' : '<ol>';
                    inOl = true;
                }
                html += '<li>' + formatInline(itemText) + '</li>';
            } else {
                closeLists();
                html += '<p>' + formatInline(line) + '</p>';
            }
        }

        closeLists();
        return html || '<p>' + escaped + '</p>';
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function showToast(text) {
        const toast = document.getElementById('tkt-toast');
        if (!toast) return;
        toast.textContent = text;
        toast.classList.remove('hidden', 'opacity-0');
        toast.classList.add('opacity-100');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.add('opacity-0');
            setTimeout(function () {
                toast.classList.add('hidden');
            }, 250);
        }, 3200);
    }

    /* ========================================================================
     * 3. NAVIGASI, PORTFOLIO & FAQ
     * ======================================================================== */

    function initNavigationAndStaticSections() {
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = String(new Date().getFullYear());
        }

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function () {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mobileMenu.classList.add('hidden');
                });
            });
        }

        // Filter Portfolio
        const filterBtns = document.querySelectorAll('.portfolio-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) {
                    b.classList.remove('bg-brand-600', 'text-white');
                    b.classList.add('bg-[#0c121e]', 'text-slate-300');
                });
                btn.classList.remove('bg-[#0c121e]', 'text-slate-300');
                btn.classList.add('bg-brand-600', 'text-white');

                const filter = btn.getAttribute('data-filter');
                portfolioItems.forEach(function (item) {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });

        // FAQ Accordion
        const faqBtns = document.querySelectorAll('.faq-btn');
        faqBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i, svg');
                if (content) content.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            });
        });
    }

    /* ========================================================================
     * 4. MESIN KALKULATOR TEKNIS & BOQ (TANPA HARGA RUPIAH)
     * ======================================================================== */

    function computeEngineeringBoq(s) {
        const tier = VENDOR_CATALOG[s.vendorTier] || VENDOR_CATALOG.tier2;
        const users = Math.max(10, Number(s.users) || 10);
        const floors = Math.max(1, Number(s.floors) || 1);
        const areaPerFloor = Math.max(50, Number(s.areaPerFloor) || 100);
        const totalArea = floors * areaPerFloor;

        // 1. Perhitungan Wireless Wi-Fi 6 AP (Kapasitas User vs Redaman Luas & Sekat)
        const coverageMap = { open: 150, gypsum: 90, concrete: 55 };
        const apCoverageM2 = coverageMap[s.partition] || 90;
        const apByArea = floors * Math.max(1, Math.ceil(areaPerFloor / apCoverageM2));
        const apByDensity = Math.ceil(users / 25);
        const apCount = Math.max(apByArea, apByDensity);

        // 2. Perhitungan CCTV, Storage NVR (H.265+), dan Door Access
        const indoorCams = s.enableCctv ? Math.max(0, Number(s.cctvIndoor) || 0) : 0;
        const outdoorCams = s.enableCctv ? Math.max(0, Number(s.cctvOutdoor) || 0) : 0;
        const totalCams = indoorCams + outdoorCams;
        const bitrateMap = { '2mp': 2.0, '4mp': 4.0, '8mp': 8.0 };
        const camBitrateMbps = bitrateMap[s.cctvRes] || 4.0;
        const retentionDays = Number(s.cctvDays) || 30;
        const storageTB = totalCams > 0
            ? Math.max(2, Math.ceil(((totalCams * camBitrateMbps * 86400 * retentionDays) / 8 / 1024 / 1024) * 1.15))
            : 0;

        let nvrChannels = 0;
        if (totalCams > 0) {
            if (totalCams <= 8) nvrChannels = 8;
            else if (totalCams <= 16) nvrChannels = 16;
            else if (totalCams <= 32) nvrChannels = 32;
            else nvrChannels = 64;
        }
        const hddSizeTB = storageTB > 24 ? 10 : (storageTB > 8 ? 8 : 4);
        const hddCount = storageTB > 0 ? Math.ceil(storageTB / hddSizeTB) : 0;

        const accessDoors = s.enableAccess ? Math.max(0, Number(s.accessDoors) || 0) : 0;

        // 3. Perhitungan Port Aktif, Switch PoE+ & PoE Watt Budget
        const serverPorts = s.enableServer ? (s.serverMode === 'ha_cluster' ? 6 : 2) : 0;
        const activePorts = users + apCount + totalCams + accessDoors + serverPorts;
        const totalPortsWithSpare = Math.ceil(activePorts * 1.2); // 20% spare port

        const needDistributionCore = floors > 1 || totalPortsWithSpare > 48 || s.vendorTier === 'tier3';
        const accessSwitchSize = totalPortsWithSpare > 72 ? 48 : 24;
        const accessSwitchQty = Math.max(floors > 1 ? floors : 1, Math.ceil(totalPortsWithSpare / accessSwitchSize));

        const poeWatts = Math.round((apCount * 15.4) + (indoorCams * 8.5) + (outdoorCams * 14) + (accessDoors * 12));

        // 4. Perhitungan Kabel Horizontal UTP (Standar TIA-568 <= 90m) & Fiber Optic Backbone
        const avgHorizontalRun = Math.min(82, Math.max(18, Math.round(Math.sqrt(areaPerFloor) * 0.72 + 12)));
        const horizontalPoints = users + apCount + totalCams + accessDoors;
        const totalUtpMeters = Math.round(horizontalPoints * avgHorizontalRun * 1.15); // +15% service loop
        const utpBoxes = Math.max(1, Math.ceil(totalUtpMeters / 305));
        const patchPanelQty = Math.max(1, Math.ceil(horizontalPoints / 24));
        const patchCordQty = horizontalPoints * 2;

        const needFiberBackbone = floors > 1 || (s.preset === 'warehouse' && areaPerFloor >= 600);
        const foMeters = needFiberBackbone
            ? (floors > 1 ? ((floors - 1) * 32) + 45 : Math.round(Math.sqrt(areaPerFloor) * 2.5))
            : 0;
        const foCores = (floors >= 4 || s.vendorTier === 'tier3') ? 12 : 6;
        const otbQty = needFiberBackbone ? Math.max(2, floors) : 0;
        const sfpQty = needFiberBackbone ? Math.max(2, floors * 2) : (needDistributionCore ? 2 : 0);

        // 5. Material Jalur (Conduit / Cable Tray) & Rack Sizing (U)
        const conduitPipes = s.pathway === 'new_conduit'
            ? Math.ceil((totalUtpMeters * 0.65) / 2.9)
            : Math.ceil((totalUtpMeters * 0.25) / 2.9);
        const cableTrayMeters = s.pathway === 'new_conduit'
            ? Math.round((floors * Math.sqrt(areaPerFloor) * 0.85))
            : 0;

        // Hitung tinggi Rack MDF (U)
        const serverU = s.enableServer ? (s.serverMode === 'ha_cluster' ? 6 : 2) : 0;
        const nvrU = totalCams > 0 ? 2 : 0;
        const upsU = 3;
        const mdfSwitchU = (needDistributionCore ? 1 : 0) + (floors === 1 ? accessSwitchQty : 1);
        const mdfPatchU = floors === 1 ? (patchPanelQty * 2) : 2;
        const usedU = 1 /* router */ + mdfSwitchU + mdfPatchU + (needFiberBackbone ? 1 : 0) + serverU + nvrU + upsU + 3 /* PDU + cable mgr */;

        let mdfRackSize = '20U';
        if (usedU > 26) mdfRackSize = '42U';
        else if (usedU > 16) mdfRackSize = '32U';

        const idfRackQty = floors > 1 ? (floors - 1) : 0;

        // 6. Kalkulasi Beban Daya Listrik Rack & UPS Online Sinewave (VA)
        const activeGearWatts = 65 /* Router/NGFW */
            + (accessSwitchQty * 65)
            + (needDistributionCore ? 110 : 0)
            + poeWatts
            + (totalCams > 0 ? 90 : 0)
            + (s.enableServer ? (s.serverMode === 'ha_cluster' ? 750 : (s.serverMode === 'single_host' ? 380 : 140)) : 0);

        const rawVA = (activeGearWatts / 0.8) * 1.3; // 30% safety headroom
        const upsMultiplier = s.upsMinutes >= 60 ? 1.5 : (s.upsMinutes >= 30 ? 1.2 : 1.0);
        const targetVA = Math.round(rawVA * upsMultiplier);
        let upsSpecVA = '1000VA (1 kVA)';
        if (targetVA > 6000) upsSpecVA = '10000VA (10 kVA) + Ext. Battery';
        else if (targetVA > 3000) upsSpecVA = '6000VA (6 kVA) + Ext. Battery';
        else if (targetVA > 2000) upsSpecVA = '3000VA (3 kVA)';
        else if (targetVA > 1000) upsSpecVA = '2000VA (2 kVA)';

        // 7. Estimasi Durasi Eksekusi Lapangan (Hari Kerja)
        const fieldDaysMin = Math.max(2, Math.ceil((horizontalPoints / 35) + (floors * 0.8) + (s.pathway === 'new_conduit' ? 1.5 : 0.5) + (needFiberBackbone ? 1 : 0)));
        const fieldDaysMax = fieldDaysMin + Math.max(1, Math.ceil(fieldDaysMin * 0.35));

        // 8. Susun Tabel BOQ Terstruktur (Tanpa Nominal Harga)
        const items = [];

        // A. Perangkat Aktif Jaringan & Keamanan
        items.push({
            category: 'A. Jaringan & Keamanan',
            name: 'Gateway Router / NGFW Security',
            spec: tier.router + ' • ' + s.wanCount + 'x WAN Failover' + (s.vpnBranches > 0 ? ' • ' + s.vpnBranches + ' Cabang IPsec VPN' : ''),
            qty: (s.vendorTier === 'tier3' ? '2 Unit (HA Pair)' : '1 Unit')
        });

        if (needDistributionCore) {
            items.push({
                category: 'A. Jaringan & Keamanan',
                name: 'Core / Distribution Switch 10G',
                spec: tier.coreSwitch + ' (L3 Managed SFP+ Backbone)',
                qty: '1 Unit'
            });
        }

        items.push({
            category: 'A. Jaringan & Keamanan',
            name: 'Access Switch Gigabit PoE+',
            spec: (accessSwitchSize === 48 ? tier.accessSwitch48 : tier.accessSwitch24) + ' • Total Beban PoE ~' + poeWatts + 'W',
            qty: accessSwitchQty + ' Unit'
        });

        items.push({
            category: 'A. Jaringan & Keamanan',
            name: 'Access Point Wi-Fi 6 Enterprise',
            spec: tier.ap + ' • Dual-Band Seamless Roaming (' + totalArea.toLocaleString('id-ID') + ' m²)',
            qty: apCount + ' Unit'
        });

        if (sfpQty > 0) {
            items.push({
                category: 'A. Jaringan & Keamanan',
                name: 'SFP / SFP+ Optical Transceiver',
                spec: (s.foType === 'os2' ? 'Singlemode 1310nm LC Duplex' : 'Multimode 850nm 10G-SR'),
                qty: sfpQty + ' Pcs'
            });
        }

        // B. Infrastruktur Pasif, Kabel & Rack
        const cableLabel = s.cableType === 'cat6a' ? 'UTP Cat6A Shielded (10G Full)' : 'UTP Cat6 LSZH/PVC (TIA-568)';
        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Kabel Horizontal ' + (s.cableType === 'cat6a' ? 'Cat6A' : 'Cat6'),
            spec: cableLabel + ' • Rata-rata tarikan ' + avgHorizontalRun + 'm/titik (~' + totalUtpMeters + 'm total)',
            qty: utpBoxes + ' Box (@305m)'
        });

        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Patch Panel Modular 24-Port + RJ45',
            spec: '24-Port Modular Patch Panel + ' + patchCordQty + 'x Factory Patch Cord + Faceplate/Outbow',
            qty: patchPanelQty + ' Panel'
        });

        if (needFiberBackbone) {
            items.push({
                category: 'B. Kabel & Rack Pasif',
                name: 'Fiber Optic Backbone & OTB',
                spec: (s.foType === 'os2' ? 'FO Singlemode OS2 ' : 'FO Multimode OM3/OM4 ') + foCores + '-Core (~' + foMeters + 'm) + ' + otbQty + 'x OTB & Pigtail',
                qty: foMeters + ' Meter'
            });
        }

        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Proteksi Jalur & Rack Server MDF/IDF',
            spec: conduitPipes + ' Btg Conduit 20mm' + (cableTrayMeters > 0 ? ' + ' + cableTrayMeters + 'm Cable Tray' : '') + ' • Close Rack MDF ' + mdfRackSize + (idfRackQty > 0 ? ' + ' + idfRackQty + 'x Wallmount IDF 9U' : ''),
            qty: '1 Paket'
        });

        // C. Surveillance, Smart Access, Server & Daya
        if (totalCams > 0) {
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'IP Camera Surveillance (' + s.cctvRes.toUpperCase() + ')',
                spec: indoorCams + 'x Indoor Dome + ' + outdoorCams + 'x Outdoor Weatherproof PoE (Codec H.265+)',
                qty: totalCams + ' Unit'
            });
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'Central NVR & Surveillance HDD',
                spec: tier.nvr + ' (' + nvrChannels + '-Ch) + ' + hddCount + 'x ' + hddSizeTB + 'TB Surveillance HDD (Retensi ' + retentionDays + ' Hari / ' + storageTB + ' TB)',
                qty: '1 Sistem'
            });
        }

        if (accessDoors > 0) {
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'Biometric / RFID Door Access Control',
                spec: 'Reader RFID/Fingerprint + Magnetic Drop Lock + Push Exit Button + Controller',
                qty: accessDoors + ' Pintu'
            });
        }

        if (s.enableServer) {
            const serverModeLabel = s.serverMode === 'ha_cluster'
                ? 'High-Availability 2+ Node Virtualization Cluster'
                : (s.serverMode === 'single_host' ? 'Single Host Virtualization (VMware ESXi / Proxmox)' : 'Centralized Rackmount NAS File Server');
            items.push({
                category: 'C. Server & Backup Daya',
                name: 'Server / Storage Lokal',
                spec: tier.server + ' • ' + serverModeLabel + (s.cloudBackup ? ' + Cloud Offsite DR Replication' : ''),
                qty: (s.serverMode === 'ha_cluster' ? '2 Node' : '1 Unit')
            });
        } else if (s.cloudBackup) {
            items.push({
                category: 'C. Server & Backup Daya',
                name: 'Cloud Backup & Disaster Recovery',
                spec: 'Automated Encrypted Offsite Backup Policy',
                qty: '1 Sistem'
            });
        }

        items.push({
            category: 'C. Server & Backup Daya',
            name: 'UPS Online Double-Conversion Sinewave',
            spec: 'Kapasitas ' + upsSpecVA + ' • Estimasi beban rack ~' + activeGearWatts + 'W (Backup ~' + s.upsMinutes + ' mnt)',
            qty: '1 Unit'
        });

        // D. Jasa Eksekusi Lapangan & Sertifikasi
        items.push({
            category: 'D. Jasa Eksekusi Lapangan',
            name: 'Staging, Instalasi, Terminasi & Labeling',
            spec: 'Pre-config workshop, tarikan rapi TIA-606-B thermal label, cutover di luar jam kerja (Zero-Downtime)',
            qty: fieldDaysMin + '–' + fieldDaysMax + ' Hari'
        });

        if (s.flukeTest) {
            items.push({
                category: 'D. Jasa Eksekusi Lapangan',
                name: 'Uji Sertifikasi & As-Built Documentation',
                spec: 'Fluke Cable Certifier (' + horizontalPoints + ' titik)' + (needFiberBackbone ? ' + OTDR/OPM Fiber Test' : '') + ' + Topologi As-Built & UAT',
                qty: '1 Paket'
            });
        }

        const vlans = [
            'VLAN 10 — Management & Core Infrastructure (Router/Switch/AP)',
            'VLAN 20 — Corporate Staff LAN & Wi-Fi 6',
            'VLAN 30 — Guest Wi-Fi Isolated (Client Isolation + Bandwidth Limit)'
        ];
        if (totalCams > 0 || accessDoors > 0) {
            vlans.push('VLAN 40 — IP Surveillance CCTV & Access Control Terisolasi');
        }
        if (s.enableServer) {
            vlans.push('VLAN 50 — Local Server / NAS / DMZ Terproteksi Firewall');
        }

        const summaryText = (BUILDING_PRESETS[s.preset] ? BUILDING_PRESETS[s.preset].label : 'Custom Gedung')
            + ' | ' + users + ' User | ' + floors + ' Lantai (' + totalArea.toLocaleString('id-ID') + ' m²)'
            + ' | ' + tier.name
            + ' | ' + totalPortsWithSpare + ' Port (' + poeWatts + 'W PoE+)'
            + ' | ' + utpBoxes + ' Box ' + (s.cableType === 'cat6a' ? 'Cat6A' : 'Cat6')
            + (needFiberBackbone ? ' + ' + foMeters + 'm FO ' + foCores + '-Core' : '')
            + (totalCams > 0 ? ' + ' + totalCams + ' CCTV (' + storageTB + 'TB NVR)' : '')
            + ' + UPS ' + upsSpecVA;

        return {
            metrics: {
                users: users,
                floors: floors,
                totalArea: totalArea,
                totalPortsWithSpare: totalPortsWithSpare,
                activePorts: activePorts,
                poeWatts: poeWatts,
                apCount: apCount,
                utpBoxes: utpBoxes,
                totalUtpMeters: totalUtpMeters,
                avgHorizontalRun: avgHorizontalRun,
                foMeters: foMeters,
                foCores: foCores,
                needFiberBackbone: needFiberBackbone,
                storageTB: storageTB,
                totalCams: totalCams,
                activeGearWatts: activeGearWatts,
                upsSpecVA: upsSpecVA,
                mdfRackSize: mdfRackSize,
                idfRackQty: idfRackQty,
                fieldDaysMin: fieldDaysMin,
                fieldDaysMax: fieldDaysMax
            },
            vlans: vlans,
            items: items,
            summary: summaryText,
            stateSnapshot: Object.assign({}, s)
        };
    }

    function renderCalculatorUi() {
        const result = computeEngineeringBoq(calcState);
        lastComputedBoq = result;
        const m = result.metrics;

        // Sinkronkan label slider Mode Cepat & Teknis
        const syncMap = {
            'quick-user-val': m.users + ' User',
            'quick-floor-val': m.floors + ' Lantai',
            'quick-area-val': calcState.areaPerFloor + ' m² / Lantai',
            'tech-user-val': m.users + ' User',
            'tech-floor-val': m.floors + ' Lantai',
            'tech-area-val': calcState.areaPerFloor + ' m² / Lantai',
            'tech-vpn-val': calcState.vpnBranches + ' Cabang',
            'tech-cctv-in-val': calcState.cctvIndoor + ' Unit',
            'tech-cctv-out-val': calcState.cctvOutdoor + ' Unit',
            'tech-door-val': calcState.accessDoors + ' Pintu',
            'metric-ports': m.totalPortsWithSpare + ' Port',
            'metric-poe': 'Beban PoE+: ~' + m.poeWatts + ' Watt',
            'metric-cabling': m.utpBoxes + ' Box ' + (calcState.cableType === 'cat6a' ? 'Cat6A' : 'Cat6'),
            'metric-fo': m.needFiberBackbone ? ('+ ' + m.foMeters + 'm FO ' + m.foCores + '-Core') : 'Single-Floor UTP (≤ ' + m.avgHorizontalRun + 'm)',
            'metric-storage': m.totalCams > 0 ? (m.storageTB + ' TB NVR') : 'Non-CCTV',
            'metric-ups': 'UPS: ' + m.upsSpecVA,
            'metric-rack': 'MDF ' + m.mdfRackSize + (m.idfRackQty > 0 ? ' + ' + m.idfRackQty + ' IDF' : ''),
            'metric-days': 'Estimasi Kerja: ' + m.fieldDaysMin + '–' + m.fieldDaysMax + ' Hari',
            'boq-wifi-badge': m.apCount + ' AP Wi-Fi 6'
        };

        Object.keys(syncMap).forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = syncMap[id];
        });

        // Render Tabel BOQ
        const tbody = document.getElementById('boq-table-body');
        if (tbody) {
            let rowsHtml = '';
            result.items.forEach(function (item) {
                rowsHtml += '<tr class="border-b border-red-950/60 hover:bg-red-950/20 transition-colors">'
                    + '<td class="py-2.5 px-3 text-[11px] font-semibold text-brand-400 whitespace-nowrap align-top">' + escapeHtml(item.category) + '</td>'
                    + '<td class="py-2.5 px-3 align-top">'
                    + '<div class="font-semibold text-slate-100 text-xs">' + escapeHtml(item.name) + '</div>'
                    + '<div class="text-[11px] text-slate-400 mt-0.5 leading-snug">' + escapeHtml(item.spec) + '</div>'
                    + '</td>'
                    + '<td class="py-2.5 px-3 text-right font-mono font-bold text-xs text-white whitespace-nowrap align-top">' + escapeHtml(item.qty) + '</td>'
                    + '</tr>';
            });
            tbody.innerHTML = rowsHtml;
        }

        // Render VLAN Plan
        const vlanList = document.getElementById('boq-vlan-list');
        if (vlanList) {
            vlanList.innerHTML = result.vlans.map(function (v) {
                return '<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span><span>' + escapeHtml(v) + '</span></li>';
            }).join('');
        }

        // Update badge konteks di AI Chatbot
        const aiCtxBadge = document.getElementById('ai-calc-context-badge');
        if (aiCtxBadge) {
            aiCtxBadge.textContent = 'Konteks BOQ Aktif: ' + m.users + ' User • ' + m.floors + ' Lantai • ' + m.apCount + ' AP';
        }

        const printMeta = document.getElementById('print-meta-summary');
        if (printMeta) {
            printMeta.textContent = 'Profil: ' + result.summary + ' | Tanggal Simulasi: ' + new Date().toLocaleDateString('id-ID');
        }
    }

    function syncControlValuesToDom() {
        const setVal = function (id, val) {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.type === 'checkbox') el.checked = Boolean(val);
            else el.value = String(val);
        };

        setVal('quick-user-slider', calcState.users);
        setVal('quick-floor-slider', calcState.floors);
        setVal('quick-area-slider', calcState.areaPerFloor);
        setVal('quick-check-firewall', calcState.wanCount >= 2 || calcState.vpnBranches > 0);
        setVal('quick-check-cctv', calcState.enableCctv);
        setVal('quick-check-cloud', calcState.cloudBackup);

        setVal('tech-user-slider', calcState.users);
        setVal('tech-floor-slider', calcState.floors);
        setVal('tech-area-slider', calcState.areaPerFloor);
        setVal('tech-partition', calcState.partition);
        setVal('tech-cable-type', calcState.cableType);
        setVal('tech-fo-type', calcState.foType);
        setVal('tech-pathway', calcState.pathway);

        setVal('tech-vendor-tier', calcState.vendorTier);
        setVal('tech-wan-count', calcState.wanCount);
        setVal('tech-vpn-slider', calcState.vpnBranches);
        setVal('tech-fluke-check', calcState.flukeTest);

        setVal('tech-cctv-enable', calcState.enableCctv);
        setVal('tech-cctv-in-slider', calcState.cctvIndoor);
        setVal('tech-cctv-out-slider', calcState.cctvOutdoor);
        setVal('tech-cctv-res', calcState.cctvRes);
        setVal('tech-cctv-days', calcState.cctvDays);
        setVal('tech-access-enable', calcState.enableAccess);
        setVal('tech-door-slider', calcState.accessDoors);

        setVal('tech-server-enable', calcState.enableServer);
        setVal('tech-server-mode', calcState.serverMode);
        setVal('tech-cloud-enable', calcState.cloudBackup);
        setVal('tech-ups-minutes', calcState.upsMinutes);

        // Toggle state visual untuk field opsional CCTV/Server
        const cctvGroup = document.getElementById('tech-cctv-fields');
        if (cctvGroup) cctvGroup.classList.toggle('opacity-40', !calcState.enableCctv);
        const serverGroup = document.getElementById('tech-server-fields');
        if (serverGroup) serverGroup.classList.toggle('opacity-40', !calcState.enableServer);
    }

    function initCalculator() {
        const modeQuickBtn = document.getElementById('calc-mode-quick-btn');
        const modeTechBtn = document.getElementById('calc-mode-tech-btn');
        const panelQuick = document.getElementById('calc-panel-quick');
        const panelTech = document.getElementById('calc-panel-tech');

        function setMode(mode) {
            calcState.mode = mode;
            const isQuick = mode === 'quick';
            if (panelQuick) panelQuick.classList.toggle('hidden', !isQuick);
            if (panelTech) panelTech.classList.toggle('hidden', isQuick);
            if (modeQuickBtn && modeTechBtn) {
                modeQuickBtn.className = isQuick
                    ? 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 text-white shadow-md transition-all'
                    : 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-all';
                modeTechBtn.className = !isQuick
                    ? 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 text-white shadow-md transition-all'
                    : 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-all';
            }
        }

        if (modeQuickBtn) modeQuickBtn.addEventListener('click', function () { setMode('quick'); });
        if (modeTechBtn) modeTechBtn.addEventListener('click', function () { setMode('tech'); });

        // Preset buttons
        const presetBtns = document.querySelectorAll('.calc-preset-btn');
        presetBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const presetKey = btn.getAttribute('data-preset');
                const preset = BUILDING_PRESETS[presetKey];
                if (!preset) return;
                Object.assign(calcState, preset, { preset: presetKey });
                presetBtns.forEach(function (b) {
                    b.classList.remove('border-brand-500', 'bg-brand-950/60', 'text-white');
                    b.classList.add('border-red-950', 'bg-[#080d1a]', 'text-slate-300');
                });
                btn.classList.remove('border-red-950', 'bg-[#080d1a]', 'text-slate-300');
                btn.classList.add('border-brand-500', 'bg-brand-950/60', 'text-white');
                syncControlValuesToDom();
                renderCalculatorUi();
            });
        });

        // Sub-tabs di Mode Teknis
        const techTabBtns = document.querySelectorAll('.tech-subtab-btn');
        const techPanels = document.querySelectorAll('.tech-subtab-panel');
        techTabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = btn.getAttribute('data-tech-tab');
                calcState.activeTechTab = target;
                techTabBtns.forEach(function (b) {
                    b.classList.remove('bg-brand-600/20', 'text-brand-400', 'border-brand-500/60');
                    b.classList.add('bg-[#080d1a]', 'text-slate-400', 'border-red-950');
                });
                btn.classList.remove('bg-[#080d1a]', 'text-slate-400', 'border-red-950');
                btn.classList.add('bg-brand-600/20', 'text-brand-400', 'border-brand-500/60');

                techPanels.forEach(function (p) {
                    p.classList.toggle('hidden', p.getAttribute('data-tech-panel') !== target);
                });
            });
        });

        // Bindings untuk semua kontrol input
        const bind = function (id, eventName, handler) {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener(eventName, function () {
                handler(el);
                syncControlValuesToDom();
                renderCalculatorUi();
            });
        };

        // Mode Cepat controls
        bind('quick-user-slider', 'input', function (el) { calcState.users = Number(el.value); });
        bind('quick-floor-slider', 'input', function (el) { calcState.floors = Number(el.value); });
        bind('quick-area-slider', 'input', function (el) { calcState.areaPerFloor = Number(el.value); });
        bind('quick-check-firewall', 'change', function (el) {
            calcState.wanCount = el.checked ? 2 : 1;
            calcState.vpnBranches = el.checked ? Math.max(1, calcState.vpnBranches) : 0;
        });
        bind('quick-check-cctv', 'change', function (el) {
            calcState.enableCctv = el.checked;
            if (el.checked && calcState.cctvIndoor + calcState.cctvOutdoor === 0) {
                calcState.cctvIndoor = 6;
                calcState.cctvOutdoor = 2;
            }
        });
        bind('quick-check-cloud', 'change', function (el) { calcState.cloudBackup = el.checked; });

        // Mode Teknis controls
        bind('tech-user-slider', 'input', function (el) { calcState.users = Number(el.value); });
        bind('tech-floor-slider', 'input', function (el) { calcState.floors = Number(el.value); });
        bind('tech-area-slider', 'input', function (el) { calcState.areaPerFloor = Number(el.value); });
        bind('tech-partition', 'change', function (el) { calcState.partition = el.value; });
        bind('tech-cable-type', 'change', function (el) { calcState.cableType = el.value; });
        bind('tech-fo-type', 'change', function (el) { calcState.foType = el.value; });
        bind('tech-pathway', 'change', function (el) { calcState.pathway = el.value; });

        bind('tech-vendor-tier', 'change', function (el) { calcState.vendorTier = el.value; });
        bind('tech-wan-count', 'change', function (el) { calcState.wanCount = Number(el.value); });
        bind('tech-vpn-slider', 'input', function (el) { calcState.vpnBranches = Number(el.value); });
        bind('tech-fluke-check', 'change', function (el) { calcState.flukeTest = el.checked; });

        bind('tech-cctv-enable', 'change', function (el) { calcState.enableCctv = el.checked; });
        bind('tech-cctv-in-slider', 'input', function (el) { calcState.cctvIndoor = Number(el.value); });
        bind('tech-cctv-out-slider', 'input', function (el) { calcState.cctvOutdoor = Number(el.value); });
        bind('tech-cctv-res', 'change', function (el) { calcState.cctvRes = el.value; });
        bind('tech-cctv-days', 'change', function (el) { calcState.cctvDays = Number(el.value); });
        bind('tech-access-enable', 'change', function (el) {
            calcState.enableAccess = el.checked;
            if (el.checked && calcState.accessDoors === 0) calcState.accessDoors = 2;
        });
        bind('tech-door-slider', 'input', function (el) { calcState.accessDoors = Number(el.value); });

        bind('tech-server-enable', 'change', function (el) { calcState.enableServer = el.checked; });
        bind('tech-server-mode', 'change', function (el) { calcState.serverMode = el.value; });
        bind('tech-cloud-enable', 'change', function (el) { calcState.cloudBackup = el.checked; });
        bind('tech-ups-minutes', 'change', function (el) { calcState.upsMinutes = Number(el.value); });

        // Tombol Aksi Output BOQ
        const printBtn = document.getElementById('boq-print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function () {
                window.print();
            });
        }

        const copyBtn = document.getElementById('boq-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                if (!lastComputedBoq) return;
                const lines = [
                    'SIMULASI SPESIFIKASI TEKNIS & BOQ (TANPA HARGA) - PT TEKNOTAMA',
                    lastComputedBoq.summary,
                    '------------------------------------------------------------'
                ];
                lastComputedBoq.items.forEach(function (it) {
                    lines.push('[' + it.category + '] ' + it.name + ' (' + it.qty + ') — ' + it.spec);
                });
                const text = lines.join('\n');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(function () {
                        showToast('Ringkasan BOQ berhasil disalin ke clipboard.');
                    });
                } else {
                    showToast('Ringkasan BOQ siap.');
                }
            });
        }

        const askAiBtn = document.getElementById('boq-ask-ai-btn');
        if (askAiBtn) {
            askAiBtn.addEventListener('click', function () {
                openWidgetToChat();
                sendChatMessage('Tolong review hasil simulasi BOQ kalkulator saya saat ini dan berikan saran eksekusi lapangan (jalur kabel, FO, PoE, serta cutover) agar optimal.');
            });
        }

        const bookBtn = document.getElementById('boq-book-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', function () {
                syncContextToBookingForm(true);
                const target = document.getElementById('kontak');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        }

        syncControlValuesToDom();
        renderCalculatorUi();
    }

    /* ========================================================================
     * 5. AI CHATBOT FIELD ENGINEER (FLOATING WIDGET + INLINE PRE-BOOKING)
     * ======================================================================== */

    function buildCalculatorContextPayload() {
        if (!lastComputedBoq) return {};
        return {
            preset_label: BUILDING_PRESETS[calcState.preset] ? BUILDING_PRESETS[calcState.preset].label : 'Custom',
            users: lastComputedBoq.metrics.users,
            floors: lastComputedBoq.metrics.floors,
            area_per_floor_m2: calcState.areaPerFloor,
            partition: calcState.partition,
            cable_type: calcState.cableType,
            fo_type: calcState.foType,
            pathway: calcState.pathway,
            vendor_tier: VENDOR_CATALOG[calcState.vendorTier].name,
            total_ports_with_spare: lastComputedBoq.metrics.totalPortsWithSpare,
            poe_watts: lastComputedBoq.metrics.poeWatts,
            wifi_ap_count: lastComputedBoq.metrics.apCount,
            utp_boxes_305m: lastComputedBoq.metrics.utpBoxes,
            fo_meters: lastComputedBoq.metrics.foMeters,
            cctv_count: lastComputedBoq.metrics.totalCams,
            nvr_storage_tb: lastComputedBoq.metrics.storageTB,
            ups_spec: lastComputedBoq.metrics.upsSpecVA,
            mdf_rack: lastComputedBoq.metrics.mdfRackSize,
            est_field_days: lastComputedBoq.metrics.fieldDaysMin + '-' + lastComputedBoq.metrics.fieldDaysMax + ' hari'
        };
    }

    function renderHelpCenterArticles(query) {
        const listEl = document.getElementById('widget-help-results');
        if (!listEl) return;
        const q = (query || '').trim().toLowerCase();
        const filtered = SOP_KNOWLEDGE_BASE.filter(function (art) {
            if (!q) return true;
            return art.title.toLowerCase().indexOf(q) !== -1
                || art.tags.toLowerCase().indexOf(q) !== -1
                || art.summary.toLowerCase().indexOf(q) !== -1;
        });

        if (filtered.length === 0) {
            listEl.innerHTML = '<div class="text-xs text-slate-400 p-3 text-center">Topik tidak ditemukan di SOP cepat. Klik <strong>Mulai Konsultasi AI</strong> untuk bertanya langsung!</div>';
            return;
        }

        listEl.innerHTML = filtered.slice(0, 5).map(function (art) {
            return '<div class="sop-article-card bg-[#0d1424] border border-red-950/70 rounded-xl p-3 hover:border-brand-500/60 transition-all cursor-pointer" data-sop-id="' + art.id + '">'
                + '<div class="flex items-center justify-between gap-2">'
                + '<span class="text-xs font-semibold text-slate-100 leading-snug">' + escapeHtml(art.title) + '</span>'
                + '<i data-lucide="chevron-right" class="w-4 h-4 text-brand-400 flex-shrink-0"></i>'
                + '</div>'
                + '<div class="sop-article-body hidden mt-2 pt-2 border-t border-red-950/60 text-[11px] text-slate-300 leading-relaxed">'
                + '<p>' + escapeHtml(art.summary) + '</p>'
                + '<button type="button" class="sop-ask-ai mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300" data-sop-title="' + escapeHtml(art.title) + '">Diskusikan detail dengan AI Engineer &rarr;</button>'
                + '</div>'
                + '</div>';
        }).join('');

        listEl.querySelectorAll('.sop-article-card').forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (e.target && e.target.classList.contains('sop-ask-ai')) return;
                const body = card.querySelector('.sop-article-body');
                if (body) body.classList.toggle('hidden');
            });
        });

        listEl.querySelectorAll('.sop-ask-ai').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const title = btn.getAttribute('data-sop-title') || '';
                openWidgetToChat();
                sendChatMessage('Jelaskan lebih detail SOP lapangan Teknotama mengenai: ' + title);
            });
        });

        refreshIcons();
    }

    function renderChatFeeds() {
        const containers = [
            document.getElementById('widget-chat-messages'),
            document.getElementById('inline-chat-messages')
        ];

        containers.forEach(function (container) {
            if (!container) return;

            if (chatHistory.length === 0) {
                container.innerHTML = '<div class="bg-[#0d1424] border border-red-950/80 rounded-2xl p-3.5 text-xs text-slate-300 leading-relaxed">'
                    + '<div class="flex items-center gap-2 font-bold text-brand-400 mb-1.5">'
                    + '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>'
                    + 'TeknoAssist — AI Field Engineer Ready'
                    + '</div>'
                    + '<p>Halo! Sebelum Anda mengirim booking survei ke <strong>admin@teknotama.com</strong>, silakan konsultasikan kendala atau kondisi lapangan Anda (jumlah lantai, jalur kabel plafon/FO, kebutuhan CCTV, atau jadwal kerja di luar jam operasional).</p>'
                    + '</div>';
                return;
            }

            let html = '';
            chatHistory.forEach(function (msg) {
                if (msg.role === 'user') {
                    html += '<div class="flex justify-end">'
                        + '<div class="max-w-[85%] bg-gradient-to-r from-brand-700 to-brand-600 text-white text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-br-sm shadow-md">'
                        + escapeHtml(msg.content)
                        + '</div></div>';
                } else {
                    const engineTag = msg.engineLabel
                        ? '<div class="mt-2 pt-1.5 border-t border-red-950/60 flex items-center justify-between text-[10px] text-slate-500 font-mono"><span>' + escapeHtml(msg.engineLabel) + '</span><button type="button" class="chat-sync-btn text-brand-400 hover:text-brand-300 font-sans font-semibold">Salin ke Form &rarr;</button></div>'
                        : '';
                    html += '<div class="flex justify-start">'
                        + '<div class="max-w-[92%] bg-[#0d1424] border border-red-950/80 text-slate-200 text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-bl-sm chat-markdown">'
                        + renderSafeMarkdown(msg.content)
                        + engineTag
                        + '</div></div>';
                }
            });

            if (isChatBusy) {
                html += '<div class="flex justify-start">'
                    + '<div class="bg-[#0d1424] border border-red-950/80 px-4 py-3 rounded-2xl rounded-bl-sm">'
                    + '<div class="typing-dots flex gap-1.5"><span></span><span></span><span></span></div>'
                    + '</div></div>';
            }

            container.innerHTML = html;
            container.scrollTop = container.scrollHeight;

            container.querySelectorAll('.chat-sync-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    syncContextToBookingForm(true);
                    const kontak = document.getElementById('kontak');
                    if (kontak) kontak.scrollIntoView({ behavior: 'smooth' });
                });
            });
        });
    }

    async function sendChatMessage(rawText) {
        const message = (rawText || '').trim();
        if (!message || isChatBusy) return;

        chatHistory.push({ role: 'user', content: message });
        isChatBusy = true;
        renderChatFeeds();

        const payload = {
            message: message,
            history: chatHistory.slice(0, -1).slice(-10).map(function (m) {
                return { role: m.role, content: m.content };
            }),
            calculator_context: buildCalculatorContextPayload()
        };

        try {
            const resp = await fetch('teknotama_api.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await resp.json();
            if (resp.ok && data && data.ok && data.reply) {
                const labelMap = {
                    groq: 'TeknoAssist AI • Groq Engine',
                    gemini: 'TeknoAssist AI • Gemini Engine',
                    openrouter: 'TeknoAssist AI • OpenRouter',
                    cohere: 'TeknoAssist AI • Cohere',
                    local_expert: 'TeknoAssist SOP Engine'
                };
                chatHistory.push({
                    role: 'assistant',
                    content: data.reply,
                    engineLabel: labelMap[data.engine] || 'TeknoAssist AI'
                });
            } else {
                const errMsg = (data && data.error) ? data.error : 'Koneksi AI sedang sibuk. Anda dapat melanjutkan pengisian Formulir Survei di bawah.';
                chatHistory.push({
                    role: 'assistant',
                    content: errMsg,
                    engineLabel: 'System Notice'
                });
            }
        } catch (err) {
            chatHistory.push({
                role: 'assistant',
                content: 'Endpoint backend PHP (`teknotama_api.php`) belum aktif di server saat ini. Pastikan website dijalankan melalui server PHP/cPanel agar AI Engineer & pengiriman email ke `admin@teknotama.com` berjalan penuh.',
                engineLabel: 'Offline Preview Notice'
            });
        } finally {
            isChatBusy = false;
            renderChatFeeds();
        }
    }

    function openWidgetToChat() {
        widgetOpen = true;
        widgetActiveTab = 'chat';
        updateWidgetVisibility();
    }

    function updateWidgetVisibility() {
        const panel = document.getElementById('ai-widget-panel');
        const toggleIconOpen = document.getElementById('widget-icon-open');
        const toggleIconClose = document.getElementById('widget-icon-close');
        const homeView = document.getElementById('widget-view-home');
        const chatView = document.getElementById('widget-view-chat');
        const tabHomeBtn = document.getElementById('widget-tab-home');
        const tabChatBtn = document.getElementById('widget-tab-chat');

        if (panel) panel.classList.toggle('hidden', !widgetOpen);
        if (toggleIconOpen) toggleIconOpen.classList.toggle('hidden', widgetOpen);
        if (toggleIconClose) toggleIconClose.classList.toggle('hidden', !widgetOpen);

        if (homeView) homeView.classList.toggle('hidden', widgetActiveTab !== 'home');
        if (chatView) chatView.classList.toggle('hidden', widgetActiveTab !== 'chat');

        if (tabHomeBtn && tabChatBtn) {
            tabHomeBtn.classList.toggle('text-brand-400', widgetActiveTab === 'home');
            tabHomeBtn.classList.toggle('text-slate-400', widgetActiveTab !== 'home');
            tabChatBtn.classList.toggle('text-brand-400', widgetActiveTab === 'chat');
            tabChatBtn.classList.toggle('text-slate-400', widgetActiveTab !== 'chat');
        }

        if (widgetOpen && widgetActiveTab === 'chat') {
            const input = document.getElementById('widget-chat-input');
            if (input) setTimeout(function () { input.focus(); }, 60);
        }
    }

    function initChatbotInterfaces() {
        const toggleBtn = document.getElementById('ai-widget-toggle');
        const closeBtn = document.getElementById('widget-close-btn');
        const tabHomeBtn = document.getElementById('widget-tab-home');
        const tabChatBtn = document.getElementById('widget-tab-chat');
        const startConvCard = document.getElementById('widget-start-conversation');
        const reviewBoqCard = document.getElementById('widget-review-boq-card');
        const helpSearch = document.getElementById('widget-help-search');
        const resetChatBtn = document.getElementById('widget-reset-chat');
        const syncFormBtn = document.getElementById('widget-sync-booking');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                widgetOpen = !widgetOpen;
                updateWidgetVisibility();
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                widgetOpen = false;
                updateWidgetVisibility();
            });
        }
        if (tabHomeBtn) {
            tabHomeBtn.addEventListener('click', function () {
                widgetActiveTab = 'home';
                updateWidgetVisibility();
            });
        }
        if (tabChatBtn) {
            tabChatBtn.addEventListener('click', function () {
                widgetActiveTab = 'chat';
                updateWidgetVisibility();
            });
        }
        if (startConvCard) {
            startConvCard.addEventListener('click', function () {
                openWidgetToChat();
            });
        }
        if (reviewBoqCard) {
            reviewBoqCard.addEventListener('click', function () {
                openWidgetToChat();
                sendChatMessage('Tolong review hasil simulasi kalkulator BOQ saya dan cek apakah kebutuhan Switch PoE, Kabel/FO, dan UPS-nya sudah sesuai SOP lapangan.');
            });
        }
        if (helpSearch) {
            helpSearch.addEventListener('input', function () {
                renderHelpCenterArticles(helpSearch.value);
            });
        }
        if (resetChatBtn) {
            resetChatBtn.addEventListener('click', function () {
                chatHistory = [];
                renderChatFeeds();
                showToast('Percakapan AI direset.');
            });
        }
        if (syncFormBtn) {
            syncFormBtn.addEventListener('click', function () {
                syncContextToBookingForm(true);
                widgetOpen = false;
                updateWidgetVisibility();
                const kontak = document.getElementById('kontak');
                if (kontak) kontak.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Form kirim pesan pada Widget & Inline Pre-Booking
        const bindChatForm = function (formId, inputId) {
            const form = document.getElementById(formId);
            const input = document.getElementById(inputId);
            if (!form || !input) return;
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const val = input.value.trim();
                if (!val) return;
                input.value = '';
                sendChatMessage(val);
            });
        };
        bindChatForm('widget-chat-form', 'widget-chat-input');
        bindChatForm('inline-chat-form', 'inline-chat-input');

        // Quick prompt chips (untuk widget & inline pre-booking)
        document.querySelectorAll('.ai-quick-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                const prompt = chip.getAttribute('data-prompt') || chip.textContent;
                const isWidget = chip.closest('#ai-widget-panel') !== null;
                if (isWidget) widgetActiveTab = 'chat';
                updateWidgetVisibility();
                sendChatMessage(prompt);
            });
        });

        // Tombol Sync di panel inline Pre-Booking (#kontak)
        const inlineSyncBtn = document.getElementById('inline-sync-booking-btn');
        if (inlineSyncBtn) {
            inlineSyncBtn.addEventListener('click', function () {
                syncContextToBookingForm(true);
            });
        }

        const inlineOpenWidgetBtn = document.getElementById('inline-open-widget-btn');
        if (inlineOpenWidgetBtn) {
            inlineOpenWidgetBtn.addEventListener('click', function () {
                openWidgetToChat();
            });
        }

        renderHelpCenterArticles('');
        renderChatFeeds();
        updateWidgetVisibility();
    }

    /* ========================================================================
     * 6. SINKRONISASI BOQ & AI KE FORMULIR BOOKING (#kontak)
     * ======================================================================== */

    function buildAiConsultationSummary() {
        if (chatHistory.length === 0) return '';
        return chatHistory.slice(-6).map(function (m) {
            const prefix = m.role === 'user' ? 'Klien' : 'TeknoAssist AI';
            const cleanText = m.content.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
            return prefix + ': ' + (cleanText.length > 320 ? cleanText.slice(0, 320) + '...' : cleanText);
        }).join('\n');
    }

    function syncContextToBookingForm(forceAttachBoq) {
        if (forceAttachBoq) {
            attachBoqToBooking = true;
        }

        const badge = document.getElementById('booking-attachment-badge');
        const badgeText = document.getElementById('booking-attachment-text');
        const msgBox = document.getElementById('form-message');

        if (attachBoqToBooking && lastComputedBoq) {
            if (badge) badge.classList.remove('hidden');
            if (badgeText) badgeText.textContent = 'Lampiran BOQ: ' + lastComputedBoq.summary;
        }

        if (msgBox) {
            const existing = msgBox.value.trim();
            const boqLine = lastComputedBoq
                ? 'Kebutuhan simulasi awal: ' + lastComputedBoq.summary + '.'
                : '';
            const lastUserNotes = chatHistory
                .filter(function (m) { return m.role === 'user'; })
                .slice(-2)
                .map(function (m) { return '- ' + m.content; })
                .join('\n');

            const parts = [];
            if (boqLine) parts.push(boqLine);
            if (lastUserNotes) parts.push('Topik diskusi teknis pra-survei:\n' + lastUserNotes);
            parts.push('Mohon jadwal Audit & Site Survey dari tim Teknotama.');

            if (!existing || existing.indexOf('Kebutuhan simulasi awal:') === 0) {
                msgBox.value = parts.join('\n\n');
            } else {
                msgBox.value = existing + '\n\n' + parts.join('\n\n');
            }
            msgBox.focus();
        }

        showToast('Ringkasan teknis & BOQ berhasil diterapkan ke Formulir Survei.');
    }

    function initBookingForm() {
        const form = document.getElementById('contact-form');
        const clearAttachmentBtn = document.getElementById('clear-booking-attachment');

        if (clearAttachmentBtn) {
            clearAttachmentBtn.addEventListener('click', function () {
                attachBoqToBooking = false;
                const badge = document.getElementById('booking-attachment-badge');
                if (badge) badge.classList.add('hidden');
            });
        }

        if (!form) return;

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const submitBtn = document.getElementById('booking-submit-btn');
            const alertBox = document.getElementById('form-alert');
            const company = (document.getElementById('form-company') || {}).value || '';
            const email = (document.getElementById('form-email') || {}).value || '';
            const phone = (document.getElementById('form-phone') || {}).value || '';
            const service = (document.getElementById('form-category') || {}).value || '';
            const surveyDate = (document.getElementById('form-survey-date') || {}).value || '';
            const message = (document.getElementById('form-message') || {}).value || '';
            const honeypot = (document.getElementById('form-website-hp') || {}).value || '';

            const payload = {
                company: company.trim(),
                email: email.trim(),
                phone: phone.trim(),
                service: service,
                survey_date: surveyDate,
                message: message.trim(),
                ai_summary: buildAiConsultationSummary(),
                boq: (attachBoqToBooking && lastComputedBoq) ? {
                    summary: lastComputedBoq.summary,
                    items: lastComputedBoq.items
                } : {},
                website_hp: honeypot
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Mengirim ke admin@teknotama.com...';
                refreshIcons();
            }

            try {
                const resp = await fetch('teknotama_api.php?action=booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();
                if (resp.ok && data && data.ok) {
                    if (alertBox) {
                        alertBox.className = 'mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 space-y-3';
                        alertBox.innerHTML = '<div><strong>Permintaan Terkirim!</strong> ' + escapeHtml(data.message) + '</div>'
                            + (data.whatsapp_url
                                ? '<div><a href="' + escapeHtml(data.whatsapp_url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all">Kirim Salinan Cepat via WhatsApp NOC &rarr;</a></div>'
                                : '');
                        alertBox.classList.remove('hidden');
                    }
                    form.reset();
                    attachBoqToBooking = false;
                    const badge = document.getElementById('booking-attachment-badge');
                    if (badge) badge.classList.add('hidden');
                } else {
                    throw new Error((data && data.error) ? data.error : 'Gagal mengirim permintaan.');
                }
            } catch (err) {
                if (alertBox) {
                    alertBox.className = 'mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium bg-red-950/80 text-brand-300 border border-brand-500/50';
                    alertBox.innerHTML = '<strong>Perhatian:</strong> ' + escapeHtml(err.message || 'Gagal terhubung ke server.')
                        + ' Anda tetap dapat menghubungi langsung <strong>admin@teknotama.com</strong> atau WhatsApp <strong>+62 851-6769-4457</strong>.';
                    alertBox.classList.remove('hidden');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> Kirim Permintaan Survei ke admin@teknotama.com';
                    refreshIcons();
                }
            }
        });
    }

    /* ========================================================================
     * 7. INISIALISASI SAAT DOM SIAP
     * ======================================================================== */

    document.addEventListener('DOMContentLoaded', function () {
        initNavigationAndStaticSections();
        initCalculator();
        initChatbotInterfaces();
        initBookingForm();
        refreshIcons();
    });
})();
