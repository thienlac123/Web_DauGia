import { useEffect, useState } from "react";
import { getMyOrders, confirmDelivered } from "../services/orderService";

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#050a18",
    minHeight: "100vh",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    color: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "24px",
    position: "relative",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    backgroundColor: "#38bdf822",
    color: "#38bdf8",
    display: "inline-block",
    marginBottom: "16px",
  },
  productTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#f8fafc",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "0.9rem",
    borderBottom: "1px style dashed rgba(255,255,255,0.05)",
    paddingBottom: "4px",
  },
  label: { color: "#94a3b8" },
  value: { color: "#cbd5e1", fontWeight: "500" },
  methodBox: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    fontSize: "0.85rem",
    borderLeft: "4px solid #38bdf8",
  },
  confirmBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

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

  useEffect(() => { fetchOrders(); }, []);

  const handleConfirmDelivered = async (orderId) => {
    if (!window.confirm("Bạn xác nhận đã nhận được hàng và hài lòng với sản phẩm?")) return;
    try {
      await confirmDelivered(orderId, token);
      alert("Xác nhận thành công!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Xác nhận thất bại");
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Đang tải đơn hàng của bạn...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Đơn Hàng Của Tôi</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p style={{ color: "#64748b" }}>Bạn chưa tham gia đấu giá thành công đơn hàng nào.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.statusBadge}>{order.status}</div>
              <h3 style={styles.productTitle}>{order.auctionId?.title}</h3>

              <div style={styles.detailRow}>
                <span style={styles.label}>Giá trúng:</span>
                <span style={{ ...styles.value, color: "#fbbf24", fontSize: "1.1rem" }}>
                  {order.finalPrice?.toLocaleString("vi-VN")} VND
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.label}>Người bán:</span>
                <span style={styles.value}>{order.sellerId?.fullName || order.sellerId?.name}</span>
              </div>

              {/* Thông tin nhận hàng tùy biến theo phương thức */}
              <div style={styles.methodBox}>
                <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#38bdf8" }}>
                  {order.handoverMethod === "SHIPPING" ? "🚚 Giao hàng qua bưu cục" : "🤝 Hẹn gặp trực tiếp"}
                </div>
                
                {order.handoverMethod === "SHIPPING" ? (
                  <>
                    <div>ĐVVC: {order.carrier || "Chờ cập nhật..."}</div>
                    <div>Mã vận đơn: {order.trackingCode || "Chờ cập nhật..."}</div>
                  </>
                ) : (
                  <>
                    <div>Địa điểm: {order.meetupLocation || "Chờ người bán hẹn..."}</div>
                    <div>Thời gian: {order.meetupTime ? new Date(order.meetupTime).toLocaleString("vi-VN") : "Chờ cập nhật..."}</div>
                  </>
                )}
              </div>

              {["PAID", "PREPARING_HANDOVER", "SHIPPING", "HANDOVER_SCHEDULED"].includes(order.status) && (
                <button 
                  style={styles.confirmBtn}
                  onClick={() => handleConfirmDelivered(order._id)}
                  onMouseOver={(e) => e.target.style.filter = "brightness(1.1)"}
                  onMouseOut={(e) => e.target.style.filter = "brightness(1)"}
                >
                  Xác nhận đã nhận hàng
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