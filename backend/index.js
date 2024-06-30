const express = require("express");
const app = express();
const tokenRoutes = require("./routes/tokenRoutes.js");
const quoteRoutes = require("./routes/quoteRoutes");

app.use(express.json());
app.use("/api/tokens", tokenRoutes);
app.use("/api/quotes", quoteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
