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