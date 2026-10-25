import test from 'node:test';
import assert from 'node:assert/strict';
import { product28 } from '../demos/product-28/src/product.js';
import { product29 } from '../demos/product-29/src/product.js';
import * as prodFasteners from '../demos/product-28/src/fasteners.js';
import {
  FASTENER_STATUS,
  hasManufacturerApproval,
  formatFastenerField,
  filterFastenersByStage,
} from '../demos/product-28/src/fasteners.js';
import {
  syntheticClampFasteners,
  SYNTHETIC_FIXTURE_STATUS,
} from './fixtures/synthetic-test-fixtures.mjs';
import { messages as messages28 } from '../demos/product-28/src/i18n.js';
import { messages as messages29 } from '../demos/product-29/src/i18n.js';

test('Production fasteners module exports zero synthetic fixtures', () => {
  assert.equal(
    prodFasteners.verifiedClampFasteners,
    undefined,
    'Production fasteners.js must NOT export verifiedClampFasteners or any synthetic fixtures'
  );
  assert.equal(
    prodFasteners.syntheticClampFasteners,
    undefined,
    'Production fasteners.js must NOT export syntheticClampFasteners'
  );
});

test('Isolated synthetic clamp fastener fixture is explicitly marked as test-only', () => {
  assert.equal(SYNTHETIC_FIXTURE_STATUS.IS_TEST_ONLY, true);
  assert.ok(syntheticClampFasteners.length > 0);
  const c1 = syntheticClampFasteners.find(f => f.id === 'TEST-BOLT-01');
  assert.ok(c1);
  assert.equal(c1.status, FASTENER_STATUS.VERIFIED);
  assert.equal(c1.approved, true);
  assert.equal(c1.diameter, 'M8');
  assert.equal(c1.length, 35);
  assert.equal(c1.tool, 'allenKey6mm');
  assert.equal(c1.washersSpacers, 'm8SpringWasher');
  assert.ok(Array.isArray(c1.location) && c1.location.length === 3);

  // Approval gate works on synthetic verified item
  assert.equal(hasManufacturerApproval(c1), true);

  // Approval gate fails if not approved or missing source/location
  assert.equal(hasManufacturerApproval({ ...c1, approved: false }), false);
  assert.equal(hasManufacturerApproval({ ...c1, source: null }), false);
  assert.equal(hasManufacturerApproval({ ...c1, location: null }), false);
  assert.equal(hasManufacturerApproval({ ...c1, status: FASTENER_STATUS.PENDING }), false);
});

test('Product 28 and 29 use neutral connection records where component existence is unconfirmed', () => {
  const expectedConnIds = [
    'CONN-BASE-POST',
    'CONN-LOWER-RAIL',
    'CONN-UPPER-RAIL',
    'CONN-TV-MOUNT',
  ];

  const p28Ids = product28.fasteners.map(f => f.id);
  assert.deepEqual(p28Ids, expectedConnIds, 'Product 28 must use neutral connection records');

  const p29Ids = product29.fasteners.map(f => f.id);
  assert.deepEqual(p29Ids, expectedConnIds, 'Product 29 must use neutral connection records');

  // Verify none of the assumed hardware items (B1, W1, R1, R2, TV1, SP1) exist
  const forbiddenAssumedIds = ['B1', 'W1', 'R1', 'R2', 'TV1', 'SP1'];
  for (const id of forbiddenAssumedIds) {
    assert.equal(p28Ids.includes(id), false, `Assumed hardware ID ${id} must not be present`);
    assert.equal(p29Ids.includes(id), false, `Assumed hardware ID ${id} must not be present`);
  }
});

test('All neutral connection records maintain null specifications and pending verification status', () => {
  const requiredAttributes = [
    'id',
    'nameKey',
    'stage',
    'partId',
    'hardware',
    'quantity',
    'diameter',
    'length',
    'headType',
    'tool',
    'washersSpacers',
    'status',
    'approved',
    'source',
    'location',
  ];

  for (const f of [...product28.fasteners, ...product29.fasteners]) {
    for (const attr of requiredAttributes) {
      assert.ok(attr in f, `Connection ${f.id} must have attribute '${attr}'`);
    }
    assert.equal(f.status, FASTENER_STATUS.PENDING, `Connection ${f.id} status must be pending`);
    assert.equal(f.approved, false, `Connection ${f.id} must not be approved without manufacturer confirmation`);
    assert.equal(f.source, null, `Connection ${f.id} source must be null`);
    assert.equal(f.hardware, null, `Connection ${f.id} hardware must be null`);
    assert.equal(f.quantity, null, `Connection ${f.id} quantity must be null`);
    assert.equal(f.diameter, null, `Connection ${f.id} diameter must be null`);
    assert.equal(f.length, null, `Connection ${f.id} length must be null`);
    assert.equal(f.headType, null, `Connection ${f.id} headType must be null`);
    assert.equal(f.tool, null, `Connection ${f.id} tool must be null`);
    assert.equal(f.washersSpacers, null, `Connection ${f.id} washersSpacers must be null`);
    assert.equal(f.location, null, `Connection ${f.id} location must be null`);

    // Gate check must be false
    assert.equal(hasManufacturerApproval(f), false, `Connection ${f.id} must not pass approval check`);

    // Customer-facing pending text formatting
    assert.equal(formatFastenerField(f.diameter, 'Pending verification'), 'Pending verification');
    assert.equal(
      formatFastenerField(f.diameter, 'உறுதிப்படுத்தல் நிலுவையில் உள்ளது'),
      'உறுதிப்படுத்தல் நிலுவையில் உள்ளது'
    );
  }
});

test('Never invent tightening torque, wall-anchor suitability, or connection methods', () => {
  for (const f of [...product28.fasteners, ...product29.fasteners]) {
    assert.equal(f.torque, undefined, `Connection ${f.id} must not invent tightening torque`);
    assert.equal(f.wallAnchorSuitability, undefined, `Connection ${f.id} must not invent wall-anchor suitability`);
    assert.ok(!f.note || !f.note.includes('Nm'), `Connection note ${f.id} must not invent torque values`);
    assert.ok(!f.note || !f.note.toLowerCase().includes('wall plug'), `Connection note must not claim wall plugs`);
  }
});

test('filterFastenersByStage accurately groups connection records by assembly stage', () => {
  // Stage 1 (Base & Post)
  const stage1 = filterFastenersByStage(product28.fasteners, 1);
  assert.equal(stage1.length, 1);
  assert.equal(stage1[0].id, 'CONN-BASE-POST');

  // Stage 3 (Lower Rail)
  const stage3 = filterFastenersByStage(product28.fasteners, 3);
  assert.equal(stage3.length, 1);
  assert.equal(stage3[0].id, 'CONN-LOWER-RAIL');

  // Stage 4 (Upper Rail & TV Interface)
  const stage4 = filterFastenersByStage(product28.fasteners, 4);
  assert.equal(stage4.length, 2);
  assert.deepEqual(stage4.map(f => f.id), ['CONN-UPPER-RAIL', 'CONN-TV-MOUNT']);

  // Stage 0 (All)
  const allFasteners = filterFastenersByStage(product28.fasteners, 0);
  assert.equal(allFasteners.length, 4);
});

test('Bilingual English/Tamil translations exist for all neutral connection keys and UI headers', () => {
  for (const f of product28.fasteners) {
    assert.ok(messages28.en[f.nameKey], `English translation missing for: ${f.nameKey}`);
    assert.ok(messages28.ta[f.nameKey], `Tamil translation missing for: ${f.nameKey}`);
  }

  for (const f of product29.fasteners) {
    assert.ok(messages29.en[f.nameKey], `English translation missing for: ${f.nameKey}`);
    assert.ok(messages29.ta[f.nameKey], `Tamil translation missing for: ${f.nameKey}`);
  }

  for (const msg of [messages28.en, messages28.ta, messages29.en, messages29.ta]) {
    assert.ok(msg.fastenersTitle);
    assert.ok(msg.fastenersDesc);
    assert.ok(msg.colFastenerId);
    assert.ok(msg.colFastenerName);
    assert.ok(msg.colFastenerStage);
    assert.ok(msg.colFastenerQty);
    assert.ok(msg.colFastenerDiameter);
    assert.ok(msg.colFastenerLength);
    assert.ok(msg.colFastenerHead);
    assert.ok(msg.colFastenerTool);
    assert.ok(msg.colFastenerWashers);
    assert.ok(msg.colFastenerLocation);
    assert.ok(msg.fastenerStatusVerified);
    assert.ok(msg.fastenerStatusPending);
    assert.ok(msg.fastenerDisclaimer);
    assert.ok(msg.activeFastenerDetail);
    assert.ok(msg.fastenerUnconfirmedNotice);
    assert.ok(msg.guideStatusEyebrow);
    assert.ok(msg.guideStatusTitle);
    assert.ok(msg.guideStatusDesc);
    assert.ok(msg.allDemos);
    assert.ok(msg.currentProduct);
    assert.ok(msg.guideNavAria);
  }
});
