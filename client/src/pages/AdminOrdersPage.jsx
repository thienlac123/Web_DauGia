import { useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#050a18", // Màu nền tối đồng bộ trang chủ
    minHeight: "100vh",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "40px",
    background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)", // Gradient khác biệt cho Admin
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  cardTitle: {
    fontSize: "1.3rem",
    color: "#fff",
    marginBottom: "20px",
    fontWeight: "700",
    lineHeight: "1.4",
  },
  infoSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "0.95rem",
  },
  label: {
    color: "#94a3b8", // Màu xám nhạt cho label
  },
  value: {
    color: "#f8fafc",
    fontWeight: "500",
  },
  priceTag: {
    fontSize: "1.2rem",
    color: "#10b981", // Màu xanh lá cho giá tiền
    fontWeight: "bold",
    textAlign: "right",
    marginTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: "15px",
  },
  badge: {
    padding: "5px 14px",
    borderRadius: "30px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    position: "absolute",
    top: "20px",
    right: "20px",
  }
};

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
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Đang quét dữ liệu hệ thống...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Hệ Thống Quản Lý Đơn Hàng</h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>Hệ thống chưa ghi nhận đơn hàng nào.</p>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.badge}>{order.status}</div>
              
              <h3 style={styles.cardTitle}>{order.auctionId?.title || "Sản phẩm đấu giá"}</h3>

              <div style={styles.infoSection}>
                <span style={styles.label}>Người mua (Buyer):</span>
                <span style={{...styles.value, color: "#38bdf8"}}>{order.buyerId?.fullName || order.buyerId?.name}</span>
              </div>

              <div style={styles.infoSection}>
                <span style={styles.label}>Người bán (Seller):</span>
                <span style={{...styles.value, color: "#fbbf24"}}>{order.sellerId?.fullName || order.sellerId?.name}</span>
              </div>

              <div style={styles.infoSection}>
                <span style={styles.label}>Hình thức bàn giao:</span>
                <span style={styles.value}>{order.handoverMethod || "Chưa xác định"}</span>
              </div>

              <div style={styles.priceTag}>
                {order.finalPrice?.toLocaleString("vi-VN")} <span style={{fontSize: '0.8rem'}}>VND</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;