import {
  createAuctionService,
  getAllAuctionsService,
  getAuctionByIdService,
  updateAuctionService,
  deleteAuctionService,
} from "../services/auctionService.js";
import User from "../models/User.js";
import { createNotificationService } from "../services/notificationService.js";
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