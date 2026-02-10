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
      console.log("Mighty skipped / exists:", result.data);
      return res.status(200).send("Already exists");
    }

    console.log("Mighty member created:", result.data);
    res.status(200).send("Customer synced");
  } catch (error) {
    console.error("Customer webhook error:", error);
    res.status(500).send("Failed");
  }
};
