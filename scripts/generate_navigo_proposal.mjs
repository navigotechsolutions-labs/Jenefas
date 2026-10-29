#!/usr/bin/env node

/**
 * NaviGo Tech Solutions — Universal Proposal & Commercial Addendum PDF Generator
 * 
 * Usage:
 *   node generate_navigo_proposal.mjs <path-to-config.json>
 * 
 * Example:
 *   node generate_navigo_proposal.mjs templates/sample_breakdown.json
 */

import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let chromium;
try {
  const mod = await import('playwright');
  chromium = mod.chromium;
} catch (e) {
  try {
    const mod = await import('file:///D:/Jenefas/node_modules/playwright/index.mjs');
    chromium = mod.chromium;
  } catch (e2) {
    const pwPath = require.resolve('playwright', { paths: [process.cwd(), 'D:/Jenefas', 'D:/NaviGo Multi-Agent System/crm'] });
    chromium = require(pwPath).chromium;
  }
}

function renderHtml(config) {
  const c = config;
  const deliverablesRows = (c.deliverables || []).map((d, i) => `
    <tr>
      <td class="num">${i + 1}</td>
      <td>
        <div class="item-name">${d.name}</div>
        <div class="item-desc">${d.desc}</div>
      </td>
      <td>${d.inclusion || ''}</td>
      <td class="val"><span class="item-price">${d.fee}</span></td>
    </tr>
  `).join('');

  const milestonesRows = (c.milestones || []).map(m => `
    <div class="milestone-item">
      <span class="milestone-badge">${m.badge}</span>
      <span class="milestone-desc">${m.desc}</span>
      <span class="milestone-amount">${m.amount}</span>
    </div>
  `).join('');

  const annualChargesRows = (c.annualCharges || []).map(a => `
    <div class="milestone-item">
      <span class="milestone-badge" style="width: 105px;">${a.name}</span>
      <span class="milestone-desc">${a.note}</span>
      <span class="milestone-amount" style="color: ${a.cost.includes('Free') ? 'var(--green)' : 'var(--ink)'};">${a.cost}</span>
    </div>
  `).join('');

  const addOnsText = (c.addOns || []).map(ao => `<strong>${ao.name}:</strong> ${ao.cost} (${ao.note})`).join(' &nbsp;·&nbsp; ');

  const roiRows = (c.roi || []).map(r => `
    <li>
      <span class="check-icon">✓</span>
      <div><strong>${r.title}:</strong> ${r.text}</div>
    </li>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${c.project.title} — ${c.client.company}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    :root {
      --blue: #1E90FF;
      --navy: #004FA3;
      --deep-navy: #08264A;
      --ink: #111827;
      --muted: #6B7280;
      --line: #E5E7EB;
      --bg-card: #F9FAFB;
      --bg-accent: #EFF6FF;
      --border-accent: #BFDBFE;
      --green: #059669;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: var(--ink);
      background-color: #E2E8F0;
      line-height: 1.45;
      font-size: 10px;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 14mm 16mm 12mm 16mm;
      margin: 0 auto;
      background: #FFFFFF;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 7px;
      border-bottom: 2px solid var(--blue);
      margin-bottom: 10px;
    }
    .header-brand { display: flex; align-items: center; gap: 9px; }
    .logo-container { width: 30px; height: 30px; flex-shrink: 0; }
    .logo-container svg { width: 100%; height: 100%; display: block; }
    .brand-title-group { display: flex; flex-direction: column; }
    .brand-name { font-family: 'Montserrat', sans-serif; font-size: 12.5px; font-weight: 800; color: var(--navy); line-height: 1.15; }
    .brand-tag { font-size: 8.5px; color: var(--muted); font-weight: 500; }
    .header-doc-info { text-align: right; font-size: 8.8px; color: var(--muted); line-height: 1.35; }
    .header-doc-info strong { color: var(--navy); font-family: 'Montserrat', sans-serif; }
    .content { flex: 1; display: flex; flex-direction: column; gap: 9px; }
    .doc-title-block {
      background: linear-gradient(135deg, #F0F7FF 0%, #E8F2FE 100%);
      border: 1px solid var(--border-accent);
      border-left: 4px solid var(--blue);
      border-radius: 6px;
      padding: 9px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-title-block h1 { font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 800; color: var(--navy); }
    .doc-title-block p { font-size: 9.5px; color: var(--muted); margin-top: 2px; }
    .client-badge { background: #FFFFFF; border: 1px solid var(--border-accent); padding: 5px 9px; border-radius: 5px; font-size: 8.8px; text-align: right; }
    .client-badge strong { color: var(--navy); display: block; font-family: 'Montserrat', sans-serif; font-size: 9.5px; }
    .section-title { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 800; color: var(--navy); display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
    .section-title::before { content: ''; display: inline-block; width: 3.5px; height: 11px; background: var(--blue); border-radius: 2px; }
    .table-container { border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: #FFFFFF; }
    table { width: 100%; border-collapse: collapse; font-size: 9.2px; line-height: 1.35; }
    th { background: #F8FAFC; color: var(--navy); font-family: 'Montserrat', sans-serif; font-weight: 700; text-align: left; padding: 6px 9px; border-bottom: 1.5px solid var(--line); font-size: 8.8px; text-transform: uppercase; }
    th.num, td.num { text-align: center; width: 28px; }
    th.val, td.val { text-align: right; width: 105px; white-space: nowrap; }
    td { padding: 5.5px 9px; border-bottom: 1px solid var(--line); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: #FAFCFF; }
    .item-name { font-weight: 700; color: var(--deep-navy); font-size: 9.6px; }
    .item-desc { color: #4B5563; font-size: 8.6px; margin-top: 1px; }
    .item-price { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 9.8px; color: var(--deep-navy); }
    .table-total-row { background: #F0F7FF !important; font-weight: 700; border-top: 2px solid var(--border-accent); }
    .table-total-row td { padding: 7px 9px; font-size: 9.8px; color: var(--navy); }
    .total-amount { font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 800; color: var(--navy); }
    .grid-2 { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 10px; }
    .card { background: #FFFFFF; border: 1px solid var(--line); border-radius: 6px; padding: 8px 11px; }
    .card-title { font-family: 'Montserrat', sans-serif; font-size: 9.8px; font-weight: 700; color: var(--navy); margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between; }
    .milestone-item { display: flex; justify-content: space-between; align-items: center; padding: 4.5px 0; border-bottom: 1px dashed var(--line); font-size: 8.6px; }
    .milestone-item:last-child { border-bottom: none; }
    .milestone-badge { font-weight: 700; color: var(--navy); display: inline-block; width: 100px; flex-shrink: 0; }
    .milestone-desc { flex: 1; color: #4B5563; padding: 0 4px; font-size: 8.2px; }
    .milestone-amount { font-weight: 700; color: var(--ink); font-family: 'Montserrat', sans-serif; white-space: nowrap; text-align: right; font-size: 8.5px; }
    .roi-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
    .roi-list li { font-size: 8.6px; color: #374151; display: flex; align-items: flex-start; gap: 5px; line-height: 1.35; }
    .check-icon { color: var(--green); font-weight: 800; font-size: 9.5px; }
    .signature-area { display: flex; justify-content: space-between; gap: 20px; padding-top: 7px; border-top: 1px solid var(--line); font-size: 8.6px; margin-top: 3px; }
    .sig-col { flex: 1; display: flex; flex-direction: column; gap: 1.5px; }
    .sig-col strong { color: var(--navy); font-family: 'Montserrat', sans-serif; font-size: 9.2px; }
    .sig-title { color: var(--muted); font-size: 8.2px; }
    .sig-line { margin-top: 16px; border-bottom: 1px solid #9CA3AF; width: 140px; }
    .footer { border-top: 1px solid var(--line); padding-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: var(--muted); }
  </style>
</head>
<body>
  <div class="page">
    <header class="header-bar">
      <div class="header-brand">
        <div class="logo-container">
          <svg viewBox="0 0 4000 4000" aria-hidden="true">
            <path fill="#1E90FF" fill-rule="evenodd" d="M441.93,105.51c-6.68,15.59-28.96,144.78-49,282.88-100.23,668.21,86.87,1476.74,478.88,2078.13,149.23,227.19,467.75,554.61,708.3,726.12,329.65,236.1,795.17,436.56,1213.91,525.66,93.55,20.05,282.88,31.18,496.7,31.18h343.01V564.35h-554.61c-445.47,0-559.07,6.68-579.11,31.18-17.82,20.05-24.5,131.41-20.05,338.56l6.68,309.6,229.42,6.68,227.19,6.68v844.17c0,465.52-8.91,846.4-17.82,846.4-40.09,0-314.06-120.28-518.98-227.19-429.88-222.74-835.26-590.25-1053.54-951.08-133.64-222.74-253.92-565.75-285.1-821.9-22.27-164.82-17.82-238.33,20.05-505.61,31.18-211.6,37.87-320.74,24.5-340.79-35.64-40.09-654.84-37.87-670.44,4.45Z"/>
            <path fill="#1E90FF" fill-rule="evenodd" d="M426.34,3021.13v906.54h690.48v-875.35l-151.46-180.42c-220.51-262.83-354.15-441.02-452.15-610.3l-86.87-149.23v908.76Z"/>
          </svg>
        </div>
        <div class="brand-title-group">
          <span class="brand-name">NaviGo Tech Solutions</span>
          <span class="brand-tag">Building Smarter Brands With AI · Chennai</span>
        </div>
      </div>
      <div class="header-doc-info">
        <strong>Ref: ${c.ref || 'PROP-2026'}</strong><br>
        ${c.companionRef ? 'Companion to: ' + c.companionRef + '<br>' : ''}
        Date: ${c.date || 'October 2026'} · Validity: ${c.validity || '15 Days'}
      </div>
    </header>

    <div class="content">
      <div class="doc-title-block">
        <div>
          <h1>${c.project.title}</h1>
          <p>${c.project.subtitle}</p>
        </div>
        <div class="client-badge">
          Prepared for:
          <strong>${c.client.name}, ${c.client.title}</strong>
          ${c.client.company} · ${c.client.location}
        </div>
      </div>

      <div>
        <div class="section-title">Itemized Scope &amp; Commercial Deliverables Breakdown</div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="num">#</th>
                <th>Deliverable Component</th>
                <th>Scope, Standards &amp; Technical Inclusions</th>
                <th class="val">Allocated Fee</th>
              </tr>
            </thead>
            <tbody>
              ${deliverablesRows}
              <tr class="table-total-row">
                <td colspan="3" style="text-align: right; padding-right: 14px;">
                  <strong>${c.total.label}</strong>
                </td>
                <td class="val"><span class="total-amount">${c.total.amount}</span> <span style="font-size: 8px; color: var(--muted); font-weight: 500;">${c.total.taxNote || ''}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">
            <span>Milestone-Based Payment Schedule</span>
            <span style="font-size: 8px; color: var(--muted); font-weight: 500;">Risk-Free Delivery</span>
          </div>
          ${milestonesRows}
          ${addOnsText ? `<div style="margin-top: 4px; padding-top: 3.5px; border-top: 1px solid var(--line); font-size: 8px; color: #4B5563;"><strong style="color: var(--navy);">Future Add-ons:</strong> ${addOnsText}</div>` : ''}
        </div>

        <div class="card">
          <div class="card-title">
            <span>Annual &amp; Operational Charges</span>
            <span style="font-size: 8px; color: var(--green); font-weight: 700;">Zero Hidden Fees</span>
          </div>
          ${annualChargesRows}
          <div style="margin-top: 4px; padding-top: 3.5px; border-top: 1px solid var(--line); font-size: 8px; color: #047857; font-weight: 600;">
            ✓ Recovers in 1–2 wholesale orders (50–100 cartons) · Zero IndiaMART/JustDial commissions.
          </div>
        </div>
      </div>

      <div class="signature-area">
        <div class="sig-col">
          <strong>Respectfully Submitted By:</strong>
          <span>${c.sender.name}</span>
          <span class="sig-title">${c.sender.title}</span>
          <span>Phone: ${c.sender.phone} · Email: ${c.sender.email}</span>
          <div class="sig-line"></div>
        </div>
        <div class="sig-col" style="text-align: right; align-items: flex-end;">
          <strong>Accepted &amp; Confirmed By:</strong>
          <span>${c.client.name}</span>
          <span class="sig-title">${c.client.title}, ${c.client.company}</span>
          <span>${c.client.address || c.client.location}</span>
          <div class="sig-line"></div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <span>NaviGo Tech Solutions · ${c.sender.address || 'Chennai, Tamil Nadu'}</span>
      <span>${c.project.liveDemoUrl ? 'Live Interactive Demo: <strong>' + c.project.liveDemoUrl + '</strong>' : ''}</span>
      <span>Page 1 of 1</span>
    </footer>
  </div>
</body>
</html>`;
}

async function main() {
  const configFile = process.argv[2];
  if (!configFile) {
    console.error('Usage: node generate_navigo_proposal.mjs <config.json>');
    process.exit(1);
  }

  const absConfigPath = path.resolve(configFile);
  if (!fs.existsSync(absConfigPath)) {
    console.error('Config file not found:', absConfigPath);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(absConfigPath, 'utf8'));
  const htmlContent = renderHtml(config);

  const outDir = config.output?.dir ? path.resolve(config.output.dir) : path.dirname(absConfigPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseName = config.output?.filename || path.basename(configFile, path.extname(configFile));
  const htmlPath = path.join(outDir, `${baseName}.html`);
  const pdfPath = path.join(outDir, `${baseName}.pdf`);
  const pngPath = path.join(outDir, `${baseName}.png`);

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('Saved HTML to:', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log('Generated PDF at:', pdfPath);

  const pageElement = await page.$('.page');
  if (pageElement) {
    await pageElement.screenshot({ path: pngPath });
    console.log('Generated Preview PNG at:', pngPath);
  }

  await browser.close();
  console.log('\nSUCCESS: All files generated cleanly!');
}

main().catch(err => {
  console.error('Error generating proposal:', err);
  process.exit(1);
});
