import Auction from "../models/Auction.js";

export const getSellerAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ sellerId: req.user.userId })
      .populate("highestBidderId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách phiên đã tạo thành công",
      auctions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};