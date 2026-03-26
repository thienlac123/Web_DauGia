import axios from "axios";

const API_URL = "http://localhost:5000/api/auctions";

export const getAllAuctions = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getAuctionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createAuction = async (auctionData, token) => {
  const response = await axios.post(API_URL, auctionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAuctionBids = async (auctionId) => {
  const response = await axios.get(`${API_URL}/${auctionId}/bids`);
  return response.data;
};

export const getAuctionResults = async () => {
  const response = await axios.get(`${API_URL}/results/all`);
  return response.data;
};

export const getAuctionResultById = async (id) => {
  const response = await axios.get(`${API_URL}/results/${id}`);
  return response.data;
};