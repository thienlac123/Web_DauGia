import { useEffect, useState } from "react";
import {
  getSellerOrders,
  prepareOrder,
  shipOrder,
  scheduleMeetup,
} from "../services/orderService";

// Styled components giả lập qua object style để bạn dễ copy-paste
const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#050a18", // Tông màu nền tối như ảnh
    minHeight: "100vh",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
    background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)", // Hiệu ứng glassmorphism nhẹ
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "24px",
    transition: "transform 0.3s ease",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
  title: {
    fontSize: "1.25rem",
    color: "#00f2fe",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "12px",
  },
  infoText: {
    fontSize: "0.95rem",
    margin: "8px 0",
    color: "#cbd5e1",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    backgroundColor: "#1e293b",
    color: "#38bdf8",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
    transition: "all 0.2s",
    backgroundColor: "#38bdf8",
    color: "#0f172a",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
  }
};

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Các hàm xử lý giữ nguyên logic của bạn
  const handlePrepare = async (orderId) => {
    try {
      await prepareOrder(orderId, { handoverMethod: "SHIPPING" }, token);
      alert("Đã xác nhận chuẩn bị hàng");
      fetchOrders();
    } catch (error) { alert("Lỗi!"); }
  };

  const handleShip = async (orderId) => {
    const carrier = prompt("Nhập đơn vị vận chuyển:");
    const trackingCode = prompt("Nhập mã vận đơn:");
    if (!carrier || !trackingCode) return;
    try {
      await shipOrder(orderId, { carrier, trackingCode }, token);
      fetchOrders();
    } catch (error) { alert("Lỗi!"); }
  };

  const handleMeetup = async (orderId) => {
    const meetupLocation = prompt("Nhập địa điểm bàn giao:");
    const meetupTime = prompt("Nhập thời gian bàn giao:");
    if (!meetupLocation || !meetupTime) return;
    try {
      await scheduleMeetup(orderId, { meetupLocation, meetupTime }, token);
      fetchOrders();
    } catch (error) { alert("Lỗi!"); }
  };

  if (loading) return <div style={styles.container}><h2>Đang tải...</h2></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Quản Lý Bàn Giao Đơn Hàng</h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>Chưa có đơn hàng nào.</p>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card} className="order-card">
              <div style={styles.statusBadge}>{order.status}</div>
              <h3 style={styles.title}>{order.auctionId?.title}</h3>
              
              <p style={styles.infoText}>
                <strong>Giá trúng:</strong> <span style={{color: '#fbbf24'}}>{order.finalPrice?.toLocaleString("vi-VN")} VND</span>
              </p>
              <p style={styles.infoText}><strong>Người mua:</strong> {order.buyerId?.fullName || order.buyerId?.name}</p>
              <p style={styles.infoText}><strong>Email:</strong> {order.buyerId?.email}</p>
              <p style={styles.infoText}><strong>SĐT:</strong> {order.buyerId?.phone || "N/A"}</p>

              <div style={styles.buttonGroup}>
                {order.status === "PAID" && (
                  <>
                    <button style={styles.button} onClick={() => handlePrepare(order._id)}>Chuẩn bị hàng</button>
                    <button style={{...styles.button, ...styles.buttonSecondary}} onClick={() => handleShip(order._id)}>Giao vận chuyển</button>
                  </>
                )}
                {(order.status === "PAID" || order.status === "PREPARING_HANDOVER") && (
                   <button style={{...styles.button, ...styles.buttonSecondary}} onClick={() => handleMeetup(order._id)}>Hẹn trực tiếp</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerOrdersPage;