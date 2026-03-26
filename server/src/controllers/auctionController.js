import {
  createAuctionService,
  getAllAuctionsService,
  getAuctionByIdService,
  updateAuctionService,
  deleteAuctionService,
} from "../services/auctionService.js";
import User from "../models/User.js";
import { createNotificationService } from "../services/notificationService.js";
import { getEndedAuctionsService,getAuctionResultByIdService } from "../services/auctionService.js";
import Auction from "../models/Auction.js";
export const createAuction = async (req, res) => {
  try {
    const auction = await createAuctionService({
      ...req.body,
      sellerId: req.user.userId,
    });

    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      await createNotificationService({
        userId: admin._id,
        title: "Có phiên đấu giá mới chờ duyệt",
        message: `Seller vừa tạo phiên đấu giá "${auction.title}". Vui lòng kiểm duyệt.`,
        type: "system",
        relatedAuctionId: auction._id,
      });
    }

    res.status(201).json({
      message: "Tạo phiên đấu giá thành công",
      auction,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllAuctions = async (req, res) => {
  try {
    const { search, status, sort } = req.query;

    const auctions = await getAllAuctionsService({
      search,
      status,
      sort,
    });

    res.status(200).json({
      message: "Lấy danh sách phiên đấu giá thành công",
      auctions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAuctionById = async (req, res) => {
  try {
    const auction = await getAuctionByIdService(req.params.id);

    res.status(200).json({
      message: "Lấy chi tiết phiên đấu giá thành công",
      auction,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateAuction = async (req, res) => {
  try {
    const auction = await updateAuctionService(
      req.params.id,
      req.user.userId,
      req.body
    );

    res.status(200).json({
      message: "Cập nhật phiên đấu giá thành công",
      auction,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    const result = await deleteAuctionService(req.params.id, req.user.userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getEndedAuctions = async (req, res) => {
  try {
    const auctions = await getEndedAuctionsService();

    res.status(200).json({
      message: "Lấy danh sách kết quả đấu giá thành công",
      auctions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAuctionResultById = async (req, res) => {
  try {
    const result = await getAuctionResultByIdService(req.params.id);

    res.status(200).json({
      message: "Lấy chi tiết kết quả đấu giá thành công",
      result,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
export const payAuctionResult = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        message: "Không tìm thấy phiên đấu giá",
      });
    }

    if (auction.status !== "ended") {
      return res.status(400).json({
        message: "Phiên đấu giá chưa kết thúc",
      });
    }

    if (!auction.winnerId) {
      return res.status(400).json({
        message: "Phiên đấu giá chưa có người thắng",
      });
    }

    if (auction.winnerId.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Chỉ người thắng mới được thanh toán",
      });
    }

    auction.paymentStatus = "paid";
    await auction.save();

    res.status(200).json({
      message: "Thanh toán thành công",
      auction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};