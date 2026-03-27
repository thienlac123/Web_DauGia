import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getSellerAuctions,
  getBidderAuctions,
  getMyBids,
  getSellerAuctionDetail,
  getSellerAnalytics,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getMyProfile);
router.patch("/profile", authMiddleware, updateMyProfile);

router.get("/seller/auctions", authMiddleware, getSellerAuctions);
router.get("/bidder/auctions", authMiddleware, getBidderAuctions);
router.get("/bidder/bids", authMiddleware, getMyBids);
router.get("/seller/auctions/:id", authMiddleware, getSellerAuctionDetail);
router.get("/seller/analytics", authMiddleware, getSellerAnalytics);

export default router;