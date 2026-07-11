// Minimal CSV helpers for client-side exports.

type Cell = string | number | null | undefined;

export function toCsv(rows: Cell[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = cell == null ? "" : String(cell);
          // Quote when the value contains a comma, quote or newline.
          return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\r\n");
}

export function downloadCsv(filename: string, rows: Cell[][]): void {
  // Prepend a BOM so Excel opens UTF-8 (accented names) correctly.
  const blob = new Blob(["﻿" + toCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
