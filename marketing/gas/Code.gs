/**
 * Tekno AI Marketing - Google Apps Script Companion (Rp 0 Serverless Sync, RSS Radar & Triggers)
 * Pasang di https://script.google.com terhubung ke Google Sheet baru.
 *
 * Isi Script Properties (Project Settings > Script Properties):
 *   - SHARED_SECRET      : (sama dengan GAS Shared Secret di menu Integrasi portal)
 *   - ALERT_EMAIL        : admin@teknotama.com
 *   - TELEGRAM_BOT_TOKEN : (opsional)
 *   - TELEGRAM_CHAT_ID   : (opsional)
 *   - RSS_FEEDS          : (opsional) URL RSS/Google Alerts dipisah koma
 *   - RSS_KEYWORDS       : (opsional) kata kunci dipisah koma
 */

var SHEET_SCHEMAS = {
  Leads_Pipeline: ['lead_id', 'created_at', 'source', 'company_name', 'pic_name', 'email', 'whatsapp', 'location', 'service_category', 'boq_summary', 'ai_score', 'score_numeric', 'status', 'next_followup_at', 'last_contact_at', 'notes'],
  Master_Pricing: ['item_code', 'category', 'item_name', 'unit', 'min_price_idr', 'max_price_idr', 'spec_notes', 'is_active', 'updated_at'],
  Outbound_Prospects: ['prospect_id', 'segment', 'company_name', 'pic_name', 'pic_role', 'email', 'whatsapp', 'trigger_signal', 'ai_draft_subject', 'approval_status', 'sent_at'],
  Research_Accounts: ['research_id', 'created_at', 'company_name', 'website_url', 'industry', 'icp_score', 'icp_tier', 'emails_found', 'phones_found', 'locations_found', 'recommended_entry_offer', 'status'],
  Market_Signals: ['signal_id', 'published_at', 'source_label', 'title', 'link', 'matched_keywords', 'relevance_score', 'status'],
  Case_Studies: ['case_id', 'project_title', 'industry', 'problem_summary', 'points_count', 'test_result', 'status', 'created_at'],
  System_Logs: ['log_id', 'created_at', 'module', 'level', 'actor', 'message']
};

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var props = PropertiesService.getScriptProperties();
    var expectedSecret = props.getProperty('SHARED_SECRET') || '';

    if (expectedSecret && body.shared_secret !== expectedSecret) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist_(ss);

    var evt = body.event || '';
    var payload = body.payload || {};

    if (evt === 'lead_upsert') {
      upsertRowByKey_(ss.getSheetByName('Leads_Pipeline'), 'lead_id', payload, SHEET_SCHEMAS.Leads_Pipeline);
    } else if (evt === 'pricing_upsert') {
      upsertRowByKey_(ss.getSheetByName('Master_Pricing'), 'item_code', payload, SHEET_SCHEMAS.Master_Pricing);
    } else if (evt === 'outbound_sent') {
      upsertRowByKey_(ss.getSheetByName('Outbound_Prospects'), 'prospect_id', payload, SHEET_SCHEMAS.Outbound_Prospects);
    } else if (evt === 'research_upsert') {
      upsertRowByKey_(ss.getSheetByName('Research_Accounts'), 'research_id', payload, SHEET_SCHEMAS.Research_Accounts);
    } else if (evt === 'casestudy_created') {
      upsertRowByKey_(ss.getSheetByName('Case_Studies'), 'case_id', payload, SHEET_SCHEMAS.Case_Studies);
    } else if (evt === 'full_snapshot') {
      replaceSheet_(ss.getSheetByName('Leads_Pipeline'), payload.leads || [], SHEET_SCHEMAS.Leads_Pipeline);
      replaceSheet_(ss.getSheetByName('Master_Pricing'), payload.pricing || [], SHEET_SCHEMAS.Master_Pricing);
      replaceSheet_(ss.getSheetByName('Outbound_Prospects'), payload.outbound || [], SHEET_SCHEMAS.Outbound_Prospects);
      replaceSheet_(ss.getSheetByName('Research_Accounts'), payload.research_accounts || [], SHEET_SCHEMAS.Research_Accounts);
      replaceSheet_(ss.getSheetByName('Market_Signals'), payload.market_signals || [], SHEET_SCHEMAS.Market_Signals);
      replaceSheet_(ss.getSheetByName('Case_Studies'), payload.case_studies || [], SHEET_SCHEMAS.Case_Studies);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, event: evt }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    sendErrorAlert_('doPost', err.message);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Pasang Time-Driven Trigger: Daily 07:00 - 08:00 WIB
 * Menarik Google Alerts / RSS Feed B2B dan mencatat peluang ke sheet Market_Signals
 */
function dailyRssSignalCollector() {
  try {
    var props = PropertiesService.getScriptProperties();
    var feedsRaw = props.getProperty('RSS_FEEDS') || '';
    if (!feedsRaw) {
      return;
    }
    var keywordsRaw = props.getProperty('RSS_KEYWORDS') || 'kantor baru,pindah kantor,gudang baru,pabrik baru,kawasan industri,data center,fit-out,renovasi kantor,server,cctv';
    var keywords = keywordsRaw.split(',').map(function (k) { return k.trim().toLowerCase(); }).filter(Boolean);
    var feeds = feedsRaw.split(',').map(function (u) { return u.trim(); }).filter(Boolean);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist_(ss);
    var sheet = ss.getSheetByName('Market_Signals');
    var addedTitles = [];

    feeds.forEach(function (feedUrl) {
      var resp = UrlFetchApp.fetch(feedUrl, { muteHttpExceptions: true });
      if (resp.getResponseCode() !== 200) return;
      var doc = XmlService.parse(resp.getContentText());
      var root = doc.getRootElement();
      var ns = root.getNamespace();
      var entries = root.getName() === 'feed'
        ? root.getChildren('entry', ns)
        : (root.getChild('channel') ? root.getChild('channel').getChildren('item') : []);

      entries.slice(0, 15).forEach(function (entry) {
        var title = entry.getChildText('title', ns) || entry.getChildText('title') || '';
        var linkEl = entry.getChild('link', ns) || entry.getChild('link');
        var link = linkEl ? (linkEl.getAttribute('href') ? linkEl.getAttribute('href').getValue() : linkEl.getText()) : '';
        var summary = entry.getChildText('content', ns) || entry.getChildText('summary', ns) || entry.getChildText('description') || '';
        var plain = (title + ' ' + summary).replace(/<[^>]+>/g, ' ').toLowerCase();
        var matched = keywords.filter(function (kw) { return plain.indexOf(kw) !== -1; });
        if (matched.length === 0) return;

        var signalId = 'SIG-' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, title + '|' + link)).slice(0, 10);
        var rec = {
          signal_id: signalId,
          published_at: Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd'),
          source_label: feedUrl.slice(0, 50),
          title: title.replace(/<[^>]+>/g, '').slice(0, 180),
          link: link,
          matched_keywords: matched.slice(0, 5).join(', '),
          relevance_score: Math.min(99, 40 + matched.length * 18),
          status: 'New Signal'
        };
        upsertRowByKey_(sheet, 'signal_id', rec, SHEET_SCHEMAS.Market_Signals);
        addedTitles.push('- ' + rec.title + ' [' + rec.matched_keywords + ']');
      });
    });

    if (addedTitles.length > 0) {
      notifyTeam_('[Radar Sinyal Pasar Teknotama]\nDitemukan ' + addedTitles.length + ' peluang ekspansi B2B:\n' + addedTitles.slice(0, 8).join('\n'));
    }
  } catch (err) {
    sendErrorAlert_('dailyRssSignalCollector', err.message);
  }
}

/**
 * Pasang Time-Driven Trigger: Daily 08:00 - 09:00 WIB
 */
function dailyFollowUpReminder0830() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads_Pipeline');
    if (!sheet || sheet.getLastRow() < 2) {
      return;
    }
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var idxCompany = headers.indexOf('company_name');
    var idxStatus = headers.indexOf('status');
    var idxFollow = headers.indexOf('next_followup_at');
    var todayStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
    var dueList = [];

    for (var i = 1; i < data.length; i++) {
      var status = String(data[i][idxStatus] || '');
      var follow = String(data[i][idxFollow] || '');
      if (status !== 'Won' && status !== 'Lost' && (!follow || follow <= todayStr)) {
        dueList.push('- ' + data[i][idxCompany] + ' [' + status + '] (Target: ' + (follow || 'Hari ini') + ')');
      }
    }

    if (dueList.length > 0) {
      notifyTeam_('[Tekno AI Marketing] Pengingat Follow-Up Harian (' + todayStr + '):\n' + dueList.join('\n'));
    }
  } catch (err) {
    sendErrorAlert_('dailyFollowUpReminder0830', err.message);
  }
}

/**
 * Pasang Time-Driven Trigger: Weekly Monday 08:00 - 09:00 WIB
 */
function weeklyMondayExecutiveReport() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads_Pipeline');
    var total = 0;
    var won = 0;
    var survey = 0;
    if (sheet && sheet.getLastRow() >= 2) {
      var data = sheet.getDataRange().getValues();
      var idxStatus = data[0].indexOf('status');
      for (var i = 1; i < data.length; i++) {
        total++;
        var st = String(data[i][idxStatus] || '');
        if (st === 'Won') won++;
        if (st === 'Site Survey' || st === 'Quotation') survey++;
      }
    }
    notifyTeam_('[Laporan Mingguan Tekno AI Marketing]\nTotal Leads: ' + total + '\nTahap Survey/Quotation: ' + survey + '\nProyek Won: ' + won);
  } catch (err) {
    sendErrorAlert_('weeklyMondayExecutiveReport', err.message);
  }
}

function ensureSheetsExist_(ss) {
  Object.keys(SHEET_SCHEMAS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(SHEET_SCHEMAS[name]);
    } else if (sh.getLastRow() === 0) {
      sh.appendRow(SHEET_SCHEMAS[name]);
    }
  });
}

function upsertRowByKey_(sheet, keyCol, obj, cols) {
  var rows = sheet.getDataRange().getValues();
  var keyIdx = cols.indexOf(keyCol);
  var keyVal = String(obj[keyCol] || '');
  var rowVals = cols.map(function (c) { return obj[c] != null ? obj[c] : ''; });

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIdx]) === keyVal) {
      sheet.getRange(i + 1, 1, 1, cols.length).setValues([rowVals]);
      return;
    }
  }
  sheet.appendRow(rowVals);
}

function replaceSheet_(sheet, items, cols) {
  sheet.clearContents();
  sheet.appendRow(cols);
  if (!items || !items.length) return;
  var matrix = items.map(function (item) {
    return cols.map(function (c) { return item[c] != null ? item[c] : ''; });
  });
  sheet.getRange(2, 1, matrix.length, cols.length).setValues(matrix);
}

function notifyTeam_(message) {
  var props = PropertiesService.getScriptProperties();
  var tgToken = props.getProperty('TELEGRAM_BOT_TOKEN') || '';
  var tgChat = props.getProperty('TELEGRAM_CHAT_ID') || '';
  var alertEmail = props.getProperty('ALERT_EMAIL') || '';

  if (tgToken && tgChat) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + encodeURIComponent(tgToken) + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: tgChat, text: message }),
      muteHttpExceptions: true
    });
  }
  if (alertEmail) {
    MailApp.sendEmail(alertEmail, '[Tekno AI Marketing] Ringkasan Otomatis', message);
  }
}

function sendErrorAlert_(fnName, errorMessage) {
  var props = PropertiesService.getScriptProperties();
  var alertEmail = props.getProperty('ALERT_EMAIL') || '';
  if (alertEmail) {
    MailApp.sendEmail(alertEmail, '[ERROR GAS] Tekno AI Marketing - ' + fnName, errorMessage);
  }
}
