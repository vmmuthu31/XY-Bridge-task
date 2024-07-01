import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getTokens, Token } from "../../services/apiService";

interface TokenSelectorProps {
  chainId: number | null;
  onTokenChange: (token: Token) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  chainId,
  onTokenChange,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (chainId) {
        try {
          console.log("Fetching tokens for chain:", chainId);
          const tokensData = await getTokens(chainId);
          console.log("Fetched tokens:", tokensData);
          setTokens(tokensData);
        } catch (error) {
          console.error("Error fetching tokens:", error);
        }
      }
    };

    fetchTokens();
  }, [chainId]);

  const handleTokenChange = (selectedOption: Token | null) => {
    setSelectedToken(selectedOption);
    if (selectedOption) {
      onTokenChange(selectedOption);
    }
  };

  const formatOptionLabel = (token: Token) => (
    <div className="flex items-center">
      <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 mr-2" />
      {token.symbol}
    </div>
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#374c6e",
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374c6e",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#243349" : "#374c6e",
      color: "white",
      "&:hover": {
        backgroundColor: "#243349",
      },
    }),
  };

  return (
    <Select
      options={tokens}
      value={selectedToken}
      onChange={handleTokenChange}
      formatOptionLabel={formatOptionLabel}
      getOptionLabel={(token) => token.symbol}
      getOptionValue={(token) => token.address}
      className="mt-2"
      styles={customStyles}
    />
  );
};

export default TokenSelector;
