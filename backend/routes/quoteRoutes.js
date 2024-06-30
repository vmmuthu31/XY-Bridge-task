import express from "express";
import quoteController from "../controllers/quoteController.js";

const router = express.Router();

router.get("/quotes", quoteController.getQuote);

export default router;
