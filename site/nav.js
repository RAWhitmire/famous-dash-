/* ===========================================================
   BECOMING FAMOUS — Shared Navigation
   Auto-injects the unified site nav into every page.

   Usage in HTML:
     <body>
       <div id="site-nav-mount" data-section="life"></div>
       ...page content...
       <script src="../nav.js"></script>
     </body>

   The data-section attribute tells nav.js which section the
   current page belongs to (so the section dropdown shows the
   right options).
   =========================================================== */

(function(){
  // Detect path depth to compute relative URLs ("../" prefix etc.)
  // /site/index.html → depth 0 (root pages)
  // /site/life/index.html → depth 1 (one level deep)
  var pathParts = window.location.pathname.split('/').filter(Boolean);
  var fileName = pathParts[pathParts.length - 1] || 'index.html';
  var depth = 0;
  // If current file lives inside a section folder (life/content/money/formats/acting), depth = 1
  var KNOWN_SECTIONS = ['life','content','money','formats','acting','blog'];
  // Walk the whole path — if ANY segment is a known section, we're inside one.
  // This handles both /blog/index.html and bare /blog/ URLs.
  for (var i = 0; i < pathParts.length; i++) {
    if (KNOWN_SECTIONS.indexOf(pathParts[i]) !== -1) {
      depth = 1;
      break;
    }
  }
  var prefix = depth === 0 ? './' : '../';

  // Master site map — single source of truth for all pages.
  var SITE = [
    {key:'home', label:'Home', url:'index.html', depth:0},
    {key:'now', label:'Now', url:'now.html', depth:0},
    {key:'wins', label:'Wins', url:'wins.html', depth:0},
    {key:'lexicon', label:'Lexicon', url:'lexicon.html', depth:0},
    {key:'inputs', label:'Inputs', url:'inputs.html', depth:0},
    {key:'blog', label:'Writing', url:'blog/index.html', depth:0},
    {key:'press', label:'Press', url:'press.html', depth:0},
    {key:'long-arc', label:'Long Arc', url:'long-arc.html', depth:0},
    {key:'life', label:'Life', url:'life/index.html', depth:0, color:'pop5', children:[
      {label:'Today + day-shape', url:'life/index.html'},
      {label:'Weekly Rhythm', url:'life/rhythm.html'},
      {label:'Meals', url:'life/meals.html'},
      {label:'Sleep', url:'life/sleep.html'},
      {label:'Chores', url:'life/chores.html'},
      {label:'Acting Practice', url:'life/acting.html'}
    ]},
    {key:'content', label:'Reference', url:'content/index.html', depth:0, color:'pop6', children:[
      {label:'Reference index', url:'content/index.html'},
      {label:'Foundation v1.2', url:'foundation.html'},
      {label:'Production Playbook', url:'content/production-playbook.html'},
      {label:'Format Library', url:'formats/library.html'},
      {label:'Polina Arc', url:'content/polina-arc.html'}
    ]},
    {key:'money', label:'Money', url:'money/index.html', depth:0, color:'pop', children:[
      {label:'Overview + Quit Math', url:'money/index.html'},
      {label:'9 Streams', url:'money/streams.html'},
      {label:'Projections', url:'money/projections.html'},
      {label:'8-Month Roadmap', url:'money/roadmap.html'},
      {label:'DT IP Strategy', url:'money/ip.html'},
      {label:'Risks', url:'money/risks.html'},
      {label:'Brand Pipeline', url:'money/pipeline.html'},
      {label:'Cash Flow', url:'money/cashflow.html'},
      {label:'Tax + Expenses', url:'money/tax.html'},
      {label:'Media Kit', url:'money/media-kit.html'}
    ]},
    {key:'formats', label:'Formats', url:'formats/index.html', depth:0, color:'pop4', children:[
      {label:'Method', url:'formats/index.html'},
      {label:'15-Format Library', url:'formats/library.html'}
    ]},
    {key:'5min', label:'Five min', url:'5min.html', depth:0},
    {key:'sitemap', label:'Sitemap', url:'sitemap.html', depth:0},
    {key:'random', label:'Random page →', url:'random.html', depth:0}
  ];

  // Determine current section from data attribute on mount point
  var mount = document.getElementById('site-nav-mount');
  var section = mount ? (mount.getAttribute('data-section') || '') : '';
  var pageLabel = mount ? (mount.getAttribute('data-page') || '') : '';

  // Build section dropdown if applicable
  var sectionHTML = '';
  if (section && section !== 'home' && section !== 'long-arc') {
    var sec = SITE.filter(function(s){return s.key===section})[0];
    if (sec && sec.children) {
      sectionHTML = '<select class="section-jump" onchange="if(this.value)window.location.href=this.value">';
      sectionHTML += '<option value="" disabled selected>📑 Jump in ' + sec.label.replace(/^[^ ]+ /,'') + '</option>';
      sec.children.forEach(function(child){
        sectionHTML += '<option value="' + prefix + child.url + '">' + child.label + '</option>';
      });
      sectionHTML += '</select>';
    }
  }

  // Build page (top-level) dropdown — appears on every page
  var pageDropdownHTML = '<select class="page-jump" onchange="if(this.value)window.location.href=this.value">';
  // Find current page label for placeholder
  var currentLabel = pageLabel || (function(){
    var p = SITE.filter(function(s){return s.key===section})[0];
    return p ? p.label : 'Becoming Famous';
  })();
  pageDropdownHTML += '<option value="" disabled selected>📍 ' + currentLabel + '</option>';
  SITE.forEach(function(s){
    pageDropdownHTML += '<option value="' + prefix + s.url + '">' + s.label + '</option>';
  });
  pageDropdownHTML += '</select>';

  // Build full nav
  var navHTML = '<nav class="site-nav">';
  navHTML += '<a href="' + prefix + 'index.html" class="brand">Becoming&nbsp;Famous</a>';
  navHTML += '<div class="selectors">';
  navHTML += sectionHTML;
  navHTML += pageDropdownHTML;
  navHTML += '<button class="theme-toggle" id="theme-toggle" title="Toggle light/dark" aria-label="Toggle theme">◐</button>';
  navHTML += '</div>';
  navHTML += '</nav>';

  if (mount) mount.outerHTML = navHTML;
})();

/* ===========================================================
   SHARED UTILITIES — runs on every page that loads nav.js
   =========================================================== */

// Dark mode — manual toggle wins; otherwise respect OS preference
(function(){
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch(e){}
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
  } else if (saved === 'light') {
    // explicit light, do nothing
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme','dark');
  }

  function attachToggle(){
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme','light'); } catch(e){}
      } else {
        document.documentElement.setAttribute('data-theme','dark');
        try { localStorage.setItem('theme','dark'); } catch(e){}
      }
    });
  }
  attachToggle();
})();

// Hover prefetch — when you hover an internal link for >100ms, prefetch the page
(function(){
  var prefetched = {};
  var hoverTimer = null;
  function prefetch(href){
    if (prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
  document.addEventListener('mouseover', function(e){
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('#') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('http') === 0) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function(){ prefetch(a.href); }, 100);
  });
  document.addEventListener('mouseout', function(){ clearTimeout(hoverTimer); });
})();

// Persistent footer — auto-injected on every page (replaces any existing <footer>)
(function(){
  // Skip if a custom footer is opted out via data-no-auto-footer on body
  if (document.body && document.body.hasAttribute('data-no-auto-footer')) return;

  var pathParts = window.location.pathname.split('/').filter(Boolean);
  var KNOWN = ['life','content','money','formats','acting','blog'];
  var prefix = './';
  for (var i = 0; i < pathParts.length; i++) {
    if (KNOWN.indexOf(pathParts[i]) !== -1) { prefix = '../'; break; }
  }

  var footerHTML = '<footer class="site-footer"><div class="ft-inner">' +
    '<p class="ft-thesis">A personal working document. Static by design — the schedule and the plan get edited by hand when something material changes. No live data, no auto-sync.</p>' +
    '<div class="ft-grid">' +
      '<div><h4>Life</h4><ul>' +
        '<li><a href="' + prefix + 'life/index.html">Today + day-shape</a></li>' +
        '<li><a href="' + prefix + 'life/rhythm.html">Weekly rhythm</a></li>' +
        '<li><a href="' + prefix + 'life/meals.html">Meals</a></li>' +
        '<li><a href="' + prefix + 'life/sleep.html">Sleep</a></li>' +
        '<li><a href="' + prefix + 'life/chores.html">Chores</a></li>' +
        '<li><a href="' + prefix + 'life/acting.html">Acting practice</a></li>' +
      '</ul></div>' +
      '<div><h4>Reference</h4><ul>' +
        '<li><a href="' + prefix + 'foundation.html">Foundation</a></li>' +
        '<li><a href="' + prefix + 'content/production-playbook.html">Production playbook</a></li>' +
        '<li><a href="' + prefix + 'formats/library.html">Format library</a></li>' +
        '<li><a href="' + prefix + 'content/polina-arc.html">Polina arc</a></li>' +
      '</ul></div>' +
      '<div><h4>Money</h4><ul>' +
        '<li><a href="' + prefix + 'money/index.html">Overview</a></li>' +
        '<li><a href="' + prefix + 'money/streams.html">Nine streams</a></li>' +
        '<li><a href="' + prefix + 'money/projections.html">Projections</a></li>' +
        '<li><a href="' + prefix + 'money/roadmap.html">8-month roadmap</a></li>' +
        '<li><a href="' + prefix + 'money/ip.html">DT IP strategy</a></li>' +
      '</ul></div>' +
      '<div><h4>More</h4><ul>' +
        '<li><a href="' + prefix + 'now.html">Now</a></li>' +
        '<li><a href="' + prefix + '5min.html">Five min ⏱</a></li>' +
        '<li><a href="' + prefix + 'wins.html">Wins</a></li>' +
        '<li><a href="' + prefix + 'lexicon.html">Lexicon</a></li>' +
        '<li><a href="' + prefix + 'inputs.html">Inputs</a></li>' +
        '<li><a href="' + prefix + 'blog/index.html">Writing</a></li>' +
        '<li><a href="' + prefix + 'press.html">Press</a></li>' +
        '<li><a href="' + prefix + 'long-arc.html">Long arc</a></li>' +
        '<li><a href="' + prefix + 'random.html">Random page →</a></li>' +
        '<li><a href="' + prefix + 'sitemap.html">Sitemap</a></li>' +
      '</ul></div>' +
    '</div>' +
    '<div class="ft-bottom">' +
      '<span>Becoming Famous · @rawhitmire · @discounttrek</span>' +
      '<span><a href="' + prefix + 'sitemap.html">Sitemap</a> · Last reviewed Apr 30, 2026</span>' +
    '</div>' +
  '</div></footer>';

  // Replace any existing <footer> element OR append at end of body
  var existing = document.querySelector('body > footer');
  if (existing) {
    existing.outerHTML = footerHTML;
  } else if (document.body) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
})();

// Gumball — homepage random-3-wins picker. Pulls from wins.html and shuffles on every page load.
(function(){
  var slot = document.getElementById('gumball');
  if (!slot) return;
  var url = (function(){
    var p = window.location.pathname.split('/').filter(Boolean);
    var KNOWN = ['life','content','money','formats','acting','blog'];
    for (var i = 0; i < p.length; i++) if (KNOWN.indexOf(p[i]) !== -1) return '../wins.html';
    return 'wins.html';
  })();
  fetch(url).then(function(r){ return r.text(); }).then(function(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var entries = Array.prototype.slice.call(doc.querySelectorAll('article.win-entry'));
    if (!entries.length) return;
    // shuffle
    for (var i = entries.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = entries[i]; entries[i] = entries[j]; entries[j] = t;
    }
    var pick = entries.slice(0, 3);
    slot.innerHTML = pick.map(function(e){
      return '<article class="gum-entry">' +
        '<span class="gum-date">' + (e.querySelector('.win-date') ? e.querySelector('.win-date').textContent : '') + '</span>' +
        '<h4>' + (e.querySelector('h3') ? e.querySelector('h3').innerHTML : '') + '</h4>' +
        '<p>' + (e.querySelector('p') ? e.querySelector('p').textContent : '') + '</p>' +
      '</article>';
    }).join('');
  }).catch(function(){ /* offline / fetch failed — fail quietly */ });
})();

// Floating scroll-to-top button — auto-injected on every page
(function(){
  if (document.getElementById('scroll-top-btn')) return; // don't double-inject
  var btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.setAttribute('title', 'Back to top');
  btn.textContent = '↑'; // ↑
  document.body.appendChild(btn);

  function check(){
    if (window.scrollY > 600) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  window.addEventListener('scroll', check, { passive: true });
  btn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  check();
})();

// Auto-assign IDs to .vid cards based on their .pill.id text
// (used by phase-1-scripts.html and similar script-style pages
// — runs harmlessly on pages without .vid elements)
(function(){
  document.querySelectorAll('.vid').forEach(function(vid){
    if (vid.id) return;
    var idPill = vid.querySelector('.pill.id');
    if (idPill) {
      var text = idPill.textContent.split('·')[0].trim();
      vid.id = text.replace(/\s+/g,'-');
    }
  });
})();
