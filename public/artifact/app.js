/* PIXELBRUTE — interactions */
(function () {
  "use strict";

  /* ---------- Nav scroll state + mobile ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".nav__burger");
  var mobile = document.querySelector(".nav__mobile");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
    var sticky = document.querySelector(".sticky-cta");
    if (sticky) sticky.classList.toggle("show", window.scrollY > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      mobile.classList.toggle("open");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobile.classList.remove("open"); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function revealNow(el) { el.classList.add("in"); }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 800) * 0.96 && r.bottom > 0;
  }
  // Reveal anything already in the viewport on load immediately.
  reveals.forEach(function (el) { if (inView(el)) revealNow(el); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { revealNow(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  } else {
    reveals.forEach(revealNow);
  }
  // Failsafe: if observers never fire (hidden iframe, export), reveal on scroll + timer.
  function scrollReveal() { reveals.forEach(function (el) { if (!el.classList.contains("in") && inView(el)) revealNow(el); }); }
  window.addEventListener("scroll", scrollReveal, { passive: true });
  setTimeout(function () { reveals.forEach(revealNow); }, 2600);

  /* ---------- Témoignages ---------- */
  var tData = window.__TESTIMONIALS || [];
  var tBtns = document.querySelectorAll(".tm__btn");
  var tCard = document.getElementById("tm-card");
  function renderT(i) {
    var d = tData[i]; if (!d || !tCard) return;
    tBtns.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    tCard.innerHTML =
      '<div class="tm__quote-mark">&ldquo;</div>' +
      '<div class="tm__body">' +
        '<div class="tm__stars">★★★★★</div>' +
        '<blockquote class="tm__q">' + d.quote + '</blockquote>' +
        '<div class="tm__author">' +
          '<div class="tm__avatar">' + d.initial + '</div>' +
          '<div class="meta"><div class="nm">' + d.name + '</div><div class="rl">' + d.role + '</div></div>' +
          '<div class="tm__src">' + d.src + '</div>' +
        '</div>' +
      '</div>';
    tCard.style.animation = "none"; void tCard.offsetWidth; tCard.style.animation = "tmIn 500ms cubic-bezier(.2,.8,.2,1)";
  }
  tBtns.forEach(function (b, i) { b.addEventListener("click", function () { renderT(i); }); });
  if (tData.length) renderT(0);

  /* ---------- FAQ ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  faqItems.forEach(function (it) {
    var q = it.querySelector(".faq__q");
    q.addEventListener("click", function () {
      var open = it.classList.contains("open");
      faqItems.forEach(function (o) { o.classList.remove("open"); });
      if (!open) it.classList.add("open");
    });
  });
  var faqFilters = document.querySelectorAll(".faq__filter");
  faqFilters.forEach(function (f) {
    f.addEventListener("click", function () {
      faqFilters.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      f.setAttribute("aria-pressed", "true");
      var cat = f.getAttribute("data-cat");
      faqItems.forEach(function (it) {
        var show = cat === "all" || it.getAttribute("data-cat") === cat;
        it.style.display = show ? "" : "none";
        it.classList.remove("open");
      });
    });
  });

  /* ---------- Simulateur ---------- */
  var sim = document.querySelector(".sim");
  if (sim) {
    var state = { type: "vitrine", pages: "1-5", options: {} };
    var PRICES = {
      type: { landing: 1200, vitrine: 2200, refonte: 2800, ecommerce: 5500 },
      pages: { "1-5": 1, "6-10": 1.35, "11-20": 1.8 },
      options: { resa: 1200, shooting: 900, multi: 800, dashboard: 1500, seo: 500 }
    };
    var LABELS = {
      type: { landing: "Landing page", vitrine: "Site vitrine", refonte: "Refonte", ecommerce: "E-commerce" },
      options: { resa: "Réservation en ligne", shooting: "Shooting photo", multi: "Multilingue", dashboard: "Dashboard admin", seo: "Pack SEO" }
    };
    function fmt(n) { return n.toLocaleString("fr-BE").replace(/\u202f/g, "\u00a0"); }
    function compute() {
      var base = PRICES.type[state.type];
      var sub = Math.round(base * PRICES.pages[state.pages]);
      var rows = [{ k: LABELS.type[state.type], v: fmt(base) + " €" }];
      if (PRICES.pages[state.pages] !== 1) rows.push({ k: "Volume de pages (" + state.pages + ")", v: "×" + PRICES.pages[state.pages] });
      var total = sub;
      Object.keys(state.options).forEach(function (k) {
        if (state.options[k]) { total += PRICES.options[k]; rows.push({ k: LABELS.options[k], v: "+" + fmt(PRICES.options[k]) + " €" }); }
      });
      var lo = Math.round(total * 0.92 / 50) * 50;
      var hi = Math.round(total * 1.12 / 50) * 50;
      var tEl = document.getElementById("sim-total");
      var rEl = document.getElementById("sim-range");
      var sEl = document.getElementById("sim-sum");
      if (tEl) tEl.innerHTML = "≈ " + fmt(total) + " <em>€</em>";
      if (rEl) rEl.textContent = "Fourchette estimée " + fmt(lo) + " € – " + fmt(hi) + " €";
      if (sEl) sEl.innerHTML = rows.map(function (r) { return '<div class="sim__row"><span>' + r.k + "</span><span>" + r.v + "</span></div>"; }).join("");
    }
    sim.querySelectorAll("[data-sim-type]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.type = b.getAttribute("data-sim-type");
        sim.querySelectorAll("[data-sim-type]").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        compute();
      });
    });
    sim.querySelectorAll("[data-sim-pages]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.pages = b.getAttribute("data-sim-pages");
        sim.querySelectorAll("[data-sim-pages]").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        compute();
      });
    });
    sim.querySelectorAll("[data-sim-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-sim-opt");
        state.options[k] = !state.options[k];
        b.setAttribute("aria-pressed", state.options[k] ? "true" : "false");
        compute();
      });
    });
    compute();
  }

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
