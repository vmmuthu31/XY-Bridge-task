import express from "express";
import tokenController from "../controllers/tokenController.js";

const router = express.Router();

router.get("/chains", tokenController.getSupportedChains);
router.get("/recommendedtokens", tokenController.getRecommendedTokens);
router.get("/bridgeProviders", tokenController.getSupportedBridgeProviders);

export default router;
