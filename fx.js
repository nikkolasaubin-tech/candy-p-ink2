// Candy p.ink : transitions, apparitions et petites animations girly.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  var veil = document.querySelector('.fx-veil');

  // 1. Au chargement : le voile se retire (le logo sort)
  if (veil) {
    veil.classList.add('is-in');
    requestAnimationFrame(function () {
      setTimeout(function () { veil.classList.remove('is-in'); }, 180);
    });
    // Retour arrière : on ne laisse pas le voile fermé
    window.addEventListener('pageshow', function (e) {
      if (e.persisted && veil) veil.classList.remove('is-in');
    });
  }

  // 2. Clic sur un lien interne : le logo pop puis on change de page
  document.addEventListener('click', function (e) {
    if (reduce || !veil) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    veil.classList.add('is-in');
    setTimeout(function () { location.href = url.href; }, 650);
  });

  // 3. Apparition des blocs au défilement, en cascade
  var targets = document.querySelectorAll(
    '.card, .pillar, .work, .steps li, details, .faq-group, .section-head, .form-shell, .note-box, .grid-3 > *, .grid-2 > *, .grid-4 > *'
  );
  var seen = new Set();
  var list = [];
  targets.forEach(function (el) { if (!seen.has(el)) { seen.add(el); list.push(el); } });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    list.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 3) * 0.08) + 's';
      io.observe(el);
    });
  }

  // 4. Décorations flottantes dans les heros
  if (!reduce) {
    var symbols = ['♡', '✦', '✿', '♡', '★'];
    document.querySelectorAll('.hero, .cta').forEach(function (zone) {
      for (var i = 0; i < 6; i++) {
        var s = document.createElement('span');
        s.className = 'fx-float' + (i % 2 ? ' alt' : '');
        s.textContent = symbols[i % symbols.length];
        s.style.left = (6 + Math.random() * 88) + '%';
        s.style.animationDelay = (Math.random() * 9) + 's';
        s.style.animationDuration = (7 + Math.random() * 5) + 's';
        zone.appendChild(s);
      }
    });
  }

  // 5. Traînée de cœurs sous le curseur (souris seulement)
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var last = 0;
    var glyphs = ['♡', '✦', '✿', '★'];
    document.addEventListener('pointermove', function (e) {
      var now = Date.now();
      if (now - last < 90) return;
      last = now;
      var t = document.createElement('span');
      t.className = 'fx-trail' + (Math.random() > 0.6 ? ' butter' : '');
      t.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      t.style.left = e.clientX + 'px';
      t.style.top = e.clientY + 'px';
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 900);
    });
  }
})();
