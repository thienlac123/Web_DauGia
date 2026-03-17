import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

export const placeBidService = async (auctionId, userId, bidAmount) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  if (auction.status !== "active") {
    throw new Error("Phiên đấu giá không ở trạng thái active");
  }

  if (auction.sellerId.toString() === userId) {
    throw new Error("Người bán không được tự đặt giá");
  }

  const minimumValidBid = auction.currentPrice + auction.minBidStep;

  if (Number(bidAmount) < minimumValidBid) {
    throw new Error(`Giá đặt phải lớn hơn hoặc bằng ${minimumValidBid}`);
  }

  const bid = await Bid.create({
    auctionId,
    userId,
    bidAmount,
  });

  auction.currentPrice = bidAmount;
  auction.highestBidderId = userId;
  await auction.save();

  return bid;
};

export const getBidsByAuctionService = async (auctionId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  const bids = await Bid.find({ auctionId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return bids;
};