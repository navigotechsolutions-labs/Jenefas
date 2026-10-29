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
Product 28 and Product 29 implementations are complete as local concept pilots and deployed to Netlify production. Original brand identity (red/yellow logo and white/red frontend) is merged and deployed live.

## Next actions
Review the deployed pilots with the client, obtain manufacturer evidence, and validate geometry, connections, assembly sequence and bilingual copy before treating them as accurate assembly guides.

---

# Product 28 implementation and verification record

Updated: 24 October 2026 (Asia/Calcutta). Status: implemented and verified locally; repository update prepared; deployed to Netlify.

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
- `npm test`: passed, **5 unit tests and 8 Chromium browser scenarios**.
- Unit checks: exact exploded/assembled endpoints for all four parts; 1000-sample continuous position bounds; pause, reversal and slider seek; stage boundary behavior; reduced-motion navigation; large-frame delta clamping and completion; Product 29 V-base structure checks.
- Desktop Chromium at 1440 × 1000: all requested controls, replay, pause stability, endpoint navigation, mid-animation reversal, stage selection, language switching, keyboard range input, camera keys, drag, wheel zoom and reset exercised. Canvas pixels change with camera interaction. Keyboard focus outline verified.
- Mobile Chromium emulation at 390 × 844: every stage and endpoint, keyboard stage activation, Tamil, live reduced-motion switching, touch drag and two-finger pinch exercised through Chromium input events. Touch interaction visibly changes canvas pixels. Timeline precedes descriptions.
- Width checks at 320px, 390px and 844px landscape: no horizontal document overflow. Canvas uses ResizeObserver, updates camera aspect, and reframes when crossing the narrow-layout threshold.
- No page JavaScript errors, console errors, missing requests or HTTP asset failures occurred in the desktop/mobile pilot scenarios.
- WebGL-disabled scenario: clear error, disabled unavailable playback controls, working static part descriptions and translated reference content.
- Desktop exploded/assembled, mobile Tamil and mobile landscape screenshots were captured in ignored `test-results/`. Desktop and mobile visual review found the full product visible at default/reset framing, with no accidental near-plane clipping or clipped controls/text.
- `npm audit`: passed, zero known vulnerabilities at verification time.
- `git diff --check`: passed; Git prints the workspace's normal LF-to-CRLF notices.

Not performed: real iOS/Android hardware testing, Safari/Firefox, performance measurements on low-end GPUs, assistive-technology/screen-reader audit, native Tamil speaker review, physical fit/load/safety verification, or manufacturer validation. Browser testing used headless Chromium with software WebGL. Context-loss messaging is implemented; the explicit failure test covers unavailable WebGL, not induced loss/restoration.

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

## Measurement Display Support & Specification Engine (October 2026)
- **Status:** Implemented and verified locally across unit and browser test suites. **Not deployed.**
- **Architecture & Source Accuracy:**
  - Dedicated measurement module: `demos/product-28/src/measurements.js`.
  - Schema defines status (`verified` vs `pending`), values in millimetres (`mm`), sources, and notes. Missing or unverified values are strictly `null`.
  - Illustrative Three.js scene units are strictly kept separate and never multiplied or converted to mm.
  - Dimension arrows with invented values are strictly prohibited: for unverified parameters, the 3D scene renders zero lines or arrows, surfacing a clear "Measurement pending" (`அளவீடு நிலுவையில் உள்ளது`) notice instead.
  - Clamp product support: comprehensive schema defined (`clampProductMeasurements`) covering all 6 clamp parameters:
    1. Overall width, height, and depth
    2. Minimum and maximum clamp opening (mechanical jaw clearance)
    3. Supported desk/edge thickness range (safe clamping range with padding margin)
    4. Jaw width and depth
    5. Throat depth / usable horizontal reach
    6. Mounting hole diameter and centre-to-centre spacing
  - **Mechanical clamp opening vs. Supported desk thickness distinction:**
    - Mechanical clamp opening represents the physical clearance between bare jaw surfaces at maximum extension.
    - Supported desk thickness represents the manufacturer-recommended safe mounting range including margin for anti-scratch padding and minimum thread engagement.
  - **Product 28 and Product 29 Conformance:**
    - Both products are Table Top Stands (rectangular base and V-base respectively) and do not have clamps.
    - Zero clamp fields are attached to Products 28 and 29.
    - All 11 structural dimensions for Product 28 and 10 dimensions for Product 29 have `value: null` and `status: 'pending'`, requiring physical manufacturer drawings.
- **Interface & Viewer Controls:**
  - `Show Dimensions` / `Hide Dimensions` (`#toggle-measurements`) toggle button added.
  - Single measurement selector (`#measurement-select`) preventing label overlap.
  - Camera-projected 2D HTML badges (`#measurement-overlay`) pinned to 3D midpoints, ensuring crystal-clear legibility and zero mirroring/distortion during rotation and zooming.
  - Stage filtering: assembled view displays overall dimensions; selecting individual component stages filters to that component's dimensions.
  - Interactive matching measurement table (`#measurements-table`) beside/below the viewer with English/Tamil localization, status badges (`verified` / `pending`), and direct row selection.
  - Prominent technical disclaimers:
    - *"Animation movement is illustrative and does not represent an approved adjustment range."*
    - *"Scene units express visual proportions only. Illustrative units are not converted to millimetres."*
- **Validation & Test Coverage:**
  - 10 unit tests in `tests/measurements.test.mjs`, `animation.test.mjs`, and `product-29.test.mjs`.
  - 12 browser automation tests across `navigation.spec.js`, `product-28.spec.js`, `product-29.spec.js`, and `measurements.spec.js`.
  - All tests passing with zero errors.

## Fasteners Bill of Materials (BOM) & Step-Linked Specification (October 2026)
- **Status:** Implemented, audited for data accuracy, and verified locally across unit and browser test suites. **Not deployed.**
- **Architecture & Source Accuracy Correction:**
  - Fastener engine module: `demos/product-28/src/fasteners.js`.
  - **Zero Synthetic Fixtures in Production:** Synthetic clamp measurements and clamp fastener fixtures were relocated exclusively to `tests/fixtures/synthetic-test-fixtures.mjs`. Production modules export zero synthetic fixtures.
  - **Neutral Connection Records for Products 28 & 29:**
    - Catalogue Page 7 gives only schematic views without fastener callouts or joint methods.
    - Speculative hardware entries (`B1`, `W1`, `R1`, `R2`, `TV1`, `SP1`) were removed and replaced with neutral connection records:
      - `CONN-BASE-POST`: Base-to-Post Connection (Stage 1)
      - `CONN-LOWER-RAIL`: Lower Rail-to-Post Connection (Stage 3)
      - `CONN-UPPER-RAIL`: Upper Rail-to-Post Connection (Stage 4)
      - `CONN-TV-MOUNT`: Television Interface / Attachment (Stage 4)
    - Named screws, washers, or spacers are only shown when supported by confirmed physical evidence. All hardware, diameter, length, head type, tool, and washer fields remain strictly `null`.
    - Manufacturer checklist status: checklist documents (`docs/PRODUCT_28_MANUFACTURER_CHECKLIST.md`) identify missing information and are never treated as proof of verification.
    - Verified installation locations require both recorded manufacturer approval (`approved === true`) and confirmed source reference (`source != null`) before any 3D pins, rings, or instructions render.
  - **Customer-Facing Status Messaging:**
    - Unverified connections display simple customer-facing pending text: `"Pending verification"` / `"உறுதிப்படுத்தல் நிலுவையில் உள்ளது"`.
    - Unverified installation locations display: `"Pending manufacturer verification"`.
    - Zero invented tightening torque or wall-anchor suitability claims.
- **Interface & Viewer Integration:**
  - Interactive Fasteners Table (`#fasteners-table`) beside a detailed specification card (`#fastener-detail-card`).
  - Clicking any connection in the list highlights its row, seeks the 3D animation to the linked step, and displays its specification.
  - Stage synchronization: scrubbing or selecting an assembly step synchronizes the highlighted connection record.
  - Preserves 3D viewer, measurement toggle/filtering, and bilingual English/Tamil interface.
  - Replaced developer-facing evaluation checklist with customer-facing "Guide Status" card on both Product 28 and Product 29.
  - Fully translated guide navigation (`allDemos`, `currentProduct`, `otherGuide`, `guideNavAria`) in English and Tamil.
  - WebGL fallback: when WebGL is unavailable, the 3D canvas displays a helpful localized message while catalogue images, part descriptions, measurements table, connection table, and language switching remain fully interactive.
- **Validation & Test Coverage:**
  - 18 unit tests passing (`tests/*.test.mjs`), including strict assertions that production bundles export zero synthetic clamp fixtures, Products 28 and 29 use neutral connection records, and approval gates enforce recorded evidence.
  - 15 browser automation tests passing (`playwright test`).
  - Responsive visual inspection confirmed at 320px, 390px, and 1440px across both product guides.

## Deployment status
- **Date:** 2026-10-24
- **Platform:** Netlify (`navigotechsolutions` team)
- **Live Site URL:** https://jenefas.netlify.app/
- **Production Deploy ID:** `6adcc66f4a09d55dc3fc53fd`
- **Deployed Commit:** `1a308f9` (merged PR #4 with SVG isolation fixes into `master`)
- **Verified Working Routes:**
  - Catalogue & Original Branding: https://jenefas.netlify.app/
  - Product 28 Pilot: https://jenefas.netlify.app/demos/product-28/
  - Product 29 Pilot: https://jenefas.netlify.app/demos/product-29/
- **Netlify Configuration:**
  - Production Branch: `master`
  - Build Command: `npm run build`
  - Publish Directory: `dist`
  - Configuration File: `netlify.toml`
- **Netlify Project Admin:** https://app.netlify.com/projects/jenefas
- **GitHub Continuous Deployment Status:** **Not Connected**. The Netlify site `jenefas` was created and published via Netlify CLI (`deploy_source: "cli"`). It is not connected via a GitHub OAuth application or webhook integration (`build_settings` is empty in Netlify API). Adding `netlify.toml` standardizes build commands and publish directories for local and CI environments, but does **not** enable automatic deployments on git push until the GitHub repository is connected in Netlify admin settings.

## Production Verification & Actual Check Results (Deploy ID: `6adcc66f4a09d55dc3fc53fd`)
- **Verification Completed Live on `https://jenefas.netlify.app/`:**
  - **Original Brand Logo:** Renders crisply across homepage and both demo headers/footers with red oval and yellow "Something DIFFERENT" slogan.
  - **Catalogue Image Isolation:** SVG `<clipPath>` ensures zero bleed from adjacent TV screens or clamp graphics in hero or guide cards.
  - **White/Red Theme:** Professional white/light slate layout with Jenefas red buttons and accents. Zero leftover orange rules.
  - **Desktop Navigation (1440px):** `#main-menu` is visible with all links. "Request a Quote" button opens `#rfqModal` Wholesale RFQ dialog; closing dialog functions properly without submitting enquiries.
  - **Mobile Navigation (390px):** `#menu-toggle` renders correctly with zero horizontal overflow. Menu drawer toggles open (`aria-expanded="true"`); pressing `Escape` dismisses the drawer, resets `aria-expanded="false"`, and restores keyboard focus to `#menu-toggle`. Selecting "Assembly Demos" navigates to `#assembly-guides` and auto-closes the mobile drawer.
  - **Assembly Demos Hub (`#assembly-guides`):** Section displays cards for both Product 28 and Product 29 with direct working navigation links (`demos/product-28/` and `demos/product-29/`).
  - **Return Breadcrumb & Cross-Guide Links:** Both demo pages offer a return link to `/#assembly-guides` and direct cross-guide links to each other (`/demos/product-28/` $\leftrightarrow$ `/demos/product-29/`).
  - **Product 28 Pilot Controls & Assets:** Play/Pause toggles, Assemble/Explode transitions, timeline slider scrubbing, stage buttons (5 stages), WebGL canvas rendering (`webgl-active`), English/Tamil bilingual toggle, and reference catalogue image (`page_7.png`) all verified live.
  - **Product 29 Pilot Controls & Assets:** Play/Pause toggles, Assemble/Explode transitions, timeline slider scrubbing, stage buttons (5 stages), WebGL canvas rendering (`webgl-active`), English/Tamil bilingual toggle, and reference catalogue image (`page_7.png`) all verified live.
  - **Manufacturer Verification Notices:** Prominently visible on both pilots (`.concept-badge` and `#verification-note`).
- **Remaining Limitations:**
  - Geometry and animation for both Product 28 and Product 29 remain illustrative concept prototypes derived from catalogue Page 7.
  - Precise physical fastening steps, fastener specifications, hole geometry, and TV mounting attachments remain unpublished until physical manufacturer verification is received (see `docs/PRODUCT_28_MANUFACTURER_CHECKLIST.md` and `docs/PRODUCT_29_EVALUATION.md`).

## Mobile TV trolley video-style concept (28 October 2026)
- Implemented locally at `/demos/trolley-guide/`, separate from Products 28 and 29; not deployed. The assembly hub links to it.
- Seven illustrative chapters, continuous playback and seeking, camera orbit/zoom and reset, optional TV, English/Tamil subtitles and optional browser speech. Shop-video mode explicitly reports that no verified chapter clip is available. Existing video files have not been mapped to steps or verified as assembly footage.
- Dimensions, compatibility, attachment, tools and assembly order have not been independently verified; no fastening procedure is asserted. Manufacturer review of geometry, sequence, narration, Tamil and clip mapping remains necessary before use as a physical guide.
- `npm run build` and 37 existing unit tests passed. Headless Chromium smoke checks at 320 and 1440 pixels exercised next, Tamil, view switching and play/pause, with no page errors or horizontal overflow. Actual voice availability, physical devices, full playback and verified shop clips remain untested.
- Follow-up local validation: 37 unit tests and all 26 pre-existing browser tests passed; two new trolley browser tests passed. They cover all chapter selections, seek to completion and replay, Tamil, video fallback, playback from video mode, 320px overflow and focus during playback. Corrected video-mode playback and chapter focus replacement. Uninterrupted full-duration playback and real speech output remain unverified.
- Deployment update: deployed the static build to Hostinger at https://jenifas.navigotechsolutions.com/ on 28 October 2026, including `/demos/trolley-guide/`. Unverified shop video/image files were excluded from the deploy. Live Chromium smoke check confirmed the home page, guide link, canvas and playback; corrected an intermittent negative frame-time issue and redeployed. The targeted local browser rerun was blocked by an occupied port; the earlier targeted suite passed before that timing fix.
- Cinematic follow-up: implemented locally with chapter-specific camera framing and on-screen bilingual captions. Camera motion stops on manual orbit and respects reduced-motion preferences. Build passed; Chromium smoke checks at 320px and 1440px checked playback, chapter navigation, Tamil captions and overflow without page errors. This follow-up has not been deployed.
- Shop footage review: sampled five frames across each of 11 supplied videos (not a complete frame-by-frame or audio review). Footage shows base/wheel work, upright supports, cross member, shelf support and shelf, horizontal TV plate, and adapter rails; no mounted TV was observed in the sampled frames. Existing trolley model's base and shelf support are schematic and differ from the visible product; revise after detailed review and manufacturer confirmation. Do not treat tool sizes, compatibility or exact fastening as confirmed from sampled footage.
- Detailed footage review: sampled every two seconds and recorded observed motions, approximate timestamps, obscured joints and manufacturer questions in `docs/TROLLEY_FOOTAGE_MOTION_REVIEW.md`. Audio and intervening frames were not reviewed. Prior generated fastener concepts are illustrative and may contain invented hardware.
- Added `docs/TROLLEY_VIDEO_STORYBOARD.md`, organizing generated daylight concepts and source footage into a proposed 68-second sequence. This is an edit plan only; no video has been rendered, and the 3D viewer has not been updated to match the generated concepts.
- Rendered a local 68-second 960×540 H.264 storyboard preview at `scratch/trolley-preview/trolley-storyboard-preview.mp4` using concept stills, fades and English chapter labels. No voice or part animation is present; it is a pacing preview and has not been deployed. ffprobe verified duration and video format; one frame was visually inspected.
- Shelf-motion prototype implemented locally: separate schematic projecting supports move toward the columns, then the shelf plate descends. Timing is seekable and bilingual description updated. Camera shot adjusted for the shelf. No screw or tool motion is asserted while exact placement remains unverified. Build and shelf-motion unit test passed; Chromium smoke checks at 320px and 1440px exercised seeking through the sequence without page errors or overflow. Not deployed; other trolley geometry and connection details still need revision against footage.
- Follow-up 3D concept: locally replaced the simple base with four splayed arms and separated the two adapter-rail movements from the optional TV silhouette. The shelf support/plate sequence remains separate and seekable. Build, shelf-motion unit test and 320px/1440px Chromium smoke checks passed; no page errors or overflow observed. Geometry, timing, screw mechanics and installation steps remain illustrative; no manufacturer approval or deployment.
