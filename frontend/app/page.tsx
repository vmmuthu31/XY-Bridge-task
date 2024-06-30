"use client";
import React, { useState } from "react";
import ChainSelector from "./components/ChainSelector";
import QuoteForm from "./components/QuoteForm";
import { getParams, ParamsData } from "../services/apiService";
import Navbar from "./components/Navbar";

const Home: React.FC = () => {
  const [quote, setQuote] = useState<any>(null);
  const [srcChainId, setSrcChainId] = useState<number | null>(null);
  const [dstChainId, setDstChainId] = useState<number | null>(null);
  const [params, setParams] = useState<any>(null);
  const handleChainChange = (
    chainId: number,
    type: "source" | "destination"
  ) => {
    if (type === "source") {
      setSrcChainId(chainId);
    } else {
      setDstChainId(chainId);
    }
  };

  const handleQuote = async (quoteData: any) => {
    setQuote(quoteData);
  };

  const handleParams = async () => {
    if (quote) {
      const paramsData: ParamsData = {
        srcChainId: quote.routes[0].srcChainId,
        srcQuoteTokenAddress: quote.routes[0].srcQuoteTokenAddress,
        srcQuoteTokenAmount: quote.routes[0].srcQuoteTokenAmount,
        dstChainId: quote.routes[0].dstChainId,
        dstQuoteTokenAddress: quote.routes[0].dstQuoteTokenAddress,
        slippage: quote.routes[0].slippage,
        receiver: "0x2687B4FDFa0C4290eD754Bfea807DC6a50CE286E",
        commissionRate: 0,
        bridgeProvider: quote.routes[0].bridgeDescription.provider,
        srcBridgeTokenAddress:
          quote.routes[0].bridgeDescription.srcBridgeTokenAddress,
        dstBridgeTokenAddress:
          quote.routes[0].bridgeDescription.dstBridgeTokenAddress,
        srcSwapProvider: quote.routes[0].srcSwapDescription?.provider || "",
        dstSwapProvider: quote.routes[0].dstSwapDescription?.provider || "",
      };
      const params = await getParams(paramsData);
      console.log("Transaction Parameters:", params);
      setParams(params);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />

      <ChainSelector onChainChange={handleChainChange} />
      {srcChainId && dstChainId && (
        <QuoteForm
          srcChainId={srcChainId}
          dstChainId={dstChainId}
          onQuote={handleQuote}
        />
      )}
      {quote && (
        <div className="mt-6">
          <button
            onClick={handleParams}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Get Transaction Parameters
          </button>
          <h2 className="text-xl font-semibold mb-4">Bridge Call</h2>
          <pre className="p-4 bg-gray-100 rounded-lg">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>
      )}
      {!quote && srcChainId && dstChainId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Quote</h2>
          <pre className="p-4 bg-gray-100 rounded-lg">
            No quote available for the selected tokens.
          </pre>
        </div>
      )}
    </div>
  );
};

export default Home;
