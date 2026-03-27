import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getMyOrders,
  getSellerOrders,
  getAllOrders,
  prepareOrder,
  shipOrder,
  scheduleMeetup,
  confirmDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/my", authMiddleware, getMyOrders);
router.get("/seller", authMiddleware, getSellerOrders);
router.get("/", authMiddleware, getAllOrders);

router.patch("/:id/prepare", authMiddleware, prepareOrder);
router.patch("/:id/ship", authMiddleware, shipOrder);
router.patch("/:id/meetup", authMiddleware, scheduleMeetup);
router.patch("/:id/confirm-delivered", authMiddleware, confirmDelivered);

export default router;