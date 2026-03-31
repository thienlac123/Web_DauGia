import { useEffect, useState } from "react";
import {
  getSellerOrders,
  prepareOrder,
  shipOrder,
  scheduleMeetup,
} from "../services/orderService";

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
    background: "linear-gradient(90deg, #38bdf8 0%, #2dd4bf 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    color: "#38bdf8",
    marginBottom: "16px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
  infoText: { margin: "8px 0", color: "#94a3b8", fontSize: "0.95rem" },
  price: { fontSize: "1.2rem", fontWeight: "bold", color: "#fbbf24" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" },
  btnPrimary: {
    padding: "10px 16px", borderRadius: "10px", border: "none",
    background: "#38bdf8", color: "#0f172a", fontWeight: "bold", cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 16px", borderRadius: "10px",
    border: "1px solid rgba(56, 189, 248, 0.5)", background: "transparent",
    color: "#38bdf8", fontWeight: "bold", cursor: "pointer",
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

  useEffect(() => { fetchOrders(); }, []);

  // Hàm chuẩn bị hàng (Gán mặc định là SHIPPING)
  const handlePrepare = async (orderId) => {
    if (!window.confirm("Xác nhận bạn đã chuẩn bị xong hàng?")) return;
    try {
      await prepareOrder(orderId, { handoverMethod: "SHIPPING" }, token);
      alert("Đã chuyển trạng thái sang Chờ bàn giao");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  // Hàm giao vận chuyển với ví dụ cụ thể
  const handleShip = async (orderId) => {
    const carrier = prompt("Nhập đơn vị vận chuyển (VD: GHTK, Viettel Post, GHN):", "GHTK");
    const trackingCode = prompt("Nhập mã vận đơn (VD: S210.G1.A123456789):");

    if (!carrier || !trackingCode) {
      alert("Vui lòng nhập đầy đủ thông tin vận đơn!");
      return;
    }

    try {
      await shipOrder(orderId, { carrier, trackingCode }, token);
      alert("Cập nhật vận đơn thành công!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  // Hàm hẹn gặp với ví dụ thời gian chuẩn ISO
  const handleMeetup = async (orderId) => {
    const now = new Date();
    const suggestTime = now.toISOString().slice(0, 16); // Lấy YYYY-MM-DDTHH:mm

    const meetupLocation = prompt(
      "Nhập địa điểm bàn giao (VD: 268 Lý Thường Kiệt, P14, Q10, TP.HCM):", 
      "Tại sảnh chính tòa nhà..."
    );
    const meetupTime = prompt(
      "Nhập thời gian (Định dạng: Năm-Tháng-NgàyTHiờ:Phút):", 
      `${suggestTime}`
    );

    if (!meetupLocation || !meetupTime) {
      alert("Vui lòng nhập đủ địa điểm và thời gian hẹn!");
      return;
    }

    try {
      await scheduleMeetup(orderId, { meetupLocation, meetupTime }, token);
      alert("Đã lên lịch hẹn bàn giao!");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Lên lịch thất bại");
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center" }}>Đang quét danh sách đơn hàng...</h2>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Quản Lý Bàn Giao & Vận Chuyển</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p style={{ color: "#64748b" }}>Chưa có đơn hàng nào cần xử lý.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.statusBadge}>{order.status}</div>
              
              <h3 style={{ marginBottom: "12px", color: "#fff", fontSize: "1.1rem" }}>
                {order.auctionId?.title || "Sản phẩm đấu giá"}
              </h3>
              
              <p style={styles.infoText}>
                Giá chốt: <span style={styles.price}>{order.finalPrice?.toLocaleString("vi-VN")} VND</span>
              </p>
              
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "15px", paddingTop: "15px" }}>
                <p style={styles.infoText}>👤 <strong>Người mua:</strong> {order.buyerId?.fullName || order.buyerId?.name}</p>
                <p style={styles.infoText}>📧 <strong>Email:</strong> {order.buyerId?.email}</p>
                <p style={styles.infoText}>📞 <strong>SĐT:</strong> {order.buyerId?.phone || "Chưa cung cấp"}</p>
              </div>

              {/* KHỐI HÀNH ĐỘNG TÙY THEO TRẠNG THÁI */}
              <div style={styles.buttonGroup}>
                {order.status === "PAID" && (
                  <>
                    <button style={styles.btnPrimary} onClick={() => handlePrepare(order._id)}>
                      📦 Chuẩn bị hàng
                    </button>
                    <button style={styles.btnSecondary} onClick={() => handleShip(order._id)}>
                      🚚 Giao bưu cục
                    </button>
                    <button style={styles.btnSecondary} onClick={() => handleMeetup(order._id)}>
                      🤝 Hẹn gặp mặt
                    </button>
                  </>
                )}

                {order.status === "PREPARING_HANDOVER" && (
                  <>
                    <button style={{...styles.btnPrimary, background: "#fbbf24"}} onClick={() => handleShip(order._id)}>
                      📝 Nhập mã vận đơn
                    </button>
                    <button style={styles.btnSecondary} onClick={() => handleMeetup(order._id)}>
                      📅 Đặt lịch hẹn mới
                    </button>
                  </>
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