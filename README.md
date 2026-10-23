# Jenefas & Jenefas Modernization Project

> **Client:** Jenefas & Jenefas  
> **Official Website:** [jenefas.com](https://jenefas.com)  
> **Headquarters:** 1-A, Wallers Road, Near Ritchie Street & Mount Road Junction, Chintadripet, Chennai, Tamil Nadu – 600002  
> **Founder:** Mr. Mannan Robert (Established in 1978)  
> **Core Focus:** Television Mounts (Fixed, Tilt, Full Motion), Ceiling Drops, Video Wall Mounts, Projector Fixtures, Monitor Arms & AC Brackets.

---

## 📌 Executive Overview & Client Background

**Jenefas & Jenefas** is a premier manufacturer, distributor, and wholesale supplier of display mounting hardware and audio-visual accessories based in the heart of **Ritchie Street**, Asia's second-largest electronic wholesale marketplace.

With an uninterrupted **48-year track record since 1978**, Jenefas supplies electrical contractors, TV showrooms, corporate offices, hotels, hospitals, and AV system integrators across Tamil Nadu, Karnataka, Kerala, and Andhra Pradesh.

---

## 🔍 Current Website Audit (`https://jenefas.com/index.html`)

An in-depth review of the current live website reveals critical digital roadblocks:

1. **21 Static Image Pages:**
   * The live site is essentially a 21-page printed brochure sliced into flat PNG images (`page_1.png` to `page_21.png`) stacked vertically.
2. **Zero Organic SEO Visibility:**
   * Because all text, model numbers, VESA compatibility details, and load ratings are locked inside images, Google cannot crawl or index the catalog.
   * High-value commercial searches like *"TV wall mount wholesale Ritchie Street Chennai"* are lost to third-party aggregator brokers (IndiaMART, TradeIndia).
3. **Severe Mobile Usability Friction:**
   * Downloading 21 full-sized image files on mobile devices consumes excessive cellular data and causes slow loading. Users must pinch and zoom to read technical specs.
4. **No Interactive Search or Sizing Filters:**
   * Dealers and technicians looking for a specific bracket (e.g. 55-inch dual-arm full-motion mount) have no way to search or filter; they must scroll through the entire 21 pages.
5. **Lack of a B2B Lead & Quotation Engine:**
   * There are no 1-click WhatsApp inquiry buttons or Request For Quote (RFQ) workflows tied to individual products.

---

## 💡 The Solution: Modern B2B Digital Platform

This repository contains the complete strategy, client dossier, product taxonomy, and **working interactive prototype** designed to transform Jenefas's digital presence into a high-converting wholesale powerhouse:

* **Instant 3-Click VESA & Mount Finder:** Allows technicians, dealers, and customers to select screen size and motion type to find the exact mount instantly.
* **Faceted Search & Filtering:** Search by SKU, TV size, VESA standard, weight rating, and category.
* **1-Click WhatsApp B2B Quotations:** Every product card has an automated pre-formatted WhatsApp quote generator sent directly to Mr. Mannan Robert and the sales desk (+91 98408 17220).
* **Engineering-Grade Aesthetic:** Deep slate, industrial steel accents, and clean typography that reinforces their 48-year manufacturing trust.
* **Complete Hardware & Packaging Specs:** Includes master carton packing info, load ratings, and recommended venue use cases.

---

## 📂 Repository Structure

```
d:\Jenefas\
├── index.html                  # Interactive modern prototype (Ready to demo)
├── package.json                # Project configuration & preview scripts
├── .gitignore                  # Standard Git ignore rules
├── data\
│   └── products.json           # Structured JSON catalog (SKUs, VESA, capacities)
├── docs\
│   ├── CLIENT_DOSSIER.md       # Full client background, competitor audit & pitch guide
│   ├── PROJECT_PROPOSAL.md     # Scope of work, technical architecture & phased roadmap
│   └── PRODUCT_TAXONOMY.md     # Hardware standards, VESA sizing & master packaging
└── README.md                   # This project master documentation
```

---

## 🎯 Meeting & Pitch Strategy Guide

When meeting with **Mr. Mannan Robert**:

### 1. Opening: Honor Their 48-Year Heritage
> *"Mr. Robert, 48 years since 1978 at the gateway of Ritchie Street is an extraordinary achievement. Jenefas is the gold standard for heavy-duty mounts in Chennai. Our mission is to make your website match the unmatched reputation and strength of your physical business."*

### 2. The Core Problem to Address
> *"Right now, your catalogue is 21 images. That means Google can't read the words, and dealers on their phones must scroll through all 21 pages to find a 43-inch bracket. Every day, buyers searching for 'Ritchie Street TV mounts' end up on IndiaMART instead of calling you directly."*

### 3. The 3 Winning Demonstrations (Live Demo):
1. **Show the 3-Click Mount Finder:** Show how an installer can pick "55 inch" + "Full Motion" and get `JF-FM55-D` within 2 seconds.
2. **Click "WhatsApp Quote":** Demonstrate how clicking the button opens WhatsApp with the exact SKU, reducing phone tag and speeding up wholesale orders.
3. **Explain Local SEO Dominance:** Show how structuring each product allows Jenefas to rank #1 across Chennai and South India for TV brackets and projector mounts.

---

## 🚀 How to Run the Prototype Locally

The Product 28 interactive 3D concept is available at
`http://localhost:3000/demos/product-28/` after running:

```powershell
npm ci
npm start
```

`npm start` builds the unchanged static catalogue plus the isolated Three.js pilot
into `dist/`, then serves that directory on port 3000. The catalogue also links to
the demo below its heading. The pilot includes English/Tamil controls and is a
catalogue-based concept, pending manufacturer verification.

Use `npm run build` to build without serving. For checks, run
`npx playwright install chromium` once, then `npm test`.
See [the implementation and verification record](docs/CODEX_3D_ASSEMBLY_PLAN.md)
for scope, assumptions and the photos/dimensions needed for an accurate guide.

The original catalogue can still be previewed directly as described below; the
3D pilot needs the build above.

To run the interactive prototype:

```bash
# Option 1: Open directly in your browser
Start-Process "d:\Jenefas\index.html"

# Option 2: Using Node / npx serve
npx serve .
```

---

## 📞 Key Client Information

* **Client Name:** Jenefas & Jenefas
* **Proprietor:** Mr. Mannan Robert
* **Phones:** +91 98408 17220 / +91 96000 06869 / 044 4214 9551
* **Emails:** `mannanrobert@gmail.com` / `jenefas@jenefas.com`
* **Address:** 1-A, Wallers Road, Near Ritchie Street & Mount Road Junction, Chintadripet, Chennai 600002
