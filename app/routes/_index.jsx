import { redirect } from "@remix-run/node";

export function loader({ request }) {
  const url = new URL(request.url);
  url.pathname = "/app";
  return redirect(url.toString());
}

export default function Index() {
  return null;
}