import express from "express";
import tokenRoutes from "./routes/tokenRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use("/api", tokenRoutes);
app.use("/api", quoteRoutes);

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

export default app;
