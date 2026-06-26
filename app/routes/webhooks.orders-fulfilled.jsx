// app/routes/webhooks.orders-fulfilled.jsx
// Triggered when a Shopify order is marked as fulfilled
// Shopify HMAC signature verified automatically by authenticate.webhook()

import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

export async function action({ request }) {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic !== "ORDERS_FULFILLED") {
    return new Response("Not handled", { status: 400 });
  }

  const order        = payload;
  const customerEmail = order?.email || order?.customer?.email;

  if (!customerEmail) {
    return new Response("No email", { status: 200 });
  }

  // Check merchant settings
  const merchant = await prisma.merchantStore.findUnique({ where: { shop } });
  if (!merchant?.autoEmailEnabled) {
    return new Response("Auto emails disabled", { status: 200 });
  }

  // Extract product handles from line items
  const productHandles = (order?.line_items || [])
    .filter(item => item?.product_id)
    .map(item => `product-${item.product_id}`)
    .join(",");

  // Save review request to local DB
  const reviewRequest = await prisma.reviewRequest.create({
    data: {
      shopDomain:     shop,
      orderId:        String(order.id),
      orderNumber:    String(order.order_number || order.name || order.id),
      customerEmail,
      customerName:   [order?.customer?.first_name, order?.customer?.last_name].filter(Boolean).join(" ") || null,
      productHandles,
      status: "pending",
    },
  });

  // Tell CI4 backend to queue the review email
  try {
    const res = await fetch(`${process.env.RIZZZ_API_URL}/shopify/review-request`, {
      method:  "POST",
      headers: {
        "Content-Type":    "application/json",
        "X-Rizzz-Api-Key": process.env.RIZZZ_INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        shop_domain:      shop,
        order_id:         reviewRequest.orderId,
        customer_email:   customerEmail,
        customer_name:    reviewRequest.customerName,
        product_handles:  productHandles.split(","),
        delay_days:       merchant.emailDelayDays || 7,
      }),
    });

    if (res.ok) {
      await prisma.reviewRequest.update({
        where: { id: reviewRequest.id },
        data:  { status: "sent", sentAt: new Date() },
      });
      console.log(`[Rizzz] Review request queued for order ${reviewRequest.orderNumber}`);
    }
  } catch (err) {
    console.error("[Rizzz] Failed to queue review request:", err.message);
  }

  return new Response("OK", { status: 200 });
}
