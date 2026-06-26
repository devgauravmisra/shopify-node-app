/**
 * Rizzz Reviews Widget v1.0
 * =====================================================================
 * Injected on Shopify merchant product pages via Shopify Script Tag API
 * Fetches community reviews from rizzz.online CI4 REST API
 *
 * PLACE THIS FILE AT: shopify-node-app/public/widget/rizzz-widget.js
 * It will be served at: https://your-app.railway.app/widget/rizzz-widget.js
 * =====================================================================
 */
(function () {
  "use strict";

  // Read config from the <script> tag attributes
  var tag     = document.currentScript || document.querySelector('script[data-shop]');
  var SHOP    = tag ? (tag.getAttribute("data-shop") || "") : "";
  var API     = tag ? (tag.getAttribute("data-api")  || "https://rizzz.online/api") : "https://rizzz.online/api";
  var BASE    = API.replace("/api", "");

  // ── Helpers ────────────────────────────────────────────────
  function esc(s) {
    if (!s) return "";
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
                    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function fmtDate(d) {
    if (!d) return "";
    try { return new Date(d).toLocaleDateString("en-IN", { year:"numeric", month:"short", day:"numeric" }); }
    catch(e) { return ""; }
  }

  function stars(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) {
      s += (i <= Math.round(n)) ? "★" : "☆";
    }
    return '<span style="color:#f5a623;font-size:15px;">' + s + '</span>';
  }

  function ratingBar(pct) {
    return '<div style="flex:1;background:#e8e8e8;border-radius:4px;height:6px;">' +
           '<div style="width:' + pct + '%;background:#f5a623;height:6px;border-radius:4px;"></div></div>';
  }

  // ── Get product handle from URL ────────────────────────────
  function getHandle() {
    var m = window.location.pathname.match(/\/products\/([^/?#]+)/);
    return m ? m[1] : null;
  }

  // ── Fetch reviews from CI4 API ─────────────────────────────
  async function load(handle) {
    try {
      var url = API + "/reviews/" + encodeURIComponent(handle)
                    + "?shop=" + encodeURIComponent(SHOP) + "&limit=10";
      var res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) return null;
      return await res.json();
    } catch(e) { return null; }
  }

  // ── Render widget into container ───────────────────────────
  async function mount(el) {
    var handle = getHandle();
    if (!handle) return;

    // Loading state
    el.innerHTML = '<div style="font-family:-apple-system,sans-serif;border-top:1px solid #e8e8e8;padding:20px 0;margin-top:20px;color:#888;font-size:14px;">Loading Rizzz community reviews…</div>';

    var data = await load(handle);

    // ── Empty state ───────────────────────────────────────────
    if (!data || data.total === 0) {
      el.innerHTML =
        '<div style="font-family:-apple-system,sans-serif;border-top:1px solid #e8e8e8;padding:20px 0;margin-top:20px;">' +
          '<div style="font-weight:600;font-size:16px;margin-bottom:10px;">Community Reviews</div>' +
          '<p style="color:#888;font-size:14px;margin:0 0 14px;">No community reviews yet — be the first!</p>' +
          '<a href="' + BASE + '/product/' + esc(handle) + '?ref=widget" target="_blank" ' +
             'style="display:inline-block;background:#7F77DD;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">' +
            'Write a review on Rizzz ↗' +
          '</a>' +
        '</div>';
      return;
    }

    var reviews  = data.reviews || [];
    var avg      = data.average_rating || 0;
    var total    = data.total || 0;
    var bd       = data.rating_breakdown || {};

    // ── Rating breakdown bars ─────────────────────────────────
    var barsHtml = [5,4,3,2,1].map(function(star) {
      var cnt  = bd[star] || 0;
      var pct  = total > 0 ? Math.round((cnt / total) * 100) : 0;
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">' +
               '<span style="font-size:12px;color:#888;width:10px;">' + star + '</span>' +
               '<span style="color:#f5a623;font-size:12px;">★</span>' +
               ratingBar(pct) +
               '<span style="font-size:12px;color:#888;width:28px;">' + pct + '%</span>' +
             '</div>';
    }).join("");

    // ── Review cards ──────────────────────────────────────────
    var reviewsHtml = reviews.slice(0, 5).map(function(r) {
      return '<div style="padding:14px 0;border-bottom:1px solid #f0f0f0;">' +
               '<div style="display:flex;justify-content:space-between;margin-bottom:5px;">' +
                 '<div>' +
                   '<span style="font-weight:600;font-size:14px;">' + esc(r.author_name || "Anonymous") + '</span>' +
                   (r.verified_purchase
                     ? '<span style="margin-left:8px;background:#e8f5e9;color:#2e7d32;font-size:11px;padding:2px 6px;border-radius:3px;">✓ Verified</span>'
                     : '') +
                 '</div>' +
                 '<span style="color:#aaa;font-size:12px;">' + fmtDate(r.created_at) + '</span>' +
               '</div>' +
               stars(r.rating) +
               (r.title ? '<div style="font-weight:500;font-size:14px;margin:5px 0 3px;">' + esc(r.title) + '</div>' : '') +
               '<p style="font-size:14px;color:#4a4a4a;margin:4px 0 0;line-height:1.6;">' + esc(r.body || "") + '</p>' +
             '</div>';
    }).join("");

    // ── Full widget HTML ──────────────────────────────────────
    el.innerHTML =
      '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;border-top:1px solid #e8e8e8;padding:24px 0;margin-top:24px;">' +

        // Header
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-weight:700;font-size:18px;color:#1a1a1a;">Community Reviews</span>' +
            '<span style="background:#EEEDFE;color:#534AB7;font-size:12px;padding:3px 8px;border-radius:4px;font-weight:500;">' + total + ' review' + (total !== 1 ? 's' : '') + '</span>' +
          '</div>' +
          '<a href="' + BASE + '/product/' + esc(handle) + '?ref=widget-all" target="_blank" ' +
             'style="color:#7F77DD;font-size:13px;text-decoration:none;font-weight:500;">See all on Rizzz ↗</a>' +
        '</div>' +

        // Summary
        '<div style="background:#f9f9f9;border-radius:10px;padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">' +
          '<div style="text-align:center;min-width:60px;">' +
            '<div style="font-size:36px;font-weight:700;color:#1a1a1a;line-height:1;">' + avg.toFixed(1) + '</div>' +
            stars(avg) +
            '<div style="color:#888;font-size:12px;margin-top:2px;">' + total + ' reviews</div>' +
          '</div>' +
          '<div style="flex:1;min-width:150px;">' + barsHtml + '</div>' +
        '</div>' +

        // Reviews
        reviewsHtml +

        // CTAs
        '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">' +
          '<a href="' + BASE + '/product/' + esc(handle) + '?ref=widget-write&shop=' + encodeURIComponent(SHOP) + '" target="_blank" ' +
             'style="display:inline-block;background:#7F77DD;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">' +
            'Write a review on Rizzz ↗' +
          '</a>' +
          (total > 5
            ? '<a href="' + BASE + '/product/' + esc(handle) + '?ref=widget-viewall" target="_blank" ' +
                 'style="display:inline-block;background:transparent;color:#7F77DD;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;border:1px solid #7F77DD;">' +
                'View all ' + total + ' reviews' +
              '</a>'
            : '') +
        '</div>' +

        // Attribution
        '<p style="margin-top:12px;font-size:11px;color:#bbb;">' +
          'Powered by <a href="' + BASE + '?ref=widget-foot" target="_blank" style="color:#7F77DD;text-decoration:none;">Rizzz community</a>' +
        '</p>' +

      '</div>';
  }

  // ── Boot: find or inject container ────────────────────────
  function init() {
    var el = document.getElementById("rizzz-reviews") ||
             document.querySelector("[data-rizzz-reviews]");

    if (!el) {
      // Auto-inject after product description on standard Shopify themes
      var anchor = document.querySelector(".product__description") ||
                   document.querySelector(".product-description") ||
                   document.querySelector("[data-product-description]") ||
                   document.querySelector(".product-single__description");
      if (anchor) {
        el = document.createElement("div");
        el.id = "rizzz-reviews";
        anchor.parentNode.insertBefore(el, anchor.nextSibling);
      }
    }

    if (el) mount(el);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
