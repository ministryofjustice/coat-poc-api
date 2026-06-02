const express = require("express");

const app = express();
const PORT = 3000;

// Simple middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Hello world endpoint
app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});