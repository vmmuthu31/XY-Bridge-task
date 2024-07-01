import React, { useState, useEffect } from "react";
import ChainSelector from "./ChainSelector";
import TokenSelector from "./TokenSelector";
import SettingsModal from "./SettingsModal";
import {
  Chain,
  Token,
  getQuote,
  getTokenPrice,
} from "../../services/apiService";
import { FaExchangeAlt, FaSync, FaCog, FaArrowRight } from "react-icons/fa";
import { chains } from "./utils/chains";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuoteDetails from "./QuoteDetails";

const BridgeUI: React.FC = () => {
  const [srcChainId, setSrcChainId] = useState<number>(1); // Default to Ethereum
  const [dstChainId, setDstChainId] = useState<number>(42161); // Default to Arbitrum
  const [srcToken, setSrcToken] = useState<Token | null>(null);
  const [dstToken, setDstToken] = useState<Token | null>(null);
  const [srcAmount, setSrcAmount] = useState("");
  const [dstAmount, setDstAmount] = useState("");
  const [srcTokenUsdValue, setSrcTokenUsdValue] = useState(0);
  const [dstTokenUsdValue, setDstTokenUsdValue] = useState(0);
  const [quote, setQuote] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    slippage: 0.5,
    gasPrice: "average",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (srcToken && dstToken && srcAmount) {
        fetchQuote();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [srcToken, dstToken, srcAmount]);

  const sortQuotesByGasFee = (quotes) => {
    return quotes.sort(
      (a, b) => parseFloat(a.gasFee.amountUSD) - parseFloat(b.gasFee.amountUSD)
    );
  };

  const fetchQuote = async () => {
    try {
      if (!srcToken || !dstToken) return;

      setIsLoading(true);

      const srcDecimals = srcToken.decimals ?? 18;
      const dstDecimals = dstToken.decimals ?? 18;

      // Convert the input amount to smallest units
      const srcAmountInSmallestUnit = (
        parseFloat(srcAmount) * Math.pow(10, srcDecimals)
      ).toString();

      const params = {
        srcChainId,
        srcQuoteTokenAddress: srcToken.address,
        srcQuoteTokenAmount: srcAmountInSmallestUnit,
        dstChainId,
        dstQuoteTokenAddress: dstToken.address,
        slippage: settings.slippage,
        srcDecimals,
        dstDecimals,
      };

      const quoteData = await getQuote(params);
      setQuote(quoteData);

      if (quoteData && quoteData[0] && quoteData[0].destAmount) {
        // Convert the received amount back to human-readable units
        const dstAmountInSmallestUnit = parseFloat(quoteData[0].destAmount);
        const dstAmountInReadableUnit = (
          dstAmountInSmallestUnit / Math.pow(10, dstDecimals)
        ).toFixed(dstDecimals);

        setDstAmount(dstAmountInReadableUnit);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote");
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (srcToken && dstToken && srcAmount) {
      fetchQuote();
    }
  };

  const handleSrcChainChange = (chain: Chain) => {
    setSrcChainId(chain.chainId);
    setSrcToken(null); // Reset the selected token when the chain changes
  };

  const handleDstChainChange = (chain: Chain) => {
    setDstChainId(chain.chainId);
    setDstToken(null); // Reset the selected token when the chain changes
  };

  const handleSrcTokenChange = (token: Token) => {
    setSrcToken(token);
  };

  const handleDstTokenChange = (token: Token) => {
    setDstToken(token);
  };

  const handleSettingsSave = (newSettings: {
    slippage: number;
    gasPrice: string;
  }) => {
    setSettings(newSettings);
  };

  const handleExchange = async () => {
    // Swap chains
    const tempChainId = srcChainId;
    setSrcChainId(dstChainId);
    setDstChainId(tempChainId);

    // Swap tokens
    const tempToken = srcToken;
    setSrcToken(dstToken);
    setDstToken(tempToken);

    // Swap amounts
    const tempAmount = srcAmount;
    setSrcAmount(dstAmount);
    setDstAmount(tempAmount);

    // Ensure proper token logos and details are swapped
    handleSrcTokenChange(dstToken);
    handleDstTokenChange(tempToken);

    // Update conversion rate
    await fetchQuote();
  };

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setSrcAmount(amount);
    if (srcToken) {
      try {
        const priceDataSrc = await getTokenPrice(srcToken.address, srcChainId);
        const priceDataDst = dstToken
          ? await getTokenPrice(dstToken.address, dstChainId)
          : null;

        const srcTokenPrice = priceDataSrc
          ? parseFloat(Object.values(priceDataSrc)[0])
          : NaN;
        const dstTokenPrice = priceDataDst
          ? parseFloat(Object.values(priceDataDst)[0])
          : NaN;

        if (priceDataSrc && priceDataDst && dstToken) {
          setDstAmount(
            ((parseFloat(amount) * srcTokenPrice) / dstTokenPrice).toFixed(6)
          );
          setSrcTokenUsdValue(srcTokenPrice * parseFloat(amount));
          setDstTokenUsdValue(dstTokenPrice * parseFloat(dstAmount));
        } else if (priceDataSrc) {
          setSrcTokenUsdValue(srcTokenPrice * parseFloat(amount));
        }

        // Automatically fetch quote whenever the amount changes
        fetchQuote();
      } catch (error) {
        console.error("Error fetching token price:", error);
        toast.error("Error fetching token price");
      }
    }
  };

  return (
    <main className="flex md:flex-row flex-col justify-center gap-10">
      <div className="container max-w-xl bg-[#374c6e] text-white mt-7 rounded-2xl p-7">
        <div className="flex justify-end space-x-4">
          <FaSync
            className={`cursor-pointer ${isLoading ? "animate-spin" : ""}`}
            onClick={handleRefresh}
          />
          <FaCog
            className="cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
          />
        </div>

        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-2">You Pay</h2>
          <div className="flex items-center space-x-4">
            <ChainSelector
              chains={chains}
              selectedChain={chains.find(
                (chain) => chain.chainId === srcChainId
              )}
              onChange={handleSrcChainChange}
            />
            <TokenSelector
              chainId={srcChainId}
              onTokenChange={handleSrcTokenChange}
            />
          </div>
          <input
            type="text"
            value={srcAmount}
            onChange={handleAmountChange}
            className="w-full mt-3 p-2 border text-black border-gray-300 rounded-lg"
            placeholder="Enter amount"
          />
          <p className="mt-2 text-gray-500">
            ~${srcTokenUsdValue ? srcTokenUsdValue.toFixed(2) : "0.00"}
          </p>
        </div>

        <div className="flex justify-center ">
          <FaExchangeAlt
            className="text-4xl rotate-90 border p-2 rounded-full text-white cursor-pointer"
            onClick={handleExchange}
          />
        </div>

        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-2">You Receive</h2>
          <div className="flex items-center space-x-4">
            <ChainSelector
              chains={chains}
              selectedChain={chains.find(
                (chain) => chain.chainId === dstChainId
              )}
              onChange={handleDstChainChange}
            />
            <TokenSelector
              chainId={dstChainId}
              onTokenChange={handleDstTokenChange}
            />
          </div>
          <input
            type="text"
            value={dstAmount}
            readOnly
            className="w-full mt-3 p-2 border text-black border-gray-300 rounded-lg bg-gray-100"
            placeholder="Receive amount"
          />
          <p className="mt-2 text-gray-500">
            ~${dstTokenUsdValue ? dstTokenUsdValue.toFixed(2) : "0.00"}
          </p>
        </div>

        <button
          disabled={isLoading}
          className="mt-3 w-full bg-blue-500 p-2 rounded-lg"
        >
          {isLoading ? (
            <p className="text-center text-white">Loading...</p>
          ) : (
            "Bridge"
          )}
        </button>
      </div>

      <div>
        {quote && (
          <div className="mt-6">
            <h2 className="text-xl mt-5 font-semibold mb-4">Quote Details</h2>
            <p>Best route is selected based on net output after gas fees</p>
            <div className="p-4 bg-[#374c6e] text-gray-600 rounded-lg">
              {Object.keys(quote).map((key) => {
                const sortedQuotes = sortQuotesByGasFee(
                  Object.values(quote[key].quoteRates)
                );

                return (
                  <div key={key}>
                    <div className="flex items-center space-x-4 mb-4 relative">
                      <img
                        src={srcToken?.logoURI}
                        alt="srcToken"
                        className="w-6 h-6"
                      />
                      <img
                        src={
                          chains.find((chain) => chain.chainId === srcChainId)
                            ?.logoURI
                        }
                        alt="srcChain"
                        className="w-4 h-4 rounded-full absolute -top-2 -left-1"
                      />
                      <FaArrowRight className="text-xl text-white" />
                      <img
                        src={dstToken?.logoURI}
                        alt="destToken"
                        className="w-6 h-6"
                      />
                      <img
                        src={
                          chains.find((chain) => chain.chainId === dstChainId)
                            ?.logoURI
                        }
                        alt="dstChain"
                        className="w-4 h-4 absolute left-[76px] -top-2"
                      />
                    </div>
                    <div className="h-[400px] overflow-scroll">
                      {sortedQuotes.map((provider, providerKey) => (
                        <QuoteDetails
                          key={`${key}-${providerKey}`}
                          quoteKey={key}
                          providerKey={providerKey}
                          provider={provider}
                          isBest={providerKey === 0}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onRequestClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
      />

      <ToastContainer />
    </main>
  );
};

export default BridgeUI;
