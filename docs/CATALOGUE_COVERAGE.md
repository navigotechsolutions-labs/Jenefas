# Jenefas Catalogue Coverage & Source Traceability Matrix

**Document Version:** 2.0  
**Updated:** 2026-10-25  
**Scope:** Complete inventory of digital product records in `data/products.json`, mapped against primary manufacturer source material, internal taxonomy IDs, supported attributes, and unconfirmed attributes.

---

## 1. Executive Summary & Source Provenance

### Physical Heritage & Manufacturing Reality
- **History:** Jenefas & Jenefas has manufactured television mounting hardware, audio-visual brackets, and utility fixtures in Chennai since 1978.
- **Physical Range:** The physical workshop range spans multiple printed brochure pages (observed as 21 scanned page images on the legacy site `jenefas.com`) and custom fabrications for AV integrators. There is no unified, numbered master engineering index covering every historical bracket.
- **Curated Digital Catalogue:** The website is honestly described as a **curated digital showcase of selected mounting and stand systems**. It does not make unsupported claims of "90+ models" or a specific fixed count, but provides a direct enquiry channel to the Ritchie Street sales desk for unlisted products, special brackets, or bulk orders.

### Source Classification
1. **Manufacturer Brochure Scans (`demos/product-28/assets/page_7.png`):**
   - High-resolution scans from Page 7 of the Jenefas printed brochure.
   - Primary evidence for **Product Code 28** (Tabletop Stand, rectangular base) and **Product Code 29** (Tabletop Stand, V-angle base).
   - Confirms visible structural assemblies (base plates, vertical uprights, direct mounting rails) and authentic manufacturer codes `28` and `29`.
   - Dimensions, load ratings, and fastener packs are not printed on the brochure crop and remain pending physical measurement or manufacturer verification.
2. **Internal Planning Taxonomy (`docs/PRODUCT_TAXONOMY.md`):**
   - An internal taxonomy document compiled during early platform architecture to categorize Jenefas's product classes (fixed wall brackets, tilt mounts, full-motion cantilevers, ceiling drops, monitor arms, appliance brackets).
   - Provides product archetypes and internal reference keys (`JF-FX32`, `JF-FX55`, etc.).
   - **Crucial Provenance Rule:** Specifications originating from `PRODUCT_TAXONOMY.md` are **internal planning estimates**, NOT certified manufacturer engineering specifications. They are marked `unconfirmed_planning_estimate` and are strictly excluded from automated affirmative compatibility decisions.

---

## 2. Product Provenance & Traceability Table

| Product Identifier | Original Source Reference | Source Type | Supported Attributes | Unconfirmed Attributes | Public Visibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `JF-FX32` | `docs/PRODUCT_TAXONOMY.md` (Cat 1) | Internal planning taxonomy | `internal_id`, `category_archetype` (Fixed Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `certified_screen_size_range`, `wall_distance_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FX55` | `docs/PRODUCT_TAXONOMY.md` (Cat 1) | Internal planning taxonomy | `internal_id`, `category_archetype` (Fixed Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `certified_screen_size_range`, `wall_distance_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FX75` | `docs/PRODUCT_TAXONOMY.md` (Cat 1) | Internal planning taxonomy | `internal_id`, `category_archetype` (Fixed Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `certified_screen_size_range`, `wall_distance_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-TL43` | `docs/PRODUCT_TAXONOMY.md` (Cat 2) | Internal planning taxonomy | `internal_id`, `category_archetype` (Tilt Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `tilt_angle_range`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-TL65` | `docs/PRODUCT_TAXONOMY.md` (Cat 2) | Internal planning taxonomy | `internal_id`, `category_archetype` (Tilt Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `tilt_angle_range`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-TL85` | `docs/PRODUCT_TAXONOMY.md` (Cat 2) | Internal planning taxonomy | `internal_id`, `category_archetype` (Tilt Wall Mount), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `tilt_angle_range`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FM32-S` | `docs/PRODUCT_TAXONOMY.md` (Cat 3) | Internal planning taxonomy | `internal_id`, `category_archetype` (Single-Arm Motion), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `extension_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FM55-D` | `docs/PRODUCT_TAXONOMY.md` (Cat 3) | Internal planning taxonomy | `internal_id`, `category_archetype` (Dual-Arm Motion), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `extension_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FM75-HD` | `docs/PRODUCT_TAXONOMY.md` (Cat 3) | Internal planning taxonomy | `internal_id`, `category_archetype` (Dual-Arm Motion), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `extension_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-FM100-PRO`| `docs/PRODUCT_TAXONOMY.md` (Cat 3)| Internal planning taxonomy | `internal_id`, `category_archetype` (Heavy Dual-Arm), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `extension_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-CL55-S` | `docs/PRODUCT_TAXONOMY.md` (Cat 4) | Internal planning taxonomy | `internal_id`, `category_archetype` (Single Ceiling Drop), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `drop_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-CL65-D` | `docs/PRODUCT_TAXONOMY.md` (Cat 4) | Internal planning taxonomy | `internal_id`, `category_archetype` (Dual Ceiling Drop), `descriptive_title` | `certified_vesa_patterns`, `certified_max_load_kg`, `drop_range_mm`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-MA-01` | `docs/PRODUCT_TAXONOMY.md` (Cat 5) | Internal planning taxonomy | `internal_id`, `category_archetype` (Desk Clamp Single Arm), `descriptive_title` | `clamp_opening_range_mm`, `supported_desk_thickness_mm`, `max_load_kg`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-MA-02` | `docs/PRODUCT_TAXONOMY.md` (Cat 5) | Internal planning taxonomy | `internal_id`, `category_archetype` (Desk Clamp Dual Arm), `descriptive_title` | `clamp_opening_range_mm`, `supported_desk_thickness_mm`, `max_load_kg`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-PR-ADJ` | `docs/PRODUCT_TAXONOMY.md` (Cat 6) | Internal planning taxonomy | `internal_id`, `category_archetype` (Projector Ceiling Mount), `descriptive_title` | `drop_length_mm`, `max_load_kg`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-SPK-01` | `docs/PRODUCT_TAXONOMY.md` (Cat 6) | Internal planning taxonomy | `internal_id`, `category_archetype` (Speaker Wall Bracket Pair), `descriptive_title` | `bracket_depth_mm`, `max_load_kg`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-AC-STD` | `docs/PRODUCT_TAXONOMY.md` (Cat 7) | Internal planning taxonomy | `internal_id`, `category_archetype` (AC Outdoor Unit Stand Pair), `descriptive_title`| `steel_gauge`, `vibration_dampers`, `max_tonnage`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-MW-01` | `docs/PRODUCT_TAXONOMY.md` (Cat 7) | Internal planning taxonomy | `internal_id`, `category_archetype` (Microwave Oven Wall Bracket Pair), `descriptive_title`| `depth_extension_mm`, `max_load_kg`, `hardware_fastener_bom` | `false` (Internal planning record; preserved internally) |
| `JF-TT28` | Jenefas Catalogue Page 7 scan (`page_7.png`) | Manufacturer brochure scan | `manufacturer_catalogue_code: 28`, `tabletop_form_factor`, `visible_structures` (rectangular base, column, rails) | `exact_dimensions_mm`, `certified_weight_limit_kg`, `supported_vesa_patterns`, `hardware_fastener_bom` | `true` (Curated Public Showcase + 3D Concept Preview) |
| `JF-TT29` | Jenefas Catalogue Page 7 scan (`page_7.png`) | Manufacturer brochure scan | `manufacturer_catalogue_code: 29`, `tabletop_form_factor`, `visible_structures` (V-angle base, column, rails) | `exact_dimensions_mm`, `certified_weight_limit_kg`, `supported_vesa_patterns`, `hardware_fastener_bom` | `true` (Curated Public Showcase + 3D Concept Preview) |

---

## 3. Product Finder & Compatibility Decision Rules

1. **No Speculative Affirmative Matching:**
   An affirmative compatibility badge (`Meets the checked specifications`) is **never** granted based on screen size alone or unconfirmed planning estimates.
2. **Four Mutually Exclusive Outcome States:**
   - **State A: Meets the checked specifications (`meets_spec`):** Every required attribute (VESA pattern, display weight, movement) was verified against evidence and passed.
   - **State B: More information needed (`more_info_needed`):** No requirement failed, but one or more critical attributes (e.g. VESA spacing, exact TV weight, or unconfirmed manufacturer specifications) remain unknown.
   - **State C: Does not meet a checked requirement (`fails_spec`):** One or more verified requirements failed (e.g., TV weight exceeds load capacity, or required VESA pattern exceeds mount capacity).
   - **State D: No confirmed match found (`no_match`):** No catalogued product satisfies the criteria.
3. **Transparent Audit Card:** Every evaluated product itemizes which requirements passed, which failed, and which remain unconfirmed.
4. **Surface Suitability Notice:** The UI explicitly clarifies that wall/desk surface composition (concrete, brick, stud, solid wood) requires confirmation prior to installation.
