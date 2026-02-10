const express = require("express");
require("dotenv").config();

const customerRoutes = require("./routes/webhooks");
// const orderRoutes = require("./routes/order.routes");

const app = express();

// 👇 EXACT SAME public URLs as before
app.use("/", customerRoutes);
// app.use("/", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
