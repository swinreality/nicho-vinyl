(function () {
  'use strict';
  var MARGIN = 12, GAP = 14;
  var tip = null, anchor = null, rafId = 0;

  function ensureTip() {
    if (tip && tip.isConnected) return tip;
    tip = document.querySelector('.tooltip-bio');
    if (!tip) return null;
    if (tip.parentElement !== document.body) document.body.appendChild(tip);
    return tip;
  }

  function place() {
    var el = ensureTip();
    if (!el || !anchor || !el.classList.contains('active')) return;

    var a = anchor.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;

    el.style.maxWidth = Math.min(340, vw - MARGIN * 2) + 'px';
    el.style.maxHeight = Math.min(vh - MARGIN * 2, 420) + 'px';

    var w = el.offsetWidth, h = el.offsetHeight, left;

    if (a.right + GAP + w <= vw - MARGIN)     left = a.right + GAP;
    else if (a.left - GAP - w >= MARGIN)      left = a.left - GAP - w;
    else                                      left = (vw - w) / 2;
    left = Math.min(Math.max(MARGIN, left), vw - MARGIN - w);

    var top = a.top + a.height / 2 - h / 2;
    top = Math.min(Math.max(MARGIN, top), vh - MARGIN - h);

    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
  }

  function schedule() { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(place); }

  function init() {
    var el = ensureTip();
    if (!el) return;
    new MutationObserver(schedule).observe(el, {
      attributes: true, attributeFilter: ['class'],
      childList: true, characterData: true, subtree: true
    });
    document.addEventListener('pointerover', function (e) {
      var c = e.target.closest ? e.target.closest('.image-container') : null;
      if (c) anchor = c;
    }, true);
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') el.classList.remove('active');
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
