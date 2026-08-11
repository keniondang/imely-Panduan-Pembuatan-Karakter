/* ---- i18n: language resolution, loader, string lookup, DOM hydration ----
   This file is the ONLY script tag in index.html (besides the Supabase SDK).
   It resolves the market, loads that market's pack + the ID fallback pack,
   then loads store/auth/app and calls App.boot().

   To add a market:
     1. add an entry to I18N.MARKETS below
     2. drop in lang-xx.js  (UI strings)
     3. drop in content-xx.js (PHASES / PANDUAN / EXAMPLES / CHECKS)
   Nothing else changes.
*/

var I18N = (function () {

  /* ---------- registry of markets ---------- */
  var MARKETS = [
    { code: 'id', label: 'Bahasa Indonesia', htmlLang: 'id' },
    { code: 'en', label: 'English',          htmlLang: 'en' }
    /* { code:'zh-TW', label:'\u7E41\u9AD4\u4E2D\u6587', htmlLang:'zh-Hant-TW' }, */
    /* { code:'th',    label:'\u0E44\u0E17\u0E22',        htmlLang:'th' },        */
  ];

  var FALLBACK = 'id';
  var LS_KEY = 'imely_lang';

  var uiPacks = {};      // code -> { 'key': 'text' }
  var contentPacks = {}; // code -> { PHASES, PANDUAN, EXAMPLES, CHECKS }
  var current = FALLBACK;

  function known(code) {
    for (var i = 0; i < MARKETS.length; i++) if (MARKETS[i].code === code) return MARKETS[i];
    return null;
  }

  /* ---------- resolution: ?lang= > localStorage > navigator > fallback ---------- */
  function resolve() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q && known(q)) { try { localStorage.setItem(LS_KEY, q); } catch (e) {} return q; }

    var saved = null;
    try { saved = localStorage.getItem(LS_KEY); } catch (e) {}
    if (saved && known(saved)) return saved;

    var navs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < navs.length; i++) {
      var n = String(navs[i]);
      if (known(n)) return n;                                   // exact, e.g. zh-TW
      var base = n.split('-')[0];
      if (known(base)) return base;                             // en-GB -> en
    }
    return FALLBACK;
  }

  /* ---------- registration (called by lang-*.js / content-*.js) ---------- */
  function registerUI(code, obj) { uiPacks[code] = obj; }
  function registerContent(code, obj) { contentPacks[code] = obj; }

  /* ---------- lookup ---------- */
  function t(key, vars) {
    var pack = uiPacks[current] || {};
    var s = pack[key];
    if (s === undefined) s = (uiPacks[FALLBACK] || {})[key];
    if (s === undefined) return key;                             // visible, so gaps are obvious
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    return s;
  }

  /* ---------- content: per-key fallback so a market can ship progressively ---------- */
  function buildContent() {
    var base = contentPacks[FALLBACK] || {};
    var pack = contentPacks[current] || {};
    var out = {};
    // Whole-object fallback, deliberately not key-by-key. Example characters
    // are market-native people, not translations of each other, so a market
    // that has its own cast uses only its own cast. A market with no
    // content-xx.js yet shows the Indonesian one rather than an empty app.
    ['PHASES', 'PANDUAN', 'EXAMPLES', 'CHECKS'].forEach(function (k) { out[k] = pack[k] || base[k]; });
    return out;
  }

  /* ---------- DOM hydration for static markup in index.html ----------
     data-i18n       -> textContent
     data-i18n-html  -> innerHTML (strings that carry <b>, <code> etc.)
     data-i18n-ph    -> placeholder
     data-i18n-aria  -> aria-label
     data-i18n-title -> document title
  */
  function applyDom(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    var m = known(current);
    document.documentElement.lang = m ? m.htmlLang : current;
    document.title = t('app.title');
  }

  /* ---------- switching ---------- */
  function setLang(code) {
    if (!known(code) || code === current) return;
    try { localStorage.setItem(LS_KEY, code); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.delete('lang');   // stored preference wins from here on
    location.replace(u.toString());
  }

  function renderPicker() {
    var host = document.getElementById('langArea');
    if (!host) return;
    var opts = MARKETS.map(function (m) {
      return '<option value="' + m.code + '"' + (m.code === current ? ' selected' : '') + '>' + m.label + '</option>';
    }).join('');
    host.innerHTML =
      '<div class="lang-wrap">' +
      '<svg class="lang-ic" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>' +
      '<select class="lang-sel" aria-label="' + t('lang.picker') + '" onchange="I18N.setLang(this.value)">' + opts + '</select>' +
      '</div>';
  }

  /* ---------- sequential script loader ---------- */
  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = res;
      s.onerror = function () { rej(new Error('failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }
  function loadAll(list) {
    return list.reduce(function (p, src) {
      return p.then(function () { return load(src).catch(function (e) { console.warn(e.message); }); });
    }, Promise.resolve());
  }

  /* ---------- boot ---------- */
  function start() {
    current = resolve();

    var files = ['lang-' + FALLBACK + '.js', 'content-' + FALLBACK + '.js'];
    if (current !== FALLBACK) files.push('lang-' + current + '.js', 'content-' + current + '.js');
    files.push('store.js', 'auth.js', 'app.js');

    loadAll(files).then(function () {
      var c = buildContent();
      window.PHASES = c.PHASES;
      window.PANDUAN = c.PANDUAN;
      window.EXAMPLES = c.EXAMPLES;
      window.CHECKS = c.CHECKS;
      applyDom();
      renderPicker();
      if (window.App && App.boot) App.boot();
    });
  }

  return {
    MARKETS: MARKETS,
    get lang() { return current; },
    registerUI: registerUI,
    registerContent: registerContent,
    t: t,
    applyDom: applyDom,
    setLang: setLang,
    start: start
  };
})();

/* global shorthand used throughout app.js / auth.js */
function t(k, v) { return I18N.t(k, v); }

document.addEventListener('DOMContentLoaded', I18N.start);
