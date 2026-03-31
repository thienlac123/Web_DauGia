import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

export const createVNPayPayment = async (auctionId, token) => {
  const response = await axios.post(
    `${API_URL}/create-vnpay/${auctionId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const mockPayment = async (auctionId, token) => {
  const response = await axios.post(
    `${API_URL}/mock/${auctionId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};