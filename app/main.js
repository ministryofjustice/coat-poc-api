const express = require("express");
const cloudCostRoutes = require('./routes/cloudCost');

const app = express();
const PORT = 3000;

// Simple middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/api/v1/cloud-costs", cloudCostRoutes);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});