import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};