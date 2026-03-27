import {
  createVNPayPaymentUrlService,
  handleVNPayReturnService,
} from "../services/paymentService.js";
import Auction from "../models/Auction.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js"; // Thêm model Notification
import { getOrCreateOrderFromAuction } from "../services/orderService.js";

export const createVNPayPaymentUrl = async (req, res) => {
  try {
    const data = await createVNPayPaymentUrlService({
      auctionId: req.params.auctionId,
      userId: req.user.userId,
      ipAddr:
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip,
    });

    return res.status(200).json({
      message: "Tạo link thanh toán thành công",
      ...data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    const result = await handleVNPayReturnService(req.query);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    if (result.success) {
      // --- THÊM THÔNG BÁO KHI THANH TOÁN THẬT THÀNH CÔNG ---
      await Notification.create({
        userId: result.payment.buyerId,
        title: "Thanh toán thành công",
        message: `Đơn hàng cho đấu giá "${result.auction?.title}" đã được thanh toán qua VNPay.`,
        type: "order_paid",
        relatedAuctionId: result.auction?._id,
        relatedOrderId: result.order?._id,
      });
      // ---------------------------------------------------

      return res.redirect(
        `${clientUrl}/payment-result?success=1&auctionId=${result.auction?._id || ""}`
      );
    }

    return res.redirect(
      `${clientUrl}/payment-result?success=0&auctionId=${result.auction?._id || ""}`
    );
  } catch (error) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(
      `${clientUrl}/payment-result?success=0&message=${encodeURIComponent(error.message)}`
    );
  }
};

export const mockPaymentSuccess = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const userId = req.user.userId;

    const order = await getOrCreateOrderFromAuction(auctionId);

    if (String(order.buyerId) !== String(userId)) {
      return res.status(403).json({
        message: "Chỉ người thắng mới được thanh toán",
      });
    }

    if (order.status === "PAID") {
      return res.status(400).json({
        message: "Đơn hàng đã được thanh toán",
      });
    }

    await Payment.create({
      orderId: order._id,
      auctionId,
      buyerId: userId,
      amount: order.finalPrice,
      method: "VNPAY",
      status: "SUCCESS",
      txnRef: `MOCK_${auctionId}_${Date.now()}`,
      responseCode: "00",
      rawData: { mock: true },
    });

    order.status = "PAID";
    order.paidAt = new Date();
    await order.save();

    const auction = await Auction.findById(auctionId);
    if (auction) {
      auction.paymentStatus = "paid";
      await auction.save();

      // --- THÊM THÔNG BÁO KHI THANH TOÁN MOCK THÀNH CÔNG ---
      await Notification.create({
        userId: userId,
        title: "Thanh toán thành công (Demo)",
        message: `Bạn đã thanh toán thành công cho đấu giá "${auction.title}".`,
        type: "order_paid",
        relatedAuctionId: auction._id,
        relatedOrderId: order._id,
      });
      // --------------------------------------------------
    }

    return res.status(200).json({
      message: "Thanh toán demo thành công",
      order,
      auction,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};