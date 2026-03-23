import {
  getMyNotificationsService,
  markNotificationAsReadService,
} from "../services/notificationService.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await getMyNotificationsService(req.user.userId);

    res.status(200).json({
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await markNotificationAsReadService(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      message: "Đã đánh dấu đã đọc",
      notification,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};