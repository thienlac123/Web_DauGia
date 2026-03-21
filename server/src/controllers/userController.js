import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
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
export const getBidderAuctions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bids = await Bid.find({ userId });

    const auctionIds = [...new Set(bids.map((b) => b.auctionId.toString()))];

    const auctions = await Auction.find({ _id: { $in: auctionIds } })
      .populate("highestBidderId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      auctions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyBids = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bids = await Bid.find({ userId })
      .populate("auctionId", "title status currentPrice")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bids,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};