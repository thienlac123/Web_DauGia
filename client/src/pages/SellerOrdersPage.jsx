import { useEffect, useState } from "react";
import {
  getSellerOrders,
  prepareOrder,
  shipOrder,
  scheduleMeetup,
} from "../services/orderService";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const data = await getSellerOrders(token);
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Không tải được đơn seller");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrepare = async (orderId) => {
    try {
      await prepareOrder(orderId, { handoverMethod: "SHIPPING" }, token);
      alert("Đã xác nhận chuẩn bị hàng");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleShip = async (orderId) => {
    const carrier = prompt("Nhập đơn vị vận chuyển:");
    const trackingCode = prompt("Nhập mã vận đơn:");

    if (!carrier || !trackingCode) return;

    try {
      await shipOrder(orderId, { carrier, trackingCode }, token);
      alert("Đã cập nhật giao hàng");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật giao hàng thất bại");
    }
  };

  const handleMeetup = async (orderId) => {
    const meetupLocation = prompt("Nhập địa điểm bàn giao:");
    const meetupTime = prompt("Nhập thời gian bàn giao (VD: 2026-03-30T14:00:00):");

    if (!meetupLocation || !meetupTime) return;

    try {
      await scheduleMeetup(orderId, { meetupLocation, meetupTime }, token);
      alert("Đã lên lịch bàn giao");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Lên lịch thất bại");
    }
  };

  if (loading) return <h2>Đang tải đơn hàng seller...</h2>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý bàn giao</h1>

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
              <p><strong>Người mua:</strong> {order.buyerId?.fullName || order.buyerId?.name}</p>
              <p><strong>Email:</strong> {order.buyerId?.email}</p>
              <p><strong>SĐT:</strong> {order.buyerId?.phone || "Chưa có"}</p>

              {order.status === "PAID" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => handlePrepare(order._id)}>
                    Chuẩn bị hàng
                  </button>
                  <button onClick={() => handleShip(order._id)}>
                    Giao qua vận chuyển
                  </button>
                  <button onClick={() => handleMeetup(order._id)}>
                    Hẹn giao trực tiếp
                  </button>
                </div>
              )}

              {order.status === "PREPARING_HANDOVER" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => handleShip(order._id)}>
                    Nhập vận đơn
                  </button>
                  <button onClick={() => handleMeetup(order._id)}>
                    Hẹn bàn giao
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerOrdersPage;