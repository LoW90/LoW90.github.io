/* Your Private Shortlist: the shared Keep step for every Many Faces storefront (D-026).
   Copied unchanged into each store as shopify/theme/assets/mf-shortlist.js by scripts/shortlist.mjs.
   Reads its per-store settings from <script type="application/json" id="mf-shortlist-config">.
   Each store's own script provides window.MF_SHORTLIST = {snapshot(), restore(data), open()}:
     snapshot() -> the shopper's shortlist as plain JSON data, or null when nothing is saved
     restore(data) -> put that shortlist back on this device
     open() -> show the store's saved view
     ids() (optional) -> the saved product handles, added to the sign-up as keep-<handle> tags
   The shortlist link carries the shortlist itself (no account, no database). Email sign-up uses Shopify's own
   customer form, tagged with the store, so each store keeps a separate list. Nothing here moves or pops up. */
(() => {
  'use strict';
  const configEl = document.getElementById('mf-shortlist-config');
  if (!configEl) return;
  let C;
  try { C = JSON.parse(configEl.textContent); } catch { return; }
  const PARAM = 'mfkeep', MAX_LINK = 4000, LINK_KEY = 'mf-shortlist-link:' + C.store;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const adapter = () => (window.MF_SHORTLIST && typeof window.MF_SHORTLIST.snapshot === 'function' ? window.MF_SHORTLIST : null);

  /* base64url of UTF-8 JSON, so any shortlist survives a URL and an email client. */
  function encode(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(text) {
    const b64 = String(text).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - b64.length % 4) % 4));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
  }

  function snapshot() {
    try { const a = adapter(); return a ? a.snapshot() ?? null : null; } catch { return null; }
  }

  /** The shortlist link for the current shortlist, or null when empty or too long for a link. */
  function shortlistLink(value = snapshot()) {
    if (value == null) return null;
    const url = new URL(C.home || '/', location.origin);
    url.searchParams.set(PARAM, encode(value));
    const text = url.toString();
    return text.length <= MAX_LINK ? text : null;
  }

  function remember(link) { try { if (link) sessionStorage.setItem(LINK_KEY, link); } catch { /* private mode */ } }
  function remembered() { try { return sessionStorage.getItem(LINK_KEY); } catch { return null; } }

  async function copy(text, button) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch { /* fall back to selecting the field */ }
    const field = button.closest('[data-mf-keep]')?.querySelector('.mf-keep__link input');
    if (field) { field.closest('.mf-keep__link').hidden = false; field.value = text; if (!ok) field.select(); }
    button.textContent = ok ? 'Link copied' : 'Select the link below and copy it';
  }

  /* Customer tags carry the store and the saved handles, so the store's list knows what each shopper kept. */
  function tags() {
    const out = ['newsletter', 'mf-keep', C.store];
    try {
      const ids = adapter()?.ids?.() || [];
      for (const id of ids.slice(0, 10)) { const t = String(id).toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 60); if (t) out.push('keep-' + t); }
    } catch { /* tags stay minimal */ }
    return out.join(',');
  }

  const posted = () => new URLSearchParams(location.search).get('customer_posted') === 'true';

  function panel() {
    const L = C.labels;
    const section = document.createElement('section');
    section.className = 'mf-keep';
    section.dataset.mfKeep = '';
    section.setAttribute('aria-label', L.keepTitle);
    section.innerHTML =
      `<p class="mf-keep__eyebrow">Your private shortlist</p>`
      + `<h2 class="mf-keep__title">${esc(L.keepTitle)}</h2>`
      + `<div class="mf-keep__form-wrap">`
      + `<p class="mf-keep__note">${esc(L.keepNote)}</p>`
      + `<form class="mf-keep__form" method="post" action="${esc(C.contactUrl || '/contact')}#mf-keep" accept-charset="UTF-8">`
      + `<input type="hidden" name="form_type" value="customer"><input type="hidden" name="utf8" value="✓">`
      + `<input type="hidden" name="contact[tags]" value="${esc(tags())}">`
      + `<label class="mf-keep__label">Email<input type="email" name="contact[email]" required autocomplete="email" inputmode="email" maxlength="160"></label>`
      + `<button type="submit" class="${esc(C.classes.primary)} mf-keep__primary">${esc(L.keep)}</button>`
      + `</form>`
      + `<p class="mf-keep__fine">${esc(C.consent)} <a href="${esc(C.privacyUrl)}">Privacy</a></p>`
      + `</div>`
      + `<p class="mf-keep__done" hidden>${esc(C.thanks)}</p>`
      + `<p class="mf-keep__alt"><button type="button" class="mf-keep__copy">Copy my shortlist link</button>`
      + `<span aria-hidden="true"> · </span><a class="mf-keep__ask" href="${esc(C.askUrl)}">${esc(L.ask)}</a></p>`
      + `<p class="mf-keep__link" hidden><label>Your shortlist link<input type="url" readonly></label></p>`;
    section.querySelector('form').addEventListener('submit', e => { e.currentTarget.querySelector('[name="contact[tags]"]').value = tags(); remember(shortlistLink()); });
    section.querySelector('.mf-keep__copy').addEventListener('click', e => {
      const link = shortlistLink() || remembered();
      if (link) copy(link, e.currentTarget);
      else e.currentTarget.textContent = 'This shortlist is too large for a link; use the store\'s export instead';
    });
    return section;
  }

  /* Show the panel wherever the store has a shortlist to keep; after sign-up, show thanks and the link. */
  function refresh() {
    const value = snapshot(), justPosted = posted();
    for (const selector of C.mounts) {
      for (const host of document.querySelectorAll(selector)) {
        let el = host.querySelector(':scope > [data-mf-keep]');
        if (!el) { el = panel(); host.appendChild(el); }
        el.hidden = value == null && !justPosted;
        el.querySelector('[name="contact[tags]"]').value = tags();
        el.querySelector('.mf-keep__form-wrap').hidden = justPosted;
        el.querySelector('.mf-keep__done').hidden = !justPosted;
        if (justPosted) {
          const link = remembered() || shortlistLink(value);
          const box = el.querySelector('.mf-keep__link');
          if (link) { box.hidden = false; box.querySelector('input').value = link; }
        }
      }
    }
  }

  /* Outbound buttons get one short disclosure line right beside them (FTC: close to the link, not only in a footer). */
  function noteOutbound() {
    if (!C.outbound) return;
    for (const a of document.querySelectorAll(C.outbound)) {
      if (a.dataset.mfBuyNote) continue;
      a.dataset.mfBuyNote = '1';
      const note = document.createElement('small');
      note.className = 'mf-buy-note';
      note.textContent = C.buyNote;
      a.insertAdjacentElement('afterend', note);
    }
  }

  /* A shortlist link opened on another device: offer to put the shortlist back, in the page, never in a pop-up. */
  function offerRestore() {
    const params = new URLSearchParams(location.search);
    const raw = params.get(PARAM);
    if (!raw) return;
    let data;
    try { data = decode(raw); } catch { data = null; }
    params.delete(PARAM);
    const clean = location.pathname + (params.toString() ? '?' + params : '') + location.hash;
    const a = adapter();
    if (!data || !a) { history.replaceState(history.state, '', clean); return; }
    const bar = document.createElement('div');
    bar.className = 'mf-restore';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Your saved shortlist');
    bar.innerHTML = `<p>${esc(C.labels.restorePrompt)}</p><button type="button" class="${esc(C.classes.primary)}">${esc(C.labels.restore)}</button>`
      + `<button type="button" class="mf-restore__later">Not now</button>`;
    bar.querySelector('.mf-restore__later').addEventListener('click', () => { bar.remove(); history.replaceState(history.state, '', clean); });
    bar.querySelector(`button:not(.mf-restore__later)`).addEventListener('click', () => {
      history.replaceState(history.state, '', clean);
      try { a.restore(data); } catch { /* a malformed link changes nothing */ }
      bar.remove();
      try { a.open?.(); } catch { /* the store stays where it is */ }
      refresh();
    });
    const target = document.querySelector(C.restoreTarget || 'main') || document.body;
    target.prepend(bar);
  }

  let queued = false;
  const schedule = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; refresh(); noteOutbound(); }); };

  function start() {
    offerRestore();
    refresh();
    noteOutbound();
    new MutationObserver(schedule).observe(document.body, {childList: true, subtree: true});
    for (const type of ['click', 'change', 'storage', 'hashchange']) window.addEventListener(type, schedule, {passive: true});
  }

  window.MF_SHORTLIST_LINK = {encode, decode, link: shortlistLink, refresh: schedule};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
