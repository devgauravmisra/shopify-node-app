// Adds an auto-email flow diagram page to the preview
var fs = require('fs');
var o = '<', c = '>';
function el(tag, attrs, inner) {
  return o + tag + (attrs ? ' ' + attrs : '') + c + (inner || '') + o + '/' + tag + c;
}

var emailCss =
  '.flow-page{padding:32px 40px;max-width:1000px;margin:0 auto}' +
  '.flow-title{font-size:22px;font-weight:700;margin-bottom:6px}' +
  '.flow-subtitle{font-size:14px;color:#6d7175;margin-bottom:32px}' +
  '.flow-steps{display:flex;flex-direction:column;gap:0}' +
  '.flow-step{display:flex;gap:20px;position:relative}' +
  '.flow-step:not(:last-child)::after{content:"";position:absolute;left:23px;top:52px;width:2px;height:calc(100% - 20px);background:#e1e3e5}' +
  '.flow-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;z-index:1;border:2px solid #fff}' +
  '.flow-icon-shopify{background:#96bf48;color:#fff}' +
  '.flow-icon-node{background:#5c2d91;color:#fff}' +
  '.flow-icon-db{background:#0c4a8a;color:#fff}' +
  '.flow-icon-api{background:#534AB7;color:#fff}' +
  '.flow-icon-email{background:#f5a623;color:#fff}' +
  '.flow-icon-customer{background:#1a6b3c;color:#fff}' +
  '.flow-icon-rizzz{background:#7F77DD;color:#fff}' +
  '.flow-body{padding:0 0 32px 0;flex:1}' +
  '.flow-step-title{font-size:15px;font-weight:700;color:#202223;margin-bottom:4px;margin-top:12px}' +
  '.flow-step-desc{font-size:13px;color:#6d7175;line-height:1.7;margin-bottom:8px}' +
  '.flow-code{background:#1e1e2e;color:#cdd6f4;border-radius:8px;padding:14px 16px;font-family:monospace;font-size:12px;line-height:1.8;margin-bottom:8px;overflow-x:auto}' +
  '.flow-code .kw{color:#cba6f7}' +
  '.flow-code .str{color:#a6e3a1}' +
  '.flow-code .cm{color:#6c7086}' +
  '.flow-code .fn{color:#89b4fa}' +
  '.flow-code .num{color:#fab387}' +
  '.flow-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;margin-right:6px;margin-bottom:4px}' +
  '.tag-file{background:#f0eeff;color:#5c2d91}' +
  '.tag-db{background:#d0e8ff;color:#0c4a8a}' +
  '.tag-api{background:#e8f5e9;color:#1a6b3c}' +
  '.tag-webhook{background:#fff3cd;color:#7d5c00}' +
  '.flow-email-preview{background:#fff;border:1px solid #e1e3e5;border-radius:10px;overflow:hidden;max-width:480px;box-shadow:0 2px 8px rgba(0,0,0,.08)}' +
  '.email-header{background:#534AB7;padding:20px 24px;color:#fff}' +
  '.email-logo{font-size:18px;font-weight:800;letter-spacing:-.3px}' +
  '.email-logo span{color:#f5a623}' +
  '.email-body{padding:24px}' +
  '.email-hi{font-size:16px;font-weight:600;margin-bottom:8px}' +
  '.email-text{font-size:14px;color:#555;line-height:1.7;margin-bottom:16px}' +
  '.email-product{display:flex;align-items:center;gap:12px;background:#f9f9f9;border-radius:8px;padding:12px;margin-bottom:16px}' +
  '.email-product-img{width:48px;height:48px;background:linear-gradient(135deg,#e0d7f5,#c8b8f0);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:22px}' +
  '.email-product-name{font-size:14px;font-weight:600}' +
  '.email-product-order{font-size:12px;color:#888}' +
  '.email-stars{display:flex;gap:6px;margin-bottom:16px}' +
  '.email-star{width:36px;height:36px;border-radius:6px;border:2px solid #e0e0e0;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;color:#e0e0e0}' +
  '.email-star:hover{border-color:#f5a623;color:#f5a623}' +
  '.email-cta{display:block;background:#534AB7;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:12px}' +
  '.email-footer{font-size:11px;color:#aaa;text-align:center;padding:12px 24px;border-top:1px solid #f0f0f0}' +
  '.flow-settings-note{background:#f0eeff;border:1px solid #c8b8f0;border-radius:8px;padding:12px 16px;font-size:13px;color:#5c2d91;margin-bottom:8px}' +
  '.status-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}' +
  '.status-pill{padding:4px 10px;border-radius:20px;font-size:12px;font-weight:500}' +
  '.sp-pending{background:#fff3cd;color:#7d5c00}' +
  '.sp-sent{background:#d0e8ff;color:#0c4a8a}' +
  '.sp-reviewed{background:#d4edda;color:#1a6b3c}';

// Build the email preview mock
var emailPreview =
  el('div','class="flow-email-preview"',
    el('div','class="email-header"',
      el('div','class="email-logo"','Rizz' + el('span','','z') + ' Reviews') +
      el('div','style="font-size:12px;opacity:.8;margin-top:4px"','How was your recent purchase?')
    ) +
    el('div','class="email-body"',
      el('div','class="email-hi"','Hi Priya! &#x1F44B;') +
      el('p','class="email-text"','You recently ordered from STRIDE Athletics. We\'d love to hear what you think! Your review helps other shoppers make better decisions.') +
      el('div','class="email-product"',
        el('div','class="email-product-img"','&#x1F45F;') +
        el('div','',
          el('div','class="email-product-name"','Air Max Pro Running Shoes') +
          el('div','class="email-product-order"','Order #1042 &nbsp;&#x2022;&nbsp; Delivered 28 Jun 2026')
        )
      ) +
      el('div','style="font-size:13px;font-weight:600;margin-bottom:8px;color:#202223"','Tap a star to rate:') +
      el('div','class="email-stars"',
        el('div','class="email-star"','&#x2605;') +
        el('div','class="email-star"','&#x2605;') +
        el('div','class="email-star"','&#x2605;') +
        el('div','class="email-star"','&#x2605;') +
        el('div','class="email-star"','&#x2605;')
      ) +
      el('a','href="#" class="email-cta"','Write a Full Review on Rizzz &#x2197;') +
      el('p','style="font-size:12px;color:#aaa;text-align:center"','Takes less than 2 minutes')
    ) +
    el('div','class="email-footer"',
      'Sent by Rizzz Reviews on behalf of STRIDE Athletics &nbsp;&#x2022;&nbsp; ' +
      el('a','href="#" style="color:#7F77DD"','Unsubscribe')
    )
  );

var emailFlowPage =
  el('div','class="page" id="page-emailflow"',
    el('div','class="flow-page"',

      el('h1','class="flow-title"','&#x1F4E7; Auto Review Email — How It Works') +
      el('p','class="flow-subtitle"','End-to-end flow from order fulfillment to customer review submission') +

      el('div','class="flow-steps"',

        // Step 1 — Merchant enables
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-shopify"','&#x2699;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 1 — Merchant enables Auto Emails') +
            el('span','class="flow-tag tag-file"','app/routes/app._index.jsx') +
            el('span','class="flow-tag tag-db"','MerchantStore DB') +
            el('p','class="flow-step-desc"',
              'In the Rizzz Reviews dashboard, the merchant clicks "Enable auto emails". ' +
              'This POSTs intent=toggle-email to the Remix action, which flips ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','autoEmailEnabled = true') +
              ' in the MerchantStore table. The merchant also sets the delay (3/5/7/14 days) in Settings.'
            ) +
            el('div','class="flow-settings-note"',
              '&#x2699;&#xFE0F; Settings stored in SQLite via Prisma: ' +
              el('code','','autoEmailEnabled: true') + ' &nbsp;|&nbsp; ' +
              el('code','','emailDelayDays: 7')
            )
          )
        ) +

        // Step 2 — Order fulfilled
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-shopify"','&#x1F6D2;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 2 — Customer places order & it gets fulfilled') +
            el('span','class="flow-tag tag-webhook"','Shopify Webhook: ORDERS_FULFILLED') +
            el('span','class="flow-tag tag-file"','app/shopify.server.js') +
            el('p','class="flow-step-desc"',
              'When a merchant marks an order as fulfilled in Shopify Admin (or it auto-fulfills), ' +
              'Shopify sends a signed HMAC webhook POST to ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','/webhooks/orders-fulfilled') +
              '. The webhook is registered automatically in ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','afterAuth') +
              ' when the app is installed.'
            ) +
            el('div','class="flow-code"',
              el('span','class="cm"','// shopify.server.js — registered on install') + '\n' +
              el('span','class="kw"','ORDER_FULFILLED') + ': {\n' +
              '  deliveryMethod: ' + el('span','class="str"','"Http"') + ',\n' +
              '  callbackUrl: ' + el('span','class="str"','"/webhooks/orders-fulfilled"') + '\n' +
              '}'
            )
          )
        ) +

        // Step 3 — Webhook handler
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-node"','&#x26A1;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 3 — Webhook handler validates & saves to DB') +
            el('span','class="flow-tag tag-file"','app/routes/webhooks.orders-fulfilled.jsx') +
            el('span','class="flow-tag tag-db"','ReviewRequest DB') +
            el('p','class="flow-step-desc"',
              'The Remix action verifies the Shopify HMAC signature, checks that ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','autoEmailEnabled === true') +
              ', extracts the customer email + product handles from the order payload, ' +
              'and creates a ReviewRequest record with status = "pending".'
            ) +
            el('div','class="flow-code"',
              el('span','class="cm"','// Guard check') + '\n' +
              el('span','class="kw"','if') + ' (!merchant?.' + el('span','class="fn"','autoEmailEnabled') + ') {\n' +
              '  ' + el('span','class="kw"','return') + ' ' + el('span','class="str"','"Auto emails disabled"') + ';\n' +
              '}\n\n' +
              el('span','class="cm"','// Save to ReviewRequest table') + '\n' +
              el('span','class="kw"','await') + ' prisma.reviewRequest.' + el('span','class="fn"','create') + '({\n' +
              '  data: { shopDomain, orderId, customerEmail,\n' +
              '          productHandles, status: ' + el('span','class="str"','"pending"') + ' }\n' +
              '});'
            ) +
            el('div','class="status-row"',
              el('span','class="status-pill sp-pending"','● pending — just created')
            )
          )
        ) +

        // Step 4 — CI4 API call
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-api"','&#x1F310;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 4 — Node app calls rizzz.online CI4 API to queue the email') +
            el('span','class="flow-tag tag-api"','POST /shopify/review-request') +
            el('span','class="flow-tag tag-file"','webhooks.orders-fulfilled.jsx') +
            el('p','class="flow-step-desc"',
              'The Node app POSTs to the Rizzz CI4 backend with the customer details, product handles, and ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','delay_days: 7') +
              '. The CI4 backend schedules the email to be sent after the configured delay. ' +
              'On success, the ReviewRequest status is updated to "sent".'
            ) +
            el('div','class="flow-code"',
              el('span','class="fn"','fetch') + '(' + el('span','class="str"','`${RIZZZ_API_URL}/shopify/review-request`') + ', {\n' +
              '  method: ' + el('span','class="str"','"POST"') + ',\n' +
              '  body: JSON.' + el('span','class="fn"','stringify') + '({\n' +
              '    shop_domain, order_id, customer_email,\n' +
              '    customer_name, product_handles,\n' +
              '    delay_days: ' + el('span','class="num"','7') + '   ' + el('span','class="cm"','// from MerchantStore.emailDelayDays') + '\n' +
              '  })\n' +
              '});'
            ) +
            el('div','class="status-row"',
              el('span','class="status-pill sp-sent"','● sent — CI4 accepted the request')
            )
          )
        ) +

        // Step 5 — CI4 waits & sends email
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-email"','&#x23F0;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 5 — CI4 backend waits N days, then sends the email') +
            el('span','class="flow-tag tag-api"','rizzz.online CI4 backend') +
            el('p','class="flow-step-desc"',
              'The CI4 backend (on rizzz.online) holds the request in its queue. After ' +
              el('strong','','emailDelayDays') +
              ' days (default 7), it sends a branded review request email to the customer. ' +
              'The email contains the product name, order number, a star-tap shortcut, and a CTA link to the Rizzz review form.'
            ) +
            emailPreview
          )
        ) +

        // Step 6 — Customer clicks & reviews
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-customer"','&#x1F464;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 6 — Customer clicks the email & submits a review') +
            el('span','class="flow-tag tag-api"','rizzz.online/product/{handle}') +
            el('p','class="flow-step-desc"',
              'The customer clicks "Write a Full Review on Rizzz" → lands on the Rizzz review form (pre-filled with product + order context) → submits their rating, title, and review body. The review is stored in the Rizzz CI4 database.'
            )
          )
        ) +

        // Step 7 — Widget shows review
        el('div','class="flow-step"',
          el('div','class="flow-icon flow-icon-rizzz"','&#x2B50;') +
          el('div','class="flow-body"',
            el('div','class="flow-step-title"','Step 7 — Review appears in the widget on the product page') +
            el('span','class="flow-tag tag-api"','GET /reviews/{handle}') +
            el('span','class="flow-tag tag-file"','public/widget/rizzz-widget.js') +
            el('p','class="flow-step-desc"',
              'The next time any customer visits the product page, ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','rizzz-widget.js') +
              ' fetches reviews from ' +
              el('code','style="background:#f0eeff;padding:1px 5px;border-radius:3px;font-size:12px"','GET /api/reviews/{handle}?shop=...') +
              ' and renders the new review with a ✓ Verified badge. The merchant dashboard stats (total reviews, average rating) also update.'
            ) +
            el('div','class="status-row"',
              el('span','class="status-pill sp-reviewed"','● reviewed — final state in ReviewRequest table')
            )
          )
        )

      ) // end flow-steps
    ) // end flow-page
  ); // end page

// ── Patch gen_preview.js ───────────────────────────────────────
var src = fs.readFileSync('gen_preview.js', 'utf8');

// 1. Add CSS
src = src.replace(
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}'",
  "'.code{background:#f4f5f5;border-radius:6px;padding:12px;font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;line-height:1.7;border:1px solid #e1e3e5}',\n  '" + emailCss + "'"
);

// 2. Add nav item after Brand Store
src = src.replace(
  "el('div','class=\"nav\" id=\"nav-brand\" onclick=\"showPage(event,\\'brand\\')\"','&#x1F3EA;&nbsp; Brand Store')",
  "el('div','class=\"nav\" id=\"nav-brand\" onclick=\"showPage(event,\\'brand\\')\"','&#x1F3EA;&nbsp; Brand Store') +\n    el('div','class=\"nav\" id=\"nav-emailflow\" onclick=\"showPage(event,\\'emailflow\\')\"','&#x1F4E7;&nbsp; Auto Email Flow')"
);

// 3. Add page to main
src = src.replace(
  'dashboard + settings + widgetPage + reviewFormPage + brandPage',
  'dashboard + settings + widgetPage + reviewFormPage + brandPage + emailFlowPage'
);

// 4. Inject emailFlowPage variable before brandPage
src = src.replace(
  'var brandPage =',
  'var emailFlowPage = ' + JSON.stringify(emailFlowPage) + ';\nvar brandPage ='
);

fs.writeFileSync('gen_preview.js', src);
console.log('Email flow page patched');