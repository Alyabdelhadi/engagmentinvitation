/* =========================================================
   Engagement invitation — behaviour
   1. Language (en / ar) — fills every [data-t] from invitation.js
   2. GSAP: the gate (doors → sea → names), reveals, dividers
   3. Countdown + calendar links
   4. RSVP → Google Sheet (Apps Script or Google Form), remembered locally
   ========================================================= */
(function () {
  'use strict';
  const inv = INVITATION;
  const LANG_KEY = 'invitation-lang';
  const RSVP_KEY = 'invitation-rsvp';
  const isLang = v => v === 'en' || v === 'ar';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!hasGsap) document.documentElement.classList.add('no-gsap');

  /* ---------- 1. Language ---------- */
  /* ?lang=ar in the link wins on first view; after that the visitor's choice
     is kept for the session, so a reload does not flip the page back. */
  function initialLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (isLang(q)) return q;
    try { const s = sessionStorage.getItem(LANG_KEY); if (isLang(s)) return s; } catch { /* storage unavailable */ }
    return 'en';
  }
  let lang = initialLang();
  const other = () => (lang === 'en' ? 'ar' : 'en');
  const T = () => UI[lang];
  const L = (x, l) => (x && typeof x === 'object' && 'en' in x) ? x[l || lang] : x;

  /* "ui.kicker" → UI[lang].kicker · "inv.invite.head" → INVITATION.invite.head[lang]
     "date.weekday" → dateParts · "alt.…" → the same lookup in the other language */
  function resolve(key, l) {
    l = l || lang;
    const parts = key.split('.');
    const ns = parts.shift();
    if (ns === 'alt') return resolve(parts.join('.').replace(/^(?!ui\.|date\.)/, 'inv.'), other());
    if (ns === 'ui') return UI[l][parts.join('.')];
    if (ns === 'date') return inv.dateParts[l][parts[0]];
    let cur = inv;
    for (const k of parts) cur = cur == null ? undefined : cur[k];
    return L(cur, l);
  }

  function applyLanguage() {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = T().dir;
    document.title = `${L(inv.eventTitle)} · ${L(inv.eventTitle, other())}`;
    try { sessionStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }

    $$('[data-t]').forEach(el => { const v = resolve(el.dataset.t); if (v != null) el.textContent = v; });
    $$('[data-t-placeholder]').forEach(el => { const v = resolve(el.dataset.tPlaceholder); if (v != null) el.placeholder = v; });
    $$('[data-t-aria]').forEach(el => { const v = resolve(el.dataset.tAria); if (v != null) el.setAttribute('aria-label', v); });

    const toggle = $('#lang-toggle');
    toggle.lang = other();
    toggle.setAttribute('aria-label', T().switchTo);

    renderDetails();
    renderCalendarLinks();
    countdownTick();
    rsvpRender();
    if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  $('#lang-toggle').addEventListener('click', () => { lang = other(); applyLanguage(); });

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function renderDetails() {
    const grid = $('#details-grid');
    if (!grid) return;
    grid.innerHTML = inv.details.map(d =>
      `<div><span class="ico" aria-hidden="true"><svg><use href="#i-${esc(d.icon || 'dress')}"/></svg></span><div><h3>${esc(L(d.label))}</h3><p>${esc(L(d.value))}</p></div></div>`).join('');
  }

  /* ---------- 2. GSAP ---------- */
  const names = ['#name-bride', '#name-amp', '#name-groom'];
  const DASH = 1400;   // longer than any single glyph outline at these sizes

  function setupGsap() {
    if (!hasGsap) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const foams = $$('.foam');
    foams.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len; });

    if (reduceMotion) {
      /* the doors stand open; nothing scrubs */
      gsap.set(['.portal-wall', '.portal-leaves', '.shade', '#hint', '.leak'], { autoAlpha: 0 });
      gsap.set('.hero-alt', { autoAlpha: 1 });
      gsap.set(names, { strokeDasharray: 'none', fillOpacity: 1 });
      return;
    }

    /* — the painted doorway: where the doors are on screen — */
    const gateEl = $('#gate');
    const wall = $('.portal-wall');
    const IMG = { w: 941, h: 1672 };
    const DOOR = { x: 187 / 941, y: 495 / 1672, w: 571 / 941, h: 958 / 1672, seam: (471 - 187) / 571 };
    const portal = { S: 2 };
    function layoutPortal() {
      const vw = gateEl.clientWidth, vh = gateEl.clientHeight, A = IMG.w / IMG.h;
      const wide = vw / vh > .9;
      const ph = wide ? vh * 1.15 : Math.max(vh, vw / A);   // a touch larger than the screen on wide screens, cover on phones
      const pw = ph * A;
      const pl = (vw - pw) / 2, pt = (vh - ph) / 2;
      const dx = pl + DOOR.x * pw, dy = pt + DOOR.y * ph, dw = DOOR.w * pw, dh = DOOR.h * ph;
      const cx = dx + dw / 2, cy = dy + dh / 2;
      /* grow until the hole covers the screen — the doorway is not at the centre, so the far side decides */
      portal.S = Math.max(2 * Math.max(cx, vw - cx) / dw, 2 * Math.max(cy, vh - cy) / dh) * 1.04;
      const st = gateEl.style;
      st.setProperty('--pl', pl + 'px'); st.setProperty('--pt', pt + 'px');
      st.setProperty('--pw', pw + 'px'); st.setProperty('--ph', ph + 'px');
      st.setProperty('--dx', dx + 'px'); st.setProperty('--dy', dy + 'px');
      st.setProperty('--dw', dw + 'px'); st.setProperty('--dh', dh + 'px');
      st.setProperty('--cx', cx + 'px'); st.setProperty('--cy', cy + 'px');
      st.setProperty('--seam', DOOR.seam);
      st.setProperty('--persp', Math.round(dw * 3.2) + 'px');
      wall.classList.toggle('letterboxed', pw < vw);
    }
    layoutPortal();
    window.addEventListener('resize', layoutPortal);

    /* — the gate — */
    gsap.set(names, { strokeDasharray: DASH, strokeDashoffset: DASH, fillOpacity: 0 });
    gsap.set('.door', { rotateY: 0 });

    const gate = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#gate',
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: layoutPortal
      }
    });
    gate
      .to('#hint', { autoAlpha: 0, duration: .08 }, 0)
      .to('.leak', { opacity: 1, duration: .22 }, 0)
      .to('.leak', { opacity: 0, duration: .5 }, .28)
      .to('.door.left', { rotateY: -108, duration: 1.3, ease: 'power2.inOut' }, 0)
      .to('.door.right', { rotateY: 108, duration: 1.3, ease: 'power2.inOut' }, 0)
      .to('.shade', { opacity: 0, duration: .9, ease: 'power1.out' }, .15)
      /* walking through the doorway: wall and leaves grow about the doorway until it fills the screen */
      .fromTo(['.portal-wall', '.portal-leaves'], { scale: 1 }, { scale: () => portal.S, duration: 2.2, ease: 'power2.in' }, .9)
      .fromTo('.scene', { scale: 1 }, { scale: () => (matchMedia('(min-aspect-ratio: 1/1) and (min-width: 820px)').matches ? 1.06 : 1.02), duration: 2.6, ease: 'power1.inOut' }, .6)
      .to({}, { duration: .6 });   // hold the finished view before the page scrolls on

    /* — on load: the gate settles in, the hint appears — */
    if (window.scrollY < 8) {
      gsap.from('.portal-wall, .portal-leaves', { opacity: 0, duration: 1.2, ease: 'power2.out' });
      gsap.from('.door.left',  { rotateY: -6, duration: 1.6, ease: 'power2.out' });
      gsap.from('.door.right', { rotateY: 6,  duration: 1.6, ease: 'power2.out' });
      gsap.from('#hint', { autoAlpha: 0, y: 10, duration: .8, delay: 1, ease: 'power2.out' });
    }
    $('#hint').addEventListener('click', () => {
      const st = gate.scrollTrigger;
      window.scrollTo({ top: st.start + (st.end - st.start) * .82, behavior: 'smooth' });
    });

    /* — the names draw themselves when the invitation comes into view — */
    if ($('#names-block')) {
      gsap.timeline({ scrollTrigger: { trigger: '#names-block', start: 'top 78%', once: true } })
        .to('#name-bride', { strokeDashoffset: 0, duration: 1.8 }, 0)
        .to('#name-bride', { fillOpacity: 1, duration: .6 }, 1.5)
        .to('#name-amp', { strokeDashoffset: 0, duration: .7 }, 1.7)
        .to('#name-amp', { fillOpacity: 1, duration: .4 }, 2.3)
        .to('#name-groom', { strokeDashoffset: 0, duration: 1.8 }, 2.1)
        .to('#name-groom', { fillOpacity: 1, duration: .6 }, 3.6)
        .fromTo('.hero-alt', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .6 }, 3.8);
    }

    /* — the sea panel: waves draw on, the gulls fly in, the boat drifts by — */
    if ($('.sea')) {
      const seaTl = gsap.timeline({ scrollTrigger: { trigger: '.sea-panel', start: 'top 80%', once: true } });
      seaTl
        .fromTo(foams, { strokeDashoffset: (i, el) => el.getTotalLength() }, { strokeDashoffset: 0, duration: 1.8, stagger: .12, ease: 'power1.inOut' }, 0)
        .fromTo('.bird-a', { x: -420, y: 90, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 2, ease: 'power2.out' }, .2)
        .fromTo('.bird-b', { x: 420, y: 70, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 2, ease: 'power2.out' }, .4)
        .fromTo('.boat', { x: 320 }, { x: 0, duration: 3, ease: 'power1.out' }, 0);
    }

    /* — ambient life in the view — */
    gsap.to('.boat', { y: -5, rotation: 1.6, transformOrigin: '50% 100%', duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.bird-a .bob', { y: -8, duration: 1.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.bird-b .bob', { y: -7, duration: 2.3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .6 });

    /* — reveals — */
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      const type = el.dataset.reveal;
      const trigger = { trigger: el, start: 'top 88%', once: true };
      if (type === 'stagger') {
        gsap.from(el.children, { autoAlpha: 0, y: 22, duration: .8, stagger: .1, ease: 'power2.out', scrollTrigger: trigger });
      } else if (type === 'scale') {
        gsap.from(el, { autoAlpha: 0, scale: .96, duration: 1, ease: 'power2.out', scrollTrigger: trigger });
      } else {
        gsap.from(el, { autoAlpha: 0, y: 22, duration: .9, ease: 'power2.out', scrollTrigger: trigger });
      }
    });

    /* — dividers draw themselves — */
    $$('svg.divider').forEach(svg => {
      const stems = Array.from(svg.querySelectorAll('.stem'));
      const bits = Array.from(svg.querySelectorAll('use'));
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 90%', once: true } });
      if (stems.length) {
        stems.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
        tl.to(stems, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 0);
      }
      tl.from(bits, { scale: 0, transformOrigin: '50% 50%', duration: .5, stagger: .06, ease: 'back.out(2)' }, .3);
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* <use> inside a <symbol> cannot be reached by querySelector, so the divider
     symbol is inlined into every .divider before the drawing is wired up. */
  (function inlineDividers() {
    const sym = document.getElementById('f-divider');
    if (!sym) return;
    $$('svg.divider').forEach(svg => {
      svg.innerHTML = sym.innerHTML;
    });
  })();

  /* ---------- 3. Countdown + calendar ---------- */
  const start = new Date(inv.dateISO);
  const end = new Date(inv.dateEndISO || (start.getTime() + 5 * 36e5));
  const cdBox = $('#countdown');
  const todayEl = $('#today');

  function countdownTick() {
    if (!cdBox || isNaN(start)) return;
    const fmt2 = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en', { minimumIntegerDigits: 2 });
    const fmt = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en');
    const ms = Math.max(0, start - Date.now());
    const s = Math.floor(ms / 1000);
    const over = ms === 0;
    cdBox.hidden = over;
    if (todayEl) todayEl.hidden = !over;
    if (over) return;
    cdBox.querySelector('[data-unit="days"]').textContent = fmt.format(Math.floor(s / 86400));
    cdBox.querySelector('[data-unit="hours"]').textContent = fmt2.format(Math.floor((s % 86400) / 3600));
    cdBox.querySelector('[data-unit="minutes"]').textContent = fmt2.format(Math.floor((s % 3600) / 60));
    cdBox.querySelector('[data-unit="seconds"]').textContent = fmt2.format(s % 60);
  }
  // Only tick while the tab is visible — keeps the phone cool.
  let timer = setInterval(countdownTick, 1000);
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (!document.hidden) { countdownTick(); timer = setInterval(countdownTick, 1000); }
  });

  const utc = d => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  function renderCalendarLinks() {
    if (isNaN(start)) return;
    const title = L(inv.eventTitle);
    const location = `${L(inv.venue)}, ${L(inv.location)}`;
    const details = L(inv.message);
    const gcal = $('#gcal');
    if (gcal) {
      const p = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${utc(start)}/${utc(end)}`, location, details });
      gcal.href = `https://calendar.google.com/calendar/render?${p}`;
    }
    const ics = $('#ics');
    if (ics) {
      const e = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
      const body = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Engagement Invitation//EN', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${utc(start)}-engagement@invitation`,
        `DTSTAMP:${utc(new Date())}`,
        `DTSTART:${utc(start)}`,
        `DTEND:${utc(end)}`,
        `SUMMARY:${e(title)}`,
        `LOCATION:${e(location)}`,
        `DESCRIPTION:${e(details)}`,
        'END:VEVENT', 'END:VCALENDAR', ''
      ].join('\r\n');
      ics.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
    }
    const map = $('#map-link');
    if (map && inv.mapUrl) map.href = inv.mapUrl;
  }

  /* ---------- 4. RSVP ---------- */
  /* The form is write-only from the browser: Apps Script and Google Forms
     both answer with an opaque response, so a resolved request is the
     success signal. text/plain keeps the request "simple" — no preflight,
     which Apps Script cannot answer. Until `rsvp.endpoint` is filled in,
     nothing is sent and the form says it is not connected yet. */
  async function send(name, guests) {
    const { mode, endpoint, formFields } = inv.rsvp;
    if (mode === 'form') {
      const body = new URLSearchParams();
      body.set(formFields.name, name);
      body.set(formFields.guests, String(guests));
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
      return;
    }
    await fetch(endpoint, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ name, guests, lang })
    });
  }

  const form = $('#rsvp-form');
  const nameEl = $('#name');
  const guestsEl = $('#guests');
  const noteEl = $('#form-note');
  const submitEl = form && form.querySelector('.submit');
  const doneEl = $('#rsvp-done');
  const max = inv.rsvp.maxGuests || 12;
  const connected = String(inv.rsvp.endpoint || '').trim().length > 0;
  let status = 'idle';         // idle | sending | done
  let error = null;            // name | guests | send | null
  let reply = loadReply();
  if (reply) status = 'done';

  function loadReply() {
    try {
      const r = JSON.parse(localStorage.getItem(RSVP_KEY) || 'null');
      return r && typeof r.name === 'string' && typeof r.guests === 'number' ? r : null;
    } catch { return null; }
  }
  const clamp = n => Math.min(max, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1));

  function rsvpRender() {
    if (!form) return;
    const t = T();
    const done = status === 'done' && reply;
    form.hidden = !!done;
    doneEl.hidden = !done;
    if (done) {
      $('#rsvp-summary').textContent = `${reply.name} · ${new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en').format(reply.guests)}`;
      return;
    }
    guestsEl.max = max;
    submitEl.disabled = status === 'sending';
    submitEl.textContent = status === 'sending' ? t.rsvpSending : t.rsvpButton;
    const errText = error === 'name' ? t.rsvpErrName
      : error === 'guests' ? t.rsvpErrGuests
      : error === 'send' ? (connected ? t.rsvpErrSend : t.rsvpOffline)
      : null;
    noteEl.textContent = errText || (!connected ? t.rsvpOffline : '');
    noteEl.classList.toggle('error', !!errText);
    nameEl.setAttribute('aria-invalid', error === 'name' ? 'true' : 'false');
    form.querySelectorAll('.step').forEach(b => {
      const dir = +b.dataset.step;
      b.disabled = dir < 0 ? guestsEl.valueAsNumber <= 1 : guestsEl.valueAsNumber >= max;
    });
  }

  if (form) {
    form.querySelectorAll('.step').forEach(b => b.addEventListener('click', () => {
      guestsEl.value = clamp(guestsEl.valueAsNumber + (+b.dataset.step));
      if (error === 'guests') error = null;
      rsvpRender();
    }));
    guestsEl.addEventListener('change', () => { guestsEl.value = clamp(guestsEl.valueAsNumber); rsvpRender(); });
    nameEl.addEventListener('input', () => { if (error === 'name') { error = null; rsvpRender(); } });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (status === 'sending') return;
      const name = nameEl.value.trim();
      const guests = clamp(guestsEl.valueAsNumber);
      if (!name) { error = 'name'; rsvpRender(); nameEl.focus(); return; }
      if (guests < 1 || guests > max) { error = 'guests'; rsvpRender(); return; }
      if (!connected) { error = 'send'; rsvpRender(); return; }
      error = null; status = 'sending'; rsvpRender();
      try {
        await send(name, guests);
        reply = { name, guests, at: new Date().toISOString() };
        try { localStorage.setItem(RSVP_KEY, JSON.stringify(reply)); } catch { /* ignore */ }
        status = 'done';
      } catch {
        error = 'send'; status = 'idle';
      }
      rsvpRender();
    });

    $('#rsvp-again').addEventListener('click', () => {
      try { localStorage.removeItem(RSVP_KEY); } catch { /* ignore */ }
      if (reply) { nameEl.value = reply.name; guestsEl.value = clamp(reply.guests); }
      reply = null; status = 'idle'; error = null;
      rsvpRender();
      nameEl.focus();
    });
  }

  applyLanguage();
  setupGsap();
})();
