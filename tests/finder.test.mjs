import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  checkProductVesaSupport,
  getProductMaxLoadKg,
  evaluateProductCompatibility,
  cleanIncompatibleAnswers,
  evaluateClampDeskSupport,
  buildWhatsAppEnquiry,
  VERIFIED_WHATSAPP_NUMBER
} from '../assets/finder-engine.js';
import { syntheticClampMeasurements } from './fixtures/synthetic-test-fixtures.mjs';
import { i18nData } from '../assets/i18n.js';

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));

test('1. Exact VESA match returns pass when product supports the pattern', () => {
  // A test product with verified VESA up to 400x400
  const verifiedMount = {
    id: 'TEST-MOUNT-01',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '100x100, 200x200, 400x400',
    maxLoad: '45 kg',
    specifications: {
      vesa: { value: '400x400', status: 'verified' },
      maxLoad: { value: 45, status: 'verified' }
    }
  };

  const vesaRes = checkProductVesaSupport(verifiedMount, '200x200');
  assert.equal(vesaRes.status, 'pass');

  const evalRes = evaluateProductCompatibility(verifiedMount, {
    surface: 'wall',
    vesa: '200x200',
    weightKg: 20
  });

  assert.equal(evalRes.state, 'meets_spec');
  const vesaCheck = evalRes.checks.find(c => c.name.includes('VESA'));
  assert.equal(vesaCheck.status, 'pass');
});

test('2. Unsupported VESA fails explicitly (e.g. 400x400 on max 200x200 mount)', () => {
  const smallMount = {
    id: 'TEST-SMALL-01',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '75x75, 100x100, 200x200',
    maxLoad: '25 kg',
    specifications: {
      vesa: { value: '200x200', status: 'verified' },
      maxLoad: { value: 25, status: 'verified' }
    }
  };

  const vesaRes = checkProductVesaSupport(smallMount, '400x400');
  assert.equal(vesaRes.status, 'fail');

  const evalRes = evaluateProductCompatibility(smallMount, {
    surface: 'wall',
    vesa: '400x400',
    weightKg: 15
  });

  assert.equal(evalRes.state, 'fails_spec');
  const vesaCheck = evalRes.checks.find(c => c.name.includes('VESA'));
  assert.equal(vesaCheck.status, 'fail');
});

test('3. Unknown VESA returns more_info_needed state rather than affirmative pass', () => {
  const mount = {
    id: 'TEST-MOUNT-02',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '400x400',
    maxLoad: '45 kg',
    specifications: {
      vesa: { value: '400x400', status: 'verified' },
      maxLoad: { value: 45, status: 'verified' }
    }
  };

  const evalRes = evaluateProductCompatibility(mount, {
    surface: 'wall',
    vesa: 'unknown',
    weightKg: 20
  });

  assert.equal(evalRes.state, 'more_info_needed');
  const vesaCheck = evalRes.checks.find(c => c.name.includes('VESA'));
  assert.equal(vesaCheck.status, 'unknown');
});

test('4. Weight at limit passes verified load rating (25 kg on 25 kg limit)', () => {
  const mount = {
    id: 'TEST-MOUNT-03',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '200x200',
    maxLoad: '25 kg',
    specifications: {
      vesa: { value: '200x200', status: 'verified' },
      maxLoad: { value: 25, status: 'verified' }
    }
  };

  const evalRes = evaluateProductCompatibility(mount, {
    surface: 'wall',
    vesa: '200x200',
    weightKg: 25
  });

  assert.equal(evalRes.state, 'meets_spec');
  const weightCheck = evalRes.checks.find(c => c.name.includes('Weight'));
  assert.equal(weightCheck.status, 'pass');
});

test('5. Weight above limit fails immediately (26 kg on 25 kg limit)', () => {
  const mount = {
    id: 'TEST-MOUNT-03',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '200x200',
    maxLoad: '25 kg',
    specifications: {
      vesa: { value: '200x200', status: 'verified' },
      maxLoad: { value: 25, status: 'verified' }
    }
  };

  const evalRes = evaluateProductCompatibility(mount, {
    surface: 'wall',
    vesa: '200x200',
    weightKg: 26
  });

  assert.equal(evalRes.state, 'fails_spec');
  const weightCheck = evalRes.checks.find(c => c.name.includes('Weight'));
  assert.equal(weightCheck.status, 'fail');
});

test('6. Missing product load data on Products 28/29 returns unknown, not affirmative match', () => {
  const p28 = products.find(p => p.id === 'JF-TT28');
  assert.ok(p28);
  assert.equal(p28.specifications.maxLoad.value, null, 'Product 28 maxLoad must be null');

  const evalRes = evaluateProductCompatibility(p28, {
    surface: 'tabletop',
    vesa: '200x200',
    weightKg: 15
  });

  // Since load limit is null (unverified), it must require confirmation!
  assert.equal(evalRes.state, 'more_info_needed');
  const weightCheck = evalRes.checks.find(c => c.name.includes('Weight'));
  assert.equal(weightCheck.status, 'unknown');
});

test('7. Screen size matching does not override a VESA failure (32" TV with 400x400 VESA on 200x200 mount fails)', () => {
  const smallMount = {
    id: 'TEST-SMALL-32',
    sourceType: 'manufacturer_catalogue_scan',
    sizeGroup: '14-32',
    vesa: '200x200',
    maxLoad: '25 kg',
    specifications: {
      vesa: { value: '200x200', status: 'verified' },
      maxLoad: { value: 25, status: 'verified' }
    }
  };

  const evalRes = evaluateProductCompatibility(smallMount, {
    surface: 'wall',
    sizeGroup: '14-32', // Matches size group!
    vesa: '400x400',    // Exceeds 200x200 VESA!
    weightKg: 10
  });

  assert.equal(evalRes.state, 'fails_spec', 'Screen size match must never override VESA failure');
  const vesaCheck = evalRes.checks.find(c => c.name.includes('VESA'));
  assert.equal(vesaCheck.status, 'fail');
});

test('8. Category change clears category-specific answers while preserving display weight and VESA', () => {
  const initialState = {
    surface: 'wall',
    vesa: '200x200',
    weightKg: 18,
    weightUnknown: false,
    motion: 'tilt',
    model: 'Sony Bravia'
  };

  const switchedState = cleanIncompatibleAnswers('wall', 'tabletop', initialState);

  assert.equal(switchedState.surface, 'tabletop');
  assert.equal(switchedState.vesa, '200x200', 'VESA must be preserved');
  assert.equal(switchedState.weightKg, 18, 'Weight must be preserved');
  assert.equal(switchedState.motion, undefined, 'Wall motion preference must be cleared');
  assert.equal(switchedState.model, 'Sony Bravia', 'Model text must be preserved');
});

test('9. Clamp opening within and outside supported range using syntheticClampMeasurements fixture', () => {
  // Test safe thickness within range (e.g. 40mm within 10-85mm)
  const safeRes = evaluateClampDeskSupport(syntheticClampMeasurements, 40);
  assert.equal(safeRes.status, 'pass');

  // Test thickness exceeding safe desk thickness (90mm), but within clamp mechanical opening (95mm)
  const exceedDeskRes = evaluateClampDeskSupport(syntheticClampMeasurements, 90);
  assert.equal(exceedDeskRes.status, 'fail');
  assert.equal(exceedDeskRes.isUnderMechanicalClearance, true);

  // Test thickness completely exceeding mechanical clamp opening (100mm)
  const exceedMaxRes = evaluateClampDeskSupport(syntheticClampMeasurements, 100);
  assert.equal(exceedMaxRes.status, 'fail');
  assert.equal(exceedMaxRes.isUnderMechanicalClearance, false);
});

test('10. Surface suitability notices are present in UI translations for customer transparency', () => {
  assert.ok(i18nData.en.finderSurfaceDisclaimer.includes('Surface Suitability Notice'));
  assert.ok(i18nData.ta.finderSurfaceDisclaimer.includes('சுவர் உறுதிப்பாடு'));
  assert.ok(i18nData.en.finderDeskWarning.includes('Surface Safety Notice'));
  assert.ok(i18nData.ta.finderDeskWarning.includes('பாதுகாப்பு அறிவிப்பு'));
});

test('11. Unsupported specifications excluded from matching (unconfirmed planning estimates do not produce false-positive meets_spec)', () => {
  // Product with unconfirmed planning estimate
  const unconfirmedProd = {
    id: 'JF-FX32',
    sourceType: 'internal_planning_taxonomy',
    vesa: '200x200',
    maxLoad: '25 kg',
    specifications: {
      vesa: { value: '200x200', status: 'unconfirmed_planning_estimate' },
      maxLoad: { value: 25, status: 'unconfirmed_planning_estimate' }
    }
  };

  const evalRes = evaluateProductCompatibility(unconfirmedProd, {
    surface: 'wall',
    vesa: '200x200',
    weightKg: 20
  });

  // Because source is internal planning taxonomy and unconfirmed, it must be more_info_needed, NEVER meets_spec!
  assert.equal(evalRes.state, 'more_info_needed');
  const vesaCheck = evalRes.checks.find(c => c.name.includes('VESA'));
  assert.equal(vesaCheck.status, 'unknown');
});

test('12. No false-positive compatibility result when user provides no input', () => {
  const mount = {
    id: 'TEST-01',
    sourceType: 'manufacturer_catalogue_scan',
    vesa: '200x200',
    maxLoad: '30 kg'
  };

  const evalRes = evaluateProductCompatibility(mount, {});
  assert.notEqual(evalRes.state, 'meets_spec', 'Must not yield meets_spec on empty answers');
  assert.equal(evalRes.state, 'more_info_needed');
});

test('13. Bilingual state strings are defined for all 4 mutually exclusive states', () => {
  const states = ['finderStateMeets', 'finderStateMoreInfo', 'finderStateFails', 'finderStateNoMatch'];
  for (const s of states) {
    assert.ok(i18nData.en[s], `Missing English string for ${s}`);
    assert.ok(i18nData.ta[s], `Missing Tamil string for ${s}`);
  }
});

test('14. WhatsApp enquiry builder uses verified destination +91 98408 17220 and contains structured parameters', () => {
  const enquiry = buildWhatsAppEnquiry(
    'JF-FX32 (Fixed Wall Mount)',
    {
      surface: 'wall',
      vesa: '200x200',
      weightKg: 22,
      motion: 'fixed',
      model: 'Sony Bravia 55'
    },
    {
      name: 'Venkatesh',
      phone: '9840012345',
      company: 'Ritchie AV Traders',
      quantity: '10 units'
    },
    'https://jenefas.netlify.app/'
  );

  assert.equal(enquiry.destination, '919840817220');
  assert.ok(enquiry.waUrl.startsWith('https://wa.me/919840817220?text='));
  assert.ok(enquiry.text.includes('JF-FX32'));
  assert.ok(enquiry.text.includes('+91 98408 17220'));
  assert.ok(enquiry.text.includes('VESA Pattern:* 200x200'));
  assert.ok(enquiry.text.includes('Display Weight:* 22 kg'));
  assert.ok(enquiry.text.includes('Buyer Name:* Venkatesh'));
  assert.ok(enquiry.text.includes('Ritchie AV Traders'));
});

test('15. Submitting RFQ prepares draft and provides copyable recovery without false message sent state', () => {
  // Verify recovery labels in i18n
  assert.ok(i18nData.en.rfqNotice.includes('+91 98408 17220'));
  assert.ok(i18nData.en.rfqBlockedNotice.includes('direct link'));
  assert.ok(i18nData.ta.rfqBlockedNotice.includes('வாட்ஸ்அப் தானாக திறக்கப்படவில்லை'));
  assert.equal(i18nData.en.rfqSubmitWhatsApp, 'Review Enquiry in WhatsApp ↗');
  assert.equal(i18nData.ta.rfqSubmitWhatsApp, 'வாட்ஸ்அப்பில் விசாரணையை மதிப்பாய்வு செய்யவும் ↗');
});
