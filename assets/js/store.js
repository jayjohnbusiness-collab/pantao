/* ============================================================================
 * PANTAO — EDITION ENGINE
 * Counter · numbered manifest · quickview · bag · phase switching.
 * Bag persists in localStorage. No dependencies. Mirrors the Shopify theme
 * so anything proven here ports straight across.
 * ==========================================================================*/
(function () {
  "use strict";

  var CFG = window.PANTAO_CONFIG || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return (CFG.currency || "$") + Number(n).toLocaleString("en-US"); };
  var roman = function (i) { return String(i + 1).padStart(2, "0"); };
  var byId = {};
  (CFG.pieces || []).forEach(function (p) { byId[p.id] = p; });

  /* ---- monochrome plate render for a piece ---- */
  function plateStyle(tone) {
    var L = tone == null ? 30 : tone;               // greyscale lightness
    return "background:" +
      "radial-gradient(120% 90% at 30% 12%, hsla(40,10%," + Math.min(L + 26, 96) + "%,0.7), transparent 55%)," +
      "radial-gradient(90% 80% at 85% 95%, hsla(40,6%," + Math.max(L - 16, 4) + "%,0.85), transparent 60%)," +
      "linear-gradient(150deg, hsl(40,7%," + (L + 6) + "%), hsl(38,9%," + Math.max(L - 8, 4) + "%));";
  }
  function plateMarkup(p, i, cls) {
    if (p.img) return '<div class="plate ' + (cls || "") + '" style="background:url(' + p.img + ') center/cover;"></div>';
    return '<div class="plate ' + (cls || "") + '" style="' + plateStyle(p.tone) + '">' +
             '<span class="plate__no">' + roman(i) + '</span>' +
           '</div>';
  }

  /* =====================================================================
   * PRELOADER
   * ===================================================================*/
  function preloader() {
    var el = $("#preloader"), bar = $(".preloader__bar span");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    var v = 0;
    var t = setInterval(function () {
      v += Math.random() * 20 + 8;
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(finish, 300); }
      bar.style.width = v + "%";
    }, 120);
    function finish() { el.classList.add("is-done"); document.body.classList.add("loaded"); revealScan(); }
  }

  /* =====================================================================
   * PHASE + CONFIG TEXT
   * ===================================================================*/
  function applyPhase() { document.body.setAttribute("data-phase", CFG.phase || "open"); }

  function bindText() {
    $$("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      if (CFG[key] != null) el.textContent = CFG[key];
    });
    var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
    var ne = $("#navEdition"); if (ne) ne.textContent = CFG.editionLabel || "";

    var fs = $("#footerSocial"); var s = CFG.social || {};
    if (fs) {
      var links = [];
      if (s.instagram) links.push('<a href="' + s.instagram + '" target="_blank" rel="noopener">Instagram</a>');
      if (s.email)     links.push('<a href="mailto:' + s.email + '">Correspond</a>');
      fs.innerHTML = links.join("");
    }

    var st = $("#stripTrack");
    if (st) {
      var unit = '<span>For the people</span><span class="dot">—</span>' +
                 '<span>Made in numbers we can name</span><span class="dot">—</span>' +
                 '<span>Once a year</span><span class="dot">—</span>';
      st.innerHTML = unit + unit;
    }
  }

  /* =====================================================================
   * COUNTER (antechamber only)
   * ===================================================================*/
  function counter() {
    if ((CFG.phase || "open") !== "antechamber") return;
    var target = new Date(CFG.opensAt).getTime();
    if (isNaN(target)) return;
    var e = { d: $("#ctDays"), h: $("#ctHours"), m: $("#ctMins"), s: $("#ctSecs") };
    var pad = function (n) { return String(Math.max(0, n)).padStart(2, "0"); };
    function tick() {
      var diff = Math.max(0, target - Date.now());
      if (e.d) e.d.textContent = pad(Math.floor(diff / 864e5));
      if (e.h) e.h.textContent = pad(Math.floor((diff % 864e5) / 36e5));
      if (e.m) e.m.textContent = pad(Math.floor((diff % 36e5) / 6e4));
      if (e.s) e.s.textContent = pad(Math.floor((diff % 6e4) / 1e3));
    }
    tick(); setInterval(tick, 1000);
  }

  /* =====================================================================
   * MANIFEST
   * ===================================================================*/
  function renderManifest() {
    var list = $("#manifestList");
    if (!list) return;
    var pieces = CFG.pieces || [];
    var open = pieces.filter(function (p) { return p.stock > 0; }).length;
    var meta = $("#manifestMeta");
    if (meta) meta.textContent = pieces.length + " pieces · " + open + " open · numbered · limited count";

    list.innerHTML = pieces.map(function (p, i) {
      var closed = p.stock === 0;
      var action = closed
        ? "Closed"
        : (p.stock <= 8 ? p.stock + " remain" : "View");
      return '' +
        '<li class="piece' + (closed ? " is-closed" : "") + '" data-id="' + p.id + '"' +
            (closed ? "" : ' tabindex="0" role="button" aria-label="View ' + p.name + '"') + '>' +
          '<span class="piece__no">N&deg;' + roman(i) + '</span>' +
          '<div class="piece__main">' +
            '<div class="piece__name">' + p.name + '</div>' +
            '<div class="piece__material">' + (p.material || "") + '</div>' +
          '</div>' +
          '<div class="piece__right">' +
            '<span class="piece__price">' + money(p.price) + '</span>' +
            '<span class="piece__action">' + action + '</span>' +
          '</div>' +
          (closed ? "" : plateMarkup(p, i, "piece__plate")) +
        '</li>';
    }).join("");

    $$(".piece", list).forEach(function (row) {
      var p = byId[row.getAttribute("data-id")];
      if (!p || p.stock === 0) return;
      var open = function () { openQuickview(p.id); };
      row.addEventListener("click", open);
      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  /* =====================================================================
   * QUICKVIEW
   * ===================================================================*/
  var qv = { id: null, size: null };
  function openQuickview(id) {
    var p = byId[id]; if (!p) return;
    var i = (CFG.pieces || []).indexOf(p);
    qv.id = id; qv.size = null;
    $("#qvMedia").innerHTML = plateMarkup(p, i);
    $("#qvNo").textContent = (CFG.editionLabel || "") + " · N°" + roman(i);
    $("#qvName").textContent = p.name;
    $("#qvMaterial").textContent = p.material || "";
    $("#qvPrice").textContent = money(p.price);
    $("#qvNote").textContent = p.note || "";

    var wrap = $("#qvSizes"), add = $("#qvAdd");
    if (p.sizes && p.sizes.length) {
      wrap.style.display = "flex";
      wrap.innerHTML = p.sizes.map(function (s) { return '<button class="size" data-size="' + s + '">' + s + "</button>"; }).join("");
      $$(".size", wrap).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".size", wrap).forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel"); qv.size = b.getAttribute("data-size");
          add.removeAttribute("disabled"); add.textContent = "Add to bag";
        });
      });
      add.setAttribute("disabled", "true"); add.textContent = "Select a size";
    } else {
      wrap.style.display = "none"; wrap.innerHTML = ""; qv.size = "OS";
      add.removeAttribute("disabled"); add.textContent = "Add to bag";
    }
    $("#qvStock").textContent = p.stock <= 8 ? "Only " + p.stock + " made" : "Open";

    var m = $("#quickview");
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; $("#qvClose").focus();
  }
  function closeQuickview() {
    var m = $("#quickview"); m.classList.remove("open"); m.setAttribute("aria-hidden", "true");
    if (!$("#bag").classList.contains("open")) document.body.style.overflow = "";
  }
  function quickviewAdd() {
    var p = byId[qv.id]; if (!p) return;
    if (p.sizes && p.sizes.length && !qv.size) { toast("Select a size"); return; }
    addToBag(qv.id, qv.size || "OS"); closeQuickview(); openBag();
  }

  /* =====================================================================
   * BAG
   * ===================================================================*/
  var KEY = "pantao.bag.v1";
  var bag = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} }
  var lineKey = function (id, size) { return id + "::" + size; };

  function addToBag(id, size) {
    var p = byId[id]; if (!p) return;
    var key = lineKey(id, size);
    var line = bag.find(function (l) { return l.key === key; });
    if ((line ? line.qty : 0) >= p.stock) { toast("That's all we made"); return; }
    if (line) line.qty += 1; else bag.push({ key: key, id: id, size: size, qty: 1 });
    persist(); renderBag(); bump(); toast(p.name + " added");
  }
  function setQty(key, d) {
    var line = bag.find(function (l) { return l.key === key; }); if (!line) return;
    var p = byId[line.id], next = line.qty + d;
    if (next <= 0) bag = bag.filter(function (l) { return l.key !== key; });
    else if (p && next > p.stock) { toast("That's all we made"); return; }
    else line.qty = next;
    persist(); renderBag();
  }
  function removeLine(key) { bag = bag.filter(function (l) { return l.key !== key; }); persist(); renderBag(); }
  var count = function () { return bag.reduce(function (n, l) { return n + l.qty; }, 0); };
  var total = function () { return bag.reduce(function (n, l) { var p = byId[l.id]; return n + (p ? p.price * l.qty : 0); }, 0); };

  function renderBag() {
    var body = $("#bagBody"), c = count();
    $("#cartCount").textContent = c;
    $("#bagCount").textContent = "(" + c + ")";
    $("#bagSubtotal").textContent = money(total());
    var foot = $("#bagFoot");
    if (!bag.length) {
      body.innerHTML = '<div class="bag__empty">Your bag is empty.</div>';
      if (foot) foot.style.display = "none"; return;
    }
    if (foot) foot.style.display = "";
    body.innerHTML = bag.map(function (l) {
      var p = byId[l.id]; if (!p) return "";
      var i = (CFG.pieces || []).indexOf(p);
      return '' +
        '<div class="line" data-key="' + l.key + '">' +
          plateMarkup(p, i, "line__plate") +
          '<div class="line__info">' +
            '<div class="line__name">' + p.name + '</div>' +
            '<div class="line__meta">' + (l.size !== "OS" ? l.size + " · " : "") + money(p.price) + '</div>' +
            '<div class="line__ctl">' +
              '<div class="qty"><button data-act="dec" aria-label="Decrease">&minus;</button><span>' + l.qty + '</span><button data-act="inc" aria-label="Increase">+</button></div>' +
              '<button class="line__remove" data-act="rm">Remove</button>' +
            '</div>' +
          '</div>' +
          '<div class="line__price">' + money(p.price * l.qty) + '</div>' +
        '</div>';
    }).join("");
    $$(".line", body).forEach(function (row) {
      var key = row.getAttribute("data-key");
      row.querySelector('[data-act="inc"]').addEventListener("click", function () { setQty(key, 1); });
      row.querySelector('[data-act="dec"]').addEventListener("click", function () { setQty(key, -1); });
      row.querySelector('[data-act="rm"]').addEventListener("click", function () { removeLine(key); });
    });
  }
  function bump() { var el = $("#cartCount"); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  function openBag() {
    if ((CFG.phase || "open") === "antechamber") return;
    $("#bag").classList.add("open"); $("#bag").setAttribute("aria-hidden", "false");
    $("#scrim").classList.add("open"); document.body.style.overflow = "hidden";
  }
  function closeBag() {
    $("#bag").classList.remove("open"); $("#bag").setAttribute("aria-hidden", "true");
    $("#scrim").classList.remove("open");
    if (!$("#quickview").classList.contains("open")) document.body.style.overflow = "";
  }
  function checkout() {
    if (!bag.length) { toast("Your bag is empty"); return; }
    /* ---- HOOK: wire real checkout here (Stripe / Shopify cart permalink) ---- */
    toast("Checkout is a placeholder — wire it in store.js");
    console.log("[PANTAO] checkout payload:", bag.map(function (l) {
      var p = byId[l.id]; return { id: l.id, name: p && p.name, size: l.size, qty: l.qty, price: p && p.price };
    }));
  }

  /* =====================================================================
   * APPLY / INVITATION
   * ===================================================================*/
  function apply() {
    var form = $("#applyForm"); if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = ($("#applyEmail").value || "").trim(), msg = $("#applyMsg");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "Enter a valid email address."; return; }
      /* ---- HOOK: send to Klaviyo / Mailchimp / your API ---- */
      console.log("[PANTAO] application:", { name: ($("#applyName").value || "").trim(), email: email });
      msg.textContent = "Your application is with us. Each is read by hand.";
      form.reset();
    });
    ["#applyOpen", "#applyOpenClosed"].forEach(function (sel) {
      var b = $(sel);
      if (b) b.addEventListener("click", function () {
        var s = $("#invitation"); if (s) s.scrollIntoView({ behavior: "smooth" });
        setTimeout(function () { $("#applyEmail").focus(); }, 600);
      });
    });
  }

  /* =====================================================================
   * TOAST · NAV · REVEAL
   * ===================================================================*/
  var tTimer;
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(tTimer); tTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function nav() {
    var n = $("#nav");
    var on = function () { n.classList.toggle("is-stuck", window.scrollY > 40); };
    on(); window.addEventListener("scroll", on, { passive: true });
  }
  var io;
  function revealScan() {
    if (!("IntersectionObserver" in window)) { $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$("[data-reveal]:not(.in)").forEach(function (el) { io.observe(el); });
  }

  /* =====================================================================
   * WIRE + BOOT
   * ===================================================================*/
  function wire() {
    $("#cartToggle") && $("#cartToggle").addEventListener("click", openBag);
    $("#bagClose")   && $("#bagClose").addEventListener("click", closeBag);
    $("#bagKeep")    && $("#bagKeep").addEventListener("click", closeBag);
    $("#scrim")      && $("#scrim").addEventListener("click", closeBag);
    $("#checkoutBtn")&& $("#checkoutBtn").addEventListener("click", checkout);
    $("#qvClose")    && $("#qvClose").addEventListener("click", closeQuickview);
    $("#qvScrim")    && $("#qvScrim").addEventListener("click", closeQuickview);
    $("#qvAdd")      && $("#qvAdd").addEventListener("click", quickviewAdd);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeQuickview(); closeBag(); } });
  }
  function init() {
    applyPhase(); bindText(); counter(); renderManifest(); renderBag();
    apply(); nav(); wire(); revealScan(); preloader();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
