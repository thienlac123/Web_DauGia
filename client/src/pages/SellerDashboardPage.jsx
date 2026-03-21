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

              <h2>{auction.title}</h2>

              <p className="muted-text">{auction.description || "Không có mô tả"}</p>

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
                <Link to={`/auctions/${auction._id}`}>
                  <button className="secondary-btn">Xem chi tiết</button>
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