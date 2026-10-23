# Modernization Proposal & Scope of Work

**Project:** Jenefas Digital Transformation & B2B Interactive Product Platform  
**Target:** Jenefas & Jenefas ([jenefas.com](https://jenefas.com))  
**Version:** 1.0  
**Status:** Proposal / Pitch Ready  

---

## 1. Project Objectives

1. **Replace Static PNG Scans with a Modern, High-Speed Web Catalogue:**
   Convert the 21-page raster image catalog into a database-backed, searchable, filterable digital product experience.
2. **Turn Traffic into High-Converting B2B & Wholesale Inquiries:**
   Provide direct 1-click WhatsApp inquiry hooks on every product, RFQ (Request for Quote) cart, and bulk order quotation forms.
3. **Establish Dominant Organic Search Visibility (SEO):**
   Structure each product category, model, and technical specification with rich schema markup (Product, LocalBusiness, Breadcrumbs) to rank atop Google for key commercial terms across Chennai and South India.
4. **Empower Dealers & Field Installers:**
   Provide a mobile-first interactive "Mount Compatibility Finder" allowing technicians on site to identify the exact VESA-compatible mount within seconds.
5. **Modernize Brand Aesthetics:**
   Deliver an industrial, clean, engineering-grade visual aesthetic (deep slate, safety orange accents, precision steel typography) reflecting 48 years of manufacturing durability.

---

## 2. Proposed Architecture & Scope of Work

```
┌────────────────────────────────────────────────────────────────────────┐
│                          JENEFAS WEB PLATFORM                          │
├────────────────────────────────┬───────────────────────────────────────┤
│        CUSTOMER FACING         │            B2B / DEALER ENGINE        │
├────────────────────────────────┼───────────────────────────────────────┤
│ • Hero & Brand Heritage Story  │ • 1-Click WhatsApp Inquiries          │
│ • Interactive Product Catalog  │ • Request For Quote (RFQ) System      │
│ • Live Faceted Filters         │ • Bulk Carton & Packaging Details     │
│ • Interactive Mount Finder     │ • Downloadable PDF Spec Sheets        │
│ • Store Location & Directions  │ • Dealer Application & Onboarding     │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Module 1: Brand & Heritage Showcase
* Prominent spotlight on **48 Years of Trust (Since 1978)**.
* Highlight Ritchie Street landmark status (Wallers Road junction).
* Core pillars: Heavy-gauge cold-rolled steel, powder-coated anti-rust finish, 100% safety tested, pan-India distribution.

### Module 2: Interactive Digital Product Catalogue
* **Categories:**
  1. Fixed TV Wall Mounts (Ultra Slim, 14" to 100")
  2. Tilting TV Wall Mounts (Glare-reducing, ±15°)
  3. Full-Motion / Articulating Dual-Arm Mounts (Swivel + Tilt + Extend)
  4. Ceiling & Video Wall Commercial Display Mounts
  5. Gas-Spring Desktop Monitor Arms
  6. Projector Ceiling Mounts & Audio Stands
  7. Set-Top Box, Console & AV Glass Shelves
  8. Appliance Brackets (Split AC Outdoor & Microwave)
* **Search & Filters:**
  * Screen Size filter (14"-32", 32"-55", 55"-75", 75"+)
  * VESA Pattern (75x75 up to 800x600 mm)
  * Weight Capacity (<25 kg, 25-50 kg, 50-80 kg, 80+ kg)
  * Motion Type (Fixed, Tilt, Full Motion Swivel, Ceiling Drop)
* **Product Detail Views:**
  * High-res imagery, technical dimensional drawings, VESA diagrams.
  * Carton packing details (pieces per master carton, gross weight).
  * Included hardware (screws, wall anchors, spirit level).

### Module 3: Conversion & Lead Generation Engine
* **Direct WhatsApp Integration:**
  Each item features a *"Wholesale Enquiry on WhatsApp"* button that generates a pre-formatted message sent directly to +91 98408 17220 or +91 96000 06869.
* **Bulk RFQ (Request for Quote):**
  Dealers can add multiple items to a quote list and submit with quantity requirements.
* **Dealer Onboarding Form:**
  Dedicated portal for electronics shops and AV integrators in Tamil Nadu and neighboring states to register for wholesale pricing and dealership terms.

### Module 4: Local & Technical SEO
* Structured Data: `LocalBusiness` for 1-A Wallers Road, Ritchie Street.
* High-intent landing pages for Chennai wholesale terms.
* OpenGraph & WhatsApp preview cards for easy catalog sharing across mobile.

---

## 3. Recommended Technology Stack

| Layer | Recommended Choice | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React / Next.js / Vite + Tailwind CSS** | Ultra-fast load times (<1s), responsive on all mobile devices, zero layout shift. |
| **UI Components & Icons** | **Lucide Icons / Tailwind UI** | Clean, industrial, engineering-focused look and feel. |
| **Data Layer** | **Structured JSON / Headless CMS (Strapi or Sanity)** | Easy for the Jenefas team to add new mount models without touching code. |
| **Hosting & CDN** | **Vercel / Cloudflare Pages** | 100% uptime, instant global CDN delivery, automated SSL, zero maintenance server costs. |
| **Messaging & CRM** | **WhatsApp Business API / Direct Click-to-Chat** | Instant lead capture matching Ritchie Street's fast-paced trade communication. |

---

## 4. Implementation Roadmap (Phases)

* **Phase 1: Discovery & Prototype (Weeks 1 - 2)**
  * Complete product SKU taxonomy mapping from current 21-page catalog.
  * Present interactive prototype to Mr. Mannan Robert.
  * Finalize brand messaging, contact numbers, and dealer terms.
* **Phase 2: Full Development & Catalog Digitization (Weeks 3 - 4)**
  * Populate all ~40-60 mount models with full specifications, VESA specs, and images.
  * Implement interactive VESA Finder and multi-parameter filters.
  * Build WhatsApp RFQ and dealer lead routing.
* **Phase 3: Testing, SEO & Launch (Weeks 5 - 6)**
  * Mobile performance optimization (Google Lighthouse 95+ score).
  * Configure Google Search Console, Google My Business sync, and schema markup.
  * Domain DNS cutover to high-speed CDN.
