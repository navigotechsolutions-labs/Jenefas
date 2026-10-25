import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));

test('data/products.json traceability and identifier separation', () => {
  // Ensure every product is grounded in source references and separates internal IDs from manufacturer codes
  for (const p of products) {
    assert.ok(p.id, 'Every product must have a non-empty id');
    assert.ok(p.title, 'Every product must have a title');
    assert.ok(p.category, 'Every product must have a category');
    assert.ok(p.specifications, `Product ${p.id} must have specifications object`);

    // Verify identifier separation
    assert.ok(['internal_platform_id', 'manufacturer_catalogue_code'].includes(p.identifierType),
      `Product ${p.id} must declare identifierType`);

    if (p.identifierType === 'internal_platform_id') {
      assert.equal(p.manufacturerCode, null, `Internal ID ${p.id} must not be labeled as verified manufacturer code`);
    }

    // Verify null handling: missing numerical dimensions must be null, never 0
    assert.equal(p.specifications.dimensions.value, null, `Product ${p.id} dimensions must be null when unverified`);
    assert.notEqual(p.specifications.dimensions.value, 0, `Product ${p.id} dimensions must not be 0`);

    // Package contents honesty: must not assume screws, washers, or tools are included
    assert.equal(p.confirmedPackageContents, null, `Product ${p.id} confirmedPackageContents must be null until official BOM`);
    assert.equal(p.packageContentsStatus, 'awaiting_manufacturer_bom', `Product ${p.id} must be awaiting manufacturer BOM`);
    assert.notEqual(p.cartonPack, 'Direct individual packing', `Product ${p.id} must not use unsupported direct individual packing claim`);
  }
});

test('Product 28 and 29 specific isolation and 3D concept preview status', () => {
  const p28 = products.find(p => p.id === 'JF-TT28');
  const p29 = products.find(p => p.id === 'JF-TT29');

  assert.ok(p28, 'Product 28 must exist');
  assert.ok(p29, 'Product 29 must exist');

  assert.equal(p28.manufacturerCode, '28', 'Product 28 has manufacturer catalogue code 28');
  assert.equal(p29.manufacturerCode, '29', 'Product 29 has manufacturer catalogue code 29');

  assert.equal(p28.verifiedStatus, 'concept_prototype', 'Product 28 must be labeled concept_prototype');
  assert.equal(p29.verifiedStatus, 'concept_prototype', 'Product 29 must be labeled concept_prototype');

  assert.equal(p28.guideType, '3D concept preview', 'Product 28 must be designated 3D concept preview');
  assert.equal(p29.guideType, '3D concept preview', 'Product 29 must be designated 3D concept preview');

  assert.equal(p28.guideUrl, 'demos/product-28/', 'Product 28 must link to its interactive guide');
  assert.equal(p29.guideUrl, 'demos/product-29/', 'Product 29 must link to its interactive guide');

  // Verify unknown measurements are pending
  assert.equal(p28.specifications.weightLimit.value, null);
  assert.equal(p29.specifications.weightLimit.value, null);
});

test('Guided Finder logic handles categories, weights, and search filters honestly', () => {
  // Test guided filter matching function
  function evaluateGuidedFinder(list, { surface, size, weight, motion }) {
    return list.filter(p => {
      if (surface === 'wall' && !['fixed', 'tilt', 'motion'].includes(p.category)) return false;
      if (surface === 'ceiling' && p.category !== 'ceiling') return false;
      if (surface === 'desk' && p.category !== 'desk') return false;
      if (surface === 'tabletop' && p.category !== 'tabletop') return false;

      if (size && p.sizeGroup !== size && p.sizeGroup !== 'Universal') return false;
      if (motion && p.category !== motion) return false;

      if (weight) {
        const loadStr = p.maxLoad || '';
        const matchNum = loadStr.match(/(\d+)\s*kg/i);
        const maxKg = matchNum ? parseInt(matchNum[1], 10) : null;
        if (maxKg !== null) {
          if (weight === 'under30' && maxKg < 20) return false;
          if (weight === '30to50' && maxKg < 35) return false;
          if (weight === 'over50' && maxKg < 55) return false;
        }
      }

      return true;
    });
  }

  // 1. Wall mounts for standard 32-55" size
  const standardWall = evaluateGuidedFinder(products, { surface: 'wall', size: '32-55' });
  assert.ok(standardWall.length > 0);
  assert.ok(standardWall.every(p => ['fixed', 'tilt', 'motion'].includes(p.category)));

  // 2. Tabletop search returns only tabletop stands
  const tabletop = evaluateGuidedFinder(products, { surface: 'tabletop' });
  assert.equal(tabletop.length, 2);
  assert.ok(tabletop.every(p => p.category === 'tabletop'));

  // 3. Impossibly heavy requirement returns 0 matches gracefully without errors
  const overHeavyDesk = evaluateGuidedFinder(products, { surface: 'desk', weight: 'over50' });
  assert.equal(overHeavyDesk.length, 0);
});
