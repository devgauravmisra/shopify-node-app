// ================================================================
// shopify.server.js — Core Shopify app setup
// All routes import { authenticate } from this file
// ================================================================

import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { prisma } from "./db.server.js";

export const shopify = shopifyApp({
  apiKey:        process.env.SHOPIFY_API_KEY,
  apiSecretKey:  process.env.SHOPIFY_API_SECRET,
  apiVersion:    ApiVersion.April26,   // 2026-04 — always pin to a stable release
  scopes:        process.env.SCOPES?.split(","),
  appUrl:        process.env.SHOPIFY_APP_URL,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution:  AppDistribution.AppStore,

  webhooks: {
    // Triggered when a merchant order is fulfilled
    ORDER_FULFILLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl:    "/webhooks/orders-fulfilled",
    },
    // GDPR — mandatory for App Store listing
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl:    "/webhooks/app-uninstalled",
    },
    SHOP_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl:    "/webhooks/shop-redact",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl:    "/webhooks/customers-redact",
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl:    "/webhooks/customers-data-request",
    },
  },

  hooks: {
    // Runs immediately after a merchant installs the app
    afterAuth: async ({ session }) => {
      // 1. Register all webhooks for this store
      shopify.registerWebhooks({ session });

      // 2. Upsert merchant in local Prisma DB
      await prisma.merchantStore.upsert({
        where:  { shop: session.shop },
        create: { shop: session.shop, accessToken: session.accessToken },
        update: { accessToken: session.accessToken },
      });

      // 3. Notify rizzz.online CI4 backend (fire-and-forget)
      notifyRizzz(session.shop).catch(console.error);
    },
  },

  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
});

// Notify CI4 when a new merchant installs
async function notifyRizzz(shop) {
  const url    = `${process.env.RIZZZ_API_URL}/shopify/merchant-register`;
  const apiKey = process.env.RIZZZ_INTERNAL_API_KEY;

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: {
        "Content-Type":    "application/json",
        "X-Rizzz-Api-Key": apiKey,
      },
      body: JSON.stringify({ shop_domain: shop }),
    });
    if (!res.ok) console.error("[Rizzz] merchant-register failed:", res.status);
    else console.log("[Rizzz] Merchant registered:", shop);
  } catch (err) {
    console.error("[Rizzz] merchant-register error:", err.message);
  }
}

export const authenticate    = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login           = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage  = shopify.sessionStorage;
