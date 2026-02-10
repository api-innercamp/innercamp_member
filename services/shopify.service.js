const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getVariantPlanUrl = async (variantId) => {
  const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/variants/${variantId}/metafields.json`;

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) return null;

  const metafield = data.metafields.find(
    (m) => m.namespace === "custom" && m.key === "variant_plan_url"
  );

  return metafield ? metafield.value : null;
};
