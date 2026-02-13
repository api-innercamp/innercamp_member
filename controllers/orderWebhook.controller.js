const crypto = require("crypto");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.orderCreateWebhook = async (req, res) => {
  try {
    /* ---------------- HMAC VERIFY ---------------- */
    const hmac = req.get("X-Shopify-Hmac-Sha256");
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body);

    const digest = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("base64");

    if (digest !== hmac) {
      return res.status(401).send("Unauthorized");
    }

    /* ---------------- ORDER DATA ---------------- */
    const order = JSON.parse(rawBody.toString());

    const variantIds = order.line_items
      .filter(item => item.variant_id)
      .map(item => `gid://shopify/ProductVariant/${item.variant_id}`);

    if (!variantIds.length) {
      return res.status(200).send("No variants found");
    }

    /* ---------------- GraphQL QUERY ---------------- */
    const graphqlQuery = {
      query: `
        query getVariantPlanUrls($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on ProductVariant {
              id
              title
              metafield(namespace: "custom", key: "variant_plan_url") {
                key
                value
                jsonValue
              }
            }
          }
        }
      `,
      variables: {
        ids: variantIds,
      },
    };

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    );

    const result = await response.json();

    if (result.errors) {
      return res.status(500).send("GraphQL failed");
    }

    /* ---------------- MAP RESPONSE ---------------- */
    const variantMap = new Map();

    result.data.nodes.forEach(variant => {
      if (!variant) return;

      variantMap.set(variant.id, {
        title: variant.title,
        plan_url:
          variant.metafield?.jsonValue ??
          variant.metafield?.value ??
          null,
      });
    });

    const variantsWithPlanUrl = order.line_items.map(item => {
      const gid = `gid://shopify/ProductVariant/${item.variant_id}`;
      return {
        product_title: item.title,
        variant_id: item.variant_id,
        variant_plan_url: variantMap.get(gid)?.plan_url || null,
      };
    });

    res.status(200).send("Order processed");
  } catch (error) {
    res.status(500).send("Failed");
  }
};
