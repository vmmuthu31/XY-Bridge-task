import { API_URL, API_URL2 } from "@/constants/domain";
import axios from "axios";

export interface Chain {
  chainId: number;
  name: string;
  logoURI: string;
}

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
}

export interface QuoteParams {
  address: string | undefined;
  srcChainId: number;
  srcQuoteTokenAddress: string;
  srcQuoteTokenAmount: string;
  dstChainId: number;
  dstQuoteTokenAddress: string;
  dstDecimals: number;
  srcDecimals: number;
  slippage: number;
}

export interface ParamsData {
  srcChainId: number;
  srcQuoteTokenAddress: string;
  srcQuoteTokenAmount: string;
  dstChainId: number;
  dstQuoteTokenAddress: string;
  slippage: number;
  receiver: string | undefined;
  commissionRate: number;
  bridgeProvider: string;
  srcBridgeTokenAddress: string;
  dstBridgeTokenAddress: string;
  srcSwapProvider: string;
  dstSwapProvider: string;
}

export const getChains = async (): Promise<Chain[]> => {
  const response = await axios.get(`${API_URL}/chains`);
  return response.data;
};
export const getTokens = async (chainId: number): Promise<Token[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/recommendedtokens?chainId=${chainId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tokens from API:", error);
    throw error;
  }
};

export const getQuote = async (params: QuoteParams): Promise<any> => {
  const payload = [
    {
      account: params.address,
      amount: params.srcQuoteTokenAmount,
      destToken: params.dstQuoteTokenAddress,
      destDecimals: params.dstDecimals,
      fromChain: params.srcChainId,
      slippage: params.slippage,
      srcDecimals: params.srcDecimals,
      srcToken: params.srcQuoteTokenAddress,
      toChain: params.dstChainId,
    },
  ];

  const response = await axios.post(
    "https://api.dzap.io/v1/bridge/quote",
    payload
  );
  return response.data;
};

export const getParams = async (data: ParamsData): Promise<any> => {
  const response = await axios.post(`${API_URL}/params`, data);
  return response.data;
};

export const getTokenPrice = async (
  tokenAddress: string,
  chainId: number
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL2}/token/price`, {
      params: {
        tokenAddresses: [tokenAddress],
        chainId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
};
