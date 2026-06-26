import { authenticate } from "../shopify.server.js";

export async function action({ request }) {
  // Log data request — in production, export customer data and email it
  await authenticate.webhook(request);
  return new Response("OK", { status: 200 });
}
