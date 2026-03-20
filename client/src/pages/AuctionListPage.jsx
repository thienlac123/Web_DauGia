import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllAuctions } from "../services/auctionService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAllAuctions();
        setAuctions(data.auctions || []);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi tải danh sách đấu giá");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
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

  if (loading) return <h2>Đang tải danh sách phiên đấu giá...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className="hero-banner">
        <h1>Chào mừng đến với Web Đấu Giá</h1>
        <p>
          Theo dõi các phiên đấu giá đang diễn ra, tham gia trả giá và cập nhật
          thời gian thực.
        </p>
      </div>

      <div className="top-bar">
        <div>
          <h1 className="page-title">Danh sách phiên đấu giá</h1>
          <p className="page-subtitle">
            Khám phá các sản phẩm đang mở đấu giá trên hệ thống.
          </p>
        </div>

        <Link to="/create-auction">
          <button className="primary-btn">Tạo phiên đấu giá</button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <p>Chưa có phiên đấu giá nào.</p>
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
                <strong>Người bán:</strong> {auction.sellerId?.name || "N/A"}
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

              <div style={{ marginTop: "14px" }}>
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

export default AuctionListPage;