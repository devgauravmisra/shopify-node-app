// app/routes/app.settings.jsx
// Merchant settings page — email delay, widget embed code

import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Page, Layout, Card, BlockStack, Select, Button, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server.js";
import { prisma } from "../db.server.js";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const merchant = await prisma.merchantStore.findUnique({ where: { shop: session.shop } });
  return json({ merchant, shop: session.shop });
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData    = await request.formData();
  await prisma.merchantStore.update({
    where: { shop: session.shop },
    data:  { emailDelayDays: parseInt(formData.get("delay") || "7", 10) },
  });
  return json({ success: true });
}

export default function Settings() {
  const { merchant, shop } = useLoaderData();
  const submit = useSubmit();
  const nav    = useNavigation();
  const [delay, setDelay] = useState(String(merchant?.emailDelayDays || 7));

  const appUrl   = process.env.SHOPIFY_APP_URL || "https://your-app.railway.app";
  const apiUrl   = process.env.RIZZZ_API_URL   || "https://rizzz.online/api";
  const embedCode = `<!-- Rizzz Reviews Widget -->\n<div id="rizzz-reviews"></div>\n<script src="${appUrl}/widget/rizzz-widget.js"\n  data-shop="${shop}"\n  data-api="${apiUrl}"\n  async></script>`;

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">Review email delay</Text>
                <Select
                  label="Send review request email"
                  value={delay}
                  onChange={setDelay}
                  options={[
                    { label: "3 days after fulfillment",  value: "3"  },
                    { label: "5 days after fulfillment",  value: "5"  },
                    { label: "7 days after fulfillment",  value: "7"  },
                    { label: "14 days after fulfillment", value: "14" },
                  ]}
                />
                <Button variant="primary" loading={nav.state !== "idle"}
                  onClick={() => submit({ delay }, { method: "post" })}>
                  Save
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h3">Manual widget install</Text>
                <Text variant="bodySm" tone="subdued">
                  Paste before the &lt;/body&gt; tag in your product template if auto-install doesn't work.
                </Text>
                <div style={{ background:"#f4f5f5", padding:"10px", borderRadius:"6px" }}>
                  <pre style={{ fontSize:"11px", whiteSpace:"pre-wrap", wordBreak:"break-all", margin:0 }}>
                    {embedCode}
                  </pre>
                </div>
                <Button variant="plain" onClick={() => navigator.clipboard?.writeText(embedCode)}>
                  Copy code
                </Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
