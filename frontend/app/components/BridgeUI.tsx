import React, { useState, useEffect, useCallback } from "react";
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
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import debounce from "lodash.debounce";

const BridgeUI: React.FC = () => {
  const [srcChainId, setSrcChainId] = useState<number>(1);
  const [dstChainId, setDstChainId] = useState<number>(42161);
  const [srcToken, setSrcToken] = useState<Token | null>(null);
  const [dstToken, setDstToken] = useState<Token | null>(null);
  const [srcAmount, setSrcAmount] = useState("");
  const [dstAmount, setDstAmount] = useState("");
  const [srcTokenUsdValue, setSrcTokenUsdValue] = useState(0);
  const [dstTokenUsdValue, setDstTokenUsdValue] = useState(0);
  const [quote, setQuote] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState("0");

  const { address } = useAccount();

  useEffect(() => {
    const fetchBalance = async () => {
      if (srcToken && address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        setUserBalance(ethers.utils.formatUnits(balance, srcToken.decimals));
      }
    };

    fetchBalance();
  }, [srcToken, address]);

  const [isBridgeDisabled, setIsBridgeDisabled] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<{
    quoteKey: string;
    providerKey: string;
  } | null>(null);

  const [settings, setSettings] = useState({
    slippage: 0.5,
    gasPrice: "average",
  });

  useEffect(() => {
    if (srcToken && dstToken && srcAmount) {
      debouncedFetchQuote();
    }
  }, [srcToken, dstToken, srcAmount]);

  const debouncedFetchQuote = useCallback(
    debounce(() => {
      fetchQuote();
    }, 500),
    [srcToken, dstToken, srcAmount]
  );

  const sortQuotesByGasFee = (quotes) => {
    return quotes.sort(
      (a, b) => parseFloat(a.gasFee.amountUSD) - parseFloat(b.gasFee.amountUSD)
    );
  };

  const fetchQuote = async () => {
    try {
      if (!srcToken || !dstToken) return;
      const amount = parseFloat(srcAmount);
      if (isNaN(amount) || !isFinite(amount)) {
        toast.error("Invalid amount entered");
        return;
      }

      setIsLoading(true);
      setIsBridgeDisabled(true);

      const srcDecimals = srcToken.decimals ?? 18;
      const dstDecimals = dstToken.decimals ?? 18;

      const srcAmountInSmallestUnit = ethers.utils
        .parseUnits(srcAmount, srcDecimals)
        .toString();
      const add = address?.toString();
      const params = {
        add,
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
        const dstAmountInSmallestUnit = parseFloat(quoteData[0].destAmount);
        const dstAmountInReadableUnit = ethers.utils.formatUnits(
          quoteData[0].destAmount,
          dstDecimals
        );

        setDstAmount(dstAmountInReadableUnit);
        setIsBridgeDisabled(false);

        const firstKey = Object.keys(quoteData)[0];
        const firstProviderKey = Object.keys(quoteData[firstKey].quoteRates)[0];
        setSelectedQuote({ quoteKey: firstKey, providerKey: firstProviderKey });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast.error("Error fetching quote");
      setIsLoading(false);
      setIsBridgeDisabled(true);
    }
  };

  const handleRefresh = () => {
    if (srcToken && dstToken && srcAmount) {
      fetchQuote();
    }
  };

  const handleSrcChainChange = (chain: Chain) => {
    setSrcChainId(chain.chainId);
    setSrcToken(null);
  };

  const handleDstChainChange = (chain: Chain) => {
    setDstChainId(chain.chainId);
    setDstToken(null);
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
    const tempChainId = srcChainId;
    setSrcChainId(dstChainId);
    setDstChainId(tempChainId);

    const tempToken = srcToken;
    setSrcToken(dstToken);
    setDstToken(tempToken);

    const tempAmount = srcAmount;
    setSrcAmount(dstAmount);
    setDstAmount(tempAmount);

    handleSrcTokenChange(dstToken);
    handleDstTokenChange(tempToken);

    await fetchQuote();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setSrcAmount(value);

      if (srcToken) {
        getTokenPricesAndQuote(value);
      }
    }
  };

  const getTokenPricesAndQuote = async (amount) => {
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
        const calculatedDstAmount = (
          (parseFloat(amount) * srcTokenPrice) /
          dstTokenPrice
        ).toFixed(6);

        setDstAmount(calculatedDstAmount);
        setSrcTokenUsdValue(srcTokenPrice * parseFloat(amount));
        setDstTokenUsdValue(dstTokenPrice * parseFloat(calculatedDstAmount));
      } else if (priceDataSrc) {
        setSrcTokenUsdValue(srcTokenPrice * parseFloat(amount));
      }

      fetchQuote();
    } catch (error) {
      console.error("Error fetching token price:", error);
      toast.error("Error fetching token price");
    }
  };

  const handleQuoteSelect = (quoteKey, providerKey) => {
    setSelectedQuote({ quoteKey, providerKey });
  };

  const handleBridge = async (quoteKey, providerKey) => {
    if (!quoteKey || !srcToken || !dstToken || !srcAmount) return;
    const selectedProviderList = quote[quoteKey]?.quoteRates;
    const providerKeys = selectedProviderList
      ? Object.keys(selectedProviderList)
      : [];
    const selectedProvider = selectedProviderList
      ? selectedProviderList[providerKeys[providerKey]]
      : null;

    if (
      !selectedProvider ||
      !selectedProvider.bridgeDetails ||
      !selectedProvider.providerDetails
    ) {
      toast.error("Bridge or provider details are missing");
      return;
    }

    const amountInDecimals = ethers.utils
      .parseUnits(srcAmount, srcToken.decimals)
      .toString();

    const payload = [
      {
        selectedRoute: `${selectedProvider.providerDetails.name.toLowerCase()}.${selectedProvider.bridgeDetails.name.toLowerCase()}`,
        account: address,
        slippage: settings.slippage,
        srcToken: srcToken.address,
        srcDecimals: srcToken.decimals,
        recipient: address,
        destToken: dstToken.address,
        destDecimals: dstToken.decimals,
        fromChain: srcChainId,
        toChain: dstChainId,
        additionalInfo: selectedProvider.additionalInfo,
        amount: amountInDecimals,
      },
    ];

    try {
      const response = await fetch("https://api.dzap.io/v1/bridge/params", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const bridgeParams = await response.json();

      if (!response.ok) {
        throw new Error(bridgeParams.data?.errMsg || response.statusText);
      }
    } catch (error) {
      console.error("Error calling bridge:", error);
      toast.error(`Error calling bridge: ${error.message}`);
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
            disabled={!srcToken || !dstToken}
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
        <div className="mt-2 text-red-500">
          {!srcToken && !dstToken && (
            <p>Please select both source and destination tokens.</p>
          )}
          {parseFloat(srcAmount) > parseFloat(userBalance) && (
            <p>Insufficient balance to make the transaction.</p>
          )}
        </div>

        <button
          disabled={
            isLoading ||
            parseFloat(srcAmount) > parseFloat(userBalance) ||
            !srcAmount ||
            !quote ||
            !selectedQuote
          }
          className={`mt-3 w-full p-2 rounded-lg ${
            isLoading ||
            parseFloat(srcAmount) > parseFloat(userBalance) ||
            !srcAmount ||
            !quote ||
            !selectedQuote
              ? "bg-gray-500"
              : "bg-blue-500"
          }`}
          onClick={() => {
            handleBridge(selectedQuote?.quoteKey, selectedQuote?.providerKey);
          }}
        >
          {isLoading ? (
            <p className="text-center text-white">Loading...</p>
          ) : (
            "Bridge"
          )}
        </button>
      </div>

      <div className="relative mt-6">
        {isLoading && (
          <div className="absolute top-60  w-full h-full flex items-center justify-center text-black">
            <span className="loading-text">Loading...</span>
          </div>
        )}
        <div className={`p-4 bg-[#374c6e] text-gray-600 rounded-lg`}>
          {quote && (
            <div>
              <h2 className="text-xl mt-5 text-white font-semibold ">
                Quote Details
              </h2>
              <p className="text-white mb-4">
                Best route is selected based on net output after gas fees
              </p>
              {Object.keys(quote).map((key) => {
                if (!quote[key] || !quote[key].quoteRates) {
                  return null;
                }
                const sortedQuotes = sortQuotesByGasFee(
                  Object.values(quote[key].quoteRates)
                );

                return (
                  <div className={` ${isLoading ? "blurred" : ""}`} key={key}>
                    <div
                      className={`flex items-center space-x-4 mb-4 relative`}
                    >
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
                      <FaArrowRight className="text-xl text-white animate-arrow" />
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
                          isSelected={
                            selectedQuote &&
                            selectedQuote.quoteKey === key &&
                            selectedQuote.providerKey === providerKey
                          }
                          onSelect={handleQuoteSelect}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
