import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getMyNotifications);
router.get("/unread-count", authMiddleware, getUnreadNotificationCount);
router.patch("/:id/read", authMiddleware, markNotificationAsRead);

export default router;