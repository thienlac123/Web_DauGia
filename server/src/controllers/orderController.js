import {
  getMyOrdersService,
  getSellerOrdersService,
  getAllOrdersService,
  prepareOrderService,
  shipOrderService,
  scheduleMeetupService,
  confirmDeliveredService,
} from "../services/orderService.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getMyOrdersService(req.user.userId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await getSellerOrdersService(req.user.userId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới có quyền" });
    }

    const orders = await getAllOrdersService();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const prepareOrder = async (req, res) => {
  try {
    const order = await prepareOrderService(
      req.params.id,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      message: "Đã xác nhận chuẩn bị bàn giao",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const shipOrder = async (req, res) => {
  try {
    const order = await shipOrderService(
      req.params.id,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      message: "Cập nhật giao hàng thành công",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const scheduleMeetup = async (req, res) => {
  try {
    const order = await scheduleMeetupService(
      req.params.id,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      message: "Đã lên lịch bàn giao trực tiếp",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const confirmDelivered = async (req, res) => {
  try {
    const order = await confirmDeliveredService(req.params.id, req.user.userId);
    return res.status(200).json({
      message: "Xác nhận nhận hàng thành công",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};