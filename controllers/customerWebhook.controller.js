const { verifyShopifyWebhook } = require("../utils/verifyShopifyWebhook");
const { addMemberToMighty } = require("../services/mighty.service");

exports.customerCreateWebhook = async (req, res) => {
  try {
    if (!verifyShopifyWebhook(req)) {
      return res.status(401).send("Unauthorized");
    }

    const customer = JSON.parse(req.body.toString());

    if (!customer.email) {
      return res.status(200).send("No email, skipped");
    }

    const result = await addMemberToMighty({
      email: customer.email,
      firstName: customer.first_name || customer.email,
      lastName: customer.last_name || customer.email,
    });

    if (!result.ok) {
      return res.status(200).send("Already exists");
    }

    res.status(200).send("Customer synced");
  } catch (error) {
    res.status(500).send("Failed");
  }
};
