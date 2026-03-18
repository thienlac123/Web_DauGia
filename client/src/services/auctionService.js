import axios from "axios";

const API_URL = "http://localhost:5000/api/auctions";

export const getAllAuctions = async () => {
  const response = await axios.get(API_URL);
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