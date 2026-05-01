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
  var KNOWN_SECTIONS = ['life','content','money','formats','acting'];
  if (pathParts.length >= 2 && KNOWN_SECTIONS.indexOf(pathParts[pathParts.length - 2]) !== -1) {
    depth = 1;
  }
  var prefix = depth === 0 ? './' : '../';

  // Master site map — single source of truth for all pages.
  var SITE = [
    {key:'home', label:'Home', url:'index.html', depth:0},
    {key:'long-arc', label:'Long Arc', url:'long-arc.html', depth:0},
    {key:'life', label:'Life', url:'life/index.html', depth:0, color:'pop5', children:[
      {label:'Today + day-shape', url:'life/index.html'},
      {label:'Weekly Rhythm', url:'life/rhythm.html'},
      {label:'Meals', url:'life/meals.html'},
      {label:'Sleep', url:'life/sleep.html'},
      {label:'Chores', url:'life/chores.html'},
      {label:'Acting Practice', url:'life/acting.html'}
    ]},
    {key:'content', label:'Strategy', url:'content/index.html', depth:0, color:'pop6', children:[
      {label:'📍 Today + KPIs', url:'content/index.html'},
      {label:'— Filming —', url:'content/phase-1-scripts.html'},
      {label:'📄 Filming Materials Index', url:'content/phase-1-scripts.html'},
      {label:'— Scheduling —', url:'content/calendar.html'},
      {label:'Sprint Calendar', url:'content/calendar.html'},
      {label:'Posting Strategy', url:'content/posting-strategy.html'},
      {label:'Filming Days', url:'content/filming.html'},
      {label:'Get Ahead Plan', url:'content/ahead.html'},
      {label:'Contingency', url:'content/contingency.html'},
      {label:'Backup Bank', url:'content/backup.html'},
      {label:'Analytics', url:'content/analytics.html'},
      {label:'— Reference —', url:'content/production-playbook.html'},
      {label:'Production Playbook', url:'content/production-playbook.html'},
      {label:'Polina Arc', url:'content/polina-arc.html'},
      {label:'Per-Post Card Spec', url:'content/posts.html'},
      {label:'Hook Templates', url:'content/scripts.html'},
      {label:'Discount Trek', url:'content/dt.html'},
      {label:'Idea Bank', url:'content/ideas.html'},
      {label:'Trend Log', url:'content/trends.html'},
      {label:'IG Plays', url:'content/ig-plays.html'}
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
      {label:'15-Format Library', url:'formats/library.html'},
      {label:'D1–D10 Sprint Plan', url:'formats/sprint-plan.html'},
      {label:'Performance Tracker', url:'formats/tracker.html'},
      {label:'Day 10 Decision', url:'formats/decision.html'}
    ]}
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
  navHTML += '</div>';
  navHTML += '</nav>';

  if (mount) mount.outerHTML = navHTML;
})();

/* ===========================================================
   SHARED UTILITIES — runs on every page that loads nav.js
   =========================================================== */

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
