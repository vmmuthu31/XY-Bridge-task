import React from "react";
import { FaGasPump, FaCog, FaCheckCircle } from "react-icons/fa";
import { ethers } from "ethers";

const formatTokenAmount = (amount, decimals) => {
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return amount;
  }
};

const QuoteDetails = ({ quoteKey, providerKey, provider, isBest }) => {
  return (
    <div>
      <div
        key={`${quoteKey}-${providerKey}`}
        className="bg-gray-200 text-gray-800 p-4 rounded-lg mb-4 flex flex-col items-start"
      >
        <div className="flex gap-2 w-full">
          <div className="flex items-center space-x-2">
            <FaGasPump />
            <span>${provider.gasFee.amountUSD.slice(0, 5)}</span>
          </div>
          |
          <div className="flex items-center space-x-2">
            <FaCog />
            <span>{provider.duration} min</span>
          </div>
          |
          <div className="flex items-center space-x-2">
            <span>{provider.steps.length} steps</span>
          </div>
          <div className="ml-10">
            {isBest && (
              <div className="flex items-center  space-x-2 text-green-500">
                <FaCheckCircle />
                <span>Best</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start space-x-2 mt-4">
          <span>
            {formatTokenAmount(
              provider.destAmount,
              provider.destToken.decimals
            ).slice(0, 5)}{" "}
            <span>{provider.destToken.symbol}</span>
          </span>
        </div>
        <div className="flex items-start space-x-2 mt-4">
          {provider.bridgeDetails && provider.bridgeDetails.icon && (
            <img
              src={provider.bridgeDetails.icon}
              alt={provider.bridgeDetails.name}
              className="w-6 h-6"
            />
          )}
          <span>via </span>
          {provider.providerDetails.icon && (
            <img
              src={provider.providerDetails.icon}
              alt={provider.providerDetails.name}
              className="w-6 h-6"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;
