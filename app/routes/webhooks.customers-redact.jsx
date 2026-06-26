import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

export async function action({ request }) {
  const { shop, payload } = await authenticate.webhook(request);
  const email = payload?.customer?.email;
  if (email) {
    await prisma.reviewRequest.deleteMany({ where: { shopDomain: shop, customerEmail: email } });
  }
  return new Response("OK", { status: 200 });
}
