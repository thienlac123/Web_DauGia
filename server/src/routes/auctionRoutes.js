import express from "express";
import { createAuction } from "../controllers/auctionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAuction);

export default router;