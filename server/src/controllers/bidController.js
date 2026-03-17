import {
  placeBidService,
  getBidsByAuctionService,
} from "../services/bidService.js";

export const placeBid = async (req, res) => {
  try {
    const bid = await placeBidService(
      req.params.id,
      req.user.userId,
      req.body.bidAmount
    );

    res.status(201).json({
      message: "Đặt giá thành công",
      bid,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAuctionBids = async (req, res) => {
  try {
    const bids = await getBidsByAuctionService(req.params.id);

    res.status(200).json({
      message: "Lấy lịch sử đấu giá thành công",
      bids,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};