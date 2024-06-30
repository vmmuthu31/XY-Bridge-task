import tokenService from "../services/tokenService.js";

const getSupportedChains = async (req, res) => {
  try {
    const chains = await tokenService.fetchSupportedChains();
    res.json(chains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendedTokens = async (req, res) => {
  const { chainId } = req.query;
  if (!chainId) {
    return res.status(400).json({ error: "chainId is required" });
  }
  try {
    const tokens = await tokenService.fetchRecommendedTokens(chainId);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupportedBridgeProviders = async (req, res) => {
  try {
    const providers = await tokenService.fetchSupportedBridgeProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getSupportedChains,
  getRecommendedTokens,
  getSupportedBridgeProviders,
};
