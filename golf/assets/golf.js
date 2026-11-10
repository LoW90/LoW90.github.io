(function(root){
const products=[
{id:'eye-xo',brand:'Uneekor',name:'EYE XO',tech:'Camera',mount:'Overhead',price:null,rec:[13,16,10],min:null,sensor:[9,10],front:3.5,screen:[9,10],rear:null,software:['view','gspro'],portable:false,source:'https://download.uneekor.com/docs/EYEXO_Manual.pdf',note:'Sensor 3.5 ft ahead of tee, mounted 9–10 ft above ground. Manual shows 13 ft shared swing area; 15 ft for players over 6 ft. Room recommendation 13 × 16 × 10 ft is not a universal safety minimum.'},
{id:'eye-xo2',brand:'Uneekor',name:'EYE XO2',tech:'Camera',mount:'Overhead',price:null,rec:[13,16,10],min:null,sensor:[9,10],front:3.5,screen:[9,10],rear:null,software:['view','gspro'],portable:false,source:'https://download.uneekor.com/docs/EYEXO2_Manual.pdf',note:'Sensor 3.5 ft ahead of tee and 9–10 ft above ground. Wider hitting zone does not establish safe swing clearance.'},
{id:'trackman-io',brand:'Trackman',name:'iO',tech:'Radar + camera',mount:'Overhead',price:null,rec:[15,18,10],min:null,sensor:null,front:null,screen:null,rear:null,software:['trackman'],portable:false,source:'https://www.trackman.com/blog/how-much-room-for-a-golf-simulator',note:'Published comfortable room guidance shown. No minimum flight distance claimed by Trackman for iO; exact mounting geometry still needs confirmation.'},
{id:'trackman-4',brand:'Trackman',name:'Trackman 4',tech:'Dual radar',mount:'Rear floor',price:null,rec:[15,18,10],min:null,sensor:null,front:null,screen:null,rear:null,software:['trackman'],portable:true,source:'https://www.trackman.com/golf/simulator/',note:'Rear-mounted radar requires space behind and ahead of ball. Exact device placement is unverified in this prototype.'},
{id:'mevo-plus',brand:'FlightScope',name:'Mevo+',tech:'Radar',mount:'Rear floor',price:null,rec:null,min:null,sensor:null,front:null,screen:[8,13],rear:8,rearMin:7,software:['e6','gspro'],portable:true,source:'https://flightscope.com/products/mevo-plus',note:'Limited-flight setup states 8 ft behind tee (FAQ range 7–9 ft sensor to tee) and 8–13 ft ball flight; FAQ recommends 13 ft. Metallic dots or RCT balls required for indoor spin. Source has differing edition/platform statements; confirm exact SKU and license.'},
{id:'eye-mini-lite',brand:'Uneekor',name:'EYE MINI LITE',tech:'Camera',mount:'Side floor',price:null,rec:null,min:null,sensor:null,front:null,screen:null,rear:null,software:['view','gspro'],portable:false,source:'https://rainorshinegolf.com/products/uneekor-eye-mini-lite',note:'Floor camera system requires moving equipment when switching handedness. Wired computer requirements and exact hitting geometry need confirmation.'},
{id:'skytrak',brand:'SKYTRAK',name:'ST MAX',tech:'Camera',mount:'Side floor',price:null,rec:null,min:null,sensor:null,front:null,screen:null,rear:null,software:['skytrak'],portable:true,source:'https://www.skytrakgolf.com/',note:'Research lead: current SKU, computer, room and license requirements not yet independently verified.'},
{id:'foresight',brand:'Foresight Sports',name:'GCQuad',tech:'Camera',mount:'Side floor',price:null,rec:null,min:null,sensor:null,front:null,screen:null,rear:null,software:['fsx'],portable:true,source:'https://www.foresightsports.com/',note:'Premium research lead. No geometry or software compatibility approval inferred.'}
].map(p=>({...p,verified:'2026-10-20',category:'Launch monitors'}));
function validate(r,p,c={}){let conflicts=[],warnings=[],unknown=[];if(!r||['w','d','h','ball','behind','screenW','sensor','throw','offset'].some(k=>!Number.isFinite(+r[k])))return {status:'Conflicts with known requirements',conflicts:['Enter valid numeric dimensions.'],warnings:[],unknown:[]};
if(r.w<=0||r.d<=0||r.h<=0||r.ball<=0||r.behind<0||r.screenW<=0)conflicts.push('Dimensions must be positive; rear clearance cannot be negative.');
if(r.ball+r.behind+1>r.d)conflicts.push('Ball-to-screen distance, rear clearance and 1 ft illustrative screen setback exceed room depth.');
if(r.screenW+1>r.w)conflicts.push('Screen width plus 1 ft illustrative enclosure allowance exceeds room width.');
if(Math.abs(r.offset)>r.w/2)conflicts.push('Hitting offset lies outside the room.');
if(r.sensor<0||r.throw<0)conflicts.push('Sensor height and projector throw cannot be negative.');
if(r.obstacle&&[r.obstacleX,r.obstacleY].some(x=>x!=null&&!Number.isFinite(+x)))conflicts.push('Enter valid numeric obstacle coordinates.');
else if(r.obstacle&&(+r.obstacleX<0||+r.obstacleY<0||+r.obstacleX+2>r.w||+r.obstacleY+2>r.d))conflicts.push('Obstacle zone lies outside the room.');
if(p.sensor && (r.sensor<p.sensor[0]||r.sensor>p.sensor[1]||r.sensor>r.h))conflicts.push(`${p.name} sensor must be ${p.sensor[0]}–${p.sensor[1]} ft above ground and below the ceiling.`);
if(p.screen&&(r.ball<p.screen[0]||r.ball>p.screen[1]))warnings.push(`${p.name} manual illustrates ${p.screen[0]}–${p.screen[1]} ft from screen to tee; confirm departure with manufacturer.`);
if(p.rec&&[r.w,r.d,r.h].some((x,i)=>x<p.rec[i]))warnings.push(`Below published room recommendation ${p.rec.join(' × ')} ft. This recommendation is not a proven hard minimum.`);
if(r.hand==='both'&&p.mount==='Side floor')warnings.push('Switching handedness requires repositioning the side-mounted monitor and recalibration; verify safe access.');
if(r.hand==='both'&&Math.abs(r.offset)>.5)warnings.push('Offset hitting position needs independent clearance checks for both handednesses.');
if(r.obstacle)warnings.push('Obstacle zone present: verify full swing, ball containment, access and overhead clearance.');
if(r.portable==='yes'&&!p.portable)conflicts.push('Selected device does not match the requested portable installation.');
if(c.software&&!p.software.includes(c.software))conflicts.push('Selected software ecosystem is not supported by this model in the research library.');
if(c.software==='gspro')unknown.push('GSPro third-party access subscription, supported integration and PC specification require current confirmation.');
if(c.pc==='mac'&&p.brand==='Uneekor')conflicts.push('Uneekor simulation configuration requires a supported Windows PC; Mac selection is not validated.');
if(c.projector==='benq'&&(r.throw<.69*r.screenW||r.throw>.83*r.screenW))conflicts.push('AH700ST throw distance is outside 0.69–0.83 × image width.');
if(c.projector==='benq')warnings.push('16:9 projector on a 4:3 planning screen: allow letterboxing/cropping; verify usable image height and optical offset.');
if(c.enclosure==='none')conflicts.push('Ball containment / impact screen is missing.');
if(c.mat==='none')conflicts.push('Hitting mat is missing.');
if(c.pc==='none')unknown.push('Processing hardware not selected; a complete working system is not established.');
if(!p.rec)unknown.push('Model-specific room dimensions have not been verified.');
if(!p.sensor&&p.mount==='Overhead')unknown.push('Exact sensor mounting geometry is not verified.');
if(p.rear&&r.behind<(p.rearMin||p.rear))conflicts.push(`${p.name} limited-flight setup specifies ${p.rearMin?p.rearMin+'–'+p.rear+' ft (placed at '+p.rear+' ft)':p.rear+' ft'} behind the tee.`);
else if(p.rear&&r.behind<p.rear)warnings.push(`${p.name} is usually placed ${p.rear} ft behind the tee; ${p.rearMin} ft is the shortest distance its FAQ allows.`);
if(p.id==='mevo-plus'&&r.ball<8)conflicts.push('Mevo+ limited-flight setup requires at least 8 ft of ball flight; 13 ft is recommended in its FAQ.');
if(p.mount==='Rear floor'&&!p.rear)unknown.push('Required device-to-ball and ball-flight distances are not verified.');
unknown.push('Swing envelope, structural mounting, enclosure depth/setbacks, lighting, electrical and full PC requirements require professional/manufacturer verification.');
return {status:conflicts.length?'Conflicts with known requirements':unknown.length?'Potentially compatible; requires confirmation':'Appears compatible with published requirements',conflicts,warnings,unknown};}
function costs(v){v=v||{};const invalid=[];const n=k=>{if(v[k]==null||v[k]==='')return 0;const x=Number(v[k]);if(!Number.isFinite(x)||x<0){invalid.push(k);return 0}return Math.round(x*100)};let equipment=n('monitor')+n('enclosure')+n('mat')+n('projector')+n('computer')+n('accessories');let initial=equipment+n('delivery')+n('install')+n('prep')+n('tax');let recurring=n('annual')+n('maintenance');let replacement=n('replacement');return {equipment:equipment/100,initial:initial/100,one:(initial+recurring)/100,three:(initial+3*recurring+replacement)/100,five:(initial+5*recurring+replacement)/100,...(invalid.length?{invalid}:{})};}
function finance(v){if(['sessions','outbound','conversion','aov','rate','expense','target'].concat(v.mode==='net'?[]:['attribution','reversal','payout']).some(k=>!Number.isFinite(+v[k])||+v[k]<0))return {clicks:null,paid:null,per1000:null,profit:null,needed:null,invalid:true};let clicks=v.sessions*v.outbound/100;let paidRate=v.mode==='net'?v.conversion/100:v.conversion/100*v.attribution/100*(1-v.reversal/100)*v.payout/100;let paid=clicks*paidRate*v.aov*v.rate/100;return {clicks,paid,per1000:paidRate*v.aov*v.rate/100*1000,profit:paid-v.expense,needed:paidRate*v.aov*v.rate>0?Math.ceil((v.target+v.expense)/(paidRate*v.aov*v.rate/100)):null};}
function txKey(r){return r.merchant+':'+r.id}
function reconcile(rows){let map=new Map();for(let r of rows){if(!r.id)continue;map.set(txKey(r),r);}let vals=[...map.values()];const cents=st=>vals.filter(r=>r.state===st&&r.amount!==''&&r.amount!=null&&Number.isFinite(+r.amount)).reduce((s,r)=>s+Math.round(+r.amount*100),0)/100;return {rows:vals,paid:cents('Paid'),reversed:cents('Reversed'),missingAmount:vals.filter(r=>r.amount===''||r.amount==null||!Number.isFinite(+r.amount)).length};}
const api={products,validate,costs,finance,reconcile,txKey};if(typeof module!=='undefined')module.exports=api;root.Golf=api;
})(typeof window!=='undefined'?window:globalThis);

/* Shopify adapter for The Golf Atelier (placed between site/dist/engine.js and site/dist/app.js by build.mjs).
   The planner, configurator and comparison use the researched models in engine.js. Once products are published in the
   store, only researched models that are also published show, with the store's title and vendor. Products added only in
   Shopify appear in the product library but not in the room planner, because the planner needs researched geometry.
   If the store has no matching products yet, all researched models show, so the theme works before the CSV import. */
(function () {
  const store = Array.isArray(window.MFG_STORE) ? window.MFG_STORE : [];
  const byHandle = new Map(store.map(s => [s.handle, s]));
  const G = window.Golf;
  if (!G || !store.some(s => G.products.some(p => p.id === s.handle))) return;
  const kept = G.products.filter(p => byHandle.has(p.id)).map(p => ({...p, name: byHandle.get(p.id).title || p.name, brand: byHandle.get(p.id).vendor || p.brand}));
  G.products.splice(0, G.products.length, ...kept);
})();

/* Pages drawn by Liquid (product, library, search, cart, 404) share the site header: keep its saved-plan count right. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('template-index')) return;
  const el = document.getElementById('saved-count');
  try { const plans = JSON.parse(localStorage.getItem('golf-plans') || '[]'); if (el && Array.isArray(plans)) el.textContent = plans.length; } catch {}
});

/* "Plan a room with this" on a product page: the planner opens with that model selected. */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('[data-plan]'); if (!a) return;
  try { sessionStorage.setItem('mfg-plan', a.getAttribute('data-plan')); } catch {}
});

(function(){'use strict';if(!document.body.classList.contains('template-index')||!document.getElementById('main'))return;
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

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-golf","container":"#catalog","card":":scope > .card","idSelector":"[data-preset]","idAttribute":"data-preset","facetSelector":".eyebrow","experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-01","end":"2027-04-30"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
const $=s=>document.querySelector(s), money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0,maximumFractionDigits:0}).format(n), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Local HTTP previews lack crypto.randomUUID; getRandomValues remains available.
function localID(){
  if(typeof crypto.randomUUID==='function')return crypto.randomUUID();
  const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
  const h=Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
const defaults={room:{w:15,d:20,h:10,ball:10,behind:9,hand:'right',screenW:12,sensor:9.5,throw:9,offset:0,obstacle:false,portable:'no',purpose:'Practice & entertainment',budget:25000,style:'Permanent',orientation:'Front wall',projector:'Ceiling',units:'ft',obstacleType:'Furniture',obstacleX:1,obstacleY:14},config:{monitor:'eye-xo',software:'view',pc:'windows',enclosure:'custom',mat:'premium',projector:'benq',accessory:'Safety padding',installation:'Ceiling mount'},cost:{monitor:6000,enclosure:2500,mat:1000,projector:2300,computer:1500,accessories:500,delivery:300,install:1500,prep:2000,tax:0,annual:500,maintenance:150,replacement:500}};
let state=JSON.parse(JSON.stringify(defaults));try{const m=sessionStorage.getItem('mfg-plan');sessionStorage.removeItem('mfg-plan');const pm=Golf.products.find(p=>p.id===m);if(pm){state.config.monitor=pm.id;state.config.software=pm.software[0]||state.config.software}}catch{}let compare=['eye-xo','trackman-io','mevo-plus'];let storageOK=true;function readStore(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}const planChoices={room:{hand:['right','left','both'],portable:['no','yes'],purpose:['Practice & entertainment','Serious practice','Family entertainment','Second home','Commercial inquiry'],style:['Permanent','Retractable concept','Portable concept'],orientation:['Front wall','Side wall'],projector:['Ceiling','Floor enclosure','No projector'],units:['ft','m'],obstacleType:['Furniture','Door / walkway','Window','Column','Beam / sloped ceiling','Ventilation','Outlet / wiring','Lighting']},config:{software:['view','trackman','gspro','e6','skytrak','fsx'],pc:['windows','mac','none'],enclosure:['custom','none'],mat:['premium','none'],projector:['benq','unknown']}};
function cleanPlan(p,strict){if(!p||typeof p!=='object'||Array.isArray(p)||!p.room||typeof p.room!=='object'||!p.config||typeof p.config!=='object'||!Golf.products.some(x=>x.id===p.config.monitor))return null;if(strict&&(p.site_id!=='many-faces-golf'||!p.cost||typeof p.cost!=='object'))return null;let room={},config={monitor:p.config.monitor},cost={};for(let [k,d] of Object.entries(defaults.room)){let v=p.room[k];if(typeof d==='number'){if(v==null&&!strict){room[k]=d;continue}if(!Number.isFinite(v)||Math.abs(v)>100000)return null;room[k]=v}else if(typeof d==='boolean')room[k]=v===true;else room[k]=planChoices.room[k].includes(v)?v:d}for(let [k,d] of Object.entries(defaults.config)){if(k==='monitor')continue;let v=p.config[k];config[k]=planChoices.config[k]?(planChoices.config[k].includes(v)?v:d):typeof v==='string'?v.slice(0,150):d}for(let [k,d] of Object.entries(defaults.cost)){let v=(p.cost||{})[k];if(v==null&&!strict){cost[k]=d;continue}if(!Number.isFinite(v)||v<0||v>10000000)return null;cost[k]=v}let created=Date.parse(p.created_at);return {schema_version:1,site_id:'many-faces-golf',id:typeof p.id==='string'&&/^[\w-]{1,64}$/.test(p.id)?p.id:localID(),name:typeof p.name==='string'&&p.name.trim()?p.name.slice(0,120):'My golf studio',created_at:Number.isFinite(created)?new Date(created).toISOString():new Date().toISOString(),room,config,cost}}
let saved=readStore('golf-plans',[]);if(!Array.isArray(saved))saved=[];let unreadablePlans=saved.filter(p=>!cleanPlan(p));saved=saved.map(p=>cleanPlan(p)).filter(Boolean);if(unreadablePlans.length){try{localStorage.setItem('golf-plans-unreadable',JSON.stringify(unreadablePlans))}catch{}}let events=readStore('golf-events',[]);if(!Array.isArray(events))events=[];let consent=readStore('golf-consent',false)===true;
function persist(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{storageOK=false;toast('Browser storage unavailable. Export JSON to preserve your plan.');return false}}
function toast(s){$('#toast').textContent=s;$('#toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').style.display='none',4500)}
function download(name,data,type='application/json'){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function plan(){return {schema_version:1,site_id:'many-faces-golf',id:localID(),name:'My golf studio',created_at:new Date().toISOString(),...JSON.parse(JSON.stringify(state)),validation:Golf.validate(state.room,product(),state.config)}}
function savePlan(){let p=plan();saved.push(p);if(!persist('golf-plans',saved)){saved.pop();return}count();toast('Studio saved on this browser. No account or cloud upload.')}function count(){$('#saved-count').textContent=saved.length}count();
function product(){return Golf.products.find(p=>p.id===state.config.monitor)||Golf.products[0]}
function field(label,key,value,type='number',extra=''){return `<label class="field">${label}<input type="${type}" data-key="${key}" value="${esc(value)}" ${type==='number'?'step="0.1"':''} ${extra}></label>`}function select(label,key,value,options){return `<label class="field">${label}<select data-key="${key}">${options.map(o=>{let [v,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${value===v?'selected':''}>${esc(t)}</option>`}).join('')}</select></label>`}
function heading(k,title,text){return `<div class="page-heading"><div class="eyebrow">${k}</div><h1>${title}</h1><p>${text}</p></div>`}
const studioImages=[
  {src:(window.MFG_PHOTOS||{})['architectural-studio']||'',alt:'AI-generated architectural golf studio with oak walls, a large fairway screen and a leather lounge'},
  {src:(window.MFG_PHOTOS||{})['performance-room']||'',alt:'AI-generated performance golf room with dark acoustic walls, walnut cabinetry and a coastal course screen'},
  {src:(window.MFG_PHOTOS||{})['flexible-retreat']||'',alt:'AI-generated multipurpose garage golf retreat with pale oak storage, a freestanding enclosure and rear radar'}
];
function studioArt(variant=0){const image=studioImages[variant]||studioImages[0];if(!image.src)return '';return `<img class="studio-photo" src="${image.src}" alt="${image.alt}" width="1536" height="1024" loading="lazy" decoding="async"><span class="image-disclosure">AI-generated concept</span>`}
const editorialImages={
  'golf-lounge':{file:'golf-lounge.webp',alt:'AI-generated oak and leather lounge beside a home golf simulator'},
  'room-planning':{file:'room-planning.webp',alt:'AI-generated planning table with a room sketch, measuring tape and material samples'},
  'studio-details':{file:'studio-details.webp',alt:'AI-generated detail of oak slats, acoustic panels, turf and a golf ball'}
};
function mediaURL(file){return (window.MFG_MEDIA||{})[file]||""}
function editorialArt(name){const image=editorialImages[name];return `<figure class="editorial-photo"><img src="${esc(mediaURL(image.file))}" alt="${image.alt}" width="1672" height="941" loading="lazy" decoding="async"><figcaption>AI-generated concept</figcaption></figure>`}
// Source fragment embedded in dist/app.js; Shopify consumes the same app.
// A scene remains review-only until all retained delivery files are approved.
const filmScenes = [
  {id:'room-reveal', route:'planner', title:'Room for your game.', eyebrow:'01 / Plan the space', poster:'room-planning.webp', action:'Design your golf room', next:'planner', description:'An eight-second room reveal will connect the entrance, hitting position and screen in one continuous view. Measure the usable room and record obstacles before choosing equipment.', media:null},
  {id:'floor-tracking', route:'compare', title:'Understand the position.', eyebrow:'02 / Compare tracking', poster:'performance-room.webp', action:'Configure EYE MINI LITE', next:'builder', model:'eye-mini-lite', description:'A planned side-camera close-up will show a level hitting surface and the device beside the ball. Floor-mounted cameras and rear radar have different placement requirements; compare the exact model.', media:null},
  {id:'overhead-tracking', route:'builder', title:'A considered installation.', eyebrow:'03 / Build the studio', poster:'architectural-studio.webp', action:'Plan with EYE XO', next:'planner', model:'eye-xo', description:'A planned upward camera move will connect the hitting area to an overhead sensor. The EYE XO manual specifies 9–10 ft mounting height and placement 3 ft 6 in ahead of the tee; these are model-specific dimensions.', media:null},
  {id:'screen-projector', route:'guide-8', title:'Bring the whole room into focus.', eyebrow:'04 / Screen and projection', poster:'studio-details.webp', action:'Check your projector geometry', next:'planner', description:'A planned lateral view will show the screen, rear clearance and protected projector placement. Image width, throw ratio, aspect ratio and the exact enclosure all affect the finished installation.', media:null}
];
const filmReviewMode=/(?:^|[?&])preview=1(?:&|$)/.test(location.search||'');
let filmObserver=null, pendingFilmJump=null;
function filmPreviewNav(){
  if(!filmReviewMode)return '';
  return `<details class="film-review"><summary>Preview updates</summary><p>Four new films await generation. These placements use existing stills to show context; they are not completed videos.</p><nav aria-label="Film placement review">${filmScenes.map(s=>`<a href="#${s.route}" data-film-jump="${s.id}">${esc(s.eyebrow)}</a>`).join('')}</nav></details>`;
}
function contextualFilms(route){
  return filmScenes.filter(s=>s.route===route&&(s.media||filmReviewMode)).map(s=>`<section class="section context-film" id="film-${s.id}" aria-labelledby="film-title-${s.id}" tabindex="-1"><figure>${s.media?`<video data-film controls muted playsinline preload="none" width="1280" height="720" poster="${esc(mediaURL(s.media.poster))}" aria-label="${esc(s.title)}" aria-describedby="film-caption-${s.id}"><source src="${esc(mediaURL(s.media.mp4))}" type="video/mp4"><source src="${esc(mediaURL(s.media.webm))}" type="video/webm"></video><button type="button" class="secondary film-toggle" data-film-toggle>Play film</button><p data-film-error hidden role="status">This film could not load. <a href="${esc(mediaURL(s.media.mp4))}">Open the MP4</a> or continue with the planning tools.</p>`:`<img src="${esc(mediaURL(s.poster))}" loading="lazy" decoding="async" width="1280" height="720" alt="Existing AI golf-room concept used to review a future film placement"><span class="film-pending">Planned film · Not generated</span>`}<figcaption id="film-caption-${s.id}">${s.media?'Eight-second silent AI concept. Illustrative equipment and setting; not a product test or an included bundle.':'Existing concept photograph. The new eight-second scene is pending.'}</figcaption></figure><div><div class="eyebrow">${esc(s.eyebrow)}</div><h2 id="film-title-${s.id}">${esc(s.title)}</h2><p>${esc(s.description)}</p><a class="button secondary" href="#${s.next}" data-film-action="${s.id}">${esc(s.action)} →</a></div></section>`).join('');
}
function bindFilms(){
  filmObserver?.disconnect();
  const videos=[...document.querySelectorAll('video[data-film]')];
  if(videos.length&&typeof window.IntersectionObserver==='function'){
    filmObserver=new window.IntersectionObserver(entries=>entries.forEach(({target,isIntersecting,intersectionRatio})=>{if(!isIntersecting||intersectionRatio<.15)target.pause()}),{threshold:[0,.15]});
  }
  videos.forEach(v=>{
    // Manual playback is the default for everyone, including reduced-motion
    // and save-data users. No optional movie bytes load before a user plays.
    v.autoplay=false;v.loop=false;v.preload='none';
    const fallback=v.closest('figure')?.querySelector('[data-film-error]');
    const toggle=v.closest('figure')?.querySelector('[data-film-toggle]');
    if(toggle){toggle.onclick=()=>{if(v.paused)v.play().catch(()=>{if(fallback)fallback.hidden=false});else v.pause()};v.addEventListener('play',()=>toggle.textContent='Pause film');v.addEventListener('pause',()=>toggle.textContent='Play film');v.addEventListener('ended',()=>toggle.textContent='Play film')}
    v.addEventListener('play',()=>videos.forEach(other=>{if(other!==v)other.pause()}));
    v.addEventListener('error',()=>{if(fallback)fallback.hidden=false});
    // With <source> children Chromium can leave play() pending when every
    // candidate fails. Report failure only after all alternatives are exhausted.
    const sources=[...v.querySelectorAll('source')],failedSources=new Set();
    v.addEventListener('loadstart',()=>{failedSources.clear();if(fallback)fallback.hidden=true});
    sources.forEach(source=>source.addEventListener('error',()=>{
      failedSources.add(source);
      if(failedSources.size===sources.length&&fallback)fallback.hidden=false;
    }));
    v.addEventListener('loadeddata',()=>{if(fallback)fallback.hidden=true});
    filmObserver?.observe(v);
  });
  document.querySelectorAll('[data-film-jump]').forEach(a=>a.onclick=()=>{
    pendingFilmJump=a.dataset.filmJump;
    if(location.hash===a.hash){render();revealFilmJump()}
  });
  document.querySelectorAll('[data-film-action]').forEach(a=>a.onclick=()=>{
    const s=filmScenes.find(s=>s.id===a.dataset.filmAction);
    if(s.model){state.config.monitor=s.model;state.config.software=product().software[0]}
    if(location.hash===a.hash){render();window.scrollTo(0,0)}
  });
}
function revealFilmJump(){
  if(!pendingFilmJump)return;
  const target=document.querySelector('#film-'+pendingFilmJump);
  if(target){target.scrollIntoView({behavior:'instant',block:'center'});target.focus({preventScroll:true});pendingFilmJump=null}
}
if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{
  if(document.hidden)document.querySelectorAll('video[data-film]').forEach(v=>v.pause());
});

function studioFilm(){return `<section class="section film-section" aria-labelledby="studio-film-title"><div class="section-head"><div><div class="eyebrow">A moment in the studio</div><h2 id="studio-film-title">Picture the possibilities.</h2></div><p>Three rooms. The details around them. A quiet look at the art of golf at home.</p></div><figure class="studio-film"><video data-film controls playsinline preload="none" width="1280" height="720" poster="${esc(mediaURL('golf-lounge.webp'))}" aria-label="Golf studio concepts: silent 12-second photographic sequence" aria-describedby="studio-film-description"><source src="${esc(mediaURL('golf-film.mp4'))}" type="video/mp4"><source src="${esc(mediaURL('golf-film.webm'))}" type="video/webm"><p>Your browser cannot play this film. <a href="${esc(mediaURL('golf-film.mp4'))}">Open the MP4 film</a> or <a href="${esc(mediaURL('golf-film.webm'))}">the WebM film</a>.</p></video><button type="button" class="secondary film-toggle" data-film-toggle>Play film</button><p data-film-error hidden role="status">This film could not load. <a href="${esc(mediaURL('golf-film.mp4'))}">Open the MP4 film</a> or continue exploring the studio tools.</p><figcaption id="studio-film-description">12-second silent photographic sequence that plays as you scroll to it. AI-generated concepts; no real installation or product performance is depicted. Use the player controls to play or pause.</figcaption></figure></section>`}
const studioTypes=[['The Architectural Studio','eye-xo2','A permanent overhead system for a room designed around the game.','Dedicated room · Shared handedness'],['The Performance Room','trackman-io','An integrated indoor environment for focused practice and refined entertaining.','Premium technology · Fixed installation'],['The Flexible Retreat','mevo-plus','A portable tracking approach for a space that does more than one thing.','Multipurpose room · Rear radar clearance']];
function studios(){return studioTypes.map((a,i)=>`<article class="studio"><div class="studio-art">${studioArt(i)}</div><div class="studio-body"><div class="meta"><span>0${i+1} / CURATED DIRECTION</span><span>↗</span></div><h3>${a[0]}</h3><p>${a[2]}</p><div class="small">${a[3]}</div><p class="small">Custom equipment scope · Quoted pricing required</p><button class="secondary" data-preset="${a[1]}">Configure this direction →</button></div></article>`).join('')}
function home(){return `<div class="underhero" aria-label="Manufacturers we cover"><span>EXPLORE THE TECHNOLOGY</span><b>TRACKMAN</b><b>Uneekor</b><b>FORESIGHT SPORTS</b><b>FlightScope</b><b>SKYTRAK</b><b>Full Swing</b><b>Garmin</b><b>Bushnell Golf</b><b>TruGolf</b><b>ProTee</b><b>Rapsodo</b><b>BenQ</b><b>Epson</b><b>Fiberbuilt</b><a class="coverage" href="#sources">Research coverage varies →</a></div><section class="hero"><div class="hero-copy"><div class="eyebrow">The art of golf at home</div><h1>Your game.<br>Beautifully<br><em>at home.</em></h1><p>Exceptional golf starts with a space that works. Discover the technology, design your room, and build a studio that feels entirely yours.</p><div class="hero-actions"><a class="button" href="#planner">Plan my golf room →</a><a class="text-link" href="#studios">Explore the collection →</a></div><p class="small" style="margin-top:24px">Independent guidance. Multiple brands. Your space comes first.</p></div><div class="hero-image">${studioArt().replace('loading="lazy"','loading="eager" fetchpriority="high"')}<video id="heroFilm" class="hero-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="${esc(mediaURL('golf-film.mp4'))}" data-webm="${esc(mediaURL('golf-film.webm'))}"></video><button type="button" class="hero-motion" data-mf-motion-toggle aria-controls="heroFilm" hidden>Pause motion</button><div class="caption">ORIGINAL AI-GENERATED STUDIO CONCEPT</div></div></section><div class="steps">${['Discover','Design','Configure','Compare','Purchase'].map((s,i)=>`<a href="#${['shop','planner','builder','compare','offers'][i]}"><small>0${i+1}</small>${s}</a>`).join('')}</div><section class="section"><div class="section-head"><div><div class="eyebrow">A collection of possibilities</div><h2>Make room for<br>an exceptional game.</h2></div><p>Start with the experience you want. We’ll help you understand the equipment, space and decisions that bring it together.</p></div><div class="grid swipe-row">${studios()}</div></section>${studioFilm()}<section class="dark"><div class="section feature"><div><div class="eyebrow">The studio planner</div><h2>A great room.<br>A considered setup.</h2><p>See how your dimensions, hitting position and equipment work together in a live, top-down plan. Understand what fits—and what still needs confirmation.</p><a class="button secondary" style="color:white" href="#planner">Measure. Explore. Refine. ↗</a></div><div style="background:#e9ecdf;color:#233a2b;padding:15px">${roomSVG(defaults.room,Golf.products[0])}</div></div></section><section class="section"><div class="section-head"><div><div class="eyebrow">Independent by design</div><h2>Confidence, before commitment.</h2></div></div><div class="grid"><div>${editorialArt('room-planning')}<h3>Space before specifications.</h3><p>Find the constraints early. Different sensors and installations have different requirements.</p><a class="text-link" href="#planner">Understand your room →</a></div><div>${editorialArt('studio-details')}<h3>The complete picture.</h3><p>Hardware is one part of the project. See software, installation allowances and long-term costs together.</p><a class="text-link" href="#cost">Explore ownership costs →</a></div><div>${editorialArt('golf-lounge')}<h3>Evidence over influence.</h3><p>Published sources inform our research. Merchant compensation never changes a compatibility rule.</p><a class="text-link" href="#about">Read our approach →</a></div></div></section>`}
function roomSVG(r,p){let w=Math.max(1,+r.w||1),d=Math.max(1,+r.d||1),scale=Math.min(540/w,360/d),x=100,y=50,W=w*scale,D=d*scale,teeX=x+W/2+(+r.offset||0)*scale,teeY=y+(1+(+r.ball||0))*scale;let sensorY=p.mount==='Overhead'?teeY-(p.front||0)*scale:p.mount==='Rear floor'?teeY+(p.rear||Math.min(+r.behind,5))*scale:teeY;let sensorX=p.mount==='Side floor'?teeX+(r.hand==='left'?-1.5:1.5)*scale:teeX;return `<svg viewBox="0 0 760 480" role="img" aria-label="Top down golf room ${w.toFixed(1)} feet wide by ${d.toFixed(1)} feet deep; screen at top, tee ${r.ball} feet from screen. Not a safety certification"><defs><pattern id="grid" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse"><path d="M ${scale} 0 L 0 0 0 ${scale}" fill="none" stroke="#b6c2a8" stroke-width=".6"/></pattern></defs><rect x="${x}" y="${y}" width="${W}" height="${D}" fill="url(#grid)" stroke="#3d5c45" stroke-width="3"/><rect x="${x+(W-r.screenW*scale)/2}" y="${y+.65*scale}" width="${r.screenW*scale}" height="${.35*scale}" fill="#1e4533"/><text x="${x+W/2}" y="${y-16}" text-anchor="middle" font-size="14" fill="#27432f">${r.units==='m'?(w*.3048).toFixed(2)+' m':w.toFixed(1)+' ft'} wide</text><text x="${x+W+15}" y="${y+D/2}" font-size="13" fill="#27432f">${r.units==='m'?(d*.3048).toFixed(2)+' m':d.toFixed(1)+' ft'} deep</text><text x="${x+W/2}" y="${y+1.8*scale}" text-anchor="middle" font-size="11">Impact screen · ${r.screenW} ft</text><ellipse cx="${teeX}" cy="${teeY}" rx="${Math.min(W/2,4.5*scale)}" ry="${3.5*scale}" fill="#b59a5530" stroke="#a38b50" stroke-dasharray="5 5"/><rect x="${teeX-1.7*scale}" y="${teeY-1.5*scale}" width="${3.4*scale}" height="${3*scale}" fill="#547b48" opacity=".8"/><circle cx="${teeX}" cy="${teeY}" r="6" fill="white" stroke="#244d34"/><text x="${teeX+12}" y="${teeY+20}" font-size="11">Tee</text><rect x="${sensorX-9}" y="${sensorY-5}" width="18" height="10" rx="2" fill="#263d35"/><text x="${sensorX+13}" y="${sensorY}" font-size="10">Sensor ${p.rear?'':'(schematic)'}</text><rect x="${x+W/2-7}" y="${y+(1+r.throw)*scale}" width="14" height="11" fill="#af8b48"/><line x1="${x+W/2}" y1="${y+(1+r.throw)*scale}" x2="${x+W/2}" y2="${y+scale}" stroke="#af8b48" stroke-dasharray="3 3"/>${r.obstacle?`<rect x="${x+(+r.obstacleX||0)*scale}" y="${y+(+r.obstacleY||0)*scale}" width="${2*scale}" height="${2*scale}" fill="#b65d4d88"/><text x="${x+10}" y="${y+D-12}" fill="#8a3428" font-size="11">Obstacle zone: ${esc(r.obstacleType)}</text>`:''}<text x="${x+W/2}" y="${y+D+30}" text-anchor="middle" fill="#5b6d57" font-size="11">Top-down · 1 square = 1 ft · Swing ellipse is illustrative only</text></svg>`}
function dimensionField(label,key){let r=state.room;return field(`${label} (${r.units==='m'?'m':'ft'})`,key,r.units==='m'?(r[key]*.3048).toFixed(2):r[key])}
function validationHTML(v){return `<div class="notice ${v.conflicts.length?'bad':'warn'}"><b>${v.status}</b></div>${v.conflicts.length?'<h4>Resolve these conflicts</h4><ul class="result-list error">'+v.conflicts.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}${v.warnings.length?'<h4>Planning cautions</h4><ul class="result-list">'+v.warnings.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}<details><summary>Unverified requirements (${v.unknown.length})</summary><ul class="result-list">${v.unknown.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`}
function planner(){let r=state.room;return `${heading('01 / Design','Every studio starts with a space.','Enter your measurements. Explore a live plan. Review equipment-specific constraints before you configure.')}<div class="workspace"><aside class="panel"><h3>Your room</h3>${select('Measurement units','units',r.units,[['ft','Feet / inches'],['m','Meters']])}<div class="fields">${dimensionField('Width','w')}${dimensionField('Depth','d')}${dimensionField('Ceiling','h')}</div>${r.units==='ft'?`<details><summary>Enter feet + inches precisely</summary><div class="fields"><label class="field">Dimension<select id="inch-dim"><option value="w">Width</option><option value="d">Depth</option><option value="h">Ceiling</option></select></label><label class="field">Feet<input id="feet" type="number" min="0" value="10"></label><label class="field">Inches<input id="inches" type="number" min="0" max="11" value="0"></label></div><button id="apply-inches" class="secondary small">Apply dimension</button></details>`:''}${select('Golfers','hand',r.hand,[['right','Right-handed'],['left','Left-handed'],['both','Left + right-handed']])}${select('Main purpose','purpose',r.purpose,['Practice & entertainment','Serious practice','Family entertainment','Second home','Commercial inquiry'])}${field('Project budget (USD, your input)','budget',r.budget)}${select('Equipment installation','portable',r.portable,[['no','Permanent / flexible'],['yes','Portable required']])}${select('Launch monitor','monitor',state.config.monitor,Golf.products.map(p=>[p.id,p.brand+' '+p.name]))}<details><summary>Layout & installation details</summary>${dimensionField('Ball to screen','ball')}${dimensionField('Available behind tee','behind')}${dimensionField('Screen image width','screenW')}${dimensionField('Sensor mount height','sensor')}${dimensionField('Projector throw','throw')}${field('Tee offset from center (ft; negative = left)','offset',r.offset,'number','min="-30"')}${select('Installation style','style',r.style,['Permanent','Retractable concept','Portable concept'])}${select('Screen on','orientation',r.orientation,['Front wall','Side wall'])}${select('Projection preference','projectorPreference',r.projector,['Ceiling','Floor enclosure','No projector'])}<p class="small">Side-wall orientation swaps width and depth. Retractable/floor protection specifications require confirmation.</p></details><details><summary>Obstacles & multipurpose use</summary><label class="check"><input type="checkbox" id="obstacle" ${r.obstacle?'checked':''}> Add obstacle zone</label>${select('Obstacle type','obstacleType',r.obstacleType,['Furniture','Door / walkway','Window','Column','Beam / sloped ceiling','Ventilation','Outlet / wiring','Lighting'])}${field('Zone X from left (ft)','obstacleX',r.obstacleX)}${field('Zone Y from screen wall (ft)','obstacleY',r.obstacleY)}<p class="small">2 × 2 ft schematic zone. Does not calculate height or swing collisions; all obstacles trigger review.</p></details></aside><div><div class="toolbar"><span class="eyebrow">Live room plan / ${esc(product().name)}</span><button class="secondary small" data-action="save">Save studio</button><button class="secondary small" data-action="export">Export JSON</button><button class="secondary small" onclick="window.print()">Print</button></div><div class="room" id="room-view">${roomSVG(r,product())}</div><div class="legend"><span>Impact screen & sensor</span><span>Projector throw line</span><span>Illustrative swing area</span></div><div id="validation">${validationHTML(Golf.validate(r,product(),state.config))}</div><p class="small">${esc(product().note)} <a class="source" href="${product().source}" target="_blank" rel="noopener">Manufacturer / research source ↗</a></p><div class="notice">This is planning assistance, not an installation approval. Verify full swing, mounting, containment, electrical, lighting and walkways with the manufacturer and qualified installer.</div><a class="button" href="#builder">Continue to equipment →</a></div></div>`}
const softwareOptions=[['view','Uneekor VIEW'],['trackman','Trackman software'],['gspro','GSPro (verify license/access)'],['e6','E6 Connect'],['skytrak','SKYTRAK ecosystem'],['fsx','Foresight FSX']];
function builder(){let c=state.config,p=product();return `${heading('02 / Configure','A system. Not just a sensor.','Choose the components around your launch monitor. Every change reruns the rules. Unknown requirements stay visible.')}<div class="workspace"><aside class="panel"><h3>Your equipment</h3>${select('Launch monitor','monitor',c.monitor,Golf.products.map(p=>[p.id,p.brand+' '+p.name]))}${select('Enclosure + impact screen','enclosure',c.enclosure,[['custom','Custom 4:3 enclosure + screen (specify)'],['none','Not selected']])}${select('Hitting mat','mat',c.mat,[['premium','Premium mat (specify dimensions)'],['none','Not selected']])}${select('Projector','projector',c.projector,[['benq','BenQ AH700ST'],['unknown','Other projector — unverified']])}${select('Computer','pc',c.pc,[['windows','Windows PC — specs pending'],['mac','Mac'],['none','Not selected']])}${select('Simulator software','software',c.software,softwareOptions)}${field('Optional accessories (planning only)','accessory',c.accessory,'text')}${field('Installation components (planning only)','installation',c.installation,'text')}<button data-action="save">Save configuration</button></aside><div><div class="panel"><div class="eyebrow">${esc(p.brand)} / ${esc(p.tech)}</div><h2>${esc(p.name)}</h2><div class="split"><div><p>${esc(p.note)}</p><p><b>Hardware price: unknown</b><br><span class="small">Get a current, itemized merchant quote.</span></p></div><div><h3>Selected scope</h3><p class="small">${esc(c.enclosure)} enclosure / impact screen<br>${esc(c.mat)} mat<br>${c.projector==='benq'?'BenQ AH700ST':'Unverified projector'}<br>${esc(c.pc)} processing hardware<br>${esc(c.software)} software<br>${esc(c.accessory)}<br>${esc(c.installation)}</p></div></div><a class="source" href="${p.source}" target="_blank" rel="noopener">Review the source · checked Oct 20, 2026 ↗</a></div><div id="validation">${validationHTML(Golf.validate(state.room,p,c))}</div><div class="notice warn">Components are planning placeholders unless a model is named. Enclosure frame depth, exact screen height, mat dimensions, mount kit, cabling, PC/GPU specifications and software license are not established. This configuration is not a certified complete package.</div><div id="budget-check"></div><div class="toolbar"><a class="button" href="#cost">Estimate ownership cost →</a><a class="button secondary" href="#compare">Compare technologies →</a><a class="text-link" href="#offers">View merchant options</a></div><div class="panel"><h3>Why this direction?</h3><p>${p.mount==='Overhead'?'An overhead installation keeps the tracking hardware off the floor, which can simplify shared handedness. Mounting constraints and structural work remain important.':p.mount==='Side floor'?'A side camera approach avoids a radar flight corridor behind the tee. Shared handedness requires repositioning and the device must remain outside the swing path.':'A rear-floor radar approach can offer flexibility between home and range. It requires a dedicated device-to-ball and ball-flight corridor.'}</p><p class="small">${esc(state.room.purpose)} · ${esc(state.room.hand)} handedness · ${money(state.room.budget)} user budget. Recommendations describe tradeoffs; they are not quality scores.</p></div></div></div>`}
function cards(list){return list.map(p=>`<article class="card"><div class="product-icon"><div class="device ${p.mount==='Overhead'?'':'floor'}" role="img" aria-label="Illustrative ${esc(p.mount)} device silhouette"></div></div><div class="eyebrow">${esc(p.brand)}</div><h3>${esc(p.name)}</h3><p>${esc(p.tech)} · ${esc(p.mount)}<br>${p.rec?'Published room guidance: '+p.rec.join(' × ')+' ft':'Room requirements: unverified'}</p><p class="small">Price unknown · Research record</p><div class="toolbar"><button class="small" data-preset="${p.id}">Plan this system</button><button class="small secondary" data-compare="${p.id}">${compare.includes(p.id)?'✓ In comparison':'+ Compare'}</button></div></article>`).join('')}
function shop(){return `${heading('The equipment library','Find your starting point.','Explore researched launch monitors and the components around them. Concept silhouettes are not product photographs.')}<section class="section" style="padding-top:10px"><div class="toolbar"><input id="search" aria-label="Search products" placeholder="Search brand, model, technology…"><select id="filter" aria-label="Filter mounting style"><option value="">All installation styles</option><option>Overhead</option><option>Side floor</option><option>Rear floor</option></select><a class="button secondary" href="#compare">Compare selections →</a></div><div id="catalog" class="grid four">${cards(Golf.products)}</div><div class="notice">The wider equipment ecosystem includes screens, enclosures, projectors, mats, PCs, software, swing cameras, putting, audio and safety accessories. Only the named models shown in this prototype have research records; the remaining component scope needs sourcing.</div></section>`}
function comparison(){let ps=compare.map(id=>Golf.products.find(p=>p.id===id)).filter(Boolean);return `${heading('03 / Compare','Different technologies.<br>One clear perspective.','Compare underlying models independently of sellers. Bundle inclusions remain separate from the canonical product.')}<section class="section" style="padding-top:10px"><div class="toolbar"><a class="button secondary" href="#shop">Choose models</a><button id="reset-compare" class="secondary">Reset comparison</button></div>${ps.length?`<div class="compare-wrap"><table><thead><tr><th>Decision</th>${ps.map(p=>`<th>${p.brand}<h3>${p.name}</h3><button data-compare="${p.id}" class="small secondary">Remove</button></th>`).join('')}</tr></thead><tbody>${[['Technology',p=>p.tech],['Placement',p=>p.mount],['Published room guidance',p=>p.rec?p.rec.join(' × ')+' ft (recommendation)':'Insufficient data'],['Mounting height',p=>p.sensor?p.sensor.join('–')+' ft':'Unverified'],['Handedness implications',p=>p.mount==='Side floor'?'Reposition when switching hands':'Independent swing clearances still required'],['Software research leads',p=>p.software.join(', ')+'; license requirements pending'],['Purchase price',p=>'Unknown — quote required'],['Planning assessment',p=>Golf.validate(state.room,p,state.config).status],['Evidence',p=>`<a class="source" href="${p.source}" target="_blank" rel="noopener">Source ↗</a><small>Reviewed ${p.verified}</small>`]].map(([label,fn])=>`<tr><th>${label}</th>${ps.map(p=>`<td>${fn(p)}</td>`).join('')}</tr>`).join('')}<tr><th>Next step</th>${ps.map(p=>`<td><button class="small" data-preset="${p.id}">Configure →</button></td>`).join('')}</tr></tbody></table></div>`:'<div class="empty">No models selected. Choose products in the equipment library.</div>'}<h2 style="margin-top:40px">Compare the scope, too.</h2>${merchantTable()}<div class="notice warn">Merchant research listings below are not confirmed equivalent bundles or current stock. Missing inclusions and prices prevent a lowest-price or best-value conclusion.</div></section>`}
const offers=[{id:'xo2-direct',product:'eye-xo2',merchant:'Uneekor',scope:'EYE XO2 standalone — manufacturer',items:'Launch monitor listing; SIMKIT is a different bundle and is not assumed included',url:'https://uneekor.com/en-us/products/eye-xo2-standalone',price:10999,status:'Unverified',warranty:'Confirm exact warranty and package scope',shipping:'Unknown',software:'Tier and license not verified'},{id:'xo-direct',product:'eye-xo',merchant:'Uneekor',scope:'EYE XO standalone',items:'Launch monitor only (Essential edition); $6,499 was a sale from $7,999 on 2026-10-28',url:'https://uneekor.com/en-us/products/eye-xo-standalone',price:6499,status:'Unverified',warranty:'Manufacturer terms; verify exact region and seller',shipping:'Unknown',software:'License / tier not verified'}, {id:'xo2-rain',product:'eye-xo2',merchant:'Rain or Shine Golf',scope:'EYE XO2 launch monitor',items:'Listed as the EYEXO2 Studio Bundle with Swing Optix cameras; no complete room bundle inferred',url:'https://rainorshinegolf.com/products/uneekor-eye-xo2-launch-monitor-golf-simulator',price:10999,status:'Pending review',warranty:'Retailer states authorized dealer; confirm current warranty',shipping:'Reconfirm at checkout',software:'Inclusions unknown'}, {id:'eml-rain',product:'eye-mini-lite',merchant:'Rain or Shine Golf',scope:'EYE MINI LITE standalone',items:'Monitor; PC, enclosure, projector not assumed included',url:'https://rainorshinegolf.com/products/uneekor-eye-mini-lite',price:1999,status:'Pending review',warranty:'Retailer states authorized dealer; verify exact SKU',shipping:'Unknown',software:'Inclusions unknown'}, {id:'mevo-direct',product:'mevo-plus',merchant:'FlightScope',scope:'Mevo+ manufacturer listing',items:'Final-stock sale from $2,299 on 2026-10-28 (limited stock); course/license inclusions must match SKU',url:'https://flightscope.com/products/mevo-plus',price:1099,status:'Pending review',warranty:'Verify manufacturer purchase terms',shipping:'US policy must be reconfirmed',software:'E6 edition / platform scope needs recheck'}, {id:'benq-outlet',product:'benq-ah700st',merchant:'Indoor Golf Outlet',scope:'BenQ AH700ST projector',items:'Projector only; no monitor, enclosure, screen, PC or mount assumed',url:'https://indoorgolfoutlet.com/collections/tour-approved-list',price:2299,status:'Pending review',warranty:'Unknown',shipping:'Unknown',software:'Not applicable'}];
function merchantTable(){return `<div class="compare-wrap"><table><thead><tr><th>Seller / scope</th><th>Inclusions & price</th><th>Terms & verification</th><th>Destination</th></tr></thead><tbody>${offers.map(o=>`<tr><td>${o.merchant}<b style="display:block">${o.scope}</b></td><td>${o.items}<small>${o.price?money(o.price)+' observed listing, not a current quote':'Price unknown'} · Tax / installation unknown</small></td><td>${o.warranty}<small>${o.shipping} · ${o.software}<br>Oct 20, 2026 · ${o.status}</small></td><td><a class="text-link mf-buy" href="${o.url}" data-referral="${o.id}" target="_blank" rel="noopener">Check price at ${o.merchant} ↗</a><small>Ordinary link · No approved affiliate agreement</small></td></tr>`).join('')}</tbody></table></div>`}
function costPage(){let c=Golf.costs(state.cost);return `${heading('04 / Understand the investment','The whole project.<br>The longer view.','A planning model—not an installed quote. All prefilled costs below are illustrative allowances, including the launch monitor. Replace them with itemized quotes.')}<section class="section" style="padding-top:10px"><div class="split"><div class="panel"><h3>Your assumptions / USD</h3><div class="fields">${Object.entries({monitor:'Launch monitor',enclosure:'Enclosure + screen',mat:'Hitting mat',projector:'Projector',computer:'Computer',accessories:'Accessories',delivery:'Delivery',install:'Installation',prep:'Room preparation',tax:'Tax allowance',annual:'Annual software',maintenance:'Annual maintenance',replacement:'One replacement allowance at year 3'}).map(([k,l])=>field(l,k,state.cost[k])).join('')}</div></div><div><div id="cost-results">${costResults(c)}</div><div class="notice warn">Software prices have not been contractually confirmed. Annual charges recur from year 1; the replacement allowance is added once in year 3. Inflation, financing and resale value are excluded. Unknown expenses are not assumed covered by these allowances.</div><div class="toolbar"><button data-action="save">Save estimates</button><button data-action="export" class="secondary">Export studio</button><button onclick="window.print()" class="secondary">Print</button><a class="text-link" href="#offers">Compare seller scope →</a></div></div></div></section>`}
function costResults(c){return `<div class="metrics">${[['Equipment subtotal',c.equipment],['Initial complete project',c.initial],['First year',c.one],['Three years',c.three],['Five years',c.five]].map(([l,n])=>`<div class="metric-card"><small>${l}</small><div class="metric">${money(n)}</div><small>Illustrative / your inputs</small></div>`).join('')}</div><div class="notice ${c.initial>state.room.budget?'warn':''}">${c.initial>state.room.budget?'Over':'Within'} your ${money(state.room.budget)} initial project budget by ${money(Math.abs(c.initial-state.room.budget))}. Unknown scope may change this.</div>`}
function savedPage(){saved=saved.filter(p=>cleanPlan(p));return `${heading('Your studio notebook','Keep the possibilities.','Plans stay on this browser. Export a file for backup or moving to another device; clearing browser storage removes local plans.')}<section class="section mf-saved-page" style="padding-top:10px"><div class="toolbar"><button data-action="save">Save current studio</button><button class="secondary" data-action="export">Export current JSON</button><label class="button secondary">Import plan<input type="file" id="import-plan" class="visually-hidden" accept="application/json"></label></div>${saved.length?`<div class="grid">${saved.map(p=>`<article class="card"><div class="eyebrow">${esc(new Date(p.created_at).toLocaleDateString())} · LOCAL ONLY</div><h3>${esc(p.name)}</h3><p>${p.room.w} × ${p.room.d} × ${p.room.h} ft<br>${esc(p.config.monitor)} · ${money(Golf.costs(p.cost).initial)} initial allowance</p><p class="small">${esc(Golf.validate(p.room,Golf.products.find(x=>x.id===p.config.monitor)||Golf.products[0],p.config).status)}</p><div class="toolbar"><button class="small" data-load="${p.id}">Open</button><button class="small secondary" data-duplicate="${p.id}">Duplicate</button><button class="small secondary" data-delete="${p.id}">Delete</button></div></article>`).join('')}</div>`:'<div class="empty"><h3>Your next great space starts here.</h3><p>No saved plans yet. Measure your room or save the current example.</p><a class="button" href="#planner">Open the room planner</a></div>'}<div class="notice">Shareable cloud links are not enabled. Exported JSON contains equipment, room measurements and assumptions, but no requested name, email or address. Review it before sharing.</div></section>`}
const guides=[['Choose the system around the room','Measure before you shop.','Start with the room’s narrowest dimensions and lowest ceiling, then record doors, beams, lighting and walkways. A full swing is a three-dimensional envelope that room dimensions alone cannot certify.','Choose your tracking architecture next. Overhead equipment needs a suitable mount; rear radar needs a device-to-ball and ball-flight corridor; side cameras need access and repositioning for opposite-handed play.','Use the planner to flag known conflicts, then request a written, model-specific installation review. Ask for the exact hardware, screen, enclosure, computer, software and installation scope.'],['Overhead versus floor-mounted','A question of placement.','Overhead units remove a device from the floor but add structural, ceiling-height and mounting requirements. Uneekor EYE XO and XO2 manuals specify a sensor height of 9–10 ft and placement 3.5 ft in front of the tee.','Floor-mounted cameras and rear radar are different categories. A side camera generally needs repositioning for switching hands; rear radar uses a measurement corridor behind the tee. Neither arrangement establishes swing safety by itself.','Compare ease of setup, actual household handedness and whether the device needs to travel to the range. Verify requirements for your exact model.'],['Radar, cameras and hybrid tracking','Understand the geometry.','Tracking architecture affects placement. Trackman iO combines sensing technologies in an overhead device; Trackman 4 is a portable rear-floor device. Their installation assumptions should not be interchanged.','Camera systems also vary by model: an overhead unit and a side-mounted unit have different mounting and access constraints. Do not infer accuracy rankings from a technology label.','The prototype contains no independent performance measurements. Ask for model-specific evidence relevant to indoor use, hitting zones, ball requirements and software.'],['What a complete package includes','Look beyond the headline.','A launch monitor does not establish a complete golf room. Itemize screen, enclosure, mat, projector, computer, software, mounting, cables, safety padding and any room work.','Confirm exact SKU and bundle contents across retailers. Similar names can refer to different screens, frame sizes, mats, license terms or computing hardware. A lower price may simply buy less equipment.','Ask who handles installation, support and returns for each component. Keep the written scope with your saved plan.'],['Software and the cost of ownership','Subscriptions deserve a line item.','Check both the launch monitor’s required software tier and any separate simulation subscription. Compatibility with a software brand does not establish that a license is included.','Confirm supported operating system, GPU, processor, memory, networking and display resolution for the exact software version. The prototype flags ecosystem mismatches but does not validate a complete PC specification.','Replace illustrative annual charges in the calculator with current written terms. Add recurring support, maintenance and a replacement allowance that matches your use.'],['Left and right, in the same room','Design for every golfer.','Start with all intended users, not a single assumed swing. Shared handedness affects tee offsets, clearances and whether equipment must be moved between shots.','An overhead installation can reduce equipment repositioning, but both swing envelopes still require clearance checks. A side camera may need to move to the opposite side of the ball.','Test the intended layout under qualified guidance. Avoid using the prototype’s illustrative swing ellipse as a clearance guarantee.'],['Garage and basement planning','The details change the room.','Garage tracks, lowered doors, ceiling beams, sloped ceilings, windows, vents and furniture can intrude into a swing or ball path. Measure actual usable space rather than exterior room dimensions.','Record lighting, ventilation, wiring and access needs. If the room has another use, distinguish a portable device from a fully retractable, safely stored installation.','The planner supports a schematic obstacle zone and prompts review; it does not calculate structural or three-dimensional collisions.'],['Room size: minimum or recommendation?','Read the evidence precisely.','A published comfort recommendation is not necessarily a technical minimum. Sensor mounting ranges are another category entirely. The prototype stores these separately.','Trackman publishes room guidance for iO and Trackman 4; Uneekor provides EYE XO model documentation. Where a model’s requirement is not verified, the application displays insufficient data instead of assigning a universal room minimum.','Get confirmation for the exact configuration. Ceiling drops, screen setbacks, frame depth and the tallest golfer can change the practical result.'],['Projectors and impact screens','Geometry before brightness claims.','The BenQ AH700ST has a published 0.69–0.83 throw ratio. Lens-to-screen distance equals image width multiplied by the throw ratio; use the intended image width, not the enclosure’s external width.','Aspect ratio, lens offset, mount height, shadows, light levels and ball protection still matter. A 16:9 image and 4:3 screen need an explicit fitting decision.','Check projector placement against the manufacturer’s calculator and installer guidance. The prototype’s throw check is only one part of optical design.'],['Buying with confidence','From research to a written scope.','Before paying a seller, verify current price, exact equipment, warranty coverage, dealer authorization, shipping, tax, installation, software and return exclusions.','Custom builds, deposits, financing and phone orders can follow different processes. For this working preview, links are ordinary links and no approved commission relationship is implied.','We have not performed hands-on testing. Use the linked original sources and submit a correction if a technical detail has changed.']];
function journal(){return `${heading('The journal','Considered decisions.<br>Better rooms.','Original research-based guidance for the home, the technology and the game. No hands-on testing is claimed.')}<section class="section" style="padding-top:10px"><div class="grid">${guides.map((g,i)=>`<a href="#guide-${i}" class="card guide">${[0,3,6].includes(i)?editorialArt({0:'room-planning',3:'studio-details',6:'golf-lounge'}[i]):''}<span class="number">${String(i+1).padStart(2,'0')}</span><h3>${g[0]}</h3><p>${g[1]}</p><span class="text-link">Read the guide →</span></a>`).join('')}</div></section>`}
function article(i){let g=guides[i];if(!g)return journal();return `${heading('The journal / Research-based · Oct 20, 2026',g[0],g[1])}<article class="article">${g.slice(2).map(p=>`<p>${p}</p>`).join('')}<h2>Your next step</h2><div class="toolbar"><a class="button" href="#planner">Apply it to your room →</a><a class="text-link" href="#sources">Review original sources</a></div><p class="small">Editorial method: manufacturer documentation and merchant research. No firsthand testing, fabricated reviews or performance scores. This is not professional installation advice.</p><a class="text-link" href="#contact">Suggest a correction →</a></article>`}
function sourcesPage(){return `${heading('The evidence library','Know what is known.','Sources checked October 20, 2026. Values marked unknown have not been verified. Sources can change; this is a research snapshot, not a live feed.')}<section class="section" style="padding-top:10px"><div class="grid">${Golf.products.map(p=>`<div class="card"><div class="eyebrow">${p.brand} / ${p.verified}</div><h3>${p.name}</h3><p>${p.note}</p><a class="source" target="_blank" rel="noopener" href="${p.source}">Original source ↗</a><p class="small">Minimum room dimensions: ${p.min||'unknown'}<br>Price: unknown · Warranty: verify<br>Hardware performance not independently tested</p></div>`).join('')}<div class="card"><h3>BenQ AH700ST</h3><p>Published throw ratio: 0.69–0.83. 16:9 projector; screen fitting and mounting need confirmation.</p><a class="source" target="_blank" rel="noopener" href="https://www.benq.com/en-us/projector/golf/ah700st.html">Manufacturer source ↗</a></div></div><h2 style="margin-top:40px">Manufacturer coverage roadmap</h2><p>Full Swing, Garmin, Bushnell Golf, TruGolf, ProTee, Rapsodo, Epson and Fiberbuilt remain research leads. Technical records, current prices, software tiers, warranty and consumer-support evidence are not yet verified for their models. They are not recommended as validated configurations.</p><div class="notice">The research library is deliberately conservative. A source link is evidence provenance, not proof that every specification for a product has been verified.</div></section>`}
function about(){return `${heading('Our approach','An independent perspective.<br>A more considered studio.','The Golf Atelier is a provisional consumer identity for Many Faces Golf, a Many Faces Online project.')}<section class="section split"><div><h2>Fit comes first.</h2><p>We connect room planning, equipment research, configuration, seller scope and long-term costs. The aim is to make a complex purchase easier to understand across brands and merchants.</p><p>Our compatibility rules use published model-specific constraints. Recommendations explain tradeoffs; affiliate compensation never changes a technical requirement.</p><h3>How we research</h3><p>We prioritize manufacturer manuals and official technical pages, then merchant program disclosures. Unknown data remains visible. We do not imply independent lab tests or firsthand product use.</p></div><div class="panel"><h3>Transparent status</h3><p>Private functional prototype. No inventory, checkout, live affiliate network, paid earnings, automated outreach or production Control Center connection.</p><p>Final branding, DBA, domain, legal identity disclosures and public launch require founder approval.</p><h3>Brand directions</h3><p><b>The Golf Atelier</b> — architectural and considered.<br><b>Private Fairway</b> — a personal retreat.<br><b>The Studio Green</b> — contemporary and approachable.</p><p class="small">Working names only. No trademark or domain availability claim. Brand text remains configurable in source.</p></div></section>`}
function policies(){return `${heading('Policies & transparency','Clear expectations.','Prototype policies for review before any public launch.')}<article class="article"><h2>Affiliate disclosure</h2><p>No affiliate program is active for this prototype. Outbound links are ordinary merchant or manufacturer links. In a future approved affiliate relationship, qualifying purchases may earn the business a commission, and relevant links must be disclosed.</p><h2>Privacy</h2><p>Plans and optional demonstration events are stored only in this browser. No account, analytics provider, marketing pixel, email or SMS service is connected. Hosting providers may process ordinary request logs under their own policies. Clear local data below or export your plan for backup.</p><p>To compare two versions of this page fairly, this browser keeps a random visitor number. It is not linked to your name or email, it is never sent to us, and it only decides which version you see. If you follow a merchant link, the link may note which version you saw, never the number itself. Clearing site data removes it.</p><label class="check"><input id="consent" type="checkbox" ${consent?'checked':''}> Allow local-only demonstration referral events</label><button id="clear-events" class="secondary">Clear local event history</button> <button id="clear-all" class="secondary">Clear all golf planner data</button><h2>Terms of use</h2><p>This tool provides research and illustrative planning. It does not certify safe installation or offer professional engineering, electrical or architectural services. Verify equipment, quoted prices, merchant policies and all clearances before purchase. Purchases and support are handled by the seller.</p><h2>Contact and corrections</h2><p>The correction form prepares an exportable report. It does not send a message. A verified business contact destination and retention policy must be configured before public launch.</p><h2>Accessibility</h2><p>Keyboard-accessible forms, semantic tables, text explanations alongside SVG plans and responsive layouts are included. Full assistive-technology auditing remains outstanding.</p></article>`}
function contact(){return `${heading('Contact & corrections','Help keep the details accurate.','Prepare a correction report for the founder. This prototype does not send messages or promise a consultation service.')}<section class="section split"><form id="correction" class="panel"><label class="field">Topic<select id="correction-topic"><option>Product specification</option><option>Merchant listing</option><option>Compatibility rule</option><option>Accessibility</option><option>General inquiry</option></select></label><label class="field">Page or product<input id="correction-product" required maxlength="150"></label><label class="field">What should change?<textarea id="correction-text" required maxlength="4000" rows="6"></textarea></label><label class="field">Evidence URL (optional)<input id="correction-url" type="url"></label><button type="submit">Prepare correction file</button><p class="small">Downloaded to your device, not submitted. No email or personal household information is requested.</p></form><div><h2>Good evidence makes better advice.</h2><p>Include the exact model, the claim you believe needs review and a manufacturer source when available.</p><p>Do not include your home address, floor plan with personal identifiers, financial information or other sensitive details.</p></div></section>`}
function render(){let route=location.hash.slice(1)||'home';let html=route==='home'?home():route==='studios'?heading('The collection','A studio for the way you play.','Curated directions, not pre-certified equipment bundles. Configure the details for your space.')+`<section class="section grid">${studios()}</section>${studioFilm()}`:route==='shop'?shop():route==='planner'?planner():route==='builder'?builder():route==='compare'?comparison():route==='cost'?costPage():route==='saved'?savedPage():route==='journal'?journal():route.startsWith('guide-')?article(+route.slice(6)):route==='offers'?heading('Merchant options','Know exactly what you are buying.','No promotions are currently verified. There are no discount or availability guarantees in this prototype.')+`<section class="section">${merchantTable()}<p class="small">Offer states supported: Verified, Pending review, Expired, Unavailable, Unverified. A reviewed page does not establish live stock or affiliate eligibility.</p></section>`:route==='sources'?sourcesPage():route==='about'?about():route==='policies'?policies():route==='contact'?contact():home();$('#main').innerHTML=filmPreviewNav()+html+contextualFilms(route);document.title=(route==='home'?'The Golf Atelier':route.replaceAll('-',' ')+' | The Golf Atelier');bind(route);bindFilms();count();document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.hash===location.hash?'page':'false'));}
function updateLive(route){if($('#room-view'))$('#room-view').innerHTML=roomSVG(state.room,product());if($('#validation'))$('#validation').innerHTML=validationHTML(Golf.validate(state.room,product(),state.config));if($('#cost-results'))$('#cost-results').innerHTML=costResults(Golf.costs(state.cost));if($('#budget-check')){let c=Golf.costs(state.cost);$('#budget-check').innerHTML=`<p class="notice">Current illustrative project allowance: ${money(c.initial)}. ${c.initial>state.room.budget?'Exceeds':'Within'} your budget. <a href="#cost" class="text-link">Edit costs</a></p>`}}
function bind(route){document.querySelectorAll('[data-key]').forEach(el=>el.addEventListener('input',()=>{let k=el.dataset.key;if(route==='cost'){let n=+el.value;if(!Number.isFinite(n)||n<0){el.setCustomValidity('Enter a nonnegative amount');return}el.setCustomValidity('');state.cost[k]=n}else if(k==='monitor'){state.config.monitor=el.value;render();$('#main [data-key="monitor"]')?.focus();return}else if(route==='builder'){state.config[k]=el.value}else{if(k==='units'){state.room.units=el.value;render();return}if(k==='projectorPreference')state.room.projector=el.value;else if(k==='orientation'){if(state.room.orientation!==el.value)[state.room.w,state.room.d]=[state.room.d,state.room.w];state.room.orientation=el.value;render();return}else if(['w','d','h','ball','behind','screenW','sensor','throw','offset','budget','obstacleX','obstacleY'].includes(k)){let n=+el.value;if(!Number.isFinite(n)){return}state.room[k]=state.room.units==='m'&&['w','d','h','ball','behind','screenW','sensor','throw'].includes(k)?n/.3048:n}else state.room[k]=el.value}updateLive(route)}));
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{state.config.monitor=b.dataset.preset;state.config.software=product().software[0];location.hash='builder';if(route==='builder')render()});document.querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>{let id=b.dataset.compare;if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length<4)compare.push(id);else{toast('Compare up to four models. Remove one first.');return}render()});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>b.dataset.action==='save'?savePlan():download('my-golf-studio.json',plan()));
if($('#obstacle'))$('#obstacle').onchange=e=>{state.room.obstacle=e.target.checked;updateLive(route)};if($('#apply-inches'))$('#apply-inches').onclick=()=>{let feet=+$('#feet').value,inch=+$('#inches').value;if(feet<0||inch<0||inch>=12){toast('Enter nonnegative feet and inches from 0 to 11.');return}state.room[$('#inch-dim').value]=feet+inch/12;render()};
if($('#search')){const filter=()=>{$('#catalog').innerHTML=cards(Golf.products.filter(p=>(p.brand+' '+p.name+' '+p.tech).toLowerCase().includes($('#search').value.toLowerCase())&&(!$('#filter').value||p.mount===$('#filter').value)));$('#catalog').querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{state.config.monitor=b.dataset.preset;state.config.software=product().software[0];location.hash='builder'});$('#catalog').querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>{let id=b.dataset.compare;if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length<4)compare.push(id);else{toast('Four models maximum');return}b.textContent=compare.includes(id)?'✓ In comparison':'+ Compare'});if(!$('#catalog').children.length)$('#catalog').innerHTML='<div class="empty wide">No matching products. Try another brand or installation style.</div>'};$('#search').oninput=filter;$('#filter').onchange=filter}
if($('#reset-compare'))$('#reset-compare').onclick=()=>{compare=['eye-xo','trackman-io','mevo-plus'];render()};document.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{let p=saved.find(x=>x.id===b.dataset.load);state={room:{...defaults.room,...p.room},config:{...defaults.config,...p.config},cost:{...defaults.cost,...p.cost}};location.hash='planner'});document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{saved=saved.filter(x=>x.id!==b.dataset.delete);persist('golf-plans',saved);render()});document.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>{let p=JSON.parse(JSON.stringify(saved.find(x=>x.id===b.dataset.duplicate)));p.id=localID();p.name+=' (copy)';saved.push(p);persist('golf-plans',saved);render()});
if($('#import-plan'))$('#import-plan').onchange=async e=>{try{let file=e.target.files[0];if(file.size>100000)throw Error();let p=cleanPlan(JSON.parse(await file.text()),true);if(!p)throw Error();p.id=localID();p.name='Imported studio';p.created_at=new Date().toISOString();saved.push(p);persist('golf-plans',saved);render();toast('Plan imported locally.')}catch{toast('Could not import. Choose a valid Golf Atelier plan JSON.')}};
if($('#consent'))$('#consent').onchange=e=>{consent=e.target.checked;persist('golf-consent',consent)};if($('#clear-events'))$('#clear-events').onclick=()=>{events=[];persist('golf-events',[]);toast('Local events cleared.')};if($('#clear-all'))$('#clear-all').onclick=()=>{try{['golf-plans','golf-events','golf-consent','golf-plans-unreadable'].forEach(k=>localStorage.removeItem(k))}catch{toast('Browser storage is unavailable; nothing was stored to clear.')}saved=[];events=[];consent=false;state=JSON.parse(JSON.stringify(defaults));render();toast('Local golf data cleared.')};
document.querySelectorAll('[data-referral]').forEach(a=>a.onclick=()=>{if(consent){let o=offers.find(o=>o.id===a.dataset.referral),now=Date.now();if(!events.some(e=>e.offer_id===o.id&&now-Date.parse(e.at)<1800000)){events.push({event_id:localID(),site_id:'many-faces-golf',offer_id:o.id,product_id:o.product,merchant_id:o.merchant,at:new Date(now).toISOString(),kind:'ordinary_link_demo',consent:true});persist('golf-events',events)}}});if($('#correction'))$('#correction').onsubmit=e=>{e.preventDefault();download('golf-correction.json',{site_id:'many-faces-golf',type:$('#correction-topic').value,subject:$('#correction-product').value,text:$('#correction-text').value,url:$('#correction-url').value,created_at:new Date().toISOString(),submission_state:'not_sent'});toast('Correction file prepared. It has not been sent.')};updateLive(route);}
/* Your Private Shortlist (mf-shortlist.js, D-026 in mfo-mLintelligence): the shared Keep panel reads and restores saved studio plans here. */
window.MF_SHORTLIST={snapshot:()=>{const plans=saved.filter(p=>cleanPlan(p));return plans.length?{plans}:null},restore:data=>{const plans=Array.isArray(data?.plans)?data.plans.map(p=>cleanPlan(p)?p:null).filter(Boolean):[];if(!plans.length)return;const have=new Set(saved.map(p=>p.id));for(const p of plans)if(!have.has(p.id))saved.push(p);persist('golf-plans',saved);count();toast('Your studio plans are back on this device.')},open:()=>{if(location.hash==='#saved')render();else location.hash='#saved'},ids:()=>[...new Set(saved.map(p=>p.config?.monitor).filter(Boolean))]};
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);revealFilmJump()});render();

// Phone swipe cue: arrows and dots under the swipe row so it is obvious the cards scroll sideways. Hidden on desktop by CSS.
(function(){if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;var SEL='.grid.swipe-row';
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
/* Many Faces motion: every video on the page plays by itself, silently and on a loop, when it
   scrolls into view, and pauses when it leaves. Sources marked data-src load only then.
   Visitors who ask for reduced motion or data saving get the still picture and the video's
   own controls instead. A button marked data-mf-motion-toggle pauses and resumes the video it
   names in aria-controls, and a video the visitor paused stays paused.
   A video marked data-mf-motion="off" is left to its own page code. */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined' || !document.addEventListener || window.MFMotion) return;
  var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var still = function () { return reduced.matches || saveData; };
  var seen = new WeakSet();
  var held = new WeakSet(); // paused by the visitor

  function load(v) {
    if (v.dataset.mfLoaded) return;
    v.dataset.mfLoaded = '1';
    var changed = false;
    v.querySelectorAll('source[data-src]').forEach(function (s) {
      if (!s.getAttribute('src')) { s.src = s.dataset.src; changed = true; }
    });
    if (!v.getAttribute('src') && !v.querySelector('source[src]') && v.dataset.src) {
      var mp4 = v.canPlayType('video/mp4; codecs="avc1.42E01E"');
      v.src = mp4 || !v.dataset.webm ? v.dataset.src : v.dataset.webm;
      changed = false;
    }
    if (changed) v.load();
  }

  function play(v) {
    if (still() || held.has(v) || document.hidden) return;
    load(v);
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.removeAttribute('hidden');
    // A film people watch gets the browser's own controls to pause it; a background film
    // (aria-hidden) is paused with its own Pause motion button.
    if (!v.hasAttribute('aria-hidden') && !v.closest('a,button') && !document.querySelector('[data-mf-motion-toggle][aria-controls="' + v.id + '"]'))
      v.controls = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          v.dataset.mfVisible = e.isIntersecting ? '1' : '';
          if (e.isIntersecting) play(v);
          else if (!v.paused) v.pause();
        });
      }, { threshold: 0.25 })
    : null;

  function sync(v) {
    document.querySelectorAll('[data-mf-motion-toggle][aria-controls="' + v.id + '"]').forEach(function (b) {
      b.hidden = still();
      b.setAttribute('aria-pressed', v.paused ? 'true' : 'false');
      b.textContent = v.paused ? (b.dataset.playLabel || 'Play motion') : (b.dataset.pauseLabel || 'Pause motion');
    });
  }

  function watch(v) {
    if (seen.has(v) || v.dataset.mfMotion === 'off') return;
    seen.add(v);
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.addEventListener('playing', function () { v.classList.add('is-playing'); sync(v); });
    v.addEventListener('pause', function () { sync(v); });
    v.addEventListener('error', function () {
      v.classList.remove('is-playing');
      // An MP4 the browser cannot load falls back to the WebM copy once.
      var webm = v.dataset.webm;
      if (webm && !v.dataset.mfTriedWebm && v.getAttribute('src') && v.getAttribute('src') !== webm) {
        v.dataset.mfTriedWebm = '1';
        v.src = webm;
        if (v.dataset.mfVisible) play(v);
      }
    }, true);
    if (io) io.observe(v);
    else play(v);
    if (v.id) sync(v);
  }

  function scan(root) {
    if (root.tagName === 'VIDEO') watch(root);
    if (root.querySelectorAll) root.querySelectorAll('video').forEach(watch);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-mf-motion-toggle]');
    if (!b) return;
    var v = document.getElementById(b.getAttribute('aria-controls'));
    if (!v) return;
    if (v.paused) { held.delete(v); play(v); }
    else { held.add(v); v.pause(); }
    sync(v);
  });

  document.addEventListener('visibilitychange', function () {
    document.querySelectorAll('video').forEach(function (v) {
      if (!seen.has(v)) return;
      if (document.hidden) v.pause();
      else if (v.dataset.mfVisible) play(v);
    });
  });

  if (reduced.addEventListener)
    reduced.addEventListener('change', function () {
      document.querySelectorAll('video').forEach(function (v) {
        if (!seen.has(v)) return;
        if (still()) v.pause();
        else if (v.dataset.mfVisible) play(v);
        if (v.id) sync(v);
      });
    });

  function start() {
    scan(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  window.MFMotion = { scan: scan };
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();

})();
