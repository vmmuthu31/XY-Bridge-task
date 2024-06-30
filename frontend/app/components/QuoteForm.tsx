import React, { useState, useEffect } from "react";
import {
  getQuote,
  getTokens,
  QuoteParams,
  Token,
} from "../../services/apiService";

interface QuoteFormProps {
  srcChainId: number | null;
  dstChainId: number | null;
  onQuote: (quoteData: any) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  srcChainId,
  dstChainId,
  onQuote,
}) => {
  const [srcTokens, setSrcTokens] = useState<Token[]>([]);
  const [dstTokens, setDstTokens] = useState<Token[]>([]);
  const [selectedSrcToken, setSelectedSrcToken] = useState<string | null>(null);
  const [selectedDstToken, setSelectedDstToken] = useState<string | null>(null);
  const [srcQuoteTokenAmount, setSrcQuoteTokenAmount] = useState<string>("");
  const [dstQuoteTokenUsdValue, setDstQuoteTokenUsdValue] =
    useState<string>("");

  useEffect(() => {
    const fetchTokens = async () => {
      if (srcChainId) {
        const tokens = await getTokens(srcChainId);
        setSrcTokens(tokens);
        setSelectedSrcToken(tokens[0]?.address || null);
      }
      if (dstChainId) {
        const tokens = await getTokens(dstChainId);
        setDstTokens(tokens);
        setSelectedDstToken(tokens[0]?.address || null);
      }
    };
    fetchTokens();
  }, [srcChainId, dstChainId]);

  useEffect(() => {
    const fetchQuote = async () => {
      if (
        srcChainId &&
        dstChainId &&
        selectedSrcToken &&
        selectedDstToken &&
        srcQuoteTokenAmount
      ) {
        const quoteParams: QuoteParams = {
          srcChainId,
          srcQuoteTokenAddress: selectedSrcToken,
          srcQuoteTokenAmount,
          dstChainId,
          dstQuoteTokenAddress: selectedDstToken,
          slippage: 1,
        };
        try {
          const quoteData = await getQuote(quoteParams);
          onQuote(quoteData);
          setDstQuoteTokenUsdValue(
            quoteData.routes[0]?.dstQuoteTokenUsdValue || ""
          );
        } catch (error) {
          onQuote(null);
          setDstQuoteTokenUsdValue("");
          console.error("Error fetching quote", error);
        }
      }
    };
    fetchQuote();
  }, [
    srcChainId,
    dstChainId,
    selectedSrcToken,
    selectedDstToken,
    srcQuoteTokenAmount,
    onQuote,
  ]);

  return (
    <form className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Bridge Tokens</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="srcQuoteToken" className="block text-gray-700">
            Source Token
          </label>
          <select
            id="srcQuoteToken"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            value={selectedSrcToken ?? ""}
            onChange={(e) => setSelectedSrcToken(e.target.value)}
          >
            {srcTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="srcQuoteTokenAmount" className="block text-gray-700">
            Source Token Amount
          </label>
          <input
            type="text"
            id="srcQuoteTokenAmount"
            name="srcQuoteTokenAmount"
            value={srcQuoteTokenAmount}
            onChange={(e) => setSrcQuoteTokenAmount(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="dstQuoteToken" className="block text-gray-700">
            Destination Token
          </label>
          <select
            id="dstQuoteToken"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            value={selectedDstToken ?? ""}
            onChange={(e) => setSelectedDstToken(e.target.value)}
          >
            {dstTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="dstQuoteTokenUsdValue"
            className="block text-gray-700"
          >
            Destination Token USD Value
          </label>
          <input
            type="text"
            id="dstQuoteTokenUsdValue"
            name="dstQuoteTokenUsdValue"
            value={dstQuoteTokenUsdValue}
            readOnly
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
      </div>
    </form>
  );
};

export default QuoteForm;
