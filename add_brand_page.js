// Adds a realistic Shopify brand storefront page to the preview
var fs = require('fs');
var o = '<', c = '>';
function el(tag, attrs, inner) {
  return o + tag + (attrs ? ' ' + attrs : '') + c + (inner || '') + o + '/' + tag + c;
}

var brandCss =
  '.store-wrap{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#fff;color:#1a1a1a}' +
  '.store-topbar{background:#fff;border-bottom:1px solid #e5e5e5;padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}' +
  '.store-brand{font-size:20px;font-weight:800;letter-spacing:-0.5px;color:#1a1a1a}' +
  '.store-nav{display:flex;gap:24px;font-size:14px;color:#555}' +
  '.store-nav a{color:#555;text-decoration:none}' +
  '.store-nav a:hover{color:#1a1a1a}' +
  '.store-cart{font-size:13px;font-weight:500;background:#1a1a1a;color:#fff;padding:8px 16px;border-radius:6px;cursor:pointer}' +
  '.store-breadcrumb{padding:12px 40px;font-size:12px;color:#888;border-bottom:1px solid #f0f0f0}' +
  '.store-breadcrumb a{color:#888;text-decoration:none}' +
  '.store-product{display:grid;grid-template-columns:1fr 1fr;gap:48px;padding:32px 40px;max-width:1100px;margin:0 auto}' +
  '.store-gallery{display:flex;flex-direction:column;gap:12px}' +
  '.store-main-img{background:linear-gradient(135deg,#f0eeff,#ddd8f8);border-radius:12px;height:420px;display:flex;align-items:center;justify-content:center;font-size:100px;border:1px solid #e8e8e8}' +
  '.store-thumbs{display:flex;gap:8px}' +
  '.store-thumb{width:72px;height:72px;border-radius:8px;background:linear-gradient(135deg,#e8e4f8,#d4cef0);display:flex;align-items:center;justify-content:center;font-size:28px;border:2px solid transparent;cursor:pointer}' +
  '.store-thumb.active{border-color:#7F77DD}' +
  '.store-details{display:flex;flex-direction:column;gap:16px;padding-top:8px}' +
  '.store-vendor{font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.8px}' +
  '.store-title{font-size:28px;font-weight:700;line-height:1.2;color:#1a1a1a}' +
  '.store-rating-row{display:flex;align-items:center;gap:10px}' +
  '.store-stars{color:#f5a623;font-size:15px}' +
  '.store-rating-count{font-size:13px;color:#7F77DD;text-decoration:underline;cursor:pointer}' +
  '.store-price{font-size:26px;font-weight:700;color:#1a1a1a}' +
  '.store-compare{font-size:16px;color:#aaa;text-decoration:line-through;margin-left:8px}' +
  '.store-badge{display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;margin-left:8px}' +
  '.store-desc{font-size:14px;color:#555;line-height:1.8}' +
  '.store-variants{display:flex;flex-direction:column;gap:8px}' +
  '.store-variant-label{font-size:13px;font-weight:600;color:#1a1a1a}' +
  '.store-variant-options{display:flex;gap:8px;flex-wrap:wrap}' +
  '.store-variant-btn{padding:8px 16px;border:1px solid #ddd;border-radius:6px;font-size:13px;cursor:pointer;background:#fff}' +
  '.store-variant-btn.active{border-color:#1a1a1a;background:#1a1a1a;color:#fff}' +
  '.store-variant-btn.oos{color:#ccc;border-color:#eee;text-decoration:line-through;cursor:not-allowed}' +
  '.store-qty{display:flex;align-items:center;gap:0;border:1px solid #ddd;border-radius:8px;width:fit-content}' +
  '.store-qty button{width:36px;height:36px;border:none;background:transparent;font-size:18px;cursor:pointer;color:#555}' +
  '.store-qty span{width:40px;text-align:center;font-size:14px;font-weight:500}' +
  '.store-atc{background:#1a1a1a;color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;width:100%}' +
  '.store-atc:hover{background:#333}' +
  '.store-buy{background:#7F77DD;color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;width:100%}' +
  '.store-meta{font-size:12px;color:#888;display:flex;flex-direction:column;gap:4px}' +
  '.store-meta span{display:flex;align-items:center;gap:6px}' +
  '.rizzz-widget-section{border-top:2px solid #f0f0f0;padding:40px;max-width:1100px;margin:0 auto}' +
  '.rw-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px}' +
  '.rw-title{font-size:22px;font-weight:700;color:#1a1a1a}' +
  '.rw-badge{background:#EEEDFE;color:#534AB7;font-size:12px;padding:3px 10px;border-radius:20px;font-weight:600;margin-left:10px}' +
  '.rw-see-all{color:#7F77DD;font-size:13px;font-weight:500;text-decoration:none}' +
  '.rw-summary{background:#fafafa;border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;align-items:center;gap:32px;flex-wrap:wrap}' +
  '.rw-avg-num{font-size:48px;font-weight:800;color:#1a1a1a;line-height:1}' +
  '.rw-avg-stars{color:#f5a623;font-size:20px;margin:4px 0}' +
  '.rw-avg-count{font-size:13px;color:#888}' +
  '.rw-bars{flex:1;min-width:200px}' +
  '.rw-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:7px}' +
  '.rw-bar-lbl{font-size:12px;color:#888;width:14px;text-align:right}' +
  '.rw-bar-star{color:#f5a623;font-size:13px}' +
  '.rw-bar-track{flex:1;background:#ebebeb;border-radius:4px;height:8px}' +
  '.rw-bar-fill{height:8px;border-radius:4px;background:#f5a623}' +
  '.rw-bar-pct{font-size:12px;color:#888;width:32px}' +
  '.rw-write-btn{display:inline-flex;align-items:center;gap:8px;background:#7F77DD;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500}' +
  '.rw-cards{display:flex;flex-direction:column;gap:0}' +
  '.rw-card{padding:20px 0;border-bottom:1px solid #f0f0f0}' +
  '.rw-card:last-child{border-bottom:none}' +
  '.rw-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}' +
  '.rw-author{font-weight:600;font-size:14px}' +
  '.rw-verified{margin-left:8px;background:#e8f5e9;color:#2e7d32;font-size:11px;padding:2px 7px;border-radius:3px;font-weight:500}' +
  '.rw-date{font-size:12px;color:#aaa}' +
  '.rw-card-stars{color:#f5a623;font-size:14px;margin-bottom:5px}' +
  '.rw-card-title{font-weight:600;font-size:14px;margin-bottom:4px}' +
  '.rw-card-body{font-size:14px;color:#555;line-height:1.7}' +
  '.rw-cta-row{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}' +
  '.rw-viewall-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#7F77DD;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:14px;border:1.5px solid #7F77DD}' +
  '.rw-powered{margin-top:16px;font-size:11px;color:#ccc}' +
  '.rw-powered a{color:#7F77DD;text-decoration:none}' +
  '.store-footer{background:#1a1a1a;color:#888;padding:24px 40px;font-size:12px;display:flex;justify-content:space-between;align-items:center;margin-top:40px}' +
  '.store-footer a{color:#888;text-decoration:none}' +
  '.config-banner{background:#fffbeb;border:1px solid #f5a623;border-radius:8px;padding:12px 16px;margin:16px 40px;font-size:13px;color:#7d5c00;display:flex;align-items:center;gap:10px}';

function starRow(n) {
  var s = '';
  for (var i = 1; i <= 5; i++) s += el('span','style="color:' + (i <= n ? '#f5a623' : '#e0e0e0') + '"', i <= n ? '&#x2605;' : '&#x2606;');
  return s;
}

function barRow(star, pct, width) {
  return el('div','class="rw-bar-row"',
    el('span','class="rw-bar-lbl"', String(star)) +
    el('span','class="rw-bar-star"','&#x2605;') +
    el('div','class="rw-bar-track"', el('div','class="rw-bar-fill" style="width:'+pct+'%"','')) +
    el('span','class="rw-bar-pct"', pct+'%')
  );
}

function rwCard(author, verified, rating, title, body, date) {
  return el('div','class="rw-card"',
    el('div','class="rw-card-top"',
      el('div','',
        el('span','class="rw-author"', author) +
        (verified ? el('span','class="rw-verified"','&#x2713; Verified') : '')
      ) +
      el('span','class="rw-date"', date)
    ) +
    el('div','class="rw-card-stars"', starRow(rating)) +
    el('div','class="rw-card-title"', title) +
    el('p','class="rw-card-body"', body)
  );
}

var brandPage =
  el('div','class="page" id="page-brand"',
    el('div','class="store-wrap"',

      // Config banner
      el('div','class="config-banner"',
        el('span','','&#x2699;&#xFE0F;') +
        el('span','','Rizzz widget is active on this store. Configured via Shopify Admin &#x2192; Apps &#x2192; Rizzz Reviews &#x2192; Dashboard &#x2192; Install widget on store')
      ) +

      // Store top bar
      el('div','class="store-topbar"',
        el('div','class="store-brand"','STRIDE') +
        el('nav','class="store-nav"',
          el('a','href="#"','Home') +
          el('a','href="#"','Shop') +
          el('a','href="#"','Collections') +
          el('a','href="#"','About')
        ) +
        el('button','class="store-cart"','&#x1F6D2; Cart (2)')
      ) +

      // Breadcrumb
      el('div','class="store-breadcrumb"',
        el('a','href="#"','Home') + ' / ' +
        el('a','href="#"','Footwear') + ' / ' +
        'Air Max Pro Running Shoes'
      ) +

      // Product section
      el('div','class="store-product"',

        // Gallery
        el('div','class="store-gallery"',
          el('div','class="store-main-img"','&#x1F45F;') +
          el('div','class="store-thumbs"',
            el('div','class="store-thumb active"','&#x1F45F;') +
            el('div','class="store-thumb"','&#x1F9B6;') +
            el('div','class="store-thumb"','&#x1F4CF;') +
            el('div','class="store-thumb"','&#x1F3C3;')
          )
        ) +

        // Details
        el('div','class="store-details"',
          el('div','class="store-vendor"','STRIDE ATHLETICS') +
          el('div','class="store-title"','Air Max Pro Running Shoes') +

          // Rating row
          el('div','class="store-rating-row"',
            el('span','class="store-stars"', starRow(4)) +
            el('a','href="#rizzz-reviews" class="store-rating-count"','142 reviews')
          ) +

          // Price
          el('div','style="display:flex;align-items:baseline;gap:4px"',
            el('span','class="store-price"','&#x20B9;4,999') +
            el('span','class="store-compare"','&#x20B9;6,499') +
            el('span','class="store-badge"','23% OFF')
          ) +

          el('p','class="store-desc"','Premium running shoes engineered for long-distance performance. Features advanced foam cushioning, breathable mesh upper, and durable rubber outsole. Trusted by 10,000+ runners across India.') +

          // Size
          el('div','class="store-variants"',
            el('div','class="store-variant-label"','Size: UK 9') +
            el('div','class="store-variant-options"',
              el('button','class="store-variant-btn oos"','UK 6') +
              el('button','class="store-variant-btn"','UK 7') +
              el('button','class="store-variant-btn"','UK 8') +
              el('button','class="store-variant-btn active"','UK 9') +
              el('button','class="store-variant-btn"','UK 10') +
              el('button','class="store-variant-btn"','UK 11')
            )
          ) +

          // Color
          el('div','class="store-variants"',
            el('div','class="store-variant-label"','Color: Midnight Purple') +
            el('div','class="store-variant-options"',
              el('button','class="store-variant-btn active"','Midnight Purple') +
              el('button','class="store-variant-btn"','Jet Black') +
              el('button','class="store-variant-btn"','Arctic White')
            )
          ) +

          // Qty
          el('div','class="store-variants"',
            el('div','class="store-variant-label"','Quantity') +
            el('div','class="store-qty"',
              el('button','','&#x2212;') +
              el('span','','1') +
              el('button','','+')
            )
          ) +

          el('button','class="store-atc"','Add to Cart') +
          el('button','class="store-buy"','Buy it Now') +

          el('div','class="store-meta"',
            el('span','','&#x1F69A; Free delivery on orders above &#x20B9;999') +
            el('span','','&#x21A9;&#xFE0F; 30-day easy returns') +
            el('span','','&#x1F512; Secure checkout')
          )
        )
      ) +

      // ── Rizzz Widget (injected by rizzz-widget.js) ──────────────
      el('div','class="rizzz-widget-section" id="rizzz-reviews"',

        el('div','class="rw-header"',
          el('div','',
            el('span','class="rw-title"','Community Reviews') +
            el('span','class="rw-badge"','142 reviews')
          ) +
          el('a','href="#" class="rw-see-all"','See all on Rizzz &#x2197;')
        ) +

        el('div','class="rw-summary"',
          el('div','',
            el('div','class="rw-avg-num"','4.3') +
            el('div','class="rw-avg-stars"', starRow(4)) +
            el('div','class="rw-avg-count"','142 reviews')
          ) +
          el('div','class="rw-bars"',
            barRow(5, 58) + barRow(4, 24) + barRow(3, 10) + barRow(2, 5) + barRow(1, 3)
          ) +
          el('a','href="#" class="rw-write-btn"','&#x270D;&#xFE0F; Write a review on Rizzz &#x2197;')
        ) +

        el('div','class="rw-cards"',
          rwCard('Priya S.', true, 5, 'Best running shoes I\'ve owned!', 'Incredibly comfortable for long runs. The cushioning is amazing and they look great too. Highly recommend to anyone who runs regularly!', '4 Jul 2026') +
          rwCard('Rahul M.', true, 4, 'Great quality, slightly narrow', 'Really good shoes overall. The build quality is excellent and they look premium. Just a bit narrow for wide feet — size up if needed.', '3 Jul 2026') +
          rwCard('Ananya K.', false, 5, 'Perfect for daily use', 'I use these for both gym and casual wear. Super versatile and comfortable all day long. The purple colour is stunning in person!', '1 Jul 2026') +
          rwCard('Vikram T.', true, 4, 'Solid performance shoe', 'Used these for a half marathon. Great grip and the cushioning held up well over 21km. Will buy again.', '29 Jun 2026')
        ) +

        el('div','class="rw-cta-row"',
          el('a','href="#" class="rw-write-btn"','&#x270D;&#xFE0F; Write a review on Rizzz &#x2197;') +
          el('a','href="#" class="rw-viewall-btn"','View all 142 reviews')
        ) +

        el('p','class="rw-powered"',
          'Powered by ' + el('a','href="#"','Rizzz community') + ' &nbsp;&#x2022;&nbsp; Reviews are from verified Rizzz community members'
        )
      ) +

      // Footer
      el('div','class="store-footer"',
        el('span','','&copy; 2026 STRIDE Athletics. All rights reserved.') +
        el('div','style="display:flex;gap:16px"',
          el('a','href="#"','Privacy') +
          el('a','href="#"','Terms') +
          el('a','href="#"','Contact')
        )
      )
    )
  );

// ── Patch gen_preview.js ───────────────────────────────────────
var src = fs.readFileSync('gen_preview.js', 'utf8');

// 1. Add CSS
src = src.replace(
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}'",
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}',\n  '" + brandCss + "'"
);

// 2. Add nav item
src = src.replace(
  "el('div','class=\"nav\" id=\"nav-review\" onclick=\"showPage(event,\\'review\\')\"','&#x2B50;&nbsp; Write a Review')",
  "el('div','class=\"nav\" id=\"nav-review\" onclick=\"showPage(event,\\'review\\')\"','&#x2B50;&nbsp; Write a Review') +\n    el('div','class=\"nav\" id=\"nav-brand\" onclick=\"showPage(event,\\'brand\\')\"','&#x1F3EA;&nbsp; Brand Store')"
);

// 3. Add page
src = src.replace(
  'dashboard + settings + widgetPage + reviewFormPage',
  'dashboard + settings + widgetPage + reviewFormPage + brandPage'
);

// 4. Inject brandPage variable
src = src.replace(
  'var widgetPage =',
  'var brandPage = ' + JSON.stringify(brandPage) + ';\nvar widgetPage ='
);

fs.writeFileSync('gen_preview.js', src);
console.log('Brand page patched');