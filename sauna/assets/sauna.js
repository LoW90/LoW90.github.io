/* Shopify adapter for The Sauna Edit site script (prepended to it by build.mjs).
   Catalog: the research profiles in the site script, narrowed to the products published in the store
   (snippets/store-data). With no store products yet, all six research profiles show, so the theme works before the
   CSV import. A store title, vendor and photo win over the research record. Products added only in Shopify appear too:
   tags placement:Outdoor|Indoor|Custom and heat:Traditional|Infrared feed the filters. */
window.MFS_CATALOG = function (research) {
  const store = Array.isArray(window.MFS_STORE) ? window.MFS_STORE : [];
  if (!store.length) return research;
  const byHandle = new Map(store.map(s => [s.handle, s]));
  const tag = (s, k) => (s.tags || []).map(String).find(t => t.toLowerCase().startsWith(k + ':'))?.slice(k.length + 1);
  const pickOf = (v, list, fallback) => list.find(x => x.toLowerCase() === String(v || '').toLowerCase()) || fallback;
  const withStore = (p, s) => ({...p, name: s.title || p.name, brand: s.vendor || p.brand, image: s.image || null, url: s.url || null});
  const products = research.filter(p => byHandle.has(p.id)).map(p => withStore(p, byHandle.get(p.id)));
  const known = new Set(research.map(p => p.id));
  for (const s of store) {
    if (known.has(s.handle)) continue;
    const placement = pickOf(tag(s, 'placement'), ['Outdoor', 'Indoor', 'Custom'], 'Custom');
    const heat = pickOf(tag(s, 'heat'), ['Traditional', 'Infrared'], 'Traditional');
    products.push(withStore({id: s.handle, brand: '', name: '', placement, heat, shape: heat === 'Infrared' ? 'infrared' : 'custom', price: null,
      capacity: 'Not recorded', size: 'Not recorded', caption: 'Added in the store; research details not recorded yet.', best: 'Research pending',
      heater: 'Confirm heater, controls and electrical requirements with the seller', source: null, offers: []}, s));
  }
  return products;
};

/* The site script looks up Operations-demo elements that the storefront leaves out (that work belongs to Control
   Center). Missing elements get an inert, detached stand-in so the rest of the script runs unchanged. */
window.MFS_STUB = (function () {
  const stubs = new Map();
  return id => { if (!stubs.has(id)) stubs.set(id, document.createElement('div')); return stubs.get(id); };
})();

/* After the site script starts: /?model=<handle> (linked from product pages) opens that model's dossier. */
window.MFS_READY = function ({productDetail}) {
  const model = new URLSearchParams(location.search).get('model');
  if (model) productDetail(model);
};

/* Pages other than Home use the same header without the site script: menu, shortlist and privacy go to Home. */
document.addEventListener('click', e => {
  if (document.getElementById('productGrid')) return;
  const home = window.MFS_ROOT || '/';
  const menu = e.target.closest('#menuToggle');
  if (menu) {
    const open = document.getElementById('navLinks').classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    return;
  }
  if (e.target.closest('#shortlistTop')) location.href = home + '#shop';
  else if (e.target.closest('#footerPrivacy')) { e.preventDefault(); location.href = home + '#about'; }
});

(function(){if(!document.getElementById('productGrid'))return;

'use strict';
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
  // The visitor number and arm stay on this device. The arm leaves only inside an outbound sub-ID,
  // and only when the site names its affiliate network's sub-ID parameter (config.outbound.subIdParam).
  function installExperiments(config) {
    const today = new Date().toISOString().slice(0, 10);
    const active = (Array.isArray(config.experiments) ? config.experiments : []).filter(x => x && /^[a-z0-9]{1,20}$/.test(x.id) &&
      Array.isArray(x.arms) && x.arms.length === 2 && x.start <= today && today <= x.end);
    const result = {arms: {}, personalizeOffer: null};
    if (!active.length) return result;
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
    const param = config.outbound?.subIdParam, primary = active[0];
    if (param && /^[A-Za-z0-9_-]{1,40}$/.test(param) && root.document) {
      root.document.addEventListener('click', event => {
        const link = event.target?.closest?.('a[href]'); if (!link) return;
        let url; try { url = new URL(link.href, root.location.href); } catch { return; }
        if (!/^https?:$/.test(url.protocol) || url.origin === root.location.origin || url.searchParams.has(param)) return;
        url.searchParams.set(param, 'x.' + primary.id + '.' + result.arms[primary.id] + '.' + randomId(12));
        link.href = url.href;
      }, true);
    }
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

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-sauna","container":"#productGrid","card":":scope > .product","idSelector":"[data-detail]","idAttribute":"data-detail","facetSelector":".product-brand","experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-01","end":"2027-04-30"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
const RESEARCH_DATE='2026-10-20';
const URLS={
  e7t:'https://topture.com/products/saunalife-model-e7-sauna-barrel-ergo-series',
  e7s:'https://selectsaunas.com/products/saunalife-model-e7-sauna-barrel-4-person-ergo-series-sauna-barrel-71x81',
  x2t:'https://topture.com/products/saunalife-x2-2-person-traditional-indoor-sauna',
  x2s:'https://selectsaunas.com/products/saunalife-x2-1-2-person-indoor-traditional-sauna',
  cl5t:'https://topture.com/collections/saunalife-saunas',
  gl4t:'https://topture.com/collections/saunalife-saunas',
  sc:'https://saunacloud.com/affiliates/',
  sy:'https://sweatyyeti.com/',
  cls2:'https://infraredsauna.com/pricelist',
  slb:'https://www.sunlighten.com/saunas/mpulse-infrared-saunas/believe/',
  auc:'https://peaksaunas.com/products/auroom-cala-traditional-sauna-wood',
  shl:'https://sunhomesaunas.com/collections/best-outdoor-sauna/products/2-person-outdoor-infrared-sauna',
  shs:'https://sunhomesaunas.com/collections/best-outdoor-sauna/products/sun-home-solaris-traditional-sauna-small',
  skr:'https://sweatkingdom.com/products/the-ridge',
  pai:'https://plunge.com/products/plunge-all-in'
};
const products=MFS_CATALOG([
 {id:'saunalife-e7',brand:'SaunaLife',name:'E7 · ERGO outdoor barrel',placement:'Outdoor',heat:'Traditional',shape:'barrel',price:5190,capacity:'4 people',size:'Approx. 5′11″ long × 6′9″ diameter',caption:'A generous outdoor ritual with curved thermally modified wood.',best:'Best for compact backyard traditional heat',heater:'Electric heater package must be selected separately',source:'https://saunalife.com/',offers:[{id:'e7-topture',merchant:'Topture',merchantId:'topture',price:5190,shipping:'Freight quote and displayed totals require confirmation; a $950 freight line is mentioned',heater:'Not included in shell; selectable heater starts at $1,254 in examined listing',availability:'Batch timing varies',url:URLS.e7t},{id:'e7-select',merchant:'Select Saunas',merchantId:'select-saunas',price:5190,shipping:'Advertises free shipping on most saunas; verify E7 and destination',heater:'Confirm the heater bundle and exact configuration',availability:'Retailer lists in stock; reconfirm',url:URLS.e7s}]},
 {id:'saunalife-x2',brand:'SaunaLife',name:'X2 · indoor traditional',placement:'Indoor',heat:'Traditional',shape:'indoor',price:4990,capacity:'2 people',size:'Approx. 5′ × 5′ × 6′8″',caption:'Refined Nordic spruce walls and a generous glass front.',best:'Best for dedicated indoor wellness rooms',heater:'Review heater and power requirements with seller',source:'https://saunalife.com/saunas/xperience-series-model-x2/',offers:[{id:'x2-topture',merchant:'Topture',merchantId:'topture',price:4990,shipping:'Shipping estimate requires confirmation',heater:'Optional kits shown separately, starting at $1,254 in examined listing',availability:'Retailer page displayed unavailable; verify before ordering',url:URLS.x2t},{id:'x2-select',merchant:'Select Saunas',merchantId:'select-saunas',price:4990,shipping:'Advertises free shipping on most saunas; exclusions apply',heater:'Confirm inclusion; quote before comparing bundles',availability:'Live stock confirmation needed',url:URLS.x2s}]},
 {id:'saunalife-cl5g',brand:'SaunaLife',name:'CL5G · outdoor cube',placement:'Outdoor',heat:'Traditional',shape:'cube',price:5990,capacity:'3–4 people',size:'Verify exact external dimensions',caption:'A cleaner architectural silhouette for the landscaped garden.',best:'Best for design-forward outdoor spaces',heater:'Do not assume kit includes heater',source:URLS.cl5t,offers:[{id:'cl5g-topture',merchant:'Topture',merchantId:'topture',price:5990,shipping:'Verify current freight and delivery terms',heater:'Bundle configuration not verified',availability:'Inventory unverified',url:URLS.cl5t}]},
 {id:'saunalife-gl4',brand:'SaunaLife',name:'GL4 · glass-front outdoor cabin',placement:'Outdoor',heat:'Traditional',shape:'cube',price:9490,capacity:'3–4 people',size:'Confirm site footprint against installation manual',caption:'Panoramic glazing and outdoor cabin architecture.',best:'Best for modern home landscapes',heater:'Heater selection and electric service need verification',source:URLS.gl4t,offers:[{id:'gl4-topture',merchant:'Topture',merchantId:'topture',price:9490,shipping:'Confirm freight and offloading',heater:'Not yet verified as included',availability:'Inventory unverified',url:URLS.gl4t}]},
 {id:'saunacloud-custom',brand:'SaunaCloud',name:'Custom infrared installation',placement:'Custom',heat:'Infrared',shape:'infrared',price:null,capacity:'Project-specific',size:'Custom configuration',caption:'A made-to-measure infrared direction for a dedicated interior.',best:'Best for architect-led bespoke indoor spaces',heater:'Part of custom design process; confirm specifications',source:URLS.sc,offers:[]},
 {id:'sweaty-yeti-editorial',brand:'Sweaty Yeti',name:'Luxury collection · research profile',placement:'Custom',heat:'Traditional',shape:'custom',price:null,capacity:'Model-specific',size:'Model-specific',caption:'High-end sauna and hot/cold concepts. Exact models awaiting editorial verification.',best:'Best for a bespoke luxury research shortlist',heater:'Depends on exact verified configuration',source:URLS.sy,offers:[]},
 {id:'clearlight-sanctuary-2',brand:'Clearlight',name:'Sanctuary 2 · full-spectrum infrared',placement:'Indoor',heat:'Infrared',shape:'infrared',price:7299,capacity:'2 people',size:'Confirm dimensions on the manufacturer spec sheet',caption:'Full-spectrum infrared in a basswood or mahogany cabin for two.',best:'Best for a quiet indoor infrared room',heater:'Full-spectrum infrared heaters built in; mahogany version listed at $7,699; confirm the electrical circuit',source:URLS.cls2,checked:'2026-11-02',offers:[{id:'cls2-clearlight',merchant:'Clearlight',merchantId:'clearlight',price:7299,shipping:'Confirm delivery terms with Clearlight',heater:'Built in (basswood price shown)',availability:'Sale price shown with "order by November 30"; reconfirm after that date',url:URLS.cls2}]},
 {id:'sunlighten-mpulse-believe',brand:'Sunlighten',name:'mPulse Believe · smart infrared',placement:'Indoor',heat:'Infrared',shape:'infrared',price:null,capacity:'2 people',size:'Dimensions on request from Sunlighten',caption:'A smart near, mid and far infrared cabin with app-guided sessions.',best:'Best for a tech-forward indoor wellness room',heater:'Infrared emitters built in; electrical requirements given with the quote',source:URLS.slb,checked:'2026-11-02',offers:[]},
 {id:'auroom-cala',brand:'Auroom',name:'Cala · indoor traditional',placement:'Indoor',heat:'Traditional',shape:'indoor',price:8990,capacity:'2–3 people',size:'Exterior approx. 59″ × 59″ × 80¾″',caption:'Thermally modified aspen and clean Scandinavian lines from a European design house.',best:'Best for design-led indoor sauna rooms',heater:'Heater sold separately',source:URLS.auc,checked:'2026-11-02',offers:[{id:'cala-peak',merchant:'Peak Saunas',merchantId:'peak-saunas',price:8990,shipping:'Confirm delivery terms and destination',heater:'Sold separately',availability:'Listed at $8,990, down from $10,789; reconfirm stock',url:URLS.auc}]},
 {id:'sun-home-luminar-2',brand:'Sun Home',name:'Luminar · outdoor infrared for two',placement:'Outdoor',heat:'Infrared',shape:'infrared',price:10999,capacity:'2 people',size:'Exterior 51½″ × 57″ × 82.7″; 970 lb',caption:'A full-spectrum infrared cabin made for year-round backyard use.',best:'Best for outdoor infrared without a wood-fired build',heater:'Infrared built in; needs a dedicated 20 A GFCI circuit (NEMA L6-20) fitted by a licensed electrician',source:URLS.shl,checked:'2026-11-02',offers:[{id:'luminar-sunhome',merchant:'Sun Home Saunas',merchantId:'sun-home',price:10999,shipping:'Free US curbside shipping advertised; arrives palletized',heater:'Built in',availability:'Listed at $10,999, down from $11,599; reconfirm',url:URLS.shl}]},
 {id:'sun-home-solaris-4',brand:'Sun Home',name:'Solaris 4 · custom outdoor traditional',placement:'Outdoor',heat:'Traditional',shape:'cube',price:36399,capacity:'2–4 people',size:'Exterior 68.9″ × 90.1″ × 94.5″; 1,698 lb',caption:'Handcrafted to order in Europe and delivered structurally complete.',best:'Best for a statement outdoor sauna',heater:'6 kW electric heater included; hardwire to a dedicated 30 A circuit',source:URLS.shs,checked:'2026-11-02',offers:[{id:'solaris-sunhome',merchant:'Sun Home Saunas',merchantId:'sun-home',price:36399,shipping:'Free shipping advertised; electrician hardwiring not included',heater:'6 kW electric heater included',availability:'Made to order, about 3–4 months; listed at $36,399, down from $37,199',url:URLS.shs}]},
 {id:'sweat-kingdom-ridge',brand:'Sweat Kingdom',name:'The Ridge · outdoor sauna for two',placement:'Outdoor',heat:'Traditional',shape:'cube',price:7145,capacity:'2 people',size:'Exterior 59½″ × 59¼″ × 89½″',caption:'Handcrafted in Idaho with a tall window and two-tier benches.',best:'Best for American-made outdoor craftsmanship',heater:'6 kW heater included (Harvia KIP or Homecraft Revive Slim)',source:URLS.skr,checked:'2026-11-02',offers:[{id:'ridge-sweatkingdom',merchant:'Sweat Kingdom',merchantId:'sweat-kingdom',price:7145,shipping:'Confirm freight to your address',heater:'6 kW included',availability:'Both heater options showed sold out on 2026-11-02; reconfirm',url:URLS.skr}]},
 {id:'plunge-all-in',brand:'Plunge',name:'All-In · cold plunge',type:'Cold plunge',placement:'Indoor',heat:'Cold',shape:'custom',price:9990,capacity:'1 person',size:'76¾″ L × 31½″ W × 28¾″ H',caption:'The hot/cold companion to a sauna: chills to 37°F, indoors or out, with an optional heater to 104°F.',best:'Best for pairing cold therapy with a sauna',heater:'Cold only unless the heater add-on is chosen',source:URLS.pai,checked:'2026-11-02',offers:[{id:'allin-plunge',merchant:'Plunge',merchantId:'plunge',price:9990,shipping:'Free in-home delivery and placement; setup and power connection not included',heater:'Optional add-on, sold separately',availability:'Reconfirm; a holiday offer was advertised',url:URLS.pai}]}
]);
const merchants=[
 {id:'topture',name:'Topture',type:'Multibrand retailer',terms:'Up to 6%; starting tier unknown',cookie:'90 days advertised',status:'Not approached',research:'Verified public page',url:'https://topture.com/pages/affiliate-program',notes:'35-day hold; monthly bank transfer after $50 threshold; validate eligible SKUs, assisted sales'},
 {id:'sun-valley',name:'Sun Valley Saunas',type:'Multibrand retailer',terms:'Rate to verify',cookie:'Unverified',status:'Not approached',research:'Historical research lead',url:'https://sunvalleysaunas.com/',notes:'Require program application evidence and authorization'},
 {id:'sauna-kit-co',name:'Sauna Kit Co',type:'Multibrand retailer',terms:'Historical lead 5.5%; reverify identity',cookie:'Unverified',status:'Not approached',research:'Historical research lead',url:'',notes:'Check exact legal merchant and program identity'},
 {id:'select-saunas',name:'Select Saunas',type:'Multibrand retailer',terms:'5% public advertised',cookie:'Not verified',status:'Not approached',research:'Verified public page',url:'https://selectsaunas.com/pages/affiliate-program',notes:'Phone-assisted attribution needs written clarification'},
 {id:'saunakits',name:'SaunaKits.com',type:'Multibrand retailer',terms:'Starts at 4%; prior 10% indication unverified',cookie:'Not verified',status:'Not approached',research:'Verified public page',url:'https://saunakits.com/pages/affiliate-program',notes:'Get approved starting terms in writing'},
 {id:'my-sauna-world',name:'My Sauna World',type:'Multibrand retailer',terms:'Private opportunity; terms unknown',cookie:'Unverified',status:'Not approached',research:'Research candidate',url:'https://mysaunaworld.com/',notes:'Do not assume affiliate program'},
 {id:'haven-of-heat',name:'Haven of Heat',type:'Multibrand retailer',terms:'Private opportunity; terms unknown',cookie:'Unverified',status:'Not approached',research:'Research candidate',url:'https://havenofheat.com/',notes:'Do not assume affiliate program'},
 {id:'sauna-marketplace',name:'Sauna Marketplace',type:'Multibrand retailer',terms:'Private opportunity; identity to verify',cookie:'Unverified',status:'Not approached',research:'Research candidate',url:'',notes:'Resolve merchant identity before outreach'},
 {id:'sweaty-yeti',name:'Sweaty Yeti',type:'Direct manufacturer',terms:'Historical lead: $1,500 flat, unconfirmed',cookie:'Historical 30 days; unconfirmed',status:'Not approached',research:'Historical research lead',url:'https://sweatyyeti.com/',notes:'Negotiate luxury model tiers, lead registration and phone sales'},
 {id:'saunacloud',name:'SaunaCloud',type:'Direct manufacturer',terms:'7% pre-tax publicly advertised',cookie:'Conflicting official 60 / 180 days',status:'Not approached',research:'Conflicting official pages',url:'https://saunacloud.com/affiliates/',notes:'Require written cookie terms and quote attribution clarification'},
 {id:'sunlighten',name:'Sunlighten',type:'Direct manufacturer',terms:'6% on saunas, red light and accessories published on Awin (ID 63394); separate PartnerStack partner program, rate not published',cookie:'90 days published',status:'Not approached',research:'Verified public page 2026-11-02',url:'https://www.sunlighten.com/partnership',notes:'Prices are quote-only; confirm that quoted sales are tracked to the affiliate link'},
 {id:'clearlight',name:'Clearlight',type:'Direct manufacturer',terms:'5% published on Awin (ID 101701), but Sanctuary indoor and outdoor, Premier, custom builds and the Clearlight Plunge are excluded',cookie:'90 days published',status:'Not approached',research:'Verified public page 2026-11-02',url:'https://infraredsauna.com/',notes:'Our listed Sanctuary 2 earns no commission under the published terms; ask Clearlight for luxury model terms'},
 {id:'medical-saunas',name:'Medical Saunas',type:'Direct manufacturer',terms:'Official pages conflict: 15% ambassadors / up to 7% collabs',cookie:'Unverified',status:'Not approached',research:'Conflicting official pages',url:'https://medicalsaunas.com/pages/affiliate-marketing',notes:'Confirm actual channel agreement and eligible products'},
 {id:'sun-home',name:'Sun Home Saunas',type:'Direct manufacturer',terms:'Program on Impact; rate not published ("competitive")',cookie:'Not published',status:'Not approached',research:'Verified public page 2026-11-02',url:'https://sunhomesaunas.com/pages/become-an-affiliate',notes:'Rate shown only after approval'},
 {id:'sweat-kingdom',name:'Sweat Kingdom Saunas',type:'Direct manufacturer',terms:'5% to 10% published on Awin (ID 125462)',cookie:'30 days published',status:'Not approached',research:'Verified public page 2026-11-02',url:'https://sweatkingdom.com/',notes:'Handcrafted in Idaho; confirm which rate applies to which models'},
 {id:'redwood',name:'Redwood Outdoors',type:'Direct manufacturer',terms:'Not verified',cookie:'Unverified',status:'Not approached',research:'Research candidate',url:'https://www.redwoodoutdoors.com/',notes:'Validate eligibility and partner terms'},
 {id:'peak-saunas',name:'Peak Saunas',type:'Multibrand retailer',terms:'3% to 5% published on Awin (ID 118291); most start at 5%',cookie:'30 days published',status:'Not approached',research:'Verified public page 2026-11-02',url:'https://peaksaunas.com/',notes:'US lower 48 only; sells Auroom'},
 {id:'plunge',name:'Plunge',type:'Direct manufacturer',terms:'Impact; a directory (March 2024) lists $250 to $350 plus 5% per sale, unconfirmed',cookie:'Not published',status:'Not approached',research:'Directory listing',url:'https://plunge.com/',notes:'Not the Awin 122418 program, which is Plunge Chill, a different brand'}
];
const SCENARIOS={conservative:{impressions:2000000,organic:1,merchant:5,paid:.2,commission:700},base:{impressions:333333.333333,organic:3,merchant:10,paid:.5,commission:700},strong:{impressions:83333.333333,organic:6,merchant:20,paid:.8,commission:700}};
const money=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n):'—';const count=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(n):'—';const $=id=>document.getElementById(id)||MFS_STUB(id);const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let shortlist=[],consent='deny',collectionScope=null;const events=[];
/* Your Private Shortlist (mf-shortlist.js, D-026 in mfo-mLintelligence): the shared Keep panel reads and restores the shortlist here. */
window.MF_SHORTLIST={snapshot:()=>shortlist.length?{saved:[...shortlist]}:null,restore:data=>{const ids=Array.isArray(data?.saved)?data.saved.filter(id=>typeof id==='string'&&products.some(p=>p.id===id)).slice(0,3):[];if(!ids.length)return;shortlist=ids;$('shortCount').textContent=shortlist.length;renderProducts();announce('Your shortlist is back on this device.')},open:()=>{location.hash='shop';document.getElementById('shop')?.scrollIntoView()},ids:()=>[...shortlist]};
const COLLECTION_SCOPES={infrared:{label:'Indoor warmth',test:p=>p.heat!=='Cold'&&(p.placement==='Indoor'||p.heat==='Infrared')},cold:{label:'Hot / cold',test:p=>p.heat==='Cold'||/hot\/cold/i.test(p.caption)}};
function announce(t){$('toast').textContent=t;$('toast').style.display='block';clearTimeout(announce.timer);announce.timer=setTimeout(()=>$('toast').style.display='none',3000)}
function interaction(type,meta={}){if(consent!=='allow')return; const k=JSON.stringify({type,meta});if(events.some(e=>e.key===k))return;events.push({key:k,type,meta,t:new Date().toISOString()});$('localEventCount').textContent=events.length;$('localEventInfo').textContent='Demo events in this open page only; no network transmission or customer identity.';}
let modalOpener=null;
function openModal(html){if(!$('modal').classList.contains('open'))modalOpener=document.activeElement;$('modalContent').innerHTML=html;$('modal').classList.add('open');document.body.classList.add('no-overflow');$('modalClose').focus()}
function closeModal(){if(!$('modal').classList.contains('open'))return;$('modal').classList.remove('open');document.body.classList.remove('no-overflow');const o=modalOpener;modalOpener=null;if(o&&o.isConnected&&o.focus)o.focus()}
function trapFocus(e){if(e.key!=='Tab'||!$('modal').classList.contains('open'))return;const f=[...$('modal').querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const first=f[0],last=f[f.length-1];if(!$('modal').contains(document.activeElement)){e.preventDefault();first.focus()}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
function makeExternal(url,label,css='btn outline sm'){if(!url||!/^https:\/\/[a-z0-9.-]+\//i.test(url))return `<span class="subdued">No approved link</span>`;return `<a class="${css}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-external="1">${esc(label)} ↗</a>`}
function renderProducts(){const q=$('searchInput').value.toLowerCase().trim(),placement=$('placementFilter').value,heat=$('heatFilter').value,max=$('priceFilter').value;const scope=COLLECTION_SCOPES[collectionScope];const filtered=products.filter(p=>(!scope||scope.test(p))&&(p.brand+' '+p.name+' '+p.caption+' '+p.best).toLowerCase().includes(q)&&(placement==='all'||p.placement===placement)&&(heat==='all'||p.heat===heat)&&(max==='all'||(p.price!==null&&p.price<=+max)));$('resultCount').textContent=`${scope?scope.label+' collection · ':''}${filtered.length} researched ${filtered.length===1?'entry':'entries'} · Listing prices are dated research snapshots`; $('productGrid').innerHTML=filtered.map(p=>`<article class="product"><div class="product-art ${esc(p.shape)}${p.image?' has-photo':''}"${p.image?` style="background-image:url('${esc(p.image)}')"`:''}><span class="artlabel">${p.image?'Product photo from the store':'Original conceptual illustration · not product image'}</span></div><div class="product-body"><div class="product-brand">${esc(p.brand)} <span style="color:#747474">/ Research profile</span></div><h3>${esc(p.name)}</h3><p>${esc(p.caption)}</p><div class="chips"><span class="chip">${esc(p.placement)}</span><span class="chip">${esc(p.heat)}</span><span class="chip">${esc(p.capacity)}</span></div><div class="product-bottom"><div><small>${p.price===null?'Quote-based / unverified':'Equipment price snapshot from'}</small><strong>${p.price===null?'Request quote':money(p.price)}</strong></div><div class="subdued" style="max-width:105px;text-align:right">${p.offers.length?`${p.offers.length} seller ${p.offers.length===1?'source':'sources'}`:'No verified SKU offers'}</div></div><div class="product-buttons"><button class="btn" data-detail="${esc(p.id)}">Explore model ↗</button><button class="mini-check ${shortlist.includes(p.id)?'selected':''}" data-shortlist="${esc(p.id)}">${shortlist.includes(p.id)?'✓ Saved':'+ Compare'}</button></div></div></article>`).join('')||'<p class="empty">No matching researched models. Try adjusting the filters.</p>'}
function productDetail(id){let p=products.find(x=>x.id===id);if(!p)return;interaction('product_detail',{product_id:id});openModal(`<div class="eyebrow">Independent model dossier · research ${p.checked||RESEARCH_DATE}</div><h2 id="modalTitle">${esc(p.brand)} ${esc(p.name)}</h2><p>${esc(p.caption)} ${esc(p.best)}.</p><div class="chips"><span class="chip">${esc(p.placement)}</span><span class="chip">${esc(p.heat)}</span><span class="chip">${esc(p.capacity)}</span><span class="chip">${esc(p.size)}</span></div><div class="infobox"><strong>Before you buy:</strong> ${esc(p.heater)}. Equipment alone is not a fully installed project cost. Listings and stock require merchant reconfirmation.</div><h3>Compare sellers of this canonical model</h3><p class="subdued">Different merchant configurations are <b>not</b> treated as equivalent bundles without verification.</p>${p.offers.length?p.offers.map(o=>`<div class="offer"><div><strong>${esc(o.merchant)}</strong><small>Equipment listing snapshot · ${p.checked||RESEARCH_DATE} · not a verified promotion</small><small>Heater: ${esc(o.heater)}</small><small>Shipping: ${esc(o.shipping)}</small><small>Availability: ${esc(o.availability)}</small></div><div><strong>${money(o.price)}</strong><div style="margin-top:6px">${makeExternal(o.url,'Check price at '+o.merchant,'btn outline sm mf-buy')}</div></div></div>`).join(''):'<div class="note">This is an editorial research profile; there are no exact-model merchant offers verified for publication.</div>'}<div class="infobox">Retailer outbound links shown are <strong>non-affiliate informational links</strong>; no payment attribution or commissions are active.</div>${makeExternal(p.source,'Review primary source','btn ghost')}`)}
function toggleShortlist(id){if(shortlist.includes(id))shortlist=shortlist.filter(x=>x!==id);else if(shortlist.length<3)shortlist.push(id);else return announce('Compare up to three models at a time.');$('shortCount').textContent=shortlist.length;renderProducts();interaction('shortlist',{product_id:id})}
function compareShortlist(){if(!shortlist.length)return announce('Choose one or more products using + Compare.');let pp=shortlist.map(id=>products.find(p=>p.id===id));openModal(`<div class="eyebrow">Shortlist · up to three canonical models</div><h2 id="modalTitle">The considered comparison</h2><div class="compare-table"><table><thead><tr><th>Question</th>${pp.map(p=>`<th>${esc(p.brand)} ${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${[['Placement',p=>p.placement],['Heat',p=>p.heat],['Capacity',p=>p.capacity],['Manufacturer dimensions',p=>p.size],['Equipment from',p=>p.price===null?'Request quote':money(p.price)],['Buyer fit',p=>p.best],['Heater inclusion',p=>p.heater],['Retailer offer count',p=>String(p.offers.length)]].map(row=>`<tr><td>${esc(row[0])}</td>${pp.map(p=>`<td>${esc(row[1](p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="infobox">Model comparison is not a full installed-cost comparison. Offer configurations must be matched before choosing a seller.</div>${pp.map(p=>`<button class="btn outline sm" style="margin:5px" data-detail="${esc(p.id)}">Seller offers: ${esc(p.brand)} ${esc(p.name)}</button>`).join('')}`);interaction('compare',{products:shortlist.join(',')})}
function guide(key){const guides={heat:['Traditional, electric or infrared?','A traditional sauna uses a heater to warm the room and stones. Infrared cabins deliver radiant warmth to occupants and operate differently. Electric-heated traditional rooms typically need a dedicated correctly rated circuit; wood-fired installations need proper venting, chimney specifications, fire clearance and local authorization. Compare actual electrical ratings and installation manuals before selecting.'],site:['Site preparation for a luxury sauna','Measure the route from delivery truck to final placement. Verify access for pallets, forklifts or cranes, a stable and suitable pad, weather exposure, drainage, ventilation, setback restrictions, service access and structural requirements. Outdoor power circuits should be designed by a qualified electrician and inspected as locally required.']};const g=guides[key];if(!g)return;interaction('guide',{key});openModal(`<div class="eyebrow">The planning journal</div><h2 id="modalTitle">${esc(g[0])}</h2><p>${esc(g[1])}</p><div class="infobox">General editorial guidance only. Consult the manufacturer manual, local authority and licensed professionals for your particular installation.</div>`)}
const COST_IDS=['costShell','costHeater','costFreight','costElectric','costSite','costLabor','costPermits','costExtra'];
function costLines(){return COST_IDS.map(id=>{const raw=String($(id).value??'').trim(),n=Number(raw),ok=raw===''||(Number.isFinite(n)&&n>=0);const label=document.querySelector&&document.querySelector(`label[for="${id}"]`);return {id,label:label?label.textContent.replace(/\s*\(\$\)\s*$/,''):id,raw,counted:ok&&raw!==''?n:0,ignored:!ok}})}
function costTotal(){const lines=costLines(),total=lines.reduce((s,l)=>s+l.counted,0),bad=lines.filter(l=>l.ignored).length;$('costTotal').textContent=money(total);const note=$('costNote');if(note)note.textContent=bad?`${bad} entr${bad===1?'y is':'ies are'} negative or not a number and counted as $0.`:'';return total}
function download(name,text,format='text/plain'){const blob=new Blob([text],{type:format+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function saveCost(){const lines=costLines(),total=costTotal();download('sauna-project-worksheet.txt','THE SAUNA EDIT · PREVIEW WORKSHEET\nEstimate only, not a verified quote.\n'+lines.map(l=>l.label+': '+money(l.counted)+(l.ignored?` (entered "${l.raw}"; not a valid amount, counted as $0)`:'')).join('\n')+'\nTOTAL (before taxes / contingency): '+money(total)+'\nConfirm manufacturer specifications, written quotes and professional requirements.');announce('Worksheet saved locally.')}
function modalPolicy(){openModal(`<div class="eyebrow">Preview policy</div><h2 id="modalTitle">Privacy & affiliate disclosure</h2><p><strong>Affiliate notice.</strong> The Sauna Edit may later earn commissions from qualified purchases through approved partner links. No affiliate partner approvals or compensated links are active here. Listing prices and availability are research snapshots and not binding offers.</p><p><strong>Privacy in this file.</strong> No sign-in, checkout, third-party analytics scripts, pixels or backend event submissions are enabled. You may consent to optional counts of unique interactions while this browser tab remains open; nothing is sent to a server. Your consent choice applies only to the current open preview; it is not saved to persistent storage. There is no mailing list or SMS campaign.</p><div class="privacy-controls"><strong>Optional local interaction counts: <span id="consentStatus">${consent==='allow'?'Enabled':'Off'}</span></strong><p>Optional counts exist only in this browser tab and are disabled unless you choose otherwise.</p><div class="privacy-actions"><button type="button" class="btn sm" data-consent-choice="allow">Enable local counts</button><button type="button" class="btn outline sm" data-consent-choice="deny">Keep off</button></div></div><p><strong>Comparing page versions.</strong> To compare two versions of this page fairly, this browser keeps a random visitor number. It is not linked to your name or email, it is never sent to us, and it only decides which version you see. If you follow a merchant link, the link may note which version you saw, never the number itself. Clearing site data removes it.</p><p><strong>Production requirements.</strong> Deploy a full jurisdiction-appropriate privacy policy with operator identity, retention, data handling, rights and consent controls before activating external measurement. A secure private operations area requires server-side authentication.</p>`)}
function correction(){openModal(`<div class="eyebrow">Editorial correction note</div><h2 id="modalTitle">Help us get the details right.</h2><p>This preview does not have an active contact inbox. Write a note and download it; please do not submit sensitive information.</p><label for="correctionText">Correction details</label><textarea id="correctionText" class="input" rows="5" placeholder="Model, seller page URL, the inaccurate detail, and suggested correction..."></textarea><button class="btn" id="downloadCorrection" style="margin-top:12px">Download note ↓</button>`)}
function escapeCSV(x){let s=String(x??'');return '"'+s.replace(/"/g,'""')+'"'}
function partnerCSV(){let headers=['merchant_id','merchant','type','public_terms','attribution','application_status','research_evidence','source_url','reviewed_at','notes'];let lines=[headers.join(',')];merchants.forEach(m=>lines.push([m.id,m.name,m.type,m.terms,m.cookie,m.status,m.research,m.url,RESEARCH_DATE,m.notes].map(escapeCSV).join(',')));download('many-faces-sauna-partners.csv',lines.join('\r\n'),'text/csv')}
function partnerTable(){$('partnerCount').textContent=merchants.length;$('partnersTable').innerHTML=merchants.map(m=>`<tr><td><strong>${esc(m.name)}</strong><br><small>${esc(m.id)}</small></td><td>${esc(m.type)}</td><td>${esc(m.terms)}<br><small>${esc(m.notes)}</small></td><td>${esc(m.cookie)}</td><td><span class="status-unverified">${esc(m.status)}</span></td><td>${m.url?makeExternal(m.url,'Source','btn ghost'):'<span>Needs research</span>'}<br><small>${esc(m.research)}</small></td></tr>`).join('')}
function pct(id){const n=Math.max(0,Number($(id).value)||0);if(n>100)pct.capped=true;return Math.min(100,n)/100}
function forecastModel(){const v=id=>Math.max(0,Number($(id).value)||0),impressions=v('fImpressions'),organic=pct('fOrganic'),merchant=pct('fMerchant'),paid=pct('fPaid'),commission=v('fCommission'),expenses=v('fExpenses'),visitCost=v('fVisitCost'),target=v('fTarget');const visits=impressions*organic,clicks=visits*merchant,sales=clicks*paid,rev=sales*commission,profit=rev-expenses-visits*visitCost;return {impressions,organic,merchant,paid,commission,expenses,visitCost,target,visits,clicks,sales,rev,profit}}
function targetRow(target,m){const unit=m.commission*m.paid,clicks=unit>0?target/unit:NaN,visits=m.merchant>0?clicks/m.merchant:NaN,impressions=m.organic>0?visits/m.organic:NaN;return `<tr><td>${money(target)}</td><td>${unit>0?count(clicks*m.paid):'—'}</td><td>${count(clicks)}</td><td>${count(visits)}</td><td>${count(impressions)}</td></tr>`}
function renderForecast(){const m=forecastModel();$('forecastCards').innerHTML=[["Estimated site visits",count(m.visits)],["Estimated outbound clicks",count(m.clicks)],["Expected paid sales",count(m.sales)],["Expected commission",money(m.rev)],["Commission / 1K impressions",m.impressions?money(m.rev/m.impressions*1000):'—'],["Commission / 1K visits",m.visits?money(m.rev/m.visits*1000):'—'],["Commission / 1K qualified clicks",m.clicks?money(m.rev/m.clicks*1000):'—'],["After modelled operating / traffic costs",money(m.profit)]].map(([k,v])=>`<div class="ops-card"><span>${esc(k)}</span><b>${esc(v)}</b><em>Estimated · not measured</em></div>`).join('');$('targetsTable').innerHTML=[1000,3500,10000,25000,50000,m.target].filter((x,i,a)=>x>0&&a.indexOf(x)===i).sort((a,b)=>a-b).map(x=>targetRow(x,m)).join('');$('funnelPreview').innerHTML=[['Search impressions',m.impressions],['Organic clicks / visits',m.visits],['Qualified merchant clicks',m.clicks],['Paid sale expected value',m.sales],['Expected paid commission',m.rev,true],['Reported orders',null],['Approved commissions',null],['Actually paid commissions',null]].map(([label,v,currency])=>`<div class="stage"><small>${esc(label)}</small><b>${v===null?'—':currency?money(v):count(v)}</b><small>${v===null?'UNAVAILABLE':'ESTIMATED'}</small></div>`).join('');breakEven()}
function applyScenario(){const m=SCENARIOS[$('scenario').value];[['fImpressions',m.impressions],['fOrganic',m.organic],['fMerchant',m.merchant],['fPaid',m.paid],['fCommission',m.commission]].forEach(([k,v])=>$(k).value=String(v));renderForecast()}
function breakEven(){pct.capped=false;const cR=Math.max(0,Number($('retailerC').value)||0),rR=pct('retailerR'),cD=Math.max(0,Number($('directC').value)||0),rD=pct('directR'),capped=pct.capped;const ret=1000*cR*rR,dir=1000*cD*rD,breakRate=cD?ret/(1000*cD)*100:NaN;$('breakEven').textContent=`Retailer: ${money(ret)} / 1,000 clicks. Direct: ${money(dir)} / 1,000 clicks. A ${money(cD)} direct sale must reach ${Number.isFinite(breakRate)?breakRate.toFixed(3)+'%':'N/A'} net paid conversion to match the retailer under these inputs. Small cohorts are statistically unreliable.${capped?' A rate above 100% is impossible and was capped at 100%.':''}${Number.isFinite(breakRate)&&breakRate>100?' The required direct rate exceeds 100%, so the direct payout cannot match the retailer at these inputs.':''}`}
function showOperations(){window.scrollTo({top:0,behavior:'instant'});$('publicSite').style.display='none';$('operations').classList.add('active');renderForecast();partnerTable();interaction('ops_preview')}
function showPublic(){$('operations').classList.remove('active');$('publicSite').style.display='block';window.scrollTo({top:0,behavior:'instant'})}
const CSV_COLUMNS=['referral_date','merchant_id','order_id','status','commission_amount','payment_date'],CSV_STATUSES=['tracked','reported','pending','approved','payable','paid','reversed','disputed','untracked'];
function csvRecords(raw){let rows=[],row=[],buf='',q=false,i=0;const s=String(raw).replace(/^﻿/,'');for(;i<s.length;i++){const c=s[i];if(q){if(c==='"'){if(s[i+1]==='"'){buf+='"';i++}else q=false}else buf+=c}else if(c==='"'){if(buf!=='')throw new Error('Unexpected quote inside an unquoted field');q=true}else if(c===','){row.push(buf);buf=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&s[i+1]==='\n')i++;row.push(buf);rows.push(row);row=[];buf=''}else buf+=c}if(q)throw new Error('Unterminated quoted field');if(buf!==''||row.length){row.push(buf);rows.push(row)}return rows.filter(r=>!(r.length===1&&r[0].trim()===''))}
function isoDate(x){if(!/^\d{4}-\d\d-\d\d$/.test(x))return false;const d=new Date(x+'T00:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===x}
function cents(x){if(!/^\d+(\.\d{1,2})?$/.test(x))return null;const [w,f='']=x.split('.');return Number(w)*100+Number((f+'00').slice(0,2))}
function csvParse(raw){const recs=csvRecords(raw);if(recs.length<2)throw new Error('CSV contains no records');if(recs.length>10001)throw new Error('Import is limited to 10,000 rows in this demo');const h=recs[0].map(x=>x.trim());const dup=h.find((x,i)=>x&&h.indexOf(x)!==i);if(dup)throw new Error('Duplicate column: '+dup);for(const k of CSV_COLUMNS)if(!h.includes(k))throw new Error('Missing column: '+k);return recs.slice(1).map((v,i)=>{const at='Invalid record at data row '+(i+1)+': ';if(v.length!==h.length)throw new Error(at+`expected ${h.length} fields, found ${v.length}`);const r=Object.fromEntries(h.map((k,j)=>[k,v[j].trim()]));r.status=r.status.toLowerCase();if(!isoDate(r.referral_date))throw new Error(at+'referral_date must be a real YYYY-MM-DD date');if(!r.merchant_id)throw new Error(at+'merchant_id is required');if(!merchants.some(m=>m.id===r.merchant_id))throw new Error(at+'unknown merchant_id '+r.merchant_id);if(!r.order_id)throw new Error(at+'order_id is required');if(!CSV_STATUSES.includes(r.status))throw new Error(at+'unknown status');if(r.commission_amount==='')throw new Error(at+'commission_amount is blank (unknown is not zero)');r.cents=cents(r.commission_amount);if(r.cents===null)throw new Error(at+'commission_amount must be a non-negative amount with at most two decimals; adjustments need an explicit adjustment record');if(r.payment_date&&!isoDate(r.payment_date))throw new Error(at+'payment_date must be a real YYYY-MM-DD date');if(r.status==='paid'&&!r.payment_date)throw new Error(at+'paid rows need a payment_date');if(r.payment_date&&r.payment_date<r.referral_date)throw new Error(at+'payment_date is before referral_date');return r})}
function csvDedupe(rows){const seen=new Map(),out=[];let duplicates=0;for(const r of rows){const k=r.merchant_id+'\u0000'+r.order_id,sig=CSV_COLUMNS.map(c=>c==='status'?r.status:r[c]).join('\u0000');if(seen.has(k)){if(seen.get(k)!==sig)throw new Error(`Conflicting rows for merchant ${r.merchant_id} order ${r.order_id}; revisions need a revision number before they can be compared`);duplicates++;continue}seen.set(k,sig);out.push(r)}return {rows:out,duplicates}}
const money2=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(c/100);
function csvImport(f){if(!f)return;if(f.size>5e6){$('importResults').textContent='File too large. 5 MB maximum.';return}let reader=new FileReader();reader.onload=()=>{try{const {rows,duplicates}=csvDedupe(csvParse(String(reader.result)));const sum=st=>rows.filter(r=>st.includes(r.status)).reduce((s,r)=>s+r.cents,0);$('importResults').textContent=`IMPORTED LOCAL FILE (not verified): ${rows.length} unique rows${duplicates?` (${duplicates} exact duplicate${duplicates===1?'':'s'} ignored)`:''}, ${money2(sum(['paid']))} status=paid, ${money2(sum(['pending','approved','payable']))} in pending/approved/payable states, ${money2(sum(['reversed','disputed']))} reversed or disputed. Amounts assumed USD; the file has no currency column. No evidence of bank deposit or merchant authentication is implied. File remains in your browser memory only.`}catch(e){$('importResults').textContent='Import rejected: '+e.message}};reader.readAsText(f)}
function readiness(){let rows=[['Customer experience','Working preview: filters, shortlist, comparison, planning worksheet'],['Affiliate approvals','Blocked: no confirmed merchant approval or real tracking links'],['Product truth','Partially complete: two canonical multimerchant examples; verify current prices, bundles and availability'],['Asset licensing','Concept art is original; secure authorized product photos before public listing'],['Revenue attribution','Blocked: no paid transaction records, partner exports or approved API integrations'],['Google Search Console / analytics','Blocked: no production domain, keys, permissions or consent configuration'],['Administration','Blocked: demo has no server auth; implement private RBAC and tenant isolation'],['Legal / operations','Blocked: DBA, trademark, domain, operator contact details and policy review'],['SEO / production hosting','Partial: public working preview is hosted with noindex; production domain, canonical routes, sitemap, metadata and launch QA still needed'],['Payout / commission verification','Blocked: merchant contracts and reconciled bank-paid commissions']];$('checklist').innerHTML=rows.map(([k,v])=>`<div class="faq-item"><strong>${esc(k)}</strong><p style="margin:5px 0">${esc(v)}</p></div>`).join('')}
function route(){if($('navLinks'))$('navLinks').classList.remove('open');if($('menuToggle'))$('menuToggle').setAttribute('aria-expanded','false')}
// Event delegation keeps modal buttons functional without rerender listeners.
document.addEventListener('click',e=>{const choice=e.target.closest('[data-consent-choice]');if(choice){consent=choice.dataset.consentChoice;const label=$('consentStatus');if(label)label.textContent=consent==='allow'?'Enabled':'Off';if(consent==='deny'){events.length=0;$('localEventCount').textContent='0';$('localEventInfo').textContent='Local event counts disabled; no measured revenue.';}announce(consent==='allow'?'Local demo counts enabled in this tab.':'Local demo counts disabled.');return}const detail=e.target.closest('[data-detail]');if(detail){productDetail(detail.dataset.detail);return}const saved=e.target.closest('[data-shortlist]');if(saved){toggleShortlist(saved.dataset.shortlist);return}const collection=e.target.closest('[data-collection]');if(collection){const t=collection.dataset.collection;collectionScope=COLLECTION_SCOPES[t]?t:null;$('placementFilter').value=t==='outdoor'||t==='modern'?'Outdoor':'all';$('heatFilter').value='all';renderProducts()}const gd=e.target.closest('[data-guide]');if(gd)guide(gd.dataset.guide);if(e.target.closest('[data-external]'))interaction('merchant_informational_exit',{destination:e.target.closest('[data-external]').href})});
$('modalClose').onclick=closeModal;$('modal').onclick=e=>{if(e.target===$('modal'))closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();else trapFocus(e)});
['searchInput','placementFilter','heatFilter','priceFilter'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',()=>{if(id!=='searchInput')collectionScope=null;renderProducts()}));$('shortlistTop').onclick=compareShortlist;$('menuToggle').onclick=()=>{const expanded=$('navLinks').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(expanded))};document.querySelectorAll('nav a').forEach(a=>a.onclick=route);
$('sweatyFeature').onclick=()=>productDetail('sweaty-yeti-editorial');$('privacyBtn').onclick=modalPolicy;$('footerPrivacy').onclick=e=>{e.preventDefault();modalPolicy()};$('correctionBtn').onclick=correction;$('modal').addEventListener('click',e=>{if(e.target.id==='downloadCorrection'){const txt=$('correctionText').value.trim();if(!txt)return announce('Write the correction before saving.');download('the-sauna-edit-correction.txt',txt);announce('Correction note saved locally.')}});
['costShell','costHeater','costFreight','costElectric','costSite','costLabor','costPermits','costExtra'].forEach(id=>$(id).addEventListener('input',costTotal));$('costDownload').onclick=saveCost;
$('opsOpen').onclick=showOperations;$('opsFooter').onclick=e=>{e.preventDefault();showOperations()};$('backToSite').onclick=showPublic;document.querySelectorAll('.ops-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.ops-tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.ops-panel').forEach(x=>x.classList.toggle('active',x.id===b.dataset.panel))});$('scenario').onchange=applyScenario;['fImpressions','fOrganic','fMerchant','fPaid','fCommission','fExpenses','fVisitCost','fTarget'].forEach(id=>$(id).addEventListener('input',renderForecast));['retailerC','retailerR','directC','directR'].forEach(id=>$(id).addEventListener('input',breakEven));$('partnerCSV').onclick=partnerCSV;$('commissionFile').onchange=e=>csvImport(e.target.files[0]);$('sampleCSV').onclick=()=>download('merchant-import-template.csv','referral_date,merchant_id,order_id,status,commission_amount,payment_date\n2026-10-01,topture,EXAMPLE-ORDER-001,pending,440,\n2026-10-02,sweaty-yeti,EXAMPLE-ORDER-002,paid,1500,2026-10-20\n','text/csv');$('clearEvents').onclick=()=>{events.length=0;$('localEventCount').textContent=0;announce('Local demo counts cleared')};
$('rejectConsent').onclick=()=>{consent='deny';$('consentBox').style.display='none'};$('acceptConsent').onclick=()=>{consent='allow';$('consentBox').style.display='none'};
$('consentBox').style.display='none';renderProducts();costTotal();partnerTable();readiness();renderForecast();
const ritualVideo=document.querySelector('#ritualVideo');
if(ritualVideo){const filmPlay=document.querySelector('#filmPlay'),filmStatus=document.querySelector('#filmStatus');filmPlay.addEventListener('click',async()=>{if(!ritualVideo.querySelector('source[src]')){ritualVideo.querySelectorAll('source[data-src]').forEach(source=>{source.src=source.dataset.src;});ritualVideo.load();}ritualVideo.controls=true;try{await ritualVideo.play();}catch{filmStatus.textContent='Playback unavailable. The still imagery remains available.';}});ritualVideo.addEventListener('play',()=>{filmPlay.textContent='Play / resume the film ↗';filmStatus.textContent='Playing · pause using the video controls';});ritualVideo.addEventListener('pause',()=>{filmStatus.textContent='Paused · resume using the video controls';});ritualVideo.addEventListener('ended',()=>{filmStatus.textContent='Film complete · play again whenever you wish';});document.addEventListener('visibilitychange',()=>{if(document.hidden)ritualVideo.pause();});}

// Phone swipe cue: arrows and dots under the swipe row so it is obvious the cards scroll sideways. Hidden on desktop by CSS.
(function(){if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;var SEL='.collections';
function enhance(row){if(row.dataset.swipeCue)return;var items=[].slice.call(row.children);if(items.length<2)return;row.dataset.swipeCue='1';
 var bar=document.createElement('div');bar.className='swipe-cue';
 bar.innerHTML='<button type="button" class="swipe-prev" aria-label="Previous">\u2039</button><span class="swipe-dots" aria-hidden="true">'+items.map(function(){return '<i></i>'}).join('')+'</span><button type="button" class="swipe-next" aria-label="Next">\u203a</button>';
 row.parentNode.insertBefore(bar,row.nextSibling);var dots=[].slice.call(bar.querySelectorAll('i')),prev=bar.querySelector('.swipe-prev'),next=bar.querySelector('.swipe-next');
 var pos=function(i){return items[i].offsetLeft-items[0].offsetLeft};
 var idx=function(){var best=0,min=Infinity;items.forEach(function(it,i){var d=Math.abs(pos(i)-row.scrollLeft);if(d<min){min=d;best=i}});return best};
 var sync=function(){var i=idx();dots.forEach(function(d,j){d.className=j===i?'on':''});prev.disabled=i===0;next.disabled=i===items.length-1||row.scrollLeft+row.clientWidth>=row.scrollWidth-2};
 var go=function(d){var i=Math.max(0,Math.min(items.length-1,idx()+d));row.scrollTo({left:pos(i),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 prev.addEventListener('click',function(){go(-1)});next.addEventListener('click',function(){go(1)});
 row.addEventListener('scroll',function(){requestAnimationFrame(sync)},{passive:true});window.addEventListener('resize',sync);sync()}
function scan(){[].forEach.call(document.querySelectorAll(SEL),enhance)}
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()})();

MFS_READY({productDetail});
})();
