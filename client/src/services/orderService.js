import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getMyOrders = async (token) => {
  const response = await axios.get(`${API_URL}/my`, authConfig(token));
  return response.data;
};

export const getSellerOrders = async (token) => {
  const response = await axios.get(`${API_URL}/seller`, authConfig(token));
  return response.data;
};

export const getAllOrders = async (token) => {
  const response = await axios.get(`${API_URL}`, authConfig(token));
  return response.data;
};

export const prepareOrder = async (orderId, payload, token) => {
  const response = await axios.patch(
    `${API_URL}/${orderId}/prepare`,
    payload,
    authConfig(token)
  );
  return response.data;
};

export const shipOrder = async (orderId, payload, token) => {
  const response = await axios.patch(
    `${API_URL}/${orderId}/ship`,
    payload,
    authConfig(token)
  );
  return response.data;
};

export const scheduleMeetup = async (orderId, payload, token) => {
  const response = await axios.patch(
    `${API_URL}/${orderId}/meetup`,
    payload,
    authConfig(token)
  );
  return response.data;
};

export const confirmDelivered = async (orderId, token) => {
  const response = await axios.patch(
    `${API_URL}/${orderId}/confirm-delivered`,
    {},
    authConfig(token)
  );
  return response.data;
};