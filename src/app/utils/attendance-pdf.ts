// Client-side "Export to PDF" for a meeting's attendance roster.
// Rather than pulling in a PDF library, we build a branded, print-ready HTML
// document and hand it to the browser's print dialog ("Save as PDF"). The
// styling mirrors the server-side officer-codes PDF.

export interface AttendancePrintRow {
    name: string;
    position: string;
    offices: string;
    dila: string;
    uniqueCode: string;
    status: string;
    checkInTime: string;
}

export interface AttendancePrintData {
    title: string;
    scopeLabel: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    checkedInCount: number;
    total: number;
    rate: number;
    rows: AttendancePrintRow[];
}

function esc(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function exportAttendancePdf(data: AttendancePrintData): void {
    const win = window.open("", "_blank", "width=920,height=680");
    if (!win) {
        alert("Please allow pop-ups for this site to export as PDF.");
        return;
    }

    const generatedOn = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const infoRow = [
        ["Date", data.date],
        ["Time", data.time],
        ["Location", data.location],
        ["Organizer", data.organizer],
    ]
        .map(
            ([label, value]) =>
                `<div class="info"><span class="info-label">${esc(label)}</span><span class="info-value">${esc(
                    value || "—"
                )}</span></div>`
        )
        .join("");

    const bodyRows = data.rows
        .map((r, i) => {
            const statusClass =
                r.status.toLowerCase().includes("check") &&
                    !r.status.toLowerCase().includes("not")
                    ? "in"
                    : "out";
            return `<tr>
                <td class="sn">${i + 1}</td>
                <td>${esc(r.name)}</td>
                <td>${esc(r.position || r.offices)}</td>
                <td>${esc(r.dila)}</td>
                <td class="code">${esc(r.uniqueCode)}</td>
                <td><span class="badge ${statusClass}">${esc(r.status)}</span></td>
                <td>${esc(r.checkInTime)}</td>
            </tr>`;
        })
        .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${esc(data.title)} — Attendance</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Helvetica, Arial, sans-serif; color: #111; margin: 32px; }
  .center { text-align: center; }
  .sm { font-size: 10px; }
  .org { font-size: 16px; font-weight: bold; margin-top: 2px; }
  .state { font-size: 13px; font-weight: bold; }
  .doc-title { font-size: 18px; font-weight: bold; color: #1a5f2a; margin-top: 10px; }
  .meeting-title { font-size: 14px; font-weight: bold; margin-top: 2px; }
  .scope { font-size: 11px; color: #444; margin-top: 2px; }
  .info-grid { display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: center;
    margin: 14px 0; padding: 10px 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; }
  .info { font-size: 11px; }
  .info-label { color: #777; margin-right: 6px; text-transform: uppercase; letter-spacing: .04em; }
  .info-value { font-weight: 600; }
  .summary { font-size: 12px; margin: 10px 0 14px; text-align: center; }
  .summary strong { color: #1a5f2a; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  thead th { background: #1a5f2a; color: #fff; text-align: left; padding: 7px 8px; font-size: 10px;
    text-transform: uppercase; letter-spacing: .03em; }
  tbody td { padding: 6px 8px; border-bottom: 1px solid #eee; }
  tbody tr:nth-child(even) { background: #f7f7f7; }
  td.sn { color: #999; width: 28px; }
  td.code { font-family: "Courier New", monospace; color: #1a5f2a; font-weight: bold; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; }
  .badge.in { background: #dcfce7; color: #15803d; }
  .badge.out { background: #f1f1f1; color: #666; }
  .footer { margin-top: 20px; font-size: 9px; color: #777; text-align: center; }
  @page { margin: 16mm; }
  @media print { body { margin: 0; } thead { display: table-header-group; } tr { break-inside: avoid; } }
</style>
</head>
<body>
  <div class="center sm">IN THE NAME OF ALLAH THE GRACIOUS EVER MERCIFUL</div>
  <div class="center org">MAJLIS KHUDDAMUL AHMADIYYA NIGERIA</div>
  <div class="center state">OYO STATE</div>
  <div class="center sm">(AHMADIYYA MUSLIM YOUTH ORGANIZATION)</div>
  <div class="center doc-title">MEETING ATTENDANCE</div>
  <div class="center meeting-title">${esc(data.title)}</div>
  <div class="center scope">${esc(data.scopeLabel)}</div>

  <div class="info-grid">${infoRow}</div>

  <div class="summary">
    <strong>${data.checkedInCount}</strong> of <strong>${data.total}</strong> checked in
    &nbsp;·&nbsp; <strong>${data.rate}%</strong> attendance
  </div>

  <table>
    <thead>
      <tr>
        <th>S/N</th><th>Name</th><th>Position / Office</th><th>Dila</th>
        <th>Unique Code</th><th>Status</th><th>Check-in Time</th>
      </tr>
    </thead>
    <tbody>${bodyRows || `<tr><td colspan="7" class="center" style="padding:20px;color:#888;">No records</td></tr>`}</tbody>
  </table>

  <div class="footer">
    This document is confidential. Generated on ${esc(generatedOn)}.
  </div>

  <script>
    window.onload = function () { window.focus(); window.print(); };
    window.onafterprint = function () { window.close(); };
  </script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
}
