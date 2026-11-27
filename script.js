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
    let chatHistory = loadPersistedChatHistory();
    let isChatBusy = false;
    let widgetOpen = false;
    let widgetActiveTab = 'home'; // 'home' | 'chat'

    function loadPersistedChatHistory() {
        try {
            const raw = sessionStorage.getItem('tkt_chat_history_v1');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.slice(-16) : [];
        } catch (e) {
            return [];
        }
    }

    function savePersistedChatHistory() {
        try {
            sessionStorage.setItem('tkt_chat_history_v1', JSON.stringify(chatHistory.slice(-16)));
        } catch (e) {
            // Abaikan jika browser memblokir sessionStorage
        }
    }

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

        // ── Scroll-hide / scroll-show navbar ─────────────────────────────────
        (function () {
            const header = document.querySelector('header.glass-nav');
            if (!header) return;
            let lastScrollY = window.scrollY;
            let ticking = false;
            window.addEventListener('scroll', function () {
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        const currentY = window.scrollY;
                        const mob = document.getElementById('mobile-menu');
                        // Keep header pinned if user is browsing the open mobile drawer
                        if (mob && !mob.classList.contains('hidden')) {
                            header.classList.remove('glass-nav--hidden');
                            lastScrollY = currentY;
                            ticking = false;
                            return;
                        }
                        if (currentY > lastScrollY && currentY > 80) {
                            // Scrolling down — hide nav
                            header.classList.add('glass-nav--hidden');
                            closeDesktopDropdowns();
                        } else {
                            // Scrolling up — show nav
                            header.classList.remove('glass-nav--hidden');
                        }
                        lastScrollY = currentY;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }());
        // ─────────────────────────────────────────────────────────────────────

        function closeDesktopDropdowns(exceptDropdown) {
            document.querySelectorAll('.tkt-nav-dropdown').forEach(function (dd) {
                if (exceptDropdown && dd === exceptDropdown) return;
                dd.classList.remove('is-open');
                const trig = dd.querySelector('.tkt-nav-trigger');
                if (trig) trig.setAttribute('aria-expanded', 'false');
            });
        }

        // Desktop dropdown support for touch devices (>=1024px without hover) & keyboard
        const hasNoHover = function () {
            return window.matchMedia && window.matchMedia('(hover: none)').matches;
        };
        document.querySelectorAll('.tkt-nav-dropdown').forEach(function (dd) {
            const trig = dd.querySelector('.tkt-nav-trigger');
            if (!trig) return;
            let lastPointerType = 'mouse';
            trig.addEventListener('pointerdown', function (e) {
                lastPointerType = e.pointerType || 'mouse';
            });
            trig.addEventListener('click', function (e) {
                const isButton = trig.tagName === 'BUTTON';
                const isTouchTap = lastPointerType === 'touch' || hasNoHover();
                if (isButton || (isTouchTap && !dd.classList.contains('is-open'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    const willOpen = !dd.classList.contains('is-open');
                    closeDesktopDropdowns(willOpen ? dd : null);
                    dd.classList.toggle('is-open', willOpen);
                    trig.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                }
            });
        });

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        function setMobileMenuOpen(open) {
            if (!mobileMenu) return;
            mobileMenu.classList.toggle('hidden', !open);
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
        }
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isOpening = mobileMenu.classList.contains('hidden');
                setMobileMenuOpen(isOpening);
            });
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    setMobileMenuOpen(false);
                });
            });
        }

        // Expandable accordions inside Mobile Drawer (Layanan IT & Lainnya)
        document.querySelectorAll('[data-mobile-acc-btn]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetId = btn.getAttribute('data-mobile-acc-btn');
                const panel = targetId ? document.getElementById(targetId) : null;
                if (!panel) return;
                const willOpen = panel.classList.contains('hidden');
                panel.classList.toggle('hidden', !willOpen);
                btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                const chev = btn.querySelector('[data-mobile-acc-chevron]');
                if (chev) {
                    chev.classList.toggle('rotate-180', willOpen);
                }
            });
        });

        // Close menus on outside click or Escape key
        document.addEventListener('click', function (e) {
            const headerEl = document.querySelector('header.glass-nav');
            if (headerEl && !headerEl.contains(e.target)) {
                closeDesktopDropdowns();
                setMobileMenuOpen(false);
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeDesktopDropdowns();
                setMobileMenuOpen(false);
            }
        });

        // Filter Portfolio (Light Corporate Pill Styling)
        const filterBtns = document.querySelectorAll('.portfolio-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) {
                    b.classList.remove('bg-[#d9141d]', 'bg-brand-600', 'text-white');
                    b.classList.add('bg-slate-100', 'text-slate-700');
                });
                btn.classList.remove('bg-slate-100', 'text-slate-700');
                btn.classList.add('bg-[#d9141d]', 'text-white');

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

        const viewAllPortfolioBtn = document.getElementById('toggle-portfolio-filters');
        if (viewAllPortfolioBtn) {
            viewAllPortfolioBtn.addEventListener('click', function () {
                const allBtn = document.querySelector('.portfolio-btn[data-filter="all"]');
                if (allBtn) allBtn.click();
                const grid = document.getElementById('portfolio-grid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        // Baca Selengkapnya di Section Tentang Teknotama
        const aboutReadMoreBtn = document.getElementById('about-readmore-btn');
        const aboutMorePanel = document.getElementById('about-more-panel');
        const aboutReadMoreLabel = document.getElementById('about-readmore-label');
        if (aboutReadMoreBtn && aboutMorePanel) {
            aboutReadMoreBtn.addEventListener('click', function () {
                const isHidden = aboutMorePanel.classList.toggle('hidden');
                if (aboutReadMoreLabel) {
                    aboutReadMoreLabel.textContent = isHidden ? 'Baca Selengkapnya' : 'Ringkas Tampilan';
                }
            });
        }

        // Toggle / Focus Kalkulator IT di Banner Hitam
        const toggleCalcBtn = document.getElementById('toggle-calculator-btn');
        const calcWorkbench = document.getElementById('kalkulator-workbench');
        if (toggleCalcBtn && calcWorkbench) {
            toggleCalcBtn.addEventListener('click', function () {
                calcWorkbench.classList.remove('hidden');
                calcWorkbench.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Trigger Tekno AI dari Navbar Desktop, Mobile Drawer & Footer
        ['nav-open-ai-btn', 'mobile-open-ai-btn', 'footer-open-ai-btn'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', function () {
                    closeDesktopDropdowns();
                    setMobileMenuOpen(false);
                    openWidgetToChat();
                });
            }
        });

        // FAQ Accordion
        const faqBtns = document.querySelectorAll('.faq-btn');
        faqBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('i, svg');
                if (content) {
                    const isHidden = content.classList.toggle('hidden');
                    btn.setAttribute('aria-expanded', String(!isHidden));
                }
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
            name: 'Gateway Router / NGFW Security (Pengatur Internet & Tameng Keamanan)',
            spec: tier.router + ' • ' + s.wanCount + 'x WAN ISP Failover' + (s.vpnBranches > 0 ? ' • ' + s.vpnBranches + ' Cabang IPsec VPN' : ''),
            qty: (s.vendorTier === 'tier3' ? '2 Unit (HA Pair)' : '1 Unit')
        });

        if (needDistributionCore) {
            items.push({
                category: 'A. Jaringan & Keamanan',
                name: 'Core / Distribution Switch 10G (Sakelar Pusat Penghubung Lantai)',
                spec: tier.coreSwitch + ' (L3 Managed SFP+ Backbone)',
                qty: '1 Unit'
            });
        }

        items.push({
            category: 'A. Jaringan & Keamanan',
            name: 'Access Switch Gigabit PoE+ (Pembagi Port LAN & Daya Wi-Fi/CCTV)',
            spec: (accessSwitchSize === 48 ? tier.accessSwitch48 : tier.accessSwitch24) + ' • Total Beban PoE ~' + poeWatts + 'W (+20% Spare Port)',
            qty: accessSwitchQty + ' Unit'
        });

        items.push({
            category: 'A. Jaringan & Keamanan',
            name: 'Access Point Wi-Fi 6 Enterprise (Pemancar Wi-Fi Bebas Blank-Spot)',
            spec: tier.ap + ' • Dual-Band Seamless Roaming (' + totalArea.toLocaleString('id-ID') + ' m²)',
            qty: apCount + ' Unit'
        });

        if (sfpQty > 0) {
            items.push({
                category: 'A. Jaringan & Keamanan',
                name: 'SFP / SFP+ Optical Transceiver (Modul Konektor Laser Fiber Optic)',
                spec: (s.foType === 'os2' ? 'Singlemode 1310nm LC Duplex' : 'Multimode 850nm 10G-SR'),
                qty: sfpQty + ' Pcs'
            });
        }

        // B. Infrastruktur Pasif, Kabel & Rack
        const cableLabel = s.cableType === 'cat6a' ? 'UTP Cat6A Shielded (10G Full)' : 'UTP Cat6 LSZH/PVC (TIA-568)';
        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Kabel LAN Horizontal ' + (s.cableType === 'cat6a' ? 'Cat6A' : 'Cat6') + ' (Jalur Data ke Meja/AP/CCTV)',
            spec: cableLabel + ' • Rata-rata tarikan ' + avgHorizontalRun + 'm/titik (~' + totalUtpMeters + 'm total, maks 90m TIA-568)',
            qty: utpBoxes + ' Box (@305m)'
        });

        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Patch Panel Modular 24-Port + RJ45 (Terminal Perapihan Ujung Kabel)',
            spec: '24-Port Modular Patch Panel + ' + patchCordQty + 'x Factory Patch Cord + Faceplate/Outbow',
            qty: patchPanelQty + ' Panel'
        });

        if (needFiberBackbone) {
            items.push({
                category: 'B. Kabel & Rack Pasif',
                name: 'Fiber Optic Backbone & OTB (Kabel Utama Penghubung Antar Lantai)',
                spec: (s.foType === 'os2' ? 'FO Singlemode OS2 ' : 'FO Multimode OM3/OM4 ') + foCores + '-Core (~' + foMeters + 'm) + ' + otbQty + 'x OTB & Pigtail',
                qty: foMeters + ' Meter'
            });
        }

        items.push({
            category: 'B. Kabel & Rack Pasif',
            name: 'Pelindung Pipa Conduit & Lemari Rack Server (MDF/IDF)',
            spec: conduitPipes + ' Btg Conduit 20mm' + (cableTrayMeters > 0 ? ' + ' + cableTrayMeters + 'm Cable Tray' : '') + ' • Close Rack MDF ' + mdfRackSize + (idfRackQty > 0 ? ' + ' + idfRackQty + 'x Wallmount IDF 9U' : ''),
            qty: '1 Paket'
        });

        // C. Surveillance, Smart Access, Server & Daya
        if (totalCams > 0) {
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'IP Camera Surveillance ' + s.cctvRes.toUpperCase() + ' (Kamera Pengawas Dalam & Luar Ruang)',
                spec: indoorCams + 'x Indoor Dome + ' + outdoorCams + 'x Outdoor Weatherproof PoE (Codec H.265+)',
                qty: totalCams + ' Unit'
            });
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'Central NVR & Harddisk Rekaman CCTV',
                spec: tier.nvr + ' (' + nvrChannels + '-Ch) + ' + hddCount + 'x ' + hddSizeTB + 'TB Surveillance HDD (Simpan ' + retentionDays + ' Hari / ' + storageTB + ' TB)',
                qty: '1 Sistem'
            });
        }

        if (accessDoors > 0) {
            items.push({
                category: 'C. CCTV & Akses Kontrol',
                name: 'Biometric / RFID Door Access Control (Kunci Pintu Kartu & Sidik Jari)',
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
                name: 'Server / Penyimpanan Data Terpusat (NAS/Virtualisasi)',
                spec: tier.server + ' • ' + serverModeLabel + (s.cloudBackup ? ' + Cloud Offsite DR Replication' : ''),
                qty: (s.serverMode === 'ha_cluster' ? '2 Node' : '1 Unit')
            });
        } else if (s.cloudBackup) {
            items.push({
                category: 'C. Server & Backup Daya',
                name: 'Cloud Backup & Disaster Recovery (Cadangan Data Awan Otomatis)',
                spec: 'Automated Encrypted Offsite Backup Policy',
                qty: '1 Sistem'
            });
        }

        items.push({
            category: 'C. Server & Backup Daya',
            name: 'UPS Online Sinewave (Cadangan Listrik Otomatis Saat PLN Padam)',
            spec: 'Kapasitas ' + upsSpecVA + ' • Estimasi beban rack ~' + activeGearWatts + 'W (Tahan ~' + s.upsMinutes + ' mnt)',
            qty: '1 Unit'
        });

        // D. Jasa Eksekusi Lapangan & Sertifikasi
        items.push({
            category: 'D. Jasa Eksekusi Lapangan',
            name: 'Instalasi Rapi, Penomoran Label & Pasang Tanpa Ganggu Jam Kerja',
            spec: 'Pre-config workshop, tarikan rapi TIA-606-B thermal label, cutover malam/akhir pekan (Zero-Downtime)',
            qty: fieldDaysMin + '–' + fieldDaysMax + ' Hari'
        });

        if (s.flukeTest) {
            items.push({
                category: 'D. Jasa Eksekusi Lapangan',
                name: 'Uji Sertifikasi Alat Fluke/OTDR & Dokumen Denah Jaringan (As-Built)',
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

        savePersistedCalcState();
        updateWhatsAppLinksWithContext();
    }

    function savePersistedCalcState() {
        try {
            sessionStorage.setItem('tkt_calc_state_v1', JSON.stringify(calcState));
        } catch (e) {
            // ignore
        }
    }

    function loadPersistedCalcState() {
        try {
            const raw = sessionStorage.getItem('tkt_calc_state_v1');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    Object.assign(calcState, parsed);
                }
            }
        } catch (e) {
            // ignore
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
        loadPersistedCalcState();
        const modeQuickBtn = document.getElementById('calc-mode-quick-btn');
        if (!modeQuickBtn) {
            // Halaman utama / sub-layanan merujuk ke kalkulator-boq-it.html; tetap siapkan konteks BOQ tersimpan untuk AI & Form Booking
            lastComputedBoq = computeEngineeringBoq(calcState);
            const aiCtxBadge = document.getElementById('ai-calc-context-badge');
            if (aiCtxBadge && lastComputedBoq) {
                aiCtxBadge.textContent = 'Konteks BOQ Aktif: ' + lastComputedBoq.metrics.users + ' User • ' + lastComputedBoq.metrics.floors + ' Lantai • ' + lastComputedBoq.metrics.apCount + ' AP';
            }
            updateWhatsAppLinksWithContext();
            return;
        }
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
                savePersistedCalcState();
                navigateOrSyncBooking();
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
            summary: lastComputedBoq.summary,
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

    const OFFICIAL_WA_NUMBER = '6285167694457';

    function buildWhatsAppCsUrl(customNote) {
        const boqLine = lastComputedBoq && lastComputedBoq.summary
            ? '\n[Konteks Simulasi BOQ: ' + lastComputedBoq.summary + ']'
            : '';
        const noteLine = (customNote && customNote.toLowerCase() !== 'cs')
            ? '\nTopik: ' + customNote
            : '';
        const text = 'Halo CS & Tim Teknis PT Teknotama Prakarsa Mulia, saya ingin berkonsultasi langsung mengenai kebutuhan infrastruktur IT perusahaan kami.'
            + boqLine
            + noteLine;
        return 'https://wa.me/' + OFFICIAL_WA_NUMBER + '?text=' + encodeURIComponent(text);
    }

    function updateWhatsAppLinksWithContext() {
        const waUrl = buildWhatsAppCsUrl('');
        ['widget-wa-direct-card', 'widget-header-wa-btn', 'floating-wa-direct-btn'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) el.setAttribute('href', waUrl);
        });
    }

    function isDirectCsCommand(rawText) {
        const clean = (rawText || '').trim().toLowerCase();
        if (/^\/?(cs|wa|whatsapp|admin|live\s*cs|chat\s*cs|hubungi\s*cs|kontak\s*cs|cs\s*wa|wa\s*cs|admin\s*wa|nomor\s*wa|no\s*wa)[.!?]*$/i.test(clean)) {
            return true;
        }
        if (/\b(sambungkan|hubungkan|alihkan|direct|lanjut|bicara|chat|hubungi)\s+(saya\s+)?(langsung\s+)?(ke\s+|dengan\s+)?(cs|customer\s*service|whatsapp|wa|admin\s*wa)\b/i.test(clean)) {
            return true;
        }
        return false;
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
                    const waActionHtml = msg.whatsappUrl
                        ? '<div class="mt-2.5"><a href="' + escapeHtml(msg.whatsappUrl) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-[11px] px-3.5 py-2 rounded-xl shadow-md transition-all">Chat Langsung via WhatsApp CS (+62 851-6769-4457) &rarr;</a></div>'
                        : '';
                    const engineTag = msg.engineLabel
                        ? '<div class="mt-2 pt-1.5 border-t border-red-950/60 flex items-center justify-between text-[10px] text-slate-500 font-mono"><span>' + escapeHtml(msg.engineLabel) + '</span><button type="button" class="chat-sync-btn text-brand-400 hover:text-brand-300 font-sans font-semibold">Salin ke Form &rarr;</button></div>'
                        : '';
                    html += '<div class="flex justify-start">'
                        + '<div class="max-w-[92%] bg-[#0d1424] border border-red-950/80 text-slate-200 text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-bl-sm chat-markdown">'
                        + renderSafeMarkdown(msg.content)
                        + waActionHtml
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
                    navigateOrSyncBooking();
                });
            });
        });
    }

    function navigateOrSyncBooking() {
        const kontak = document.getElementById('kontak');
        if (kontak && document.getElementById('form-message')) {
            syncContextToBookingForm(true);
            kontak.scrollIntoView({ behavior: 'smooth' });
        } else {
            try {
                sessionStorage.setItem('tkt_pending_booking_sync', '1');
            } catch (e) {
                // ignore
            }
            window.location.href = '/kontak.html#kontak';
        }
    }

    function buildClientSideFallbackReply(userMessage) {
        const q = (userMessage || '').toLowerCase();
        const m = lastComputedBoq ? lastComputedBoq.metrics : { users: 60, floors: 2, apCount: 8, totalPortsWithSpare: 101, utpBoxes: 8, foMeters: 77 };

        if (/limbah|sampah|lingkungan|nexustech/i.test(q)) {
            return 'Perlu kami informasikan bahwa website ini adalah **PT Teknotama Prakarsa Mulia (`teknotama.com`)** yang berkantor di **Infiniti Office, Belleza BSA Lt. 1 Unit 106, Jakarta Selatan**.\n\nKami bergerak khusus di bidang **Infrastruktur IT & Jaringan Enterprise** (Instalasi Kabel LAN Cat6/Cat6A, Splicing Fiber Optic, Server Data Center, Firewall Fortinet/Cisco/MikroTik, Managed IT NOC 24/7, dan IP CCTV), bukan perusahaan pengolahan limbah/lingkungan.';
        }
        if (/kabel|fiber|cat6|fluke|otdr|conduit|tray/i.test(q)) {
            return 'Berdasarkan **SOP Pengkabelan PT Teknotama Prakarsa Mulia**:\n\n- **Penjelasan Singkat**: Untuk jarak di dalam satu lantai (maksimal 90 meter), kami memakai kabel **UTP Cat6/Cat6A**. Sedangkan untuk menghubungkan antar lantai atau jarak lebih dari 90 meter, wajib memakai **Fiber Optic Backbone** agar kecepatan tidak turun.\n- **Standar Teknis Lapangan**: Seluruh jalur dilindungi **Pipa Conduit High-Impact 20/25mm** atau **Cable Tray**, berjarak minimal 30 cm dari kabel listrik, diberi **Thermal Label TIA-606-B** di kedua ujung, dan diuji sertifikasi **Fluke & OTDR** sebelum serah terima.';
        }
        if (/downtime|malam|jam kerja|sabtu|minggu|cutover/i.test(q)) {
            return 'Kami menerapkan metode **Zero-Downtime Execution** agar aktivitas kantor Anda tidak terganggu sama sekali:\n\n1. **Setting di Workshop**: Seluruh perangkat (Router, Switch, Wi-Fi, NVR) sudah kami konfigurasi lebih dulu di workshop Teknotama.\n2. **Kerja di Luar Jam Kantor**: Pengeboran dan penarikan kabel plafon dilakukan pada **malam hari atau akhir pekan** sesuai izin gedung.\n3. **Garansi & SLA**: Garansi kerapihan kabel 1 tahun, garansi hardware resmi 1–3 tahun, dan respons emergency **< 2 jam** (Jabodetabek).';
        }
        return 'Berdasarkan simulasi aktif Anda (**' + m.users + ' User, ' + m.floors + ' Lantai**), sistem merekomendasikan **' + m.totalPortsWithSpare + ' port switch PoE+**, **' + m.apCount + ' unit Wi-Fi 6 AP**, serta **' + m.utpBoxes + ' box kabel LAN' + (m.foMeters > 0 ? ' + ' + m.foMeters + 'm Fiber Optic Backbone' : '') + '**.\n\nSilakan klik tombol **Terapkan Ringkasan AI & BOQ ke Formulir Booking** agar tim engineer PT Teknotama Prakarsa Mulia menjadwalkan **Site Survey Gratis** dan mengirimkan penawaran resmi dari `admin@teknotama.com`.';
    }

    async function sendChatMessage(rawText) {
        const message = (rawText || '').trim();
        if (!message || isChatBusy) return;

        // Direct Trigger: ketik "cs" / "wa" / "whatsapp" / "hubungi cs" -> Langsung buka WhatsApp CS
        if (isDirectCsCommand(message)) {
            const waUrl = buildWhatsAppCsUrl(message);
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({
                role: 'assistant',
                content: '**Mengalihkan Anda langsung ke WhatsApp Customer Service & NOC PT Teknotama Prakarsa Mulia (+62 851-6769-4457)...**\n\n- Jendela WhatsApp resmi kami sedang dibuka secara otomatis beserta konteks simulasi BOQ Anda.\n- Jika tertahan pengaturan *pop-up* browser, silakan klik tombol **Chat Langsung via WhatsApp CS** di bawah ini.',
                engineLabel: 'TeknoAssist • Direct WhatsApp CS Handoff',
                whatsappUrl: waUrl
            });
            savePersistedChatHistory();
            renderChatFeeds();
            showToast('Mengalihkan langsung ke WhatsApp CS PT Teknotama...');
            try {
                const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
                if (!win) {
                    // Jika pop-up diblokir, tetap aman dengan tombol klik langsung di chat
                }
            } catch (e) {
                // ignore
            }
            return;
        }

        chatHistory.push({ role: 'user', content: message });
        savePersistedChatHistory();
        isChatBusy = true;
        renderChatFeeds();

        const payload = {
            message: message,
            history: chatHistory.slice(0, -1).slice(-10).map(function (m) {
                return { role: m.role, content: m.content };
            }),
            calculator_context: buildCalculatorContextPayload()
        };

        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(function () { controller.abort(); }, 16000) : null;

        try {
            const resp = await fetch('teknotama_api.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller ? controller.signal : undefined
            });
            if (timeoutId) clearTimeout(timeoutId);

            const data = await resp.json();
            if (resp.ok && data && data.ok && data.reply) {
                const labelMap = {
                    groq: 'TeknoAssist AI • Groq Engine',
                    gemini: 'TeknoAssist AI • Gemini Engine',
                    openrouter: 'TeknoAssist AI • OpenRouter',
                    cohere: 'TeknoAssist AI • Cohere',
                    local_expert: 'TeknoAssist SOP Engine',
                    guardrail_shield: 'TeknoAssist • AI Safety & Guardrail Shield',
                    whatsapp_cs_direct: 'TeknoAssist • Direct WhatsApp CS Handoff'
                };
                chatHistory.push({
                    role: 'assistant',
                    content: data.reply,
                    engineLabel: labelMap[data.engine] || 'TeknoAssist AI',
                    whatsappUrl: data.whatsapp_url || ''
                });
                if (data.redirect_whatsapp && data.whatsapp_url) {
                    try {
                        window.open(data.whatsapp_url, '_blank', 'noopener,noreferrer');
                    } catch (e) {
                        // ignore
                    }
                }
            } else {
                chatHistory.push({
                    role: 'assistant',
                    content: buildClientSideFallbackReply(message),
                    engineLabel: 'TeknoAssist SOP Engine'
                });
            }
        } catch (err) {
            if (timeoutId) clearTimeout(timeoutId);
            chatHistory.push({
                role: 'assistant',
                content: buildClientSideFallbackReply(message),
                engineLabel: 'TeknoAssist Instant SOP Engine'
            });
        } finally {
            isChatBusy = false;
            savePersistedChatHistory();
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
        const tabWaBtn = document.getElementById('widget-tab-wa');
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
        if (tabWaBtn) {
            tabWaBtn.addEventListener('click', function () {
                widgetActiveTab = 'chat';
                updateWidgetVisibility();
                sendChatMessage('cs');
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
                savePersistedChatHistory();
                renderChatFeeds();
                showToast('Percakapan AI direset.');
            });
        }
        if (syncFormBtn) {
            syncFormBtn.addEventListener('click', function () {
                widgetOpen = false;
                updateWidgetVisibility();
                navigateOrSyncBooking();
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

        updateWhatsAppLinksWithContext();
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
                .filter(function (m) { return m.role === 'user' && !isDirectCsCommand(m.content); })
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
            msgBox.scrollTop = 0;
            try {
                msgBox.setSelectionRange(0, 0);
            } catch (e) {
                // ignore
            }
            msgBox.focus();
        }

        showToast('Ringkasan teknis & BOQ berhasil diterapkan ke Formulir Survei.');
    }

    function initBookingForm() {
        const form = document.getElementById('contact-form');
        const clearAttachmentBtn = document.getElementById('clear-booking-attachment');
        const surveyDateInput = document.getElementById('form-survey-date');

        if (surveyDateInput) {
            const todayIso = new Date().toISOString().split('T')[0];
            surveyDateInput.setAttribute('min', todayIso);
        }

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
                        alertBox.className = 'mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium bg-emerald-50 text-emerald-900 border border-emerald-300 space-y-3';
                        alertBox.innerHTML = '<div><strong>Permintaan Terkirim!</strong> ' + escapeHtml(data.message) + '</div>'
                            + (data.whatsapp_url
                                ? '<div><a href="' + escapeHtml(data.whatsapp_url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-full transition-all">Kirim Salinan Cepat via WhatsApp NOC &rarr;</a></div>'
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
                    alertBox.className = 'mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium bg-red-50 text-red-900 border border-red-300';
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
     * 6B. CMS TESTIMONIALS (GOOGLE MAPS REVIEW STYLE + ADMIN CMS MODAL)
     * ======================================================================== */

    let testimonialsList = [];
    let activeTestimonialFilter = 'all';

    function getAvatarInitials(name) {
        const parts = (name || 'Klien Teknotama').replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return (parts[0] || 'KT').slice(0, 2).toUpperCase();
    }

    function buildStarsHtml(rating) {
        const r = Math.max(1, Math.min(5, Number(rating) || 5));
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= r ? '&#9733;' : '<span class="text-slate-300">&#9733;</span>';
        }
        return stars;
    }

    function buildStarsSvgHtml(rating) {
        const r = Math.max(1, Math.min(5, Number(rating) || 5));
        const starPath = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const cls = i <= r ? 'w-4 h-4 fill-current' : 'w-4 h-4 fill-current text-slate-300';
            stars += '<svg class="' + cls + '" viewBox="0 0 20 20" aria-hidden="true"><path d="' + starPath + '"/></svg>';
        }
        return stars;
    }

    function updateTestimonialSectionVisibility() {
        const hasReviews = Array.isArray(testimonialsList) && testimonialsList.length > 0;
        const sectionEl = document.getElementById('testimoni');
        const gridEl = document.getElementById('testimonials-grid');
        if (sectionEl) {
            sectionEl.classList.toggle('hidden', !hasReviews);
            if (hasReviews) {
                sectionEl.classList.add('visible');
            }
        }
        if (gridEl && hasReviews) {
            gridEl.classList.add('visible');
        }
        document.querySelectorAll('.nav-testimoni-link').forEach(function (el) {
            el.classList.toggle('hidden', !hasReviews);
        });
    }

    function renderTestimonialsGrid() {
        updateTestimonialSectionVisibility();
        const grid = document.getElementById('testimonials-grid');
        if (!grid) return;

        if (!Array.isArray(testimonialsList) || testimonialsList.length === 0) {
            grid.innerHTML = '';
            return;
        }

        const filtered = testimonialsList.filter(function (item) {
            if (activeTestimonialFilter === 'all') return true;
            return (item.service_category || '') === activeTestimonialFilter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="col-span-full bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">Belum ada ulasan klien untuk kategori layanan ini.</div>';
            return;
        }

        const avatarColors = ['bg-[#d9141d]', 'bg-slate-900', 'bg-red-800', 'bg-slate-800', 'bg-red-700', 'bg-slate-950'];

        grid.innerHTML = filtered.map(function (item, idx) {
            const initials = getAvatarInitials(item.author_name);
            const colorClass = avatarColors[idx % avatarColors.length];
            const subtitle = [item.author_role, item.company_name].filter(Boolean).join(' • ');
            const replyHtml = item.owner_reply
                ? '<div class="mt-3 pt-3 border-t border-slate-100">'
                    + '<p class="text-[10px] font-bold text-slate-800">PT Teknotama Prakarsa Mulia</p>'
                    + '<p class="text-[11px] text-slate-500 mt-0.5 leading-snug">' + escapeHtml(item.owner_reply) + '</p>'
                    + '</div>'
                : '';

            return '<article class="testimonial-card" data-testimonial-id="' + escapeHtml(item.id || '') + '">'
                + '<div>'
                + '<div class="flex items-center justify-between gap-2 mb-3.5">'
                + '<div class="testimonial-stars flex items-center gap-1 text-[#d9141d]" aria-label="' + escapeHtml(String(item.rating || 5)) + ' Bintang">'
                + buildStarsSvgHtml(item.rating)
                + '</div>'
                + '<span class="text-[10px] font-bold text-[#d9141d] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full truncate max-w-[160px]">' + escapeHtml(item.service_category || 'Infrastruktur IT') + '</span>'
                + '</div>'
                + '<p class="testimonial-text text-slate-700 text-sm leading-relaxed">&ldquo;' + escapeHtml(item.comment || '') + '&rdquo;</p>'
                + '</div>'
                + '<div>'
                + '<div class="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">'
                + '<div class="w-10 h-10 rounded-full ' + colorClass + ' text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">' + escapeHtml(initials) + '</div>'
                + '<div class="min-w-0">'
                + '<h4 class="text-sm font-extrabold text-slate-900 truncate">' + escapeHtml(item.author_name || 'Klien Korporasi') + '</h4>'
                + '<p class="text-[11px] text-slate-500 truncate">' + escapeHtml(subtitle || 'Mitra B2B Teknotama') + '</p>'
                + '</div>'
                + '</div>'
                + replyHtml
                + '</div>'
                + '</article>';
        }).join('');
    }

    function updateTestimonialsStatsUi(stats) {
        const avgEl = document.getElementById('testimonial-avg-score');
        const countEl = document.getElementById('testimonial-total-count');
        const total = (stats && typeof stats.total !== 'undefined') ? Number(stats.total) : 0;
        if (avgEl && stats && typeof stats.average_rating !== 'undefined') {
            avgEl.textContent = Number(stats.average_rating).toFixed(1);
        }
        if (countEl && stats && typeof stats.total !== 'undefined') {
            countEl.textContent = String(total);
        }

        const pill = document.getElementById('cms-status-pill');
        const desc = document.getElementById('cms-status-desc');
        if (pill && desc) {
            if (total > 0) {
                pill.className = 'text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200';
                pill.textContent = 'Aktif & Tampil (' + total + ' Ulasan)';
                desc.innerHTML = 'Section <code>#testimoni</code> saat ini <strong>aktif tampil</strong> di bawah Portofolio pada halaman utama (<code>index.html</code>).';
            } else {
                pill.className = 'text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
                pill.textContent = 'Tersembunyi (0 Ulasan)';
                desc.innerHTML = 'Karena belum ada testimoni asli, section <code>#testimoni</code> otomatis disembunyikan dari pengunjung. Begitu Anda menyimpan minimal 1 testimoni terverifikasi, section akan otomatis muncul di bawah Portofolio.';
            }
        }
    }

    function renderCmsManageList() {
        const listEl = document.getElementById('cms-testimonial-manage-list');
        if (!listEl) return;

        if (testimonialsList.length === 0) {
            listEl.innerHTML = '<div class="text-xs text-slate-400 p-4 text-center">Belum ada testimoni tersimpan.</div>';
            return;
        }

        listEl.innerHTML = testimonialsList.map(function (item) {
            return '<div class="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all flex items-start justify-between gap-3">'
                + '<div class="min-w-0 flex-1">'
                + '<div class="flex items-center gap-2">'
                + '<span class="text-xs font-extrabold text-slate-900 truncate">' + escapeHtml(item.author_name) + '</span>'
                + '<span class="text-amber-400 text-xs">' + buildStarsHtml(item.rating) + '</span>'
                + '</div>'
                + '<p class="text-[11px] text-slate-500 truncate">' + escapeHtml((item.author_role || '') + ' • ' + (item.company_name || '')) + '</p>'
                + '<p class="text-[11px] text-slate-600 mt-1 line-clamp-2">"' + escapeHtml(item.comment) + '"</p>'
                + '</div>'
                + '<div class="flex flex-col gap-1.5 flex-shrink-0">'
                + '<button type="button" data-cms-edit="' + escapeHtml(item.id) + '" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-bold transition-colors">Edit</button>'
                + '<button type="button" data-cms-delete="' + escapeHtml(item.id) + '" class="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-[#d9141d] text-[#d9141d] hover:text-white border border-red-200 text-[10px] font-bold transition-colors">Hapus</button>'
                + '</div>'
                + '</div>';
        }).join('');

        listEl.querySelectorAll('[data-cms-edit]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetId = btn.getAttribute('data-cms-edit');
                const found = testimonialsList.find(function (it) { return it.id === targetId; });
                if (!found) return;
                const setField = function (id, val) {
                    const el = document.getElementById(id);
                    if (el) el.value = val || '';
                };
                setField('cms-rev-id', found.id);
                setField('cms-rev-author', found.author_name);
                setField('cms-rev-role', found.author_role);
                setField('cms-rev-company', found.company_name);
                setField('cms-rev-category', found.service_category || 'Fiber Optic & LAN');
                setField('cms-rev-comment', found.comment);
                setField('cms-rev-reply', found.owner_reply || '');
                setStarPickerValue(found.rating || 5);

                const heading = document.getElementById('cms-form-heading');
                if (heading) heading.textContent = 'Edit Testimoni: ' + found.author_name;
                const resetBtn = document.getElementById('cms-reset-form-btn');
                if (resetBtn) resetBtn.classList.remove('hidden');
                const submitLabel = document.getElementById('cms-rev-submit-label');
                if (submitLabel) submitLabel.textContent = 'Perbarui Testimoni (Butuh Kode Admin)';
            });
        });

        listEl.querySelectorAll('[data-cms-delete]').forEach(function (btn) {
            btn.addEventListener('click', async function () {
                const targetId = btn.getAttribute('data-cms-delete');
                const keyInput = document.getElementById('cms-rev-admin-key');
                const adminKey = keyInput ? keyInput.value.trim() : '';
                const alertBox = document.getElementById('cms-testimonial-alert');

                if (!adminKey) {
                    if (alertBox) {
                        alertBox.className = 'mb-3 p-3 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300';
                        alertBox.textContent = 'Masukkan Kode Akses Admin CMS terlebih dahulu pada kolom di bawah untuk menghapus testimoni.';
                        alertBox.classList.remove('hidden');
                    }
                    if (keyInput) keyInput.focus();
                    return;
                }

                try {
                    const resp = await fetch('teknotama_api.php?action=testimonials_delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: targetId, admin_key: adminKey })
                    });
                    const data = await resp.json();
                    if (resp.ok && data && data.ok) {
                        testimonialsList = data.items || [];
                        renderTestimonialsGrid();
                        renderCmsManageList();
                        updateTestimonialsStatsUi(data.stats);
                        showToast('Testimoni berhasil dihapus dari CMS.');
                        if (alertBox) {
                            alertBox.className = 'mb-3 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300';
                            alertBox.textContent = 'Testimoni berhasil dihapus.';
                            alertBox.classList.remove('hidden');
                        }
                    } else {
                        throw new Error((data && data.error) ? data.error : 'Gagal menghapus testimoni.');
                    }
                } catch (err) {
                    if (alertBox) {
                        alertBox.className = 'mb-3 p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-900 border border-red-300';
                        alertBox.textContent = err.message || 'Gagal menghapus testimoni.';
                        alertBox.classList.remove('hidden');
                    }
                }
            });
        });
    }

    function setStarPickerValue(val) {
        const rating = Math.max(1, Math.min(5, Number(val) || 5));
        const input = document.getElementById('cms-rev-rating');
        if (input) input.value = String(rating);
        const labelMap = {
            1: '1.0 / 5 (Kurang Puas)',
            2: '2.0 / 5 (Cukup)',
            3: '3.0 / 5 (Baik)',
            4: '4.0 / 5 (Puas)',
            5: '5.0 / 5 (Sangat Puas)'
        };
        const label = document.getElementById('cms-star-label');
        if (label) label.textContent = labelMap[rating] || '5.0 / 5';
        document.querySelectorAll('.cms-star-btn').forEach(function (btn) {
            const s = Number(btn.getAttribute('data-star'));
            btn.classList.toggle('text-amber-400', s <= rating);
            btn.classList.toggle('text-slate-300', s > rating);
        });
    }

    function resetCmsTestimonialForm() {
        const form = document.getElementById('cms-testimonial-form');
        if (form) form.reset();
        const idField = document.getElementById('cms-rev-id');
        if (idField) idField.value = '';
        setStarPickerValue(5);
        const heading = document.getElementById('cms-form-heading');
        if (heading) heading.textContent = 'Tulis / Tambah Testimoni Baru';
        const resetBtn = document.getElementById('cms-reset-form-btn');
        if (resetBtn) resetBtn.classList.add('hidden');
        const submitLabel = document.getElementById('cms-rev-submit-label');
        if (submitLabel) submitLabel.textContent = 'Simpan & Tampilkan Testimoni';
    }

    async function initTestimonialsCms() {
        const grid = document.getElementById('testimonials-grid');
        const form = document.getElementById('cms-testimonial-form');
        if (!grid && !form) return;

        // Filter buttons (hanya di halaman publik bila ada ulasan)
        const filterBtns = document.querySelectorAll('.testimonial-filter-btn');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                activeTestimonialFilter = btn.getAttribute('data-rev-filter') || 'all';
                filterBtns.forEach(function (b) {
                    b.className = 'testimonial-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-red-300 transition-all';
                });
                btn.className = 'testimonial-filter-btn active px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#d9141d] text-white transition-all';
                renderTestimonialsGrid();
            });
        });

        const resetFormBtn = document.getElementById('cms-reset-form-btn');
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', function () {
                resetCmsTestimonialForm();
            });
        }

        // Star picker buttons
        document.querySelectorAll('.cms-star-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setStarPickerValue(btn.getAttribute('data-star'));
            });
        });

        // Submit CMS Form (di halaman admin-testimoni.html)
        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const alertBox = document.getElementById('cms-testimonial-alert');
                const payload = {
                    id: (document.getElementById('cms-rev-id') || {}).value || '',
                    author_name: ((document.getElementById('cms-rev-author') || {}).value || '').trim(),
                    author_role: ((document.getElementById('cms-rev-role') || {}).value || '').trim(),
                    company_name: ((document.getElementById('cms-rev-company') || {}).value || '').trim(),
                    service_category: (document.getElementById('cms-rev-category') || {}).value || 'Fiber Optic & LAN',
                    rating: Number((document.getElementById('cms-rev-rating') || {}).value || 5),
                    comment: ((document.getElementById('cms-rev-comment') || {}).value || '').trim(),
                    owner_reply: ((document.getElementById('cms-rev-reply') || {}).value || '').trim(),
                    admin_key: ((document.getElementById('cms-rev-admin-key') || {}).value || '').trim()
                };

                try {
                    const resp = await fetch('teknotama_api.php?action=testimonials_save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await resp.json();
                    if (resp.ok && data && data.ok) {
                        testimonialsList = data.items || [];
                        renderTestimonialsGrid();
                        renderCmsManageList();
                        updateTestimonialsStatsUi(data.stats);
                        resetCmsTestimonialForm();
                        showToast(data.mode === 'updated' ? 'Testimoni berhasil diperbarui di CMS!' : 'Testimoni baru berhasil ditambahkan!');
                        if (alertBox) {
                            alertBox.className = 'mb-3 p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300';
                            alertBox.textContent = data.mode === 'updated'
                                ? 'Testimoni berhasil diperbarui dan langsung tampil di homepage.'
                                : 'Testimoni baru berhasil disimpan dan langsung tampil di homepage!';
                            alertBox.classList.remove('hidden');
                        }
                    } else {
                        throw new Error((data && data.error) ? data.error : 'Gagal menyimpan testimoni.');
                    }
                } catch (err) {
                    if (alertBox) {
                        alertBox.className = 'mb-3 p-3 rounded-xl text-xs font-semibold bg-red-50 text-red-900 border border-red-300';
                        alertBox.textContent = err.message || 'Gagal menyimpan testimoni.';
                        alertBox.classList.remove('hidden');
                    }
                }
            });
        }

        // Fetch initial testimonials from server CMS API
        try {
            const resp = await fetch('teknotama_api.php?action=testimonials_list');
            const data = await resp.json();
            if (resp.ok && data && data.ok && Array.isArray(data.items)) {
                testimonialsList = data.items;
                renderTestimonialsGrid();
                renderCmsManageList();
                updateTestimonialsStatsUi(data.stats);
            }
        } catch (err) {
            // Keep clean hidden state if offline
        }
    }

    /* ========================================================================
     * 7. INISIALISASI SAAT DOM SIAP
     * ======================================================================== */

    function ensureFloatingWidgetDom() {
        if (document.body && document.body.getAttribute('data-no-widget') === '1') {
            return;
        }
        if (!document.getElementById('ai-widget-container')) {
            const waHref = buildWhatsAppCsUrl('');
            const hasCalculatorOnPage = Boolean(document.getElementById('boq-table'));
            const boqCardHtml = hasCalculatorOnPage
                ? '<button id="widget-review-boq-card" type="button" class="w-full text-left bg-[#11192b] hover:bg-[#172138] border border-red-950/80 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all"><div><span class="block text-xs font-bold text-brand-400" data-en="Review BOQ Calculator Simulation">Review Simulasi Kalkulator BOQ</span><span id="ai-calc-context-badge" class="block text-[11px] text-slate-300 mt-0.5">Konteks BOQ Aktif: 60 User • 2 Lantai</span></div><i data-lucide="cpu" class="w-4 h-4 text-brand-400 flex-shrink-0"></i></button>'
                : '<a href="kalkulator-boq-it.html" class="w-full text-left bg-[#11192b] hover:bg-[#172138] border border-red-950/80 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all"><div><span class="block text-xs font-bold text-brand-400" data-en="Open Technical BOQ Calculator">Buka Kalkulator BOQ Teknis</span><span class="block text-[11px] text-slate-300 mt-0.5" data-en="Calculate PoE Switch, Cabling &amp; UPS needs">Hitung kebutuhan Switch PoE, Kabel &amp; UPS</span></div><i data-lucide="cpu" class="w-4 h-4 text-brand-400 flex-shrink-0"></i></a>';
            const waIconSvg = '<svg class="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.556 4.122 1.534 5.854l-1.534 5.611 5.752-1.509c1.682.905 3.604 1.419 5.647 1.419 6.627 0 12-5.373 12-12 0-6.627-5.373-12-11.399-11.375z"/></svg>';

            const wrap = document.createElement('div');
            wrap.innerHTML = '<div id="ai-widget-container" class="fixed bottom-4 left-3 right-3 sm:left-auto sm:bottom-5 sm:right-5 z-[55] no-print flex flex-col items-end pointer-events-none">'
                + '<div id="ai-widget-panel" class="hidden pointer-events-auto mb-3 bg-[#090d16] rounded-3xl overflow-hidden flex flex-col relative">'
                + '<button id="widget-close-btn" type="button" aria-label="Tutup Asisten AI & WhatsApp" class="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-brand-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors"><i data-lucide="x" class="w-4 h-4"></i></button>'
                + '<div id="widget-view-home" class="flex-1 flex flex-col overflow-hidden">'
                + '<div class="bg-gradient-to-br from-[#12080d] via-[#1c0b12] to-[#090d16] p-4 pr-12 border-b border-red-950/70">'
                + '<div class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>TeknoAssist AI &amp; WhatsApp CS • 1 Box Terpadu</div>'
                + '<h3 class="text-lg font-extrabold text-white" data-en-html="Hello! How can we help? &#128075;">Halo! Ada yang bisa dibantu? &#128075;</h3>'
                + '<p class="text-[11px] text-slate-300 mt-0.5 leading-relaxed" data-en="Instant consultation with our AI Field Engineer or connect directly to our official WhatsApp CS.">Konsultasi instan dengan AI Field Engineer atau terhubung langsung ke WhatsApp CS resmi kami.</p>'
                + '</div>'
                + '<div class="flex-1 overflow-y-auto tkt-scroll p-3.5 space-y-2.5 bg-[#080c15]">'
                + '<button id="widget-start-conversation" type="button" class="w-full text-left bg-[#11192b] hover:bg-[#172138] border border-brand-600/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all group"><div><span class="block text-xs font-bold text-white group-hover:text-brand-400 transition-colors" data-en="Start AI Engineer Consultation">Mulai Konsultasi AI Engineer</span><span class="block text-[11px] text-slate-400 mt-0.5" data-en-html="Type &lt;strong class=&quot;text-emerald-400&quot;&gt;&amp;quot;cs&amp;quot;&lt;/strong&gt; in chat to go straight to WhatsApp">Ketik <strong class="text-emerald-400">&quot;cs&quot;</strong> di chat untuk langsung ke WhatsApp</span></div><div class="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-600/30"><i data-lucide="bot" class="w-4 h-4"></i></div></button>'
                + '<a id="widget-wa-direct-card" href="' + escapeHtml(waHref) + '" target="_blank" rel="noopener noreferrer" class="w-full text-left bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all group"><div><span class="block text-xs font-bold text-emerald-300 group-hover:text-white transition-colors" data-en="Direct CS Chat via WhatsApp">Chat Langsung CS via WhatsApp</span><span class="block text-[11px] text-emerald-200/80 mt-0.5">Official NOC &amp; Sales: +62 851-6769-4457</span></div><div class="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md"><i data-lucide="phone-call" class="w-4 h-4"></i></div></a>'
                + '<div class="bg-[#11192b] border border-red-950/80 rounded-2xl p-3 space-y-2">'
                + '<div class="flex items-center justify-between"><span class="text-xs font-bold text-white" data-en="Field SOP Help Center">Pusat Bantuan SOP Lapangan</span><span class="text-[10px] text-brand-400 font-mono" data-en="8 Guides">8 Panduan</span></div>'
                + '<div class="relative"><i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i><input id="widget-help-search" type="text" placeholder="Cari SOP (TIA-568, FO, Fluke, SLA)..." data-en-placeholder="Search SOP (TIA-568, FO, Fluke, SLA)..." class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#080d1a] border border-red-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"></div>'
                + '<div id="widget-help-results" class="space-y-1.5 pt-1"></div>'
                + '</div>'
                + boqCardHtml
                + '</div></div>'
                + '<div id="widget-view-chat" class="hidden flex-1 flex flex-col overflow-hidden">'
                + '<div class="bg-[#11192b] px-3.5 py-3 pr-12 border-b border-red-950/80 flex items-center justify-between gap-2">'
                + '<div class="flex items-center gap-2 min-w-0"><div class="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white flex-shrink-0"><i data-lucide="bot" class="w-4 h-4"></i></div><div class="min-w-0"><h4 class="text-xs font-bold text-white truncate">TeknoAssist AI &amp; CS</h4><p class="text-[10px] text-emerald-400 font-medium truncate">Ketik &quot;cs&quot; &rarr; Direct WA</p></div></div>'
                + '<div class="flex items-center gap-1 flex-shrink-0"><a id="widget-header-wa-btn" href="' + escapeHtml(waHref) + '" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[10px] font-bold transition-colors">WA CS</a><button id="widget-sync-booking" type="button" title="Terapkan ke Form Booking" class="px-2 py-1 rounded-lg bg-brand-600/20 border border-brand-500/40 text-brand-300 hover:bg-brand-600 hover:text-white text-[10px] font-bold transition-colors">Ke Form</button><button id="widget-reset-chat" type="button" title="Reset Obrolan" class="p-1.5 rounded-lg bg-[#080d1a] text-slate-400 hover:text-white transition-colors"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i></button></div>'
                + '</div>'
                + '<div id="widget-chat-messages" class="flex-1 overflow-y-auto tkt-scroll p-4 space-y-3 bg-[#080c15]"></div>'
                + '<div class="px-3 pt-2 pb-1 bg-[#0b101b] border-t border-red-950/60 flex gap-1.5 overflow-x-auto tkt-scroll">'
                + '<button type="button" data-prompt="cs" class="ai-quick-chip whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/70 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold">Hubungi CS WA (Ketik: cs)</button>'
                + '<button type="button" data-prompt="Bagaimana SOP penarikan kabel Cat6/Cat6A dan Fiber Optic antar lantai?" class="ai-quick-chip whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-[#11192b] border border-red-950 text-slate-300 hover:border-brand-500 hover:text-white">SOP Kabel &amp; FO</button>'
                + '<button type="button" data-prompt="Bagaimana cara kerja malam/akhir pekan tanpa mengganggu operasional kantor?" class="ai-quick-chip whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-[#11192b] border border-red-950 text-slate-300 hover:border-brand-500 hover:text-white">Zero-Downtime</button>'
                + '</div>'
                + '<form id="widget-chat-form" class="p-3 bg-[#0b101b] flex gap-2"><input id="widget-chat-input" type="text" placeholder="Tanya teknis atau ketik \'cs\' langsung ke WA..." class="flex-1 px-3.5 py-2 rounded-xl bg-[#080d1a] border border-red-950 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500"><button type="submit" class="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center transition-colors"><i data-lucide="send" class="w-4 h-4"></i></button></form>'
                + '</div>'
                + '<div class="grid grid-cols-3 border-t border-red-950/80 bg-[#0d1424] h-12 flex-shrink-0">'
                + '<button id="widget-tab-home" type="button" class="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-400 hover:bg-white/5 transition-colors"><i data-lucide="home" class="w-3.5 h-3.5"></i><span>Beranda</span></button>'
                + '<button id="widget-tab-chat" type="button" class="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors border-x border-red-950/60"><i data-lucide="message-square" class="w-3.5 h-3.5"></i><span>Chat AI</span></button>'
                + '<button id="widget-tab-wa" type="button" class="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors"><i data-lucide="phone-call" class="w-3.5 h-3.5"></i><span>WhatsApp</span></button>'
                + '</div></div>'
                + '<div id="unified-chat-wa-box" class="pointer-events-auto flex items-center gap-1.5 bg-[#090d16]/95 p-1.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md">'
                + '<button id="ai-widget-toggle" type="button" aria-label="Buka Konsultasi AI & CS Teknotama" class="group flex items-center gap-2 bg-[#d9141d] hover:bg-[#b50e16] text-white font-bold px-4 py-2.5 rounded-full shadow-lg shadow-red-600/30 transition-all"><span id="widget-icon-open" class="flex items-center gap-2"><i data-lucide="bot" class="w-4 h-4"></i><span class="text-xs tracking-wide">Chat AI &amp; CS</span></span><span id="widget-icon-close" class="hidden flex items-center gap-1.5"><i data-lucide="chevron-down" class="w-4 h-4"></i><span class="text-xs">Tutup</span></span></button>'
                + '<a id="floating-wa-direct-btn" href="' + escapeHtml(waHref) + '" target="_blank" rel="noopener noreferrer" aria-label="Chat Langsung WhatsApp CS Teknotama" class="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-3.5 py-2.5 rounded-full shadow-lg transition-all">' + waIconSvg + '<span class="text-xs">WA CS</span></a>'
                + '</div>'
                + '</div>';
            while (wrap.firstChild) {
                document.body.appendChild(wrap.firstChild);
            }
        }
        if (!document.getElementById('tkt-toast')) {
            const toast = document.createElement('div');
            toast.id = 'tkt-toast';
            toast.className = 'hidden opacity-0 fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#11192b] border border-brand-500/60 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl transition-opacity duration-200 no-print';
            document.body.appendChild(toast);
        }
    }

    function initCrossPortalReferralTracking() {
        try {
            const params = new URLSearchParams(window.location.search);
            const rawRef = (params.get('ref') || '').trim();
            if (rawRef && /^[a-zA-Z0-9_-]{2,40}$/.test(rawRef)) {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'tkt_internal_ref',
                    ref_source: rawRef,
                    landing_path: window.location.pathname
                });
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'internal_referral', {
                        ref_source: rawRef,
                        page_path: window.location.pathname
                    });
                }
            }
        } catch (e) {
            // ignore URLSearchParams errors on older browsers
        }

        document.querySelectorAll('a[href*="/games/"]').forEach(function (link) {
            link.addEventListener('click', function () {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'tkt_cross_portal_click',
                    target_portal: 'teknogame',
                    ref_param: 'teknotamacom'
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        ensureFloatingWidgetDom();
        initNavigationAndStaticSections();
        initCrossPortalReferralTracking();
        initCalculator();
        initChatbotInterfaces();
        initBookingForm();
        initTestimonialsCms();

        try {
            if (sessionStorage.getItem('tkt_pending_booking_sync') === '1' && document.getElementById('form-message')) {
                sessionStorage.removeItem('tkt_pending_booking_sync');
                syncContextToBookingForm(true);
            }
        } catch (e) {
            // ignore
        }

        refreshIcons();
    });
})();
