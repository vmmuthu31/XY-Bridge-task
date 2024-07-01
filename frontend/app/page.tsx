"use client";
import React, { useState } from "react";
import ChainSelector from "./components/ChainSelector";
import QuoteForm from "./components/QuoteForm";
import { getParams, ParamsData } from "../services/apiService";
import Navbar from "./components/Navbar";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BridgeUI from "./components/BridgeUI";

const Home: React.FC = () => {
  const [quote, setQuote] = useState<any>(null);
  const [srcChainId, setSrcChainId] = useState<number | null>(null);
  const [dstChainId, setDstChainId] = useState<number | null>(null);
  const [params, setParams] = useState<any>(null);
  const { address, isConnected } = useAccount();
  console.log("Address:", address);

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
      const route = quote.routes[0];
      const paramsData: ParamsData = {
        srcChainId: route.srcChainId,
        srcQuoteTokenAddress: route.srcQuoteTokenAddress,
        srcQuoteTokenAmount: route.srcQuoteTokenAmount,
        dstChainId: route.dstChainId,
        dstQuoteTokenAddress: route.dstQuoteTokenAddress,
        slippage: route.slippage,
        receiver: address?.toString(),
        commissionRate: 0,
        bridgeProvider: route.bridgeDescription.provider,
        srcBridgeTokenAddress: route.bridgeDescription.srcBridgeTokenAddress,
        dstBridgeTokenAddress: route.bridgeDescription.dstBridgeTokenAddress,
        srcSwapProvider:
          route.srcQuoteTokenAddress !== route.srcBridgeTokenAddress
            ? route.srcSwapDescription?.provider || ""
            : "",
        dstSwapProvider:
          route.dstQuoteTokenAddress !== route.dstBridgeTokenAddress
            ? route.dstSwapDescription?.provider || ""
            : "",
      };
      const params = await getParams(paramsData);
      console.log("Transaction Parameters:", params);
      setParams(params);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />

      {!isConnected ? (
        <div className="mt-6">
          <h2 className="text-xl text-center font-semibold mb-4">
            Please connect your wallet to proceed.
          </h2>
        </div>
      ) : (
        <>
          <BridgeUI />
        </>
      )}
    </div>
  );
};

export default Home;
