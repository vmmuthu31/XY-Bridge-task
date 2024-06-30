import React, { useEffect, useState } from "react";
import { getChains, Chain } from "../../services/apiService";

interface ChainSelectorProps {
  onChainChange: (chainId: number, type: "source" | "destination") => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ onChainChange }) => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedSrcChain, setSelectedSrcChain] = useState<number | null>(null);
  const [selectedDstChain, setSelectedDstChain] = useState<number | null>(null);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const chainsData = await getChains();
        setChains(chainsData);
      } catch (error) {
        console.error("Error fetching chains", error);
      }
    };

    fetchChains();
  }, []);

  const handleSrcChainChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const chainId = parseInt(event.target.value);
    setSelectedSrcChain(chainId);
    onChainChange(chainId, "source");
  };

  const handleDstChainChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const chainId = parseInt(event.target.value);
    setSelectedDstChain(chainId);
    onChainChange(chainId, "destination");
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Select Source and Destination Chains
      </h2>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="srcChain" className="block text-gray-700">
            Source Chain
          </label>
          <select
            id="srcChain"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            value={selectedSrcChain ?? ""}
            onChange={handleSrcChainChange}
          >
            <option value="" disabled>
              Select Source Chain
            </option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="dstChain" className="block text-gray-700">
            Destination Chain
          </label>
          <select
            id="dstChain"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            value={selectedDstChain ?? ""}
            onChange={handleDstChainChange}
          >
            <option value="" disabled>
              Select Destination Chain
            </option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChainSelector;
