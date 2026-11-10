/* Many Faces Beauty V3 — real manufacturer products, checked 2026-10-28. Prices are list prices on the brand site; affiliate programs are not yet approved. */
(function(){
 const brands=[
  {name:'OSEA',slug:'osea',kind:'Manufacturer',url:'https://ui.awin.com/merchant-profile/101463',website:'https://oseamalibu.com',rate:'1–16% by publisher type',cookie:'30 days',status:'Research · approval required',source:'Awin public program',notes:'Do not confuse creator/ambassador rates with editorial publisher terms.',focus:'Premium vegan seaweed skincare and body care'},
  {name:'Rahua',slug:'rahua',kind:'Manufacturer',url:'https://ui.awin.com/merchant-profile/76864',website:'https://rahua.com',rate:'8% default advertised',cookie:'30 days',status:'Research · approval required',source:'Awin public program',notes:'Confirm eligible SKUs, bundle treatment, payout and image licenses.',focus:'Plant-forward premium haircare'},
  {name:'LONDONTOWN',slug:'londontown',kind:'Manufacturer',url:'https://ui.awin.com/merchant-profile/88565',website:'https://www.londontownusa.com',rate:'25% advertised',cookie:'60 days',status:'Research · approval required',source:'Awin public program',notes:'Awin listing mentions ShareASale; verify network, eligible offers and current participation.',focus:'Vegan nail care and manicure sets'},
  {name:'Kreyòl Essence',slug:'kreyol',kind:'Manufacturer',url:'https://kreyolessence.com/pages/kreyol-essence-creator-program',website:'https://kreyolessence.com',rate:'20–25% advertised for creator program',cookie:'30 days shown in creator terms',status:'Research · program fit unconfirmed',source:'Creator program public page and terms',notes:'Creator/affiliate eligibility for editorial sites and bundle exclusions require review.',focus:'Haitian botanical oils, scalp and textured-hair care'},
  {name:'Manucurist',slug:'manucurist',kind:'Manufacturer',url:'https://ui.awin.com/merchant-profile/104809',website:'https://us.manucurist.com',rate:'20% packaged offers / 10% individual products (advertised)',cookie:'15 days',status:'Research · approval required',source:'Manucurist US Awin public program',notes:'Public program says publishers allowed, paid search and coupons restricted.',focus:'Vegan nail color and complete manicure sets'}
 ];
 const CHECKED='2026-10-28';
 const ALL_SKIN='sensitive,dry,combination,oily,mature', ALL_HAIR='straight,wavy,curly,coily';
 const specs=[
 // [id, name, category, step, list price USD, package form, color, fragrance, skin types, hair textures, goals, absent ingredients, brand, summary, product URL, size, stock note, product-page vegan, product-page cruelty-free]
 // Fragrance: 'free' only where the page claims fragrance-free or the full ingredient list has no fragrance or essential oils; 'scented' where fragrance or a scent oil is listed.
 ['osea-ocean-cleanser','Ocean Cleanser','Skincare','Cleanse',48,'tube','sage','scented','combination,oily','','balance,hydrate','','osea','Seaweed gel cleanser with lactic acid for normal to combination skin. Scented with orange, bergamot, lime and jasmine oils.','https://oseamalibu.com/products/ocean-cleanser','5 oz','Back-in-stock alert shown; confirm'],
 ['osea-ocean-cleansing-milk','Ocean Cleansing Milk','Skincare','Cleanse',54,'bottle','sand','free','dry,sensitive,mature','','calm,hydrate','fragrance,essential-oils','osea','Fragrance-free milky cleanser with Undaria seaweed and glycerin for dry, sensitive and mature skin.','https://oseamalibu.com/products/ocean-cleansing-milk','5 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-ocean-wave-cleanser','Ocean Wave Cleanser','Skincare','Cleanse',38,'bottle','blue','scented',ALL_SKIN,'','hydrate','','osea','Bi-phase cleansing oil that removes makeup, including waterproof. Scented with lime, jasmine and bergamot oils.','https://oseamalibu.com/products/ocean-wave-cleanser','4 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-hyaluronic-sea-serum','Hyaluronic Sea Serum','Skincare','Treat',88,'dropper','blue','free',ALL_SKIN,'','hydrate,calm','fragrance,essential-oils','osea','Fragrance-free serum with two weights of hyaluronic acid, seaweed and snow mushroom.','https://oseamalibu.com/products/hyaluronic-sea-serum','1 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-seaglow-overnight-serum','Seaglow Overnight Serum','Skincare','Treat',68,'dropper','amber','free','combination,oily,dry,mature','','tone','fragrance,essential-oils','osea','Fragrance-free night serum with 9% AHAs and 2% phytic acid for tone and texture. The brand says it is not suited to sensitive skin; use 1 to 2 times a week.','https://oseamalibu.com/products/seaglow-overnight-serum','1.2 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-dream-night-serum','Dream Night Serum','Skincare','Treat',88,'dropper','plum','scented','dry,combination,oily,mature','','tone,hydrate','','osea','Overnight serum with algae-derived bio-retinol, peptides and hyaluronic acid. Contains fragrance and lavender oil; the brand advises a patch test for sensitive skin.','https://oseamalibu.com/products/dream-night-serum','1 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-atmosphere-protection-cream','Atmosphere Protection Cream','Skincare','Moisturize',54,'jar','sage','scented','combination,oily','','hydrate,balance','','osea','Lightweight seaweed daily moisturizer for normal to combination skin. Scented with rose geranium, clary sage and chamomile oils.','https://oseamalibu.com/products/atmosphere-protection-cream','2 fl oz','Back-in-stock alert shown; confirm'],
 ['osea-seabiotic-water-cream','Seabiotic Water Cream','Skincare','Moisturize',54,'jar','blue','free',ALL_SKIN,'','hydrate,calm','fragrance,essential-oils','osea','Water-based seaweed face cream. The brand states it is free of fragrance and essential oils.','https://oseamalibu.com/products/seabiotic-water-cream','1.6 oz','Back-in-stock alert shown; confirm',true],
 ['osea-dream-night-cream','Dream Night Cream','Skincare','Moisturize',68,'jar','plum','scented','dry,combination,oily,mature','','hydrate,tone','','osea','Overnight moisturizer with algae-derived bio-retinol. Contains fragrance and lavender oil.','https://oseamalibu.com/products/dream-night-cream','1.9 oz','Back-in-stock alert shown; confirm'],
 ['osea-essential-hydrating-oil','Essential Hydrating Oil','Skincare','Moisturize',68,'dropper','gold','scented','dry,mature','','hydrate','','osea','Vegan face oil with pink microalgae and plant oils for normal, dry and mature skin. Floral scent from geranium, rosewood and clary sage oils.','https://oseamalibu.com/products/essential-hydrating-oil-1','1 fl oz','In stock; page says limited stock',true],
 ['rahua-classic-shampoo','Classic Shampoo','Haircare','Cleanse',38,'bottle','amber','scented','',ALL_HAIR,'balance','sulfates','rahua','Sulfate-free shampoo with rahua oil, palo santo and quinoa protein for all hair types. Woody scent from palo santo oil.','https://rahua.com/products/classic-shampoo','9.3 oz','Some sizes sold out; confirm'],
 ['rahua-hydration-shampoo','Hydration Shampoo','Haircare','Cleanse',38,'bottle','sand','scented','','wavy,curly,coily','hydrate','sulfates','rahua','Sulfate-free shampoo with mango sugars, sacha inchi oil and rose clay for dry, medium to thick, curly or coily hair. Contains fragrance.','https://rahua.com/products/hydration-shampoo','9.3 oz','Add to cart shown; 3.3 oz sold out'],
 ['kreyol-sos-clarify-shampoo','Save Our Scalp Clarify Shampoo + Bamboo Scalp Scrub','Haircare','Cleanse',32,'jar','sage','scented','',ALL_HAIR,'balance','','kreyol','Three-in-one scalp cleanser and exfoliating scrub used on damp hair. Contains fragrance and sodium coco-sulfate.','https://kreyolessence.com/products/save-our-scalp-clarify-shampoo-bamboo-scalp-scrub-5-4oz','5.4 oz','In stock'],
 ['rahua-hydration-conditioner','Hydration Conditioner','Haircare','Condition',40,'bottle','sand','scented','','wavy,curly,coily','hydrate,define','','rahua','Plant-based conditioner with Amazonian oils, mango sugars and rose clay for dry, medium to thick, textured hair. Contains fragrance.','https://rahua.com/products/hydration-conditioner','9.3 oz','Full sizes showed sold out on 2026-10-28'],
 ['kreyol-rosemary-mint-conditioner','Rosemary Mint + Haitian Black Castor Oil Scalp Care Conditioner','Haircare','Condition',22,'bottle','sage','scented','',ALL_HAIR,'hydrate,calm','','kreyol','Conditioner with Haitian black castor oil, shea butter and green tea to detangle and soothe the scalp. Contains fragrance and peppermint oil.','https://kreyolessence.com/products/rosemary-mint-haitian-black-castor-oil-scalp-care-conditioner-8oz','8 oz','In stock'],
 ['kreyol-hair-mayonnaise','Haitian Hair Mayonnaise Deep Moisture Mask','Haircare','Condition',32,'jar','rose','scented','','curly,coily','hydrate','','kreyol','Rinse-out deep moisture mask with Haitian black castor oil, argan oil and shea butter for dry, damaged textured hair. Contains fragrance and peppermint oil.','https://kreyolessence.com/products/haitian-hair-mayonnaise-black-castor-oil-deep-moisture-mask-8-oz','8 oz','In stock'],
 ['rahua-control-cream-curl-styler','Control Cream Curl Styler','Haircare','Style',36,'tube','rose','scented','','wavy,curly','define,hydrate','','rahua','Moisturizing styling cream that shapes curls and controls frizz, best for fine to medium hair. Earthy scent from palo santo oil.','https://rahua.com/products/control-cream-curl-styler','Size not stated','Back-in-stock alert shown; confirm'],
 ['rahua-leave-in-treatment','Leave-In Treatment','Haircare','Style',48,'bottle','blue','scented','','wavy,curly,coily','balance,hydrate','','rahua','Leave-in treatment with rahua oil, quinoa protein and raspberry leaf to smooth and protect medium to thick hair. Contains palo santo oil.','https://rahua.com/products/leave-in-treatment','2 fl oz','In stock'],
 ['kreyol-black-castor-oil-original','Haitian Black Castor Oil, Original','Haircare','Style',18,'dropper','gold','free','',ALL_HAIR,'hydrate','fragrance,essential-oils,sulfates','kreyol','Unscented single-ingredient Haitian castor seed oil for hair, scalp and brows.','https://kreyolessence.com/products/haitian-black-castor-oil-original','2 oz','2 oz in stock; 3.4 oz ($28) on preorder'],
 ['manucurist-cuticle-softener','Hydrating Cuticle Softener','Nails','Prep',15,'bottle','sand','free','','','care','fragrance,essential-oils','manucurist','Glycerin gel that softens cuticles so they can be pushed back before a manicure. Four-ingredient formula with no fragrance listed.','https://us.manucurist.com/products/cuticule-softner','Size not stated','Back-in-stock alert shown; confirm'],
 ['londontown-lacquer-remover','Strengthening Lacquer Remover','Nails','Prep',20,'bottle','blue','scented','','','care','','londontown','Acetone-free polish remover with rapeseed oil and vitamin E. Floral scent; not for gel polish.','https://www.londontownusa.com/products/strengthening-lacquer-remover','4 fl oz','In stock',true,true],
 ['manucurist-cuticle-oil','Nourishing Cuticle Oil','Nails','Care',15,'dropper','gold','free','','','care','fragrance,essential-oils','manucurist','Blend of six plant oils, including almond and coconut, to hydrate cuticles. No fragrance or essential oils in the ingredient list.','https://us.manucurist.com/products/nourishing-cuticle-oil','0.5 fl oz','Back-in-stock alert shown; confirm'],
 ['manucurist-vitaminized-base','Vitaminized Base Coat Green','Nails','Care',12,'bottle','rose','unknown','','','care','','manucurist','Strengthening base coat that protects nails under polish. Ingredients not yet reviewed.','https://us.manucurist.com/products/vitaminized-green-base-coat','Size not stated','Listed on 2026-10-28; confirm'],
 ['londontown-champagne-in-bed','Champagne in Bed','Nails','Color',16,'bottle','rose','free','','','color','fragrance','londontown','Sheer neutral pink with a holographic micro-sparkle. The brand lists it as free of added fragrance.','https://www.londontownusa.com/products/champagne-in-bed','12 ml','In stock'],
 ['manucurist-red-velvet','Red Velvet (Green nail polish)','Nails','Color',14,'bottle','plum','unknown','','','color','','manucurist','Velvet red shade from the Green plant-based polish range. Ingredients not yet reviewed.','https://us.manucurist.com/collections/green-nail-polish','15 ml','Listed on the color collection page; confirm'],
 ['osea-undaria-body-wash','Undaria Algae Body Wash','Body','Cleanse',32,'bottle','sage','scented',ALL_SKIN,'','hydrate','','osea','SLS-free seaweed body wash with aloe and glycerin. Natural grapefruit, lime and cypress scent.','https://oseamalibu.com/products/undaria-algae-body-wash','8 fl oz','Confirm price at merchant'],
 ['osea-undaria-body-oil','Undaria Algae Body Oil','Body','Moisturize',52,'bottle','gold','scented',ALL_SKIN,'','hydrate','','osea','Vegan body oil made by soaking Undaria seaweed in plant oils. Contains fragrance and grapefruit, lime and cypress oils; a fragrance-free version is also sold.','https://oseamalibu.com/products/undaria-algae-oil','5 fl oz (also 1 fl oz $16, 9.6 fl oz $84)','Confirm at merchant',true],
 ['osea-undaria-body-butter','Undaria Algae Body Butter','Body','Moisturize',54,'jar','sand','scented',ALL_SKIN,'','hydrate','','osea','Vegan body butter with Undaria seaweed, shea butter and ceramides. Contains fragrance and grapefruit, lime and cypress oils.','https://oseamalibu.com/products/undaria-algae-body-butter','6.7 oz','Confirm at merchant',true]
 ];
 const products=specs.map(s=>({id:s[0],name:s[1],category:s[2],step:s[3],price:s[4],form:s[5],tone:s[6],fragrance:s[7],skin:s[8]?s[8].split(','):[],hair:s[9]?s[9].split(','):[],goals:s[10]?s[10].split(','):[],absent:s[11]?s[11].split(','):[],candidate:s[12],summary:s[13],url:s[14],size:s[15],stock:s[16],checked:CHECKED,verified:{vegan:s[17]===true,crueltyFree:s[18]===true},type:'MANUFACTURER PRODUCT',evidence:'Manufacturer page checked '+CHECKED,merchants:[]}));
 const templates=[
  {id:'skincare',title:'The Everyday Skin Ritual',subtitle:'A gentle three-step foundation',category:'Skincare',steps:['Cleanse','Treat','Moisturize'],optional:['Treat'],caption:'Create a simple, comfortable ritual.'},
  {id:'haircare',title:'The Texture Edit',subtitle:'A routine that adapts to your texture',category:'Haircare',steps:['Cleanse','Condition','Style'],optional:['Style'],caption:'Cleanse, nourish, and finish your way.'},
  {id:'nails',title:'The Care-First Manicure',subtitle:'Your at-home nail ritual',category:'Nails',steps:['Prep','Care','Color'],optional:['Color'],caption:'Practical care with an optional pop of color.'},
  {id:'body',title:'The Body Essentials',subtitle:'Everyday bodycare, thoughtfully chosen',category:'Body',steps:['Cleanse','Moisturize'],optional:[],caption:'A considered two-step routine.'}
 ];
 const articles=[
  {id:'labels',category:'INGREDIENT INTELLIGENCE',title:'What does “clean beauty” actually tell you?',summary:'Why marketing vocabulary cannot replace ingredient records and clear claims.',time:'4 min read',content:'“Clean” is not a uniform regulatory certification. Look for specific supporting evidence, full ingredient lists, and documentation. Vegan, cruelty-free, and organic each describe different attributes; none guarantees that a product is suitable for a particular person.'},
  {id:'fragrance',category:'THE SENSITIVITY EDIT',title:'Fragrance-free, unscented—and why the difference matters',summary:'A practical guide to interpreting fragrance labels.',time:'5 min read',content:'Unscented products can contain masking fragrance. Fragrance-free products should not contain ingredients used specifically to add or mask scent, but consumers should review available ingredient information because reactions vary. Unknown ingredient data is not proof of an ingredient’s absence.'},
  {id:'routine',category:'THE ROUTINE EDIT',title:'A complete routine can still be simple',summary:'How to build a minimal, customizable product sequence.',time:'3 min read',content:'Start with the smallest useful set of steps. Skincare routines often begin with cleansing and moisturizing; an optional treatment may be considered if it fits the customer’s preferences. Extra products can increase cost and complexity without necessarily adding value.'},
  {id:'textures',category:'EVERY TEXTURE',title:'Haircare that begins with texture, not assumptions',summary:'Make strand needs, routine goals and styling habits the inputs.',time:'4 min read',content:'Hair preferences vary widely, including within any one community or curl pattern. Let customers identify texture, cleansing frequency, conditioning preferences, styling goals and known ingredient exclusions rather than making assumptions based on appearance or ancestry.'},
  {id:'bundles',category:'SMARTER SHOPPING',title:'When is a complete beauty set actually better value?',summary:'Compare convenience, product fit, size and merchant terms.',time:'4 min read',content:'A bundle can reduce separate shopping steps, but only when each product is relevant and the combined price is competitive. Compare total prices, size per unit, and authorized retailer terms. Do not assume that buying a set automatically raises affiliate earnings.'},
  {id:'tone',category:'INCLUSIVE BEAUTY',title:'The difference between shade representation and product suitability',summary:'Why inclusive beauty needs better information—not assumptions.',time:'4 min read',content:'Showing a broad range of complexions is essential for representation, particularly for color cosmetics, but skin tone alone does not establish skin type or sensitivity. Products should be matched to the preferences customers actually share.'}
 ];
 window.BeautyCatalog={brands,products,templates,articles};
})();

/* Portable pure decision functions; no external framework or network dependency. */
(function(root){
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
 // Imported/reported amounts keep cents; whole-dollar money() is for sample planning prices only.
 const moneyCents=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
 const toCents=v=>Math.round(Number(v)*100);
 const safeNumber=(value,min=0,max=10000000)=>Math.max(min,Math.min(max,Number(value)||0));
 function productEligible(product,prefs={}){
   if(prefs.category && prefs.category!=='All' && product.category!==prefs.category)return false;
   if(prefs.fragrance==='free' && product.fragrance!=='free')return false;
   // Absent budget means no ceiling; any finite number (including 0) is a ceiling.
   if(prefs.budget!==undefined && prefs.budget!==null && prefs.budget!=='' && Number.isFinite(Number(prefs.budget)) && product.price>Number(prefs.budget))return false;
   // Demonstration products carry no vegan/cruelty-free evidence, so strict requirements cannot pass.
   if(prefs.veganRequired && product.verified?.vegan!==true)return false;
   if(prefs.crueltyFreeRequired && product.verified?.crueltyFree!==true)return false;
   // UNKNOWN is not equivalent to ABSENT; a declared exclusion requires explicit sample tag.
   for(const unwanted of prefs.exclusions||[]){ if(!product.absent.includes(unwanted))return false; }
   return true;
 }
 function recommend(products,prefs={}){
   return products.filter(p=>productEligible(p,prefs)).map(p=>{
    let score=0;let reasons=[];
    if(prefs.goal && p.goals.includes(prefs.goal)){score+=8;reasons.push('Aligned with selected goal');}
    if(prefs.skin && p.skin.includes(prefs.skin)){score+=6;reasons.push('Matches chosen skin preferences');}
    if(prefs.hair && p.hair.includes(prefs.hair)){score+=6;reasons.push('Matches chosen hair texture');}
    if(prefs.fragrance==='free' && p.fragrance==='free'){score+=4;reasons.push('Fragrance-free per brand');}
    if((prefs.exclusions||[]).length)reasons.push('Listed ingredients meet your exclusions');
    if(!reasons.length)reasons.push('Matches your selected category and budget');
    return {product:p,score,reasons};
   }).sort((a,b)=>b.score-a.score || a.product.price-b.product.price);
 }
 function basket(products,slots){
  const chosen=Object.entries(slots||{}).filter(([,id])=>!!id).map(([step,id])=>({step,product:products.find(p=>p.id===id)})).filter(x=>x.product);
  const total=chosen.reduce((s,x)=>s+x.product.price,0);
  const groups={};
  for(const x of chosen){const k=x.product.candidate||'unassigned';(groups[k]??=[]).push(x.product);}
  return {chosen,total,groups,count:chosen.length};
 }
 function model(input){
  const sessions=safeNumber(input.sessions,0,100000000),clickRate=safeNumber(input.clickRate,0,100)/100,
    saleRate=safeNumber(input.saleRate,0,100)/100,avgOrder=safeNumber(input.avgOrder,0,1000000),
    commission=safeNumber(input.commission,0,100)/100,reversals=safeNumber(input.reversals,0,100)/100,
    costs=safeNumber(input.costs,0,10000000),hours=safeNumber(input.hours,0,100000);
  const clicks=sessions*clickRate,orders=clicks*saleRate,validOrders=orders*(1-reversals),
     paidCommission=validOrders*avgOrder*commission,netContribution=paidCommission-costs;
  return {sessions,clicks,orders,validOrders,paidCommission,netContribution,
   // A zero denominator makes the ratio unavailable, not zero.
   per1000Clicks:clicks>0?paidCommission/clicks*1000:null,
   per1000Sessions:sessions>0?paidCommission/sessions*1000:null,
   perHour:hours>0?netContribution/hours:null,
   clickRate,saleRate,commission,reversals,avgOrder,costs,hours};
 }
 // De-duplicate reports by merchant and order ID; final status wins in reconciliation hierarchy.
 // Same-status reports with different amounts are conflicts: held for review, never silently resolved by row order.
 function reconcile(entries){
  const rank={pending:0,reported:1,approved:2,paid:3,reversed:4,rejected:4};
  const byId=new Map(),conflicted=new Set();
  for(const e of entries){
   if(!e.merchant||!e.orderId)continue;
   const k=JSON.stringify([String(e.merchant),String(e.orderId)]);
   const prior=byId.get(k),r=rank[e.status]??-1,pr=prior?(rank[prior.status]??-1):-1;
   if(!prior||r>pr){byId.set(k,e);conflicted.delete(k)}
   else if(r===pr&&toCents(e.commission)!==toCents(prior.commission))conflicted.add(k);
  }
  const orders=[...byId.entries()].filter(([k])=>!conflicted.has(k)).map(([,e])=>e);
  const conflicts=[...conflicted].map(k=>byId.get(k));
  const sumCents=list=>list.reduce((s,x)=>s+toCents(x.commission||0),0);
  return {orders,conflicts,paid:sumCents(orders.filter(x=>x.status==='paid'))/100,
    approved:sumCents(orders.filter(x=>x.status==='approved'))/100,
    reversed:orders.filter(x=>['reversed','rejected'].includes(x.status)).length};
 }
 root.BeautyLogic={money,moneyCents,productEligible,recommend,basket,model,reconcile};
})(typeof window!=='undefined'?window:globalThis);

/* Shopify adapter for the Many Faces Beauty site script (runs after site/src/data.js, before site/src/app.js).
   The catalog is the site's demonstration catalog narrowed to the products published in the store (snippets/store-data).
   If the store has no products yet, the full catalog shows, so the theme works before the CSV import. A store title wins
   over the site's name. Store-only products join the tools when their type is a category, they carry a step:<step> tag
   and a price above zero. */
(function () {
  const cat = window.BeautyCatalog; if (!cat) return;
  const store = Array.isArray(window.MFB_STORE) ? window.MFB_STORE : [];
  if (!store.length) return;
  const byHandle = new Map(store.map(s => [s.handle, s]));
  const known = new Set(cat.products.map(p => p.id));
  const products = cat.products.filter(p => byHandle.has(p.id)).map(p => ({...p, name: byHandle.get(p.id).title || p.name}));
  const CATEGORIES = ['Skincare', 'Haircare', 'Nails', 'Body'];
  for (const s of store) {
    if (known.has(s.handle)) continue;
    const category = CATEGORIES.find(c => c.toLowerCase() === String(s.type || '').trim().toLowerCase());
    const tags = (s.tags || []).map(String);
    const tag = k => tags.find(t => t.toLowerCase().startsWith(k + ':'))?.slice(k.length + 1).trim();
    const price = Number(s.price) / 100;
    if (!category || !tag('step') || !(price > 0)) continue;
    const fragrance = ['free', 'scented'].includes(tag('fragrance')) ? tag('fragrance') : 'unknown';
    products.push({id: s.handle, name: s.title, category, step: tag('step'), price, form: 'bottle', tone: 'sand', fragrance, skin: [], hair: [],
      goals: tags.filter(t => t.toLowerCase().startsWith('goal:')).map(t => t.slice(5).trim()), absent: [], candidate: '',
      summary: 'Added in the store; details not recorded yet.', type: 'STORE PRODUCT', evidence: 'NOT VERIFIED', merchants: []});
  }
  cat.products = products;
})();

/* Home links from product pages: /?concept=<handle> opens that concept's details, /?compare=<handle> adds it to Compare.
   They reuse the site's own buttons (data-action) so the behaviour matches the website exactly. */
// The site sets #/home on first load, and that hashchange closes any open dialog; set it quietly first on Home.
if (document.getElementById('app') && !location.hash) history.replaceState(history.state, '', location.pathname + location.search + '#/home');
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app'); if (!app) return;
  const q = new URLSearchParams(location.search);
  const [action, id] = q.get('concept') ? ['detail', q.get('concept')] : q.get('compare') ? ['compare-add', q.get('compare')] : [];
  if (!action || !(window.BeautyCatalog?.products || []).some(p => p.id === id)) return;
  const b = document.createElement('button'); b.hidden = true; b.dataset.action = action; b.dataset.id = id;
  app.append(b); b.click(); b.remove();
});

/* Pages other than Home (product, collection, search, cart, 404) use the Liquid header; this runs its phone menu. */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-mfb-menu]'); if (!b) return;
  const nav = document.querySelector('.mfb-menu'); if (!nav) return;
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', e => {
  const nav = document.querySelector('.mfb-menu.open'), b = document.querySelector('[data-mfb-menu]');
  if (e.key !== 'Escape' || !nav || !b) return;
  nav.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.focus();
});

(function(){'use strict';if(!document.getElementById('app'))return;
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

globalThis.installMFOInternalLearning({"enabled":true,"siteId":"mfo-beauty","container":"#shop-cards > .product-grid","card":":scope > .product-card","idSelector":"[data-id]","idAttribute":"data-id","facetSelector":".product-body .eyebrow","sortSelector":"#filter-sort","curatedValues":["curated"],"experiments":[{"id":"po1","kind":"personalize-offer","hypothesis":"Offering on-device personalization (More like this / Less like this) raises outbound clicks per visitor compared with the generic page.","metric":"click-share","arms":[{"name":"control","weight":0.5},{"name":"treatment","weight":0.5}],"control":"control","mde":0.2,"start":"2026-11-01","end":"2027-04-30"}],"outbound":{"subIdParam":null}});
/* MFO_INTERNAL_LEARNING_END */
(function(){
 'use strict';
 const {brands,products,templates,articles}=window.BeautyCatalog;
 const {money,moneyCents,recommend,basket,model}=window.BeautyLogic;
 const $=sel=>document.querySelector(sel);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const media=file=>esc(window.MFB_MEDIA?.[file]||('./assets/'+file));
 const photos={ritual:['editorial-ritual.jpg','Sunlit linen, ceramic bowl and unbranded vessels on a stone shelf'],texture:['editorial-texture.jpg','Woman gently lifting a natural curl in soft daylight'],care:['editorial-care.jpg','Hands with natural nails resting on linen beside a ceramic dish'],ingredients:['editorial-ingredients.jpg','Glass dishes holding illustrative cream and gel textures'],portrait:['editorial-hero.png','Three women with different skin tones and hair textures']};
 const articlePhoto={labels:'ingredients',fragrance:'care',routine:'ritual',textures:'texture',bundles:'ritual',tone:'portrait'};
 const photo=(key,cls='editorial-visual')=>{const [file,alt]=photos[key]||photos.ritual;return `<img class="${cls} editorial-photo" src="${media(file)}" alt="${esc(alt)}" loading="lazy" decoding="async" width="1536" height="1024">`};
 const reviewMode=new URLSearchParams(location.search).get('review')==='1';
 const films=[
  {id:'skin',category:'Skincare',kicker:'MORNING SKIN RITUAL',title:'A considered touch',copy:'A few drops of facial oil pressed gently into the cheek in warm morning light.',file:'film-skin',seconds:'ten',alt:'AI-generated woman pressing facial oil into her cheek in a sunlit marble bathroom',short:'short-skin',shortAlt:'AI-generated woman applying facial oil at a bathroom mirror',template:'skincare'},
  {id:'body',category:'Body',kicker:'BODY CARE RITUAL',title:'A moment for body care',copy:'A gentle body-oil ritual with intricate henna on the hand and forearm.',file:'body-henna',seconds:'eight',alt:"Indian woman's henna-decorated hand and forearm during a gentle body-oil ritual",short:'short-body',shortTitle:'Golden-hour body care',shortAlt:'AI-generated older woman smoothing body cream onto her shoulder on a terrace at sunset',template:'body'},
  {id:'hair',category:'Haircare',kicker:'TEXTURE CARE',title:'Care for your texture',copy:'Fingers working slowly through long natural curls, with no heat and no rush.',file:'film-hair',seconds:'ten',alt:'AI-generated man running his fingers through long curly hair beside a garden window',short:'short-hair',shortAlt:'AI-generated man with long curls gently finger-combing his hair by a window',template:'haircare'},
  {id:'nails',category:'Nails',kicker:'NAIL ATELIER',title:'The smallest details',copy:'One controlled, thin brushstroke of soft nude colour on a prepared nail.',file:'film-nails',seconds:'ten',alt:'AI-generated close-up of a brush applying nude colour to a nail beside white petals',short:'short-nails',shortAlt:'AI-generated hands painting a nude polish onto a nail on a stone surface',template:'nails'}
 ];
 const filmVideo=(file,alt,extra='')=>`<video data-editorial-film controls muted playsinline preload="none"${extra} poster="${media(file+'.jpg')}" aria-label="${esc(alt)}"><source src="${media(file+'.mp4')}" type="video/mp4"><source src="${media(file+'.webm')}" type="video/webm"></video><p class="film-error notice" role="status" hidden>Playback is unavailable. The still image and shopping tools remain available.</p>`;
 function filmPlacement(category){const f=films.find(f=>f.category===category);if(!f)return '';return `<section class="film-placement" id="film-${f.id}" aria-labelledby="film-title-${f.id}"><figure class="ritual-film">${filmVideo(f.file,f.alt)}<figcaption>AI-generated film · not a real customer or model · unbranded packaging · ${f.seconds} seconds.</figcaption></figure><div><span class="eyebrow">${f.kicker}</span><h2 id="film-title-${f.id}">${esc(f.title)}</h2><p>${esc(f.copy)}</p><button class="btn light smallbtn" data-action="film-routine" data-id="${f.template}">Plan this routine →</button></div></section>`}
 function shortsReel(){return `<section class="section-sm shorts" aria-labelledby="shorts-title"><div class="max"><span class="eyebrow">SHORTS · TEN-SECOND RITUALS</span><h2 id="shorts-title">Small rituals, up close</h2><p class="small muted">AI-generated films. The people shown are not real customers, models or endorsers, and packaging is unbranded.</p><div class="shorts-reel">${films.map(f=>`<figure class="short-card">${filmVideo(f.short,f.shortAlt,' loop')}<figcaption><span class="eyebrow">${f.category}</span>${esc(f.shortTitle||f.title)}</figcaption></figure>`).join('')}</div></div></section>`}
 function previewUpdates(){return reviewMode?`<details class="preview-updates max"><summary>Preview updates</summary><p class="small">Each category film is available here.</p><div>${films.map(f=>`<button class="chip" data-action="film-jump" data-id="${f.category}">${f.category}</button>`).join('')}</div></details>`:''}
 let filmObserver,shortsObserver;
 function bindFilms(){filmObserver?.disconnect();filmObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const e of entries)if(!e.isIntersecting)e.target.pause()},{threshold:0}):null;
  document.querySelectorAll('video[data-editorial-film]').forEach(v=>{
   filmObserver?.observe(v);
   // A film someone plays with sound pauses the others; silent scroll films play side by side.
   v.addEventListener('play',()=>{if(!v.muted)document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()})});
   const fail=()=>{const status=v.closest('figure').querySelector('.film-error');if(status)status.hidden=false};
   v.addEventListener('error',fail);let errors=0;const sources=[...v.querySelectorAll('source')];sources.forEach(source=>source.addEventListener('error',()=>{if(++errors===sources.length)fail()}));
  });
  // Phone Shorts reel: the short swiped into frame plays muted; the one leaving pauses. Skipped for reduced motion and data saver.
  shortsObserver?.disconnect();shortsObserver=null;
  if('IntersectionObserver' in window&&matchMedia('(max-width:900px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData){
   shortsObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.intersectionRatio>=.6&&!document.hidden)e.target.play().catch(()=>{});else e.target.pause()}},{threshold:[0,.6]});
   document.querySelectorAll('.short-card video').forEach(v=>{v.dataset.mfMotion='off';shortsObserver.observe(v)});
  }
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(v=>v.pause())});
 // No prefetch. Every film plays muted by itself as it scrolls into view (the shared motion script below; the phone Shorts reel uses its own swipe rule); reduced-motion and data-saving visitors opt in with native controls.
 const find=id=>products.find(p=>p.id===id);
 const brand=slug=>brands.find(b=>b.slug===slug);
 const readStore=key=>{try{return JSON.parse(localStorage.getItem(key))}catch{return null}};
 // safeSet reports whether the browser actually stored the value.
 const safeSet=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));return true}catch{return false}};
 // Stored values are untrusted: keep only well-formed entries that refer to catalog items and templates.
 const cleanIds=v=>Array.isArray(v)?[...new Set(v.filter(id=>typeof id==='string'&&find(id)))]:[];
 const cleanRoutines=v=>Array.isArray(v)?v.filter(r=>r&&typeof r==='object'&&templates.some(t=>t.id===r.template)&&r.slots&&typeof r.slots==='object'&&!Array.isArray(r.slots)).map(r=>({template:r.template,slots:Object.fromEntries(Object.entries(r.slots).filter(([,id])=>typeof id==='string'&&(id===''||find(id)))),savedAt:typeof r.savedAt==='string'?r.savedAt:''})):[];
 const state={page:'home',mobile:false,shop:{q:'',category:'All',fragrance:'any',brand:'All',sort:'curated',max:1000},modal:null,
  saved:cleanIds(readStore('mfbeauty_saved')),routines:cleanRoutines(readStore('mfbeauty_routines')),compare:cleanIds(readStore('mfbeauty_compare')).slice(0,3),
  quizStep:0,prefs:{category:'Skincare',goal:'hydrate',skin:'sensitive',hair:'curly',fragrance:'any',exclusions:[],veganRequired:false,crueltyFreeRequired:false,budget:120},
  template:'skincare',slots:{}};
 /* Your Private Shortlist (mf-shortlist.js, D-026 in mfo-mLintelligence): the shared Keep panel reads and restores saved products and routines here. */
 window.MF_SHORTLIST={snapshot:()=>state.saved.length||state.routines.length?{saved:[...state.saved],routines:state.routines}:null,restore:data=>{const ids=cleanIds(data?.saved),routines=cleanRoutines(data?.routines);if(!ids.length&&!routines.length)return;state.saved=[...new Set([...state.saved,...ids])];state.routines=[...state.routines,...routines.filter(r=>!state.routines.some(x=>JSON.stringify(x)===JSON.stringify(r)))];safeSet('mfbeauty_saved',state.saved);safeSet('mfbeauty_routines',state.routines);render();toast('Your edit is back on this device.')},open:()=>{location.hash='#/saved'},ids:()=>[...state.saved]};
 let notices={};
 const attr=(key,value)=>`data-${key}="${esc(value)}"`;
 const navs=[['shop','Shop'],['brands','Brands'],['match','Beauty Match'],['routine','Build My Routine'],['sets','Routines & Sets'],['compare','Compare'],['guides','Guides'],['offers','Verified Offers']];
 const href=(page)=>`#/${page}`;
 const picture=(p)=>`<div class="product-art ${p.tone}" role="img" aria-label="Illustrated packaging for ${esc(p.name)}, not a product photo"><div class="shadow-ground"></div><div class="package ${esc(p.form)}"><span class="pack-mark">THE EDIT</span><span class="pack-line"></span><span class="pack-sub">${esc(brand(p.candidate)?.name||'')}</span></div><span class="demo-flag">Illustration</span></div>`;
 const marker=(text)=>`<span class="pill outline">${esc(text)}</span>`;
 function card(p){const isSaved=state.saved.includes(p.id);return `<article class="product-card">${picture(p)}<div class="product-body"><div class="eyebrow muted">${esc(p.category)} / ${esc(p.step)}</div><h3 class="product-name">${esc(p.name)}</h3><div class="muted">${esc(brand(p.candidate)?.name||'')} · ${esc(p.size||'')}</div><div class="product-meta">${p.fragrance==='free'?'<span>Fragrance-free</span>':''}<span>${esc(p.stock||'')}</span></div><div class="product-price">${money(p.price)} <small>list price</small></div><div class="product-actions"><button class="btn smallbtn" data-action="detail" data-id="${p.id}">View product ↗</button><button class="mini-round ${isSaved?'saved':''}" aria-label="${isSaved?'Remove saved':'Save'} ${esc(p.name)}" data-action="save-product" data-id="${p.id}">${isSaved?'♥':'♡'}</button></div></div></article>`}
 function header(){return `<div class="topbar"><span>MANY FACES ONLINE <span style="opacity:.5;padding:0 8px">|</span> BEAUTY</span><span>INDEPENDENT EDITORIAL RESEARCH • PILOT DEVELOPMENT</span></div>
 <header class="site-header"><div class="header-inner max"><a class="brand" href="#/home" aria-label="Many Faces Beauty home"><div class="brand-lines"><div class="brand-name">MANY FACES</div><div class="brand-beauty">BEAUTY</div></div><div class="brand-tag">CLEAN BEAUTY<br>REAL PEOPLE<br>BRIGHTER DAYS</div></a>
 <nav class="nav" aria-label="Primary navigation">${navs.map(([v,l])=>`<a class="${state.page===v?'active':''}" href="#/${v}">${l}</a>`).join('')}</nav>
 <div class="header-actions"><div class="search-shell"><span aria-hidden="true">⌕</span><input id="header-search" aria-label="Search products" placeholder="Search beauty..." value="${esc(state.shop.q)}"></div><a class="icon-btn" href="#/saved" aria-label="Saved routines and products">♡${state.saved.length+state.routines.length?`<span class="count-badge">${state.saved.length+state.routines.length}</span>`:''}</a><button class="icon-btn mobile-menu" id="menu-toggle" aria-label="Toggle navigation" aria-expanded="${state.mobile}">☰</button></div></div>${state.mobile?`<nav class="mobile-nav" aria-label="Mobile navigation">${navs.map(([v,l])=>`<a href="#/${v}">${l}</a>`).join('')}<a href="#/saved">Saved routines & products</a></nav>`:''}</header>
 <div class="demo-ribbon"><strong>RESEARCH PREVIEW:</strong> real brand products at list prices checked 2026-10-28. Nothing is sold here, and affiliate links are not active yet.</div>`}
 function footer(){return `<footer class="footer"><div class="max"><div class="footer-grid"><div><div class="brand-name">MANY FACES</div><div class="brand-beauty">B E A U T Y</div><p style="max-width:310px;color:#c7d3c9;font-size:13px">Different faces. Shared standards.<br>A considered space for every skin tone, hair texture, and personal preference.</p><p class="tiny">Independent research pilot · powered by Many Faces Online</p></div><div><h4>Discover</h4><a href="#/shop">Shop the research edit</a><a href="#/brands">Our research brands</a><a href="#/match">Beauty Match</a><a href="#/routine">Routine Builder</a><a href="#/compare">Compare products</a><a href="${esc((window.MFB_ROOT||'/')+'collections/all')}">Product library</a></div><div><h4>Inside the Edit</h4><a href="#/guides">Beauty Journal</a><a href="#/sets">Routines & Sets</a><a href="#/offers">Program research</a><a href="#/saved">Saved routines</a></div><div><h4>Information</h4><a href="#/about">Our standards</a><a href="#/contact">Contact</a><a href="#/disclosure">Affiliate disclosure</a><a href="#/privacy">Privacy</a><a href="#/terms">Terms</a></div></div><div class="footer-bottom"><span>© 2026 Many Faces Online. Beauty research pilot v3.0.</span><span>No medical advice · No products available for sale in this preview · No live advertising or affiliate accounts</span></div></div></footer>`}
 function pageHero(kicker,title,sub){return `<section class="page-hero"><div class="max"><span class="eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(sub)}</p></div></section>`}
 function productGrid(items){return items.length?`<div class="product-grid">${items.map(card).join('')}</div>`:`<div class="empty"><div class="eyebrow">No matching products</div><h3>Try a different combination</h3><p class="muted">Unknown ingredient information never counts as a confirmed exclusion.</p><a class="btn light" href="#/shop" data-action="clear-filters">Clear filters</a></div>`}
 function home(){return `<section class="brands-band"><div class="max"><div class="brands-label">On the research desk · Recognizable beauty brands</div><div class="brand-strip">${brands.map(b=>`<button data-action="brand" data-id="${b.slug}" aria-label="Research ${esc(b.name)}">${esc(b.name)}</button>`).join('')}</div><div class="band-note">Research candidates only. No relationship or affiliate approval implied.</div></div></section>
 <section class="hero"><div class="hero-image" role="img" aria-label="Original editorial portrait showing women of different skin tones and hair textures"><video id="heroFilm" class="hero-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="${media('editorial-motion.mp4')}" data-webm="${media('editorial-motion.webm')}"></video></div><button type="button" class="hero-motion" data-mf-motion-toggle aria-controls="heroFilm" hidden>Pause motion</button><div class="hero-content"><div class="eyebrow">⊙ CLEAN BEAUTY FOR EVERY FACE</div><h1>Different faces.<br>Shared standards.</h1><p>Premium, vegan-conscious beauty for every skin tone, texture, and preference. Curated with care. Researched with intention. Entirely your own.</p><div class="hero-ctas"><a class="btn" href="#/routine">Build my routine →</a><a class="text-link hero-link" href="#/match">Find my beauty match →</a></div><div class="hero-bottom"><span>Ingredient-aware</span><span>Inclusive by design</span><span>Thoughtful choices</span></div></div><div class="hero-emblem">BEAUTY<br>BELONGS<br>TO EVERYONE</div></section>
 <main id="main"><div class="max"><section class="section-sm"><div class="features"><div class="feature-card"><div class="feature-art rose"><div class="package jar"><span class="pack-mark">THE EDIT</span></div></div><div class="feature-copy"><h3>Beauty Match</h3><p>Your preferences, your routine. Compare products with transparent matching logic.</p><a class="text-link" href="#/match">Find your match →</a></div></div><div class="feature-card"><div class="feature-art"><div class="package dropper"><span class="pack-mark">THE EDIT</span></div></div><div class="feature-copy"><h3>Build My Routine</h3><p>Create a complete ritual with flexible steps, list-price totals and product alternatives.</p><a class="text-link" href="#/routine">Build your routine →</a></div></div><div class="feature-card"><div class="feature-art gold"><div class="package bottle"><span class="pack-mark">THE EDIT</span></div></div><div class="feature-copy"><h3>Compare Products</h3><p>Meaningful side-by-side comparisons, without fabricated reviews or rankings.</p><a class="text-link" href="#/compare">Compare now →</a></div></div></div></section>
 <section class="editorial-stripe" aria-label="Shop by preference"><div class="stripe-row">${[['Skincare','shop','Skincare'],['Haircare','shop','Haircare'],['Nail care','shop','Nails'],['Body care','shop','Body'],['Sensitive skin','shop','sensitive'],['Fragrance-free','shop','free']].map((x,i)=>`<button class="stripe-tile" data-action="category" data-id="${x[2]}">${x[0]} <span>↗</span></button>`).join('')}</div></section>
 <section class="section"><div class="section-title"><div><span class="eyebrow muted">THE EDITOR'S RESEARCH SHELF</span><h2>Considered discoveries</h2><p>Real products from five independent brands, with prices checked on each brand site. Affiliate links go live once each program approves us.</p></div><a class="btn light" href="#/shop">Explore all products →</a></div>${productGrid(products.filter(p=>['osea-seabiotic-water-cream','osea-hyaluronic-sea-serum','kreyol-hair-mayonnaise','londontown-champagne-in-bed'].includes(p.id)))}</section>
 <section class="section-sm"><div class="intro-panel"><div class="text-block"><span class="eyebrow">MORE PERSONAL. LESS GUESSWORK.</span><h2>Because beauty is never one-size-fits-all.</h2><p>Explore products by your selected sensitivities, routine goals, hair texture, desired ingredients and budget—not assumptions about your background or complexion.</p><a href="#/match" class="btn">Discover your match →</a></div><div class="intro-checks"><figure class="ritual-film"><video data-editorial-film controls muted playsinline preload="none" poster="${media('editorial-ritual.jpg')}" aria-label="A quiet beauty ritual: editorial motion study"><source src="${media('editorial-motion.webm')}" type="video/webm"><source src="${media('editorial-motion.mp4')}" type="video/mp4"></video><p class="film-error notice" role="status" hidden>Playback is unavailable. The still image and shopping tools remain available.</p><figcaption>Small rituals. A little room to breathe.<br><span>AI-generated editorial imagery · motion study from still photographs.</span></figcaption></figure><div><b>1</b><span><strong>Tell us what matters</strong><br>Answer only the questions you choose.</span></div><div><b>2</b><span><strong>Explore transparent matches</strong><br>See why an option was selected—and what's unverified.</span></div><div><b>3</b><span><strong>Build your ritual</strong><br>Compare steps, remove products and plan estimated costs.</span></div></div></div></section>${shortsReel()}
 <section class="section"><div class="section-title"><div><span class="eyebrow muted">INSIDE THE JOURNAL</span><h2>A little more knowledge. A lot less noise.</h2></div><a class="text-link" href="#/guides">Explore all guides →</a></div><div class="editorial-grid">${articles.slice(0,3).map((a,i)=>`<article class="editorial-card">${photo(articlePhoto[a.id])}<span class="eyebrow muted">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><a class="text-link" href="#/guide/${a.id}">Read the edit →</a></article>`).join('')}</div></section></div>${newsletter()}</main>`}
 function newsletter(){return `<section class="newsletter"><div class="max newsletter-inner"><div><span class="eyebrow">THOUGHTFUL INBOX, THOUGHTFUL BEAUTY</span><h2>Beauty notes worth opening.</h2><p class="muted">Routine ideas, beauty research, and new discoveries—only when you opt in. Email service is not connected in this preview.</p></div><div><form id="newsletter-form"><input type="email" required placeholder="Your email address" aria-label="Email address"><button class="btn ivory" type="submit">Join the Edit ↗</button></form><div id="newsletter-message" class="message">Preview mode: no address is saved or transmitted.</div></div></div></section>`}
 function shop(){return `${pageHero('THE RESEARCH COLLECTION','The beauty shelf','Real products from five independent brands. Prices are brand-site list prices checked 2026-10-28; packaging art is illustrative, not product photography.')}<main id="main" class="max page-section"><div class="page-split"><aside class="filter-panel"><h3 style="font-size:23px">Refine your edit</h3><label for="filter-search">Search products</label><input id="filter-search" placeholder="Name, step, or concern" value="${esc(state.shop.q)}"><label for="filter-category">Category</label><select id="filter-category">${['All','Skincare','Haircare','Nails','Body'].map(c=>`<option ${state.shop.category===c?'selected':''}>${c}</option>`).join('')}</select><label for="filter-fragrance">Fragrance preference</label><select id="filter-fragrance"><option value="any" ${state.shop.fragrance==='any'?'selected':''}>Any / unknown allowed</option><option value="free" ${state.shop.fragrance==='free'?'selected':''}>Fragrance-free only</option></select><label for="filter-brand">Brand</label><select id="filter-brand"><option value="All">All brands</option>${brands.map(b=>`<option value="${b.slug}" ${state.shop.brand===b.slug?'selected':''}>${esc(b.name)}</option>`).join('')}</select><label for="filter-max">Maximum price</label><select id="filter-max">${[40,60,80,120,1000].map(n=>`<option value="${n}" ${state.shop.max===n?'selected':''}>${n===1000?'No maximum':'Up to '+money(n)}</option>`).join('')}</select><button class="btn secondary smallbtn" data-action="clear-filters">Reset filters</button><div class="notice">ⓘ Fragrance and ingredient tags come from each brand's product page. Read the full ingredient list on the brand site before buying, especially for allergies.</div></aside><div><div class="catalog-top"><div id="shop-count" class="small muted"></div><label class="small">Sort <select id="filter-sort" class="inline-select"><option value="curated" ${state.shop.sort==='curated'?'selected':''}>Curated order</option><option value="low" ${state.shop.sort==='low'?'selected':''}>Price: low–high</option><option value="high" ${state.shop.sort==='high'?'selected':''}>Price: high–low</option><option value="az" ${state.shop.sort==='az'?'selected':''}>Name A–Z</option></select></label></div><div id="shop-cards"></div><div id="category-film"></div></div></div></main>`}
 function filtered(){let list=products.filter(p=>{const q=state.shop.q.trim().toLowerCase();return (!q||[p.name,p.category,p.step,p.summary,...p.goals,...p.skin,...p.hair].join(' ').toLowerCase().includes(q))&&(state.shop.category==='All'||p.category===state.shop.category)&&(state.shop.fragrance!=='free'||p.fragrance==='free')&&(state.shop.brand==='All'||p.candidate===state.shop.brand)&&(p.price<=state.shop.max)});if(state.shop.sort==='low')list.sort((a,b)=>a.price-b.price);if(state.shop.sort==='high')list.sort((a,b)=>b.price-a.price);if(state.shop.sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name));return list;}
 function updateShop(){const el=$('#shop-cards');if(el){let list=filtered();el.innerHTML=productGrid(list);$('#category-film').innerHTML=filmPlacement(state.shop.category);bindFilms();$('#shop-count').textContent=`${list.length} product${list.length===1?'':'s'} · prices checked 2026-10-28`;}}
 function brandPage(){return `${pageHero('MANUFACTURER RESEARCH','Our brand research desk','Recognizable premium beauty names, public program evidence, and approval-dependent partnership opportunities.')}<main id="main" class="max page-section"><div class="notice"><strong>No partnerships activated.</strong> All brand entries are research candidates. The public terms below may change and may not apply to our publishing model.</div><div class="brand-grid">${brands.map(b=>`<article class="brand-card" id="brand-${b.slug}"><span class="eyebrow muted">${esc(b.kind)} · RESEARCH ONLY</span><div class="brand-name-big">${esc(b.name)}</div><p class="small muted">${esc(b.focus)}</p><dl><dt>Advertised terms</dt><dd>${esc(b.rate)}</dd><dt>Attribution window</dt><dd>${esc(b.cookie)}</dd><dt>Partner status</dt><dd>${esc(b.status)}</dd><dt>Important review note</dt><dd>${esc(b.notes)}</dd></dl><div class="source"><strong>Public source:</strong> <a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">Program information ↗</a></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:17px"><a href="#/shop" class="btn light smallbtn" data-action="brand-filter" data-id="${b.slug}">See products →</a><a class="btn secondary smallbtn" href="${esc(b.website)}" target="_blank" rel="noopener noreferrer">Official brand site ↗</a></div></article>`).join('')}</div></main>`}
 function quiz(){const p=state.prefs,step=state.quizStep;
 const selectOne=(field,choices)=>`<div class="choice-grid">${choices.map(([v,l,sub])=>`<button class="choice ${p[field]===v?'selected':''}" data-action="quiz-set" data-field="${field}" data-id="${v}" aria-pressed="${p[field]===v}">${esc(l)}${sub?`<div class="tiny muted">${esc(sub)}</div>`:''}</button>`).join('')}</div>`;
 const titles=['What would you like to explore?','What matters most today?','How do you feel about fragrance?','Which ingredients should be avoided?','Choose your planning price range'];
 const bodies=[selectOne('category',[['Skincare','Skincare','Face and complexion'],['Haircare','Haircare','Every texture'],['Nails','Nail care','Care and color'],['Body','Body care','Everyday comfort']]),
  `<p class="muted small">Choose the main goal for this demonstration. Your preferences never determine a diagnosis.</p>${selectOne('goal',p.category==='Haircare'?[['hydrate','Hydration'],['define','Texture definition'],['calm','Gentle feel'],['balance','Balanced routine']]:p.category==='Nails'?[['care','Care & strength'],['color','Color inspiration']]:[['hydrate','Hydration'],['calm','A gentle-feel routine'],['tone','Even-looking tone'],['balance','Lightweight texture']])}<label class="small">${p.category==='Haircare'?'Hair texture':'Skin preference'} <select id="quiz-type" class="inline-select">${(p.category==='Haircare'?['any','straight','wavy','curly','coily']:['any','sensitive','dry','mature','oily','combination']).map(x=>`<option value="${x}" ${(p.category==='Haircare'?p.hair:p.skin)===x?'selected':''}>${x==='any'?'No preference':x}</option>`).join('')}</select></label>`,
  selectOne('fragrance',[['any','No fragrance restriction','Unknown evidence is shown clearly'],['free','Prefer fragrance-free','Only products the brand lists as fragrance-free']]),
  `<p class="small muted">Multiple selections are supported. Unverified exclusions never count as ingredient absence. Vegan and cruelty-free only count when the product page itself says so.</p><div class="choice-grid">${[['fragrance','Fragrance'],['essential-oils','Essential oils'],['coconut','Coconut ingredients'],['sulfates','Sulfates']].map(([v,l])=>`<button class="choice ${(p.exclusions||[]).includes(v)?'selected':''}" data-action="quiz-exclude" data-id="${v}" aria-pressed="${(p.exclusions||[]).includes(v)}">${l}</button>`).join('')}</div><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="choice ${p.veganRequired?'selected':''}" style="min-width:220px" data-action="quiz-toggle" data-id="veganRequired" aria-pressed="${p.veganRequired}">Require verified vegan</button><button class="choice ${p.crueltyFreeRequired?'selected':''}" style="min-width:220px" data-action="quiz-toggle" data-id="crueltyFreeRequired" aria-pressed="${p.crueltyFreeRequired}">Require verified cruelty-free</button></div>`,
  selectOne('budget',[[40,'Up to $40','Per product'],[60,'Up to $60'],[90,'Up to $90'],[120,'$120+','Allows the entire catalog']])];
 if(step>=5){const options=recommend(products,p).slice(0,8);return `${pageHero('YOUR PERSONAL DISCOVERY','Your Beauty Match','Recommendations are rule-based matches, not medical assessments or validated product suitability.')}<main id="main" class="max page-section"><div class="notice"><strong>How these were matched:</strong> tags and prices come from each brand's product page, checked 2026-10-28. Recheck ingredients and price on the brand site before buying.</div><div class="section-title"><div><h2>${options.length} matching products</h2><p>Selected: ${esc(p.category)} · ${esc(p.goal)} · ${p.fragrance==='free'?'Fragrance-free preference':'Any fragrance'} · ${money(p.budget)} ceiling</p></div><button class="btn light" data-action="quiz-reset">Edit answers ↗</button></div>${options.length?`<div class="results-grid">${options.map(({product:x,reasons})=>`<article class="result-card">${picture(x)}<div><span class="eyebrow muted">${x.category} / ${x.step}</span><h4>${esc(x.name)}</h4><p class="tiny muted">${esc(reasons.join(' · '))}</p><div class="tiny">${money(x.price)} <span class="muted">list price</span></div><button class="text-link link-button" data-action="detail" data-id="${x.id}">View product →</button></div></article>`).join('')}</div>`:`<div class="empty"><h3>No products meet every selection</h3><p>We never assume unknown ingredients, vegan or cruelty-free status satisfy your requirements. Live eligible products require verified evidence; you may adjust the criteria to explore examples.</p><button class="btn light" data-action="quiz-reset">Change selections</button></div>`}<div class="section-sm"><button class="btn" data-action="match-to-routine">Build a routine from these preferences →</button></div></main>`}
 return `${pageHero('YOUR PERSONAL DISCOVERY','Beauty Match','A focused, five-step discovery experience that respects individual preferences and makes uncertainty visible.')}<main id="main" class="max page-section"><div class="quiz-shell"><div class="quiz-card"><div class="progress" role="progressbar" aria-label="Beauty Match progress" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${step+1}"><span style="width:${(step+1)/5*100}%"></span></div><span class="eyebrow muted">QUESTION ${step+1} OF 5</span><h2 class="quiz-head">${titles[step]}</h2>${bodies[step]}<div class="quiz-foot"><button class="btn light" data-action="quiz-prev" ${step===0?'disabled':''}>← Back</button><button class="btn" data-action="quiz-next">${step===4?'See my matches':'Continue →'}</button></div></div><p class="tiny muted" style="text-align:center;margin:20px">No email required. Answers remain in this browser session; no sensitive health records collected.</p></div></main>`;
 }
 function initializeRoutine(template,force=false){if(force||state.template!==template||!Object.keys(state.slots).length){state.template=template;const t=templates.find(x=>x.id===template)||templates[0];state.slots={};for(const st of t.steps){state.slots[st]=products.find(p=>p.category===t.category&&p.step===st)?.id||'';}}}
 function routine(){initializeRoutine(state.template);const t=templates.find(x=>x.id===state.template);const b=basket(products,state.slots);return `${pageHero('THE ROUTINE STUDIO','Build something personal','Compose an intentional ritual, remove unnecessary steps, review planning costs, and see checkout-fragmentation risks.')}<main id="main" class="max page-section"><div class="routine-shell"><div class="routine-head"><div><span class="eyebrow muted">CHOOSE YOUR RITUAL</span><h2>${esc(t.title)}</h2><p class="muted">${esc(t.subtitle)}. Prices are brand list prices checked 2026-10-28.</p></div><div class="routine-toolbar">${templates.map(x=>`<button class="chip ${state.template===x.id?'selected':''}" data-action="routine-template" data-id="${x.id}">${esc(x.category)}</button>`).join('')}</div></div><div class="notice"><strong>Planning mode:</strong> real products at brand list prices. Grouping by brand does not mean a single checkout or a bundle discount.</div>${filmPlacement(t.category)}<div class="routine-layout"><div class="step-list">${t.steps.map((step,i)=>{const picks=products.filter(p=>p.category===t.category&&p.step===step);const current=find(state.slots[step]);const optional=t.optional.includes(step);return `<section class="step-card"><div class="step-index">${i+1}</div><div><div class="eyebrow muted">${optional?'OPTIONAL STEP':'CORE STEP'} / ${t.category}</div><h3>${esc(step)}</h3><label class="small muted" for="slot-${i}">Choose or remove a product</label><select id="slot-${i}" data-slot="${esc(step)}"><option value="">${optional?'Skip this step':'Remove this step'}</option>${picks.map(p=>`<option value="${p.id}" ${state.slots[step]===p.id?'selected':''}>${esc(p.name)} · ${money(p.price)}</option>`).join('')}</select>${current?`<div class="step-detail">${esc(current.summary)} · ${esc(current.fragrance==='unknown'?'Fragrance evidence unknown':current.fragrance==='free'?'Fragrance-free per brand':'Contains fragrance or scent oils')}</div><button class="link-button small" style="margin-top:10px" data-action="detail" data-id="${current.id}">View product details ↗</button>`:`<div class="step-detail">No product selected; this step is removed from the planning estimate.</div>`}</div></section>`}).join('')}</div><aside class="routine-summary"><span class="eyebrow">YOUR PLANNING BASKET</span><h3>${esc(t.title)}</h3><div class="divider"></div>${b.chosen.map(x=>`<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:9px;font-size:12px"><span>${esc(x.product.name)}</span><strong>${money(x.product.price)}</strong></div>`).join('')||'<p class="small muted">Your routine is currently empty.</p>'}<div class="divider"></div><div class="muted tiny">Estimated basket at list prices · ${b.count} items</div><div class="routine-total">${money(b.total)}</div><div class="tiny muted">Not a checkout total; prices and stock can change.</div><div class="group-list"><strong>Grouped by brand</strong>${Object.entries(b.groups).map(([key,arr])=>`<div style="padding-top:8px">${esc(brand(key)?.name||'Unknown brand')} · ${arr.length} product${arr.length!==1?'s':''}</div>`).join('')||'No products selected.'}<div class="tiny" style="margin-top:10px">Each brand sells through its own site, so a mixed routine means more than one checkout.</div></div><button class="btn ivory" data-action="routine-save">♡ Save routine locally</button><button class="btn light" style="color:#fff;border-color:#a8b5a9" data-action="routine-export">Export plan ↗</button><p id="routine-message" class="tiny" aria-live="polite"></p></aside></div></div></main>`}
 function compare(){const selected=state.compare.map(find).filter(Boolean);return `${pageHero('SIDE BY SIDE','Make informed comparisons','Explore meaningful differences without invented superiority rankings, reviews, prices or certifications.')}<main id="main" class="max page-section"><div class="notice">Details come from each brand's product page, checked 2026-10-28. Confirm ingredients, size and price on the brand site.</div><div class="select-row">${[0,1,2].map(i=>`<label class="small">Product ${i+1}<br><select data-compare-slot="${i}"><option value="">Choose a product</option>${products.map(p=>`<option value="${p.id}" ${state.compare[i]===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>`).join('')}<button class="btn secondary smallbtn" data-action="compare-clear">Clear</button></div>${selected.length?`<div class="compare-layout"><table class="compare-table"><caption class="tiny" style="padding:12px;text-align:left">Product comparison from brand pages—not medical advice.</caption><tbody><tr><th>Product</th>${selected.map(p=>`<td class="top">${esc(p.name)}</td>`).join('')}</tr><tr><th>Category</th>${selected.map(p=>`<td>${esc(p.category)} / ${esc(p.step)}</td>`).join('')}</tr><tr><th>List price</th>${selected.map(p=>`<td>${money(p.price)}</td>`).join('')}</tr><tr><th>Fragrance</th>${selected.map(p=>`<td>${p.fragrance==='free'?'Fragrance-free per brand':p.fragrance==='scented'?'Contains fragrance or scent oils':'Not yet reviewed'}</td>`).join('')}</tr><tr><th>Ingredient exclusions</th>${selected.map(p=>`<td>${esc(p.absent.join(', ')||'Unknown / not established')}</td>`).join('')}</tr><tr><th>Brand</th>${selected.map(p=>`<td>${esc(brand(p.candidate)?.name)}</td>`).join('')}</tr><tr><th>Verification</th>${selected.map(p=>`<td>Brand page checked ${esc(p.checked)}</td>`).join('')}</tr><tr><th>Where to buy</th>${selected.map(p=>`<td><a target="_blank" rel="noopener noreferrer" style="text-decoration:underline" href="${esc(p.url)}">Brand page ↗</a></td>`).join('')}</tr></tbody></table></div>`:`<div class="empty"><h3>Choose up to three products</h3><p class="muted">Compare attributes and list prices at a glance.</p></div>`}</main>`}
 function sets(){return `${pageHero('THE COMPLETE ROUTINE EDIT','The art of a complete ritual','Considered beauty routines organized around what customers want—not unnecessary additions.')}<main id="main" class="max page-section"><div class="editorial-grid">${templates.map((t,i)=>`<article class="editorial-card">${photo(({skincare:'ritual',haircare:'texture',nails:'care',body:'care'})[t.id])}<span class="eyebrow muted">${esc(t.category)} / ${t.steps.length} STEPS</span><h3>${esc(t.title)}</h3><p>${esc(t.caption)} Swap any product or skip optional steps. Price is calculated inside the builder.</p><button class="btn light smallbtn" data-action="routine-template" data-id="${t.id}">Customize routine ↗</button></article>`).join('')}</div><div class="notice">These are editable template sets, not official merchant bundles or discount offers.</div></main>`}
 function guides(){return `${pageHero('THE BEAUTY JOURNAL','An informed approach to beauty','Original explanatory guides, with careful product claims, inclusive language, and transparent evidence limits.')}<main id="main" class="max page-section">${articles.map(a=>`<article class="guide-article">${photo(articlePhoto[a.id],'guide-art')}<div><span class="eyebrow muted">${esc(a.category)} · ${esc(a.time)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p></div><a class="btn light smallbtn" href="#/guide/${a.id}">Read ↗</a></article>`).join('')}</main>`}
 function guidePage(id){const a=articles.find(x=>x.id===id);if(!a)return guides();return `${pageHero(a.category,a.title,a.summary)}<main id="main" class="max page-section"><article class="legal">${photo(articlePhoto[a.id],'guide-cover')}<span class="eyebrow muted">EDITORIAL GUIDE · ${a.time} · DEMONSTRATION EDITION</span><h2>What matters for your decision</h2><p>${esc(a.content)}</p><p>Product attributes can change. Check the current official manufacturer information and ingredient list before use or purchase. Individual sensitivities vary.</p><div class="notice">This guide is general cosmetic education, not a medical assessment or a claim of first-hand testing. Evidence review and expert editing are required before public publishing.</div><a class="btn light" href="#/guides">← Back to Journal</a></article></main>`}
 function offers(){return `${pageHero('THE VERIFIED OFFER STANDARD','Evidence before promotion','A dedicated space for genuine offers—without inventing discounts, prices, approvals, or time-limited promotions.')}<main id="main" class="max page-section"><div class="empty"><div class="eyebrow">NO VERIFIED OFFERS YET</div><h3>Good offers are worth verifying.</h3><p class="muted">No affiliate merchant has been approved or integrated into this preview. Accordingly, the store displays zero live product offers.</p><a href="#/brands" class="btn">View brand research →</a></div><section class="section-sm"><h2>What will count as verified?</h2><div class="roadmap"><div><span class="eyebrow">01 / PARTNER</span><h3>Authorized merchant</h3><p class="small muted">Current affiliate approval, eligible SKU and publisher terms.</p></div><div><span class="eyebrow">02 / PRODUCT</span><h3>Accurate offer data</h3><p class="small muted">Supported price, availability, size and promo information with checked dates.</p></div><div><span class="eyebrow">03 / LINK</span><h3>Valid destination</h3><p class="small muted">Permitted tracked link and adequate on-page disclosure.</p></div></div></section></main>`}
 function saved(){const items=state.saved.map(find).filter(Boolean);return `${pageHero('YOUR PERSONAL COLLECTION','Saved to your edit','Products and routines are stored only in your local browser for this preview. Nothing is synced or transmitted.')}<main id="main" class="max page-section mf-saved-page"><div class="section-title"><h2>Your saved routines</h2><span class="pill">${state.routines.length} plans</span></div>${state.routines.length?state.routines.map((r,i)=>{let temp=templates.find(t=>t.id===r.template);let b=basket(products,r.slots);return `<article class="saved-card"><div><span class="eyebrow muted">${esc(r.savedAt)} · SAMPLE PLAN</span><h3>${esc(temp?.title||'Custom routine')}</h3><p class="small muted">${b.count} illustrative products · ${money(b.total)} planning estimate</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn light smallbtn" data-action="routine-load" data-id="${i}">Open plan</button><button class="btn secondary smallbtn" data-action="routine-delete" data-id="${i}">Delete</button></div></article>`}).join(''):`<div class="empty"><h3>No saved rituals yet</h3><a href="#/routine" class="btn">Build a routine →</a></div>`}<div class="section-title" style="margin-top:53px"><h2>Saved products</h2><span class="pill">${items.length} items</span></div>${items.length?productGrid(items):`<div class="empty"><h3>Nothing saved here yet</h3><a href="#/shop" class="btn">Explore products →</a></div>`}<div class="section-sm"><button class="btn light smallbtn" data-action="clear-saved">Clear all local saved items and routines</button></div></main>`}
 function info(page){const pages={
  about:['Our selection standards',`Beauty is personal, and good decisions depend on better information. Our research-first approach makes inclusion, ingredient transparency and product suitability questions visible rather than assuming that one product works for everyone. This site is a controlled demonstration, not an active retailer.`, 'We separate vegan, cruelty-free, organic, fragrance-free and verified sensitivity-related attributes instead of treating these terms as synonyms.'],
  contact:['Contact the Beauty Edit',`A live contact service is not connected to this preview. For production, the contact page will use an authorized service, privacy controls, and appropriate retention practices. Do not enter confidential or sensitive information in a demonstration contact form.`, 'Supplier inquiries and merchant program submissions require founder review before external outreach.'],
  disclosure:['Affiliate disclosure',`Many Faces Beauty is planned as an affiliate-supported editorial marketplace. When active links are approved and deployed, we may earn commissions from qualifying purchases at partner websites. Such commissions may affect the economics of the business but must never replace customer relevance as the central ranking factor.`, 'No affiliate links or paying partnerships are active in this prototype. Brand research is not an endorsement or a claim of affiliation.'],
  privacy:['Privacy in this preview',`This public demonstration is a static website. It does not connect to an analytics, marketing, merchant, or customer database service. As with any website, the hosting service receives standard request information when pages load, and the page requests its typefaces from Google Fonts. Saved products and routines are stored locally in your browser by localStorage until deleted or cleared. To compare two versions of this page fairly, this browser keeps a random visitor number. It is not linked to your name or email, it is never sent to us, and it only decides which version you see. If you follow a merchant link, the link may note which version you saw, never the number itself. Clearing site data removes it.`, 'The newsletter field does not send or retain an email address. Before launch, implement legally reviewed notices, consent, deletion rights and required service-provider controls.'],
  terms:['Preview terms',`This is a technology and commercial research preview, not a functioning online retailer. Catalog products are real, but prices are brand list prices checked 2026-10-28 and may change; there are no inventory claims, promotions or checkout destinations.`, 'Product details are summarized from brand pages and are not medical advice. Validate official brand materials and consult qualified professionals for medical concerns.']
 };const a=pages[page]||pages.about;return `${pageHero('THE BEAUTY EDIT',a[0],a[1])}<main id="main" class="max page-section"><article class="legal"><h2>Our approach</h2><p>${a[1]}</p><p>${a[2]}</p><h2>What comes next</h2><p>Actual commercial operations will require licensed assets, source-confirmed product records, approved affiliate links, privacy and legal review, and working external integrations.</p><a href="#/home" class="btn light">← Back to the Edit</a></article></main>`}
 function modal(){const p=find(state.modal);if(!p)return'';const b=brand(p.candidate);return `<div class="modal-backdrop" id="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(p.name)} details"><button class="close-modal" data-action="modal-close" aria-label="Close detail view">×</button><div class="modal-content">${picture(p)}<div class="modal-copy"><span class="eyebrow muted">${esc(b?.name||'')} / ${esc(p.category)} / ${esc(p.step)}</span><h2>${esc(p.name)}</h2><p class="muted">${esc(p.summary)}</p><div class="price">${money(p.price)} <span class="tiny muted">list price on the brand site, checked ${esc(p.checked)}</span></div><div class="divider"></div><div class="small"><strong>Size:</strong> ${esc(p.size||'Not stated')}<br><strong>Fragrance:</strong> ${p.fragrance==='free'?'Fragrance-free per brand page':p.fragrance==='scented'?'Contains fragrance or scent oils':'Not yet reviewed'}<br><strong>Confirmed absent:</strong> ${esc(p.absent.join(', ')||'None confirmed')}<br><strong>Vegan on product page:</strong> ${p.verified?.vegan?'Yes':'Not stated'}<br><strong>Stock on ${esc(p.checked)}:</strong> ${esc(p.stock||'Confirm at brand')}</div><div class="notice">Not medical advice. Our affiliate programs are not approved yet, so this links straight to the brand.</div><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn smallbtn mf-buy" target="_blank" rel="noopener noreferrer" href="${esc(p.url)}">Check price at ${esc(b?.name||'the brand')} ↗</a><button class="btn secondary smallbtn" data-action="save-product" data-id="${p.id}">${state.saved.includes(p.id)?'♥ Saved':'♡ Save product'}</button><a class="btn secondary smallbtn" href="#/compare" data-action="compare-add" data-id="${p.id}">Compare →</a></div><p class="tiny muted" style="margin-top:16px">Read the full ingredient list on the brand page before buying. Prices and stock can change.</p></div></div></div></div>`}
 function render(){let parsed=(location.hash||'#/home').replace(/^#\//,'').split('/');state.page=parsed[0]||'home';if(!['home','shop','brands','match','routine','sets','compare','guides','guide','offers','saved','about','contact','disclosure','privacy','terms'].includes(state.page))state.page='home';let body='';switch(state.page){case'home':body=home();break;case'shop':body=shop();break;case'brands':body=brandPage();break;case'match':body=quiz();break;case'routine':body=routine();break;case'sets':body=sets();break;case'compare':body=compare();break;case'guides':body=guides();break;case'guide':body=guidePage(parsed[1]);break;case'offers':body=offers();break;case'saved':body=saved();break;default:body=info(state.page);break;}const focusKey=keyOf(document.activeElement);$('#app').innerHTML=header()+previewUpdates()+body+footer()+modal();bindFilms();const skip=document.querySelector('.skip-link');if(skip)skip.inert=!!state.modal;if(state.modal)for(const el of $('#app').children)if(el.id!=='modal-backdrop')el.inert=true;if(state.page==='shop')updateShop();refocus(focusKey);document.title=`${state.page==='home'?'Many Faces Beauty':state.page[0].toUpperCase()+state.page.slice(1)+' | Many Faces Beauty'} — V3.0 Research Pilot`;}
 // Re-rendering replaces the page, so return keyboard focus to the equivalent control afterwards.
 function keyOf(el){if(!el||el===document.body||!el.closest?.('#app'))return null;if(el.id)return '#'+CSS.escape(el.id);const parts=['action','id','field','slot','compareSlot'].filter(k=>el.dataset[k]!==undefined).map(k=>`[data-${k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}="${CSS.escape(el.dataset[k])}"]`);return parts.length?el.tagName.toLowerCase()+parts.join(''):null}
 function refocus(key){if(!key)return;const el=document.querySelector(key);if(!el)focusHeading();else if(!el.closest('[inert]'))el.focus({preventScroll:true})}
 function focusHeading(){const h=$('#main h1')||$('.page-hero h1')||$('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
 function closeModal(){state.modal=null;render();refocus(state.modalReturn)}
 function navigate(page){state.mobile=false;state.modal=null;if(location.hash!==href(page))location.hash=href(page);else{render();window.scrollTo(0,0)}}
 function toast(msg,target='routine-message'){const el=$('#'+target);if(el)el.textContent=msg;}
 function exportRoutine(){const payload={site:'many-faces-beauty',mode:'research-demo',version:'3.0',template:state.template,items:basket(products,state.slots).chosen.map(x=>({step:x.step,brand:brand(x.product.candidate)?.name,name:x.product.name,listPrice:x.product.price,url:x.product.url})),note:'Brand list prices checked 2026-10-28. Confirm price and stock on each brand site.'};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='many-faces-beauty-routine-demo.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 function onAction(node,e){const a=node.dataset.action,id=node.dataset.id;
  if(a==='film-jump'){state.shop={q:'',category:id,brand:'All',fragrance:'any',sort:'curated',max:1000};location.hash='#/shop';render();requestAnimationFrame(()=>{const el=document.querySelector('.film-placement');el?.scrollIntoView({block:'center'});el?.querySelector('h2')?.setAttribute('tabindex','-1');el?.querySelector('h2')?.focus({preventScroll:true})});return}
  if(a==='film-routine'){initializeRoutine(id,true);navigate('routine');return}
  if(a==='modal-close'){closeModal();return}
  if(a==='detail'){state.modalReturn=keyOf(node);state.modal=id;render();$('#modal-backdrop')?.querySelector('.close-modal')?.focus();return}
  if(a==='save-product'){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];safeSet('mfbeauty_saved',state.saved);render();return}
  if(a==='brand'){state.shop.brand=id;state.shop.category='All';navigate('brands');setTimeout(()=>$('#brand-'+id)?.scrollIntoView({block:'center'}),40);return}
  if(a==='brand-filter'){e.preventDefault();state.shop.brand=id;navigate('shop');return}
  if(a==='category'){state.shop={...state.shop,category:['Skincare','Haircare','Nails','Body'].includes(id)?id:'All',brand:'All',fragrance:id==='free'?'free':'any',q:''};if(id==='sensitive')state.shop.q='sensitive';navigate('shop');return}
  if(a==='clear-filters'){e.preventDefault();state.shop={q:'',category:'All',fragrance:'any',brand:'All',sort:'curated',max:1000};render();return}
  if(a==='quiz-set'){const val=node.dataset.field==='budget'?Number(id):id;state.prefs[node.dataset.field]=val;if(node.dataset.field==='category'){const goals={Haircare:['hydrate','define','calm','balance'],Nails:['care','color']}[val]||['hydrate','calm','tone','balance'];if(!goals.includes(state.prefs.goal))state.prefs.goal=goals[0]}render();return}
  if(a==='quiz-exclude'){const a=state.prefs.exclusions;state.prefs.exclusions=a.includes(id)?a.filter(x=>x!==id):[...a,id];render();return}
  if(a==='quiz-toggle'){state.prefs[id]=!state.prefs[id];render();return}
  if(a==='match-to-routine'){const map={Skincare:'skincare',Haircare:'haircare',Nails:'nails',Body:'body'};const key=map[state.prefs.category]||'skincare';initializeRoutine(key,true);const t=templates.find(x=>x.id===key);for(const st of t.steps){const rec=recommend(products,{...state.prefs,category:t.category}).find(x=>x.product.step===st);state.slots[st]=rec?.product.id||''}navigate('routine');return}
  if(a==='quiz-next'){state.quizStep=Math.min(state.quizStep+1,5);render();return}
  if(a==='quiz-prev'){state.quizStep=Math.max(state.quizStep-1,0);render();return}
  if(a==='quiz-reset'){state.quizStep=0;render();return}
  if(a==='routine-template'){initializeRoutine(id,true);navigate('routine');return}
  if(a==='routine-save'){const o={template:state.template,slots:{...state.slots},savedAt:new Date().toLocaleDateString('en-US')};state.routines.unshift(o);const stored=safeSet('mfbeauty_routines',state.routines);render();toast(stored?'Saved in this browser only. No account or cloud sync.':'Kept for this visit only: this browser blocked local storage, so the routine will be gone when you close the page.');return}
  if(a==='routine-export'){exportRoutine();toast('Downloaded a local demonstration routine JSON file.');return}
  if(a==='routine-load'){const r=state.routines[Number(id)];if(r){state.template=r.template;state.slots={...r.slots};navigate('routine')}return}
  if(a==='routine-delete'){state.routines.splice(Number(id),1);safeSet('mfbeauty_routines',state.routines);render();return}
  if(a==='clear-saved'){state.saved=[];state.routines=[];safeSet('mfbeauty_saved',[]);safeSet('mfbeauty_routines',[]);render();return}
  if(a==='compare-add'){e.preventDefault();if(!state.compare.includes(id)){state.compare=[...state.compare.slice(-2),id];safeSet('mfbeauty_compare',state.compare)}navigate('compare');return}
  if(a==='compare-clear'){state.compare=[];safeSet('mfbeauty_compare',[]);render();return}
 }
 document.addEventListener('click',e=>{
  if(e.target?.id==='modal-backdrop'){closeModal();return}
  if(e.target.closest?.('.skip-link')){e.preventDefault();const m=$('#main');if(m){m.tabIndex=-1;m.focus()}return}
  if(e.target?.id==='menu-toggle'){state.mobile=!state.mobile;render();return}
  const node=e.target.closest('[data-action]');if(node){onAction(node,e);return;}
  const anch=e.target.closest('a[href^="#/"]');if(anch){if(state.modal)state.modal=null;state.mobile=false;let next=anch.getAttribute('href');if(location.hash===next){render();window.scrollTo(0,0)}}
 });
 document.addEventListener('change',e=>{
  const t=e.target;
  const filters={'filter-category':'category','filter-fragrance':'fragrance','filter-brand':'brand','filter-max':'max','filter-sort':'sort'};
  if(filters[t.id]){state.shop[filters[t.id]]=t.id==='filter-max'?Number(t.value):t.value;updateShop();return}
  if(t.id==='quiz-type'){if(state.prefs.category==='Haircare')state.prefs.hair=t.value;else state.prefs.skin=t.value;return}
  if(t.dataset.slot){state.slots[t.dataset.slot]=t.value;render();return}
  if(t.dataset.compareSlot!==undefined){const i=Number(t.dataset.compareSlot);let x=[...state.compare];x[i]=t.value;x=x.filter(Boolean);state.compare=[...new Set(x)].slice(0,3);safeSet('mfbeauty_compare',state.compare);render();return}
 });
 document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='filter-search'){state.shop.q=t.value;updateShop();return}
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&state.modal){closeModal();return}
  if(e.key==='Enter'&&e.target.id==='header-search'){state.shop.q=e.target.value;navigate('shop')}
 });
 document.addEventListener('submit',e=>{if(e.target.id==='newsletter-form'){e.preventDefault();e.target.reset();toast('No email sent or stored. Connect an authorized provider and consent system for production.','newsletter-message')}});
 window.addEventListener('hashchange',()=>{if(!location.hash.startsWith('#/'))return;state.modal=null;state.mobile=false;render();window.scrollTo(0,0);focusHeading()});
 if(!location.hash)location.hash='#/home';render();
})();

// Phone swipe cue: arrows and dots under the swipe row so it is obvious the cards scroll sideways. Hidden on desktop by CSS.
(function(){if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;var SEL='.shorts-reel';
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
