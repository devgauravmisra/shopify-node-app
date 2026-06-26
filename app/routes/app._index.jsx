// app/routes/app._index.jsx
// Merchant dashboard — shown inside Shopify admin after install
// Uses Polaris (Shopify design system) + GraphQL Admin API

import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page, Layout, Card, BlockStack, InlineStack,
  Text, Button, Banner, Badge, DataTable,
  Divider, Thumbnail, Link, EmptyState,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

// ── GraphQL — fetch shop info + recent products ───────────────
const DASHBOARD_QUERY = `#graphql
  query RizzzDashboard {
    shop {
      name
      email
      myshopifyDomain
      plan { displayName }
      primaryDomain { url }
    }
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          status
          featuredImage { url altText }
        }
      }
    }
  }
`;

// ── Loader: server-side, runs on every page load ──────────────
export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  // 1. Shopify shop data via GraphQL
  const gqlResponse = await admin.graphql(DASHBOARD_QUERY);
  const { data }    = await gqlResponse.json();

  // 2. Review stats from rizzz.online CI4 API
  let rizzzStats = { totalReviews: 0, averageRating: 0, pendingRequests: 0 };
  try {
    const statsRes = await fetch(
      `${process.env.RIZZZ_API_URL}/shopify/stats?shop=${session.shop}`,
      { headers: { "X-Rizzz-Api-Key": process.env.RIZZZ_INTERNAL_API_KEY } }
    );
    if (statsRes.ok) rizzzStats = await statsRes.json();
  } catch (e) {
    console.error("[Rizzz] Stats fetch error:", e.message);
  }

  // 3. Merchant settings from local DB
  const merchant = await prisma.merchantStore.findUnique({
    where: { shop: session.shop },
  });

  // 4. Last 5 review requests
  const recentRequests = await prisma.reviewRequest.findMany({
    where:   { shopDomain: session.shop },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const rizzzBaseUrl = (process.env.RIZZZ_API_URL || "https://rizzz.online/api").replace("/api", "");

  return json({ shop: data?.shop, products: data?.products?.edges?.map(e => e.node) || [],
                rizzzStats, merchant, recentRequests, rizzzBaseUrl });
}

// ── Action: handle button clicks ──────────────────────────────
export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent   = formData.get("intent");

  if (intent === "install-widget") {
    // Inject the Rizzz widget script tag into the store via GraphQL mutation
    const mutation = `#graphql
      mutation ScriptTagCreate($input: ScriptTagInput!) {
        scriptTagCreate(input: $input) {
          scriptTag { id src }
          userErrors { field message }
        }
      }
    `;
    const widgetSrc = `${process.env.SHOPIFY_APP_URL}/widget/rizzz-widget.js`;
    const res = await admin.graphql(mutation, {
      variables: { input: { src: widgetSrc, displayScope: "ONLINE_STORE" } },
    });
    const result = await res.json();
    const errors = result?.data?.scriptTagCreate?.userErrors;
    if (errors?.length) return json({ error: errors[0].message });
    return json({ success: "Widget installed! Visit any product page to see it." });
  }

  if (intent === "toggle-email") {
    const merchant = await prisma.merchantStore.findUnique({ where: { shop: session.shop } });
    await prisma.merchantStore.update({
      where: { shop: session.shop },
      data:  { autoEmailEnabled: !merchant?.autoEmailEnabled },
    });
    return json({ success: "Email setting updated." });
  }

  return json({ error: "Unknown action" });
}

// ── Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const { shop, products, rizzzStats, merchant, recentRequests, rizzzBaseUrl } = useLoaderData();
  const submit = useSubmit();
  const nav    = useNavigation();
  const busy   = nav.state !== "idle";

  const requestRows = recentRequests.map(r => [
    r.orderNumber,
    r.customerEmail,
    <Badge tone={r.status === "reviewed" ? "success" : r.status === "sent" ? "info" : "attention"}>
      {r.status}
    </Badge>,
    new Date(r.createdAt).toLocaleDateString("en-IN"),
  ]);

  return (
    <Page>
      <TitleBar title="Rizzz Reviews" />
      <BlockStack gap="500">

        {/* Store header */}
        <Card>
          <InlineStack align="space-between">
            <BlockStack gap="100">
              <Text variant="headingMd" as="h2">{shop?.name}</Text>
              <Text variant="bodySm" tone="subdued">
                {shop?.myshopifyDomain} ·{" "}
                <Link url={`${rizzzBaseUrl}/brand/${shop?.myshopifyDomain?.replace(".myshopify.com","")}`} target="_blank">
                  View brand page on Rizzz ↗
                </Link>
              </Text>
            </BlockStack>
            <Badge tone="success">{shop?.plan?.displayName || "Active"}</Badge>
          </InlineStack>
        </Card>

        {/* Stats */}
        <Layout>
          {[
            { label: "Total reviews",    value: rizzzStats.totalReviews },
            { label: "Average rating",   value: rizzzStats.averageRating ? `${Number(rizzzStats.averageRating).toFixed(1)} ★` : "—" },
            { label: "Pending requests", value: rizzzStats.pendingRequests },
            { label: "Plan",             value: merchant?.plan || "Free" },
          ].map(s => (
            <Layout.Section variant="oneQuarter" key={s.label}>
              <Card>
                <BlockStack gap="100">
                  <Text variant="bodySm" tone="subdued">{s.label}</Text>
                  <Text variant="headingLg" as="p">{String(s.value)}</Text>
                </BlockStack>
              </Card>
            </Layout.Section>
          ))}
        </Layout>

        {/* Widget + Email cards */}
        <Layout>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">Review widget</Text>
                <Text variant="bodySm" tone="subdued">
                  Install the Rizzz community review widget on your product pages. Customers
                  see authentic reviews from the Rizzz community alongside your store reviews.
                </Text>
                <InlineStack gap="300">
                  <Button variant="primary" loading={busy}
                    onClick={() => submit({ intent: "install-widget" }, { method: "post" })}>
                    Install widget on store
                  </Button>
                  <Button url={`${rizzzBaseUrl}/widget-preview`} target="_blank" variant="plain">
                    Preview
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">Auto review emails</Text>
                <Text variant="bodySm" tone="subdued">
                  Automatically email customers {merchant?.emailDelayDays || 7} days after
                  fulfillment to request a review.{" "}
                  <Badge tone={merchant?.autoEmailEnabled ? "success" : "attention"}>
                    {merchant?.autoEmailEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </Text>
                <Button loading={busy}
                  onClick={() => submit({ intent: "toggle-email" }, { method: "post" })}>
                  {merchant?.autoEmailEnabled ? "Disable" : "Enable"} auto emails
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Products */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h3">Your products on Rizzz</Text>
            {products.length === 0
              ? <EmptyState heading="No products found" image=""><p>Add products to your store.</p></EmptyState>
              : products.map(p => (
                <div key={p.id}>
                  <InlineStack gap="400" align="start" blockAlign="center">
                    <Thumbnail source={p.featuredImage?.url || ""} alt={p.title} size="small" />
                    <BlockStack gap="100">
                      <Text variant="bodyMd" fontWeight="semibold">{p.title}</Text>
                      <InlineStack gap="200">
                        <Badge tone={p.status === "ACTIVE" ? "success" : "attention"}>{p.status}</Badge>
                        <Link url={`${rizzzBaseUrl}/product/${p.handle}`} target="_blank">View on Rizzz ↗</Link>
                      </InlineStack>
                    </BlockStack>
                  </InlineStack>
                  <Divider />
                </div>
              ))
            }
          </BlockStack>
        </Card>

        {/* Review requests table */}
        {recentRequests.length > 0 && (
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">Recent review requests</Text>
              <DataTable
                columnContentTypes={["text","text","text","text"]}
                headings={["Order","Customer","Status","Date"]}
                rows={requestRows}
              />
            </BlockStack>
          </Card>
        )}

      </BlockStack>
    </Page>
  );
}
