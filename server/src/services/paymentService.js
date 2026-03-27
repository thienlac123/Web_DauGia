import crypto from "crypto";
import qs from "qs";
import Auction from "../models/Auction.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { getOrCreateOrderFromAuction } from "./orderService.js";

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }

  return sorted;
};

export const createVNPayPaymentUrlService = async ({
  auctionId,
  userId,
  ipAddr,
}) => {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw new Error("Không tìm thấy phiên đấu giá");

  if (auction.status !== "ended") {
    throw new Error("Phiên đấu giá chưa kết thúc");
  }

  if (!auction.winnerId || auction.winnerId.toString() !== userId) {
    throw new Error("Chỉ người thắng mới được thanh toán");
  }

  const order = await getOrCreateOrderFromAuction(auctionId);

  if (auction.paymentStatus === "paid" || order.status === "PAID") {
    throw new Error("Đơn hàng đã được thanh toán");
  }

  const createDate = new Date();
  const txnRef = `${auction._id}_${Date.now()}`;
  const amount = Math.round(order.finalPrice);

  await Payment.create({
    orderId: order._id,
    auctionId: auction._id,
    buyerId: userId,
    amount,
    method: "VNPAY",
    status: "PENDING",
    txnRef,
  });

  const vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan dau gia ${auction.title}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate:
      createDate.getFullYear().toString() +
      String(createDate.getMonth() + 1).padStart(2, "0") +
      String(createDate.getDate()).padStart(2, "0") +
      String(createDate.getHours()).padStart(2, "0") +
      String(createDate.getMinutes()).padStart(2, "0") +
      String(createDate.getSeconds()).padStart(2, "0"),
  };

  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const signed = crypto
    .createHmac("sha512", process.env.VNP_HASHSECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  sortedParams.vnp_SecureHash = signed;

  const paymentUrl =
    process.env.VNP_URL + "?" + qs.stringify(sortedParams, { encode: false });

  return {
    paymentUrl,
    txnRef,
    order,
  };
};

export const handleVNPayReturnService = async (query) => {
  const vnpParams = { ...query };
  const secureHash = vnpParams.vnp_SecureHash;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  const signed = crypto
    .createHmac("sha512", process.env.VNP_HASHSECRET)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash !== signed) {
    throw new Error("Sai checksum VNPay");
  }

  const txnRef = vnpParams.vnp_TxnRef;
  const responseCode = vnpParams.vnp_ResponseCode;

  const payment = await Payment.findOne({ txnRef });
  if (!payment) throw new Error("Không tìm thấy giao dịch thanh toán");

  const order = await Order.findById(payment.orderId);
  const auction = await Auction.findById(payment.auctionId);

  payment.rawData = query;
  payment.responseCode = responseCode || "";
  payment.bankCode = vnpParams.vnp_BankCode || "";
  payment.transactionNo = vnpParams.vnp_TransactionNo || "";
  payment.payDate = vnpParams.vnp_PayDate || "";

  if (responseCode === "00") {
    payment.status = "SUCCESS";

    if (order) {
      order.status = "PAID";
      order.paidAt = new Date();
      await order.save();
    }

    if (auction) {
      auction.paymentStatus = "paid";
      await auction.save();
    }
  } else {
    payment.status = "FAILED";

    if (auction && auction.paymentStatus !== "paid") {
      auction.paymentStatus = "failed";
      await auction.save();
    }
  }

  await payment.save();

  return {
    success: responseCode === "00",
    payment,
    order,
    auction,
  };
};