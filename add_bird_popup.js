// Adds floating bird popup to the widget preview AND updates rizzz-widget.js
var fs = require('fs');
var o = '<', c = '>';
function el(tag, attrs, inner) {
  return o + tag + (attrs ? ' ' + attrs : '') + c + (inner || '') + o + '/' + tag + c;
}

// ── 1. Update rizzz-widget.js to add the floating bird button ──
var widgetSrc = fs.readFileSync('public/widget/rizzz-widget.js', 'utf8');

// Append the bird popup code before the closing IIFE
var birdCode = `

  // ── Floating Bird Review Button ────────────────────────────
  function injectBirdButton(handle) {
    if (document.getElementById('rizzz-bird-btn')) return;

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '#rizzz-bird-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:60px;height:60px;border-radius:50%;background:#534AB7;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(83,74,183,.45);display:flex;align-items:center;justify-content:center;font-size:28px;transition:transform .2s,box-shadow .2s;animation:rizzz-bounce 2s infinite}',
      '#rizzz-bird-btn:hover{transform:scale(1.12);box-shadow:0 6px 24px rgba(83,74,183,.6)}',
      '#rizzz-bird-tooltip{position:fixed;bottom:92px;right:24px;z-index:9999;background:#1a1a1a;color:#fff;font-size:12px;font-weight:500;padding:6px 12px;border-radius:20px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s;font-family:-apple-system,sans-serif}',
      '#rizzz-bird-btn:hover + #rizzz-bird-tooltip{opacity:1}',
      '@keyframes rizzz-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
      '#rizzz-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:none;align-items:flex-end;justify-content:center;backdrop-filter:blur(2px)}',
      '#rizzz-popup-overlay.open{display:flex}',
      '#rizzz-popup{background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;animation:rizzz-slide-up .3s ease}',
      '@keyframes rizzz-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}',
      '#rizzz-popup-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}',
      '#rizzz-popup-title{font-size:18px;font-weight:700;color:#1a1a1a}',
      '#rizzz-popup-close{background:none;border:none;font-size:22px;cursor:pointer;color:#888;line-height:1}',
      '#rizzz-popup-product{display:flex;align-items:center;gap:12px;background:#f9f9f9;border-radius:10px;padding:12px;margin-bottom:20px}',
      '#rizzz-popup-product-img{width:48px;height:48px;border-radius:8px;object-fit:cover}',
      '.rizzz-form-label{font-size:13px;font-weight:600;color:#202223;display:block;margin-bottom:6px}',
      '.rizzz-star-row{display:flex;gap:8px;margin-bottom:16px}',
      '.rizzz-star{font-size:32px;cursor:pointer;color:#e0e0e0;transition:color .1s;line-height:1}',
      '.rizzz-star.lit{color:#f5a623}',
      '.rizzz-input{width:100%;padding:10px 12px;border:1px solid #c9cccf;border-radius:8px;font-size:14px;font-family:inherit;margin-bottom:14px;box-sizing:border-box}',
      'textarea.rizzz-input{resize:vertical;min-height:90px}',
      '#rizzz-submit-btn{width:100%;background:#534AB7;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:4px}',
      '#rizzz-submit-btn:hover{background:#4338a0}',
      '#rizzz-popup-logo{font-size:11px;color:#bbb;text-align:center;margin-top:12px}'
    ].join('');
    document.head.appendChild(style);

    // Bird button
    var btn = document.createElement('button');
    btn.id = 'rizzz-bird-btn';
    btn.title = 'Write a review';
    btn.innerHTML = '&#x1F426;';
    document.body.appendChild(btn);

    // Tooltip
    var tip = document.createElement('div');
    tip.id = 'rizzz-bird-tooltip';
    tip.textContent = 'Drop a review!';
    document.body.appendChild(tip);

    // Popup overlay
    var overlay = document.createElement('div');
    overlay.id = 'rizzz-popup-overlay';
    overlay.innerHTML = buildPopupHTML(handle);
    document.body.appendChild(overlay);

    // Open popup on bird click
    btn.addEventListener('click', function() {
      overlay.classList.add('open');
      initStarPicker();
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });

    // Close button
    overlay.querySelector('#rizzz-popup-close').addEventListener('click', function() {
      overlay.classList.remove('open');
    });

    // Submit
    overlay.querySelector('#rizzz-submit-btn').addEventListener('click', function() {
      var rating = parseInt(overlay.querySelector('#rizzz-popup').dataset.rating || '0');
      var title  = overlay.querySelector('#rizzz-review-title').value.trim();
      var body   = overlay.querySelector('#rizzz-review-body').value.trim();
      var name   = overlay.querySelector('#rizzz-reviewer-name').value.trim();
      if (!rating) { alert('Please select a star rating.'); return; }
      if (!body || body.length < 10) { alert('Please write at least 10 characters.'); return; }
      if (!name) { alert('Please enter your name.'); return; }
      submitReview({ handle: handle, rating: rating, title: title, body: body, name: name });
    });
  }

  function buildPopupHTML(handle) {
    var productTitle = document.querySelector('.product__title, h1.product-title, h1') 
                       ? (document.querySelector('.product__title, h1.product-title, h1').textContent.trim()) 
                       : handle;
    return '' +
      '' +
        '&#x1F426; Drop a Review' +
        '<button id="rizzz-popup-close">&times;</button>' +
      '' +
      '' +
        '<div style="width:48px;height:48px;border-radius:8px;background:linear-gradient(135deg,#e0d7f5,#c8b8f0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">&#x1F6CD;&#xFE0F;' +
        '' + esc(productTitle) + '' +
        '' + esc(SHOP) + '' +
      '' +
      '<label class="rizzz-form-label">Your rating <span style="color:#e53e3e">*</label>' +
      '<div class="rizzz-star-row" id="rizzz-star-row">' +
        '&#x2605;' +
        '&#x2605;' +
        '&#x2605;' +
        '<span class="rizzz-star" data-val="4">&#x2605;' +
        '&#x2605;' +
      '' +
      '<label class="rizzz-form-label">Review title</label>' +
      '<input id="rizzz-review-title" class="rizzz-input" type="text" placeholder="Summarise your experience">' +
      '<label class="rizzz-form-label">Your review *</label>' +
      '<textarea id="rizzz-review-body" class="rizzz-input" placeholder="What did you like or dislike? How was the quality?"></textarea>' +
      '<label class="rizzz-form-label">Your name *</label>' +
      '<input id="rizzz-reviewer-name" class="rizzz-input" type="text" placeholder="e.g. Priya S.">' +
      '<button id="rizzz-submit-btn">Submit Review</button>' +
      'Powered by <a href="' + BASE + '" target="_blank" style="color:#7F77DD;text-decoration:none;">Rizzz community</a>' +
    '';
  }

  function initStarPicker() {
    var popup  = document.getElementById('rizzz-popup');
    var stars  = document.querySelectorAll('#rizzz-star-row .rizzz-star');
    var selected = 0;
    stars.forEach(function(s, i) {
      s.addEventListener('mouseover', function() {
        stars.forEach(function(x, j) { x.classList.toggle('lit', j <= i); });
      });
      s.addEventListener('click', function() {
        selected = i + 1;
        popup.dataset.rating = selected;
        stars.forEach(function(x, j) { x.classList.toggle('lit', j < selected); });
      });
    });
    document.getElementById('rizzz-star-row').addEventListener('mouseleave', function() {
      stars.forEach(function(x, j) { x.classList.toggle('lit', j < selected); });
    });
  }

  async function submitReview(data) {
    try {
      var res = await fetch(API + '/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop:    SHOP,
          handle:  data.handle,
          rating:  data.rating,
          title:   data.title,
          body:    data.body,
          author:  data.name
        })
      });
      if (res.ok) {
        document.getElementById('rizzz-popup').innerHTML =
          '' +
            '<div style="font-size:48px;margin-bottom:12px;">&#x1F389;' +
            '<div style="font-size:18px;font-weight:700;margin-bottom:8px;">Thank you!' +
            'Your review has been submitted and will appear shortly.' +
          '';
        setTimeout(function() {
          document.getElementById('rizzz-popup-overlay').classList.remove('open');
        }, 2500);
      } else {
        alert('Could not submit review. Please try again.');
      }
    } catch(e) {
      alert('Network error. Please try again.');
    }
  }

  // ── Updated init: also inject bird button ──────────────────
  function initWithBird() {
    var handle = getHandle();
    var el = document.getElementById('rizzz-reviews') ||
             document.querySelector('[data-rizzz-reviews]');

    if (!el) {
      var anchor = document.querySelector('.product__description') ||
                   document.querySelector('.product-description') ||
                   document.querySelector('[data-product-description]') ||
                   document.querySelector('.product-single__description');
      if (anchor) {
        el = document.createElement('div');
        el.id = 'rizzz-reviews';
        anchor.parentNode.insertBefore(el, anchor.nextSibling);
      }
    }

    if (el) mount(el);
    if (handle) injectBirdButton(handle);
  }
`;

// Replace the init function and boot code
widgetSrc = widgetSrc.replace(
  '  // ── Boot: find or inject container ────────────────────────\n  function init() {',
  birdCode + '\n  // ── Boot: find or inject container ────────────────────────\n  function init() {'
);

// Replace the boot call to use initWithBird
widgetSrc = widgetSrc.replace(
  '  if (document.readyState === "loading") {\n    document.addEventListener("DOMContentLoaded", init);\n  } else {\n    init();\n  }',
  '  if (document.readyState === "loading") {\n    document.addEventListener("DOMContentLoaded", initWithBird);\n  } else {\n    initWithBird();\n  }'
);

fs.writeFileSync('public/widget/rizzz-widget.js', widgetSrc);
console.log('rizzz-widget.js updated with bird popup');

// ── 2. Add bird popup preview CSS ──────────────────────────────
var birdPreviewCss =
  '.bird-demo-wrap{position:relative;background:#f7f7fb;border-radius:12px;padding:24px;margin-bottom:24px;min-height:200px;border:1px solid #e1e3e5}' +
  '.bird-demo-label{font-size:12px;color:#888;margin-bottom:12px;font-style:italic}' +
  '.bird-fab{position:absolute;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#534AB7;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(83,74,183,.45);display:flex;align-items:center;justify-content:center;font-size:28px;animation:bird-bounce 2s infinite;z-index:10}' +
  '.bird-fab:hover{transform:scale(1.12)}' +
  '@keyframes bird-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}' +
  '.bird-tooltip{position:absolute;bottom:92px;right:24px;background:#1a1a1a;color:#fff;font-size:12px;font-weight:500;padding:6px 12px;border-radius:20px;white-space:nowrap;z-index:10}' +
  '.bird-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:none;align-items:flex-end;justify-content:center;backdrop-filter:blur(2px)}' +
  '.bird-popup-overlay.open{display:flex}' +
  '.bird-popup{background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:24px;font-family:-apple-system,sans-serif;animation:bird-slide-up .3s ease}' +
  '@keyframes bird-slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
  '.bp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}' +
  '.bp-title{font-size:18px;font-weight:700;color:#1a1a1a}' +
  '.bp-close{background:none;border:none;font-size:22px;cursor:pointer;color:#888;line-height:1}' +
  '.bp-product{display:flex;align-items:center;gap:12px;background:#f9f9f9;border-radius:10px;padding:12px;margin-bottom:20px}' +
  '.bp-product-img{width:48px;height:48px;border-radius:8px;background:linear-gradient(135deg,#e0d7f5,#c8b8f0);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}' +
  '.bp-label{font-size:13px;font-weight:600;color:#202223;display:block;margin-bottom:6px}' +
  '.bp-star-row{display:flex;gap:8px;margin-bottom:16px}' +
  '.bp-star{font-size:32px;cursor:pointer;color:#e0e0e0;transition:color .1s;line-height:1;user-select:none}' +
  '.bp-star.lit{color:#f5a623}' +
  '.bp-input{width:100%;padding:10px 12px;border:1px solid #c9cccf;border-radius:8px;font-size:14px;font-family:inherit;margin-bottom:14px;box-sizing:border-box}' +
  'textarea.bp-input{resize:vertical;min-height:90px}' +
  '.bp-submit{width:100%;background:#534AB7;color:#fff;border:none;padding:14px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:4px}' +
  '.bp-submit:hover{background:#4338a0}' +
  '.bp-logo{font-size:11px;color:#bbb;text-align:center;margin-top:12px}' +
  '.bp-success{text-align:center;padding:40px 20px}' +
  '.bp-success-icon{font-size:48px;margin-bottom:12px}' +
  '.bp-success-title{font-size:18px;font-weight:700;margin-bottom:8px}' +
  '.bp-success-text{font-size:14px;color:#888}';

// ── 3. Build the bird popup preview page ───────────────────────
function bpStar(n) {
  return el('span','class="bp-star" data-val="' + n + '"','&#x2605;');
}

var birdPopupPage =
  el('div','class="page" id="page-birdpopup"',
    el('div','style="padding:32px 40px;max-width:900px;margin:0 auto"',

      el('h1','style="font-size:22px;font-weight:700;margin-bottom:6px"','&#x1F426; Floating Bird Review Button') +
      el('p','style="font-size:14px;color:#6d7175;margin-bottom:24px"',
        'A floating bird button appears on every product page after the widget is installed. Clicking it opens an inline review popup — no page redirect needed.'
      ) +

      // How it works
      el('div','style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px"',
        el('div','class="card"',
          el('div','style="font-size:28px;margin-bottom:8px"','&#x1F426;') +
          el('div','style="font-weight:600;font-size:14px;margin-bottom:4px"','Floating Bird Button') +
          el('p','style="font-size:13px;color:#6d7175;margin:0"','Fixed to bottom-right of every product page. Bounces gently to attract attention. Shows "Drop a review!" tooltip on hover.')
        ) +
        el('div','class="card"',
          el('div','style="font-size:28px;margin-bottom:8px"','&#x1F4DD;') +
          el('div','style="font-weight:600;font-size:14px;margin-bottom:4px"','Inline Popup Form') +
          el('p','style="font-size:13px;color:#6d7175;margin:0"','Slides up from the bottom. Customer rates, writes, and submits without leaving the page. POSTs directly to the Rizzz API.')
        )
      ) +

      // Live demo
      el('div','style="font-weight:600;font-size:15px;margin-bottom:12px"','&#x1F3AE; Live Demo — click the bird button') +
      el('div','class="bird-demo-wrap"',
        el('div','class="bird-demo-label"','&#x1F6CD;&#xFE0F; This is how the product page looks with the bird button active') +
        el('div','style="font-size:14px;color:#555;line-height:1.8"',
          el('strong','','Air Max Pro Running Shoes') + el('br','','') +
          'Premium running shoes engineered for long-distance performance...' + el('br','','') +
          el('span','style="color:#f5a623"','&#x2605;&#x2605;&#x2605;&#x2605;&#x2606;') + ' 4.3 (142 reviews)'
        ) +
        el('div','class="bird-tooltip"','Drop a review! &#x1F4AC;') +
        el('button','class="bird-fab" onclick="openBirdPopup()"','&#x1F426;')
      ) +

      // Popup overlay (hidden by default)
      el('div','class="bird-popup-overlay" id="bird-popup-overlay" onclick="closeBirdPopup(event)"',
        el('div','class="bird-popup" id="bird-popup"',
          el('div','class="bp-header"',
            el('div','class="bp-title"','&#x1F426; Drop a Review') +
            el('button','class="bp-close" onclick="closeBirdPopup()"','&times;')
          ) +
          el('div','class="bp-product"',
            el('div','class="bp-product-img"','&#x1F45F;') +
            el('div','',
              el('div','style="font-weight:600;font-size:14px"','Air Max Pro Running Shoes') +
              el('div','style="font-size:12px;color:#888;margin-top:2px"','demo-store.myshopify.com')
            )
          ) +
          el('label','class="bp-label"','Your rating ' + el('span','style="color:#e53e3e"','*')) +
          el('div','class="bp-star-row" id="bp-star-row"',
            bpStar(1) + bpStar(2) + bpStar(3) + bpStar(4) + bpStar(5)
          ) +
          el('label','class="bp-label"','Review title') +
          el('input','type="text" class="bp-input" id="bp-title" placeholder="Summarise your experience"','') +
          el('label','class="bp-label"','Your review ' + el('span','style="color:#e53e3e"','*')) +
          el('textarea','class="bp-input" id="bp-body" placeholder="What did you like or dislike? How was the quality, fit, or performance?"','') +
          el('label','class="bp-label"','Your name ' + el('span','style="color:#e53e3e"','*')) +
          el('input','type="text" class="bp-input" id="bp-name" placeholder="e.g. Priya S."','') +
          el('button','class="bp-submit" onclick="submitBirdReview()"','Submit Review') +
          el('div','class="bp-logo"','Powered by ' + el('a','href="#" style="color:#7F77DD;text-decoration:none"','Rizzz community'))
        )
      ) +

      // Code snippet
      el('div','style="font-weight:600;font-size:15px;margin:28px 0 12px"','&#x1F4C4; How it\'s injected') +
      el('div','class="card"',
        el('p','style="font-size:13px;color:#6d7175;margin-bottom:12px"',
          'The bird button is injected by ' +
          el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','rizzz-widget.js') +
          ' alongside the review widget. No extra configuration needed — it activates automatically when the widget script tag is installed.'
        ) +
        el('div','style="background:#1e1e2e;color:#cdd6f4;border-radius:8px;padding:14px 16px;font-family:monospace;font-size:12px;line-height:1.8"',
          el('span','style="color:#6c7086"','// rizzz-widget.js — runs on every product page') + '\n' +
          el('span','style="color:#cba6f7"','function') + ' ' + el('span','style="color:#89b4fa"','initWithBird') + '() {\n' +
          '  ' + el('span','style="color:#89b4fa"','mount') + '(reviewContainer);   ' + el('span','style="color:#6c7086"','// renders review list') + '\n' +
          '  ' + el('span','style="color:#89b4fa"','injectBirdButton') + '(handle); ' + el('span','style="color:#6c7086"','// adds floating bird FAB') + '\n' +
          '}\n\n' +
          el('span','style="color:#6c7086"','// On submit, POSTs directly to Rizzz API:') + '\n' +
          el('span','style="color:#89b4fa"','fetch') + '(API + ' + el('span','style="color:#a6e3a1"','"/reviews"') + ', {\n' +
          '  method: ' + el('span','style="color:#a6e3a1"','"POST"') + ',\n' +
          '  body: JSON.' + el('span','style="color:#89b4fa"','stringify') + '({ shop, handle, rating, title, body, author })\n' +
          '});'
        )
      )
    )
  );

// ── 4. Patch gen_preview.js ────────────────────────────────────
var src = fs.readFileSync('gen_preview.js', 'utf8');

// Add CSS
src = src.replace(
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}'",
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}',\n  '" + birdPreviewCss + "'"
);

// Add nav item
src = src.replace(
  "el('div','class=\"nav\" id=\"nav-emailflow\" onclick=\"showPage(event,\\'emailflow\\')\"','&#x1F4E7;&nbsp; Auto Email Flow')",
  "el('div','class=\"nav\" id=\"nav-emailflow\" onclick=\"showPage(event,\\'emailflow\\')\"','&#x1F4E7;&nbsp; Auto Email Flow') +\n    el('div','class=\"nav\" id=\"nav-birdpopup\" onclick=\"showPage(event,\\'birdpopup\\')\"','&#x1F426;&nbsp; Bird Popup')"
);

// Add page
src = src.replace(
  'dashboard + settings + widgetPage + reviewFormPage + brandPage + emailFlowPage',
  'dashboard + settings + widgetPage + reviewFormPage + brandPage + emailFlowPage + birdPopupPage'
);

// Inject variable
src = src.replace(
  'var emailFlowPage =',
  'var birdPopupPage = ' + JSON.stringify(birdPopupPage) + ';\nvar emailFlowPage ='
);

// Add bird popup JS functions to scriptCode
var birdJs = [
  'function openBirdPopup(){',
    'document.getElementById("bird-popup-overlay").classList.add("open");',
    'initBirdStars();',
  '}',
  'function closeBirdPopup(e){',
    'if(!e||e.target===document.getElementById("bird-popup-overlay")){',
      'document.getElementById("bird-popup-overlay").classList.remove("open");',
    '}',
  '}',
  'function initBirdStars(){',
    'var stars=document.querySelectorAll("#bp-star-row .bp-star");',
    'var sel=0;',
    'stars.forEach(function(s,i){',
      's.onmouseover=function(){stars.forEach(function(x,j){x.classList.toggle("lit",j<=i);});};',
      's.onclick=function(){sel=i+1;stars.forEach(function(x,j){x.classList.toggle("lit",j<sel);});};',
    '});',
    'document.getElementById("bp-star-row").onmouseleave=function(){',
      'stars.forEach(function(x,j){x.classList.toggle("lit",j<sel);});',
    '};',
  '}',
  'function submitBirdReview(){',
    'var stars=document.querySelectorAll("#bp-star-row .bp-star");',
    'var rating=0;',
    'stars.forEach(function(s,i){if(s.classList.contains("lit"))rating=i+1;});',
    'var title=document.getElementById("bp-title").value.trim();',
    'var body=document.getElementById("bp-body").value.trim();',
    'var name=document.getElementById("bp-name").value.trim();',
    'if(!rating){alert("Please select a star rating.");return;}',
    'if(body.length<10){alert("Please write at least 10 characters.");return;}',
    'if(!name){alert("Please enter your name.");return;}',
    'var popup=document.getElementById("bird-popup");',
    'popup.innerHTML="&#x1F389;Thank you!Your review has been submitted and will appear shortly.";',
    'setTimeout(function(){document.getElementById("bird-popup-overlay").classList.remove("open");},2500);',
  '}'
].join('');

src = src.replace(
  "'function submitReview(){alert(\"Review submitted! Thank you.\");}' +",
  "'" + birdJs + "' +\n  'function submitReview(){alert(\"Review submitted! Thank you.\");}' +"
);

fs.writeFileSync('gen_preview.js', src);
console.log('Bird popup page patched into gen_preview.js');