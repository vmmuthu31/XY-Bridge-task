import apiHelper from "../utils/apiHelper.js";

const fetchSupportedChains = async () => {
  try {
    const response = await apiHelper.get("/supportedChains");
    return response.data.supportedChains;
  } catch (error) {
    throw new Error("Error fetching supported chains");
  }
};

const fetchRecommendedTokens = async (chainId) => {
  try {
    const response = await apiHelper.get("/recommendedTokens", {
      params: {
        chainId,
      },
    });
    return response.data.recommendedTokens;
  } catch (error) {
    throw new Error("Error fetching recommended tokens");
  }
};

const fetchSupportedBridgeProviders = async () => {
  try {
    const response = await apiHelper.get("/supportedBridgeProviders");
    return response.data.supportedBridgeProviders;
  } catch (error) {
    throw new Error("Error fetching supported bridge providers");
  }
};

export default {
  fetchSupportedChains,
  fetchRecommendedTokens,
  fetchSupportedBridgeProviders,
};
