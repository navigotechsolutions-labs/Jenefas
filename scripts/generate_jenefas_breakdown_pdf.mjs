import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Commercial Addendum: Deliverables & Value Breakdown — Jenefas & Jenefas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

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
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

    /* Header Bar */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 7px;
      border-bottom: 2px solid var(--blue);
      margin-bottom: 10px;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .logo-container {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
    }

    .logo-container svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .brand-title-group {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      color: var(--navy);
      letter-spacing: 0.2px;
      line-height: 1.15;
    }

    .brand-tag {
      font-size: 8.5px;
      color: var(--muted);
      font-weight: 500;
    }

    .header-doc-info {
      text-align: right;
      font-size: 8.8px;
      color: var(--muted);
      font-weight: 500;
      line-height: 1.35;
    }

    .header-doc-info strong {
      color: var(--navy);
      font-family: 'Montserrat', sans-serif;
    }

    /* Content Area */
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

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

    .doc-title-block h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.25;
    }

    .doc-title-block p {
      font-size: 9.5px;
      color: var(--muted);
      margin-top: 2px;
    }

    .client-badge {
      background: #FFFFFF;
      border: 1px solid var(--border-accent);
      padding: 5px 9px;
      border-radius: 5px;
      font-size: 8.8px;
      text-align: right;
    }

    .client-badge strong {
      color: var(--navy);
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 9.5px;
    }

    /* Section Headings */
    .section-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 3.5px;
      height: 11px;
      background: var(--blue);
      border-radius: 2px;
    }

    /* Breakdown Table */
    .table-container {
      border: 1px solid var(--line);
      border-radius: 6px;
      overflow: hidden;
      background: #FFFFFF;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.2px;
      line-height: 1.35;
    }

    th {
      background: #F8FAFC;
      color: var(--navy);
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      text-align: left;
      padding: 6px 9px;
      border-bottom: 1.5px solid var(--line);
      font-size: 8.8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    th.num, td.num {
      text-align: center;
      width: 28px;
    }

    th.val, td.val {
      text-align: right;
      width: 105px;
      white-space: nowrap;
    }

    td {
      padding: 5.5px 9px;
      border-bottom: 1px solid var(--line);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:nth-child(even) td {
      background: #FAFCFF;
    }

    .item-name {
      font-weight: 700;
      color: var(--deep-navy);
      font-size: 9.6px;
    }

    .item-desc {
      color: #4B5563;
      font-size: 8.6px;
      margin-top: 1px;
    }

    .item-price {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 9.8px;
      color: var(--deep-navy);
    }

    .table-total-row {
      background: #F0F7FF !important;
      font-weight: 700;
      border-top: 2px solid var(--border-accent);
    }

    .table-total-row td {
      padding: 7px 9px;
      font-size: 9.8px;
      color: var(--navy);
    }

    .total-amount {
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      font-weight: 800;
      color: var(--navy);
    }

    /* Two-column layout */
    .grid-2 {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 10px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 11px;
    }

    .card-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 9.8px;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .milestone-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4.5px 0;
      border-bottom: 1px dashed var(--line);
      font-size: 8.8px;
    }

    .milestone-item:last-child {
      border-bottom: none;
    }

    .milestone-badge {
      font-weight: 700;
      color: var(--navy);
      display: inline-block;
      width: 75px;
    }

    .milestone-desc {
      flex: 1;
      color: #4B5563;
      padding: 0 6px;
    }

    .milestone-amount {
      font-weight: 700;
      color: var(--ink);
      font-family: 'Montserrat', sans-serif;
    }

    /* ROI Highlights */
    .roi-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .roi-list li {
      font-size: 8.6px;
      color: #374151;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      line-height: 1.35;
    }

    .roi-list li strong {
      color: var(--deep-navy);
    }

    .check-icon {
      color: var(--green);
      font-weight: 800;
      font-size: 9.5px;
    }

    /* Bottom Signatures */
    .signature-area {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding-top: 7px;
      border-top: 1px solid var(--line);
      font-size: 8.6px;
      margin-top: 3px;
    }

    .sig-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5px;
    }

    .sig-col strong {
      color: var(--navy);
      font-family: 'Montserrat', sans-serif;
      font-size: 9.2px;
    }

    .sig-title {
      color: var(--muted);
      font-size: 8.2px;
    }

    .sig-line {
      margin-top: 16px;
      border-bottom: 1px solid #9CA3AF;
      width: 140px;
    }

    /* Footer */
    .footer {
      border-top: 1px solid var(--line);
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      color: var(--muted);
    }
  </style>
</head>
<body>

  <div class="page">
    
    <!-- Top Header -->
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
        <strong>Addendum Ref: ADD-JJ-2026-01</strong><br>
        Companion to Proposal: PROP-JJ-2026-01<br>
        Date: 27 October 2026 · Validity: 15 Days
      </div>
    </header>

    <div class="content">

      <!-- Title Banner -->
      <div class="doc-title-block">
        <div>
          <h1>Commercial Addendum: Deliverables & Value Breakdown</h1>
          <p>Detailed line-item scope, engineering deliverables, and investment justification for Option 3</p>
        </div>
        <div class="client-badge">
          Prepared for:
          <strong>Mr. Mannan Robert, Proprietor</strong>
          M/s. Jenefas &amp; Jenefas · Ritchie Street, Chennai
        </div>
      </div>

      <!-- Scope Table -->
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
              <tr>
                <td class="num">1</td>
                <td>
                  <div class="item-name">Digital Catalogue Digitization (~100 Products)</div>
                  <div class="item-desc">Extract all ~100 mounts, stands &amp; brackets from 21-page scans into structured records: SKU codes, VESA standards, screen sizes, load limits, carton packing quantities, and crop imagery.</div>
                </td>
                <td>Zero scan lock; individual shareable URLs for every product; fast search.</td>
                <td class="val"><span class="item-price">₹30,000</span></td>
              </tr>

              <tr>
                <td class="num">2</td>
                <td>
                  <div class="item-name">"Will It Fit My TV?" Guided Finder Engine</div>
                  <div class="item-desc">Category-aware selection tool (Wall, Ceiling, Tabletop, Monitor Arms, Appliances) evaluating exact TV weight (kg) and VESA pattern (mm). Prevents wrong customer sizing.</div>
                </td>
                <td>Strict engineering checks; audited pass/fail status; reduces return dispatches.</td>
                <td class="val"><span class="item-price">₹25,000</span></td>
              </tr>

              <tr>
                <td class="num">3</td>
                <td>
                  <div class="item-name">Top 10 Hero Products Interactive 3D Guidance</div>
                  <div class="item-desc">Custom 3D CAD structural modelling and 360° interactive assembly viewer for 10 flagship volume-movers (Product 28, Product 29, and top 8 models). Rotate, zoom, explode on mobile without apps.</div>
                </td>
                <td>Direct visual proof of heavy-gauge cold rolled steel strength &amp; assembly steps.</td>
                <td class="val"><span class="item-price">₹25,000</span></td>
              </tr>

              <tr>
                <td class="num">4</td>
                <td>
                  <div class="item-name">1-Click WhatsApp B2B Quote Routing Engine</div>
                  <div class="item-desc">Custom structured enquiry builder on every product and finder outcome. Automatically drafts product name, reference code, and page link directly to sales desk (+91 98408 17220).</div>
                </td>
                <td>Zero typing for dealers; copy-draft fallback; instant direct contact.</td>
                <td class="val"><span class="item-price">₹15,000</span></td>
              </tr>

              <tr>
                <td class="num">5</td>
                <td>
                  <div class="item-name">100% Full Bilingual System (English + தமிழ்)</div>
                  <div class="item-desc">Instant dual-language toggle across the entire platform: all ~100 products, technical specification tables, filter categories, showroom timings, and guidance notes translated into natural Tamil.</div>
                </td>
                <td>Tailored for local Ritchie Street contractors, technicians, and outstation buyers.</td>
                <td class="val"><span class="item-price">₹15,000</span></td>
              </tr>

              <tr>
                <td class="num">6</td>
                <td>
                  <div class="item-name">Side-by-Side Model Comparison Tray</div>
                  <div class="item-desc">Interactive comparison tray allowing wholesale buyers to pin and evaluate up to 3 mount models simultaneously on screen size, certified load limits, and carton packing quantities.</div>
                </td>
                <td>High-conversion wholesale dealer tool for retail electronics shop owners.</td>
                <td class="val"><span class="item-price">₹10,000</span></td>
              </tr>

              <tr>
                <td class="num">7</td>
                <td>
                  <div class="item-name">Google Business, Local Maps &amp; SEO Schema</div>
                  <div class="item-desc">Structured SEO schema (LocalBusiness, Product, Breadcrumbs) for 1-A Wallers Road, Ritchie Street to capture high-intent commercial terms across Tamil Nadu and South India.</div>
                </td>
                <td>Ranks #1 for wholesale TV mount queries; drives foot traffic to showroom.</td>
                <td class="val"><span class="item-price">₹10,000</span></td>
              </tr>

              <tr>
                <td class="num">8</td>
                <td>
                  <div class="item-name">High-Speed Cloud Infrastructure &amp; Security</div>
                  <div class="item-desc">Sub-second 4G mobile load speeds, automated SSL certificate, zero database maintenance fees, high-reliability global CDN, and seamless cutover to your domain jenefas.com.</div>
                </td>
                <td>Zero server crash risk; reliable during peak wholesale trading hours.</td>
                <td class="val"><span class="item-price">₹10,000</span></td>
              </tr>

              <tr class="table-total-row">
                <td colspan="3" style="text-align: right; padding-right: 14px;">
                  <strong>TOTAL COMMERCIAL INVESTMENT (Option 3 Full Package):</strong>
                </td>
                <td class="val"><span class="total-amount">₹1,40,000</span> <span style="font-size: 8px; color: var(--muted); font-weight: 500;">(+ GST)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom 2-Grid: Milestones & ROI -->
      <div class="grid-2">
        
        <!-- Milestone Schedule -->
        <div class="card">
          <div class="card-title">
            <span>Milestone-Based Payment Schedule</span>
            <span style="font-size: 8px; color: var(--muted); font-weight: 500;">Risk-Free Delivery</span>
          </div>
          <div class="milestone-item">
            <span class="milestone-badge">40% Advance</span>
            <span class="milestone-desc">Project kickoff, catalogue data architecture, brand design &amp; initial 10 models.</span>
            <span class="milestone-amount">₹56,000</span>
          </div>
          <div class="milestone-item">
            <span class="milestone-badge">30% Preview</span>
            <span class="milestone-desc">Delivered working private link for your review, mobile testing &amp; 3D pilot approval.</span>
            <span class="milestone-amount">₹42,000</span>
          </div>
          <div class="milestone-item">
            <span class="milestone-badge">30% Launch</span>
            <span class="milestone-desc">Public domain DNS cutover to jenefas.com, Google sync &amp; sales desk handover.</span>
            <span class="milestone-amount">₹42,000</span>
          </div>
        </div>

        <!-- Business ROI -->
        <div class="card">
          <div class="card-title">
            <span>Commercial Return on Investment (ROI)</span>
            <span style="font-size: 8px; color: var(--green); font-weight: 700;">Business Impact</span>
          </div>
          <ul class="roi-list">
            <li>
              <span class="check-icon">✓</span>
              <div><strong>Zero Commissions to IndiaMART/JustDial:</strong> Saves ₹40,000–₹60,000 annually. Leads belong 100% to Jenefas without being shared with competitors.</div>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <div><strong>Prevents Costly Freight Returns:</strong> VESA &amp; kg matching eliminates wrong dispatches, saving ₹500–₹1,000 per misordered return carton.</div>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <div><strong>Recovers in 1–2 Dealer Orders:</strong> Just 1 or 2 new wholesale dealer acquisitions (50–100 cartons) generates enough margin to fully recover this investment.</div>
            </li>
          </ul>
        </div>

      </div>

      <!-- Signatures -->
      <div class="signature-area">
        <div class="sig-col">
          <strong>Respectfully Submitted By:</strong>
          <span>Mandal Manikantan (Mani)</span>
          <span class="sig-title">Founder, NaviGo Tech Solutions · Chennai</span>
          <span>Phone: +91 63808 53075 · Email: navigotechsolutions@gmail.com</span>
          <div class="sig-line"></div>
        </div>
        <div class="sig-col" style="text-align: right; align-items: flex-end;">
          <strong>Accepted &amp; Confirmed By:</strong>
          <span>Mr. Mannan Robert</span>
          <span class="sig-title">Proprietor, M/s. Jenefas &amp; Jenefas · Chennai</span>
          <span>1-A Wallers Road, near Ritchie Street Junction, Chennai – 600002</span>
          <div class="sig-line"></div>
        </div>
      </div>

    </div>

    <!-- Page Footer -->
    <footer class="footer">
      <span>NaviGo Tech Solutions · No. 56, 2nd Floor, 3rd East Cross St, Amaravathi Nagar, Arumbakkam, Chennai - 600106</span>
      <span>Live Interactive Demo: <strong>https://jenefas.netlify.app</strong></span>
      <span>Page 1 of 1</span>
    </footer>

  </div>

</body>
</html>
`;

async function generatePdf() {
  const outputDir = path.resolve('D:/NaviGo Multi-Agent System/output/proposals');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const htmlPath = path.join(outputDir, 'Jenefas_Deliverables_and_Price_Breakdown.html');
  const pdfPath = path.join(outputDir, 'Jenefas_Deliverables_and_Price_Breakdown.pdf');
  const previewPngPath = path.join(outputDir, 'Jenefas_Deliverables_and_Price_Breakdown.png');

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log('Saved HTML to', htmlPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log('Generated PDF at', pdfPath);

  // Take screenshot for visual verification
  const pageElement = await page.$('.page');
  if (pageElement) {
    await pageElement.screenshot({ path: previewPngPath });
    console.log('Generated preview PNG at', previewPngPath);
  }

  await browser.close();
}

generatePdf().catch(err => {
  console.error(err);
  process.exit(1);
});
