/* Scroll-reveal using getBoundingClientRect (fires reliably in preview & live). */
(function () {
  var els = [].slice.call(document.querySelectorAll('.rvl'));
  if (!els.length) return;
  function check() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  check();
  // stagger nicety
  els.forEach(function (el, i) { el.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms'; });
})();
