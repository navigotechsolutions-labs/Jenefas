# Codex project guide: interactive product assembly
Updated: 2026-10-24. Owner: Mani / NaviGo Tech Solutions.

## Confirmed direction
Use Codex for the full project. Claude Code is not part of the selected workflow.
Extend the existing Jenefas website with interactive assembly demonstrations that help customers understand products delivered as separate components.
The client reports 94 products; this is not yet a verified structured catalogue count. Do not confuse this with the smaller prototype JSON dataset.

## First pilot
Product code 28: Table Top Stand, Laser Rectangle Flat Base • Direct Rail.
Reference: https://jenefas.com/images/page_7.png
Website: https://jenefas.com/
Repository: https://github.com/navigotechsolutions-labs/Jenefas

The viewed catalogue illustration shows a rectangular base, one vertical post and two horizontal mounting rails. Select this product for the initial pilot without asking Mani to choose again. Product 1 (Fixed Wall Bracket) and 6/7 (Fixed Super Wall Bracket) were also discussed, but are not the current implementation target. No exhaustive comparison of all 94 products has been completed.

Catalogue imagery supports an approximate visual prototype, not a verified installation guide. Exact dimensions, hidden connections, fasteners, hole geometry and assembly sequence remain unknown.

## Delivery plan
1. Inspect repository instructions, existing source, package scripts and reference imagery.
2. Build an isolated Product 28 procedural 3D model and responsive viewer.
3. Implement exploded-to-assembled animation, stage navigation and bilingual explanations.
4. Verify controls, mobile layout, visual correspondence and existing site behavior.
5. Show the prototype to the client and obtain physical assembly verification.
6. Correct geometry and instructions using verified information.
7. Group the remaining catalogue into assembly families; prioritize reusable configurations only after reviewing the products.
8. Integrate verified guides into product pages. A packaging QR link can be considered later.

## Copy-ready Codex implementation prompt

Build a working interactive 3D assembly prototype for Jenefas Product Code 28 inside this repository.

Read AGENTS.md and this document first. Inspect the existing source, dependencies and scripts. Preserve existing functionality and follow the current stack. Do not replace the website or migrate frameworks unnecessarily.

Inspect https://jenefas.com/images/page_7.png or its matching repository asset. If neither is accessible, report the limitation and do not claim visual accuracy.

Goal: show the main components separately, then animate them into their assembled positions so customers understand the overall structure.

Use Three.js with the existing tooling. For a static site, create an isolated ES-module demo with pinned dependencies; for a framework, use its normal routing and build process. Do not assume opening file:// will work: document the actual preview command.

Create separately named procedural meshes for the rectangular base, vertical post and two mounting rails. Approximate their visual proportions from the catalogue. Use black powder-coated metal styling, neutral surroundings, subtle lighting and soft shadows. Keep unknown connections schematic. Do not invent exact screws, torque values, load ratings, dimensions or installation methods.

Include:
- Drag to rotate and pinch/scroll to zoom.
- Previous/Next stage, Play/Pause, Assemble/Explode and Reset view.
- A continuous exploded-to-assembled progress slider.
- Active-component highlight, component name and concise stage explanation.
- An optional generic TV silhouette, clearly labeled as an illustration.
- English/Tamil toggle with simple, accurate Tamil.
- Large mobile touch targets, keyboard operation, accessible names and focus states.
- Reduced-motion handling.
- Loading/error states and a useful fallback when WebGL is unavailable.
- Responsive resizing and camera framing that keeps exploded parts visible.

Illustrative animation stages:
1. Show separate main components.
2. Bring the post and base together.
3. Move the two rails into their illustrated positions.
4. Show the completed stand and optional TV silhouette.
These stages are illustrative, not a verified installation sequence. Do not show an invented TV attachment mechanism.

Display: "Concept demo based on catalogue imagery. Assembly details require manufacturer verification."

Separate product configuration, scene construction, animation state and UI logic. Store component names, approximate proportions, assembled/exploded transforms and bilingual stage text in configuration so future products can reuse the viewer. Keep implementation details out of customer-facing UI.

Implement the working demo, not merely a plan. Keep changes isolated and reversible and provide a discoverable preview link. Do not deploy or publish.

Run appropriate existing checks and build scripts. If browser tooling is available, inspect desktop/mobile views and exercise every control, including slider scrubbing, pause/resume, reset, repeated actions and resizing. Check console errors, missing assets, animation discontinuities and unintended existing-site regressions. State any checks that were unavailable.

Report files changed, the exact run command and demo URL/path, verified behavior, remaining assumptions and manufacturer inputs needed. Update this document with actual completion status and next actions. Do not ask Mani to select another product.

## Manufacturer verification needed
- All supplied components laid out, with counts and labels.
- Front/back/side close-ups of each connection and rail.
- Relevant measurements, hole locations and included hardware list.
- A short actual assembly video or approved instruction sheet.
- Approved TV attachment method, compatibility and load information.
Do not treat this list as a blocker for an explicitly labeled concept prototype.

## Acceptance criteria
- Working 3D view and every listed control behave coherently.
- Approximate visual relationship matches the reference.
- No unsupported engineering instructions or specifications.
- English and Tamil text work at mobile sizes.
- Existing catalogue and enquiry behavior remain functional.
- Run instructions are reproducible; actual checks and limitations are reported.
- No deployment without a later instruction.

## Current status
Product 28 implementation is complete as a local concept pilot. Build, four unit tests and three Chromium browser scenarios passed. See the implementation record below for actual scope, limitations and manufacturer verification still needed. No deployment or publication has been performed.

## Next actions
Review the local pilot, obtain manufacturer evidence, and validate geometry, connections, assembly sequence and bilingual copy before treating it as an accurate assembly guide. Do not deploy without a separate instruction.

---

# Product 28 implementation and verification record

Updated: 24 October 2026 (Asia/Calcutta). Status: implemented and verified locally; repository update prepared; no deployment or publication.

## Repository and reference inspection

- `AGENTS.md` and this plan file were absent from the initial local checkout. On 24 October, a remote fetch found both files in two newer documentation commits. Their instructions were read, those commits were preserved, and the original guide above was merged with this actual implementation record.
- The existing stack was one static `index.html`, inline JavaScript, CDN Tailwind/Lucide, and `data/products.json`. The only original npm script was `start: npx serve .`; there was no existing build or test suite.
- Repository remote: `https://github.com/navigotechsolutions-labs/Jenefas.git`.
- Actual reference: `https://jenefas.com/images/page_7.png`, downloaded successfully and visually inspected. A web browsing fetch timed out, but the direct HTTPS download succeeded. The inspected image is preserved at `demos/product-28/assets/page_7.png` (1333 × 993 pixels).
- The upper-right Product 28 panel reads “Table Top Stand” and “Laser Rectangle Flat Base • Direct Rail.” It visibly shows a rectangular flat base, one round vertical post, and **two horizontal mounting rails**. Product 27's vertical TV brackets and Product 29's V base are not used.
- The illustration suggests attachment collars/slots but does not establish their geometry, mechanics, or installation sequence. The pilot omits these details. Catalogue marketing specifications are not treated as verified engineering data.

## Delivered implementation

- Isolated local route: `/demos/product-28/`. A single link under the existing digital catalogue heading makes it discoverable on desktop and mobile. Existing catalogue data, navigation, filters, quote flows, styling and external dependencies remain intact.
- Four named Three.js meshes, with black metal material, directional/hemisphere lighting, soft shadow filtering and a neutral ground/background. The active part receives an orange highlight.
- Staged exploded-to-assembled interpolation with smoothstep easing, continuous range scrubbing, bidirectional transitions, Previous/Next, Play/Pause, Assemble/Explode and Reset view.
- Drag/touch orbit, wheel/pinch zoom, arrow-key camera rotation, +/− zoom and Home reset. Orbit limits keep the camera above the ground; reset adapts to narrow viewports. Device pixel ratio is capped at 2.
- English/Tamil UI, localized part explanations and accessible names, keyboard-operable native controls, visible focus, a live active-part explanation, and reduced-motion support. Reduced motion makes stage/endpoint changes immediate and disables automatic playback with an explanation. Media preference changes are handled live.
- On mobile the timeline appears directly after the viewer, before the longer part descriptions. Controls wrap, with a minimum 44px button height. The canvas captures gestures only inside the model area.
- The exact required English note remains visible in both languages, with a Tamil translation added when selected: “Concept demo based on catalogue imagery. Assembly details require manufacturer verification.”
- Backgrounding pauses progress to avoid hidden assembly jumps. Animation reversal starts from the current continuous position. WebGL failure/context loss displays a localized error; static references and selectable part descriptions remain available.
- The optional TV illustration was omitted to keep all four product parts visible.
- No extra fasteners, hole patterns, physical dimensions, load claims or verified installation steps are presented. Scene values are arbitrary visual proportions.

## Code structure and future products

| File | Responsibility |
| --- | --- |
| `demos/product-28/src/product.js` | Product identity, component shapes, illustrative proportions, endpoints and timing intervals |
| `demos/product-28/src/scene.js` | Geometry, materials, lights, camera, orbit/keyboard controls, resize and rendering |
| `demos/product-28/src/animation.js` | Framework-independent progress, playback, stage selection and component interpolation |
| `demos/product-28/src/main.js` | Interface bindings, localized rendering, motion preference and page lifecycle |
| `demos/product-28/src/i18n.js` | English/Tamil strings and part explanations |
| `demos/product-28/index.html`, `styles.css` | Accessible page structure and responsive presentation |
| `scripts/build.mjs` | Copies the existing site/data and demo assets into `dist/`; bundles Three.js and pilot code using esbuild |

Three.js is an npm runtime dependency; esbuild, serve and Playwright are development dependencies. A lockfile makes installs reproducible. `compression` is overridden to the patched `^1.8.2` range because serve otherwise brings in a vulnerable version. No external script, font, model or texture service is required by the pilot after building.

The configuration/scene/state separation supports another product's geometry and timing. State navigation and the interface derive the number of stages from the configured part count. A future product supplies its own configuration and translated descriptions. A general product selector and a multi-product catalogue integration remain future work.

## Run locally

```powershell
npm ci
npm start
```

Open `http://localhost:3000/demos/product-28/`. The existing catalogue is at `http://localhost:3000/`.

`npm start` now builds first and serves `dist/` using the existing static-server approach. Do not open the source demo HTML directly: its `viewer.js` bundle is generated into `dist/demos/product-28/`.

```powershell
npm run build
npx playwright install chromium
npm test
npm audit
```

## Verification results

- `npm run build`: passed. This is the newly added static build; no pre-existing build command was available.
- `npm test`: passed, **4 unit tests and 3 Chromium browser scenarios**.
- Unit checks: exact exploded/assembled endpoints for all four parts; 1000-sample continuous position bounds; pause, reversal and slider seek; stage boundary behavior; reduced-motion navigation; large-frame delta clamping and completion.
- Desktop Chromium at 1440 × 1000: all requested controls, replay, pause stability, endpoint navigation, mid-animation reversal, stage selection, language switching, keyboard range input, camera keys, drag, wheel zoom and reset exercised. Canvas pixels change with camera interaction. Keyboard focus outline verified.
- Mobile Chromium emulation at 390 × 844: every stage and endpoint, keyboard stage activation, Tamil, live reduced-motion switching, touch drag and two-finger pinch exercised through Chromium input events. Touch interaction visibly changes canvas pixels. Timeline precedes descriptions.
- Width checks at 320px, 390px and 844px landscape: no horizontal document overflow. Canvas uses ResizeObserver, updates camera aspect, and reframes when crossing the narrow-layout threshold.
- No page JavaScript errors, console errors, missing requests or HTTP asset failures occurred in the desktop/mobile pilot scenarios.
- WebGL-disabled scenario: clear error, disabled unavailable playback controls, working static part descriptions and translated reference content.
- Desktop exploded/assembled, mobile Tamil and mobile landscape screenshots were captured in ignored `test-results/`. Desktop and mobile visual review found the full product visible at default/reset framing, with no accidental near-plane clipping or clipped controls/text.
- `npm audit`: passed, zero known vulnerabilities at verification time.
- `git diff --check`: passed; Git prints the workspace's normal LF-to-CRLF notices.

Not performed: real iOS/Android hardware testing, Safari/Firefox, performance measurements on low-end GPUs, assistive-technology/screen-reader audit, native Tamil speaker review, physical fit/load/safety verification, or manufacturer validation. Browser testing used headless Chromium with software WebGL. Context-loss messaging is implemented; the explicit failure test covers unavailable WebGL, not induced loss/restoration. No deployment/publishing commands were run.

## Remaining assumptions and required manufacturer evidence

The model uses a round post and two straight horizontal rails based on the illustration. Component lengths, spacing, thickness, post/base placement, materials/finish, attachment relationships, and the four-stage order remain illustrative. Unknown interfaces are shown by simple contact, with no claimed joint mechanics. This is a visual concept, not an assembly guide.

For an accurate guide, obtain:

1. Front, rear, side and underside photos of the actual **Product 28**, plus a complete laid-out parts photo with part identifiers and a scale reference. Include close-ups of both rail-to-post joints, post-to-base joint, rail ends and TV attachment surfaces.
2. Base length/width/thickness, post outside diameter/height, rail length/cross-section, rail centre spacing, offsets and any adjustment ranges, preferably a dimensioned drawing or manufacturer CAD. Verify actual mounting slot/hole locations rather than deriving them from the catalogue.
3. Confirmed bill of materials, whether collars/adapters are separate parts, factory-fixed versus user-assembled joints, supplied fastener identifiers, thread types/lengths, washers/spacers and tools. Include torque specifications only if the manufacturer provides them.
4. Manufacturer-approved assembly order, orientation/locking details, adjustment procedure and inspection points, supported by an installation manual or recorded demonstration.
5. Manufacturer-confirmed TV attachment interface/compatibility, load/stability limits and test basis, handling requirements, warnings and approval of the final English/Tamil instructions.

Next work: replace schematic geometry with approved product evidence, validate the sequence and safety content, review Tamil copy, then test representative mobile hardware and other browsers.

## Product 28 Pilot Improvements (October 24, 2026)
1. **Explicit Evidence vs. Unknown Identification:**
   - Enriched the active component panel with real-time bilingual evidence badges:
     - `Observed in catalogue` (`பட்டியலில் காணப்படுவது`): confirmed features from Catalogue Page 7.
     - `Unknown / Needs verification` (`சரிபார்க்கப்படாத விவரங்கள்`): unverified fasteners, plate gauge, tube OD, TV mounting slots.
2. **Evaluation & Production Readiness Gate:**
   - Added an on-page Evaluation card summarizing completed prototype capabilities vs. blocked physical manufacturer dependencies.
   - Unpublished physical fastening instructions remain protected until verified.
3. **Manufacturer Checklist Created:**
   - Created `docs/PRODUCT_28_MANUFACTURER_CHECKLIST.md` detailing 5 photographic angles, dimensional tables, BOM fastener inventory, and publication gate criteria.
4. **Automated Verification:**
   - 4 unit tests (`tests/animation.test.mjs`) passing.
   - 3 Chromium browser integration scenarios (`tests/browser/product-28.spec.js`) passing, validating evidence rendering, Tamil localization, touch orbit/pinch, reduced motion, and WebGL error handling.

## Deployment status
- **Date:** 2026-10-24
- **Platform:** Netlify (`navigotechsolutions` team)
- **Live Site URL:** https://jenefas.netlify.app/
- **Production Deploy ID:** `6adca46e14de8ac0851ea433`
- **Deployed Commit:** `f16d45f` (integrated with Product 29)
- **Verified Working Routes:**
  - Catalogue: https://jenefas.netlify.app/
  - Product 28 Pilot: https://jenefas.netlify.app/demos/product-28/
  - Product 29 Pilot: https://jenefas.netlify.app/demos/product-29/
- **Netlify Configuration:**
  - Production Branch: `master`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
  - Configuration File: `netlify.toml`
- **Netlify Project Admin:** https://app.netlify.com/projects/jenefas
- **GitHub Continuous Deployment Status:** **Not Connected**. The Netlify site `jenefas` was created and published via Netlify CLI (`deploy_source: "cli"`). It is not connected via a GitHub OAuth application or webhook integration (`build_settings` is empty in Netlify API). Adding `netlify.toml` standardizes build commands and publish directories for local and CI environments, but does **not** enable automatic deployments on git push until the GitHub repository is connected in Netlify admin settings.

## Production Verification & Remaining Limitations
- **Verification Completed:**
  - All static assets (HTML, viewer.js, styles.css, page_7.png, products.json) return HTTP 200 OK without catch-all redirects.
  - Interactive stage selection, bilingual English/Tamil toggling, and camera controls verified live.
  - 5 unit tests and 6 Playwright browser integration tests passing.
- **Remaining Limitations:**
  - Geometry and animation for both Product 28 and Product 29 remain illustrative concepts derived from catalogue imagery.
  - Step-by-step physical fastening and installation instructions remain unpublished pending physical manufacturer verification (see `docs/PRODUCT_28_MANUFACTURER_CHECKLIST.md` and `docs/PRODUCT_29_EVALUATION.md`).
