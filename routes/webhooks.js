const express = require("express");
const router = express.Router();

const {
  customerCreateWebhook,
} = require("../controllers/customerWebhook.controller");

const {
  orderCreateWebhook,
} = require("../controllers/orderWebhook.controller");


router.post(
  "/create",
  express.raw({ type: "application/json" }),
  customerCreateWebhook
);

// router.post(
//   "/orders/create",
//   express.raw({ type: "application/json" }),
//   orderCreateWebhook
// );

module.exports = router;
