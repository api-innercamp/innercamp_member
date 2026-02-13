const express = require("express");
require("dotenv").config();

const customerRoutes = require("./routes/webhooks");

const app = express();

app.use("/api", customerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
