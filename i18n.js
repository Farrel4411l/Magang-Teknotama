(function () {
    'use strict';

    var STORAGE_KEY = 'teknotama_lang';
    var DEFAULT_LANG = 'id';

    // Shared translations for Navbar, Mobile Menu, Footer, and Floating AI/WA Widget
    var SHARED_TEXT_EN = {
        // Navbar & Mobile Menu
        'Beranda': 'Home',
        'Tentang Kami': 'About Us',
        'Layanan IT': 'IT Services',
        'Jaringan LAN & Fiber Optic': 'LAN & Fiber Optic Network',
        'Wi-Fi Kantor & Heatmap Survey': 'Office Wi-Fi & Heatmap Survey',
        'Server, Data Center & Cloud': 'Server, Data Center & Cloud',
        'Firewall Security & VPN': 'Firewall Security & VPN',
        'IP CCTV & Smart Office': 'IP CCTV & Smart Office',
        'Managed IT & Maintenance': 'Managed IT & Maintenance',
        'Kalkulator BOQ': 'BOQ Calculator',
        'Portofolio': 'Portfolio',
        'Lainnya': 'More',
        'Ulasan & Testimoni Klien': 'Client Reviews & Testimonials',
        'Testimoni Klien': 'Client Testimonials',
        'Tanya Jawab (FAQ)': 'FAQ',
        'Tekno Game': 'Tekno Game',
        'Tekno AI & WhatsApp CS': 'Tekno AI & WhatsApp CS',
        'Konsultasi Gratis': 'Free Consultation',

        // Footer
        'Layanan Spesialis': 'Specialist Services',
        'Jasa Kabel LAN & Fiber Optic': 'LAN & Fiber Optic Cabling',
        'Wi-Fi Kantor & Heatmap': 'Office Wi-Fi & Heatmap',
        'Server & Data Center Setup': 'Server & Data Center Setup',
        'Firewall Fortinet & VPN': 'Fortinet Firewall & VPN',
        'IP CCTV & Door Access': 'IP CCTV & Door Access',
        'Navigasi': 'Navigation',
        'Kalkulator BOQ IT': 'IT BOQ Calculator',
        'Jadwalkan Site Survey': 'Schedule Site Survey',
        'Kantor & Kontak': 'Office & Contact',
        'Kebijakan Privasi': 'Privacy Policy',
        'Syarat & Ketentuan': 'Terms & Conditions',
        'PT Teknotama Prakarsa Mulia — Kontraktor infrastruktur IT Jakarta, jaringan Fiber Optic, Wi-Fi enterprise, managed server data center, & solusi cyber security enterprise.':
            'PT Teknotama Prakarsa Mulia — Enterprise IT infrastructure contractor in Jakarta, Fiber Optic networks, enterprise Wi-Fi, managed server data centers, & enterprise cybersecurity solutions.',

        // Floating Widget
        'Chat AI & CS': 'AI & CS Chat',
        'Tutup': 'Close',
        'Chat AI': 'AI Chat',
        'Mulai Konsultasi AI Engineer': 'Start AI Engineer Consultation',
        'Chat Langsung CS via WhatsApp': 'Direct CS Chat via WhatsApp',
        'Pusat Bantuan SOP Lapangan': 'Field SOP Help Center',
        '8 Panduan': '8 Guides',
        'Review Simulasi Kalkulator BOQ': 'Review BOQ Calculator Simulation',
        'Buka Kalkulator BOQ Teknis': 'Open Technical BOQ Calculator',
        'Hitung kebutuhan Switch PoE, Kabel & UPS': 'Calculate PoE Switch, Cabling & UPS needs',
        'Hubungi CS WA (Ketik: cs)': 'Contact WA CS (Type: cs)',
        'SOP Kabel & FO': 'Cabling & FO SOP',
        'Review BOQ': 'Review BOQ',
        'Ke Form': 'To Form'
    };

    var SELECTOR_EN = [
        {
            sel: '#widget-view-home h3.text-lg.font-extrabold.text-white',
            enHtml: 'Hello! How can we help? &#128075;'
        },
        {
            sel: '#widget-view-home p.text-\\[11px\\].text-slate-300',
            en: 'Instant consultation with our AI Field Engineer or connect directly to our official WhatsApp CS.'
        },
        {
            sel: '#widget-start-conversation span.block.text-\\[11px\\]',
            enHtml: 'Type <strong class="text-emerald-400">&quot;cs&quot;</strong> in chat to go straight to WhatsApp'
        },
        {
            sel: '#widget-help-search',
            attr: 'placeholder',
            en: 'Search SOP (TIA-568, FO, Fluke, SLA)...'
        },
        {
            sel: '#widget-chat-input',
            attr: 'placeholder',
            en: "Ask a technical question or type 'cs' for WhatsApp..."
        }
    ];

    function normalizeText(str) {
        return (str || '').replace(/\s+/g, ' ').trim();
    }

    function getSavedLang() {
        try {
            var params = new URLSearchParams(window.location.search);
            var urlLang = params.get('lang');
            if (urlLang === 'en' || urlLang === 'id') {
                localStorage.setItem(STORAGE_KEY, urlLang);
                return urlLang;
            }
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'en' || saved === 'id') return saved;
        } catch (e) {
            // ignore storage errors
        }
        return DEFAULT_LANG;
    }

    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // ignore
        }
    }

    function applySharedTextNodes(lang) {
        var containers = document.querySelectorAll('header.glass-nav, footer, #ai-widget-container');
        containers.forEach(function (root) {
            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            var node;
            while ((node = walker.nextNode())) {
                // Skip script/style or elements already handled by data-en
                var parent = node.parentElement;
                if (!parent) continue;
                if (parent.closest('[data-en], [data-en-html], .lang-switch-btn, #year')) continue;

                var raw = node.nodeValue;
                var norm = normalizeText(raw);
                if (!norm) continue;

                if (lang === 'en') {
                    if (SHARED_TEXT_EN[norm]) {
                        if (node._tktIdOrig === undefined) {
                            node._tktIdOrig = raw;
                        }
                        var leading = raw.match(/^\s*/)[0];
                        var trailing = raw.match(/\s*$/)[0];
                        node.nodeValue = leading + SHARED_TEXT_EN[norm] + trailing;
                    }
                } else {
                    if (node._tktIdOrig !== undefined) {
                        node.nodeValue = node._tktIdOrig;
                    }
                }
            }
        });

        // Selector-based shared elements (placeholders & rich HTML in widget)
        SELECTOR_EN.forEach(function (item) {
            var el = document.querySelector(item.sel);
            if (!el) return;
            if (item.attr === 'placeholder') {
                if (el.dataset.idOrigPlaceholder === undefined) {
                    el.dataset.idOrigPlaceholder = el.getAttribute('placeholder') || '';
                }
                el.setAttribute('placeholder', lang === 'en' ? item.en : el.dataset.idOrigPlaceholder);
            } else if (item.enHtml) {
                if (el.dataset.idOrigHtml === undefined) {
                    el.dataset.idOrigHtml = el.innerHTML;
                }
                el.innerHTML = lang === 'en' ? item.enHtml : el.dataset.idOrigHtml;
            } else if (item.en) {
                if (el.dataset.idOrigText === undefined) {
                    el.dataset.idOrigText = el.textContent;
                }
                el.textContent = lang === 'en' ? item.en : el.dataset.idOrigText;
            }
        });
    }

    function applyPageAttributes(lang) {
        // [data-en] -> textContent
        document.querySelectorAll('[data-en]').forEach(function (el) {
            if (el.dataset.idOrig === undefined) {
                el.dataset.idOrig = el.textContent;
            }
            el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.dataset.idOrig;
        });

        // [data-en-html] -> innerHTML
        document.querySelectorAll('[data-en-html]').forEach(function (el) {
            if (el.dataset.idOrigHtml === undefined) {
                el.dataset.idOrigHtml = el.innerHTML;
            }
            el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : el.dataset.idOrigHtml;
        });

        // [data-en-placeholder] -> placeholder
        document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
            if (el.dataset.idOrigPlaceholder === undefined) {
                el.dataset.idOrigPlaceholder = el.getAttribute('placeholder') || '';
            }
            el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-placeholder') : el.dataset.idOrigPlaceholder);
        });

        // [data-en-aria-label] -> aria-label
        document.querySelectorAll('[data-en-aria-label]').forEach(function (el) {
            if (el.dataset.idOrigAria === undefined) {
                el.dataset.idOrigAria = el.getAttribute('aria-label') || '';
            }
            el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-aria-label') : el.dataset.idOrigAria);
        });

        // Document title
        var titleMeta = document.querySelector('meta[name="i18n-title-en"]');
        if (titleMeta) {
            if (!document.documentElement.dataset.idOrigTitle) {
                document.documentElement.dataset.idOrigTitle = document.title;
            }
            document.title = lang === 'en'
                ? titleMeta.getAttribute('content')
                : document.documentElement.dataset.idOrigTitle;
        }
    }

    function updateToggleButtons(lang) {
        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
            var btnLang = btn.getAttribute('data-lang-btn');
            var isActive = btnLang === lang;
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) {
                btn.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
                btn.classList.remove('text-slate-500', 'hover:text-slate-900');
            } else {
                btn.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
                btn.classList.add('text-slate-500', 'hover:text-slate-900');
            }
        });
    }

    function applyLang(lang) {
        var target = (lang === 'en') ? 'en' : 'id';
        document.documentElement.setAttribute('lang', target);
        applyPageAttributes(target);
        applySharedTextNodes(target);
        updateToggleButtons(target);

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        try {
            document.dispatchEvent(new CustomEvent('teknotama:langchange', { detail: { lang: target } }));
        } catch (e) {
            // ignore
        }
    }

    function setLang(lang) {
        var target = (lang === 'en') ? 'en' : 'id';
        saveLang(target);
        applyLang(target);
    }

    function bindToggleButtons() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-lang-btn]');
            if (!btn) return;
            var lang = btn.getAttribute('data-lang-btn');
            setLang(lang);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindToggleButtons();
        var current = getSavedLang();
        // Always update toggle state; only mutate DOM if 'en' is active
        updateToggleButtons(current);
        if (current === 'en') {
            applyLang('en');
        }
    });

    window.TeknotamaI18n = {
        getLang: getSavedLang,
        setLang: setLang,
        applyLang: applyLang
    };
})();
