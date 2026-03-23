import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getMyNotifications = async (token) => {
  const res = await axios.get(API_URL, authConfig(token));
  return res.data;
};

export const markNotificationAsRead = async (id, token) => {
  const res = await axios.patch(`${API_URL}/${id}/read`, {}, authConfig(token));
  return res.data;
};