const express = require("express");
const router = express.Router();

const {
  customerCreateWebhook,
} = require("../controllers/customerWebhook.controller");

const {
  orderCreateWebhook,
} = require("../controllers/orderWebhook.controller");

/**
 * CUSTOMER CREATE
 * FINAL URL: /webhooks/create
 */

router.post(
  "/create",
  express.raw({ type: "application/json" }),
  customerCreateWebhook
);


/**
 * ORDER CREATE
 * FINAL URL: /webhooks/orders/create
 */
router.post(
  "/orders/create",
  express.raw({ type: "application/json" }),
  orderCreateWebhook
);

module.exports = router;
