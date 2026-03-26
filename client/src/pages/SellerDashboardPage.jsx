import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSellerAuctions,
  getSellerAnalytics,
} from "../services/userService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function SellerDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Bạn cần đăng nhập");
          setLoading(false);
          return;
        }

        const [auctionData, analyticsData] = await Promise.all([
          getSellerAuctions(token),
          getSellerAnalytics(token),
        ]);

        setAuctions(auctionData.auctions || []);
        setAnalytics(analyticsData.analytics || null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải dashboard người tạo"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
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
            Quản lý phiên đấu giá, theo dõi kết quả và doanh thu của bạn.
          </p>
        </div>

        <Link to="/create-auction">
          <button className="primary-btn">Tạo phiên mới</button>
        </Link>
      </div>

      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Tổng số phiên đã tạo</h3>
            <p>{analytics.totalAuctions}</p>
          </div>

          <div className="analytics-card">
            <h3>Số phiên đã duyệt</h3>
            <p>{analytics.approvedAuctions}</p>
          </div>

          <div className="analytics-card">
            <h3>Số phiên đã kết thúc</h3>
            <p>{analytics.endedAuctions}</p>
          </div>

          <div className="analytics-card">
            <h3>Phiên bán thành công</h3>
            <p>{analytics.successfulAuctions}</p>
          </div>

          <div className="analytics-card">
            <h3>Tổng lượt bid nhận được</h3>
            <p>{analytics.totalBids}</p>
          </div>

          <div className="analytics-card">
            <h3>Tổng doanh thu</h3>
            <p>{analytics.totalRevenue?.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>
      )}

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

              <p className="muted-text">
                {auction.description || "Không có mô tả"}
              </p>

              <p>
                <strong>Danh mục:</strong> {auction.category || "Khác"}
              </p>

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
                  <strong>Lý do từ chối:</strong> {auction.approvalNote}
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

              {/* Bắt đầu phần bổ sung */}
              {auction.status === "ended" && (
  <>
    <p>
      <strong>Người chiến thắng:</strong>{" "}
      {auction.winnerId
        ? `${auction.winnerId.name} - ${auction.winnerId.email}`
        : "Không có"}
    </p>

    <p>
      <strong>Giá chốt:</strong>{" "}
      {auction.currentPrice?.toLocaleString("vi-VN")} VND
    </p>

    <p>
      <strong>Thanh toán:</strong>{" "}
      {auction.paymentStatus === "paid"
        ? "Đã thanh toán"
        : auction.paymentStatus === "pending"
        ? "Chờ thanh toán"
        : "Chưa thanh toán"}
    </p>
  </>
)}
              {/* Kết thúc phần bổ sung */}

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