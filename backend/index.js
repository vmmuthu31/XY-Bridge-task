import express from "express";
import cors from "cors";
import tokenRoutes from "./routes/tokenRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api", tokenRoutes);
app.use("/api", quoteRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

export default app;
