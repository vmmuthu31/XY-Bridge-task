import express from "express";
import tokenRoutes from "./routes/tokenRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

const app = express();
app.use(express.json());
app.use("/api", tokenRoutes);
app.use("/api", quoteRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
