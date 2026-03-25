import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellerAuctions } from "../services/userService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function SellerDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchSellerAuctions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Bạn cần đăng nhập");
          setLoading(false);
          return;
        }

        const data = await getSellerAuctions(token);
        setAuctions(data.auctions || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải danh sách phiên đã tạo"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    if (status === "active") return "status-badge status-active";
    if (status === "upcoming") return "status-badge status-upcoming";
    if (status === "ended") return "status-badge status-ended";
    return "status-badge status-cancelled";
  };

  if (loading) return <h2>Đang tải dashboard người tạo...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 className="page-title">Dashboard người tạo phiên đấu giá</h1>
          <p className="page-subtitle">
            Quản lý các phiên đấu giá bạn đã tạo trên hệ thống.
          </p>
        </div>

        <Link to="/create-auction">
          <button className="primary-btn">Tạo phiên mới</button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="detail-card">
          <p>Bạn chưa tạo phiên đấu giá nào.</p>
        </div>
      ) : (
        <div className="auction-grid">
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              <span className={getStatusClass(auction.status)}>
                {getStatusLabel(auction.status)}
              </span>

              {/* --- PHẦN 1: THÊM ẢNH SẢN PHẨM --- */}
              {auction.images && auction.images.length > 0 ? (
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    marginTop: "12px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "#e2e8f0",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#475569",
                  }}
                >
                  Không có ảnh
                </div>
              )}

              <h2>{auction.title}</h2>

              <p className="muted-text">{auction.description || "Không có mô tả"}</p>

              {/* --- PHẦN 2: THÊM DANH MỤC --- */}
              <p>
                <strong>Danh mục:</strong> {auction.category || "Khác"}
              </p>

              {/* --- PHẦN TRẠNG THÁI DUYỆT CỦA BẠN --- */}
              <p>
                <strong>Trạng thái duyệt:</strong>{" "}
                {auction.approvalStatus === "pending"
                  ? "Chờ duyệt"
                  : auction.approvalStatus === "approved"
                  ? "Đã duyệt"
                  : "Bị từ chối"}
              </p>

              {auction.approvalStatus === "rejected" && auction.approvalNote && (
                <p>
                  <strong style={{ color: "red" }}>Lý do từ chối:</strong> {auction.approvalNote}
                </p>
              )}

              <p>
                <strong>Giá hiện tại:</strong>{" "}
                {auction.currentPrice?.toLocaleString("vi-VN")} VND
              </p>

              <p>
                <strong>Bước giá:</strong>{" "}
                {auction.minBidStep?.toLocaleString("vi-VN")} VND
              </p>

              <p>
                <strong>Người dẫn đầu:</strong>{" "}
                {auction.highestBidderId
                  ? auction.highestBidderId.name
                  : "Chưa có"}
              </p>

              <p>
                <strong>Kết thúc:</strong>{" "}
                {new Date(auction.endTime).toLocaleString("vi-VN")}
              </p>

              <p>
                <strong>Thời gian còn lại:</strong>{" "}
                {auction.status === "ended"
                  ? "Đã kết thúc"
                  : getRemainingTime(auction.endTime)}
              </p>

              <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                <Link to={`/seller/auctions/${auction._id}`}>
                  <button className="secondary-btn">Xem quản lý</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerDashboardPage;