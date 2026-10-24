import test from 'node:test';
import assert from 'node:assert/strict';
import {product29} from '../demos/product-29/src/product.js';
import {partPosition} from '../demos/product-28/src/animation.js';
import {messages} from '../demos/product-29/src/i18n.js';
test('Product 29 preserves its distinct V base and bilingual stage coverage',()=>{
 assert.equal(product29.code,'29');assert.equal(product29.parts[0].shape,'vBase');
 for(const lang of ['en','ta']) {assert.equal(messages[lang].stages.length,5);assert.equal(messages[lang].descriptions.length,5);}
 for(const p of product29.parts){assert.deepEqual(partPosition(p,0),p.exploded);partPosition(p,1).forEach((v,i)=>assert.ok(Math.abs(v-p.assembled[i])<1e-9));}
});
