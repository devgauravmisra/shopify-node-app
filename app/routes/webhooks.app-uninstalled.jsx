import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

export async function action({ request }) {
  const { shop } = await authenticate.webhook(request);
  // Notify CI4 backend
  try {
    await fetch(`${process.env.RIZZZ_API_URL}/shopify/merchant-uninstall`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Rizzz-Api-Key": process.env.RIZZZ_INTERNAL_API_KEY },
      body: JSON.stringify({ shop_domain: shop }),
    });
  } catch(e) {}
  // Blank the access token (keep data 30 days for GDPR)
  await prisma.merchantStore.updateMany({ where: { shop }, data: { accessToken: "" } });
  return new Response("OK", { status: 200 });
}
