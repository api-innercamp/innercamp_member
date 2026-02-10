const crypto = require("crypto");

module.exports.verifyShopifyWebhook = (req) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("base64");

  return digest === hmac;
};
