import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSellerAuctions } from "../controllers/userController.js";

const router = express.Router();

router.get("/seller/auctions", authMiddleware, getSellerAuctions);

export default router;