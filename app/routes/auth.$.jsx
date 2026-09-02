import { authenticate } from "../shopify.server.js";

export async function loader({ request }) {
  await authenticate.admin(request);
  return null;
}

export default function Auth() {
  return null;
}