import { product29 } from './product.js';
import { AssemblyState, stageAt } from '../../product-28/src/animation.js';
import { createScene } from '../../product-28/src/scene.js';
import { messages } from './i18n.js';
import { formatMeasurementValue, filterMeasurementsByPart } from '../../product-28/src/measurements.js';
import { formatFastenerField, filterFastenersByStage, FASTENER_STATUS } from '../../product-28/src/fasteners.js';

const $ = id => document.getElementById(id);
const state = new AssemblyState(product29.parts.length);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
state.reducedMotion = motion.matches;
let language = 'en';
let viewer;
let errorKey = null;
let frame = 0;
let previousTime = null;
let lastStage = -1;
let lastPercent = -1;
let measurementsVisible = false;
let selectedMeasurementId = null;
let selectedFastenerId = null;
const stageButtons = [];

for (let index = 0; index <= product29.parts.length; index++) {
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
    const value = index / product29.parts.length;
    if (errorKey) state.seek(value);
    else state.go(value);
    update();
  });
  item.append(button);
  $('stages').append(item);
  stageButtons.push({ button, label });
}

function renderMeasurementTable(activeId) {
  const text = messages[language];
  const tbody = $('measurements-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  (product29.measurements || []).forEach(item => {
    const tr = document.createElement('tr');
    if (item.id === activeId) tr.className = 'selected-measurement-row';
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', `${text[item.nameKey] || item.id}`);
    tr.addEventListener('click', () => {
      selectedMeasurementId = item.id;
      const select = $('measurement-select');
      if (select) select.value = item.id;
      updateMeasurements(false);
    });
    tr.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        tr.click();
      }
    });

    const tdParam = document.createElement('td');
    tdParam.className = 'param-name';
    tdParam.textContent = text[item.nameKey] || item.id;

    const tdVal = document.createElement('td');
    tdVal.className = 'param-val';
    const valStr = formatMeasurementValue(item, text.statusPendingLabel);
    tdVal.textContent = valStr;
    if (item.value === null && item.min === null) {
      tdVal.classList.add('pending-val');
    }

    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    const isVerified = item.status === 'verified';
    badge.className = `status-badge ${isVerified ? 'verified' : 'pending'}`;
    badge.textContent = isVerified ? text.statusVerified : text.statusPendingLabel;
    tdStatus.append(badge);

    const tdSource = document.createElement('td');
    tdSource.className = 'param-source';
    tdSource.textContent = item.source || text.pendingNotice;
    if (item.note) {
      const noteSpan = document.createElement('span');
      noteSpan.className = 'param-note';
      noteSpan.textContent = ` (${item.note})`;
      tdSource.append(noteSpan);
    }

    tr.append(tdParam, tdVal, tdStatus, tdSource);
    tbody.append(tr);
  });
}

function updateMeasurements(stageChanged = false) {
  const text = messages[language];
  const stage = stageAt(state.progress, state.stageCount);
  const isAssembled = stage === product29.parts.length;
  const activePartId = (stage > 0 && stage <= product29.parts.length && !isAssembled)
    ? product29.parts[stage - 1].id
    : null;

  const relevant = filterMeasurementsByPart(product29.measurements, activePartId, isAssembled);

  if (stageChanged || !selectedMeasurementId || !product29.measurements.some(m => m.id === selectedMeasurementId)) {
    selectedMeasurementId = relevant[0]?.id || product29.measurements[0]?.id || null;
  }

  const select = $('measurement-select');
  if (select) {
    select.innerHTML = '';
    const itemsToShow = [...relevant];
    if (selectedMeasurementId && !itemsToShow.some(m => m.id === selectedMeasurementId)) {
      const selectedObj = product29.measurements.find(m => m.id === selectedMeasurementId);
      if (selectedObj) itemsToShow.push(selectedObj);
    }
    itemsToShow.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      const name = text[item.nameKey] || item.id;
      const val = formatMeasurementValue(item, text.statusPendingLabel);
      opt.textContent = `${name} (${val})`;
      select.append(opt);
    });
    if (selectedMeasurementId) select.value = selectedMeasurementId;
  }

  const selectedItem = (product29.measurements || []).find(m => m.id === selectedMeasurementId) || null;
  viewer?.setMeasurement(selectedItem, measurementsVisible, text);
  renderMeasurementTable(selectedMeasurementId);
}

function renderFastenerDetail(fastener) {
  const text = messages[language];
  const card = $('fastener-detail-card');
  if (!card) return;
  if (!fastener) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  const name = text[fastener.nameKey] || fastener.id;
  $('fastener-detail-title').textContent = `${fastener.id}: ${name}`;

  const stageMap = {
    1: text.step1Base,
    2: text.step2Post,
    3: text.step3LowerRail,
    4: text.step4UpperRail,
  };
  $('fastener-detail-stage').textContent = stageMap[fastener.stage] || `${text.sequence} ${fastener.stage}`;

  const grid = $('fastener-spec-grid');
  grid.innerHTML = `
    <div class="connection-status-notice"><span class="badge-icon" aria-hidden="true">ℹ️</span> <span>${text.fastenerUnconfirmedNotice}</span></div>
    <div class="spec-row"><dt>${text.colFastenerQty}:</dt><dd class="${fastener.quantity == null ? 'pending-val' : ''}">${formatFastenerField(fastener.quantity, text.fastenerStatusPending)}</dd></div>
    <div class="spec-row"><dt>${text.colFastenerDiameter}:</dt><dd class="${fastener.diameter == null ? 'pending-val' : ''}">${formatFastenerField(fastener.diameter, text.fastenerStatusPending)}</dd></div>
    <div class="spec-row"><dt>${text.colFastenerLength}:</dt><dd class="${fastener.length == null ? 'pending-val' : ''}">${formatFastenerField(fastener.length, text.fastenerStatusPending, fastener.unit || 'mm')}</dd></div>
    <div class="spec-row"><dt>${text.colFastenerHead}:</dt><dd class="${fastener.headType == null ? 'pending-val' : ''}">${formatFastenerField(text[fastener.headType], text.fastenerStatusPending)}</dd></div>
    <div class="spec-row"><dt>${text.colFastenerTool}:</dt><dd class="${fastener.tool == null ? 'pending-val' : ''}">${formatFastenerField(text[fastener.tool], text.fastenerStatusPending)}</dd></div>
    <div class="spec-row"><dt>${text.colFastenerWashers}:</dt><dd class="${fastener.washersSpacers == null ? 'pending-val' : ''}">${formatFastenerField(text[fastener.washersSpacers], text.fastenerStatusPending)}</dd></div>
  `;

  const locDesc = $('fastener-location-desc');
  const isApproved = Boolean(
    fastener.approved === true &&
    fastener.source &&
    Array.isArray(fastener.location) &&
    fastener.location.length === 3
  );

  if (isApproved) {
    locDesc.innerHTML = `<span class="location-status verified">✓ ${text.fastenerStatusVerified}:</span> 3D Coordinates: [${fastener.location.join(', ')}] ${fastener.note ? `— ${fastener.note}` : ''}`;
  } else {
    locDesc.innerHTML = `<span class="location-status pending">⏳ ${text.fastenerStatusPending}:</span> ${text.fastenerLocationPending}`;
  }
}

function renderFastenersTable(activeId) {
  const text = messages[language];
  const tbody = $('fasteners-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const stageMap = {
    1: text.step1Base,
    2: text.step2Post,
    3: text.step3LowerRail,
    4: text.step4UpperRail,
  };

  (product29.fasteners || []).forEach(item => {
    const tr = document.createElement('tr');
    if (item.id === activeId) tr.className = 'selected-fastener-row';
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', `${item.id}: ${text[item.nameKey] || item.id}`);

    tr.addEventListener('click', () => {
      selectedFastenerId = item.id;
      if (item.stage) {
        const val = item.stage / product29.parts.length;
        state.seek(val);
      }
      updateFasteners();
      update(true);
    });
    tr.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        tr.click();
      }
    });

    const tdId = document.createElement('td');
    tdId.className = 'fastener-code';
    tdId.textContent = item.id;

    const tdName = document.createElement('td');
    tdName.className = 'fastener-name';
    tdName.textContent = text[item.nameKey] || item.id;

    const tdStage = document.createElement('td');
    tdStage.className = 'fastener-stage';
    tdStage.textContent = stageMap[item.stage] || `${item.stage}`;

    const tdQty = document.createElement('td');
    tdQty.textContent = formatFastenerField(item.quantity, text.fastenerStatusPending);
    if (item.quantity == null) tdQty.classList.add('pending-val');

    const tdDia = document.createElement('td');
    tdDia.textContent = formatFastenerField(item.diameter, text.fastenerStatusPending);
    if (item.diameter == null) tdDia.classList.add('pending-val');

    const tdLen = document.createElement('td');
    tdLen.textContent = formatFastenerField(item.length, text.fastenerStatusPending, item.unit || 'mm');
    if (item.length == null) tdLen.classList.add('pending-val');

    const tdHead = document.createElement('td');
    tdHead.textContent = formatFastenerField(text[item.headType], text.fastenerStatusPending);
    if (item.headType == null) tdHead.classList.add('pending-val');

    const tdTool = document.createElement('td');
    tdTool.textContent = formatFastenerField(text[item.tool], text.fastenerStatusPending);
    if (item.tool == null) tdTool.classList.add('pending-val');

    const tdWash = document.createElement('td');
    tdWash.textContent = formatFastenerField(text[item.washersSpacers], text.fastenerStatusPending);
    if (item.washersSpacers == null) tdWash.classList.add('pending-val');

    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    const isVerified = item.status === 'verified' && item.approved === true;
    badge.className = `status-badge ${isVerified ? 'verified' : 'pending'}`;
    badge.textContent = isVerified ? text.fastenerStatusVerified : text.fastenerStatusPending;
    tdStatus.append(badge);

    tr.append(tdId, tdName, tdStage, tdQty, tdDia, tdLen, tdHead, tdTool, tdWash, tdStatus);
    tbody.append(tr);
  });
}

function updateFasteners(syncToStage = false) {
  const text = messages[language];
  const stage = stageAt(state.progress, state.stageCount);
  const current = (product29.fasteners || []).find(f => f.id === selectedFastenerId);
  if (!selectedFastenerId || (syncToStage && current && current.stage !== stage && stage > 0)) {
    const stageFasteners = (product29.fasteners || []).filter(f => f.stage === stage);
    selectedFastenerId = stageFasteners[0]?.id || product29.fasteners?.[0]?.id || null;
  }
  const currentFastener = (product29.fasteners || []).find(f => f.id === selectedFastenerId) || null;
  viewer?.setFastenerHighlight(currentFastener, text);
  renderFastenersTable(selectedFastenerId);
  renderFastenerDetail(currentFastener);
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
  const stageChanged = stage !== lastStage;
  if (force || stageChanged) {
    $('stage-count').textContent = `${String(stage).padStart(2, '0')} / ${String(state.stageCount).padStart(2, '0')}`;
    $('part-title').textContent = text.stages[stage];
    $('part-description').textContent = text.descriptions[stage];
    stageButtons.forEach(({ button }, index) => {
      if (index === stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    updateMeasurements(force);
    updateFasteners(stageChanged);
  }
  lastStage = stage;
  lastPercent = percent;
}

function translate() {
  const text = messages[language];
  document.documentElement.lang = language;
  document.title = `${text.title} · 29 | Jenefas & Jenefas`;
  $('language').setAttribute('aria-label', text.language);
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (text[key] !== undefined) element.textContent = text[key];
  });
  const guideNav = document.querySelector('.guide-navigation');
  if (guideNav && text.guideNavAria) guideNav.setAttribute('aria-label', text.guideNavAria);
  stageButtons.forEach(({ label }, index) => { label.textContent = text.stages[index]; });
  $('translated-note').hidden = language !== 'ta';
  $('assembly-controls').setAttribute('aria-label', text.controls);
  document.querySelector('.reference img').alt = text.referenceAlt;
  document.querySelector('.reference>a').setAttribute('aria-label', text.referenceAlt);
  viewer?.canvas.setAttribute('aria-label', text.canvas);

  const toggleBtn = $('toggle-measurements');
  if (toggleBtn) {
    toggleBtn.textContent = measurementsVisible ? text.hideMeasurements : text.showMeasurements;
    toggleBtn.setAttribute('aria-pressed', String(measurementsVisible));
  }
  const selectWrapper = $('measurement-select-wrapper');
  if (selectWrapper) {
    selectWrapper.hidden = !measurementsVisible;
  }
  const select = $('measurement-select');
  if (select) {
    select.setAttribute('aria-label', text.selectMeasurement);
  }

  if (errorKey) {
    $('viewer-error').innerHTML = `
      <div class="viewer-fallback-card" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; box-sizing:border-box;">
        <p style="font-weight:600; color:#b91c1c; font-size:13px; line-height:1.5; margin:0;">${text[errorKey]}</p>
        <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:6px; max-width:260px; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
          <img src="../product-28/assets/page_7.png" alt="Catalogue page 7 reference" style="max-width:100%; height:auto; display:block; border-radius:4px;">
        </div>
      </div>
    `;
  }
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

const toggleBtn = $('toggle-measurements');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    measurementsVisible = !measurementsVisible;
    toggleBtn.setAttribute('aria-pressed', String(measurementsVisible));
    const text = messages[language];
    toggleBtn.textContent = measurementsVisible ? text.hideMeasurements : text.showMeasurements;
    const selectWrapper = $('measurement-select-wrapper');
    if (selectWrapper) selectWrapper.hidden = !measurementsVisible;
    updateMeasurements(true);
  });
}
const measurementSelect = $('measurement-select');
if (measurementSelect) {
  measurementSelect.addEventListener('change', event => {
    selectedMeasurementId = event.target.value;
    updateMeasurements(false);
  });
}

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
  ['play', 'previous', 'next', 'assemble', 'explode', 'progress', 'reset', 'toggle-measurements'].forEach(id => {
    const el = $(id);
    if (el) el.disabled = true;
  });
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
  viewer = createScene($('viewport'), product29, motion.matches);
  $('loading').hidden = true;
  viewer.canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); showError('contextLost'); });
  translate();
  applyMotion();
  frame = requestAnimationFrame(animate);
} catch (error) {
  console.error('Product 29 viewer initialization failed:', error);
  showError('error');
}

document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(frame);
  previousTime = null;
  if (document.hidden) { state.seek(state.progress); update(); }
  else if (viewer && !errorKey) frame = requestAnimationFrame(animate);
});
window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); });
window.addEventListener('pageshow', event => {
  if (event.persisted && viewer && !errorKey) { previousTime = null; frame = requestAnimationFrame(animate); }
});
