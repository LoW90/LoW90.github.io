/* MFO_INTERNAL_LEARNING_START */
/* Application-owned preference learning. No network, ML runtime, or authority changes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.MFOInternalLearning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SCHEMA = 1, RETENTION = 90 * 86400000, MAX = 200;
  const id = x => typeof x === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,119}$/.test(x);
  const cleanFacets = xs => Array.isArray(xs) ? [...new Set(xs.filter(x => typeof x === 'string' && x.trim() && x.length <= 100).map(x => x.trim()))].slice(0, 8) : [];
  function create(siteId, saved, clock = () => Date.now()) {
    if (!id(siteId)) throw Error('Valid site identity required');
    const empty = () => ({schema: SCHEMA, siteId, enabled: false, version: 0, feedback: [], previous: null, internalDecisions: 0});
    let state = empty();
    function cleanFeedback(rows) {
      if (!Array.isArray(rows)) return [];
      const found = new Map();
      for (const x of rows.slice(-MAX)) {
        if (!x || !id(x.id) || ![-1, 1].includes(x.value) || !Number.isFinite(x.at) || x.at > clock() || x.at < clock() - RETENTION) continue;
        found.set(x.id, {id: x.id, value: x.value, facets: cleanFacets(x.facets), at: x.at});
      }
      return [...found.values()];
    }
    if (saved && saved.schema === SCHEMA && saved.siteId === siteId && saved.enabled === true) {
      state = {...empty(), enabled: true,
        version: Number.isSafeInteger(saved.version) && saved.version >= 0 ? saved.version : 0,
        feedback: cleanFeedback(saved.feedback),
        previous: Array.isArray(saved.previous) ? cleanFeedback(saved.previous) : null,
        internalDecisions: Number.isSafeInteger(saved.internalDecisions) && saved.internalDecisions >= 0 ? saved.internalDecisions : 0};
    }
    const prune = () => { state.feedback = cleanFeedback(state.feedback); if (state.previous) state.previous = cleanFeedback(state.previous); };
    function snapshot() { prune(); return JSON.parse(JSON.stringify(state)); }
    function enable(value) {
      if (value !== true) { state = empty(); return snapshot(); }
      state.enabled = true; return snapshot();
    }
    function feedback(productId, value, facets = []) {
      if (!state.enabled) throw Error('Explicit personalization consent required');
      if (!id(productId) || ![-1, 0, 1].includes(value)) throw Error('Invalid explicit preference');
      prune();
      const before = state.feedback.find(x => x.id === productId);
      const normalized = cleanFacets(facets);
      if (!before && value === 0) return snapshot();
      if (before?.value === value && JSON.stringify(before.facets) === JSON.stringify(normalized)) return snapshot();
      state.previous = state.feedback;
      state.feedback = state.feedback.filter(x => x.id !== productId);
      if (value) state.feedback.push({id: productId, value, facets: normalized, at: clock()});
      state.feedback = state.feedback.slice(-MAX); state.version++;
      return snapshot();
    }
    function undo() {
      if (state.previous === null) return false;
      state.feedback = cleanFeedback(state.previous); state.previous = null; state.version++; return true;
    }
    function rank(candidates, {personalize = true, record = true} = {}) {
      if (!Array.isArray(candidates) || candidates.length > 500) throw Error('Bounded candidates required');
      const seen = new Set();
      const rows = candidates.filter(x => x && id(x.id) && x.eligible === true && Number.isInteger(x.tier) && x.tier >= 0 && x.tier <= 100 && !seen.has(x.id) && seen.add(x.id));
      prune();
      const score = p => {
        const direct = state.feedback.find(x => x.id === p.id)?.value || 0;
        const facets = cleanFacets(p.facets);
        const matches = state.feedback.filter(x => x.id !== p.id && x.facets.some(f => facets.includes(f)));
        return direct * 4 + (matches.length ? matches.reduce((n, x) => n + x.value, 0) / matches.length : 0);
      };
      const active = state.enabled && personalize && state.feedback.length > 0;
      const output = rows.map((x, i) => ({x, i, score: active ? score(x) : 0}));
      // Applicability/fit tier always wins, with or without personalization. Preferences only
      // reorder within a tier. A shopper's explicit sort is applied by the storefront, not here.
      output.sort((a, b) => a.x.tier - b.x.tier || b.score - a.score || a.i - b.i);
      if (record && rows.length) state.internalDecisions++;
      return {ids: output.map(r => r.x.id), policyVersion: state.version,
        mode: active ? 'explicit-preference' : 'existing-rules',
        evidenceClass: active ? 'declared-preference' : 'catalog-rules', financialEffect: 'unavailable',
        receipt: {siteId, baseline: rows.map(x => x.id), selected: output.map(x => x.x.id), policyVersion: state.version, modelUsed: false}};
    }
    function summary() {
      prune();
      return {siteId, schema: SCHEMA, enabled: state.enabled, policyVersion: state.version,
        feedbackCount: state.feedback.length, internalDecisions: state.internalDecisions,
        modelDecisions: 0, externalModelDecisions: 0,
        observedModelShare: state.internalDecisions ? 0 : null,
        targetMaximumModelShare: 0.1, targetIsMeasuredAchievement: false,
        scope: 'explicit-preference-ranking', businessPerformance: 'unavailable',
        modelProvider: 'disabled', controlCenter: 'disconnected'};
    }
    function assistance() { return {available: false, reason: 'No ML provider is configured or authorized', fallback: 'existing-rules', modelUsed: false}; }
    return Object.freeze({snapshot, enable, feedback, undo, rank, summary, assistance});
  }
  return Object.freeze({create, schemaVersion: SCHEMA});
});

/* Collection-only adapter. Explicit feedback stays on this origin/device. */
(function (root) {
  'use strict';
  // Experiments (D-022). FNV-1a with a Murmur finalizer; experiments.cjs carries the same function.
  function fnv1a(text) {
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16;
    return h >>> 0;
  }
  function randomId(length) {
    const bytes = new Uint8Array(length);
    try { root.crypto.getRandomValues(bytes); } catch { for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256); }
    return [...bytes].map(b => (b % 36).toString(36)).join('');
  }
  // Outbound sub-ID (D-022, D-027): x.<experiment>.<arm>.<random>[.<placement>], or p.<placement>.<random> when no
  // experiment runs. A placement comes from the link's data-mf-placement (for example a guide's code), so a sale can be
  // traced to the guide that sent it. Set only when the site names its network's sub-ID parameter.
  function installSubIds(config, primary, result) {
    const param = config.outbound?.subIdParam;
    if (!param || !/^[A-Za-z0-9_-]{1,40}$/.test(param) || !root.document) return;
    root.document.addEventListener('click', event => {
      const link = event.target?.closest?.('a[href]'); if (!link) return;
      let url; try { url = new URL(link.href, root.location.href); } catch { return; }
      if (!/^https?:$/.test(url.protocol) || url.origin === root.location.origin || url.searchParams.has(param)) return;
      const raw = link.getAttribute?.('data-mf-placement') || '';
      const place = /^[a-z0-9]{1,12}$/.test(raw) ? raw : '';
      let id;
      if (primary) id = 'x.' + primary.id + '.' + result.arms[primary.id] + '.' + randomId(12) + (place ? '.' + place : '');
      else if (place) id = 'p.' + place + '.' + randomId(12);
      else return;
      url.searchParams.set(param, id);
      link.href = url.href;
    }, true);
  }
  // The visitor number and arm stay on this device. The arm leaves only inside an outbound sub-ID,
  // and only when the site names its affiliate network's sub-ID parameter (config.outbound.subIdParam).
  function installExperiments(config) {
    const today = new Date().toISOString().slice(0, 10);
    const active = (Array.isArray(config.experiments) ? config.experiments : []).filter(x => x && /^[a-z0-9]{1,20}$/.test(x.id) &&
      Array.isArray(x.arms) && x.arms.length === 2 && x.start <= today && today <= x.end);
    const result = {arms: {}, personalizeOffer: null};
    if (!active.length) { installSubIds(config, null, result); return result; }
    const key = 'mfo:visitor:v1:' + config.siteId;
    let visitor = null;
    try { visitor = localStorage.getItem(key); if (!/^[a-z0-9]{16}$/.test(visitor || '')) { visitor = randomId(16); localStorage.setItem(key, visitor); } }
    catch { visitor = randomId(16); }
    for (const x of active) {
      const u = fnv1a(x.id + ':' + visitor) / 4294967296;
      let edge = 0, arm = x.arms[x.arms.length - 1].name;
      for (const a of x.arms) { edge += a.weight; if (u < edge) { arm = a.name; break; } }
      result.arms[x.id] = arm;
      if (x.kind === 'personalize-offer' && result.personalizeOffer === null) result.personalizeOffer = arm === x.control ? 'control' : 'treatment';
    }
    if (root.document?.documentElement) root.document.documentElement.dataset.mfoExperiments = Object.entries(result.arms).map(e => e.join(':')).join(' ');
    root.MFOExperiments = Object.freeze({...result.arms});
    installSubIds(config, active[0], result);
    return result;
  }
  root.installMFOInternalLearning = function (config) {
    // Shopper-visible controls ship off by default and need a design pass before a site enables them.
    if (config.enabled !== true) return;
    if (!root.document || typeof document.querySelectorAll !== 'function' || typeof root.MutationObserver !== 'function' || !root.MFOInternalLearning) return;
    if (root.__mfoLearningInstalled) return;
    root.__mfoLearningInstalled = config.siteId;
    // A visitor in an experiment's control arm sees the generic page: no personalization controls.
    if (installExperiments(config).personalizeOffer === 'control') return;
    const key = 'mfo:internal-learning:v1:' + config.siteId;
    let saved = null, durable = true, scheduled = false;
    try { saved = JSON.parse(localStorage.getItem(key)); } catch { durable = false; }
    const engine = root.MFOInternalLearning.create(config.siteId, saved);
    let lastDecision = '', current = new Map(), baseline = new WeakMap();
    const persist = () => {
      try { if (engine.summary().enabled) localStorage.setItem(key, JSON.stringify(engine.snapshot())); else localStorage.removeItem(key); durable = true; }
      catch { durable = false; }
    };
    const button = (text, action) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.dataset.mfoLearning = action;
      b.style.cssText = 'font:inherit;font-size:12px;line-height:1.4;color:inherit;background:transparent;border:1px solid currentColor;border-radius:3px;padding:8px 10px;cursor:pointer;min-height:44px;';
      return b;
    };
    function hydrate() {
      scheduled = false;
      if (config.requiredSelector && !document.querySelector(config.requiredSelector)) return;
      const container = document.querySelector(config.container);
      if (!container) return;
      let controls = container.previousElementSibling;
      if (!controls?.matches('[data-mfo-learning-controls]')) {
        controls = document.createElement('div'); controls.dataset.mfoLearningControls = '';
        controls.style.cssText = 'margin:12px 0;padding:12px;border:1px solid currentColor;border-radius:4px;font:inherit;line-height:1.5;max-width:100%;';
        const label = document.createElement('label'), toggle = document.createElement('input');
        toggle.type = 'checkbox'; toggle.dataset.mfoLearning = 'toggle'; toggle.style.cssText = 'width:auto;margin-right:8px;';
        label.append(toggle, document.createTextNode('Personalize this collection on this device'));
        const note = document.createElement('p'); note.dataset.mfoLearningNote = ''; note.style.cssText = 'margin:6px 0;font-size:14px;';
        note.setAttribute('role', 'status');
        controls.append(label, note, button('Undo last preference', 'undo'), document.createTextNode(' '), button('Reset preferences', 'reset'));
        container.before(controls);
      }
      const enabled = engine.summary().enabled;
      const check = controls.querySelector('input'); if (check.checked !== enabled) check.checked = enabled;
      const note = enabled ? (durable ? 'Uses your More/Less feedback to order this collection. Your preference feedback stays on this device.' : 'Preferences work for this visit only because this browser could not save them.') : 'Optional. Turn on to give More/Less feedback. Turning off deletes these preferences.';
      const noteEl = controls.querySelector('[data-mfo-learning-note]'); if (noteEl.textContent !== note) noteEl.textContent = note;
      controls.querySelector('[data-mfo-learning="undo"]').disabled = !enabled || engine.snapshot().previous === null;
      controls.querySelector('[data-mfo-learning="reset"]').disabled = !enabled;
      const nodes = [...container.querySelectorAll(config.card)]; current = new Map();
      const candidates = [];
      nodes.forEach((card, index) => {
        const marker = card.querySelector(config.idSelector), productId = marker?.getAttribute(config.idAttribute);
        if (!productId || current.has(productId)) return;
        if (!baseline.has(card)) baseline.set(card, index);
        const facet = card.querySelector(config.facetSelector)?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 100);
        // Fit tier and eligibility come from the store's own rules when the card exposes them.
        const tierText = config.tierAttribute ? card.getAttribute(config.tierAttribute) : null;
        const tier = tierText !== null && /^\d{1,3}$/.test(tierText) && Number(tierText) <= 100 ? Number(tierText) : 0;
        const eligible = config.eligibleAttribute ? card.getAttribute(config.eligibleAttribute) !== 'false' : true;
        const row = {id: productId, eligible, tier, facets: facet ? [facet] : []};
        current.set(productId, {card, row}); candidates.push(row);
        let feedback = card.querySelector('[data-mfo-learning-feedback]');
        if (!feedback) {
          feedback = document.createElement('div'); feedback.dataset.mfoLearningFeedback = productId;
          feedback.style.cssText = 'padding:10px;display:flex;gap:8px;flex-wrap:wrap;font-size:13px;';
          const more = button('More like this', 'more'), less = button('Less like this', 'less');
          more.style.minHeight = less.style.minHeight = '44px';
          feedback.append(more, less); card.append(feedback);
        }
        feedback.hidden = !enabled; feedback.style.display = enabled ? 'flex' : 'none';
        const value = engine.snapshot().feedback.find(x => x.id === productId)?.value;
        feedback.querySelector('[data-mfo-learning="more"]').setAttribute('aria-pressed', String(value === 1));
        feedback.querySelector('[data-mfo-learning="less"]').setAttribute('aria-pressed', String(value === -1));
        feedback.querySelector('[data-mfo-learning="more"]').style.fontWeight = value === 1 ? '700' : '400';
        feedback.querySelector('[data-mfo-learning="less"]').style.fontWeight = value === -1 ? '700' : '400';
      });
      const sort = config.sortSelector ? document.querySelector(config.sortSelector)?.value : null;
      const curated = !config.sortSelector || config.curatedValues.includes(sort);
      if (!curated || !candidates.length) return; // Explicit sorting always wins.
      candidates.sort((a, b) => baseline.get(current.get(a.id).card) - baseline.get(current.get(b.id).card));
      const signature = JSON.stringify([candidates.map(x => x.id), engine.summary().policyVersion, enabled]);
      const result = engine.rank(candidates, {personalize: enabled, record: enabled && signature !== lastDecision});
      if (enabled && signature !== lastDecision) { lastDecision = signature; persist(); }
      const ranked = result.ids.map(x => current.get(x).card);
      // Cards the store marks ineligible keep their place after every eligible card.
      const desired = [...ranked, ...nodes.filter(n => !ranked.includes(n))];
      if (nodes.some((node, i) => node !== desired[i])) {
        const focused = container.contains(document.activeElement) ? document.activeElement : null;
        for (const node of desired) container.append(node);
        if (focused) focused.focus({preventScroll: true});
      }
    }
    function schedule() { if (!scheduled) { scheduled = true; root.requestAnimationFrame(hydrate); } }
    document.addEventListener('change', event => {
      if (event.target?.dataset.mfoLearning === 'toggle') { engine.enable(event.target.checked === true); lastDecision = ''; persist(); schedule(); }
    });
    document.addEventListener('click', event => {
      const target = event.target?.closest?.('[data-mfo-learning]'); if (!target || target.dataset.mfoLearning === 'toggle') return;
      const action = target.dataset.mfoLearning;
      if (!['undo', 'reset', 'more', 'less'].includes(action)) return;
      if (action === 'undo') engine.undo();
      else if (action === 'reset') { engine.enable(false); engine.enable(true); }
      else {
        const productId = target.closest('[data-mfo-learning-feedback]')?.dataset.mfoLearningFeedback;
        const data = current.get(productId); if (!data || !engine.summary().enabled) return;
        engine.feedback(productId, action === 'more' ? 1 : -1, data.row.facets);
      }
      persist(); schedule();
    });
    function start() {
      new MutationObserver(mutations => {
        if (mutations.some(m => !m.target.closest?.('[data-mfo-learning-controls],[data-mfo-learning-feedback]'))) schedule();
      }).observe(document.body, {childList: true, subtree: true});
      schedule();
    }
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, {once: true});
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-home-gym","container":"#mfPicks","card":":scope > .mf-pick","idSelector":"[data-detail]","idAttribute":"data-detail","facetSelector":".mf-room__brand","sortSelector":"[data-mf-sort]","curatedValues":[""],"experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-10","end":"2027-05-10"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
/* Standalone room store script (D-038). Copied unchanged into each standalone store as shopify/src/site.js and built into
   the theme's main script. Films that play as they scroll into view, the menu, collection filters, the private shortlist
   with side-by-side comparison, and the adapter the shared Keep script reads (window.MF_SHORTLIST).
   Nothing leaves the browser: the shortlist lives in localStorage until the shopper asks for a link. */
(() => {
  'use strict';
  const S = window.MF_SITE || {};
  const KEY = 'mf-site-saved:' + (S.store || 'store');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  let catalog = [];
  try { catalog = JSON.parse(($('#mf-site-catalog') || {}).textContent || '[]'); } catch { catalog = []; }
  const byHandle = new Map(catalog.map(p => [p.h, p]));

  /* ---- films: load and play muted when in view, pause when out; respect reduced motion and data saver ---- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData);
  function load(v) {
    if (v.dataset.mfLoaded) return;
    v.dataset.mfLoaded = '1';
    $$('source[data-src]', v).forEach(s => { s.src = s.dataset.src; });
    v.load();
  }
  const films = $$('video[data-mf-film], .mf-site__hero-media video, .mf-room__maker-media video');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { load(v); v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else if (!v.paused) v.pause();
    }), {threshold: 0.25});
    films.forEach(v => io.observe(v));
  }
  $$('[data-mf-motion-toggle]').forEach(btn => {
    const v = document.getElementById(btn.getAttribute('aria-controls'));
    if (!v || reduce) return;
    btn.hidden = false;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const stop = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(stop));
      btn.textContent = stop ? 'Play motion' : 'Pause motion';
      if (stop) v.pause(); else { load(v); v.play().catch(() => {}); }
    });
  });

  /* ---- menu (Sauna and Robotics layouts) ---- */
  [['menuToggle', 'navLinks'], ['mobileToggle', 'mobileMenu']].forEach(([b, m]) => {
    const btn = document.getElementById(b), menu = document.getElementById(m);
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (m === 'mobileMenu') menu.hidden = !open; else menu.classList.toggle('open', open);
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); if (m === 'mobileMenu') menu.hidden = true; else menu.classList.remove('open'); } });
  });

  /* ---- shortlist ---- */
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(h => byHandle.has(h)) : []; } catch { return []; } };
  let saved = read();
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {} render(); };
  const toast = msg => { const t = $('#toast'); if (!t) return; t.textContent = msg; clearTimeout(toast.t); toast.t = setTimeout(() => { t.textContent = ''; }, 2600); };
  function toggle(h) {
    const at = saved.indexOf(h);
    if (at >= 0) saved.splice(at, 1); else saved.push(h);
    write();
    const p = byHandle.get(h);
    toast(at >= 0 ? `Removed ${p ? p.n : ''} from your shortlist` : `Saved ${p ? p.n : ''} to your shortlist`);
  }
  function render() {
    $$('[data-mf-saved-count]').forEach(el => { el.textContent = String(saved.length); });
    $$('[data-mf-save]').forEach(b => b.setAttribute('aria-pressed', String(saved.includes(b.dataset.mfSave))));
    const box = $('[data-mf-compare]'), empty = $('[data-mf-saved-empty]');
    if (!box) return;
    const items = saved.map(h => byHandle.get(h)).filter(Boolean);
    if (empty) empty.hidden = items.length > 0;
    box.hidden = !items.length;
    if (!items.length) { box.innerHTML = ''; return; }
    const root = S.root || '/';
    const row = (label, fn) => `<tr><th scope="row">${label}</th>${items.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`;
    box.innerHTML = `<table><caption class="visually-hidden">Your saved pieces side by side</caption><thead><tr><th scope="col"><span class="visually-hidden">Detail</span></th>${items.map(p => `<th scope="col"><a href="${esc(root)}products/${esc(p.h)}">${esc(p.n)}</a></th>`).join('')}</tr></thead><tbody>`
      + row('Maker', p => esc(p.b)) + row('Kind', p => esc(p.k)) + row('Price snapshot', p => `${esc(p.p)}<br><small>at ${esc(p.m)}</small>`)
      + row('Key facts', p => `<ul>${p.f.map(f => `<li>${esc(f)}</li>`).join('')}</ul>`)
      + row('Merchant', p => `<a class="mf-buy mf-room__buy" href="${esc(p.u)}" target="_blank" rel="sponsored noopener" data-mf-placement="${esc(S.code || '')}" data-mf-cta="buy">${esc(String(S.buy || 'Check price at [Merchant] ↗').replace(/\[(Merchant|Dealer)\]/, p.m))}</a>`)
      + row('', p => `<button type="button" data-mf-save="${esc(p.h)}" aria-pressed="true">Remove</button>`)
      + '</tbody></table>';
  }
  document.addEventListener('click', e => {
    const save = e.target.closest('[data-mf-save]');
    if (save) { e.preventDefault(); toggle(save.dataset.mfSave); return; }
    const open = e.target.closest('[data-mf-saved-open]');
    if (open) { const target = $('#saved'); if (target) { e.preventDefault(); target.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); } }
  });
  window.MF_SHORTLIST = {
    snapshot: () => saved.length ? {v: 1, items: saved.slice()} : null,
    restore: data => { if (data && Array.isArray(data.items)) { saved = data.items.filter(h => byHandle.has(h)); write(); } },
    open: () => { const t = $('#saved'); if (t) t.scrollIntoView(); else location.href = (S.root || '/') + '#saved'; },
    ids: () => saved.slice(),
    compare: () => { const t = $('#saved'); if (t) t.scrollIntoView(); },
  };

  /* ---- collection filters ---- */
  const grid = $('#mfPicks');
  if (grid) {
    const cards = $$('.mf-pick', grid), order = cards.slice();
    const state = {kind: '', maker: '', sort: ''};
    const makerSel = $('[data-mf-maker-select]'), sortSel = $('[data-mf-sort]'), count = $('[data-mf-count]'), none = $('[data-mf-empty]');
    function apply() {
      let shown = 0;
      const list = state.sort ? order.slice().sort((a, b) => ((+a.dataset.price || 0) - (+b.dataset.price || 0)) * (state.sort === 'asc' ? 1 : -1)) : order;
      list.forEach(el => grid.appendChild(el));
      cards.forEach(el => {
        const ok = (!state.kind || el.dataset.kind === state.kind) && (!state.maker || el.dataset.maker === state.maker);
        el.hidden = !ok; if (ok) shown++;
      });
      if (count) count.textContent = `${shown} ${shown === 1 ? 'piece' : 'pieces'}`;
      if (none) none.hidden = shown > 0;
      $$('[data-mf-kind]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mfKind === state.kind)));
      if (makerSel) makerSel.value = state.maker;
    }
    $$('[data-mf-kind]').forEach(b => b.addEventListener('click', () => { state.kind = b.dataset.mfKind; apply(); }));
    if (makerSel) makerSel.addEventListener('change', () => { state.maker = makerSel.value; apply(); });
    if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(); });
    $$('[data-mf-reset]').forEach(b => b.addEventListener('click', () => { state.kind = ''; state.maker = ''; apply(); }));
    $$('[data-mf-filter-maker]').forEach(b => b.addEventListener('click', () => {
      state.maker = b.dataset.mfFilterMaker; state.kind = ''; apply();
      $('#shop').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
    }));
    // ?model=<handle> (from a product page or a shared link) brings that piece into view.
    const model = new URLSearchParams(location.search).get('model');
    const hit = model && cards.find(el => el.dataset.mfRoomProduct === model);
    if (hit) { hit.scrollIntoView(); hit.classList.add('is-focus'); }
  }
  render();
})();
