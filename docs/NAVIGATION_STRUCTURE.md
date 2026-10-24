# Customer navigation update

The home page now has: Products, Find a Mount, Assembly Demos, About Us,
Contact & Store, and a distinct Request a Quote action.

A dedicated assembly-demo section explains the current verification limits and
links to Product 28 and 29. Both demos link back to that section and across to
the other product. Existing catalogue filters and enquiry handlers are retained.

At 1100px and below, a menu button controls the navigation with aria-expanded,
Escape dismissal/focus return, close-on-selection and outside-click dismissal.
Desktop layout restores automatically at larger widths. Skip-to-content,
a main landmark, focus styles and anchor scroll offsets are included.

Validation: static build passed; five unit tests passed; HTML checks verified
unique IDs, one main landmark and valid same-page section targets on all three
pages. Two browser journeys were added but not executed: Chromium installation
failed with a truncated download. Visual/mobile browser review remains pending.
No deployment. Based on review/deployed-production-release to preserve PR #2.
