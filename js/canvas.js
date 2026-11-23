// Unendliche Leinwand: Bewegen, Zoomen, Springen zu Entwürfen, Raster, Textanpassung (Plakat)
(function () {
  'use strict';

  var vp = document.querySelector('.viewport');
  var world = document.querySelector('.world');
  var zoomLabel = document.querySelector('.zoom-level');
  var navButtons = [].slice.call(document.querySelectorAll('[data-go]'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var MIN = 0.03, MAX = 4;
  var x = 0, y = 0, z = 1;
  var anim = null;

  // Der Browser scrollt den Viewport sonst selbst (Anker im Hash, Fokus). Die Leinwand bewegt nur die Transformation.
  function noScroll() { if (vp.scrollTop || vp.scrollLeft) { vp.scrollTop = 0; vp.scrollLeft = 0; } }
  vp.addEventListener('scroll', noScroll);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function apply() {
    world.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + z + ')';
    world.style.setProperty('--z', z);
    zoomLabel.textContent = Math.round(z * 100) + ' %';
  }

  function stopAnim() { if (anim) { cancelAnimationFrame(anim); anim = null; } }

  function zoomAt(cx, cy, nz) {
    stopAnim();
    nz = clamp(nz, MIN, MAX);
    x = cx - (cx - x) * (nz / z);
    y = cy - (cy - y) * (nz / z);
    z = nz;
    apply();
  }

  function animateTo(tx, ty, tz) {
    stopAnim();
    if (reduceMotion) { x = tx; y = ty; z = tz; apply(); return; }
    var sx = x, sy = y, sz = z, t0 = performance.now(), dur = 520;
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function step(now) {
      var t = Math.min(1, (now - t0) / dur), e = ease(t);
      // Zoom logarithmisch interpolieren, damit der Flug gleichmäßig wirkt
      var nz = Math.exp(Math.log(sz) + (Math.log(tz) - Math.log(sz)) * e);
      x = sx + (tx - sx) * e; y = sy + (ty - sy) * e; z = nz;
      apply();
      anim = t < 1 ? requestAnimationFrame(step) : null;
    }
    anim = requestAnimationFrame(step);
  }

  // Position eines Elements in Welt-Koordinaten (unabhängig von der Transformation)
  function worldRect(el) {
    var ox = 0, oy = 0, n = el;
    while (n && n !== world) { ox += n.offsetLeft; oy += n.offsetTop; n = n.offsetParent; }
    return { x: ox, y: oy, w: el.offsetWidth, h: el.offsetHeight };
  }

  function fitRect(r, pad, animate) {
    var vw = vp.clientWidth, vh = vp.clientHeight;
    var tz = clamp(Math.min((vw - pad * 2) / r.w, (vh - pad * 2) / r.h), MIN, MAX);
    var tx = (vw - r.w * tz) / 2 - r.x * tz;
    var ty = (vh - r.h * tz) / 2 - r.y * tz;
    if (animate) animateTo(tx, ty, tz); else { x = tx; y = ty; z = tz; apply(); }
  }

  function fitAll(animate) {
    fitRect({ x: 0, y: 0, w: world.offsetWidth, h: world.offsetHeight }, 24, animate);
  }

  function go(id, animate) {
    var row = id && id !== 'alle' ? document.getElementById(id) : null;
    if (row) {
      var r = worldRect(row);
      // Platz für die Rahmenbeschriftungen über der Zeile
      fitRect({ x: r.x, y: r.y - 40, w: r.w, h: r.h + 40 }, 32, animate);
    } else {
      fitAll(animate);
      id = 'alle';
    }
    navButtons.forEach(function (b) { b.setAttribute('aria-current', b.dataset.go === id ? 'true' : 'false'); });
    var hash = id === 'alle' ? location.pathname + location.search : '#' + id;
    history.replaceState(null, '', hash);
  }

  navButtons.forEach(function (b) {
    b.addEventListener('click', function () { go(b.dataset.go, true); });
  });

  function center() { return { x: vp.clientWidth / 2, y: vp.clientHeight / 2 }; }
  document.querySelectorAll('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = center(), k = b.dataset.zoom;
      if (k === 'in') zoomAt(c.x, c.y, z * 1.25);
      else if (k === 'out') zoomAt(c.x, c.y, z / 1.25);
      else {
        var tz = 1;
        animateTo(c.x - (c.x - x) * (tz / z), c.y - (c.y - y) * (tz / z), tz);
      }
    });
  });

  // Raster
  var guideBtn = document.querySelector('.guide-toggle');
  function toggleGuides() {
    var on = document.body.classList.toggle('show-guides');
    guideBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  guideBtn.addEventListener('click', toggleGuides);

  // Mausrad und Trackpad: Scrollen bewegt, Strg/Cmd + Scrollen (und Pinch) zoomt
  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    stopAnim();
    var rect = vp.getBoundingClientRect();
    var line = e.deltaMode === 1 ? 16 : 1;
    if (e.ctrlKey || e.metaKey) {
      var d = clamp(e.deltaY * line, -60, 60);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, z * Math.exp(-d * 0.008));
    } else {
      var dx = e.deltaX * line, dy = e.deltaY * line;
      if (e.shiftKey && !dx) { dx = dy; dy = 0; }
      x -= dx; y -= dy; apply();
    }
  }, { passive: false });

  // Zeiger: ein Finger oder Maus zieht, zwei Finger zoomen
  var pts = new Map(), pinch = null;
  vp.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    if (e.target.closest('button, a, input, select')) return; // Bedienelemente auf der Leinwand klickbar lassen
    stopAnim();
    vp.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vp.classList.add('dragging');
    if (pts.size === 2) startPinch();
  });
  function startPinch() {
    var p = Array.from(pts.values()), rect = vp.getBoundingClientRect();
    var cx = (p[0].x + p[1].x) / 2 - rect.left, cy = (p[0].y + p[1].y) / 2 - rect.top;
    pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, wx: (cx - x) / z, wy: (cy - y) / z, z: z };
  }
  vp.addEventListener('pointermove', function (e) {
    var prev = pts.get(e.pointerId);
    if (!prev) return;
    var cur = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, cur);
    if (pts.size === 1) {
      x += cur.x - prev.x; y += cur.y - prev.y; apply();
    } else if (pts.size === 2 && pinch) {
      var p = Array.from(pts.values()), rect = vp.getBoundingClientRect();
      var cx = (p[0].x + p[1].x) / 2 - rect.left, cy = (p[0].y + p[1].y) / 2 - rect.top;
      z = clamp(pinch.z * Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) / pinch.d, MIN, MAX);
      x = cx - pinch.wx * z; y = cy - pinch.wy * z; apply();
    }
  });
  function endPointer(e) {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 2) startPinch();
    if (!pts.size) vp.classList.remove('dragging');
  }
  vp.addEventListener('pointerup', endPointer);
  vp.addEventListener('pointercancel', endPointer);

  // Tastatur, angelehnt an Figma
  window.addEventListener('keydown', function (e) {
    if (e.altKey) return;
    var c = center(), step = e.shiftKey ? 400 : 80;
    var mod = e.ctrlKey || e.metaKey;
    switch (e.key) {
      case '+': case '=': zoomAt(c.x, c.y, z * 1.25); break;
      case '-': zoomAt(c.x, c.y, z / 1.25); break;
      case '0': if (mod) return; zoomAt(c.x, c.y, 1); break;
      case '1': case '!': if (mod) return; go('alle', true); break;
      case 'r': case 'R': if (mod) return; toggleGuides(); break;
      case 'ArrowLeft': x += step; apply(); break;
      case 'ArrowRight': x -= step; apply(); break;
      case 'ArrowUp': y += step; apply(); break;
      case 'ArrowDown': y -= step; apply(); break;
      default: return;
    }
    e.preventDefault();
  });

  // Plakat: große Zeilen so skalieren, dass die längste Zeile die Breite füllt
  function fitType() {
    document.querySelectorAll('[data-fit]').forEach(function (el) {
      el.style.fontSize = '100px';
      var max = 0;
      el.querySelectorAll('.l').forEach(function (l) { max = Math.max(max, l.offsetWidth); });
      if (max) el.style.fontSize = (100 * el.clientWidth / max) + 'px';
    });
  }

  // Schriftwahl: setzt CSS-Variablen auf der Zeile des Entwurfs, z. B. data-set='--f-big:"Tanker";--w-big:400'
  document.querySelectorAll('.font-pick').forEach(function (group) {
    var row = group.closest('.row');
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (!b) return;
      b.dataset.set.split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i > 0) row.style.setProperty(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
      });
      group.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      // Breitenanpassung neu rechnen, sobald die Schrift geladen ist
      // (fitType erzwingt das Layout und stößt damit das Laden an; fonts.ready wartet darauf)
      fitType();
      if (document.fonts) document.fonts.ready.then(fitType);
    });
  });

  // Hinweis an Eingabeart anpassen
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.getElementById('hint').textContent = 'Ziehen zum Bewegen. Zwei Finger zum Zoomen.';
  }

  function start() {
    fitType();
    var id = decodeURIComponent(location.hash.slice(1));
    go(document.getElementById(id) ? id : 'alle', false);
  }
  apply();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else window.addEventListener('load', start);
  window.addEventListener('hashchange', function () { go(decodeURIComponent(location.hash.slice(1)), true); });
})();
