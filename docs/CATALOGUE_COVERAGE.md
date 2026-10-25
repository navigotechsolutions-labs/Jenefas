# Jenefas Catalogue Coverage & Source Traceability Matrix

**Document Version:** 1.0  
**Updated:** 2026-10-25  
**Scope:** Complete inventory of digital product records in `data/products.json`, mapped against primary manufacturer source material, internal IDs, and verification gates.

---

## 1. Executive Summary & Source Assessment

- **Catalogue Reality:** The physical Jenefas product range encompasses approximately 94–97 hardware items across multiple legacy printed catalogue pages, price sheets, and workshop fabrications since 1978.
- **Repository Source Material:** Currently, the repository contains:
  1. `docs/PRODUCT_TAXONOMY.md`: 18 structured hardware models categorized into fixed, tilt, motion, ceiling, desk, projector, and appliance brackets.
  2. `demos/product-28/assets/page_7.png` (scan of Jenefas Catalogue Page 7): Contains physical visual references for Product Code 28 (Table Top Stand, Laser Rectangle Flat Base) and Product Code 29 (Table Top Stand, Laser V Type Base).
- **Catalogue Presentation:** The website represents a **curated digital demonstration and enquiry catalogue** of verified/observed products. It explicitly notes that it is a *partial catalogue* and directs customers needing any of the 90+ additional wholesale models to request the complete printed dealer price list.
- **Identifier Separation:**
  - **Internal Identifiers:** Codes prefixed with `JF-` (e.g., `JF-FX32`, `JF-TT28`) are internal platform IDs created for database indexing, URL query parameters, and test stability.
  - **Manufacturer Codes:** Authentic factory codes appear where documented (e.g., Catalogue Page 7: `Product 28`, `Product 29`). For models where manufacturer model numbers are unconfirmed, the UI clearly displays the internal reference without falsely presenting it as a certified factory SKU.

---

## 2. Traceability Matrix

| Internal ID | Sourced Model / Code | Manufacturer Status | Primary Source Reference | Stated Specs Status | Package Contents Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `JF-FX32` | FX32 (Fixed 14"-32") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 1) | Catalogue Observed (Screen, VESA, Load) | **Awaiting manufacturer confirmation** |
| `JF-FX55` | FX55 (Fixed 32"-55") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 1) | Catalogue Observed (Screen, VESA, Load) | **Awaiting manufacturer confirmation** |
| `JF-FX75` | FX75 (Fixed 43"-75") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 1) | Catalogue Observed (Screen, VESA, Load) | **Awaiting manufacturer confirmation** |
| `JF-TL43` | TL43 (Tilt 26"-43") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 2) | Catalogue Observed (Screen, Tilt, Load) | **Awaiting manufacturer confirmation** |
| `JF-TL65` | TL65 (Tilt 32"-65") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 2) | Catalogue Observed (Screen, Tilt, Load) | **Awaiting manufacturer confirmation** |
| `JF-TL85` | TL85 (Tilt 55"-85") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 2) | Catalogue Observed (Screen, Tilt, Load) | **Awaiting manufacturer confirmation** |
| `JF-FM32-S` | FM32-S (Single-Arm 17"-42")| Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 3) | Catalogue Observed (Screen, Swivel, Load)| **Awaiting manufacturer confirmation** |
| `JF-FM55-D` | FM55-D (Dual-Arm 32"-65") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 3) | Catalogue Observed (Screen, Swivel, Load)| **Awaiting manufacturer confirmation** |
| `JF-FM75-HD` | FM75-HD (Dual-Arm 43"-85")| Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 3) | Catalogue Observed (Screen, Swivel, Load)| **Awaiting manufacturer confirmation** |
| `JF-FM100-PRO`| FM100-PRO (Commercial) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 3) | Catalogue Observed (Screen, Swivel, Load)| **Awaiting manufacturer confirmation** |
| `JF-CL55-S` | CL55-S (Ceiling 32"-55") | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 4) | Catalogue Observed (Screen, Drop, Load) | **Awaiting manufacturer confirmation** |
| `JF-CL65-D` | CL65-D (Dual Ceiling) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 4) | Catalogue Observed (Screen, Drop, Load) | **Awaiting manufacturer confirmation** |
| `JF-MA-01` | MA-01 (Monitor Arm Desk) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 5) | Catalogue Observed (Screen, Desk, Load) | **Awaiting manufacturer confirmation** |
| `JF-MA-02` | MA-02 (Dual Monitor Arm) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 5) | Catalogue Observed (Screen, Desk, Load) | **Awaiting manufacturer confirmation** |
| `JF-PR-ADJ` | PR-ADJ (Projector Mount) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 6) | Catalogue Observed (Drop, Roll, Load) | **Awaiting manufacturer confirmation** |
| `JF-SPK-01` | SPK-01 (Speaker Brackets) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 6) | Catalogue Observed (Swivel, Pair) | **Awaiting manufacturer confirmation** |
| `JF-AC-STD` | AC-STD (AC Outdoor Stand) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 7) | Catalogue Observed (Tonnage, Load) | **Awaiting manufacturer confirmation** |
| `JF-MW-01` | MW-01 (Microwave Bracket) | Internal SKU | `PRODUCT_TAXONOMY.md` (Cat 7) | Catalogue Observed (Capacity, Depth) | **Awaiting manufacturer confirmation** |
| `JF-TT28` | **Product 28** (Tabletop Stand)| **Catalogue Code 28** | Catalogue Page 7 (Upper Right) | **Concept Prototype** (Proportions Only) | **Visible parts only; hardware unconfirmed** |
| `JF-TT29` | **Product 29** (V Tabletop Stand)| **Catalogue Code 29** | Catalogue Page 7 (Lower Right) | **Concept Prototype** (Proportions Only) | **Visible parts only; hardware unconfirmed** |

---

## 3. Policy on Incomplete Information

1. **Package Contents:** Only structural components visible in catalogue photos or confirmed drawings are listed as *Visible components*. Screws, bolts, spacers, and tools are strictly designated as *Awaiting manufacturer bill of materials*.
2. **Packaging:** Replaced all speculative packaging phrases with `"Packaging details awaiting confirmation"`.
3. **Engineering Integrity:** TV screen size is treated as a physical guideline only; customers are explicitly instructed to confirm TV weight and rear VESA mounting-hole spacing.
