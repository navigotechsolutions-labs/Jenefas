import { product28 } from './product.js';
import { AssemblyState, stageAt } from './animation.js';
import { createScene } from './scene.js';
import { messages } from './i18n.js';

const $ = id => document.getElementById(id);
const state = new AssemblyState(product28.parts.length);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
state.reducedMotion = motion.matches;
let language = 'en';
let viewer;
let errorKey = null;
let frame = 0;
let previousTime = null;
let lastStage = -1;
let lastPercent = -1;
const stageButtons = [];

for (let index = 0; index <= product28.parts.length; index++) {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  const number = document.createElement('span');
  number.className = 'stage-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = String(index).padStart(2, '0');
  const label = document.createElement('span');
  button.append(number, label);
  button.addEventListener('click', () => {
    const value = index / product28.parts.length;
    if (errorKey) state.seek(value);
    else state.go(value);
    update();
  });
  item.append(button);
  $('stages').append(item);
  stageButtons.push({ button, label });
}

function update(force = false) {
  const text = messages[language];
  const stage = stageAt(state.progress, state.stageCount);
  const percent = Math.round(state.progress * 100);
  viewer?.setProgress(state.progress, stage);
  $('progress').value = String(Math.round(state.progress * 1000));
  $('play').textContent = state.playing ? text.pause : text.play;
  $('play').setAttribute('aria-pressed', String(state.playing));
  $('previous').disabled = !!errorKey || state.progress === 0;
  $('next').disabled = !!errorKey || state.progress === 1;
  if (force || percent !== lastPercent || stage !== lastStage) {
    $('progress-value').textContent = `${percent}%`;
    $('progress').setAttribute('aria-valuetext', text.progressText(percent, text.stages[stage]));
  }
  if (force || stage !== lastStage) {
    $('stage-count').textContent = `${String(stage).padStart(2, '0')} / ${String(state.stageCount).padStart(2, '0')}`;
    $('part-title').textContent = text.stages[stage];
    $('part-description').textContent = text.descriptions[stage];
    const partEvidence = $('part-evidence');
    if (partEvidence) partEvidence.textContent = text.evidence[stage];
    const partUnknown = $('part-unknown');
    if (partUnknown) partUnknown.textContent = text.unknowns[stage];
    stageButtons.forEach(({ button }, index) => {
      if (index === stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }
  lastStage = stage;
  lastPercent = percent;
}

function translate() {
  const text = messages[language];
  document.documentElement.lang = language;
  document.title = `${text.title} · 28 | Jenefas & Jenefas`;
  $('language').setAttribute('aria-label', text.language);
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text[element.dataset.i18n]; });
  stageButtons.forEach(({ label }, index) => { label.textContent = text.stages[index]; });
  $('translated-note').hidden = language !== 'ta';
  $('assembly-controls').setAttribute('aria-label', text.controls);
  document.querySelector('.reference img').alt = text.referenceAlt;
  document.querySelector('.reference>a').setAttribute('aria-label', text.referenceAlt);
  viewer?.canvas.setAttribute('aria-label', text.canvas);
  if (errorKey) $('viewer-error').textContent = text[errorKey];
  update(true);
}

$('language').addEventListener('change', event => { language = event.target.value; translate(); });
$('previous').addEventListener('click', () => { state.step(-1); update(); });
$('next').addEventListener('click', () => { state.step(1); update(); });
$('play').addEventListener('click', () => { state.togglePlay(); update(); });
$('assemble').addEventListener('click', () => { state.go(1); update(); });
$('explode').addEventListener('click', () => { state.go(0); update(); });
$('progress').addEventListener('input', event => { state.seek(Number(event.target.value) / 1000); update(); });
$('reset').addEventListener('click', () => viewer?.reset());

function applyMotion() {
  state.reducedMotion = motion.matches;
  if (motion.matches) state.seek(state.progress);
  viewer?.setReducedMotion(motion.matches);
  $('play').disabled = motion.matches || !!errorKey;
  $('play').setAttribute('aria-describedby', motion.matches ? 'motion-note' : '');
  $('motion-note').hidden = !motion.matches;
  update();
}
motion.addEventListener('change', applyMotion);

function showError(key) {
  errorKey = key;
  state.seek(state.progress);
  cancelAnimationFrame(frame);
  $('loading').hidden = true;
  $('viewer-error').hidden = false;
  // Part descriptions and the local reference remain usable without WebGL.
  ['play', 'previous', 'next', 'assemble', 'explode', 'progress', 'reset'].forEach(id => { $(id).disabled = true; });
  translate();
}

function animate(time) {
  if (document.hidden || errorKey) return;
  const delta = previousTime === null ? 0 : (time - previousTime) / 1000;
  previousTime = time;
  state.tick(delta);
  update();
  viewer.render();
  frame = requestAnimationFrame(animate);
}

try {
  viewer = createScene($('viewport'), product28, motion.matches);
  $('loading').hidden = true;
  viewer.canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); showError('contextLost'); });
  translate();
  applyMotion();
  frame = requestAnimationFrame(animate);
} catch (error) {
  console.error('Product 28 viewer initialization failed:', error);
  showError('error');
}

document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(frame);
  previousTime = null;
  // Pause background playback instead of unexpectedly completing off-screen.
  if (document.hidden) { state.seek(state.progress); update(); }
  else if (viewer && !errorKey) frame = requestAnimationFrame(animate);
});
window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); });
window.addEventListener('pageshow', event => {
  if (event.persisted && viewer && !errorKey) { previousTime = null; frame = requestAnimationFrame(animate); }
});
