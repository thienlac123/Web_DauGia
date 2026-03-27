import Notification from "../models/Notification.js";

export const createNotificationService = async ({
  userId,
  title,
  message,
  type,
  relatedAuctionId = null,
  relatedOrderId = null,
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    relatedAuctionId,
    relatedOrderId,
  });

  return notification;
};

export const getMyNotificationsService = async (userId) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  return notifications;
};

export const markNotificationAsReadService = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new Error("Không tìm thấy thông báo");
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};