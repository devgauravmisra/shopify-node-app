import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

export async function action({ request }) {
  const { shop } = await authenticate.webhook(request);
  // Hard delete all data for this shop on erasure request
  await prisma.reviewRequest.deleteMany({ where: { shopDomain: shop } });
  await prisma.merchantStore.deleteMany({ where: { shop } });
  return new Response("OK", { status: 200 });
}
