/**
 * RSVP receiver for the engagement invitation.
 * Appends one row per reply to the sheet this script is bound to.
 *
 * Setup
 * ─────
 * 1. Open your Google Sheet → Extensions → Apps Script.
 * 2. Replace the contents of Code.gs with this file, and Save.
 * 3. Run `setup` once (Run ▸ setup) and grant the permission prompt.
 *    It writes the header row.
 * 4. Deploy ▸ New deployment ▸ type "Web app".
 *       Execute as:        Me
 *       Who has access:    Anyone
 *    Deploy, then copy the /exec URL.
 * 5. Paste that URL into invitation.js →  rsvp.endpoint
 *    (leave rsvp.mode as "script").
 *
 * The page posts as text/plain so the browser sends a simple request and
 * never attempts a CORS preflight, which Apps Script cannot answer.
 */

var SHEET_NAME = 'RSVPs';
var HEADERS = ['Timestamp', 'Full name', 'Guests', 'Language'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

function setup() {
  var sh = sheet_();
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(raw);

    var name = String(data.name || '').trim().slice(0, 120);
    var guests = parseInt(data.guests, 10);
    if (!name) return out_({ ok: false, error: 'name required' });
    if (!isFinite(guests) || guests < 1) guests = 1;
    if (guests > 50) guests = 50;

    var sh = sheet_();
    if (sh.getLastRow() === 0) setup();
    sh.appendRow([new Date(), name, guests, String(data.lang || '')]);

    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

/* a GET is handy for checking the deployment is live */
function doGet() {
  return out_({ ok: true, service: 'rsvp' });
}

function out_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
