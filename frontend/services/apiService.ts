import axios from "axios";

export interface Chain {
  chainId: number;
  name: string;
}

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
}

export interface QuoteParams {
  srcChainId: number;
  srcQuoteTokenAddress: string;
  srcQuoteTokenAmount: string;
  dstChainId: number;
  dstQuoteTokenAddress: string;
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

const API_URL = "http://localhost:8000/api";

export const getChains = async (): Promise<Chain[]> => {
  const response = await axios.get(`${API_URL}/chains`);
  return response.data;
};

export const getTokens = async (chainId: number): Promise<Token[]> => {
  const response = await axios.get(
    `${API_URL}/recommendedtokens?chainId=${chainId}`
  );
  return response.data;
};

export const getQuote = async (params: QuoteParams): Promise<any> => {
  const response = await axios.get(`${API_URL}/quotes`, { params });
  return response.data;
};

export const getParams = async (data: ParamsData): Promise<any> => {
  const response = await axios.post(`${API_URL}/params`, data);
  return response.data;
};
