import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getBidderAuctions = async (token) => {
  const res = await axios.get(`${API_URL}/bidder/auctions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyBids = async (token) => {
  const res = await axios.get(`${API_URL}/bidder/bids`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};