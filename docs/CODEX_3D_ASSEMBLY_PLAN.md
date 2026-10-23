# Codex project guide: interactive product assembly
Updated: 2026-10-23. Owner: Mani / NaviGo Tech Solutions.

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
Planning documentation saved. Product 28 implementation has not been started by this documentation task.

## Mani's next Codex instruction
Read AGENTS.md and docs/CODEX_3D_ASSEMBLY_PLAN.md. Implement the Product 28 pilot described there. Run the available checks and provide a local preview with your verification report. Do not deploy.
