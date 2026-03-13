import { createAuctionService } from "../services/auctionService.js";

export const createAuction = async (req, res) => {
  try {
    const auction = await createAuctionService({
      ...req.body,
      sellerId: req.user.userId,
    });

    res.status(201).json({
      message: "Tạo phiên đấu giá thành công",
      auction,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};