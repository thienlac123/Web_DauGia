import express from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
} from "../controllers/auctionController.js";
import { placeBid, getAuctionBids } from "../controllers/bidController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);
router.get("/:id/bids", getAuctionBids);

router.post("/", authMiddleware, createAuction);
router.post("/:id/bid", authMiddleware, placeBid);

router.put("/:id", authMiddleware, updateAuction);
router.delete("/:id", authMiddleware, deleteAuction);

export default router;