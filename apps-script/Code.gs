/**
 * Bilingual Initiatives — Quiz response collector
 * Receives quiz submissions from quiz.html and appends them to a Google Sheet.
 *
 * SETUP (see the step-by-step in the workshop notes):
 *   1. Create a Google Sheet. In the first row, add these headers (column A→I):
 *        Timestamp | Name | Class | Score | Q1 | Q2 | Q3 | Q4 | Q5
 *   2. Extensions ▸ Apps Script. Delete the sample code, paste THIS file.
 *   3. Deploy ▸ New deployment ▸ type: Web app.
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the Web app URL (ends with /exec).
 *   4. Paste that URL into quiz.html  ->  const ENDPOINT = "...";
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses')
             || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.name || '',
      data['class'] || '',
      (data.score != null ? data.score : '') + ' / ' + (data.total != null ? data.total : 5),
      data.q1 || '', data.q2 || '', data.q3 || '', data.q4 || '', data.q5 || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you open the /exec URL in a browser to confirm it is live.
function doGet() {
  return ContentService.createTextOutput('Quiz collector is running.');
}
