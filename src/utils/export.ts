/** Client-side CSV / printable PDF helpers for demo exports. */

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const body = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadExcelCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  // Excel-friendly CSV with BOM
  const esc = (v: string | number) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const body = '\uFEFF' + [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n')
  const blob = new Blob([body], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.xls') || filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function openPrintablePdf(title: string, lines: string[]) {
  const w = window.open('', '_blank', 'noopener,noreferrer,width=800,height=900')
  if (!w) return
  const body = lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('')
  w.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:32px;color:#111;line-height:1.45}
      h1{font-size:18px;margin:0 0 8px}
      .meta{color:#555;font-size:12px;margin-bottom:24px}
      p{margin:6px 0;font-size:13px}
      @media print{button{display:none}}
    </style></head><body>
    <button onclick="window.print()">Print / Save as PDF</button>
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">ElecMonitor Demo · North-West · generated ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })} WAT</div>
    ${body}
    </body></html>`)
  w.document.close()
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
