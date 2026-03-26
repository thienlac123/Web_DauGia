import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSellerAuctions } from "../controllers/userController.js";
import {
  
  getBidderAuctions,
  getMyBids,
  getSellerAuctionDetail,
  getSellerAnalytics,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/seller/auctions", authMiddleware, getSellerAuctions);
router.get("/bidder/auctions", authMiddleware, getBidderAuctions);
router.get("/bidder/bids", authMiddleware, getMyBids);
router.get("/seller/auctions/:id", authMiddleware, getSellerAuctionDetail);
router.get("/seller/analytics", authMiddleware, getSellerAnalytics);
export default router;