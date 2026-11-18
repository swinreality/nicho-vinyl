(function () {
  'use strict';
  var MARGIN = 12, GAP = 14;
  var tip, anchor, running = false;

  function getTip() {
    if (!tip) {
      tip = document.getElementById('tooltip-bio');
      if (tip && tip.parentElement !== document.body) document.body.appendChild(tip);
    }
    return tip;
  }

  function getAnchor() {
    if (!anchor) anchor = document.getElementById('image-container');
    if (!anchor) return null;
    return anchor.getBoundingClientRect().width ? anchor : null;
  }

  function loop() {
    var el = getTip(), anc = getAnchor();
    if (el && anc) {
      var vis = getComputedStyle(el).display !== 'none';
      if (vis) {
        var a = anc.getBoundingClientRect();
        var vw = window.innerWidth, vh = window.innerHeight;
        el.style.maxWidth = Math.min(340, vw - MARGIN * 2) + 'px';
        el.style.maxHeight = Math.min(vh - MARGIN * 2, 420) + 'px';

        var w = el.offsetWidth, h = el.offsetHeight, left;

        if (a.left - GAP - w >= MARGIN)            left = a.left - GAP - w;
        else if (a.right + GAP + w <= vw - MARGIN) left = a.right + GAP;
        else                                       left = MARGIN;

        left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, vw - MARGIN - w));
        var top = Math.min(Math.max(MARGIN, a.top + a.height / 2 - h / 2), Math.max(MARGIN, vh - MARGIN - h));

        el.style.left = Math.round(left) + 'px';
        el.style.top = Math.round(top) + 'px';
      }
    }
    if (running) requestAnimationFrame(loop);
  }

  function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
