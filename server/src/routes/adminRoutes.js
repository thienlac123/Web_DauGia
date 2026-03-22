import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  toggleBlockUser,
  getPendingAuctions,
  approveAuction,
  rejectAuction,
  getAllAuctionsForAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-block", toggleBlockUser);

router.get("/auctions", getAllAuctionsForAdmin);
router.get("/auctions/pending", getPendingAuctions);
router.patch("/auctions/:id/approve", approveAuction);
router.patch("/auctions/:id/reject", rejectAuction);

export default router;