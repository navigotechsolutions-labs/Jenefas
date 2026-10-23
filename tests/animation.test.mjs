import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AssemblyState, partPosition, stageAt } from '../demos/product-28/src/animation.js';
import { product28 } from '../demos/product-28/src/product.js';

test('all four catalogue structures reach both endpoints without discontinuities', () => {
  assert.deepEqual(product28.parts.map(part => part.id), ['base', 'post', 'lowerRail', 'upperRail']);
  for (const part of product28.parts) {
    assert.deepEqual(partPosition(part, 0), part.exploded);
    partPosition(part, 1).forEach((coordinate, axis) => assert.ok(Math.abs(coordinate - part.assembled[axis]) < 1e-9));
    for (let i = 1; i <= 1000; i++) {
      const before = partPosition(part, (i - 1) / 1000);
      const after = partPosition(part, i / 1000);
      assert.ok(Math.hypot(...after.map((value, axis) => value - before[axis])) < .02);
    }
  }
});

test('pause, reversal and scrubbing preserve continuous progress', () => {
  const state = new AssemblyState();
  state.togglePlay();
  for (let i = 0; i < 120; i++) state.tick(1 / 60);
  assert.ok(state.progress > .3 && state.progress < .4);
  state.togglePlay();
  const paused = state.progress;
  state.tick(.05);
  assert.equal(state.progress, paused);
  state.go(0);
  assert.equal(state.progress, paused);
  state.tick(.05);
  assert.ok(state.progress < paused);
  state.seek(.683);
  assert.equal(state.progress, .683);
  assert.equal(state.target, .683);
  assert.equal(state.playing, false);
});

test('stage navigation handles partial progress, boundaries and reduced motion', () => {
  const state = new AssemblyState();
  state.reducedMotion = true;
  state.step(-1);
  assert.equal(state.progress, 0);
  state.seek(.36);
  state.step(-1);
  assert.equal(state.progress, .25);
  state.step(1);
  assert.equal(state.progress, .5);
  state.go(1);
  state.step(1);
  assert.equal(state.progress, 1);
  state.togglePlay();
  assert.equal(state.playing, false);
  assert.deepEqual([0, .001, .25, .251, .5, .501, .75, .751, 1].map(progress => stageAt(progress)), [0, 1, 1, 2, 2, 3, 3, 4, 4]);
  // Another product can supply a different number of stages without UI/state edits.
  const twoPartProduct = new AssemblyState(2);
  twoPartProduct.reducedMotion = true;
  twoPartProduct.step(1);
  assert.equal(twoPartProduct.progress, .5);
  twoPartProduct.step(1);
  assert.equal(twoPartProduct.progress, 1);
  assert.equal(stageAt(.75, 2), 2);
});

test('long background frames cannot skip an animation stage', () => {
  const state = new AssemblyState();
  state.go(1);
  state.tick(30);
  assert.ok(state.progress < .01);
  for (let i = 0; i < 800; i++) state.tick(.05);
  assert.equal(state.progress, 1);
  assert.equal(state.playing, false);
});
