import apiHelper from "../utils/apiHelper.js";

const fetchQuote = async (params) => {
  try {
    console.log("Fetching quote with params:", params);
    const response = await apiHelper.get("/quote", { params });
    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching quote:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching quote");
  }
};

const fetchParams = async (params) => {
  try {
    console.log("Fetching params with params:", params);
    const response = await apiHelper.get("/buildTx", { params });
    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching params:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching params");
  }
};

export default {
  fetchQuote,
  fetchParams,
};
