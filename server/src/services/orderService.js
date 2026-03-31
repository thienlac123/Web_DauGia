import Order from "../models/Order.js";
import Auction from "../models/Auction.js";
import User from "../models/User.js";
import { createNotificationService } from "./notificationService.js"; // Thêm import mới

export const getOrCreateOrderFromAuction = async (auctionId) => {
  const existed = await Order.findOne({ auctionId });
  if (existed) return existed;

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    throw new Error("Không tìm thấy phiên đấu giá");
  }

  if (auction.status !== "ended") {
    throw new Error("Phiên đấu giá chưa kết thúc");
  }

  if (!auction.winnerId) {
    throw new Error("Phiên đấu giá chưa có người thắng");
  }

  const winner = await User.findById(auction.winnerId);
  if (!winner) {
    throw new Error("Không tìm thấy người thắng");
  }

  const order = await Order.create({
    auctionId: auction._id,
    sellerId: auction.sellerId,
    buyerId: auction.winnerId,
    finalPrice: auction.currentPrice,
    status: auction.paymentStatus === "paid" ? "PAID" : "AWAITING_PAYMENT",
    shippingAddress: winner.address || {},
  });

  return order;
};

export const getMyOrdersService = async (userId) => {
  return await Order.find({ buyerId: userId })
    .populate("auctionId", "title images currentPrice endTime paymentStatus")
    .populate("sellerId", "name fullName email phone")
    .sort({ createdAt: -1 });
};

export const getSellerOrdersService = async (userId) => {
  return await Order.find({ sellerId: userId })
    .populate("auctionId", "title images currentPrice endTime paymentStatus")
    .populate("buyerId", "name fullName email phone address")
    .sort({ createdAt: -1 });
};

export const getAllOrdersService = async () => {
  return await Order.find()
    .populate("auctionId", "title images currentPrice endTime paymentStatus")
    .populate("sellerId", "name fullName email phone")
    .populate("buyerId", "name fullName email phone")
    .sort({ createdAt: -1 });
};

// Cập nhật hàm chuẩn bị hàng
export const prepareOrderService = async (orderId, sellerId, payload = {}) => {
  const order = await Order.findById(orderId).populate("auctionId", "title");
  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (String(order.sellerId) !== String(sellerId)) {
    throw new Error("Bạn không có quyền cập nhật đơn hàng này");
  }

  if (order.status !== "PAID") {
    throw new Error("Đơn hàng phải ở trạng thái đã thanh toán");
  }

  order.status = "PREPARING_HANDOVER";
  order.note = payload.note ?? order.note;

  if (payload.handoverMethod && ["SHIPPING", "MEETUP"].includes(payload.handoverMethod)) {
    order.handoverMethod = payload.handoverMethod;
  }

  await order.save();

  // Gửi thông báo tự động
  await createNotificationService({
    userId: order.buyerId,
    title: "Người bán đang chuẩn bị bàn giao",
    message: `Đơn hàng "${order.auctionId?.title || ""}" đã được người bán chuẩn bị bàn giao.`,
    type: "order_preparing",
    relatedAuctionId: order.auctionId?._id || order.auctionId,
    relatedOrderId: order._id,
  });

  return order;
};

// Cập nhật hàm giao hàng
export const shipOrderService = async (orderId, sellerId, payload = {}) => {
  const order = await Order.findById(orderId).populate("auctionId", "title");
  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (String(order.sellerId) !== String(sellerId)) {
    throw new Error("Bạn không có quyền cập nhật đơn hàng này");
  }

  if (!["PAID", "PREPARING_HANDOVER"].includes(order.status)) {
    throw new Error("Đơn hàng chưa ở trạng thái có thể giao");
  }

  order.handoverMethod = "SHIPPING";
  order.status = "SHIPPING";
  order.carrier = payload.carrier || order.carrier;
  order.trackingCode = payload.trackingCode || order.trackingCode;
  order.note = payload.note ?? order.note;

  if (!order.carrier || !order.trackingCode) {
    throw new Error("Vui lòng nhập đơn vị vận chuyển và mã vận đơn");
  }

  await order.save();

  // Gửi thông báo tự động
  await createNotificationService({
    userId: order.buyerId,
    title: "Đơn hàng đang được giao",
    message: `Đơn hàng "${order.auctionId?.title || ""}" đang được giao qua ${order.carrier}. Mã vận đơn: ${order.trackingCode}.`,
    type: "order_shipping",
    relatedAuctionId: order.auctionId?._id || order.auctionId,
    relatedOrderId: order._id,
  });

  return order;
};

// Cập nhật hàm hẹn bàn giao trực tiếp
export const scheduleMeetupService = async (orderId, sellerId, payload = {}) => {
  const order = await Order.findById(orderId).populate("auctionId", "title");
  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (String(order.sellerId) !== String(sellerId)) {
    throw new Error("Bạn không có quyền cập nhật đơn hàng này");
  }

  if (!["PAID", "PREPARING_HANDOVER"].includes(order.status)) {
    throw new Error("Đơn hàng chưa ở trạng thái có thể hẹn bàn giao");
  }

  if (!payload.meetupLocation || !payload.meetupTime) {
    throw new Error("Vui lòng nhập địa điểm và thời gian bàn giao");
  }

  order.handoverMethod = "MEETUP";
  order.status = "HANDOVER_SCHEDULED";
  order.meetupLocation = payload.meetupLocation;
  order.meetupTime = new Date(payload.meetupTime);
  order.note = payload.note ?? order.note;

  await order.save();

  // Gửi thông báo tự động
  await createNotificationService({
    userId: order.buyerId,
    title: "Đã lên lịch bàn giao trực tiếp",
    message: `Đơn hàng "${order.auctionId?.title || ""}" có lịch bàn giao tại ${order.meetupLocation} vào ${new Date(order.meetupTime).toLocaleString("vi-VN")}.`,
    type: "order_meetup",
    relatedAuctionId: order.auctionId?._id || order.auctionId,
    relatedOrderId: order._id,
  });

  return order;
};

// Cập nhật hàm xác nhận hoàn tất
export const confirmDeliveredService = async (orderId, userId) => {
  const order = await Order.findById(orderId).populate("auctionId", "title");
  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  if (String(order.buyerId) !== String(userId)) {
    throw new Error("Bạn không có quyền xác nhận đơn này");
  }

  if (!["SHIPPING", "HANDOVER_SCHEDULED", "PREPARING_HANDOVER", "PAID"].includes(order.status)) {
    throw new Error("Đơn hàng chưa ở trạng thái có thể xác nhận");
  }

  order.status = "COMPLETED";
  order.deliveredAt = new Date();
  order.completedAt = new Date();

  await order.save();

  // Gửi thông báo cho NGƯỜI BÁN
  await createNotificationService({
    userId: order.sellerId,
    title: "Người mua đã xác nhận nhận hàng",
    message: `Người mua đã xác nhận hoàn tất đơn hàng "${order.auctionId?.title || ""}".`,
    type: "order_completed",
    relatedAuctionId: order.auctionId?._id || order.auctionId,
    relatedOrderId: order._id,
  });

  return order;
};