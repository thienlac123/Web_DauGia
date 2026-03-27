import { useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders(token);
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Không tải được danh sách order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <h2>Đang tải danh sách order...</h2>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý đơn hàng</h1>

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
              <p><strong>Buyer:</strong> {order.buyerId?.fullName || order.buyerId?.name}</p>
              <p><strong>Seller:</strong> {order.sellerId?.fullName || order.sellerId?.name}</p>
              <p><strong>Giá:</strong> {order.finalPrice?.toLocaleString("vi-VN")} VND</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <p><strong>Hình thức:</strong> {order.handoverMethod}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;