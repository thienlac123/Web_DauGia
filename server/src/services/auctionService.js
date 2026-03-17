import Auction from "../models/Auction.js";

const getAuctionStatus = (startTime, endTime) => {
  const now = new Date();

  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "active";
};

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

  const status = getAuctionStatus(startTime, endTime);

  const auction = await Auction.create({
    title,
    description,
    startPrice,
    currentPrice: startPrice,
    minBidStep: minBidStep || 1000,
    startTime,
    endTime,
    sellerId,
    status,
  });

  return auction;
};

export const getAllAuctionsService = async () => {
  const auctions = await Auction.find()
    .populate("sellerId", "name email")
    .sort({ createdAt: -1 });

  return auctions;
};

export const getAuctionByIdService = async (auctionId) => {
  const auction = await Auction.findById(auctionId).populate(
    "sellerId",
    "name email"
  );

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  return auction;
};

export const updateAuctionService = async (auctionId, userId, updateData) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  if (auction.sellerId.toString() !== userId) {
    throw new Error("Bạn không có quyền cập nhật phiên đấu giá này");
  }

  if (updateData.startTime && updateData.endTime) {
    if (new Date(updateData.endTime) <= new Date(updateData.startTime)) {
      throw new Error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
    }
  }

  const mergedStartTime = updateData.startTime || auction.startTime;
  const mergedEndTime = updateData.endTime || auction.endTime;

  auction.title = updateData.title ?? auction.title;
  auction.description = updateData.description ?? auction.description;
  auction.startPrice = updateData.startPrice ?? auction.startPrice;
  auction.minBidStep = updateData.minBidStep ?? auction.minBidStep;
  auction.startTime = mergedStartTime;
  auction.endTime = mergedEndTime;
  auction.status = getAuctionStatus(mergedStartTime, mergedEndTime);

  if (updateData.startPrice !== undefined) {
    auction.currentPrice = updateData.startPrice;
  }

  await auction.save();

  return auction;
};

export const deleteAuctionService = async (auctionId, userId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  if (auction.sellerId.toString() !== userId) {
    throw new Error("Bạn không có quyền xóa phiên đấu giá này");
  }

  await Auction.findByIdAndDelete(auctionId);

  return { message: "Xóa phiên đấu giá thành công" };
};