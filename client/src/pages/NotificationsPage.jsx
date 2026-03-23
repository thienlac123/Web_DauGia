import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

function NotificationsPage() {
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications(token);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    await markNotificationAsRead(id, token);
    fetchNotifications();
  };

  if (loading) return <h2>Đang tải thông báo...</h2>;

  return (
    <div>
      <h1 className="page-title">Thông báo</h1>

      <div className="detail-card">
        {notifications.length === 0 ? (
          <p>Chưa có thông báo nào.</p>
        ) : (
          <div className="bid-list">
            {notifications.map((item) => (
              <div
                key={item._id}
                className="bid-item"
                style={{
                  opacity: item.isRead ? 0.7 : 1,
                }}
              >
                <p><strong>{item.title}</strong></p>
                <p>{item.message}</p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </p>

                {!item.isRead && (
                  <button
                    className="secondary-btn"
                    onClick={() => handleRead(item._id)}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;