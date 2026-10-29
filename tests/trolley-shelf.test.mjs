import {test} from 'node:test';import assert from 'node:assert/strict';import {shelfMotion} from '../demos/trolley-guide/src/shelf-motion.js';
test('shelf supports arrive before the plate and seeking has stable endpoints',()=>{
 assert.equal(shelfMotion(23.9).visible,false);assert.equal(shelfMotion(24).plateVisible,false);
 assert.ok(shelfMotion(24).supportOffset>0);assert.equal(shelfMotion(26).supportOffset,0);
 assert.equal(shelfMotion(26.4).plateVisible,false);assert.ok(shelfMotion(26.5).plateHeight>0);
 assert.equal(shelfMotion(28.5).plateHeight,0);assert.deepEqual(shelfMotion(30),shelfMotion(42));
});
