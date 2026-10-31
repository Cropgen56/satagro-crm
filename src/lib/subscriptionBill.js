const SOURCE_LABELS = {
  razorpay: 'Razorpay',
  product_card: 'Product card',
  hybrid: 'Product card + Razorpay',
  admin: 'Admin',
}

function formatBillDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function billNumber(subscriptionId) {
  const tail = String(subscriptionId || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(-10)
    .toUpperCase()
  return `SAT-${tail || '000000'}`
}

function ratePerAcre(row) {
  const acres = Number(row.acres) || 0
  const minor = Number(row.amountMinor) || 0
  if (!acres || !minor) return '—'
  const rate = minor / 100 / acres
  return `₹${rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildSubscriptionBillHtml(row, origin = '') {
  const logoUrl = `${origin}/logo.png`
  const billNo = billNumber(row.id)
  const issuedOn = formatBillDate(row.createdAt || new Date())
  const source =
    SOURCE_LABELS[row.activationSource] || row.activationSource || '—'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Subscription Bill ${escapeHtml(billNo)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      color: #111827;
      background: #fff;
      padding: 32px;
      line-height: 1.5;
    }
    .bill {
      max-width: 720px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
    }
    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding: 28px 32px;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border-bottom: 1px solid #d1fae5;
    }
    .logo { height: 48px; width: auto; object-fit: contain; }
    .bill-title {
      text-align: right;
    }
    .bill-title h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0d5245;
      letter-spacing: -0.02em;
    }
    .bill-title p {
      margin-top: 4px;
      font-size: 13px;
      color: #6b7280;
    }
    .bill-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 24px 32px;
      border-bottom: 1px solid #f3f4f6;
    }
    .meta-block h2 {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    .meta-block p {
      font-size: 14px;
      color: #111827;
    }
    .meta-block .muted { color: #6b7280; font-size: 13px; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 32px;
      text-align: left;
      font-size: 13px;
    }
    thead th {
      background: #fafafa;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #9ca3af;
      border-bottom: 1px solid #f3f4f6;
    }
    tbody td { border-bottom: 1px solid #f9fafb; }
    .amount-col { text-align: right; font-weight: 600; }
    .totals {
      padding: 20px 32px 28px;
      background: #fafafa;
      border-top: 1px solid #f3f4f6;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 8px;
      color: #4b5563;
    }
    .totals-row.grand {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #0d5245;
      font-size: 18px;
      font-weight: 800;
      color: #0d5245;
    }
    .status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: capitalize;
      background: #d1fae5;
      color: #065f46;
    }
    .bill-footer {
      padding: 20px 32px 28px;
      border-top: 1px solid #f3f4f6;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .bill { border: none; border-radius: 0; max-width: none; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="bill">
    <header class="bill-header">
      <img class="logo" src="${escapeHtml(logoUrl)}" alt="SatAgro" />
      <div class="bill-title">
        <h1>Subscription Bill</h1>
        <p>Precision agriculture for every farm</p>
      </div>
    </header>

    <section class="bill-meta">
      <div class="meta-block">
        <h2>Bill to</h2>
        <p><strong>${escapeHtml(row.farmer?.name)}</strong></p>
        <p class="muted">${escapeHtml(row.farmer?.phone)}</p>
        <p class="muted">${escapeHtml(row.farmer?.location)}</p>
      </div>
      <div class="meta-block" style="text-align:right">
        <h2>Bill details</h2>
        <p><strong>Bill no.</strong> ${escapeHtml(billNo)}</p>
        <p class="muted">Issued: ${escapeHtml(issuedOn)}</p>
        <p class="muted">Status: <span class="status">${escapeHtml(row.status)}</span></p>
      </div>
    </section>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Field / Acres</th>
          <th>Rate / acre</th>
          <th class="amount-col">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${escapeHtml(row.plan?.name)}</strong><br />
            <span style="color:#6b7280;font-size:12px">${escapeHtml(row.billingLabel)} subscription · ${escapeHtml(source)}</span>
          </td>
          <td>
            ${escapeHtml(row.field?.name)}<br />
            <span style="color:#6b7280;font-size:12px">${escapeHtml(row.acres || row.field?.acres)} acres</span>
          </td>
          <td>${escapeHtml(ratePerAcre(row))}</td>
          <td class="amount-col">${escapeHtml(row.amount)}</td>
        </tr>
      </tbody>
    </table>

    <section class="totals">
      <div class="totals-row">
        <span>Subscription period</span>
        <span>${escapeHtml(formatBillDate(row.startDate))} – ${escapeHtml(formatBillDate(row.endDate))}</span>
      </div>
      <div class="totals-row">
        <span>Billing cycle</span>
        <span>${escapeHtml(row.billingLabel)}</span>
      </div>
      ${
        row.razorpayPaymentId
          ? `<div class="totals-row"><span>Payment reference</span><span style="font-family:monospace;font-size:12px">${escapeHtml(row.razorpayPaymentId)}</span></div>`
          : ''
      }
      ${
        row.razorpaySubscriptionId
          ? `<div class="totals-row"><span>Razorpay subscription</span><span style="font-family:monospace;font-size:12px">${escapeHtml(row.razorpaySubscriptionId)}</span></div>`
          : ''
      }
      <div class="totals-row grand">
        <span>Total paid</span>
        <span>${escapeHtml(row.amount)} ${escapeHtml(row.currency || 'INR')}</span>
      </div>
    </section>

    <footer class="bill-footer">
      <p>Thank you for subscribing with SatAgro.</p>
      <p style="margin-top:6px">www.satagro.ai · satagroadmin@gmail.com</p>
      <p style="margin-top:12px;font-size:11px">This is a computer-generated subscription bill for farmer records.</p>
    </footer>
  </div>
</body>
</html>`
}

export function downloadSubscriptionBill(row) {
  if (!row || typeof window === 'undefined') return false
  const html = buildSubscriptionBillHtml(row, window.location.origin)
  const billNo = billNumber(row.id)

  const popup = window.open('', '_blank', 'noopener,noreferrer')
  if (popup) {
    popup.document.open()
    popup.document.write(html)
    popup.document.close()
    popup.focus()
    popup.onload = () => popup.print()
    setTimeout(() => {
      try {
        popup.print()
      } catch {
        // popup blocked or closed
      }
    }, 400)
    return true
  }

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `satagro-bill-${billNo}.html`
  link.click()
  URL.revokeObjectURL(url)
  return true
}
