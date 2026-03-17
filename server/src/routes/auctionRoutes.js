import express from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
} from "../controllers/auctionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);
router.post("/", authMiddleware, createAuction);
router.put("/:id", authMiddleware, updateAuction);
router.delete("/:id", authMiddleware, deleteAuction);

export default router;