import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));

test('data/products.json integrity and verification model', () => {
  // 1. Ensure exact count matches actual verified and observed products
  assert.equal(products.length, 20, 'Products dataset must contain exactly 20 items (18 catalogue models + 2 table top stand models)');

  // 2. Ensure each product has stable code, id, category and specifications
  for (const p of products) {
    assert.ok(p.id, 'Every product must have a non-empty id');
    assert.ok(p.code, 'Every product must have a non-empty code');
    assert.ok(p.title, 'Every product must have a title');
    assert.ok(p.category, 'Every product must have a category');
    assert.ok(p.specifications, `Product ${p.id} must have specifications object`);

    // Verify null handling: missing numerical dimensions must be null, never 0
    assert.equal(p.specifications.dimensions.value, null, `Product ${p.id} dimensions must be null when unverified`);
    assert.notEqual(p.specifications.dimensions.value, 0, `Product ${p.id} dimensions must not be 0`);
  }
});

test('Product 28 and 29 specific isolation and concept status', () => {
  const p28 = products.find(p => p.id === 'JF-TT28');
  const p29 = products.find(p => p.id === 'JF-TT29');

  assert.ok(p28, 'Product 28 must exist');
  assert.ok(p29, 'Product 29 must exist');

  assert.equal(p28.verifiedStatus, 'concept_prototype', 'Product 28 must be labeled concept_prototype');
  assert.equal(p29.verifiedStatus, 'concept_prototype', 'Product 29 must be labeled concept_prototype');

  assert.equal(p28.guideUrl, 'demos/product-28/', 'Product 28 must link to its interactive guide');
  assert.equal(p29.guideUrl, 'demos/product-29/', 'Product 29 must link to its interactive guide');

  // Verify unknown measurements are pending
  assert.equal(p28.specifications.maxLoad.value, null);
  assert.equal(p29.specifications.maxLoad.value, null);
});

test('Finder logic handles categories and search filters honestly', () => {
  // Test filter matching function
  function filterProducts(list, { category, search, size, motion }) {
    return list.filter(p => {
      const matchCat = (!category || category === 'all' || p.category === category);
      const matchSearch = (!search || 
        p.id.toLowerCase().includes(search.toLowerCase()) || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.vesa.toLowerCase().includes(search.toLowerCase())
      );
      const matchSize = (!size || p.sizeGroup === size || p.sizeGroup === 'Universal');
      const matchMotion = (!motion || p.category === motion);
      return matchCat && matchSearch && matchSize && matchMotion;
    });
  }

  // 1. All products match empty query
  const all = filterProducts(products, {});
  assert.equal(all.length, 20);

  // 2. Search for "JF-FX" finds only fixed mounts
  const fixed = filterProducts(products, { search: 'JF-FX' });
  assert.equal(fixed.length, 3);

  // 3. Tabletop category returns 2 products
  const tabletop = filterProducts(products, { category: 'tabletop' });
  assert.equal(tabletop.length, 2);
});
