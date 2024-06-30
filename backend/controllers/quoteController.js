import quoteService from "../services/quoteService.js";

const getQuote = async (req, res) => {
  const {
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress,
    slippage,
  } = req.query;

  try {
    const quote = await quoteService.fetchQuote({
      srcChainId,
      srcQuoteTokenAddress,
      srcQuoteTokenAmount,
      dstChainId,
      dstQuoteTokenAddress,
      slippage,
    });
    res.json(quote);
  } catch (error) {
    console.error(
      "Error fetching quote:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error fetching quote" });
  }
};

const getParams = async (req, res) => {
  const {
    srcChainId,
    srcQuoteTokenAddress,
    srcQuoteTokenAmount,
    dstChainId,
    dstQuoteTokenAddress,
    slippage,
    receiver,
    affiliate,
    commissionRate,
    bridgeProvider,
    srcBridgeTokenAddress,
    dstBridgeTokenAddress,
    srcSwapProvider,
    dstSwapProvider,
  } = req.body;

  try {
    const params = await quoteService.fetchParams({
      srcChainId,
      srcQuoteTokenAddress,
      srcQuoteTokenAmount,
      dstChainId,
      dstQuoteTokenAddress,
      slippage,
      receiver,
      affiliate,
      commissionRate,
      bridgeProvider,
      srcBridgeTokenAddress,
      dstBridgeTokenAddress,
      srcSwapProvider,
      dstSwapProvider,
    });
    res.json(params);
  } catch (error) {
    console.error(
      "Error fetching params:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error fetching params" });
  }
};

export default {
  getQuote,
  getParams,
};
