import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getSellerAuctions = async (token) => {
  const response = await axios.get(`${API_URL}/seller/auctions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getSellerAuctionDetail = async (id, token) => {
  const response = await axios.get(`${API_URL}/seller/auctions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getSellerAnalytics = async (token) => {
  const response = await axios.get(`${API_URL}/seller/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};