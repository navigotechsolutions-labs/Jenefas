import { readFileSync, writeFileSync } from 'node:fs';

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));

// Enhance existing products with honest verification model and specifications
const enhanced = products.map(p => {
  return {
    ...p,
    code: p.id.replace('JF-', ''),
    pricing: 'Request price',
    specifications: {
      screenSize: { value: p.screenSize, status: 'catalogue_observed', source: 'Jenefas Catalogue 2026' },
      vesa: { value: p.vesa, status: 'catalogue_observed', source: 'Jenefas Catalogue 2026' },
      maxLoad: { value: p.maxLoad, status: 'catalogue_observed', source: 'Jenefas Catalogue 2026' },
      wallDistance: { value: p.wallDistance, status: 'catalogue_observed', source: 'Jenefas Catalogue 2026' },
      motion: { value: p.motion, status: 'catalogue_observed', source: 'Jenefas Catalogue 2026' },
      dimensions: { value: null, unit: 'mm', status: 'pending', source: null },
      weight: { value: null, unit: 'kg', status: 'pending', source: null }
    },
    includedParts: {
      confirmed: [
        'Main mounting bracket assembly',
        'Standard installation fastener set (screws, wall plugs, TV bolts)'
      ],
      unconfirmed: 'Specific screw thread sizes and spacer combinations depend on display model'
    },
    installationRequirements: 'Solid brick, concrete or wood-stud wall. Check wall composition prior to installation.',
    guideUrl: null,
    guideType: null,
    image: null,
    verifiedStatus: 'catalogue_observed'
  };
});

// Add Product 28 and Product 29
enhanced.push({
  id: 'JF-TT28',
  code: '28',
  title: 'Rectangle-Base Table-Top TV Stand',
  category: 'tabletop',
  categoryName: 'Table-Top Stands',
  screenSize: '32" - 55"',
  sizeGroup: '32-55',
  vesa: '200x200 to 400x400 mm',
  maxLoad: null,
  wallDistance: 'Table-top freestanding',
  motion: 'Fixed Direct Rail',
  features: [
    'Flat rectangular steel base plate',
    'Vertical cylindrical upright column',
    'Dual horizontal direct mounting rails'
  ],
  cartonPack: null,
  idealFor: 'Credenzas, AV furniture, desks where wall mounting is prohibited',
  pricing: 'Request price',
  specifications: {
    screenSize: { value: '32" - 55"', status: 'catalogue_observed', source: 'Jenefas Catalogue Page 7' },
    vesa: { value: '200x200 to 400x400 mm', status: 'unconfirmed', source: 'Catalogue proportion estimate - awaiting manufacturer confirmation' },
    maxLoad: { value: null, unit: 'kg', status: 'pending', source: null },
    wallDistance: { value: 'Freestanding', status: 'catalogue_observed', source: 'Catalogue Page 7' },
    motion: { value: 'Fixed Direct Rail', status: 'catalogue_observed', source: 'Catalogue Page 7' },
    dimensions: { value: null, unit: 'mm', status: 'pending', source: null },
    weight: { value: null, unit: 'kg', status: 'pending', source: null }
  },
  includedParts: {
    confirmed: [
      'Rectangular base plate (proportions from catalogue Page 7)',
      'Vertical column support',
      'Dual direct mounting rails'
    ],
    unconfirmed: 'Joint fasteners, base-to-post connection bolts, TV mounting screws awaiting manufacturer confirmation'
  },
  installationRequirements: 'Stable, level tabletop surface capable of supporting combined stand and TV weight.',
  guideUrl: 'demos/product-28/',
  guideType: 'concept_prototype',
  image: 'demos/product-28/assets/page_7.png',
  imageCrop: { x: 1115, y: 110, width: 185, height: 235 },
  verifiedStatus: 'concept_prototype'
});

enhanced.push({
  id: 'JF-TT29',
  code: '29',
  title: 'V-Base Table-Top TV Stand',
  category: 'tabletop',
  categoryName: 'Table-Top Stands',
  screenSize: '32" - 55"',
  sizeGroup: '32-55',
  vesa: '200x200 to 400x400 mm',
  maxLoad: null,
  wallDistance: 'Table-top freestanding',
  motion: 'Fixed Direct Rail',
  features: [
    'V-profile angled steel base legs',
    'Vertical cylindrical upright column',
    'Dual horizontal direct mounting rails'
  ],
  cartonPack: null,
  idealFor: 'Narrow TV consoles, soundbar clearance, modern living rooms',
  pricing: 'Request price',
  specifications: {
    screenSize: { value: '32" - 55"', status: 'catalogue_observed', source: 'Jenefas Catalogue Page 7' },
    vesa: { value: '200x200 to 400x400 mm', status: 'unconfirmed', source: 'Catalogue proportion estimate - awaiting manufacturer confirmation' },
    maxLoad: { value: null, unit: 'kg', status: 'pending', source: null },
    wallDistance: { value: 'Freestanding', status: 'catalogue_observed', source: 'Catalogue Page 7' },
    motion: { value: 'Fixed Direct Rail', status: 'catalogue_observed', source: 'Catalogue Page 7' },
    dimensions: { value: null, unit: 'mm', status: 'pending', source: null },
    weight: { value: null, unit: 'kg', status: 'pending', source: null }
  },
  includedParts: {
    confirmed: [
      'V-shaped base frame (proportions from catalogue Page 7)',
      'Vertical column support',
      'Dual direct mounting rails'
    ],
    unconfirmed: 'Joint fasteners, leg joining bolts, TV mounting screws awaiting manufacturer confirmation'
  },
  installationRequirements: 'Stable, level tabletop surface with minimum depth matching base spread.',
  guideUrl: 'demos/product-29/',
  guideType: 'concept_prototype',
  image: 'demos/product-28/assets/page_7.png',
  imageCrop: { x: 945, y: 750, width: 170, height: 225 },
  verifiedStatus: 'concept_prototype'
});

writeFileSync('data/products.json', JSON.stringify(enhanced, null, 2));
console.log('Successfully written data/products.json with ' + enhanced.length + ' products.');
