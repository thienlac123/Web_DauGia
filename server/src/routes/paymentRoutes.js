import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createVNPayPaymentUrl,
  vnpayReturn,
  mockPaymentSuccess,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-vnpay/:auctionId", authMiddleware, createVNPayPaymentUrl);
router.post("/mock/:auctionId", authMiddleware, mockPaymentSuccess);
router.get("/vnpay-return", vnpayReturn);

export default router;