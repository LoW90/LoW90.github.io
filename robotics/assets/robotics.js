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

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-robotics","container":"#productGrid","card":":scope > .product-card","idSelector":"[data-id]","idAttribute":"data-id","facetSelector":".product-brand","sortSelector":"#sortFilter","curatedValues":["featured"],"experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-01","end":"2027-04-30"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
(()=>{'use strict';
/* Shopify theme port of site/src/app.js. Research specs come from the theme's research snapshot (window.MFR_RESEARCH);
   which products exist, their titles, vendors and photos come from the Shopify store (window.MFR_STORE).
   With no Shopify products yet the full research collection shows, so the theme works before the CSV import. */
const httpsUrl=u=>typeof u==='string'&&/^https:\/\//i.test(u.trim())?u.trim():'';
const R=window.MFR_RESEARCH||{site_id:'many-faces-robotics',brands:[],products:[],guides:[]};
const STORE=Array.isArray(window.MFR_STORE)?window.MFR_STORE:[];
const SITE_ID=R.site_id;const GUIDES=R.guides;
function fromStore(s){const research=R.products.find(p=>p.id===s.handle);const spec=s.spec&&typeof s.spec==='object'&&!Array.isArray(s.spec)?s.spec:{};const tagged=pre=>(s.tags||[]).filter(t=>t.startsWith(pre)).map(t=>t.slice(pre.length));
 const base=research||{brand:s.vendor,model:s.title,cat:s.type||'Home',tasks:tagged('task:'),tier:tagged('tier:')[0]||'Complementary',tag:s.type||'',price:null,features:[],limits:['Specifications have not been researched yet'],source:'',sourceLabel:'manufacturer page',verified:'not yet reviewed'};
 const p={...base,...spec,id:s.handle,brand:s.vendor||base.brand,model:s.title||base.model,url:s.url||null,image:s.image||null,imageAlt:s.image_alt||''};
 p.source=httpsUrl(s.manufacturer_url)||httpsUrl(p.source);p.features=Array.isArray(p.features)?p.features:[];p.limits=Array.isArray(p.limits)?p.limits:[];p.tasks=Array.isArray(p.tasks)?p.tasks:[];return p}
const order=p=>{const i=R.products.findIndex(x=>x.id===p.id);return i<0?R.products.length:i};
const PRODUCTS=STORE.length?STORE.map(fromStore).sort((a,b)=>order(a)-order(b)):R.products.map(p=>({...p,source:httpsUrl(p.source)}));
const BRANDS=[...new Set([...R.brands,...PRODUCTS.map(p=>p.brand)])].filter(Boolean);
const COLLECTION=Array.isArray(window.MFR_COLLECTION_FILTER)?window.MFR_COLLECTION_FILTER:null;
const $=(s,root=document)=>root.querySelector(s);const $$=(s,root=document)=>[...root.querySelectorAll(s)];
/* Sections are optional on Shopify (a product page has no finder or calculator), so bind only what exists. */
const on=(s,ev,fn)=>{const el=$(s);if(el)el.addEventListener(ev,fn)};const setVal=(s,v)=>{const el=$(s);if(el)el.value=v};
const safe=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>Number(v).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem('mf-robo-'+k));return v??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem('mf-robo-'+k,JSON.stringify(v))}catch{}};
/* Stored lists come from an older catalog or a hand-edited browser: keep only known product IDs, once each. */
const readIds=(k,max=Infinity)=>{const v=read(k,[]);return Array.isArray(v)?[...new Set(v.filter(id=>typeof id==='string'&&PRODUCTS.some(p=>p.id===id)))].slice(0,max):[]};
const consented=()=>read('analytics-consent',false)===true;
const reducedMotion=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Setting location.hash does nothing when the hash is already #shop, so scroll explicitly. Off the home page, go there. */
function goTo(id,then){const el=document.getElementById(id);if(!el){location.href=(window.MFR_ROOT||'/')+'#'+id;return}el.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);if(then)setTimeout(then,reducedMotion()?0:350)}
let saved=readIds('saved');let compare=readIds('compare',3);let showAll=false;
/* Your Private Shortlist (mf-shortlist.js, D-026 in mfo-mLintelligence): the shared Keep panel reads and restores the shortlist here. */
window.MF_SHORTLIST={snapshot:()=>saved.length?{saved:[...saved]}:null,restore:data=>{const ids=Array.isArray(data?.saved)?data.saved.filter(id=>typeof id==='string'&&PRODUCTS.some(p=>p.id===id)):[];if(!ids.length)return;saved=[...new Set([...saved,...ids])];save('saved',saved);renderSaved();renderCatalog();renderProductPage();toast('Your shortlist is back on this device')},open:()=>openDrawer(),ids:()=>[...saved]};
const state={category:'all',brand:'all',tier:'all',search:'',sort:'featured'};
let finder={step:0,task:'',acre:0.3,slope:20,poolSqft:1200,snowSqft:3500,poolType:'inground',budget:'all',floor:'mixed',pets:'yes',rooms:'multi',window:'standard',commercial:'hotel',priority:'easy'};
let toastTimer;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
/* Control Center event shape v1, published as a Shopify custom event (mfr_<type>) that a Shopify customer-events pixel can forward.
   Sent only when the visitor opted in here and Shopify's own consent (where the store enables it) allows analytics. */
function logEvent(name,extra={}){if(!consented())return;const cp=window.Shopify&&window.Shopify.customerPrivacy;try{if(cp&&typeof cp.analyticsProcessingAllowed==='function'&&!cp.analyticsProcessingAllowed())return}catch{}const id=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);const record={schema_version:'1',event_id:id,site_id:SITE_ID,event_type:name,occurred_at:new Date().toISOString(),...extra,channel:'shopify_theme',consent:true};try{if(window.Shopify&&window.Shopify.analytics&&typeof window.Shopify.analytics.publish==='function')window.Shopify.analytics.publish('mfr_'+name,record)}catch{}}
const taskLabels={lawn:'Lawn care',snow:'Snow removal',pool:'Pool cleaning',floor:'Floor cleaning',window:'Window cleaning',smart:'Smart-home robotics',business:'Business applications'};
const symbols={lawn:'♧',snow:'❄',pool:'≋',floor:'⌂',window:'▤',smart:'✧',business:'▦'};
/* A Shopify product photo replaces the conceptual art; without one the original illustration stays, labelled as such. */
const media=p=>p.image?`<img src="${safe(p.image)}" alt="${safe(p.imageAlt||p.brand+' '+p.model)}" loading="lazy" width="640" height="480">`:`<span class="concept-tag">ILLUSTRATIVE VISUAL</span>${art(p)}`;
const art=(p)=>{const main=p.cat==='Outdoor'?'#263d37':p.cat==='Pool'?'#214f57':p.cat==='Home'?'#3b4646':'#5d6158';const accent=p.cat==='Outdoor'?'#b9a77d':p.cat==='Pool'?'#78d2db':p.cat==='Home'?'#c9c2ba':'#b4c2a9';let robot;
if(p.cat==='Outdoor')robot=`<g transform="translate(5 13)"><ellipse cx="150" cy="187" rx="100" ry="13" fill="#132c2857"/><rect x="40" y="108" width="218" height="59" rx="30" fill="${main}" stroke="#1a2923" stroke-width="4"/><path d="M50 118 L78 91 L222 93 L254 122 Z" fill="${accent}"/><path d="M102 88 L113 65 L198 65 L213 90 Z" fill="#152723"/><rect x="132" y="54" width="45" height="16" rx="6" fill="${main}"/><circle cx="86" cy="162" r="28" fill="#111c1b" stroke="#74837e" stroke-width="9"/><circle cx="210" cy="162" r="28" fill="#111c1b" stroke="#74837e" stroke-width="9"/><rect x="70" y="119" width="154" height="6" rx="3" fill="#e7e1cb" opacity=".65"/><circle cx="162" cy="101" r="6" fill="#2e423b"/></g>`;
else if(p.cat==='Pool')robot=`<g transform="translate(10 8)"><ellipse cx="150" cy="205" rx="92" ry="13" fill="#10455255"/><path d="M64 113 Q75 73 137 68 L194 73 Q240 83 245 127 L236 159 Q150 185 69 157 Z" fill="${main}" stroke="#173f46" stroke-width="5"/><path d="M80 104 Q158 72 223 106 L215 138 Q153 154 85 135Z" fill="#d1e1df"/><rect x="128" y="85" width="50" height="12" rx="4" fill="#16363b"/><rect x="65" y="129" width="28" height="40" rx="7" fill="#14272d"/><rect x="217" y="129" width="28" height="40" rx="7" fill="#14272d"/><path d="M100 150 Q156 163 210 150" fill="none" stroke="${accent}" stroke-width="5"/></g>`;
else if(p.cat==='Home')robot=`<g transform="translate(15 5)"><ellipse cx="145" cy="199" rx="102" ry="14" fill="#41392b40"/><ellipse cx="150" cy="138" rx="111" ry="77" fill="${main}" stroke="#252d2b" stroke-width="7"/><ellipse cx="150" cy="128" rx="88" ry="56" fill="#6e7b76" opacity=".55"/><circle cx="150" cy="95" r="27" fill="#273632" stroke="${accent}" stroke-width="9"/><rect x="84" y="167" width="125" height="9" rx="5" fill="#e5e4d6" opacity=".65"/></g>`;
else robot=`<g transform="translate(40 20)"><circle cx="112" cy="102" r="72" fill="${main}" stroke="${accent}" stroke-width="12"/><circle cx="112" cy="102" r="35" fill="#a1b3a6"/><path d="M105 27 L119 27 M105 177 L119 177 M35 100 L50 100 M175 100 L192 100" stroke="#a8b8a8" stroke-width="12" stroke-linecap="round"/></g>`;
return `<svg class="robot-svg" viewBox="0 0 310 245" role="img" aria-label="Conceptual robot illustration, not an image of the ${safe(p.model)}">${robot}</svg>`;};
function init(){const rail=$('#brandRail'),brandSelect=$('#brandFilter');BRANDS.forEach(b=>{if(rail){const btn=document.createElement('button');btn.textContent=b;btn.dataset.brand=b;btn.title='View research on '+b;rail.append(btn)}if(brandSelect)brandSelect.insertAdjacentHTML('beforeend',`<option value="${safe(b)}">${safe(b)}</option>`)});
const showFiltered=patch=>{Object.assign(state,{category:'all',brand:'all'},patch);setVal('#catFilter',state.category);setVal('#brandFilter',state.brand);showAll=true;renderCatalog();goTo('shop')};
on('#brandRail','click',e=>{const btn=e.target.closest('[data-brand]');if(btn)showFiltered({brand:btn.dataset.brand})});
$$('[data-cat]').forEach(btn=>btn.addEventListener('click',()=>showFiltered({category:btn.dataset.cat})));
['catalogSearch','catFilter','brandFilter','tierFilter','sortFilter'].forEach(id=>on('#'+id,id==='catalogSearch'?'input':'change',e=>{const field={catalogSearch:'search',catFilter:'category',brandFilter:'brand',tierFilter:'tier',sortFilter:'sort'}[id];state[field]=e.target.value;showAll=false;renderCatalog()}));
on('#showMore','click',()=>{showAll=true;renderCatalog()});on('#searchJump','click',()=>goTo('shop',()=>{const s=$('#catalogSearch');if(s)s.focus({preventScroll:true})}));
on('#mobileToggle','click',()=>{const m=$('#mobileMenu');m.hidden=!m.hidden;$('#mobileToggle').setAttribute('aria-expanded',String(!m.hidden));$('#mobileToggle').setAttribute('aria-label',m.hidden?'Open menu':'Close menu')});$$('#mobileMenu a').forEach(a=>a.addEventListener('click',closeMobileMenu));
on('#goPool','click',()=>showFiltered({category:'Pool'}));
on('#productGrid','click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const id=b.dataset.id;if(b.dataset.action==='details')openProduct(id);if(b.dataset.action==='save')toggleSaved(id);if(b.dataset.action==='compare')toggleCompare(id)});
on('#savedOpen','click',openDrawer);on('#drawerOverlay','click',closeDrawer);on('#drawerClose','click',closeDrawer);on('#shortlistClear','click',()=>{saved=[];save('saved',saved);renderSaved();renderCatalog();renderProductPage();toast('Shortlist cleared')});on('#shortlistExport','click',exportShortlist);
on('#finderNext','click',nextFinder);on('#finderBack','click',()=>{finder.step=Math.max(finder.step-1,0);renderFinder()});on('#finderBody','click',e=>{const b=e.target.closest('[data-task]');if(b){finder.task=b.dataset.task;finder.step=1;renderFinder();logEvent('advisor_task_selected',{task:finder.task})}const d=e.target.closest('[data-product]');if(d)openProduct(d.dataset.product)});
/* A blank number field is unknown (NaN), never zero: a blank slope used to screen as a 0% grade. */
on('#finderBody','input',e=>{const key=e.target.dataset.field;if(key){let v=e.target.value;if(['acre','slope','poolSqft','snowSqft'].includes(key))v=v.trim()===''?NaN:Number(v);finder[key]=v;e.target.removeAttribute('aria-invalid')}});
on('#finderBody','change',e=>{const key=e.target.dataset.field;if(key&&e.target.tagName==='SELECT')finder[key]=e.target.value});
on('#costForm','input',updateCost);on('#costForm','change',updateCost);on('#costForm','submit',e=>e.preventDefault());on('#costDownload','click',exportCost);
on('#guideGrid','click',e=>{const b=e.target.closest('[data-guide]');if(b)openGuide(b.dataset.guide)});
on('#dialogClose','click',()=>$('#infoDialog').close());on('#infoDialog','click',e=>{if(e.target===$('#infoDialog'))$('#infoDialog').close()});
on('#dialogBody','click',e=>{const b=e.target.closest('[data-modal-action]');if(!b)return;const id=b.dataset.id;if(b.dataset.modalAction==='saved'){toggleSaved(id);b.textContent=saved.includes(id)?'Saved ✓':'Save to shortlist ♡'}if(b.dataset.modalAction==='compare'){toggleCompare(id);b.textContent=compare.includes(id)?'Added to compare ✓':'Add to compare ⇄'}if(b.dataset.modalAction==='consent'){save('analytics-consent',b.dataset.consent==='yes');toast('Analytics preference saved');b.closest('.site-dialog').close()}});
$$('[data-dialog]').forEach(b=>b.addEventListener('click',()=>openUtility(b.dataset.dialog)));on('#disclosureButton','click',()=>openUtility('privacy'));
on('#productPage','click',e=>{const b=e.target.closest('[data-page-action]');if(b){const id=b.dataset.id;if(b.dataset.pageAction==='save')toggleSaved(id);if(b.dataset.pageAction==='compare')toggleCompare(id)}const o=e.target.closest('[data-official]');if(o){const p=PRODUCTS.find(x=>x.id===o.dataset.official);logEvent('manufacturer_research_outbound',{product_id:o.dataset.official,merchant_id:p?p.brand:null,offer_status:'not_affiliate'})}});
renderCatalog();renderFinder();renderSaved();renderCompare();renderGuides();updateCost();renderProductPage();
const page=$('#productPage');if(page)logEvent('product_detail_view',{product_id:page.dataset.handle});
/* Shopify reloads the page after a contact post: reopen the inquiry so the visitor sees the confirmation or the error. */
const lead=$('#leadFormTemplate');if(lead&&lead.content.querySelector('[data-lead-state]'))openUtility('business');else if(new URLSearchParams(location.search).get('contact_posted')==='true')toast('Inquiry sent to Many Faces Robotics');
}
function filtered(){let list=PRODUCTS.filter(p=>(!COLLECTION||COLLECTION.includes(p.id))&&(state.category==='all'||p.cat===state.category)&&(state.brand==='all'||p.brand===state.brand)&&(state.tier==='all'||p.tier===state.tier)&&(!state.search||(p.brand+' '+p.model+' '+p.cat+' '+p.features.join(' ')+' '+p.tasks.join(' ')).toLowerCase().includes(state.search.toLowerCase())));if(state.sort==='name')list.sort((a,b)=>a.model.localeCompare(b.model));if(state.sort==='low'||state.sort==='high')list.sort((a,b)=>{const an=a.price==null,bn=b.price==null;if(an||bn)return an===bn?0:an?1:-1;return state.sort==='low'?a.price-b.price:b.price-a.price});return list}
function renderCatalog(){if(!$('#productGrid'))return;const all=filtered();const arr=showAll?all:all.slice(0,8);$('#resultCount').textContent=all.length+' independently sourced product records';$('#moreArea').hidden=all.length<=8||showAll;$('#productGrid').innerHTML=arr.length?arr.map(p=>`<article class="product-card"><div class="product-media ${p.cat==='Pool'?'pool':p.cat==='Home'?'home':p.cat==='Smart Home'?'smart':''}">${media(p)}</div><div class="product-card-body"><div class="product-brand">${safe(p.brand)} · ${safe(p.cat)}</div><h3>${safe(p.model)}</h3><div class="product-tagline">${safe(p.tag)}</div><div class="product-facts">${safe(p.features[0])}</div><span class="product-info-status">Research snapshot · pricing to reconfirm</span></div><div class="product-actions"><button data-action="details" data-id="${safe(p.id)}" aria-label="View ${safe(p.model)} details">Explore ↗</button><button class="${compare.includes(p.id)?'is-on':''}" data-action="compare" data-id="${safe(p.id)}" aria-label="Compare ${safe(p.model)}">⇄</button><button class="${saved.includes(p.id)?'is-on':''}" data-action="save" data-id="${safe(p.id)}" aria-label="Save ${safe(p.model)}">${saved.includes(p.id)?'♥':'♡'}</button></div></article>`).join(''):`<div class="no-results"><h3>No robots found for this search.</h3><p>Try a different manufacturer, model, task, or category.</p><button class="btn btn-outline-dark" id="clearCatalog">Clear filters</button></div>`;const c=$('#clearCatalog');if(c)c.addEventListener('click',()=>{Object.assign(state,{category:'all',brand:'all',tier:'all',search:'',sort:'featured'});$('#catalogSearch').value='';['catFilter','brandFilter','tierFilter'].forEach(id=>$('#'+id).value='all');$('#sortFilter').value='featured';renderCatalog()})}
function toggleSaved(id){saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];save('saved',saved);renderSaved();renderCatalog();renderProductPage();toast(saved.includes(id)?'Added to your shortlist':'Removed from your shortlist');logEvent('save_product',{product_id:id})}
function toggleCompare(id){if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length>=3){toast('Compare up to three robots at once');return}else compare.push(id);save('compare',compare);renderCompare();renderCatalog();renderProductPage();toast(compare.includes(id)?'Added to comparison':'Removed from comparison');logEvent('compare_product',{product_id:id})}
function renderSaved(){if(!$('#savedCount')||!$('#savedItems'))return;$('#savedCount').textContent=saved.length;$('#drawerCount').textContent=saved.length;$('#savedItems').innerHTML=saved.length?saved.map(id=>{const p=PRODUCTS.find(x=>x.id===id);return `<div class="saved-row"><b>${safe(p.brand)} ${safe(p.model)}</b><small>${safe(p.cat)} · ${safe(p.tag)}</small><button data-remove="${safe(id)}">Remove</button></div>`}).join(''):'<p class="question-sub">Nothing saved yet. Use ♡ on any product to build a personal shortlist.</p>';$$('[data-remove]',$('#savedItems')).forEach(b=>b.addEventListener('click',()=>toggleSaved(b.dataset.remove)));$('#shortlistExport').disabled=!saved.length;$('#shortlistClear').disabled=!saved.length}
/* The drawer is modal: the rest of the page is inert while it is open, and focus returns to the opener. */
let drawerOpener=null;const pageRegions=()=>['.announcement','.site-header','#main','footer'].map(s=>$(s)).filter(Boolean);
function openDrawer(){drawerOpener=document.activeElement;$('#savedDrawer').hidden=false;$('#drawerOverlay').hidden=false;document.body.classList.add('no-scroll');pageRegions().forEach(el=>el.inert=true);$('#drawerClose').focus()}
function closeDrawer(){$('#savedDrawer').hidden=true;$('#drawerOverlay').hidden=true;document.body.classList.remove('no-scroll');pageRegions().forEach(el=>el.inert=false);if(drawerOpener&&drawerOpener.focus)drawerOpener.focus()}
function closeMobileMenu(){$('#mobileMenu').hidden=true;$('#mobileToggle').setAttribute('aria-expanded','false');$('#mobileToggle').setAttribute('aria-label','Open menu')}
function download(text,filename,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function exportShortlist(){if(!saved.length)return;const text='MANY FACES ROBOTICS · PRIVATE RESEARCH SHORTLIST\nNot affiliate offers · Prices/compatibility must be reconfirmed.\n\n'+saved.map(id=>{const p=PRODUCTS.find(x=>x.id===id);return `${p.brand} ${p.model}\n${p.features.join('; ')}\nSource: ${p.source}\n`}).join('\n');download(text,'robotics-shortlist.txt');logEvent('export_shortlist',{count:saved.length})}
function renderCompare(){if(!$('#compareTable'))return;const arr=compare.map(id=>PRODUCTS.find(x=>x.id===id));$('#compareEmpty').hidden=arr.length>0;$('#compareTable').hidden=!arr.length;if(!arr.length)return;const rows=[['Manufacturer',p=>p.brand],['Category',p=>p.cat],['Research price',p=>p.price===null?'Not verified':money(p.price)+' · snapshot'],['Published lawn coverage',p=>p.acre==null?'Not verified':p.acre+' acre(s)'],['Published max slope',p=>p.slope==null?'Not verified':p.slope+'% grade'],['Published pool coverage',p=>p.poolSqft==null?'Not verified':p.poolSqft.toLocaleString()+' ft²'],['Primary research findings',p=>p.features.join(' · ')],['Verification gaps',p=>p.limits.join(' · ')],['Source',p=>p.source?`<a class="mf-buy" href="${safe(p.source)}" target="_blank" rel="noopener noreferrer">Check price at ${safe(p.brand)} ↗</a>`:'Manufacturer link not added yet']];
$('#compareTable').innerHTML=`<table><thead><tr><th>SPECIFICATION</th>${arr.map(p=>`<td><strong>${safe(p.brand)} ${safe(p.model)}</strong><small>${safe(p.tag)}</small><button class="under-link" data-uncompare="${safe(p.id)}">Remove ×</button></td>`).join('')}</tr></thead><tbody>${rows.map(([k,fn])=>`<tr><th>${safe(k)}</th>${arr.map(p=>`<td>${k==='Source'?fn(p):safe(fn(p))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;$$('[data-uncompare]',$('#compareTable')).forEach(b=>b.addEventListener('click',()=>toggleCompare(b.dataset.uncompare)))}
/* Shopify product page: Liquid renders the record; this adds the research price, date, art and button states. */
function renderProductPage(){const page=$('#productPage');if(!page)return;const p=PRODUCTS.find(x=>x.id===page.dataset.handle);const id=page.dataset.handle;
const price=$('#productResearchPrice',page);if(price)price.textContent=p&&p.price!=null?money(p.price)+' research snapshot, not a live quote or verified current price':'Pricing not verified for this record';
const reviewed=$('#productVerified',page);if(reviewed&&p&&p.verified)reviewed.textContent='Last source review '+p.verified;
const artSlot=$('#productArt',page);if(artSlot&&p&&!artSlot.dataset.done){artSlot.innerHTML=`<span class="concept-tag">ILLUSTRATIVE VISUAL</span>${art(p)}`;artSlot.dataset.done='1'}
$$('[data-page-action]',page).forEach(b=>{const isSave=b.dataset.pageAction==='save';const active=isSave?saved.includes(id):compare.includes(id);b.textContent=isSave?(active?'Saved ✓':'Save to shortlist ♡'):(active?'Added to compare ✓':'Add to compare ⇄')})}
function openDialog(html){$('#dialogBody').innerHTML=html;const d=$('#infoDialog');d.showModal();$('#dialogClose').focus()}
function openProduct(id){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;logEvent('product_detail_view',{product_id:id});openDialog(`<div class="eyebrow">SOURCE-LINKED MODEL RESEARCH</div><div class="modal-top"><div class="modal-visual"><span>${p.cat==='Outdoor'?'♧':p.cat==='Pool'?'≋':p.cat==='Home'?'⌂':'✧'}</span></div><div><div class="product-brand">${safe(p.brand)} · ${safe(p.cat)}</div><h2 style="font-size:34px;margin:8px 0">${safe(p.model)}</h2><p class="question-sub">${safe(p.tag)} · ${safe(p.tier)}</p></div></div><div class="status-line">Independent research record · Not an approved affiliate offer · Last source review ${safe(p.verified)}</div><h3>What the manufacturer describes</h3><ul>${p.features.map(x=>`<li>${safe(x)}</li>`).join('')}</ul><h3>What to verify before buying</h3><ul>${p.limits.map(x=>`<li>${safe(x)}</li>`).join('')}</ul><p><strong>Research price snapshot:</strong> ${p.price!==null?money(p.price)+' — not a live quote or verified current price':'Pricing not verified for this record'}</p>${p.source?`<a class="btn btn-gold source-cta mf-buy" href="${safe(p.source)}" target="_blank" rel="noopener noreferrer" data-official="${safe(p.id)}">Check price at ${safe(p.brand)} ↗</a><small class="source-label">${safe(p.sourceLabel)} · purchases happen on the manufacturer's site</small>`:'<p class="status-line">Manufacturer link not added yet</p>'}${p.url?`<p><a class="under-link" href="${safe(p.url)}">Full product page <span>↗</span></a></p>`:''}<div class="dialog-actions"><button class="btn btn-dark" data-modal-action="saved" data-id="${safe(id)}">${saved.includes(id)?'Saved ✓':'Save to shortlist ♡'}</button><button class="btn btn-outline-dark" data-modal-action="compare" data-id="${safe(id)}">${compare.includes(id)?'Added to compare ✓':'Add to compare ⇄'}</button></div>`);const link=$('[data-official]',$('#dialogBody'));if(link)link.addEventListener('click',()=>logEvent('manufacturer_research_outbound',{product_id:id,merchant_id:p.brand,offer_status:'not_affiliate'}))}
function renderGuides(){if(!$('#guideGrid'))return;$('#guideGrid').innerHTML=GUIDES.map(g=>`<article class="guide-card"><div class="eyebrow">${safe(g.cat)}</div><h3>${safe(g.title)}</h3><p>${safe(g.desc)}</p><button data-guide="${safe(g.id)}" class="under-link">Read research note <span>↗</span></button></article>`).join('')}
const guideCopy={
lawns:`<h3>Work area is not the same as slope capability.</h3><p>Compare recommended mowing area, maximum grade, number of mowing zones, navigation sensors and the reliability of positioning under trees. A robot may advertise a high maximum slope yet have a smaller recommended weekly work area. Consult the exact model's product manual before purchasing.</p><h3>Technical preflight</h3><p>Document the steepest section of the property, width of narrow paths, canopy density, docking power, and whether connected services require subscriptions. Our Find My Robot engine excludes products when a verified area or grade constraint is exceeded and marks unknown specifications as uncertain.</p>`,
snow:`<h3>Bundles matter.</h3><p>A modular yard robot can swap mowing, blowing and snow modules, but a different core and module configuration can materially change price and performance. Confirm that the chosen bundle actually includes the snow module.</p><h3>Understand conditions.</h3><p>Snow removal capacity is often specified for standard snowfall and per-charge clearing area. Accumulation depth, ice, steepness, obstructions and safe operating boundaries should be validated. Avoid extrapolating one manufacturer's marketing claim to all snow conditions.</p>`,
pools:`<h3>Compare equivalent measures.</h3><p>Pool area may mean maximum supported total area, area cleaned in one cycle, or the footprint of a specific cleaning mode. These measures should not be interchanged.</p><h3>Check the overlooked details.</h3><p>Verify floor, wall, waterline and surface cleaning separately. Confirm pool size, depth, material, slope, steps, filtration fineness, charging style, weight, warranty and compatible replacement parts.</p>`,
economics:`<h3>Use a time horizon.</h3><p>Model equipment, installation, electricity, consumables, replacement parts, connectivity, maintenance and potential future repairs. Compare using a common period such as five years. Do not confuse a theoretical time-saving benefit with a guaranteed cash return.</p><h3>Validate any savings claim.</h3><p>Where the robot replaces paid labor, quantify actual displaced tasks and costs. Where it replaces the owner's personal time, treat the benefit as a preference rather than automatic cash income. The worksheet below is deliberately based on your own inputs.</p>`
};
function openGuide(id){const g=GUIDES.find(x=>x.id===id);if(!g)return;logEvent('guide_open',{guide_id:id});openDialog(`<div class="eyebrow">${safe(g.cat)} · RESEARCH NOTE</div><h2>${safe(g.title)}</h2><p>${safe(g.desc)}</p><div class="guide-body">${guideCopy[id]}</div><p class="status-line">Editorial research only · Follow source links on product records for model-specific specifications · Oct 22, 2026</p>`)}
/* One calculation feeds both the display and the CSV, in whole cents. Blank, negative, non-finite or
   implausibly large inputs are flagged instead of silently becoming $0. */
const COST_FIELDS=[['costEquipment','Equipment',false],['costInstall','Installation',false],['costPower','Energy per year',true],['costCare','Parts & maintenance per year',true],['costSubs','Subscriptions per year',true]];
const COST_MAX=10000000;
function costModel(){const invalid=[];const cents={};for(const [id,,]of COST_FIELDS){const raw=$('#'+id).value.trim();const v=Number(raw);if(raw===''||!Number.isFinite(v)||v<0||v>COST_MAX){invalid.push(id);cents[id]=null}else cents[id]=Math.round(v*100)}const years=Number($('#costYears').value);if(![3,5,7,10].includes(years))invalid.push('costYears');if(invalid.length)return {invalid,years,cents,total:null,monthly:null};const initial=cents.costEquipment+cents.costInstall;const yearly=cents.costPower+cents.costCare+cents.costSubs;const total=initial+years*yearly;return {invalid,years,cents,total,monthly:Math.round(total/(years*12))}}
const dollars=c=>(c/100).toFixed(2);
function updateCost(){if(!$('#costForm'))return;const m=costModel();COST_FIELDS.forEach(([id])=>$('#'+id).toggleAttribute('aria-invalid',m.invalid.includes(id)));$('#costError').hidden=!m.invalid.length;$('#costDownload').disabled=!!m.invalid.length;$('#costTotal').textContent=m.total==null?'—':money(m.total/100);$('#costMonthly').textContent=m.monthly==null?'—':money(m.monthly/100)}
function exportCost(){const m=costModel();if(m.invalid.length){updateCost();return}const csv='Field,USD\n'+COST_FIELDS.map(([id,label])=>`${label},${dollars(m.cents[id])}`).join('\n')+`\nYears owned,${m.years}\nEstimated total,${dollars(m.total)}\nEquivalent monthly,${dollars(m.monthly)}\nNote,"Illustrative worksheet from your own inputs; before tax, financing, inflation and repairs."\n`;download(csv,'robotics-ownership-estimate.csv','text/csv');logEvent('export_ownership_model',{})}
function renderFinder(){if(!$('#finderBody'))return;const s=finder.step;$('#finderStep').textContent=`STEP ${s+1} OF 3`;$('#progressFill').style.width=((s+1)/3*100)+'%';$('#finderBack').hidden=s===0;$('#finderNext').textContent=s===1?'See my matches →':s===2?'Start a new search ↺':'Continue →';$('#finderNext').hidden=false;
if(s===0){$('#finderBody').innerHTML=`<h3>What would you like to automate?</h3><p class="question-sub">Choose one task. We'll ask only the questions relevant to it.</p><div class="task-grid">${Object.entries(taskLabels).map(([key,label])=>`<button type="button" data-task="${key}" class="task-option ${finder.task===key?'active':''}"><span class="task-symbol">${symbols[key]}</span><span>${label}</span></button>`).join('')}</div><div class="finder-hint">No registration needed · You can change your answers at any time.</div>`;return}
if(s===1){let fields='',note='Published product ratings are not guarantees for every site.';
if(finder.task==='lawn')fields=`<label>Approximate total mowing area (acres)<input data-field="acre" type="number" min="0.01" max="1000" step="0.05" value="${num(finder.acre)}"></label><label>Steepest grade (%)<input data-field="slope" type="number" min="0" max="100" step="5" value="${num(finder.slope)}"></label><label>Preferred budget<select data-field="budget">${budgetOptions()}</select></label><label>Primary concern<select data-field="priority"><option value="easy" ${finder.priority==='easy'?'selected':''}>Easy installation</option><option value="terrain" ${finder.priority==='terrain'?'selected':''}>Complex terrain</option><option value="large" ${finder.priority==='large'?'selected':''}>Large working area</option></select></label>`;
else if(finder.task==='snow')fields=`<label>Area to clear per charge (ft²)<input type="number" data-field="snowSqft" min="100" max="100000" step="100" value="${num(finder.snowSqft)}"></label><label>Preferred budget<select data-field="budget">${budgetOptions()}</select></label><label>Weather consideration<select data-field="priority"><option value="easy" ${sel('priority','easy')}>Typical snow conditions</option><option value="terrain" ${sel('priority','terrain')}>Mixed terrain/conditions</option></select></label>`;
else if(finder.task==='pool')fields=`<label>Pool floor area (ft²)<input type="number" data-field="poolSqft" min="50" max="100000" step="100" value="${num(finder.poolSqft)}"></label><label>Pool construction<select data-field="poolType"><option value="inground" ${finder.poolType==='inground'?'selected':''}>In-ground</option><option value="above" ${finder.poolType==='above'?'selected':''}>Above-ground</option></select></label><label>Budget<select data-field="budget">${budgetOptions()}</select></label><label>Most important task<select data-field="priority"><option value="floor" ${sel('priority','floor')}>Floor & walls</option><option value="surface" ${sel('priority','surface')}>Surface skimming</option><option value="all" ${sel('priority','all')}>All-in-one coverage</option></select></label>`;
else if(finder.task==='floor')fields=`<label>Flooring<select data-field="floor"><option value="mixed" ${sel('floor','mixed')}>Mixed surfaces</option><option value="hard" ${sel('floor','hard')}>Hard floors</option><option value="carpet" ${sel('floor','carpet')}>Mostly carpet</option></select></label><label>Pets at home<select data-field="pets"><option value="yes" ${sel('pets','yes')}>Yes</option><option value="no" ${sel('pets','no')}>No</option></select></label><label>Budget<select data-field="budget">${budgetOptions()}</select></label><label>Home layout<select data-field="rooms"><option value="multi" ${sel('rooms','multi')}>Multiple rooms</option><option value="open" ${sel('rooms','open')}>Mostly open plan</option></select></label>`;
else if(finder.task==='window')fields=`<label>Window type<select data-field="window"><option value="standard" ${sel('window','standard')}>Standard home windows</option><option value="tall" ${sel('window','tall')}>Tall or hard-to-reach glass</option><option value="commercial" ${sel('window','commercial')}>Commercial glazing</option></select></label><label>Budget<select data-field="budget">${budgetOptions()}</select></label>`;
else if(finder.task==='smart')fields=`<label>Your priority<select data-field="priority"><option value="easy" ${sel('priority','easy')}>Automate everyday routines</option><option value="terrain" ${sel('priority','terrain')}>Integrated smart devices</option></select></label><label>Budget<select data-field="budget">${budgetOptions()}</select></label>`;
else fields=`<label>Primary setting<select data-field="commercial"><option value="hotel" ${sel('commercial','hotel')}>Hotel or hospitality</option><option value="property" ${sel('commercial','property')}>Multifamily or property management</option><option value="office" ${sel('commercial','office')}>Office or retail facility</option><option value="grounds" ${sel('commercial','grounds')}>Commercial grounds</option></select></label><label>Primary requirement<select data-field="priority"><option value="easy" ${sel('priority','easy')}>Cleaning</option><option value="large" ${sel('priority','large')}>Property maintenance</option><option value="terrain" ${sel('priority','terrain')}>Robotics exploration</option></select></label>`;
$('#finderBody').innerHTML=`<h3>Tell us about your ${safe(finder.task==='lawn'?'property':finder.task==='pool'?'pool':finder.task==='snow'?'snow clearing needs':'needs')}.</h3><p class="question-sub">A few specifics help us flag products that exceed their published operating limits.</p><div class="question-fields">${fields}</div><div class="finder-hint">${safe(note)} Unknown technical specifications cannot be treated as confirmed compatibility.</div>`;return}
const matches=getMatches();const relevant=PRODUCTS.filter(p=>p.tasks.includes(finder.task));const cards=matches.filter(x=>!x.excluded).sort((a,b)=>b.score-a.score).slice(0,4);const excluded=matches.filter(x=>x.excluded);
$('#finderBody').innerHTML=`<h3>Your research shortlist</h3><p class="question-sub">${safe(taskLabels[finder.task])} · ${cards.length?'Published limits evaluated against your answers.':'No products can currently be treated as meeting your stated requirements.'}</p><div class="finder-results">${cards.map(x=>`<div class="match-card"><div class="match-tier ${x.uncertain?'warn':''}">${x.uncertain?'REQUIRES VERIFICATION':'PUBLISHED LIMITS MATCH'}</div><strong>${safe(x.p.brand)} ${safe(x.p.model)}</strong><small>${safe(x.reason)}</small><p>${safe(x.uncertain?'Other technical and site conditions remain unverified.':'Still verify terrain, installation, safety and actual availability with the manufacturer.')}</p><button class="under-link" data-product="${safe(x.p.id)}">View published details ↗</button></div>`).join('')||`<div class="match-card"><strong>No confirmed fit in the current research collection.</strong><p>Increase your budget or revise the size and slope requirements. Do not purchase solely on this screening.</p></div>`}${excluded.length?`<p class="finder-hint">${excluded.length} researched model(s) withheld because published limits were exceeded, price may be out of budget, or critical specifications are unknown.</p>`:''}${!relevant.length?`<p class="finder-hint">This category does not yet have sufficient verified product specifications for personalized matching. Research is continuing.</p>`:''}</div>`;logEvent('advisor_results',{task:finder.task,result_count:cards.length})}
const num=v=>Number.isFinite(v)?v:'';const sel=(k,v)=>finder[k]===v?'selected':'';
function budgetOptions(){return `<option value="all" ${finder.budget==='all'?'selected':''}>Flexible / research all</option><option value="1000" ${finder.budget==='1000'?'selected':''}>Up to $1,000</option><option value="2500" ${finder.budget==='2500'?'selected':''}>Up to $2,500</option><option value="5000" ${finder.budget==='5000'?'selected':''}>Up to $5,000</option><option value="10000" ${finder.budget==='10000'?'selected':''}>Up to $10,000</option>`}
/* Deterministic screening. Reasons accumulate so an exclusion is never overwritten by a later "fits" note.
   Unknown published facts make a product uncertain or excluded; they never count as a confirmed fit. */
function getMatches(){const task=finder.task;return PRODUCTS.filter(p=>p.tasks.includes(task)).map(p=>{let excluded=false,uncertain=false,score=100;const why=[],fits=[];const budget=finder.budget==='all'?Infinity:Number(finder.budget);const out=r=>{excluded=true;why.push(r)};const unknown=(r,cost,exclude)=>{uncertain=true;score-=cost;why.push(r);if(exclude)excluded=true};
if(p.price!=null&&p.price>budget)out('Research price exceeds your stated budget');else if(p.price==null&&budget!==Infinity)unknown('Price is not currently verified',15);
if(task==='lawn'){
 if(p.acre==null)unknown('Published work area is not verified',30,true);else if(finder.acre>p.acre)out('Your lawn is larger than the published work area');else{score-=Math.abs(p.acre-finder.acre)*4;fits.push(`Published lawn area: ${p.acre} acres`)}
 if(p.slope==null)unknown('Slope rating not yet verified',20);else if(finder.slope>p.slope)out('Your grade exceeds the published maximum slope');else fits.push(`published max slope: ${p.slope}%`);
}
if(task==='snow'){uncertain=true;if(p.snowSqft==null)unknown('Snow coverage is unverified',30,true);else if(finder.snowSqft>p.snowSqft)out('Area exceeds published per-charge standard-snow coverage');else fits.push(`Manufacturer states ${p.snowSqft.toLocaleString()} ft² of standard snowfall per charge`)}
if(task==='pool'){
 if(p.poolSqft==null)unknown('Pool-size suitability has not been verified',35,true);else if(finder.poolSqft>p.poolSqft)out('Your pool area exceeds the published coverage');else fits.push(`Published pool/single-cycle coverage reference: ${p.poolSqft.toLocaleString()} ft²`);
 // Only the Aiper record carries verified pool-construction scope (in-ground); every other pool record stays "requires verification".
 if(p.id==='aiper-scuba'){if(finder.poolType==='above')out('Aiper identifies this model for in-ground pools')}else uncertain=true;
}
if(['floor','window','smart','business'].includes(task))unknown('Detailed property and feature suitability not fully verified',30);
const reason=(excluded?why:[...fits,...why]).join('; ');
return{p,excluded,uncertain,score:Math.max(0,score),reason:reason||'Model research requires additional technical verification'};})}
const FINDER_LIMITS={acre:[0.01,1000,'mowing area (0.01–1,000 acres)'],slope:[0,100,'steepest grade (0–100%)'],poolSqft:[50,100000,'pool floor area (50–100,000 ft²)'],snowSqft:[100,100000,'area to clear (100–100,000 ft²)']};
const FINDER_FIELDS={lawn:['acre','slope'],pool:['poolSqft'],snow:['snowSqft']};
function nextFinder(){if(finder.step===0){if(!finder.task){toast('Select a task to continue');return}finder.step=1}else if(finder.step===1){const bad=(FINDER_FIELDS[finder.task]||[]).filter(k=>{const [lo,hi]=FINDER_LIMITS[k];const v=finder[k];return !Number.isFinite(v)||v<lo||v>hi});if(bad.length){bad.forEach(k=>{const el=$(`[data-field="${k}"]`,$('#finderBody'));if(el)el.setAttribute('aria-invalid','true')});const el=$(`[data-field="${bad[0]}"]`,$('#finderBody'));if(el)el.focus();toast('Enter a valid '+FINDER_LIMITS[bad[0]][2]);return}finder.step=2}else{finder.step=0;finder.task=''}renderFinder()}
function openUtility(kind){if(kind==='privacy'){openDialog(`<div class="eyebrow">TRANSPARENCY</div><h2>Our research and privacy principles.</h2><h3>Affiliate disclosure</h3><p>Many Faces Robotics may earn a commission through approved affiliate merchant links in the future. This working build currently has no active commission-tracked offers. Outbound manufacturer research links are ordinary links; purchases, warranties and returns are handled by those manufacturers. This store runs on Shopify, which sets its own cookies under its own privacy policy.</p><h3>Analytics preference</h3><p>Anonymous first-party interaction analytics are optional. When enabled, limited task/product interaction events are published inside this Shopify store for the owner's analytics. No financial or purchasing records are inferred from click events. Saved shortlists and calculator values stay in this browser.</p><p><strong>Current preference:</strong> ${consented()?'Enabled':'Disabled'}</p><div class="dialog-actions"><button class="btn btn-dark" data-modal-action="consent" data-consent="yes">Enable anonymous analytics</button><button class="btn btn-outline-dark" data-modal-action="consent" data-consent="no">Keep analytics off</button></div><h3>Comparing page versions</h3><p>To compare two versions of this page fairly, this browser keeps a random visitor number. It is not linked to your name or email, it is never sent to us, and it only decides which version you see. If you follow a merchant link, the link may note which version you saw, never the number itself. Clearing site data removes it.</p><h3>Policies and communications</h3><p>This store does not sell or take payment for any product and has no marketing-mail provider. Privacy, legal and accessibility policies require organization-specific review before public launch.</p>`);return}
if(kind==='ops'){openDialog(`<div class="eyebrow">CONTROL CENTER · MANY FACES ONLINE</div><h2>Operations connection status.</h2><p><strong>Site identifier:</strong> <code>${SITE_ID}</code></p><div class="status-line">Control Center reads this store through a read-only Shopify app · connection status is shown in Control Center</div><p>Control Center reads this store's products, inventory and orders only after the owner creates and authorizes a read-only Shopify app. This page cannot see whether that connection is active and never holds Control Center credentials.</p><h3>Systems awaiting authorization</h3><ul><li>Affiliate network accounts and transaction exports</li><li>Analytics, Search Console and approved email provider</li><li>App Store, Google Play and Microsoft publishing accounts</li></ul><p>There are no fabricated paid commissions in this build. Illustrative financial modeling is kept separate from observed transaction data.</p>`);return}
if(kind==='contact'){openDialog(`<div class="eyebrow">CONTACT & CORRECTIONS</div><h2>Help improve our research.</h2><p>A public support inbox has not yet been connected. You can export a correction note locally to retain the exact source and claim you'd like us to review.</p><label style="display:block;font-size:12px;font-weight:700">Your research correction<textarea id="correctionText" rows="5" style="display:block;width:100%;margin-top:10px;border:1px solid #d9dfd9;padding:12px" placeholder="Product model, source URL, and suggested correction…"></textarea></label><div class="dialog-actions"><button id="saveCorrection" class="btn btn-dark">Save correction note ↓</button></div>`);$('#saveCorrection').addEventListener('click',()=>{const v=$('#correctionText').value.trim();if(!v)return toast('Add a correction before saving');download(v,'robotics-correction-note.txt');toast('Note saved locally — not submitted')});return}
if(kind==='business'){openDialog(`<div class="eyebrow">COMMERCIAL ROBOTICS</div><h2>Discuss a larger project.</h2><p>Research autonomous cleaning, property care or procurement solutions for your organization.</p><div id="leadSlot"></div>`);const tpl=$('#leadFormTemplate'),slot=$('#leadSlot');if(tpl)slot.append(tpl.content.cloneNode(true));else slot.innerHTML='<p class="status-line">Business inquiries are not available on this page.</p>';return}}
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('#savedDrawer').hidden)closeDrawer();else if(!$('#mobileMenu').hidden){closeMobileMenu();$('#mobileToggle').focus()}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

// Phone swipe cue: arrows and dots under the swipe row so it is obvious the cards scroll sideways. Hidden on desktop by CSS.
(function(){if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;var SEL='.category-grid';
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
