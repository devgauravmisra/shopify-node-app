// Adds widget preview and review form pages to gen_preview.js
var fs = require('fs');
var o = '<', c = '>';
var o = '<', c = '>';
function el(tag, attrs, inner) {
  return o + tag + (attrs ? ' ' + attrs : '') + c + (inner || '') + o + '/' + tag + c;
}

// ── CSS additions ──────────────────────────────────────────────
var extraCss =
  '.product-page{max-width:900px;margin:0 auto;padding:24px}' +
  '.product-hero{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px}' +
  '.product-img{background:linear-gradient(135deg,#e0d7f5,#c8b8f0);border-radius:12px;height:320px;display:flex;align-items:center;justify-content:center;font-size:80px}' +
  '.product-info{display:flex;flex-direction:column;gap:12px}' +
  '.product-title{font-size:24px;font-weight:700;color:#1a1a1a}' +
  '.product-price{font-size:22px;font-weight:600;color:#5c2d91}' +
  '.product-desc{font-size:14px;color:#555;line-height:1.7}' +
  '.add-to-cart{background:#5c2d91;color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;width:100%}' +
  '.widget-section{border-top:1px solid #e8e8e8;padding:24px 0;margin-top:8px}' +
  '.widget-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}' +
  '.widget-title{font-weight:700;font-size:18px;color:#1a1a1a}' +
  '.widget-badge{background:#EEEDFE;color:#534AB7;font-size:12px;padding:3px 8px;border-radius:4px;font-weight:500;margin-left:10px}' +
  '.widget-see-all{color:#7F77DD;font-size:13px;text-decoration:none;font-weight:500}' +
  '.widget-summary{background:#f9f9f9;border-radius:10px;padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:20px}' +
  '.widget-avg{text-align:center;min-width:70px}' +
  '.widget-avg-num{font-size:38px;font-weight:700;color:#1a1a1a;line-height:1}' +
  '.widget-stars{color:#f5a623;font-size:16px}' +
  '.widget-count{color:#888;font-size:12px;margin-top:2px}' +
  '.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:5px}' +
  '.bar-label{font-size:12px;color:#888;width:12px}' +
  '.bar-star{color:#f5a623;font-size:12px}' +
  '.bar-track{flex:1;background:#e8e8e8;border-radius:4px;height:6px}' +
  '.bar-fill{height:6px;border-radius:4px;background:#f5a623}' +
  '.bar-pct{font-size:12px;color:#888;width:30px}' +
  '.review-card{padding:14px 0;border-bottom:1px solid #f0f0f0}' +
  '.review-card:last-child{border-bottom:none}' +
  '.review-meta{display:flex;justify-content:space-between;margin-bottom:5px}' +
  '.review-author{font-weight:600;font-size:14px}' +
  '.review-verified{margin-left:8px;background:#e8f5e9;color:#2e7d32;font-size:11px;padding:2px 6px;border-radius:3px}' +
  '.review-date{color:#aaa;font-size:12px}' +
  '.review-title{font-weight:500;font-size:14px;margin:5px 0 3px}' +
  '.review-body{font-size:14px;color:#4a4a4a;margin:4px 0 0;line-height:1.6}' +
  '.widget-cta{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap}' +
  '.btn-write{display:inline-block;background:#7F77DD;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500}' +
  '.btn-viewall{display:inline-block;background:transparent;color:#7F77DD;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;border:1px solid #7F77DD}' +
  '.widget-powered{margin-top:12px;font-size:11px;color:#bbb}' +
  '.rizzz-page{background:#f7f7fb;min-height:100vh;padding:32px 24px}' +
  '.rizzz-header{display:flex;align-items:center;gap:12px;margin-bottom:28px}' +
  '.rizzz-logo{font-size:22px;font-weight:800;color:#534AB7;letter-spacing:-.5px}' +
  '.rizzz-logo span{color:#f5a623}' +
  '.review-form-card{background:#fff;border-radius:16px;border:1px solid #e1e3e5;padding:28px;max-width:640px;margin:0 auto;box-shadow:0 2px 12px rgba(0,0,0,.06)}' +
  '.form-product-row{display:flex;align-items:center;gap:14px;padding:14px;background:#f9f9f9;border-radius:10px;margin-bottom:24px}' +
  '.form-product-thumb{width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,#e0d7f5,#c8b8f0);display:flex;align-items:center;justify-content:center;font-size:26px}' +
  '.form-product-name{font-weight:600;font-size:15px}' +
  '.form-product-shop{font-size:12px;color:#888;margin-top:2px}' +
  '.form-section{margin-bottom:20px}' +
  '.form-label{font-size:13px;font-weight:600;color:#202223;display:block;margin-bottom:8px}' +
  '.star-picker{display:flex;gap:6px;font-size:32px;cursor:pointer}' +
  '.star-picker span{color:#e0e0e0;transition:color .1s}' +
  '.star-picker span.lit{color:#f5a623}' +
  '.form-input{width:100%;padding:10px 12px;border:1px solid #c9cccf;border-radius:8px;font-size:14px;background:#fff;color:#202223;font-family:inherit}' +
  'textarea.form-input{resize:vertical;min-height:100px}' +
  '.form-hint{font-size:12px;color:#8c9196;margin-top:4px}' +
  '.btn-submit{width:100%;background:#534AB7;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px}' +
  '.btn-submit:hover{background:#4338a0}' +
  '.verified-note{display:flex;align-items:center;gap:8px;background:#e8f5e9;border-radius:8px;padding:10px 14px;font-size:13px;color:#2e7d32;margin-bottom:20px}';

// ── Widget preview page (product page with embedded widget) ────
function starHtml(n, filled) {
  var s = '';
  for (var i = 1; i <= 5; i++) {
    s += el('span','style="color:' + (i <= n ? '#f5a623' : '#e0e0e0') + ';font-size:15px"', i <= n ? '&#x2605;' : '&#x2606;');
  }
  return s;
}

function barRow(star, pct) {
  return el('div','class="bar-row"',
    el('span','class="bar-label"', String(star)) +
    el('span','class="bar-star"','&#x2605;') +
    el('div','class="bar-track"', el('div','class="bar-fill" style="width:'+pct+'%"','')) +
    el('span','class="bar-pct"', pct+'%')
  );
}

function reviewCard(author, verified, rating, title, body, date) {
  return el('div','class="review-card"',
    el('div','class="review-meta"',
      el('div','',
        el('span','class="review-author"', author) +
        (verified ? el('span','class="review-verified"','&#x2713; Verified') : '')
      ) +
      el('span','class="review-date"', date)
    ) +
    el('div','class="widget-stars"', starHtml(rating)) +
    el('div','class="review-title"', title) +
    el('p','class="review-body"', body)
  );
}

var widgetPage =
  el('div','class="page" id="page-widget"',
    el('div','class="product-page"',

      // Shopify theme chrome hint
      el('div','style="font-size:12px;color:#aaa;margin-bottom:16px;padding:8px 12px;background:#fff;border-radius:6px;border:1px solid #e1e3e5"',
        '&#x1F6CD;&#xFE0F; This is how the widget appears on a Shopify product page'
      ) +

      // Product hero
      el('div','class="product-hero"',
        el('div','class="product-img"','&#x1F45F;') +
        el('div','class="product-info"',
          el('div','class="product-title"','Air Max Pro Running Shoes') +
          el('div','style="display:flex;align-items:center;gap:8px"',
            el('span','class="widget-stars"', starHtml(4)) +
            el('span','style="font-size:13px;color:#888"','4.3 (142 reviews)')
          ) +
          el('div','class="product-price"','&#x20B9;4,999') +
          el('p','class="product-desc"','Premium running shoes with advanced cushioning technology. Designed for long-distance comfort and performance. Available in multiple colors.') +
          el('button','class="add-to-cart"','Add to Cart')
        )
      ) +

      // Rizzz widget section
      el('div','class="widget-section"',

        // Widget header
        el('div','class="widget-header"',
          el('div','',
            el('span','class="widget-title"','Community Reviews') +
            el('span','class="widget-badge"','142 reviews')
          ) +
          el('a','href="#" class="widget-see-all"','See all on Rizzz &#x2197;')
        ) +

        // Summary
        el('div','class="widget-summary"',
          el('div','class="widget-avg"',
            el('div','class="widget-avg-num"','4.3') +
            el('div','class="widget-stars"', starHtml(4)) +
            el('div','class="widget-count"','142 reviews')
          ) +
          el('div','style="flex:1"',
            barRow(5, 58) + barRow(4, 24) + barRow(3, 10) + barRow(2, 5) + barRow(1, 3)
          )
        ) +

        // Review cards
        reviewCard('Priya S.', true, 5, 'Best running shoes I\'ve owned!', 'Incredibly comfortable for long runs. The cushioning is amazing and they look great too. Highly recommend!', '4 Jul 2026') +
        reviewCard('Rahul M.', true, 4, 'Great quality, slightly narrow', 'Really good shoes overall. The build quality is excellent. Just a bit narrow for wide feet — size up if needed.', '3 Jul 2026') +
        reviewCard('Ananya K.', false, 5, 'Perfect for daily use', 'I use these for both gym and casual wear. Super versatile and comfortable all day long.', '1 Jul 2026') +

        // CTAs
        el('div','class="widget-cta"',
          el('a','href="#" class="btn-write"','Write a review on Rizzz &#x2197;') +
          el('a','href="#" class="btn-viewall"','View all 142 reviews')
        ) +

        el('p','class="widget-powered"',
          'Powered by ' + el('a','href="#" style="color:#7F77DD;text-decoration:none"','Rizzz community')
        )
      )
    )
  );

// ── Review submission form page (rizzz.online) ─────────────────
function starPickerStar(n) {
  return el('span','class="' + (n <= 4 ? 'lit' : '') + '" data-val="' + n + '"', '&#x2605;');
}

var reviewFormPage =
  el('div','class="page" id="page-review"',
    el('div','class="rizzz-page"',

      // Rizzz header
      el('div','class="rizzz-header"',
        el('div','class="rizzz-logo"',
          'Rizz' + el('span','','z')
        ) +
        el('span','style="font-size:13px;color:#888"','Community Reviews Platform')
      ) +

      el('div','class="review-form-card"',

        el('h2','style="font-size:20px;font-weight:700;margin-bottom:20px;color:#1a1a1a"','Write a Review') +

        // Verified purchase note
        el('div','class="verified-note"',
          el('span','','&#x2713;') +
          el('span','','Verified purchase — your review will be marked as verified')
        ) +

        // Product row
        el('div','class="form-product-row"',
          el('div','class="form-product-thumb"','&#x1F45F;') +
          el('div','',
            el('div','class="form-product-name"','Air Max Pro Running Shoes') +
            el('div','class="form-product-shop"','demo-store.myshopify.com')
          )
        ) +

        // Star rating picker
        el('div','class="form-section"',
          el('label','class="form-label"','Your rating ' + el('span','style="color:#e53e3e"','*')) +
          el('div','class="star-picker" id="star-picker"',
            starPickerStar(1) + starPickerStar(2) + starPickerStar(3) + starPickerStar(4) + starPickerStar(5)
          ) +
          el('div','class="form-hint"','Click to select your rating')
        ) +

        // Review title
        el('div','class="form-section"',
          el('label','class="form-label"','Review title ' + el('span','style="color:#e53e3e"','*')) +
          el('input','type="text" class="form-input" placeholder="Summarise your experience in one line"','') +
          el('div','class="form-hint"','e.g. "Best running shoes I\'ve owned!"')
        ) +

        // Review body
        el('div','class="form-section"',
          el('label','class="form-label"','Your review ' + el('span','style="color:#e53e3e"','*')) +
          el('textarea','class="form-input" placeholder="Tell others what you think about this product. What did you like or dislike? How was the quality, fit, or performance?"','') +
          el('div','class="form-hint"','Minimum 20 characters')
        ) +

        // Name
        el('div','class="form-section"',
          el('label','class="form-label"','Your name ' + el('span','style="color:#e53e3e"','*')) +
          el('input','type="text" class="form-input" placeholder="e.g. Priya S."','')
        ) +

        // Email
        el('div','class="form-section"',
          el('label','class="form-label"','Email address') +
          el('input','type="email" class="form-input" placeholder="your@email.com (not shown publicly)"','') +
          el('div','class="form-hint"','Used to verify your purchase. Never shown publicly.')
        ) +

        el('button','class="btn-submit" onclick="submitReview()"','Submit Review')
      )
    )
  );

// ── Read existing gen_preview.js and patch it ──────────────────
var src = fs.readFileSync('gen_preview.js', 'utf8');

// 1. Add extra CSS
src = src.replace(
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}'",
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}',\n  '" + extraCss + "'"
);

// 2. Add nav items
src = src.replace(
  "el('div','class=\"nav\" id=\"nav-settings\" onclick=\"showPage(event,\\'settings\\')\"','&#x2699;&#xFE0F;&nbsp; Settings')",
  "el('div','class=\"nav\" id=\"nav-settings\" onclick=\"showPage(event,\\'settings\\')\"','&#x2699;&#xFE0F;&nbsp; Settings') +\n    el('div','class=\"nav\" id=\"nav-widget\" onclick=\"showPage(event,\\'widget\\')\"','&#x1F6CD;&#xFE0F;&nbsp; Product Widget') +\n    el('div','class=\"nav\" id=\"nav-review\" onclick=\"showPage(event,\\'review\\')\"','&#x2B50;&nbsp; Write a Review')"
);

// 3. Add pages before closing main
src = src.replace(
  'dashboard + settings',
  'dashboard + settings + widgetPage + reviewFormPage'
);

// 4. Add star picker script
src = src.replace(
  "'e.currentTarget.classList.add(\"active\");}' +",
  "'e.currentTarget.classList.add(\"active\");}' +\n  'function initStars(){var sp=document.getElementById(\"star-picker\");if(!sp)return;var stars=sp.querySelectorAll(\"span\");stars.forEach(function(s,i){s.addEventListener(\"mouseover\",function(){stars.forEach(function(x,j){x.classList.toggle(\"lit\",j<=i);});});s.addEventListener(\"click\",function(){s.dataset.selected=1;});});sp.addEventListener(\"mouseleave\",function(){var sel=0;stars.forEach(function(x){if(x.dataset.selected)sel=parseInt(x.dataset.val);});stars.forEach(function(x,j){x.classList.toggle(\"lit\",j<sel);});});}' +\n  'document.addEventListener(\"DOMContentLoaded\",initStars);' +"
);

// 5. Add submitReview function
src = src.replace(
  "'function copyEmbed(){' +",
  "'function submitReview(){alert(\"Review submitted! Thank you.\");}' +\n  'function copyEmbed(){' +"
);

// 6. Inject widgetPage and reviewFormPage variables before the html assembly
src = src.replace(
  'var html =',
  'var widgetPage = ' + JSON.stringify(widgetPage) + ';\nvar reviewFormPage = ' + JSON.stringify(reviewFormPage) + ';\nvar html ='
);

fs.writeFileSync('gen_preview.js', src);
console.log('Patched gen_preview.js');