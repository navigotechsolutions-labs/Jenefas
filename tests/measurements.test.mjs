import test from 'node:test';
import assert from 'node:assert/strict';
import { product28 } from '../demos/product-28/src/product.js';
import { product29 } from '../demos/product-29/src/product.js';
import * as prodMeasurements from '../demos/product-28/src/measurements.js';
import {
  MEASUREMENT_STATUS,
  formatMeasurementValue,
  filterMeasurementsByPart,
} from '../demos/product-28/src/measurements.js';
import { syntheticClampMeasurements } from './fixtures/synthetic-test-fixtures.mjs';
import { messages as messages28 } from '../demos/product-28/src/i18n.js';
import { messages as messages29 } from '../demos/product-29/src/i18n.js';

test('Production measurements module exports ZERO synthetic clamp fixtures', () => {
  assert.equal(prodMeasurements.clampProductMeasurements, undefined, 'clampProductMeasurements must not be exported by production code');
});

test('Clamp product specification schema supports all required clamp parameters in test fixtures', () => {
  const ids = syntheticClampMeasurements.map(m => m.id);
  const requiredIds = [
    'overallWidth',
    'overallHeight',
    'overallDepth',
    'clampOpening',
    'supportedDeskThickness',
    'jawWidth',
    'jawDepth',
    'throatDepth',
    'holeDiameter',
    'holeSpacing',
  ];

  for (const req of requiredIds) {
    assert.ok(ids.includes(req), `Missing required clamp parameter: ${req}`);
  }

  // Check clamp opening vs supported desk thickness distinction
  const clampOpening = syntheticClampMeasurements.find(m => m.id === 'clampOpening');
  const deskThickness = syntheticClampMeasurements.find(m => m.id === 'supportedDeskThickness');

  assert.ok(clampOpening, 'clampOpening must exist');
  assert.ok(deskThickness, 'supportedDeskThickness must exist');
  assert.notEqual(clampOpening.max, deskThickness.max, 'Clamp opening max must differ from supported desk thickness max');
  assert.ok(clampOpening.note && clampOpening.note.includes('clearance'), 'Clamp opening note must document mechanical jaw clearance');
  assert.ok(deskThickness.note && deskThickness.note.includes('desk thickness'), 'Desk thickness note must document safe desk range');
});

test('Products 28 and 29 contain only relevant Table Top Stand measurements and ZERO clamp fields', () => {
  const clampKeys = ['clampOpening', 'supportedDeskThickness', 'jawWidth', 'jawDepth', 'throatDepth'];

  for (const m of product28.measurements) {
    assert.ok(!clampKeys.includes(m.id), `Product 28 must not have clamp parameter: ${m.id}`);
  }
  for (const m of product29.measurements) {
    assert.ok(!clampKeys.includes(m.id), `Product 29 must not have clamp parameter: ${m.id}`);
  }

  // Product 28 has rectangular base fields
  const p28Ids = product28.measurements.map(m => m.id);
  assert.ok(p28Ids.includes('baseWidth'));
  assert.ok(p28Ids.includes('baseDepth'));
  assert.ok(p28Ids.includes('postDiameter'));

  // Product 29 has V-base fields
  const p29Ids = product29.measurements.map(m => m.id);
  assert.ok(p29Ids.includes('vBaseSpan'));
  assert.ok(p29Ids.includes('vBaseDepth'));
  assert.ok(p29Ids.includes('postDiameter'));
});

test('Unverified dimensions store null values, status pending, and format as "Pending verification"', () => {
  for (const m of product28.measurements) {
    assert.equal(m.value, null, `Product 28 ${m.id} value must be null`);
    assert.equal(m.status, MEASUREMENT_STATUS.PENDING, `Product 28 ${m.id} status must be pending`);
    assert.equal(formatMeasurementValue(m, 'Pending verification'), 'Pending verification');
    assert.equal(formatMeasurementValue(m, 'உறுதிப்படுத்தல் நிலுவையில் உள்ளது'), 'உறுதிப்படுத்தல் நிலுவையில் உள்ளது');
  }

  for (const m of product29.measurements) {
    assert.equal(m.value, null, `Product 29 ${m.id} value must be null`);
    assert.equal(m.status, MEASUREMENT_STATUS.PENDING, `Product 29 ${m.id} status must be pending`);
    assert.equal(formatMeasurementValue(m, 'Pending verification'), 'Pending verification');
  }
});

test('filterMeasurementsByPart returns overall measurements when assembled and component measurements when selected', () => {
  // Assembled view
  const overall = filterMeasurementsByPart(product28.measurements, null, true);
  assert.ok(overall.length > 0);
  assert.ok(overall.every(m => m.category === 'overall' || m.partId === null));
  assert.ok(overall.some(m => m.id === 'overallWidth'));

  // Base component selected
  const baseMeasurements = filterMeasurementsByPart(product28.measurements, 'base', false);
  assert.ok(baseMeasurements.length > 0);
  assert.ok(baseMeasurements.every(m => m.partId === 'base'));
  assert.ok(baseMeasurements.some(m => m.id === 'baseWidth'));
  assert.ok(!baseMeasurements.some(m => m.id === 'postHeight'));

  // Post component selected
  const postMeasurements = filterMeasurementsByPart(product28.measurements, 'post', false);
  assert.ok(postMeasurements.length > 0);
  assert.ok(postMeasurements.every(m => m.partId === 'post'));
  assert.ok(postMeasurements.some(m => m.id === 'postHeight'));
});

test('Bilingual measurement localization covers all defined measurement keys in English and Tamil', () => {
  for (const m of product28.measurements) {
    assert.ok(messages28.en[m.nameKey], `Product 28 English missing key: ${m.nameKey}`);
    assert.ok(messages28.ta[m.nameKey], `Product 28 Tamil missing key: ${m.nameKey}`);
  }

  for (const m of product29.measurements) {
    assert.ok(messages29.en[m.nameKey], `Product 29 English missing key: ${m.nameKey}`);
    assert.ok(messages29.ta[m.nameKey], `Product 29 Tamil missing key: ${m.nameKey}`);
  }

  // Required notices and UI labels
  for (const msg of [messages28.en, messages28.ta, messages29.en, messages29.ta]) {
    assert.ok(msg.showMeasurements);
    assert.ok(msg.hideMeasurements);
    assert.ok(msg.statusVerified);
    assert.ok(msg.statusPendingLabel);
    assert.ok(msg.animationDisclaimer);
    assert.ok(msg.noInventedDimensionsNotice);
  }
});
