import { useEffect, useState } from "react";
import { getMyOrders, confirmDelivered } from "../services/orderService";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders(token);
      setOrders(data.orders || []);
    } catch (error) {
      alert(error.response?.data?.message || "Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmDelivered = async (orderId) => {
    try {
      await confirmDelivered(orderId, token);
      alert("Đã xác nhận nhận hàng");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Xác nhận thất bại");
    }
  };

  if (loading) return <h2>Đang tải đơn hàng...</h2>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                background: "#fff",
              }}
            >
              <h3>{order.auctionId?.title}</h3>
              <p><strong>Giá trúng:</strong> {order.finalPrice?.toLocaleString("vi-VN")} VND</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <p><strong>Người bán:</strong> {order.sellerId?.fullName || order.sellerId?.name}</p>
              <p><strong>Hình thức bàn giao:</strong> {order.handoverMethod}</p>

              {order.handoverMethod === "SHIPPING" && (
                <>
                  <p><strong>Đơn vị vận chuyển:</strong> {order.carrier || "Chưa có"}</p>
                  <p><strong>Mã vận đơn:</strong> {order.trackingCode || "Chưa có"}</p>
                </>
              )}

              {order.handoverMethod === "MEETUP" && (
                <>
                  <p><strong>Địa điểm hẹn:</strong> {order.meetupLocation || "Chưa có"}</p>
                  <p>
                    <strong>Thời gian hẹn:</strong>{" "}
                    {order.meetupTime
                      ? new Date(order.meetupTime).toLocaleString("vi-VN")
                      : "Chưa có"}
                  </p>
                </>
              )}

              {["PAID", "PREPARING_HANDOVER", "SHIPPING", "HANDOVER_SCHEDULED"].includes(order.status) && (
                <button onClick={() => handleConfirmDelivered(order._id)}>
                  Đã nhận hàng
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;