import Auction from "../models/Auction.js";

export const calculateAuctionStatus = (startTime, endTime) => {
  const now = new Date();

  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "active";
};

export const refreshAuctionStatus = async (auction) => {
  const newStatus = calculateAuctionStatus(auction.startTime, auction.endTime);

  if (auction.status !== newStatus) {
    auction.status = newStatus;
    await auction.save();
  }

  return auction;
};

export const createAuctionService = async ({
  title,
  description,
  startPrice,
  minBidStep,
  startTime,
  endTime,
  sellerId,
  images,
  category,
  location,
  condition,
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

  const status = calculateAuctionStatus(startTime, endTime);

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
    images: images || [],
    category: category || "Khác",
    location: location || "",
    condition: condition || "",
  });

  return auction;
};
export const getAllAuctionsService = async ({ search, status, sort }) => {
  const query = {
    approvalStatus: "approved",
  };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  let sortOption = { createdAt: -1 };

  if (sort === "price_asc") {
    sortOption = { currentPrice: 1 };
  } else if (sort === "price_desc") {
    sortOption = { currentPrice: -1 };
  } else if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const auctions = await Auction.find(query)
    .populate("sellerId", "name email")
    .populate("highestBidderId", "name email")
    .sort(sortOption);

  for (const auction of auctions) {
    await refreshAuctionStatus(auction);
  }

  return auctions;
};

export const getAuctionByIdService = async (auctionId) => {
  const auction = await Auction.findById(auctionId)
    .populate("sellerId", "name email")
    .populate("highestBidderId", "name email");

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

    await refreshAuctionStatus(auction);

  if (auction.status === "ended" && !auction.winnerId && auction.highestBidderId) {
    auction.winnerId = auction.highestBidderId;
    await auction.save();
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

  const mergedStartTime = updateData.startTime || auction.startTime;
  const mergedEndTime = updateData.endTime || auction.endTime;

  if (new Date(mergedEndTime) <= new Date(mergedStartTime)) {
    throw new Error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
  }

  auction.title = updateData.title ?? auction.title;
  auction.description = updateData.description ?? auction.description;
  auction.startPrice = updateData.startPrice ?? auction.startPrice;
  auction.minBidStep = updateData.minBidStep ?? auction.minBidStep;
  auction.startTime = mergedStartTime;
  auction.endTime = mergedEndTime;
  auction.status = calculateAuctionStatus(mergedStartTime, mergedEndTime);
  auction.images = updateData.images ?? auction.images;
  auction.category = updateData.category ?? auction.category;
  auction.location = updateData.location ?? auction.location;
  auction.condition = updateData.condition ?? auction.condition;

  if (
    updateData.startPrice !== undefined &&
    auction.currentPrice === auction.startPrice
  ) {
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
export const finalizeEndedAuctionService = async (auctionId) => {
  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  const latestStatus = calculateAuctionStatus(auction.startTime, auction.endTime);

  if (latestStatus === "ended") {
    auction.status = "ended";

    if (auction.highestBidderId) {
      auction.winnerId = auction.highestBidderId;
    }

    await auction.save();
  }

  return auction;
};