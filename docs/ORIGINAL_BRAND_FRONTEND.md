# Original Jenefas brand frontend

Uses the existing red/yellow Jenefas.com logo and Something DIFFERENT slogan.
The logo SVG is a viewport onto unmodified catalogue-cover pixels, embedded for
reliable standalone delivery. It is not an AI-redrawn logo or a new identity.
Source: https://jenefas.com/images/page_1.png. A supplied original high-resolution
logo should replace this catalogue extraction when available.

Changes: white/red catalogue, simplified product-focused hero using actual page-7
illustration, original logo on all three pages, light guide cards, retained mobile
menu and enquiry flows. Main hero removes unsupported numerical marketing claims.
Product data and remaining historical marketing content were not audited by this
visual change. Products 28/29 remain concepts, pending manufacturer verification.

## Validation & Audit Results (October 24, 2026)
1. **Automated Testing:**
   - 5 unit tests (`tests/*.test.mjs`): 5 passed (81 ms).
   - 8 Playwright browser tests (`tests/browser/*.spec.js`): 8 passed (43.1 s).
2. **Visual Screenshot Reviews (320px, 390px, 768px, 1440px):**
   - Homepage, Product 28 pilot, and Product 29 pilot captured and inspected across all 4 responsive breakpoints.
   - Clean responsive layout without horizontal overflow (`scrollWidth <= innerWidth`).
3. **Original Jenefas Logo Audit:**
   - Proportions: Exact 300:140 aspect ratio maintained with `object-fit: contain`. No stretching or edge clipping.
   - Slogan: "Something DIFFERENT" slogan is crisp and clearly visible in yellow crescent.
   - Catalogue artwork: Clean isolated crop containing zero surrounding page text or border artifacts.
4. **Theme, Color & Contrast Review:**
   - White/red branding applied consistently (`#b91c1c` brand primary, `#dc2626` bright red accent).
   - Cleaned up leftover orange rules (`#f97316`, `#fb923c`, `#ea580c`) in navigation styles.
   - Fixed UTF-8 character encoding escape for benefit checkmark (`\2713\0020`).
   - High contrast on buttons and form inputs; zero unreadable text combinations.
5. **Catalogue Artwork Crop Corrections:**
   - Added explicit SVG `<clipPath>` definitions to hero and assembly guide cards for both Product 28 (`viewBox="1115 110 185 235"`) and Product 29 (`viewBox="945 750 170 225"`).
   - Completely eliminated adjacent TV illustration bleed and stray clamp / "4-in-1" artwork from catalogue Page 7.
6. **Navigation & Interactive Functions:**
   - Desktop and mobile menus fully operational (Escape key closes drawer, focus returns to toggle).
   - Mount Finder and category filters working properly.
   - Search input expanded to match model IDs, titles, sizes, VESA, and wall distance.
   - RFQ Quote modal opens and closes cleanly without submitting real enquiries.
7. **Pilots 28 and 29:**
   - Reference image (`page_7.png`), 3D WebGL controls, bilingual EN/TA switching, and manufacturer-verification warning notices remain verified and intact.

## Remaining Limitations
- Catalogue-derived geometry and animation remain illustrative concept prototypes pending physical manufacturer verification.
- Manufacturer assembly instructions and fastener specifications remain unpublished.
- A supplied high-resolution vector logo from Jenefas management should replace the catalogue-cover extraction when available.
- No deployment performed.
