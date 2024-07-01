import React from "react";
import Select from "react-select";

interface Chain {
  chainId: number;
  name: string;
  logoURI: string;
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChain: Chain | null;
  onChange: (chain: Chain | null) => void;
}

const formatOptionLabel = (chain: Chain) => (
  <div className="flex items-center">
    <img src={chain.logoURI} alt={chain.name} className="w-6 h-6 mr-2" />
    {chain.name}
  </div>
);

const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  selectedChain,
  onChange,
}) => {
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
      options={chains}
      value={selectedChain}
      onChange={onChange}
      formatOptionLabel={formatOptionLabel}
      getOptionLabel={(chain) => chain.name}
      getOptionValue={(chain) => chain.chainId.toString()}
      className="mt-2"
      styles={customStyles}
    />
  );
};

export default ChainSelector;
