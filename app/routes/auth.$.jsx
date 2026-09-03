import { authenticate } from "../shopify.server.js";

export function loader({ request }) {
  return authenticate.admin(request);
}

export function action({ request }) {
  return authenticate.admin(request);
}