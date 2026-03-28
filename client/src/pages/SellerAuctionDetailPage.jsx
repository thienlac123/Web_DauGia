import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSellerAuctionDetail } from "../services/userService";
import { getAuctionBids } from "../services/auctionService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#050a18",
    minHeight: "100vh",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
  },
  contentWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  // Header section
  headerAction: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  // Stat Cards
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center",
  },
  // Main Content
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "30px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "24px",
  },
  imageGallery: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  mainImg: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "16px",
  },
  sideImgs: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  smallImg: {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    borderRadius: "16px",
  },
  badge: (type) => ({
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    backgroundColor: type === "approved" ? "#10b98122" : "#f59e0b22",
    color: type === "approved" ? "#10b981" : "#f59e0b",
    border: `1px solid ${type === "approved" ? "#10b98144" : "#f59e0b44"}`,
  }),
  priceText: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#38bdf8",
    margin: "10px 0",
  },
  bidRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  }
};

function SellerAuctionDetailPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSellerAuctionDetail(id, token);
        setAuction(res.auction);
        if (res.auction.approvalStatus === "approved") {
          const bRes = await getAuctionBids(id);
          setBids(bRes.bids || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, token]);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div style={styles.container}><h2>Đang khởi tạo dữ liệu...</h2></div>;
  if (!auction) return <div style={styles.container}><h2>Không tìm thấy phiên đấu giá.</h2></div>;

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        
        {/* TOP BAR */}
        <div style={styles.headerAction}>
          <div>
            <span style={styles.badge(auction.approvalStatus)}>{auction.approvalStatus}</span>
            <h1 style={{ marginTop: "10px", fontSize: "1.8rem" }}>Quản lý: {auction.title}</h1>
          </div>
          {auction.approvalStatus === "approved" && (
            <Link to={`/auctions/${auction._id}`}>
              <button style={{ 
                padding: "12px 24px", borderRadius: "12px", border: "none", 
                background: "#38bdf8", color: "#000", fontWeight: "bold", cursor: "pointer" 
              }}>Xem trang công khai</button>
            </Link>
          )}
        </div>

        {/* QUICK STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Giá hiện tại</p>
            <p style={styles.priceText}>{auction.currentPrice?.toLocaleString()} <small style={{fontSize: '0.9rem'}}>VND</small></p>
          </div>
          <div style={styles.statCard}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Thời gian còn lại</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f43f5e", marginTop: "10px" }}>
              {auction.status === "ended" ? "Hết giờ" : getRemainingTime(auction.endTime)}
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Lượt đặt giá</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10px" }}>{bids.length} lượt</p>
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* LEFT: IMAGES & INFO */}
          <div>
            <div style={styles.card}>
              <div style={styles.imageGallery}>
                <img src={auction.images[0]} style={styles.mainImg} alt="main" />
                <div style={styles.sideImgs}>
                  {auction.images.slice(1, 3).map((img, i) => (
                    <img key={i} src={img} style={styles.smallImg} alt="sub" />
                  ))}
                </div>
              </div>
              <h3 style={{ color: "#38bdf8", marginBottom: "15px" }}>Chi tiết sản phẩm</h3>
              <p style={{ color: "#cbd5e1", lineHeight: "1.6" }}>{auction.description}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px", color: "#94a3b8" }}>
                <p>📍 {auction.location}</p>
                <p>📦 {auction.condition}</p>
                <p>🏷️ {auction.category}</p>
                <p>📉 Bước giá: {auction.minBidStep?.toLocaleString()} VND</p>
              </div>
            </div>
          </div>

          {/* RIGHT: BIDS & WINNER */}
          <div>
            {auction.status === "ended" && auction.winnerId && (
              <div style={{ ...styles.card, border: "1px solid #10b981", background: "#10b98105" }}>
                <h3 style={{ color: "#10b981", marginBottom: "15px" }}>🏆 Người chiến thắng</h3>
                <p style={{ fontWeight: "bold" }}>{auction.winnerId.name}</p>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{auction.winnerId.email}</p>
                <div style={{ marginTop: "15px", padding: "10px", borderRadius: "10px", background: "#ffffff05" }}>
                  Thanh toán: <span style={{ color: auction.paymentStatus === "paid" ? "#10b981" : "#f59e0b" }}>{auction.paymentStatus}</span>
                </div>
              </div>
            )}

            <div style={styles.card}>
              <h3 style={{ marginBottom: "20px" }}>Lịch sử đặt giá</h3>
              <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "10px" }}>
                {bids.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center" }}>Chưa có dữ liệu</p>
                ) : (
                  bids.map((bid, i) => (
                    <div key={bid._id} style={styles.bidRow}>
                      <div>
                        <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>{bid.userId?.name}</p>
                        <p style={{ fontSize: "0.7rem", color: "#64748b" }}>{new Date(bid.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <p style={{ color: i === 0 ? "#38bdf8" : "#fff", fontWeight: "bold" }}>
                        {bid.bidAmount?.toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAuctionDetailPage;