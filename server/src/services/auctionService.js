import Auction from "../models/Auction.js";

export const createAuctionService = async ({
  title,
  description,
  startPrice,
  minBidStep,
  startTime,
  endTime,
  sellerId,
}) => {
  if (!title || !startPrice || !startTime || !endTime) {
    throw new Error("Vui lòng nhập đầy đủ thông tin bắt buộc");
  }

  if (Number(startPrice) < 0) {
    throw new Error("Giá khởi điểm không hợp lệ");
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
  }

  const auction = await Auction.create({
    title,
    description,
    startPrice,
    currentPrice: startPrice,
    minBidStep: minBidStep || 1000,
    startTime,
    endTime,
    sellerId,
  });

  return auction;
};