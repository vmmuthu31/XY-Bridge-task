import axios from "axios";

const apiHelper = axios.create({
  baseURL: "https://aggregator-api.xy.finance/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiHelper;
