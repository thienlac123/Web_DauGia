import User from "../models/User.js";
import Auction from "../models/Auction.js";
import { createNotificationService } from "../services/notificationService.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ approvalStatus: "pending" })
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ auctions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Không tìm thấy auction" });
    }

    auction.approvalStatus = "approved";
    auction.approvalNote = "";
    await auction.save();

    await createNotificationService({
      userId: auction.sellerId,
      title: "Phiên đấu giá đã được duyệt",
      message: `Phiên đấu giá "${auction.title}" đã được admin duyệt và hiển thị công khai.`,
      type: "auction_approved",
      relatedAuctionId: auction._id,
    });

    res.status(200).json({
      message: "Đã duyệt phiên đấu giá",
      auction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectAuction = async (req, res) => {
  try {
    const { note } = req.body;

    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Không tìm thấy auction" });
    }

    auction.approvalStatus = "rejected";
    auction.approvalNote = note || "";
    await auction.save();

    await createNotificationService({
      userId: auction.sellerId,
      title: "Phiên đấu giá bị từ chối",
      message: `Phiên đấu giá "${auction.title}" đã bị từ chối.${note ? ` Lý do: ${note}` : ""}`,
      type: "auction_rejected",
      relatedAuctionId: auction._id,
    });

    res.status(200).json({
      message: "Đã từ chối phiên đấu giá",
      auction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAuctionsForAdmin = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ auctions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};