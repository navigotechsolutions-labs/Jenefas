/**
 * SYNTHETIC TEST FIXTURES ONLY
 *
 * NOT FOR PRODUCTION USE.
 * These fixtures exist exclusively for automated unit and browser test validation
 * of clamp product parameter schemas and verified 3D coordinate highlighting.
 * No synthetic specifications, coordinates, or assumed fastener items may be
 * imported by production runtime bundles.
 */

export const SYNTHETIC_FIXTURE_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  IS_TEST_ONLY: true,
};

/**
 * Synthetic clamp product measurements fixture.
 * Used exclusively by test suites to verify clamp product schema calculations.
 */
export const syntheticClampMeasurements = [
  {
    id: 'overallWidth',
    nameKey: 'overallWidth',
    category: 'overall',
    partId: null,
    value: 115,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[-0.575, 0, 0], [0.575, 0, 0]],
  },
  {
    id: 'overallHeight',
    nameKey: 'overallHeight',
    category: 'overall',
    partId: null,
    value: 540,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[0, 0, 0], [0, 5.4, 0]],
  },
  {
    id: 'overallDepth',
    nameKey: 'overallDepth',
    category: 'overall',
    partId: null,
    value: 500,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[0, 0, -2.5], [0, 0, 2.5]],
  },
  {
    id: 'clampOpening',
    nameKey: 'clampOpening',
    category: 'clamp',
    partId: 'clamp',
    min: 10,
    max: 95,
    value: null,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic caliper test record',
    note: 'Mechanical clearance between upper fixed jaw and lower pressure foot at maximum thread extension.',
    points: [[0, 0.1, 0], [0, 0.95, 0]],
  },
  {
    id: 'supportedDeskThickness',
    nameKey: 'supportedDeskThickness',
    category: 'clamp',
    partId: 'clamp',
    min: 10,
    max: 85,
    value: null,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic clamping guideline fixture',
    note: 'Recommended safe desk thickness range. Distinct from clamp opening; includes 10 mm margin for anti-scratch pad and thread engagement.',
    points: [[0, 0.1, 0], [0, 0.85, 0]],
  },
  {
    id: 'jawWidth',
    nameKey: 'jawWidth',
    category: 'clamp',
    partId: 'clamp',
    value: 110,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[-0.55, 0, 0], [0.55, 0, 0]],
  },
  {
    id: 'jawDepth',
    nameKey: 'jawDepth',
    category: 'clamp',
    partId: 'clamp',
    value: 75,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[0, 0, -0.375], [0, 0, 0.375]],
  },
  {
    id: 'throatDepth',
    nameKey: 'throatDepth',
    category: 'clamp',
    partId: 'clamp',
    value: 68,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    note: 'Usable horizontal reach from desk edge to clamp vertical column spine.',
    points: [[0, 0, 0], [0, 0, 0.68]],
  },
  {
    id: 'holeDiameter',
    nameKey: 'holeDiameter',
    category: 'mounting',
    partId: 'mounting',
    value: 8.5,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[-0.0425, 0, 0], [0.0425, 0, 0]],
  },
  {
    id: 'holeSpacing',
    nameKey: 'holeSpacing',
    category: 'mounting',
    partId: 'mounting',
    value: 60,
    unit: 'mm',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-SPEC-01',
    points: [[-0.3, 0, 0], [0.3, 0, 0]],
  },
];

/**
 * Synthetic clamp fasteners fixture.
 * Used exclusively by test suites to verify verified fastener 3D location logic and attribute rendering.
 */
export const syntheticClampFasteners = [
  {
    id: 'TEST-BOLT-01',
    nameKey: 'clampSpineBolt',
    stage: 1,
    partId: 'clamp',
    quantity: 2,
    diameter: 'M8',
    length: 35,
    unit: 'mm',
    headType: 'hexSocketCap',
    tool: 'allenKey6mm',
    washersSpacers: 'm8SpringWasher',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-BOM-01',
    approved: true,
    location: [0, 0.45, -0.2],
    locationKey: 'clampSpineLocation',
    note: 'Synthetic verified fastener test item.',
  },
  {
    id: 'TEST-SCREW-02',
    nameKey: 'clampPressureScrew',
    stage: 1,
    partId: 'clamp',
    quantity: 1,
    diameter: 'M10',
    length: 90,
    unit: 'mm',
    headType: 'swivelPadScrew',
    tool: 'manualKnobTBar',
    washersSpacers: 'antiScratchPad',
    status: SYNTHETIC_FIXTURE_STATUS.VERIFIED,
    source: 'Synthetic test drawing SYNTH-BOM-01',
    approved: true,
    location: [0, -0.1, -0.15],
    locationKey: 'clampPadLocation',
    note: 'Synthetic verified pressure screw test item.',
  },
];
