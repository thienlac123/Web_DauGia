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

  const getNotificationIcon = (title) => {
    if (title.includes("duyệt")) return "✅";
    if (title.includes("bid")) return "🏷️";
    if (title.includes("thanh toán")) return "💰";
    if (title.includes("kết thúc")) return "🏁";
    return "📢";
  };

  const getNotificationBadgeClass = (isRead) => {
    if (isRead) {
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black uppercase tracking-widest text-white italic">Thông báo</h1>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          <p className="text-slate-400 font-medium">Tất cả thông báo</p>
        </div>

        {/* Notifications Container */}
        {notifications.length === 0 ? (
          <div className="py-20 text-center bg-[#0f172a]/40 border-2 border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-300 font-bold text-lg uppercase tracking-wide">Bạn chưa có thông báo nào.</p>
            <p className="text-slate-500 mt-2">Tất cả thông báo sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-white/20 backdrop-blur-sm ${
                  item.isRead ? "opacity-70" : "opacity-100 border-blue-500/30"
                }`}
              >
                {/* Status Badge */}
                {!item.isRead && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
                      🔔 Mới
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-2xl border border-white/10">
                    {getNotificationIcon(item.title)}
                  </div>

                  {/* Message */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 mb-3 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs text-slate-500 font-medium">
                        ⏰ {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </p>
                      {!item.isRead && (
                        <button
                          onClick={() => handleRead(item._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm uppercase tracking-wider shadow-lg hover:shadow-blue-500/30"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;