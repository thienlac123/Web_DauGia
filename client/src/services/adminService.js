import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, authConfig(token));
  return res.data;
};

export const toggleBlockUser = async (id, token) => {
  const res = await axios.patch(
    `${API_URL}/users/${id}/toggle-block`,
    {},
    authConfig(token)
  );
  return res.data;
};

export const getPendingAuctions = async (token) => {
  const res = await axios.get(`${API_URL}/auctions/pending`, authConfig(token));
  return res.data;
};

export const approveAuction = async (id, token) => {
  const res = await axios.patch(
    `${API_URL}/auctions/${id}/approve`,
    {},
    authConfig(token)
  );
  return res.data;
};

export const rejectAuction = async (id, note, token) => {
  const res = await axios.patch(
    `${API_URL}/auctions/${id}/reject`,
    { note },
    authConfig(token)
  );
  return res.data;
};