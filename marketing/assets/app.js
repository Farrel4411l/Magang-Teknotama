/**
 * Tekno AI Marketing - Frontend Controller (Vanilla ES6+)
 * Connects exclusively to ./api.php with CSRF verification & XSS-safe rendering.
 */
(function () {
    'use strict';

    const state = {
        user: null,
        csrfToken: '',
        business: {},
        leads: [],
        pricing: [],
        outbound: [],
        caseStudies: [],
        researchAccounts: [],
        rssFeeds: [],
        marketSignals: [],
        funnelStats: null,
        logs: [],
        users: [],
        quota: { sent_count: 0, daily_limit: 25, remaining: 25 },
        integrations: {},
        activeView: 'overview',
        selectedCaseId: '',
        selectedResearchId: ''
    };

    const VIEW_TITLES = {
        overview: 'Ringkasan & Monitoring RevOps',
        research: 'Riset & Prospek AI (Account Intelligence & RSS)',
        funnel: 'Marketing Funnel Analytics (TOFU → MOFU → BOFU)',
        leads: 'Lead Pipeline (Mini-CRM B2B)',
        outbound: 'Human-in-the-Loop Outbound Console',
        pricing: 'Master Harga Internal & Estimasi Cepat',
        casestudy: 'AI Case Study & Proposal Generator',
        settings: 'Integrasi Rp 0, Profil Modular, SOP & Logs'
    };

    function getCsrfToken() {
        if (state.csrfToken) {
            return state.csrfToken;
        }
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') || '' : '';
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatIdr(num) {
        const val = Number(num) || 0;
        return 'Rp ' + val.toLocaleString('id-ID');
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function trackEvent(eventName, label) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            portal_section: label || state.activeView
        });
    }

    let toastTimer = null;
    function showToast(msg, isError) {
        const box = document.getElementById('toast-container');
        if (!box) {
            return;
        }
        box.textContent = msg;
        box.classList.remove('hidden', 'border-red-500/60', 'border-emerald-500/60');
        box.classList.add(isError ? 'border-red-500/60' : 'border-emerald-500/60');
        if (toastTimer) {
            clearTimeout(toastTimer);
        }
        toastTimer = setTimeout(function () {
            box.classList.add('hidden');
        }, 3600);
    }

    async function apiGet(action) {
        const res = await fetch('./api.php?action=' + encodeURIComponent(action), {
            method: 'GET',
            credentials: 'same-origin'
        });
        if (res.status === 401) {
            window.location.href = './login.php';
            throw new Error('Unauthorized');
        }
        const data = await res.json();
        if (!res.ok || !data.ok) {
            throw new Error(data.error || 'Permintaan gagal (' + res.status + ')');
        }
        return data;
    }

    async function apiPost(action, payload) {
        const res = await fetch('./api.php?action=' + encodeURIComponent(action), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
            },
            body: JSON.stringify(payload || {})
        });
        if (res.status === 401) {
            window.location.href = './login.php';
            throw new Error('Unauthorized');
        }
        const data = await res.json();
        if (!res.ok || !data.ok) {
            throw new Error(data.error || 'Aksi gagal (' + res.status + ')');
        }
        return data;
    }

    function openModal(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('hidden');
            refreshIcons();
        }
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('hidden');
        }
    }

    function switchView(viewName) {
        if (!VIEW_TITLES[viewName]) {
            return;
        }
        state.activeView = viewName;
        document.querySelectorAll('.portal-view').forEach(function (sec) {
            sec.classList.toggle('hidden', sec.id !== 'view-' + viewName);
        });
        document.querySelectorAll('.nav-pill').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
        });
        const titleEl = document.getElementById('header-view-title');
        if (titleEl) {
            titleEl.textContent = VIEW_TITLES[viewName];
        }
        closeMobileSidebar();
        trackEvent('tkt_mkt_view_change', viewName);
        refreshIcons();
    }

    function openMobileSidebar() {
        const sb = document.getElementById('portal-sidebar');
        const bd = document.getElementById('mobile-sidebar-backdrop');
        if (sb) {
            sb.classList.remove('-translate-x-full');
        }
        if (bd) {
            bd.classList.remove('hidden');
        }
    }

    function closeMobileSidebar() {
        const sb = document.getElementById('portal-sidebar');
        const bd = document.getElementById('mobile-sidebar-backdrop');
        if (sb) {
            sb.classList.add('-translate-x-full');
        }
        if (bd) {
            bd.classList.add('hidden');
        }
    }

    /* ========================================================================
     * RENDERERS
     * ======================================================================== */

    function renderAll() {
        renderOverview();
        renderResearch();
        renderFunnel();
        renderLeadsTable();
        renderOutboundTable();
        renderPricingTable();
        renderCaseStudies();
        renderSettings();
        renderQuotaIndicators();
        refreshIcons();
    }

    function renderQuotaIndicators() {
        const q = state.quota || { sent_count: 0, daily_limit: 25 };
        const pct = Math.min(100, Math.round((q.sent_count / Math.max(1, q.daily_limit)) * 100));
        const label = q.sent_count + ' / ' + q.daily_limit;
        const sbLabel = document.getElementById('sidebar-quota-label');
        const sbBar = document.getElementById('sidebar-quota-bar');
        const outPill = document.getElementById('outbound-quota-pill');
        if (sbLabel) {
            sbLabel.textContent = label;
        }
        if (sbBar) {
            sbBar.style.width = pct + '%';
        }
        if (outPill) {
            outPill.textContent = label;
        }

        const badgeLeads = document.getElementById('badge-leads-count');
        const badgeOut = document.getElementById('badge-outbound-count');
        const badgeRes = document.getElementById('badge-research-count');
        if (badgeLeads) {
            badgeLeads.textContent = String(state.leads.length);
        }
        if (badgeOut) {
            badgeOut.textContent = String(state.outbound.length);
        }
        if (badgeRes) {
            badgeRes.textContent = String(state.researchAccounts.length);
        }
    }

    function renderOverview() {
        const leads = state.leads;
        const highCount = leads.filter(function (l) {
            return l.ai_score === 'High' || l.status === 'Site Survey';
        }).length;
        const wonCount = leads.filter(function (l) {
            return l.status === 'Won';
        }).length;
        const sentOut = state.outbound.filter(function (o) {
            return o.approval_status === 'Sent';
        }).length;

        document.getElementById('kpi-total-leads').textContent = String(leads.length);
        document.getElementById('kpi-high-leads').textContent = String(highCount);
        document.getElementById('kpi-won-leads').textContent = String(wonCount);
        document.getElementById('kpi-outbound-sent').textContent = String(sentOut);

        const today = new Date().toISOString().slice(0, 10);
        const dueLeads = leads.filter(function (l) {
            return l.status !== 'Won' && l.status !== 'Lost' && (!l.next_followup_at || l.next_followup_at <= today);
        }).slice(0, 6);

        const dueBox = document.getElementById('overview-followup-list');
        if (!dueBox) {
            return;
        }
        if (dueLeads.length === 0) {
            dueBox.innerHTML = '<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-center">Belum ada antrean follow-up yang jatuh tempo. Tambahkan lead baru di tab Lead Pipeline.</div>';
        } else {
            dueBox.innerHTML = dueLeads.map(function (l) {
                return '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">'
                    + '<div class="min-w-0">'
                    + '<span class="block font-bold text-slate-900 truncate">' + escapeHtml(l.company_name) + ' (' + escapeHtml(l.pic_name) + ')</span>'
                    + '<span class="block text-[11px] text-slate-500 truncate">' + escapeHtml(l.service_category) + ' &bull; Target: ' + escapeHtml(l.next_followup_at || 'Hari ini') + '</span>'
                    + '</div>'
                    + '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-[#d9141d] border border-red-200 flex-shrink-0">' + escapeHtml(l.status) + '</span>'
                    + '</div>';
            }).join('');
        }

        const intInfo = state.integrations || {};
        const aiAny = Boolean(intInfo.ai_groq_ready || intInfo.ai_gemini_ready || intInfo.ai_openrouter_ready);
        const aiPill = document.getElementById('ai-engine-pill');
        if (aiPill) {
            aiPill.innerHTML = '<span class="w-2 h-2 rounded-full ' + (aiAny ? 'bg-emerald-500' : 'bg-amber-500') + '"></span>'
                + '<span>' + (aiAny ? 'Cloud AI + Fallback Aktif' : 'Local AI Engine Aktif') + '</span>';
        }

        const statusBox = document.getElementById('overview-integration-badges');
        if (statusBox) {
            const rows = [
                { label: 'Server AI Secrets (Groq/Gemini/OpenRouter)', ok: aiAny, note: aiAny ? 'Siap (Server-Side)' : 'Fallback Lokal Aktif' },
                { label: 'Storage Flat-File JSON (.htaccess 403)', ok: true, note: 'Aktif & Siap Ekspor CSV' },
                { label: 'Telegram Bot Error Alerting', ok: Boolean(intInfo.telegram_configured), note: intInfo.telegram_configured ? 'Terhubung' : 'Opsional (Belum diisi)' },
                { label: 'Google Apps Script Sheets Sync', ok: Boolean(intInfo.gas_configured), note: intInfo.gas_configured ? 'Terhubung' : 'Opsional (Pakai Ekspor CSV)' }
            ];
            statusBox.innerHTML = rows.map(function (r) {
                return '<div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">'
                    + '<span class="font-semibold text-slate-700">' + escapeHtml(r.label) + '</span>'
                    + '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold ' + (r.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200/70 text-slate-600') + '">' + escapeHtml(r.note) + '</span>'
                    + '</div>';
            }).join('');
        }
    }

    function renderLeadsTable() {
        const tbody = document.getElementById('leads-table-body');
        if (!tbody) {
            return;
        }
        const query = (document.getElementById('leads-search').value || '').toLowerCase().trim();
        const statusFilter = document.getElementById('leads-status-filter').value || 'all';

        const filtered = state.leads.filter(function (l) {
            if (statusFilter !== 'all' && l.status !== statusFilter) {
                return false;
            }
            if (!query) {
                return true;
            }
            const text = (l.company_name + ' ' + l.pic_name + ' ' + l.location + ' ' + l.service_category).toLowerCase();
            return text.indexOf(query) !== -1;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-500">Belum ada data lead B2B yang cocok. Klik <strong>Tambah Lead Baru</strong> untuk memulai.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(function (l) {
            const scoreBadge = l.ai_score === 'High'
                ? 'bg-red-50 text-[#d9141d] border-red-200'
                : (l.ai_score === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200');
            const sourceBadge = l.source === 'web_booking'
                ? ' <span class="ml-1 inline-flex px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold uppercase align-middle">Web</span>'
                : '';
            return '<tr class="hover:bg-slate-50/70">'
                + '<td class="py-3 px-4 align-top">'
                + '<span class="block font-extrabold text-slate-950">' + escapeHtml(l.company_name) + sourceBadge + '</span>'
                + '<span class="block text-[11px] text-slate-500">' + escapeHtml(l.pic_name) + ' &bull; ' + escapeHtml(l.email || l.whatsapp) + '</span>'
                + '</td>'
                + '<td class="py-3 px-4 align-top">'
                + '<span class="block font-semibold text-slate-800">' + escapeHtml(l.service_category) + '</span>'
                + '<span class="block text-[11px] text-slate-500">' + escapeHtml(l.location) + '</span>'
                + '</td>'
                + '<td class="py-3 px-4 align-top">'
                + '<span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ' + scoreBadge + '">' + escapeHtml(l.ai_score || 'Medium') + ' (' + escapeHtml(l.score_numeric || 50) + ')</span>'
                + '</td>'
                + '<td class="py-3 px-4 align-top">'
                + '<span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">' + escapeHtml(l.status) + '</span>'
                + '</td>'
                + '<td class="py-3 px-4 align-top text-[11px] text-slate-600">' + escapeHtml(l.next_followup_at || '-') + '</td>'
                + '<td class="py-3 px-4 align-top text-right whitespace-nowrap space-x-1">'
                + '<button type="button" data-action="lead-ai" data-id="' + escapeHtml(l.lead_id) + '" class="px-2.5 py-1.5 rounded-lg bg-[#090d16] hover:bg-[#d9141d] text-white text-[11px] font-bold transition-colors">AI Score &amp; Balas</button>'
                + '<button type="button" data-action="lead-edit" data-id="' + escapeHtml(l.lead_id) + '" class="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold">Edit</button>'
                + '<button type="button" data-action="lead-delete" data-id="' + escapeHtml(l.lead_id) + '" class="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold">Hapus</button>'
                + '</td>'
                + '</tr>';
        }).join('');
    }

    function renderOutboundTable() {
        const tbody = document.getElementById('outbound-table-body');
        if (!tbody) {
            return;
        }
        if (state.outbound.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-slate-500">Belum ada daftar target outbound. Klik <strong>Tambah Prospek</strong> untuk menyusun daftar prospecting B2B.</td></tr>';
            return;
        }
        tbody.innerHTML = state.outbound.map(function (o) {
            const stClass = o.approval_status === 'Sent'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : (o.approval_status === 'Ready Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200');
            return '<tr class="hover:bg-slate-50/70">'
                + '<td class="py-3 px-4 align-top"><span class="block font-extrabold text-slate-950">' + escapeHtml(o.company_name) + '</span><span class="block text-[11px] text-slate-500">' + escapeHtml(o.pic_name) + ' (' + escapeHtml(o.pic_role) + ') &bull; ' + escapeHtml(o.email) + '</span></td>'
                + '<td class="py-3 px-4 align-top font-semibold text-slate-700">' + escapeHtml(o.segment) + '</td>'
                + '<td class="py-3 px-4 align-top text-slate-600">' + escapeHtml(o.trigger_signal) + '</td>'
                + '<td class="py-3 px-4 align-top"><span class="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ' + stClass + '">' + escapeHtml(o.approval_status || 'Draft') + '</span></td>'
                + '<td class="py-3 px-4 align-top text-right whitespace-nowrap space-x-1">'
                + '<button type="button" data-action="out-ai" data-id="' + escapeHtml(o.prospect_id) + '" class="px-2.5 py-1.5 rounded-lg bg-[#090d16] hover:bg-[#d9141d] text-white text-[11px] font-bold transition-colors">Draf AI</button>'
                + (o.ai_draft_body ? '<button type="button" data-action="out-review" data-id="' + escapeHtml(o.prospect_id) + '" class="px-2.5 py-1.5 rounded-lg bg-[#d9141d] hover:bg-[#b50e16] text-white text-[11px] font-bold">Review &amp; Kirim</button>' : '')
                + '<button type="button" data-action="out-delete" data-id="' + escapeHtml(o.prospect_id) + '" class="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold">Hapus</button>'
                + '</td>'
                + '</tr>';
        }).join('');
    }

    function renderPricingTable() {
        const tbody = document.getElementById('pricing-table-body');
        const estList = document.getElementById('estimator-inputs-list');
        if (!tbody || !estList) {
            return;
        }

        if (state.pricing.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="py-8 text-center text-slate-500">Daftar harga masih kosong. Klik <strong>Muat Template (Rp 0)</strong> atau <strong>+ Item Harga</strong> untuk mengisi tarif aktual Teknotama.</td></tr>';
            estList.innerHTML = '<p class="text-xs text-slate-400">Tambahkan item di Master Harga terlebih dahulu.</p>';
            return;
        }

        tbody.innerHTML = state.pricing.map(function (p) {
            return '<tr class="hover:bg-slate-50/70">'
                + '<td class="py-2.5 px-3"><span class="block font-bold text-slate-900">' + escapeHtml(p.item_name) + '</span><span class="block text-[10px] font-mono text-slate-500">' + escapeHtml(p.item_code) + ' &bull; ' + escapeHtml(p.category) + '</span></td>'
                + '<td class="py-2.5 px-3 text-slate-600">' + escapeHtml(p.unit) + '</td>'
                + '<td class="py-2.5 px-3 font-semibold text-slate-800">' + escapeHtml(formatIdr(p.min_price_idr) + ' - ' + formatIdr(p.max_price_idr)) + '</td>'
                + '<td class="py-2.5 px-3 text-right whitespace-nowrap space-x-1">'
                + '<button type="button" data-action="prc-edit" data-code="' + escapeHtml(p.item_code) + '" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold">Edit</button>'
                + '<button type="button" data-action="prc-delete" data-code="' + escapeHtml(p.item_code) + '" class="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold">Hapus</button>'
                + '</td>'
                + '</tr>';
        }).join('');

        estList.innerHTML = state.pricing.map(function (p) {
            return '<div class="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2">'
                + '<div class="min-w-0">'
                + '<span class="block text-xs font-bold text-white truncate">' + escapeHtml(p.item_name) + '</span>'
                + '<span class="block text-[10px] text-slate-400">' + escapeHtml(formatIdr(p.min_price_idr) + ' - ' + formatIdr(p.max_price_idr)) + ' / ' + escapeHtml(p.unit) + '</span>'
                + '</div>'
                + '<input type="number" min="0" value="0" data-est-code="' + escapeHtml(p.item_code) + '" class="w-20 px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-white text-right">'
                + '</div>';
        }).join('');
    }

    function renderCaseStudies() {
        const listEl = document.getElementById('casestudy-history-list');
        const previewEl = document.getElementById('casestudy-preview-box');
        if (!listEl || !previewEl) {
            return;
        }

        if (state.caseStudies.length === 0) {
            listEl.innerHTML = '';
            previewEl.innerHTML = '<p class="text-slate-500">Belum ada studi kasus tersimpan. Isi formulir 3 menit di sebelah kiri untuk membuat draf studi kasus &amp; proposal AI pertama.</p>';
            return;
        }

        const current = state.caseStudies.find(function (c) {
            return c.case_id === state.selectedCaseId;
        }) || state.caseStudies[0];
        state.selectedCaseId = current.case_id;

        previewEl.innerHTML = '<div class="space-y-4">'
            + '<div class="border-b border-slate-200 pb-3">'
            + '<span class="text-[10px] font-bold uppercase tracking-wider text-[#d9141d]">' + escapeHtml(current.industry) + ' &bull; ' + escapeHtml(current.created_at) + '</span>'
            + '<h3 class="text-base font-extrabold text-slate-950 mt-0.5">' + escapeHtml(current.project_title) + '</h3>'
            + '</div>'
            + '<div>'
            + '<div class="flex items-center justify-between mb-1"><strong class="text-slate-900">1. Draf Artikel Studi Kasus (SEO)</strong><button type="button" data-action="copy-text" data-target="cs-article-raw" class="text-[11px] font-bold text-[#d9141d] hover:underline no-print">Salin Artikel</button></div>'
            + '<pre id="cs-article-raw" class="whitespace-pre-wrap font-sans bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 leading-relaxed">' + escapeHtml(current.seo_article_draft) + '</pre>'
            + '</div>'
            + '<div>'
            + '<div class="flex items-center justify-between mb-1"><strong class="text-slate-900">2. Outline Proposal / Portofolio</strong><button type="button" data-action="copy-text" data-target="cs-proposal-raw" class="text-[11px] font-bold text-[#d9141d] hover:underline no-print">Salin Proposal</button></div>'
            + '<pre id="cs-proposal-raw" class="whitespace-pre-wrap font-sans bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 leading-relaxed">' + escapeHtml(current.proposal_outline) + '</pre>'
            + '</div>'
            + '</div>';

        listEl.innerHTML = state.caseStudies.map(function (c) {
            const active = c.case_id === current.case_id;
            return '<div class="tkt-card rounded-xl p-3 flex items-center justify-between gap-2 ' + (active ? 'border-[#d9141d]' : '') + '">'
                + '<button type="button" data-action="cs-select" data-id="' + escapeHtml(c.case_id) + '" class="text-left min-w-0 flex-1">'
                + '<span class="block text-xs font-bold text-slate-900 truncate">' + escapeHtml(c.project_title) + '</span>'
                + '<span class="block text-[10px] text-slate-500">' + escapeHtml(c.industry) + ' &bull; ' + escapeHtml(c.created_at) + '</span>'
                + '</button>'
                + '<button type="button" data-action="cs-delete" data-id="' + escapeHtml(c.case_id) + '" class="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold">Hapus</button>'
                + '</div>';
        }).join('');
    }

    function renderSettings() {
        const b = state.business || {};
        document.getElementById('biz-company').value = b.company_name || '';
        document.getElementById('biz-short').value = b.brand_short || '';
        document.getElementById('biz-email').value = b.official_email || '';
        document.getElementById('biz-wa').value = b.official_whatsapp || '';
        document.getElementById('biz-services').value = b.services_summary || '';
        document.getElementById('biz-value').value = b.value_proposition || '';

        const headerComp = document.getElementById('header-company-name');
        const sbBrand = document.getElementById('sidebar-brand-sub');
        if (headerComp) {
            headerComp.textContent = (b.company_name || 'PT Teknotama Prakarsa Mulia') + ' • Stack Rp 0';
        }
        if (sbBrand) {
            sbBrand.textContent = b.brand_short || 'Teknotama';
        }

        const intInfo = state.integrations || {};
        document.getElementById('int-tg-chat').value = intInfo.telegram_chat_id || '';
        document.getElementById('int-gas-url').value = intInfo.gas_webhook_url || '';
        document.getElementById('int-daily-limit').value = intInfo.outbound_daily_limit || 25;

        const isAdmin = state.user && state.user.role === 'admin';
        const usersCard = document.getElementById('users-management-card');
        if (usersCard) {
            usersCard.classList.toggle('hidden', !isAdmin);
        }
        const usersList = document.getElementById('users-list-box');
        if (usersList && isAdmin) {
            usersList.innerHTML = (state.users || []).map(function (u) {
                return '<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">'
                    + '<div><span class="font-bold text-slate-900">' + escapeHtml(u.full_name) + '</span> <span class="text-slate-500">(@' + escapeHtml(u.username) + ' &bull; ' + escapeHtml(u.role) + ')</span></div>'
                    + '<button type="button" data-action="user-toggle" data-id="' + escapeHtml(u.user_id) + '" class="px-2.5 py-1 rounded-lg text-[10px] font-bold ' + (u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600') + '">' + (u.active ? 'Aktif' : 'Nonaktif') + '</button>'
                    + '</div>';
            }).join('');
        }

        const logsBox = document.getElementById('system-logs-list');
        if (logsBox) {
            if (!state.logs || state.logs.length === 0) {
                logsBox.innerHTML = '<p class="text-slate-500">Belum ada catatan aktivitas.</p>';
            } else {
                logsBox.innerHTML = state.logs.map(function (lg) {
                    const lvlClass = lg.level === 'ERROR'
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : (lg.level === 'WARN' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-50 border-slate-200');
                    return '<div class="p-2 rounded-lg border ' + lvlClass + '">'
                        + '<span class="font-mono font-bold">[' + escapeHtml(lg.level) + ']</span> '
                        + '<span class="font-semibold">' + escapeHtml(lg.module) + '</span>: '
                        + escapeHtml(lg.message)
                        + ' <span class="text-[10px] opacity-75">(' + escapeHtml(lg.created_at) + ' oleh ' + escapeHtml(lg.actor) + ')</span>'
                        + '</div>';
                }).join('');
            }
        }
    }

    function renderResearch() {
        const detailBox = document.getElementById('research-detail-body');
        const listBox = document.getElementById('research-accounts-list');
        const feedsBox = document.getElementById('rss-feeds-list');
        const signalsBox = document.getElementById('market-signals-list');
        if (!detailBox || !listBox || !feedsBox || !signalsBox) {
            return;
        }

        const q = (document.getElementById('research-search').value || '').toLowerCase().trim();
        const filtered = state.researchAccounts.filter(function (r) {
            if (!q) { return true; }
            return (r.company_name + ' ' + r.industry + ' ' + r.website_url).toLowerCase().indexOf(q) !== -1;
        });

        const selected = state.researchAccounts.find(function (r) {
            return r.research_id === state.selectedResearchId;
        }) || state.researchAccounts[0] || null;
        if (selected) {
            state.selectedResearchId = selected.research_id;
        }

        if (!selected) {
            detailBox.innerHTML = '<p class="text-slate-500">Belum ada perusahaan diriset. Masukkan Nama &amp; Website Perusahaan target di panel sebelah kiri untuk memulai riset otomatis.</p>';
        } else {
            const tierBadge = selected.icp_score >= 75
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : (selected.icp_score >= 55 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200');
            const emailsHtml = (selected.emails_found || []).length
                ? selected.emails_found.map(function (em) { return '<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">' + escapeHtml(em) + '</span>'; }).join(' ')
                : '<span class="text-slate-400">Tidak ditemukan di halaman publik</span>';
            const phonesHtml = (selected.phones_found || []).length
                ? selected.phones_found.map(function (ph) { return '<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px]">' + escapeHtml(ph) + '</span>'; }).join(' ')
                : '<span class="text-slate-400">-</span>';
            const locHtml = (selected.locations_found || []).length ? selected.locations_found.join(', ') : '-';

            detailBox.innerHTML = '<div class="space-y-3.5">'
                + '<div class="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">'
                + '<div><span class="text-[10px] font-bold uppercase text-slate-500">' + escapeHtml(selected.industry) + ' &bull; ' + escapeHtml(selected.crawl_note) + '</span>'
                + '<h3 class="text-base font-extrabold text-slate-950">' + escapeHtml(selected.company_name) + '</h3>'
                + (selected.website_url ? '<a href="' + escapeHtml(selected.website_url) + '" target="_blank" rel="noopener noreferrer" class="text-[11px] text-[#d9141d] hover:underline break-all">' + escapeHtml(selected.website_url) + '</a>' : '')
                + '</div>'
                + '<span class="px-3 py-1 rounded-full text-xs font-extrabold border ' + tierBadge + '">ICP ' + escapeHtml(selected.icp_score) + '/100 (' + escapeHtml(selected.icp_tier) + ')</span>'
                + '</div>'
                + '<p class="text-slate-700 leading-relaxed">' + escapeHtml(selected.company_summary) + '</p>'
                + '<div class="grid sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3">'
                + '<div><span class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Publik Terdeteksi</span><div class="flex flex-wrap gap-1">' + emailsHtml + '</div></div>'
                + '<div><span class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Telepon / Lokasi Terdeteksi</span><div class="flex flex-wrap gap-1 mb-1">' + phonesHtml + '</div><span class="text-[11px] text-slate-600">' + escapeHtml(locHtml) + '</span></div>'
                + '</div>'
                + '<div><strong class="block text-slate-900 mb-1">Sinyal Kebutuhan Infrastruktur IT:</strong><ul class="list-disc ml-4 space-y-1 text-slate-700">'
                + (selected.it_infrastructure_signals || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('')
                + '</ul></div>'
                + '<div class="grid sm:grid-cols-2 gap-3">'
                + '<div class="p-3 rounded-xl bg-red-50/60 border border-red-200/80"><strong class="block text-[11px] text-[#d9141d] mb-1">Target Decision Maker</strong><span class="text-slate-800">' + escapeHtml((selected.decision_maker_roles || []).join(', ')) + '</span></div>'
                + '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200"><strong class="block text-[11px] text-slate-900 mb-1">Penawaran Pembuka</strong><span class="text-slate-700">' + escapeHtml(selected.recommended_entry_offer) + '</span></div>'
                + '</div>'
                + '<div class="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs"><strong class="text-red-400">Strategi Pendekatan:</strong> ' + escapeHtml(selected.approach_strategy) + '</div>'
                + '<div class="flex flex-wrap gap-2 pt-1">'
                + '<button type="button" data-action="res-promote-out" data-id="' + escapeHtml(selected.research_id) + '" class="px-3.5 py-2 rounded-xl bg-[#d9141d] hover:bg-[#b50e16] text-white text-xs font-bold">Promosikan ke Outbound (Auto-Draf)</button>'
                + '<button type="button" data-action="res-promote-lead" data-id="' + escapeHtml(selected.research_id) + '" class="px-3.5 py-2 rounded-xl bg-[#090d16] hover:bg-slate-800 text-white text-xs font-bold">Masukkan ke Lead Pipeline</button>'
                + '<button type="button" data-action="res-reanalyze" data-id="' + escapeHtml(selected.research_id) + '" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold">Analisa Ulang</button>'
                + '</div>'
                + '</div>';
        }

        if (filtered.length === 0) {
            listBox.innerHTML = '<p class="text-xs text-slate-500 py-4 text-center">Belum ada perusahaan dalam daftar riset.</p>';
        } else {
            listBox.innerHTML = filtered.map(function (r) {
                const isSel = selected && r.research_id === selected.research_id;
                return '<div class="p-3 rounded-xl border flex items-center justify-between gap-2 ' + (isSel ? 'border-[#d9141d] bg-red-50/30' : 'border-slate-200 bg-white') + '">'
                    + '<button type="button" data-action="res-select" data-id="' + escapeHtml(r.research_id) + '" class="text-left min-w-0 flex-1">'
                    + '<span class="block text-xs font-extrabold text-slate-950 truncate">' + escapeHtml(r.company_name) + ' <span class="font-mono text-[10px] text-[#d9141d]">(ICP ' + escapeHtml(r.icp_score) + ')</span></span>'
                    + '<span class="block text-[11px] text-slate-500 truncate">' + escapeHtml(r.industry) + ' &bull; ' + escapeHtml(r.status) + '</span>'
                    + '</button>'
                    + '<button type="button" data-action="res-delete" data-id="' + escapeHtml(r.research_id) + '" class="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold">Hapus</button>'
                    + '</div>';
            }).join('');
        }

        feedsBox.innerHTML = state.rssFeeds.length === 0
            ? '<p class="text-[11px] text-slate-400">Belum ada feed RSS tersimpan.</p>'
            : state.rssFeeds.map(function (f) {
                return '<div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">'
                    + '<div class="min-w-0"><span class="block font-bold text-slate-800 truncate">' + escapeHtml(f.label) + '</span><span class="block text-[10px] text-slate-500 truncate">' + escapeHtml(f.feed_url) + '</span></div>'
                    + '<button type="button" data-action="rss-delete" data-id="' + escapeHtml(f.feed_id) + '" class="px-2 py-1 rounded bg-red-50 text-red-700 text-[10px] font-bold">Hapus</button>'
                    + '</div>';
            }).join('');

        signalsBox.innerHTML = state.marketSignals.length === 0
            ? '<p class="text-slate-500 py-3 text-center">Belum ada sinyal pasar. Tambahkan URL RSS Google Alerts lalu klik <strong>Scan Sekarang</strong>.</p>'
            : state.marketSignals.map(function (s) {
                return '<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">'
                    + '<div class="flex items-start justify-between gap-2">'
                    + '<a href="' + escapeHtml(s.link || '#') + '" target="_blank" rel="noopener noreferrer" class="font-bold text-slate-950 hover:text-[#d9141d]">' + escapeHtml(s.title) + '</a>'
                    + '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">Relevansi ' + escapeHtml(s.relevance_score) + '</span>'
                    + '</div>'
                    + '<p class="text-[11px] text-slate-600">' + escapeHtml(s.summary) + '</p>'
                    + '<div class="flex flex-wrap items-center justify-between gap-2 pt-1">'
                    + '<span class="text-[10px] text-slate-500">' + escapeHtml(s.source_label) + ' &bull; ' + escapeHtml(s.published_at) + ((s.matched_keywords || []).length ? ' &bull; Kata kunci: ' + escapeHtml(s.matched_keywords.join(', ')) : '') + '</span>'
                    + '<div class="space-x-1">'
                    + '<button type="button" data-action="sig-analyze" data-id="' + escapeHtml(s.signal_id) + '" class="px-2.5 py-1 rounded-lg bg-[#090d16] hover:bg-[#d9141d] text-white text-[10px] font-bold">Riset Perusahaan</button>'
                    + '<button type="button" data-action="sig-delete" data-id="' + escapeHtml(s.signal_id) + '" class="px-2 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold">Hapus</button>'
                    + '</div></div></div>';
            }).join('');
    }

    function renderFunnel() {
        const fs = state.funnelStats;
        if (!fs) {
            return;
        }
        const conv = fs.conversions || {};
        document.getElementById('funnel-rate-qualified').textContent = (conv.lead_to_qualified_pct || 0) + '%';
        document.getElementById('funnel-rate-survey').textContent = (conv.lead_to_survey_pct || 0) + '%';
        document.getElementById('funnel-rate-quote').textContent = (conv.survey_to_quote_pct || 0) + '%';
        document.getElementById('funnel-rate-won').textContent = (conv.lead_to_won_pct || 0) + '%';

        const traffic = fs.traffic || {};
        document.getElementById('fn-web-visits').value = traffic.web_visits || 0;
        document.getElementById('fn-boq-uses').value = traffic.boq_calculator_uses || 0;
        document.getElementById('fn-period').value = traffic.period_label || 'Bulan Berjalan';

        const stages = fs.stages || [];
        const maxVal = Math.max(1, Math.max.apply(null, stages.map(function (s) { return Number(s.count) || 0; })));
        const barsBox = document.getElementById('funnel-stages-bars');
        barsBox.innerHTML = stages.map(function (st) {
            const pct = Math.max(4, Math.round(((Number(st.count) || 0) / maxVal) * 100));
            const zoneBadge = st.zone === 'TOFU'
                ? 'bg-slate-100 text-slate-700'
                : (st.zone === 'MOFU' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-[#d9141d]');
            return '<div class="space-y-1">'
                + '<div class="flex items-center justify-between gap-2">'
                + '<span><span class="px-1.5 py-0.5 rounded text-[9px] font-bold mr-1.5 ' + zoneBadge + '">' + escapeHtml(st.zone) + '</span><strong class="text-slate-900">' + escapeHtml(st.label) + '</strong></span>'
                + '<span class="font-extrabold text-slate-950">' + escapeHtml(st.count) + (st.sub ? ' <span class="text-[10px] font-normal text-slate-500">(' + escapeHtml(st.sub) + ')</span>' : '') + '</span>'
                + '</div>'
                + '<div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-[#d9141d] rounded-full transition-all" style="width:' + pct + '%;"></div></div>'
                + '</div>';
        }).join('');

        const srcBox = document.getElementById('funnel-source-breakdown');
        const sc = fs.source_counts || {};
        srcBox.innerHTML = [
            { label: 'Form Website (kontak.html)', val: sc.web_booking || 0 },
            { label: 'Riset AI / Outbound', val: sc.research_ai || 0 },
            { label: 'Input Manual Sales', val: sc.manual || 0 }
        ].map(function (row) {
            return '<div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"><span class="text-slate-700">' + escapeHtml(row.label) + '</span><strong class="text-slate-950">' + escapeHtml(row.val) + '</strong></div>';
        }).join('');

        const svcBox = document.getElementById('funnel-service-breakdown');
        const svcEntries = Object.entries(fs.service_counts || {});
        svcBox.innerHTML = svcEntries.length === 0
            ? '<p class="text-slate-400">Belum ada distribusi layanan.</p>'
            : svcEntries.map(function (pair) {
                return '<div class="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"><span class="text-slate-700 truncate pr-2">' + escapeHtml(pair[0]) + '</span><strong class="text-slate-950">' + escapeHtml(pair[1]) + '</strong></div>';
            }).join('');
    }

    async function loadBootstrap() {
        const data = await apiGet('bootstrap');
        state.user = data.user;
        state.csrfToken = data.csrf_token;
        state.business = data.business || {};
        state.leads = data.leads || [];
        state.pricing = data.pricing || [];
        state.outbound = data.outbound || [];
        state.caseStudies = data.case_studies || [];
        state.researchAccounts = data.research_accounts || [];
        state.rssFeeds = data.rss_feeds || [];
        state.marketSignals = data.market_signals || [];
        state.funnelStats = data.funnel_stats || null;
        state.logs = data.logs || [];
        state.users = data.users || [];
        state.quota = data.quota || state.quota;
        state.integrations = data.integrations || {};
        renderAll();
    }

    /* ========================================================================
     * EVENT HANDLERS
     * ======================================================================== */

    function bindEvents() {
        document.querySelectorAll('.nav-pill').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchView(btn.getAttribute('data-view'));
            });
        });

        document.querySelectorAll('[data-jump-view]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchView(btn.getAttribute('data-jump-view'));
            });
        });

        document.getElementById('mobile-sidebar-open').addEventListener('click', openMobileSidebar);
        document.getElementById('mobile-sidebar-close').addEventListener('click', closeMobileSidebar);
        document.getElementById('mobile-sidebar-backdrop').addEventListener('click', closeMobileSidebar);

        document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                closeModal(btn.getAttribute('data-close-modal'));
            });
        });

        document.getElementById('leads-search').addEventListener('input', renderLeadsTable);
        document.getElementById('leads-status-filter').addEventListener('change', renderLeadsTable);

        document.getElementById('btn-open-add-lead').addEventListener('click', function () {
            document.getElementById('modal-lead-title').textContent = 'Tambah Lead B2B';
            document.getElementById('lead-form').reset();
            document.getElementById('lead-id').value = '';
            openModal('modal-lead');
        });

        document.getElementById('lead-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('lead_save', {
                    lead_id: document.getElementById('lead-id').value,
                    company_name: document.getElementById('lead-company').value,
                    pic_name: document.getElementById('lead-pic').value,
                    email: document.getElementById('lead-email').value,
                    whatsapp: document.getElementById('lead-wa').value,
                    location: document.getElementById('lead-location').value,
                    service_category: document.getElementById('lead-service').value,
                    status: document.getElementById('lead-status').value,
                    next_followup_at: document.getElementById('lead-followup').value,
                    boq_summary: document.getElementById('lead-boq').value,
                    notes: document.getElementById('lead-notes').value
                });
                closeModal('modal-lead');
                await loadBootstrap();
                showToast('Lead berhasil disimpan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-lead-send-approved-email').addEventListener('click', async function () {
            const leadId = document.getElementById('ai-lead-id').value;
            const subject = document.getElementById('ai-lead-email-subject').value;
            const body = document.getElementById('ai-lead-email-body').value;
            try {
                await apiPost('lead_send_email', { lead_id: leadId, subject: subject, body: body });
                closeModal('modal-lead-ai');
                await loadBootstrap();
                showToast('Email penawaran berhasil dikirim.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('ai-lead-wa-draft').addEventListener('input', function () {
            const leadId = document.getElementById('ai-lead-id').value;
            const lead = state.leads.find(function (x) { return x.lead_id === leadId; });
            const waBtn = document.getElementById('btn-lead-open-wa');
            if (lead && waBtn) {
                const digits = String(lead.whatsapp || '').replace(/\D+/g, '');
                const norm = digits.startsWith('0') ? ('62' + digits.slice(1)) : (digits.startsWith('62') ? digits : (digits ? '62' + digits : ''));
                waBtn.href = norm ? ('https://wa.me/' + norm + '?text=' + encodeURIComponent(this.value)) : '#';
            }
        });

        document.getElementById('btn-open-add-outbound').addEventListener('click', function () {
            document.getElementById('outbound-form').reset();
            document.getElementById('out-id').value = '';
            openModal('modal-outbound');
        });

        document.getElementById('outbound-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('outbound_save', {
                    prospect_id: document.getElementById('out-id').value,
                    segment: document.getElementById('out-segment').value,
                    company_name: document.getElementById('out-company').value,
                    pic_name: document.getElementById('out-pic').value,
                    pic_role: document.getElementById('out-role').value,
                    email: document.getElementById('out-email').value,
                    whatsapp: document.getElementById('out-wa').value,
                    trigger_signal: document.getElementById('out-trigger').value
                });
                closeModal('modal-outbound');
                await loadBootstrap();
                showToast('Target outbound disimpan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-outbound-send-approved').addEventListener('click', async function () {
            try {
                await apiPost('outbound_send_approved', {
                    prospect_id: document.getElementById('rev-out-id').value,
                    subject: document.getElementById('rev-out-subject').value,
                    body: document.getElementById('rev-out-body').value
                });
                closeModal('modal-outbound-review');
                trackEvent('tkt_mkt_outbound_sent', 'outbound');
                await loadBootstrap();
                showToast('Email outbound human-approved terkirim.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-load-pricing-starter').addEventListener('click', async function () {
            try {
                await apiPost('pricing_load_starter', {});
                await loadBootstrap();
                showToast('Template kategori standar (Rp 0) berhasil dimuat.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-open-add-pricing').addEventListener('click', function () {
            document.getElementById('pricing-form').reset();
            document.getElementById('prc-code').readOnly = false;
            openModal('modal-pricing');
        });

        document.getElementById('pricing-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('pricing_save', {
                    item_code: document.getElementById('prc-code').value,
                    item_name: document.getElementById('prc-name').value,
                    category: document.getElementById('prc-category').value,
                    unit: document.getElementById('prc-unit').value,
                    min_price_idr: Number(document.getElementById('prc-min').value || 0),
                    max_price_idr: Number(document.getElementById('prc-max').value || 0),
                    spec_notes: document.getElementById('prc-notes').value,
                    is_active: true
                });
                closeModal('modal-pricing');
                await loadBootstrap();
                showToast('Item Master Harga disimpan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-run-internal-estimate').addEventListener('click', async function () {
            const quantities = {};
            document.querySelectorAll('[data-est-code]').forEach(function (inp) {
                const qty = parseInt(inp.value, 10) || 0;
                if (qty > 0) {
                    quantities[inp.getAttribute('data-est-code')] = qty;
                }
            });
            try {
                const res = await apiPost('estimate_calculate', { quantities: quantities });
                const box = document.getElementById('estimator-result-box');
                const rangeText = document.getElementById('estimator-range-text');
                const bdList = document.getElementById('estimator-breakdown-list');
                box.classList.remove('hidden');
                rangeText.textContent = formatIdr(res.total_min_idr) + ' — ' + formatIdr(res.total_max_idr);
                bdList.innerHTML = (res.breakdown || []).map(function (b) {
                    return '<li>&bull; ' + escapeHtml(b.item_name) + ' (' + b.qty + ' ' + escapeHtml(b.unit) + '): ' + escapeHtml(formatIdr(b.sub_min) + ' - ' + formatIdr(b.sub_max)) + '</li>';
                }).join('') || '<li>Pilih minimal 1 kuantitas item di atas.</li>';
                if (res.has_zero_price) {
                    showToast('Catatan: sebagian item masih bernilai Rp 0 di Master Harga.');
                }
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('casestudy-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            showToast('Menyusun studi kasus & proposal dengan AI...');
            try {
                const res = await apiPost('casestudy_generate', {
                    project_title: document.getElementById('cs-title').value,
                    industry: document.getElementById('cs-industry').value,
                    points_count: document.getElementById('cs-points').value,
                    problem_summary: document.getElementById('cs-problem').value,
                    test_result: document.getElementById('cs-test').value
                });
                state.selectedCaseId = res.item.case_id;
                document.getElementById('casestudy-form').reset();
                trackEvent('tkt_mkt_casestudy_generated', 'casestudy');
                await loadBootstrap();
                showToast('Studi kasus & proposal AI berhasil dibuat.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-print-casestudy').addEventListener('click', function () {
            window.print();
        });

        document.getElementById('business-profile-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('business_save', {
                    company_name: document.getElementById('biz-company').value,
                    brand_short: document.getElementById('biz-short').value,
                    official_email: document.getElementById('biz-email').value,
                    official_whatsapp: document.getElementById('biz-wa').value,
                    services_summary: document.getElementById('biz-services').value,
                    value_proposition: document.getElementById('biz-value').value
                });
                await loadBootstrap();
                showToast('Profil bisnis modular diperbarui.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('integrations-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('integrations_save', {
                    telegram_bot_token: document.getElementById('int-tg-token').value,
                    telegram_chat_id: document.getElementById('int-tg-chat').value,
                    gas_webhook_url: document.getElementById('int-gas-url').value,
                    gas_shared_secret: document.getElementById('int-gas-secret').value,
                    outbound_daily_limit: Number(document.getElementById('int-daily-limit').value || 25)
                });
                document.getElementById('int-tg-token').value = '';
                document.getElementById('int-gas-secret').value = '';
                await loadBootstrap();
                showToast('Pengaturan integrasi disimpan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-test-telegram').addEventListener('click', async function () {
            try {
                await apiPost('test_telegram', {});
                showToast('Pesan uji Telegram terkirim!');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('header-sync-gas-btn').addEventListener('click', async function () {
            try {
                await apiPost('sync_gas', {});
                showToast('Snapshot berhasil disinkronkan ke Google Apps Script.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('user-add-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('user_save', {
                    full_name: document.getElementById('new-user-name').value,
                    username: document.getElementById('new-user-username').value,
                    password: document.getElementById('new-user-password').value,
                    role: 'staff'
                });
                document.getElementById('user-add-form').reset();
                await loadBootstrap();
                showToast('Akun staf marketing berhasil ditambahkan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('research-search').addEventListener('input', renderResearch);

        document.getElementById('research-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-run-research');
            if (btn) { btn.disabled = true; }
            showToast('Memindai situs publik & menyusun analisa ICP AI...');
            try {
                const res = await apiPost('research_analyze', {
                    company_name: document.getElementById('res-company').value,
                    industry: document.getElementById('res-industry').value,
                    website_url: document.getElementById('res-url').value,
                    notes: document.getElementById('res-notes').value
                });
                state.selectedResearchId = res.item.research_id;
                document.getElementById('research-form').reset();
                trackEvent('tkt_mkt_research_analyze', 'research');
                await loadBootstrap();
                showToast('Riset & analisa company profile selesai.');
            } catch (err) {
                showToast(err.message, true);
            } finally {
                if (btn) { btn.disabled = false; }
            }
        });

        document.getElementById('btn-research-batch').addEventListener('click', async function () {
            const raw = document.getElementById('res-batch-text').value || '';
            const rows = raw.split(/\r?\n/).map(function (line) {
                const parts = line.split(',').map(function (p) { return p.trim(); });
                if (!parts[0] && !parts[1]) { return null; }
                return { company_name: parts[0] || '', website_url: parts[1] || '', industry: parts[2] || '' };
            }).filter(Boolean);
            if (rows.length === 0) {
                showToast('Masukkan minimal 1 baris (Nama, URL, Industri).', true);
                return;
            }
            try {
                const res = await apiPost('research_batch_import', { rows: rows });
                document.getElementById('res-batch-text').value = '';
                await loadBootstrap();
                showToast(res.added + ' perusahaan ditambahkan ke antrean riset.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('rss-feed-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('rss_feed_save', {
                    label: document.getElementById('rss-label').value,
                    feed_url: document.getElementById('rss-url').value,
                    keywords: document.getElementById('rss-keywords').value
                });
                document.getElementById('rss-feed-form').reset();
                await loadBootstrap();
                showToast('Feed RSS Radar ditambahkan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-rss-scan').addEventListener('click', async function () {
            showToast('Memindai feed RSS / Google Alerts...');
            try {
                const res = await apiPost('rss_scan_now', {});
                await loadBootstrap();
                showToast('Scan selesai: ' + res.new_count + ' sinyal baru ditemukan.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('funnel-traffic-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiPost('funnel_traffic_save', {
                    web_visits: Number(document.getElementById('fn-web-visits').value || 0),
                    boq_calculator_uses: Number(document.getElementById('fn-boq-uses').value || 0),
                    period_label: document.getElementById('fn-period').value
                });
                await loadBootstrap();
                showToast('Metrik TOFU diperbarui.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        document.getElementById('btn-run-funnel-coach').addEventListener('click', async function () {
            const outBox = document.getElementById('funnel-coach-output');
            if (outBox) { outBox.textContent = 'Menganalisa metrik funnel...'; }
            try {
                const res = await apiPost('funnel_ai_coach', {});
                if (outBox) { outBox.textContent = res.coach.advice || ''; }
                showToast('Analisa AI Funnel selesai.');
            } catch (err) {
                showToast(err.message, true);
            }
        });

        // Delegasi tombol dinamis di tabel & daftar
        document.body.addEventListener('click', async function (e) {
            const btn = e.target.closest('[data-action]');
            if (!btn) {
                return;
            }
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id') || '';
            const code = btn.getAttribute('data-code') || '';

            try {
                if (action === 'lead-edit') {
                    const l = state.leads.find(function (x) { return x.lead_id === id; });
                    if (!l) { return; }
                    document.getElementById('modal-lead-title').textContent = 'Edit Lead B2B';
                    document.getElementById('lead-id').value = l.lead_id;
                    document.getElementById('lead-company').value = l.company_name || '';
                    document.getElementById('lead-pic').value = l.pic_name || '';
                    document.getElementById('lead-email').value = l.email || '';
                    document.getElementById('lead-wa').value = l.whatsapp || '';
                    document.getElementById('lead-location').value = l.location || '';
                    document.getElementById('lead-service').value = l.service_category || 'Fiber Optic & LAN Cat6/Cat6A';
                    document.getElementById('lead-status').value = l.status || 'New Lead';
                    document.getElementById('lead-followup').value = l.next_followup_at || '';
                    document.getElementById('lead-boq').value = l.boq_summary || '';
                    document.getElementById('lead-notes').value = l.notes || '';
                    openModal('modal-lead');
                } else if (action === 'lead-delete') {
                    await apiPost('lead_delete', { lead_id: id });
                    await loadBootstrap();
                    showToast('Lead dihapus.');
                } else if (action === 'lead-ai') {
                    showToast('Menilai prioritas & menyusun draf (PII Masked)...');
                    const res = await apiPost('lead_score_draft', { lead_id: id });
                    const d = res.draft;
                    document.getElementById('ai-lead-id').value = id;
                    document.getElementById('ai-lead-score-banner').innerHTML = '<strong>Skor AI: ' + escapeHtml(d.ai_score) + ' (' + escapeHtml(d.score_numeric) + '/100)</strong> &bull; Engine: <code>' + escapeHtml(d.engine) + '</code><br>'
                        + '<span class="text-slate-600">' + escapeHtml((d.score_reasons || []).join(' • ')) + '</span><br>'
                        + '<span class="text-[#d9141d] font-semibold">Tip Sales: ' + escapeHtml(d.next_step_tip) + '</span>';
                    document.getElementById('ai-lead-masked-preview').textContent = d.masked_prompt_preview || '';
                    document.getElementById('ai-lead-email-subject').value = d.email_subject || '';
                    document.getElementById('ai-lead-email-body').value = d.email_body || '';
                    document.getElementById('ai-lead-wa-draft').value = d.wa_draft || '';
                    const waLink = document.getElementById('btn-lead-open-wa');
                    waLink.href = d.wa_url || '#';
                    trackEvent('tkt_mkt_ai_draft', 'leads');
                    openModal('modal-lead-ai');
                    await loadBootstrap();
                } else if (action === 'out-ai') {
                    showToast('Menyusun draf outbound personalisasi (PII Masked)...');
                    const res = await apiPost('outbound_generate_draft', { prospect_id: id });
                    await loadBootstrap();
                    document.getElementById('rev-out-id').value = id;
                    document.getElementById('rev-out-subject').value = res.draft.subject || '';
                    document.getElementById('rev-out-body').value = res.draft.body || '';
                    openModal('modal-outbound-review');
                } else if (action === 'out-review') {
                    const o = state.outbound.find(function (x) { return x.prospect_id === id; });
                    if (!o) { return; }
                    document.getElementById('rev-out-id').value = o.prospect_id;
                    document.getElementById('rev-out-subject').value = o.ai_draft_subject || '';
                    document.getElementById('rev-out-body').value = o.ai_draft_body || '';
                    openModal('modal-outbound-review');
                } else if (action === 'out-delete') {
                    await apiPost('outbound_delete', { prospect_id: id });
                    await loadBootstrap();
                    showToast('Target outbound dihapus.');
                } else if (action === 'prc-edit') {
                    const p = state.pricing.find(function (x) { return x.item_code === code; });
                    if (!p) { return; }
                    document.getElementById('prc-code').value = p.item_code;
                    document.getElementById('prc-code').readOnly = true;
                    document.getElementById('prc-unit').value = p.unit;
                    document.getElementById('prc-name').value = p.item_name;
                    document.getElementById('prc-category').value = p.category;
                    document.getElementById('prc-min').value = p.min_price_idr;
                    document.getElementById('prc-max').value = p.max_price_idr;
                    document.getElementById('prc-notes').value = p.spec_notes || '';
                    openModal('modal-pricing');
                } else if (action === 'prc-delete') {
                    await apiPost('pricing_delete', { item_code: code });
                    await loadBootstrap();
                    showToast('Item harga dihapus.');
                } else if (action === 'cs-select') {
                    state.selectedCaseId = id;
                    renderCaseStudies();
                } else if (action === 'cs-delete') {
                    await apiPost('casestudy_delete', { case_id: id });
                    if (state.selectedCaseId === id) {
                        state.selectedCaseId = '';
                    }
                    await loadBootstrap();
                    showToast('Studi kasus dihapus.');
                } else if (action === 'copy-text') {
                    const target = document.getElementById(btn.getAttribute('data-target'));
                    if (target && navigator.clipboard) {
                        await navigator.clipboard.writeText(target.textContent);
                        showToast('Teks berhasil disalin ke clipboard.');
                    }
                } else if (action === 'user-toggle') {
                    await apiPost('user_toggle', { user_id: id });
                    await loadBootstrap();
                    showToast('Status pengguna diperbarui.');
                } else if (action === 'res-select') {
                    state.selectedResearchId = id;
                    renderResearch();
                } else if (action === 'res-delete') {
                    await apiPost('research_delete', { research_id: id });
                    if (state.selectedResearchId === id) {
                        state.selectedResearchId = '';
                    }
                    await loadBootstrap();
                    showToast('Data riset dihapus.');
                } else if (action === 'res-reanalyze') {
                    showToast('Menganalisa ulang website & ICP AI...');
                    await apiPost('research_analyze', { research_id: id });
                    await loadBootstrap();
                    showToast('Analisa ulang selesai.');
                } else if (action === 'res-promote-out') {
                    const r = state.researchAccounts.find(function (x) { return x.research_id === id; });
                    if (r && !(r.emails_found && r.emails_found.length)) {
                        document.getElementById('outbound-form').reset();
                        document.getElementById('out-id').value = '';
                        document.getElementById('out-company').value = r.company_name || '';
                        document.getElementById('out-role').value = (r.decision_maker_roles && r.decision_maker_roles[0]) || 'IT Manager';
                        document.getElementById('out-wa').value = (r.phones_found && r.phones_found[0]) || '';
                        document.getElementById('out-trigger').value = (r.it_infrastructure_signals && r.it_infrastructure_signals[0]) || r.industry || '';
                        openModal('modal-outbound');
                        showToast('Email tidak tercantum di web target — lengkapi email untuk Outbound.');
                        return;
                    }
                    await apiPost('research_promote_outbound', { research_id: id });
                    await loadBootstrap();
                    switchView('outbound');
                    showToast('Berhasil masuk ke Outbound Console lengkap dengan draf AI!');
                } else if (action === 'res-promote-lead') {
                    await apiPost('research_promote_lead', { research_id: id });
                    await loadBootstrap();
                    switchView('leads');
                    showToast('Berhasil ditambahkan ke Lead Pipeline CRM.');
                } else if (action === 'rss-delete') {
                    await apiPost('rss_feed_delete', { feed_id: id });
                    await loadBootstrap();
                    showToast('Feed RSS dihapus.');
                } else if (action === 'sig-delete') {
                    await apiPost('signal_delete', { signal_id: id });
                    await loadBootstrap();
                    showToast('Sinyal dihapus.');
                } else if (action === 'sig-analyze') {
                    const sig = state.marketSignals.find(function (x) { return x.signal_id === id; });
                    if (!sig) { return; }
                    switchView('research');
                    document.getElementById('res-company').value = '';
                    document.getElementById('res-url').value = sig.link || '';
                    document.getElementById('res-notes').value = sig.title + ' — ' + (sig.summary || '');
                    document.getElementById('res-company').focus();
                    showToast('Sinyal diterapkan ke form Riset — lengkapi nama/domain perusahaan lalu klik Riset.');
                }
            } catch (err) {
                showToast(err.message, true);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', async function () {
        bindEvents();
        refreshIcons();
        try {
            await loadBootstrap();
        } catch (err) {
            if (err.message !== 'Unauthorized') {
                showToast('Gagal memuat data portal: ' + err.message, true);
            }
        }
    });
})();
