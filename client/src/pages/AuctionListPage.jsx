import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllAuctions } from "../services/auctionService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  const [, setTick] = useState(0);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (sort) params.sort = sort;

      const data = await getAllAuctions(params);
      setAuctions(data.auctions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi tải danh sách đấu giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAuctions();
  };

  const getStatusClass = (auctionStatus) => {
    if (auctionStatus === "active") return "status-badge status-active";
    if (auctionStatus === "upcoming") return "status-badge status-upcoming";
    if (auctionStatus === "ended") return "status-badge status-ended";
    return "status-badge status-cancelled";
  };

  if (loading) return <h2>Đang tải danh sách phiên đấu giá...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className="hero-banner">
        <h1>Danh sách sản phẩm đấu giá</h1>
        <p>Tìm kiếm, lọc theo trạng thái và theo dõi các phiên đấu giá.</p>
      </div>

      <div className="detail-card">
        <form onSubmit={handleFilter} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            className="input-inline"
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input-inline"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "220px" }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang diễn ra</option>
            <option value="upcoming">Sắp tới</option>
            <option value="ended">Đã kết thúc</option>
          </select>

          <select
            className="input-inline"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: "220px" }}
          >
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="oldest">Cũ nhất</option>
          </select>

          <button className="primary-btn" type="submit">Lọc</button>
        </form>
      </div>

      {auctions.length === 0 ? (
        <div className="detail-card">
          <p>Không có phiên đấu giá phù hợp.</p>
        </div>
      ) : (
        <div className="auction-grid">
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              <span className={getStatusClass(auction.status)}>
                {getStatusLabel(auction.status)}
              </span>

              {/* HIỂN THỊ ẢNH ĐẦU TIÊN */}
              {auction.images && auction.images.length > 0 ? (
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    marginTop: "12px",
                  }}
                />
              ) : (
                <div style={{ width: "100%", height: "200px", background: "#e2e8f0", borderRadius: "12px", marginBottom: "12px", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontWeight: "600" }}>
                  Không có ảnh
                </div>
              )}

              <h2>{auction.title}</h2>

              <p className="muted-text">{auction.description || "Không có mô tả"}</p>

              {/* THÊM DANH MỤC Ở ĐÂY */}
              <p>
                <strong>Danh mục:</strong> {auction.category || "Khác"}
              </p>

              <p>
                <strong>Giá hiện tại:</strong>{" "}
                {auction.currentPrice?.toLocaleString("vi-VN")} VND
              </p>

              <p>
                <strong>Người bán:</strong> {auction.sellerId?.name || "N/A"}
              </p>

              <p>
                <strong>Kết thúc:</strong> {new Date(auction.endTime).toLocaleString("vi-VN")}
              </p>

              <p>
                <strong>Thời gian còn lại:</strong>{" "}
                {auction.status === "ended" ? "Đã kết thúc" : getRemainingTime(auction.endTime)}
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