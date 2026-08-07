/* ============================================================================
 * PANTAO — STORE ENGINE
 * Countdown · product grid · quickview · cart · phase switching.
 * Cart persists in localStorage. No dependencies.
 * ==========================================================================*/
(function () {
  "use strict";

  var CFG = window.PANTAO_CONFIG || {};
  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var money = function (n) { return (CFG.currency || "$") + Number(n).toLocaleString("en-US"); };
  var byId = {};
  (CFG.products || []).forEach(function (p) { byId[p.id] = p; });

  /* ---- render a piece's placeholder "art" (peach-tinted panel + glyph) ---- */
  function artStyle(p) {
    var h = (p.art && p.art.hue != null) ? p.art.hue : 14;
    // layered gradient reads as fabric/dye, tinted by the piece's hue
    return "background:" +
      "radial-gradient(120% 90% at 30% 15%, hsla(" + h + ",70%,62%,0.32), transparent 55%)," +
      "radial-gradient(90% 80% at 85% 90%, hsla(" + (h + 20) + ",60%,40%,0.5), transparent 60%)," +
      "linear-gradient(140deg, hsl(" + h + ",26%,13%), hsl(" + (h + 10) + ",30%,8%));";
  }
  function artMarkup(p) {
    if (p.img) {
      return '<div class="card__art" style="background:url(' + p.img + ') center/cover;"></div>';
    }
    var glyph = (p.art && p.art.glyph) || "桃";
    return '<div class="card__art" style="' + artStyle(p) + '"><span class="card__glyph">' + glyph + "</span></div>";
  }

  /* =====================================================================
   * PRELOADER
   * ===================================================================*/
  function preloader() {
    var el = $("#preloader"), bar = $(".preloader__bar span"), pct = $("#preloaderPct");
    if (!el) return;
    var v = 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { finish(); return; }
    var t = setInterval(function () {
      v += Math.random() * 18 + 6;
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(finish, 260); }
      bar.style.width = v + "%";
      pct.textContent = String(Math.floor(v)).padStart(2, "0");
    }, 130);
    function finish() {
      el.classList.add("is-done");
      document.body.classList.add("loaded");
      // kick off first reveals
      revealScan();
    }
  }

  /* =====================================================================
   * PHASE
   * ===================================================================*/
  function applyPhase() {
    var phase = CFG.phase || "live";
    document.body.setAttribute("data-phase", phase);
  }

  /* =====================================================================
   * CONFIG-BOUND TEXT  ([data-config="key"])
   * ===================================================================*/
  function bindText() {
    $$("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      if (CFG[key] != null) el.textContent = CFG[key];
    });
    var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

    // footer social
    var fs = $("#footerSocial"); var s = CFG.social || {};
    if (fs) {
      var links = [];
      if (s.instagram) links.push('<a href="' + s.instagram + '" target="_blank" rel="noopener">Instagram</a>');
      if (s.tiktok)    links.push('<a href="' + s.tiktok + '" target="_blank" rel="noopener">TikTok</a>');
      if (s.email)     links.push('<a href="mailto:' + s.email + '">Email</a>');
      fs.innerHTML = links.join("");
    }

    // ticker content
    var tt = $("#tickerTrack");
    if (tt) {
      var msg = "PANTAO — COLLECTION " + (CFG.collectionNo || "001") + " · " + (CFG.collectionName || "") +
                " · ONE DROP A YEAR · LIMITED FOREVER · ";
      tt.textContent = "";
      var span = "", i;
      for (i = 0; i < 2; i++) { var el = document.createElement("span"); el.textContent = msg; tt.appendChild(el); }
    }
  }

  /* =====================================================================
   * COUNTDOWN
   * ===================================================================*/
  function countdown() {
    if ((CFG.phase || "live") !== "teaser") return;
    var target = new Date(CFG.dropDate).getTime();
    if (isNaN(target)) return;
    var els = { d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs") };
    function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { diff = 0; }
      var d = Math.floor(diff / 864e5);
      var h = Math.floor((diff % 864e5) / 36e5);
      var m = Math.floor((diff % 36e5) / 6e4);
      var s = Math.floor((diff % 6e4) / 1e3);
      if (els.d) els.d.textContent = pad(d);
      if (els.h) els.h.textContent = pad(h);
      if (els.m) els.m.textContent = pad(m);
      if (els.s) els.s.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* =====================================================================
   * PRODUCT GRID
   * ===================================================================*/
  function renderGrid() {
    var grid = $("#productGrid");
    if (!grid) return;
    var prods = CFG.products || [];
    var live = prods.filter(function (p) { return p.stock > 0; }).length;
    var meta = $("#dropMeta");
    if (meta) {
      meta.textContent = prods.length + " pieces · " + live + " still in the orchard · numbered, single run";
    }

    grid.innerHTML = prods.map(function (p, i) {
      var sold = p.stock === 0;
      var low = p.stock > 0 && p.stock <= 8;
      var tag = sold
        ? '<span class="card__tag card__tag--sold">Sold Out</span>'
        : (low ? '<span class="card__tag card__tag--low">Only ' + p.stock + ' Left</span>'
               : '<span class="card__tag">Available</span>');
      var num = "N°" + String(i + 1).padStart(2, "0");
      return '' +
        '<article class="card' + (sold ? " is-sold" : "") + '" data-id="' + p.id + '" tabindex="0" role="button" aria-label="View ' + p.name + '">' +
          '<div class="card__media">' +
            artMarkup(p) + tag +
            '<span class="card__num">' + num + '</span>' +
            (sold ? "" : '<div class="card__quick">Quick View</div>') +
          '</div>' +
          '<div class="card__body">' +
            '<div>' +
              '<div class="card__name">' + p.name + '</div>' +
              '<div class="card__sub">' + (p.subtitle || "") + '</div>' +
            '</div>' +
            '<div class="card__price">' + money(p.price) + '</div>' +
          '</div>' +
        '</article>';
    }).join("");

    $$(".card", grid).forEach(function (card) {
      var id = card.getAttribute("data-id");
      var p = byId[id];
      if (!p || p.stock === 0) return;
      var open = function () { openQuickview(id); };
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
  }

  /* =====================================================================
   * LOOKBOOK  (built from the products so it always fills)
   * ===================================================================*/
  function renderLookbook() {
    var grid = $("#lookbookGrid");
    if (!grid) return;
    var pool = (CFG.products || []).slice(0, 6);
    while (pool.length < 6 && pool.length > 0) pool = pool.concat(pool);
    grid.innerHTML = pool.slice(0, 6).map(function (p, i) {
      var glyph = (p.art && p.art.glyph) || "桃";
      return '' +
        '<figure class="look">' +
          '<div class="look__fill" style="' + artStyle(p) + '"></div>' +
          '<div class="look__glyph">' + glyph + '</div>' +
          '<figcaption class="look__cap">' + p.name + '</figcaption>' +
        '</figure>';
    }).join("");
  }

  /* =====================================================================
   * QUICKVIEW MODAL
   * ===================================================================*/
  var qv = { id: null, size: null };
  function openQuickview(id) {
    var p = byId[id]; if (!p) return;
    qv.id = id; qv.size = null;
    var m = $("#quickview");
    $("#qvMedia").innerHTML = artMarkup(p);
    $("#qvNo").textContent = "Collection " + (CFG.collectionNo || "001") + " · " + (CFG.season || "");
    $("#qvName").textContent = p.name;
    $("#qvSub").textContent = p.subtitle || "";
    $("#qvPrice").textContent = money(p.price);
    $("#qvStory").textContent = p.story || "";

    var sizesWrap = $("#qvSizes");
    var hasSizes = p.sizes && p.sizes.length;
    if (hasSizes) {
      sizesWrap.style.display = "flex";
      sizesWrap.innerHTML = p.sizes.map(function (s) {
        return '<button class="size" data-size="' + s + '">' + s + "</button>";
      }).join("");
      $$(".size", sizesWrap).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".size", sizesWrap).forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel"); qv.size = b.getAttribute("data-size");
          $("#qvAdd").removeAttribute("disabled");
        });
      });
      $("#qvAdd").setAttribute("disabled", "true");
      $("#qvAdd").textContent = "Select a size";
    } else {
      sizesWrap.style.display = "none";
      sizesWrap.innerHTML = "";
      qv.size = "OS";
      $("#qvAdd").removeAttribute("disabled");
      $("#qvAdd").textContent = "Add to Bag";
    }

    var stock = $("#qvStock");
    stock.textContent = p.stock <= 8 ? "Only " + p.stock + " made · once gone, gone" : "In the orchard now";

    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#qvClose").focus();
  }
  function closeQuickview() {
    var m = $("#quickview");
    m.classList.remove("open"); m.setAttribute("aria-hidden", "true");
    if (!$("#cart").classList.contains("open")) document.body.style.overflow = "";
  }
  function quickviewAdd() {
    var p = byId[qv.id]; if (!p) return;
    if (p.sizes && p.sizes.length && !qv.size) { toast("Pick a size first"); return; }
    addToCart(qv.id, qv.size || "OS");
    closeQuickview();
    openCart();
  }

  /* =====================================================================
   * CART  (localStorage)
   * ===================================================================*/
  var CART_KEY = "pantao.cart.v1";
  var cart = load();
  function load() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

  function lineKey(id, size) { return id + "::" + size; }
  function addToCart(id, size) {
    var p = byId[id]; if (!p) return;
    var key = lineKey(id, size);
    var line = cart.find(function (l) { return l.key === key; });
    var inCart = line ? line.qty : 0;
    if (inCart >= p.stock) { toast("That's all we made"); return; }
    if (line) line.qty += 1;
    else cart.push({ key: key, id: id, size: size, qty: 1 });
    save(); renderCart(); bumpCount();
    toast(p.name + " added");
  }
  function setQty(key, delta) {
    var line = cart.find(function (l) { return l.key === key; });
    if (!line) return;
    var p = byId[line.id];
    var next = line.qty + delta;
    if (next <= 0) { cart = cart.filter(function (l) { return l.key !== key; }); }
    else if (p && next > p.stock) { toast("That's all we made"); return; }
    else line.qty = next;
    save(); renderCart();
  }
  function removeLine(key) { cart = cart.filter(function (l) { return l.key !== key; }); save(); renderCart(); }

  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (n, l) { var p = byId[l.id]; return n + (p ? p.price * l.qty : 0); }, 0); }

  function renderCart() {
    var body = $("#cartBody");
    var count = cartCount();
    $("#cartCount").textContent = count;
    $("#cartHeadCount").textContent = "(" + count + ")";
    $("#cartSubtotal").textContent = money(cartTotal());

    var foot = $("#cartFoot");
    if (!cart.length) {
      body.innerHTML = '<div class="cart__empty"><span>空</span>Your bag is empty.<br>The orchard is waiting.</div>';
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "";
    body.innerHTML = cart.map(function (l) {
      var p = byId[l.id]; if (!p) return "";
      var glyph = (p.art && p.art.glyph) || "桃";
      return '' +
        '<div class="line" data-key="' + l.key + '">' +
          '<div class="line__art" style="' + artStyle(p) + '"><span>' + glyph + '</span></div>' +
          '<div class="line__info">' +
            '<div class="line__name">' + p.name + '</div>' +
            '<div class="line__meta">' + (l.size !== "OS" ? "Size " + l.size + " · " : "") + money(p.price) + '</div>' +
            '<div class="line__ctl">' +
              '<div class="qty">' +
                '<button data-act="dec" aria-label="Decrease">−</button>' +
                '<span>' + l.qty + '</span>' +
                '<button data-act="inc" aria-label="Increase">+</button>' +
              '</div>' +
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

  function bumpCount() {
    var el = $("#cartCount");
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  }

  function openCart() {
    if ((CFG.phase || "live") === "teaser") return;
    $("#cart").classList.add("open");
    $("#cart").setAttribute("aria-hidden", "false");
    $("#scrim").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("#cart").classList.remove("open");
    $("#cart").setAttribute("aria-hidden", "true");
    $("#scrim").classList.remove("open");
    if (!$("#quickview").classList.contains("open")) document.body.style.overflow = "";
  }

  function checkout() {
    if (!cart.length) { toast("Your bag is empty"); return; }
    // ---- HOOK: wire real checkout here ----
    // Replace this block with Stripe Checkout, Shopify cart permalink, etc.
    // e.g. window.location = "https://your-store.myshopify.com/cart/" + buildShopifyPayload(cart);
    toast("Checkout is a placeholder — wire it up in store.js");
    console.log("[PANTAO] checkout payload:", cart.map(function (l) {
      var p = byId[l.id];
      return { id: l.id, name: p && p.name, size: l.size, qty: l.qty, price: p && p.price };
    }));
  }

  /* =====================================================================
   * SIGNUP  (front-end only — logs; wire to your ESP)
   * ===================================================================*/
  function signup() {
    var form = $("#signupForm"); if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#signupEmail"), msg = $("#signupMsg");
      var val = (input.value || "").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) { msg.textContent = "Enter a valid email."; return; }
      // ---- HOOK: send `val` to Klaviyo / Mailchimp / your API here ----
      console.log("[PANTAO] waitlist signup:", val);
      msg.textContent = "You're on the list. Watch your inbox when the orchard opens.";
      input.value = "";
    });
    // hero waitlist buttons jump to the form
    ["#waitlistOpen", "#waitlistOpenSold"].forEach(function (sel) {
      var b = $(sel);
      if (b) b.addEventListener("click", function () {
        var s = $("#signup"); if (s) s.scrollIntoView({ behavior: "smooth" });
        setTimeout(function () { $("#signupEmail").focus(); }, 600);
      });
    });
  }

  /* =====================================================================
   * TOAST
   * ===================================================================*/
  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* =====================================================================
   * SCROLL EFFECTS — nav stuck + reveal-on-scroll
   * ===================================================================*/
  function nav() {
    var n = $("#nav");
    var onScroll = function () { n.classList.toggle("is-stuck", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var io;
  function revealScan() {
    if (!("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    $$("[data-reveal]:not(.in)").forEach(function (el) { io.observe(el); });
  }

  /* =====================================================================
   * WIRING
   * ===================================================================*/
  function wire() {
    $("#cartToggle") && $("#cartToggle").addEventListener("click", openCart);
    $("#cartClose")  && $("#cartClose").addEventListener("click", closeCart);
    $("#cartKeep")   && $("#cartKeep").addEventListener("click", closeCart);
    $("#scrim")      && $("#scrim").addEventListener("click", closeCart);
    $("#checkoutBtn")&& $("#checkoutBtn").addEventListener("click", checkout);

    $("#qvClose") && $("#qvClose").addEventListener("click", closeQuickview);
    $("#qvScrim") && $("#qvScrim").addEventListener("click", closeQuickview);
    $("#qvAdd")   && $("#qvAdd").addEventListener("click", quickviewAdd);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeQuickview(); closeCart(); }
    });
  }

  /* =====================================================================
   * BOOT
   * ===================================================================*/
  function init() {
    applyPhase();
    bindText();
    countdown();
    renderGrid();
    renderLookbook();
    renderCart();
    signup();
    nav();
    wire();
    revealScan();
    preloader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
