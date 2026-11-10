(function(root){
// Requirements cross a trust boundary (form, restored browser storage, future imports). Anything that is not a finite, positive number is unknown, never zero.
function measure(v){v=v===''||v==null?null:Number(v);return Number.isFinite(v)&&v>0?v:null;}
function normalize(r){r=r&&typeof r==='object'?r:{};const paths=['home','travel','winding','gift','growth'],moves=['unknown','automatic','manual','quartz','mixed'];let count=Math.floor(Number(r.count)),growth=Math.floor(Number(r.growth)),budget=r.budget===''||r.budget==null?null:Number(r.budget);return {path:paths.includes(r.path)?r.path:'home',movement:moves.includes(r.movement)?r.movement:'unknown',count:Number.isFinite(count)&&count>=1?Math.min(count,100):1,budget:Number.isFinite(budget)&&budget>=0?budget:null,width:measure(r.width),wrist:measure(r.wrist),shelf:measure(r.shelf),growth:Number.isFinite(growth)&&growth>0?Math.min(growth,100):0};}
// Chosen-offer policy: the product's declared offerId, else the first offer for that product. Undefined means no usable offer.
function offerFor(p,offers){return offers.find(o=>o.id===p.offerId&&o.productId===p.id)||offers.find(o=>o.productId===p.id);}
// Keep only products that have a usable HTTPS offer; report everything dropped so it reaches the owner instead of crashing the page.
function validateCatalog(data){const problems=[],products=[],offers=[];const d=data&&typeof data==='object'?data:{};const rawOffers=Array.isArray(d.offers)?d.offers:[],rawProducts=Array.isArray(d.products)?d.products:[];if(!Array.isArray(d.products))problems.push('Catalog has no products list.');rawOffers.forEach(o=>{if(o&&typeof o.id==='string'&&typeof o.productId==='string'&&typeof o.url==='string'&&o.url.startsWith('https://')&&(o.price==null||(Number.isFinite(o.price)&&o.price>=0)))offers.push({...o,availability:String(o.availability??'Confirm at merchant'),checked:String(o.checked??'Unknown')});else problems.push('Offer '+(o&&o.id)+' is malformed and was skipped.');});const seen=new Set();rawProducts.forEach(p=>{if(!p||typeof p.id!=='string'||seen.has(p.id)||!Number.isFinite(p.capacity)){problems.push('Product '+(p&&p.id)+' is malformed or duplicated and was skipped.');return;}seen.add(p.id);if(!offerFor(p,offers)){problems.push('Product '+p.id+' has no usable merchant offer and was hidden.');return;}products.push(p);});return {products,offers,problems};}
function assess(p,r){r=normalize(r);let issues=[],unknown=['Case thickness, lug-to-lug, lid clearance and adjacent-watch separation need confirmation.'];if(r.width&&p.maxWidthMm&&(p.maxWidthExclusive?r.width>=p.maxWidthMm:r.width>p.maxWidthMm))issues.push('Case width exceeds the published limit.');if(r.wrist&&p.cushionMinMm&&r.wrist<p.cushionMinMm)issues.push('Closed bracelet is smaller than the documented compressed cushion.');if(r.shelf&&p.dimensionsMm&&p.dimensionsMm[0]>r.shelf)issues.push('Exterior width exceeds available shelf width.');if(r.width&&!p.maxWidthMm)unknown.push('No documented watch-width limit.');if(r.wrist&&!p.cushionMinMm)unknown.push('Closed-bracelet cushion fit is unknown.');if(r.shelf&&!p.dimensionsMm)unknown.push('Exterior width is unknown.');return {eligible:!issues.length,status:issues.length?'Does not match documented constraints':'More information required',issues,unknown};}
function recommend(products,offers,r){r=normalize(r);let winding=r.path==='winding'&&['automatic','mixed','unknown'].includes(r.movement);let category=r.path==='travel'?'Travel':winding?'Winders':'Boxes';let count=r.count+(r.path==='growth'?r.growth:0);return products.map(p=>({p,o:offerFor(p,offers),fit:assess(p,r)})).filter(x=>x.o&&x.p.category===category&&x.p.capacity>=count&&x.fit.eligible&&(r.budget==null||(x.o.price!=null&&x.o.price<=r.budget))&&!String(x.o.availability).startsWith('Reported unavailable')).sort((a,b)=>(a.p.capacity-count)-(b.p.capacity-count)||(a.o.price??Infinity)-(b.o.price??Infinity));}
const api={assess,recommend,normalize,offerFor,validateCatalog};root.CollectorRules=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

window.MFS_RESEARCH={"products":[{"id":"wolf-windsor","brand":"WOLF","name":"Windsor 10 Piece Watch Box","category":"Boxes","capacity":10,"material":"Vegan leather","dimensionsMm":[317.5,241.3,101.6],"maxWidthMm":52,"cushionMinMm":null,"notes":"Locking glass cover; brown/orange. Case-width limit is not a complete fit guarantee.","offerId":"wolf-windsor-direct"},{"id":"wolf-heritage8","brand":"WOLF","name":"Heritage 8 Piece Watch Box","category":"Boxes","capacity":8,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Eight-watch home storage. Interior measurements require confirmation.","offerId":"wolf-heritage8-direct"},{"id":"wolf-british8","brand":"WOLF","name":"British Racing 8 Piece Watch Box","category":"Boxes","capacity":8,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Collection-page price; choose exact finish and confirm price at merchant.","offerId":"wolf-british8-direct"},{"id":"wolf-british10","brand":"WOLF","name":"British Racing 10 Piece Watch Box","category":"Boxes","capacity":10,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Collection-page listing; exact product and finish selection at merchant.","offerId":"wolf-british10-direct"},{"id":"wolf-axis","brand":"WOLF","name":"Axis 10 Piece Watch Box with Drawer","category":"Boxes","capacity":10,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Drawer adds accessory storage; collection-page listing.","offerId":"wolf-axis-direct"},{"id":"wolf-macassar1","brand":"WOLF","name":"Heritage Macassar Single Watch Winder","category":"Winders","capacity":1,"material":"Macassar finish","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Confirm the exact movement settings and current power specification.","offerId":"wolf-macassar1-direct"},{"id":"wolf-macassar2","brand":"WOLF","name":"Heritage Macassar Double Winder with Storage","category":"Winders","capacity":2,"material":"Macassar finish","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Two winding modules; extra storage capacity not counted here.","offerId":"wolf-macassar2-direct"},{"id":"wolf-macassar4","brand":"WOLF","name":"Heritage Macassar 4 Piece Watch Winder","category":"Winders","capacity":4,"material":"Macassar finish","dimensionsMm":[273.05,165.1,336.55],"maxWidthMm":52,"cushionMinMm":null,"notes":"AC powered; 900 TPD pre-programmed; direction options. Confirm movement compatibility.","offerId":"wolf-macassar4-direct"},{"id":"wolf-double","brand":"WOLF","name":"Heritage Double Watch Winder","category":"Winders","capacity":2,"material":"Vegan leather","dimensionsMm":[190.5,260.35,158.75],"maxWidthMm":52,"cushionMinMm":null,"notes":"AC or battery; 900 TPD pre-programmed; batteries excluded. Confirm movement compatibility.","offerId":"wolf-double-direct"},{"id":"wolf-earth","brand":"WOLF","name":"Earth Single Watch Winder","category":"Winders","capacity":1,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"App-controlled winding. Settings must match the exact watch movement.","offerId":"wolf-earth-direct"},{"id":"rothwell10","brand":"Rothwell","name":"10 Slot Watch Box · Black / Grey","category":"Boxes","capacity":10,"material":"PU leather / wood","dimensionsMm":[342.9,215.9,101.6],"maxWidthMm":60,"cushionMinMm":null,"notes":"Manufacturer states space for 60 mm watches side by side; thickness and bracelet clearance remain unknown.","offerId":"rothwell10-direct"},{"id":"rothwell-drawer","brand":"Rothwell","name":"10 Slot Watch Box with Drawer · Black / Grey","category":"Boxes","capacity":10,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Accessory drawer; confirm dimensions for this exact model.","offerId":"rothwell-drawer-direct"},{"id":"rothwell-travel","brand":"Rothwell","name":"2 Watch Travel Case · Carbon","category":"Travel","capacity":2,"material":"Leather exterior (merchant claim)","dimensionsMm":null,"maxWidthMm":55,"cushionMinMm":155.575,"notes":"Published exterior dimensions conflict. Cushion compresses to 6⅛ in circumference; confirm closed-bracelet fit.","offerId":"rothwell-travel-direct","maxWidthExclusive":true},{"id":"rapport-evo","brand":"Rapport London","name":"EVO Single Watch Winder · Walnut","category":"Winders","capacity":1,"material":"Walnut finish","dimensionsMm":[120,146,120],"maxWidthMm":null,"cushionMinMm":null,"notes":"Nine rotation settings; mains or battery. Noise has not been independently measured.","offerId":"rapport-evo-direct"},{"id":"rapport-heritage","brand":"Rapport London","name":"Heritage Ten Watch Box · Burr Walnut","category":"Boxes","capacity":10,"material":"Wood / suede lining","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Lock and key, adjustable cushions. A lockable box is not a rated safe.","offerId":"rapport-heritage-direct"},{"id":"hh-collector","brand":"Holme & Hadfield","name":"The Collector 3.0 · Walnut","category":"Boxes","capacity":13,"material":"Wood / acrylic cover","dimensionsMm":[393,152,152],"maxWidthMm":null,"cushionMinMm":null,"notes":"Seven display positions plus six drawer slots. Black 2.0 differs. Stock statements conflict; confirm before ordering.","offerId":"hh-collector-direct"},{"id":"rapport-roll","brand":"Rapport London","name":"Berkeley Single Watch Roll · Black","category":"Travel","capacity":1,"material":"See merchant","dimensionsMm":null,"maxWidthMm":null,"cushionMinMm":null,"notes":"Removable cushion; last source showed sold out. Check availability and US price.","offerId":"rapport-roll-direct"}],"offers":[{"id":"wolf-windsor-direct","productId":"wolf-windsor","merchant":"WOLF","url":"https://www.wolf1834.com/us/windsor-10-piece-watch-box/windsorbrownorange","price":335,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-heritage8-direct","productId":"wolf-heritage8","merchant":"WOLF","url":"https://www.wolf1834.com/us/heritage-8-piece-watch-box/black","price":155,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-british8-direct","productId":"wolf-british8","merchant":"WOLF","url":"https://www.wolf1834.com/us/watch-boxes","price":625,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-british10-direct","productId":"wolf-british10","merchant":"WOLF","url":"https://www.wolf1834.com/us/watch-boxes/10-piece-watch-boxes","price":669,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-axis-direct","productId":"wolf-axis","merchant":"WOLF","url":"https://www.wolf1834.com/us/watch-boxes","price":695,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-macassar1-direct","productId":"wolf-macassar1","merchant":"WOLF","url":"https://www.wolf1834.com/us/roadster-single-winder/macassarblack","price":665,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-macassar2-direct","productId":"wolf-macassar2","merchant":"WOLF","url":"https://www.wolf1834.com/us/roadster-double-winder-with-storage/macassarblack","price":1379,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-macassar4-direct","productId":"wolf-macassar4","merchant":"WOLF","url":"https://www.wolf1834.com/us/roadster-4-piece-winder/macassarblack","price":2229,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-double-direct","productId":"wolf-double","merchant":"WOLF","url":"https://www.wolf1834.com/us/heritage-double-winder/black","price":1049,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"wolf-earth-direct","productId":"wolf-earth","merchant":"WOLF","url":"https://www.wolf1834.com/us/earth-single-watch-winder/coffee","price":1165,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Add to cart shown; stock alert also shown, confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rothwell10-direct","productId":"rothwell10","merchant":"Rothwell","url":"https://www.rothwellsf.com/products/10-slot-watch-box-black-black","price":70,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rothwell-drawer-direct","productId":"rothwell-drawer","merchant":"Rothwell","url":"https://www.rothwellsf.com/products/10-slot-watch-box-with-drawer-black-grey","price":125,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rothwell-travel-direct","productId":"rothwell-travel","merchant":"Rothwell","url":"https://www.rothwellsf.com/products/2-watch-travel-case-carbon","price":38,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rapport-evo-direct","productId":"rapport-evo","merchant":"Rapport London","url":"https://rapportlondon.com/en-us/products/evo-single-watch-winder-walnut","price":560,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rapport-heritage-direct","productId":"rapport-heritage","merchant":"Rapport London","url":"https://rapportlondon.com/en-us/products/heritage-ten-watch-box-burr-walnut","price":1395,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Confirm at merchant","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"hh-collector-direct","productId":"hh-collector","merchant":"Holme & Hadfield","url":"https://www.holmeandhadfield.com/products/the-collector","price":325,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Reported unavailable: merchant showed Out of stock on 2026-10-28; recheck","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"},{"id":"rapport-roll-direct","productId":"rapport-roll","merchant":"Rapport London","url":"https://rapportlondon.com/products/berkeley-single-watch-roll-black","price":null,"currency":"USD","priceType":"published reference; confirm exact variant","checked":"2026-10-28","availability":"Reported unavailable: sold out at merchant on 2026-10-28; recheck","affiliateStatus":"Not approved / ordinary link","imagePermission":"Not granted; exact-model photography omitted"}]};
/* Shopify adapter for The Collector Edit site script (build.mjs puts it between logic.js and app.js).
   Catalog: the research records from site/dist/catalog.json (MFS_RESEARCH, bundled by build.mjs), narrowed to the
   products published in the store (snippets/store-data). With no store products yet, all research records show, so the
   theme works before the CSV import. A store title and vendor win over the research record. Products that exist only in
   Shopify have no researched merchant offer, so they appear in the product library and search but not in the
   interactive collection or finder. */
window.MFS_CATALOG = function () {
  const research = window.MFS_RESEARCH || {products: [], offers: []};
  const store = Array.isArray(window.MFS_STORE) ? window.MFS_STORE : [];
  if (!store.length) return research;
  const byHandle = new Map(store.map(s => [s.handle, s]));
  const products = research.products.filter(p => byHandle.has(p.id)).map(p => {
    const s = byHandle.get(p.id);
    return {...p, name: s.title || p.name, brand: s.vendor || p.brand, url: s.url || null};
  });
  return {products, offers: research.offers};
};

/* The site script fetches catalog.json; in the theme the catalog comes from the store instead. */
window.MFS_FETCH_CATALOG = async () => ({ok: true, json: async () => window.MFS_CATALOG()});

/* After the site script has loaded the catalog. Links from other theme pages arrive with:
   ?model=<handle> (product pages) opens that piece's details; ?saved=1 opens the saved plan;
   ?info=about|disclosure opens that footer dialog. */
window.MFS_READY = function ({details, showSaved, has}) {
  const q = new URLSearchParams(location.search);
  const model = q.get('model'), info = q.get('info');
  if (model && has(model)) details(model);
  else if (q.get('saved') === '1') showSaved();
  else if (info === 'about' || info === 'disclosure') document.getElementById(info + 'Btn')?.click();
};

/* Pages other than Home share the header and footer without the site script: their buttons go to Home. */
document.addEventListener('click', e => {
  if (document.getElementById('products')) return;
  const home = window.MFS_ROOT || '/';
  if (e.target.closest('#savedBtn')) location.href = home + '?saved=1';
  else if (e.target.closest('#aboutBtn')) location.href = home + '?info=about';
  else if (e.target.closest('#disclosureBtn')) location.href = home + '?info=disclosure';
});

(function(){if(!document.getElementById('products'))return;
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

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-watch-collector","container":"#products","card":":scope > .product","idSelector":"[data-save]","idAttribute":"data-save","facetSelector":".brand","sortSelector":"#sort","curatedValues":["edit"],"experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-01","end":"2027-04-30"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
document.addEventListener('click', e => {
  const brandLink = e.target.closest('[data-shop-brand]');
  if (!brandLink || !products.length) return;
  const cleared = [$('#search').value && 'search', $('#capacity').value !== '0' && 'capacity', $('#budget').value && 'price'].filter(Boolean);
  category = 'All';
  $('#search').value = '';
  $('#capacity').value = '0';
  $('#budget').value = '';
  $('#brand').value = brandLink.dataset.shopBrand;
  render();
  if (cleared.length) $('#resultCount').textContent += ` · Showing every ${brandLink.dataset.shopBrand} piece; your ${cleared.join(', ')} filter${cleared.length > 1 ? 's were' : ' was'} cleared.`;
});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let products=[],offers=[],category='All',saved=[],comp=[],requirements=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=n=>n==null?'Check price':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);const offer=p=>CollectorRules.offerFor(p,offers);const modal=$('#modal');
function restore(){try{saved=JSON.parse(localStorage.getItem('collector-saved')||'[]');requirements=JSON.parse(localStorage.getItem('collector-requirements')||'null');if(!Array.isArray(saved))saved=[];saved=saved.filter(id=>typeof id==='string');requirements=requirements&&typeof requirements==='object'&&!Array.isArray(requirements)?CollectorRules.normalize(requirements):null;}catch{saved=[];requirements=null;}}
function persist(){try{localStorage.setItem('collector-saved',JSON.stringify(saved));localStorage.setItem('collector-requirements',JSON.stringify(requirements));}catch{toast('Browser storage is unavailable; selections will last for this visit only.');}$('#savedCount').textContent=saved.length;}
let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3200);}
function openModal(html){$('#modalBody').innerHTML=html;if(!modal.open)modal.showModal();}$('#closeModal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
function card(p,fit){const o=offer(p);return `<article class="product"><div class="product-top"><span class="brand">${esc(p.brand)}</span><button class="save ${saved.includes(p.id)?'on':''}" data-save="${esc(p.id)}" aria-label="${saved.includes(p.id)?'Unsave':'Save'} ${esc(p.name)}" aria-pressed="${saved.includes(p.id)}">${saved.includes(p.id)?'♥':'♡'}</button></div><h3>${esc(p.name)}</h3><p class="specs">${p.capacity} ${p.category==='Winders'?(p.capacity===1?'winding position':'winding positions'):'watch capacity'} · ${esc(p.category)}<br>${esc(p.material)}</p><p class="price">${money(o.price)} <small>${o.price!=null?'reference price':''}</small></p>${fit?`<p class="note">${esc(fit.status)}. ${esc(fit.unknown.join(' '))}</p>`:''}<p class="note">${o.availability.startsWith('Reported')?'Reported unavailable · check with merchant':'Confirm price & availability at merchant'}</p><p class="print-only">Reference checked ${esc(o.checked)} · ${esc(o.url)}</p><div class="product-bottom"><button data-product="${esc(p.id)}">Details & merchant ↗</button><label><input type="checkbox" data-compare="${esc(p.id)}" ${comp.includes(p.id)?'checked':''}>Compare</label></div></article>`;}
function render(){let list=products.filter(p=>{let o=offer(p);let b=$('#budget').value;return(category==='All'||p.category===category)&&(!$('#brand').value||p.brand===$('#brand').value)&&p.capacity>=Number($('#capacity').value)&&(b===''||(o.price!=null&&o.price<=Number(b)))&&`${p.brand} ${p.name} ${p.material}`.toLowerCase().includes($('#search').value.toLowerCase());});let sort=$('#sort').value;if(sort==='low')list.sort((a,b)=>(offer(a).price??Infinity)-(offer(b).price??Infinity));if(sort==='high')list.sort((a,b)=>(offer(b).price??-1)-(offer(a).price??-1));if(sort==='capacity')list.sort((a,b)=>b.capacity-a.capacity);$('#products').innerHTML=list.length?list.map(p=>card(p)).join(''):'<div class="empty"><h3>No pieces match these filters.</h3><p>Try another capacity or budget, or reset your filters.</p></div>';$('#resultCount').textContent=`${list.length} considered pieces`;$$('.tabs [data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===category));updateCompare();}
function updateCompare(){$('#compareBar').hidden=!comp.length;$('#compareCount').textContent=`${comp.length} of 3 selected`;$('#compareBtn').disabled=comp.length<2;}
function details(id){const p=products.find(p=>p.id===id),o=offer(p);const dim=p.dimensionsMm?`${p.dimensionsMm.map(n=>Number(n.toFixed(1))).join(' × ')} mm (W × D × H)<br>${p.dimensionsMm.map(n=>(n/25.4).toFixed(2)).join(' × ')} in (derived)`:'Not verified';const policy=p.brand==='WOLF'?'Exact pages reviewed state 14 working days to request return authorization; unused original packaging required, customer return shipping, possible 20% restocking fee. Five-year manufacturing-defect warranty requires registration. Confirm for this model.':p.brand==='Rothwell'?'Merchant states 30-day returns and 12-month warranty. Return shipping paid by customer except faults; original condition and packaging required.':p.brand==='Rapport London'?'Reviewed product pages state returns up to 30 days after purchase and a two-year guarantee. Confirm US shipping costs, duties, return costs and exclusions.':'Merchant states 30-day returns and lifetime warranty on most storage products; confirm exact variant, exclusions and shipping.';openModal(`<p class="eyebrow">${esc(p.brand)} / ${esc(p.category)}</p><h2>${esc(p.name)}</h2><p class="price">${money(o.price)} · USD reference price</p><p>${esc(p.notes)}</p><div class="details-list"><div><strong>Capacity</strong><br>${p.capacity} ${p.category==='Winders'?'winding positions':'watches'}</div><div><strong>Exterior dimensions</strong><br>${dim}</div><div><strong>Published case-width limit</strong><br>${p.maxWidthMm?(p.maxWidthExclusive?'Under ':'Up to ')+p.maxWidthMm+' mm (manufacturer claim)':'Unknown'}</div><div><strong>Cushion circumference minimum</strong><br>${p.cushionMinMm?p.cushionMinMm.toFixed(1)+' mm compressed (merchant claim)':'Unknown'}</div><div><strong>Availability</strong><br>${esc(o.availability)}</div><div><strong>Checked</strong><br>${o.checked} · not a live feed</div></div><h3>Fit deserves a closer look.</h3><p>Published width alone cannot establish physical fit. Confirm thickness, lug-to-lug length, closed-bracelet shape, cushion compressibility, lid clearance and adjacent-watch spacing. No product here has a verified physical-fit guarantee.</p>${p.category==='Winders'?'<p>Rotational winders are a convenience for suitable automatic watches. They do not wind quartz or manual-winding watches. Obtain settings for the exact reference and movement from the watch manufacturer. We have not measured noise or tested movement-health effects.</p>':''}<h3>Buying & service</h3><p>${esc(policy)}</p><p>Replacement cushions, delivery timing, return-shipping fees, restocking and personalization exclusions should be confirmed with the merchant. Lockable boxes are not rated safes.</p><a class="button mf-buy" href="${esc(o.url)}" target="_blank" rel="noopener noreferrer" data-outbound="${id}">Check price at ${esc(o.merchant)} ↗</a><button class="textlink" data-save="${id}" style="margin-left:20px">${saved.includes(id)?'Remove from saved':'Save this piece'}</button><p class="caption">${o.url.includes('/collections/')||o.url.endsWith('/watch-boxes')||o.url.endsWith('/10-piece-watch-boxes')?'This handoff opens a source collection; select the exact model and finish there. ':''}Ordinary merchant link; no affiliate tracking is active. Product photo omitted pending permission. Source: <a href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">official merchant page ↗</a></p>`);}
/* Your Private Shortlist (mf-shortlist.js, D-026 in mfo-mLintelligence): the shared Keep panel reads and restores saved pieces here. */
window.MF_SHORTLIST={snapshot:()=>saved.length?{saved:[...saved]}:null,restore:data=>{const ids=Array.isArray(data?.saved)?data.saved.filter(id=>typeof id==='string'&&products.some(p=>p.id===id)):[];if(!ids.length)return;saved=[...new Set([...saved,...ids])];persist();render();toast('Your collection shortlist is back on this device.')},open:()=>showSaved(),ids:()=>[...saved]};
function showSaved(){let list=products.filter(p=>saved.includes(p.id));openModal(`<p class="eyebrow">YOUR COLLECTION PLAN</p><h2>The pieces you are considering.</h2><p>Saved in this browser only. No account or cloud synchronization. Avoid including valuables, serial numbers or home-storage locations.</p>${requirements?`<p>Saved requirements: ${esc(requirements.path)}, ${esc(requirements.count)} watches, budget ${requirements.budget==null?'no limit':esc(money(requirements.budget))}. Unknown measurements remain unknown.</p>`:''}<div class="actions"><button class="button" id="exportPlan">Download plan ↓</button><button class="textlink" id="printPlan">Print plan</button><button class="textlink" id="erasePlan">Clear saved data</button></div><div class="product-grid">${list.length?list.map(p=>card(p)).join(''):'<div class="empty">Your shortlist is empty. Save a piece using the heart on its card.</div>'}</div><div class="mf-saved-page"></div>`);$('#exportPlan').onclick=exportPlan;$('#printPlan').onclick=()=>window.print();$('#erasePlan').onclick=()=>{saved=[];requirements=null;persist();$('#finderForm').reset();$('#finderMessage').textContent='';$('#finderResults').innerHTML='';render();showSaved();toast('Saved pieces and requirements cleared from this browser.');};}
function exportPlan(){const selected=products.filter(p=>saved.includes(p.id));const lines=['THE COLLECTOR EDIT — Collection plan','Created '+new Date().toLocaleDateString(),'Anonymous local plan. No physical fit guarantees.','Requirements: '+JSON.stringify(requirements??{}),'',...selected.flatMap(p=>{const o=offer(p);return[p.brand+' — '+p.name,money(o.price)+' USD reference; checked '+o.checked,p.notes,'Fit: More information required. Confirm cushion, bracelet, thickness, lid clearance and spacing.',o.url,''];})];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Collector_Edit_Plan.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function showCompare(){let list=comp.map(id=>products.find(p=>p.id===id));const rows=[['Brand',p=>p.brand],['Reference price',p=>money(offer(p).price)],['Capacity',p=>p.capacity],['Category',p=>p.category],['Materials',p=>p.material],['Exterior (mm)',p=>p.dimensionsMm?p.dimensionsMm.map(n=>n.toFixed(1)).join(' × '):'Unknown'],['Published case width',p=>p.maxWidthMm?(p.maxWidthExclusive?'Under ':'Up to ')+p.maxWidthMm+' mm':'Unknown'],['Fit evidence',p=>'More information required'],['Merchant availability',p=>offer(p).availability],['Checked',p=>offer(p).checked]];openModal(`<h2>The details, side by side.</h2><div class="table-wrap"><table><thead><tr><th>Compare</th>${list.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([name,fn])=>`<tr><th scope="row">${name}</th>${list.map(p=>`<td>${esc(fn(p))}</td>`).join('')}</tr>`).join('')}<tr><th>Explore</th>${list.map(p=>`<td><button class="textlink" data-product="${p.id}">Details & merchant ↗</button></td>`).join('')}</tr></tbody></table></div><p>Physical fit and technical compatibility require more than a capacity or case-width figure. Unknown data has not been inferred.</p>`);}
const guides={
'choose':['Boxes, rolls or winders?','START WITH THE RITUAL',`A watch box suits a collection that lives mainly at home. Look first at the number of watches, the interior space between them and whether you want an open display or an enclosed case. A drawer can hold straps and tools, but only count it as watch capacity when the exact model provides supported watch positions.||A roll or compact travel case serves a different purpose: carrying a few chosen pieces in your bag. Examine how each watch is held, whether the watches can contact one another, and how the closure behaves when packed. A soft lining is not evidence of tested impact protection.||A rotational winder is an optional convenience for suitable automatic watches. It is not a requirement for owning a collection, and it will not wind manual-winding or quartz watches. For mixed collections, ordinary storage may cover most of your needs.||Begin with the least complicated solution that meets your routine. Use our finder for a shortlist, then confirm the exact measurements, availability and service terms with the merchant.`],
'measure':['Measure beyond the dial.','FIT NOTES',`Start with case width, including the crown where it projects into the available space. Then measure case thickness and lug-to-lug length. These describe different constraints: a wide watch can fit a slot and still touch the lid or the watch beside it.||Bracelets introduce another question. Measure the internal circumference of a closed bracelet and compare it with the compressed cushion specification. A rigid or integrated bracelet can behave differently from a flexible strap. Never force a clasp shut around an oversized cushion.||Ask the merchant for slot spacing, cushion width and compressibility, clearance above the cushion and any restrictions for rigid bracelets. Exterior dimensions tell you whether a box fits on a shelf; they do not describe the usable interior.||Our catalog leaves missing measurements unknown. A published diameter limit is a manufacturer claim about one dimension, not a physical-fit guarantee. If your watches are large, thick or sized for a small wrist, written clarification from the merchant is especially useful.`],
'capacity':['Room for what comes next.','COLLECTION PLANNING',`Count the watches you actually want to store together, including watches worn infrequently. Separate display positions from additional drawer storage and winding positions: a two-watch winder with storage is not automatically a two-watch total-capacity case.||Allow room for a realistic next purchase rather than buying the largest case by default. A larger footprint can matter more than its empty slots in a small apartment. Measure the shelf with the lid open and allow space for cables on powered models.||Modular systems may let you add capacity later, but verify that the module fits your exact version. Product names and colors can span generations with different capacities.||The growth path adds your stated extra watches to your current count and only recommends catalog entries with sufficient documented capacity. It does not predict collection value, appreciation or purchase frequency.`],
 'travel':['A case for the journey.','TRAVEL NOTES',`Decide how many watches you want to carry and whether you need room for straps or tools. Compare the packed footprint and weight as well as the advertised watch count.||Check individual retention, cushion fit, closures and separation between adjacent watches. A case that holds a watch when open may behave differently when rotated inside luggage; seek exact-model instructions rather than assuming all rolls work alike.||Our sourced Rothwell two-watch listing contains conflicting exterior measurements. We have left its dimensions unknown rather than choosing a convenient figure. Obtain confirmation before relying on a tight luggage fit.||Leather, padding and a hard shell do not establish waterproofing, a tested impact rating or theft prevention. We do not collect travel dates or offer security assurances. Verify return conditions before ordering, particularly if personalizing a gift.`],
'winding':['Winding is a choice.','AUTOMATIC WATCHES',`An ordinary rotational winder turns a suitable automatic watch so its rotor can wind the movement. This may save resetting time and certain calendar functions when rotating between watches. It does not make every automatic watch owner need a winder.||Quartz and manually wound watches do not gain winding from ordinary rotational winders. For automatic models, the required direction and turns per day depend on the precise movement, not simply the brand printed on the dial.||We do not infer a movement setting or promise that continuous winding extends service life. Ask the watch manufacturer for guidance for the exact reference and check that the winder supports it.||For bedroom use, request actual noise information, a trial or a return option. Words such as silent and quiet are merchant claims unless supported by independent measurement. Our catalog has no independent acoustic tests.`],
'materials':['Look closer at the finish.','MATERIALS & CARE',`Distinguish solid wood, wood veneers, lacquered finishes, leather and synthetic coverings. A finish name alone does not establish the underlying material. Read the exact model description and ask when it is unclear.||Examine the lining and any exposed hardware that could contact a watch. A soft texture is useful information, but it does not establish universal compatibility with every strap or finish. Follow the watch and storage manufacturers’ care instructions.||Keep care conservative: avoid introducing cleaners, solvents or conditioning products without instructions for the exact material. Check whether replacement cushions or linings are available.||A lockable box is storage furniture with a closure; it is not a rated safe. We do not translate locks, thick walls or promotional protection claims into theft, water or fire ratings. Specialist security requires exact-model documentation.`],
'gifts':['A considered gift.','GIFTING',`Start with the recipient’s routine: one daily watch, a few travel favorites or a growing home collection. You do not need a serial number, valuation or complete movement information to choose ordinary storage.||A flexible choice can be better than a highly specialized one when measurements are unknown. Consider accessible capacity, the available space and whether a closed bracelet needs a smaller cushion. Our gift path defaults to storage rather than assuming a winder is appropriate.||Check delivery dates directly with the merchant, along with gift packaging, return deadlines and the treatment of personalized items. A general return window may exclude engraving or custom finishes.||Save two or three options to compare and download a generic plan. Avoid adding ownership values, home-storage locations or travel schedules. Prices in the plan are dated references rather than guaranteed offers.`],
'mixed':['One collection, many movements.','MIXED COLLECTIONS',`A collection may combine automatic, manual-winding, quartz and connected watches. Ordinary storage can organize them together without assuming that every piece needs powered winding.||Plan around the largest and smallest watches in the group. The limiting factor may be a thick case, a short closed bracelet, a rigid bracelet or a protruding crown. Use the most restrictive documented requirement when shopping for shared storage.||If some automatic watches benefit from winding convenience, consider a separate winder alongside ordinary storage. Do not count a winder as a charging solution for a connected watch or as winding support for a manual movement.||Our mixed-collection winding path can show winding options, but it does not imply those positions suit the entire collection. Verify which exact watches are eligible and keep the rest in appropriate storage.`]
};
function showGuide(id){let g=guides[id];if(!g)return;openModal(`<p class="eyebrow">${g[1]}</p><h2>${g[0]}</h2>${g[2].split('||').map(p=>`<p>${p}</p>`).join('')}<p class="caption">Editorial guidance, not hands-on testing. Product observations are linked in product details. Relevant source references: <a href="https://www.rothwellsf.com/products/2-watch-travel-case-carbon" target="_blank" rel="noopener">Rothwell travel specifications</a> · <a href="https://www.wolf1834.com/us/heritage-double-winder/black" target="_blank" rel="noopener">WOLF winding specifications</a> · <a href="https://www.holmeandhadfield.com/products/the-collector" target="_blank" rel="noopener">Collector version details</a>.</p>`);}
document.addEventListener('click',e=>{let t=e.target.closest('[data-category],[data-product],[data-save],[data-guide]');if(!t)return;if(t.dataset.category){category=t.dataset.category;render();}if(t.dataset.product)details(t.dataset.product);if(t.dataset.guide)showGuide(t.dataset.guide);if(t.dataset.save){let id=t.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];persist();render();const on=saved.includes(id),name=(products.find(p=>p.id===id)||{}).name;$$('[data-save]').filter(b=>b.dataset.save===id).forEach(b=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);if(b.classList.contains('save')){b.textContent=on?'♥':'♡';b.setAttribute('aria-label',(on?'Unsave ':'Save ')+name);}else b.textContent=on?'Remove from saved':'Save this piece';});if(!on&&$('#erasePlan')&&modal.open)$$('#modalBody .product').filter(c=>c.querySelector('[data-save]')?.dataset.save===id).forEach(c=>c.remove());toast(saved.includes(id)?'Saved to your collection plan':'Removed from your collection plan');}});
document.addEventListener('change',e=>{const id=e.target.dataset.compare;if(!id)return;if(e.target.checked&&comp.length>=3){e.target.checked=false;toast('Compare up to three pieces at a time.');return;}comp=e.target.checked?[...new Set([...comp,id])]:comp.filter(x=>x!==id);$$('[data-compare]').filter(c=>c.dataset.compare===id).forEach(c=>c.checked=comp.includes(id));updateCompare();});
$('#finderForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),num=k=>f.get(k)===''?null:Number(f.get(k));const r=CollectorRules.normalize({path:f.get('path'),movement:f.get('movement'),count:num('count'),budget:num('budget'),width:num('width'),wrist:num('wrist'),shelf:num('shelf'),growth:num('growth')||0});requirements=r;persist();let list=CollectorRules.recommend(products,offers,r);let nonAuto=r.path==='winding'&&['manual','quartz'].includes(r.movement);let unsure=r.path==='winding'&&['unknown','mixed'].includes(r.movement);$('#finderMessage').textContent=(nonAuto?'Rotational winders do not wind '+r.movement+' watches. Showing ordinary storage instead. ':'')+(unsure?'Winders only suit automatic watches. Confirm each watch is automatic and get its settings from the watch manufacturer; keep other watches in ordinary storage. ':'')+(list.length?`${list.length} ${list.length===1?'option meets':'options meet'} the available budget, capacity and documented constraints. Full physical fit still requires confirmation.`:'No verified options meet these requirements. Unknown-price items are excluded under a strict budget. Adjust budget, capacity or path explicitly, or browse directly.');$('#finderResults').innerHTML=list.length?list.slice(0,6).map(x=>card(x.p,x.fit)).join(''):'<div class="empty">We have not silently relaxed your requirements. Try a different budget or capacity above.</div>';};
$('#savedBtn').onclick=showSaved;$('#compareBtn').onclick=showCompare;$('#clearCompare').onclick=()=>{comp=[];render();};['search','brand','capacity','budget','sort'].forEach(id=>$('#'+id).addEventListener(id==='search'||id==='budget'?'input':'change',render));$('#reset').onclick=()=>{category='All';$('#search').value='';$('#brand').value='';$('#capacity').value='0';$('#budget').value='';$('#sort').value='edit';render();};
$('#aboutBtn').onclick=()=>openModal('<p class="eyebrow">POWERED BY MANY FACES ONLINE</p><h2>A more considered collection.</h2><p>The Collector Edit is a provisional independent discovery brand for storage, travel cases and winders. Compare practical details across brands and complete your purchase directly with the selling merchant.</p><p>This working preview uses sourced reference data and original AI lifestyle photography. We have not physically tested these products. Brand and domain clearance remain pending.</p>');
$('#disclosureBtn').onclick=()=>openModal('<h2>Disclosure & privacy</h2><p>This is a working preview. No affiliate approvals or active tracking links are configured. Merchant links currently earn no commission. If affiliate relationships are activated, we may earn a commission on eligible purchases; this will be disclosed near those links. Recommendations use suitability and available evidence, not commission.</p><p>Your saved selections and generic requirements use browser local storage. They are not transmitted to a server or synchronized across devices. Clearing browser data removes them. Use Clear saved data in the saved plan to remove them here.</p><p>To compare two versions of this page fairly, this browser keeps a random visitor number. It is not linked to your name or email, it is never sent to us, and it only decides which version you see. If you follow a merchant link, the link may note which version you saw, never the number itself. Clearing site data removes it.</p><p>No accounts, analytics service, newsletters, price alerts, payment processing or Control Center connection are active. Merchant sites have their own privacy and purchase terms. Original AI scenes are conceptual and do not establish exact-model accuracy, protection or endorsement.</p>');
async function init(){restore();$('#products').innerHTML='<p>Loading the collection…</p>';try{let res=await MFS_FETCH_CATALOG();if(!res.ok)throw Error();const checked=CollectorRules.validateCatalog(await res.json());({products,offers}=checked);if(checked.problems.length)console.warn('Catalog records skipped:',checked.problems);if(!products.length)throw Error();saved=saved.filter(id=>products.some(p=>p.id===id));$('#brand').innerHTML+=[...new Set(products.map(p=>p.brand))].map(b=>`<option>${esc(b)}</option>`).join('');$('#guides').innerHTML=Object.entries(guides).map(([id,g],i)=>`<button class="guide" data-guide="${id}"><small>0${i+1} / ${g[1]}</small><h3>${g[0]}</h3><span>Read the notes ↗</span></button>`).join('');if(requirements){Object.entries(requirements).forEach(([key,value])=>{const field=$('#finderForm').elements.namedItem(key);if(field)field.value=value??'';});}persist();render();}catch{$('#products').innerHTML='<div class="empty">The catalog could not load. Please refresh to try again.</div>';}}init().then(()=>MFS_READY({details,showSaved,has:id=>products.some(p=>p.id===id)}));

// No autoplay or video request until the visitor chooses to play. Native controls provide pause/seeking.
const motion=$('#collectorMotion'),playMotion=$('#playMotion');
if(motion&&playMotion){
 const restoreMotion=(message='')=>{motion.pause();motion.hidden=true;playMotion.textContent='Play collector moments · 9 sec ↗';playMotion.setAttribute('aria-expanded','false');$('#motionStatus').textContent=message;};
 playMotion.addEventListener('click',async()=>{
  if(!motion.hidden){restoreMotion();return;}
  if(!motion.querySelector('source')){
   for(const [src,type] of [[motion.dataset.src,'video/mp4'],[motion.dataset.webm,'video/webm; codecs="vp9"']]){
    if(!src)continue;
    const source=document.createElement('source');source.src=src;source.type=type;motion.append(source);
   }
   motion.load();
  }
  motion.hidden=false;playMotion.textContent='Close motion ×';playMotion.setAttribute('aria-expanded','true');
  try{await motion.play();}catch{restoreMotion('The motion piece could not load. The still photograph is available.');}
 });
 motion.addEventListener('ended',()=>restoreMotion());
 motion.addEventListener('error',()=>restoreMotion('The motion piece could not load. The still photograph is available.'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)motion.pause();});
}

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

})();
