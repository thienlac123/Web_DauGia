import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSellerAuctionDetail } from "../services/userService";
import { getAuctionBids } from "../services/auctionService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function SellerAuctionDetailPage() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionRes = await getSellerAuctionDetail(id, token);
        setAuction(auctionRes.auction);

        if (auctionRes.auction.approvalStatus === "approved") {
          const bidsRes = await getAuctionBids(id);
          setBids(bidsRes.bids || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <h2>Đang tải chi tiết quản lý...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!auction) return <h2>Không tìm thấy phiên đấu giá</h2>;

  return (
    <div>
      {/* --- PHẦN 1: GALLERY HÌNH ẢNH --- */}
      <div className="detail-card">
        <h2 className="detail-section-title">Hình ảnh sản phẩm</h2>

        {auction.images && auction.images.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {auction.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${auction.title}-${index}`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>
        ) : (
          <p>Chưa có hình ảnh sản phẩm.</p>
        )}
      </div>

      {/* --- PHẦN 2: THÔNG TIN CHI TIẾT --- */}
      <div className="detail-card">
        <h1 className="page-title">{auction.title}</h1>
        <p className="page-subtitle">{auction.description}</p>

        <div style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <p>
            <strong>Danh mục:</strong> {auction.category || "Khác"}
          </p>
          <p>
            <strong>Địa điểm:</strong> {auction.location || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Tình trạng:</strong> {auction.condition || "Chưa cập nhật"}
          </p>
        </div>

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
          <strong>Trạng thái đấu giá:</strong> {getStatusLabel(auction.status)}
        </p>

        <p>
          <strong>Giá hiện tại:</strong>{" "}
          {auction.currentPrice?.toLocaleString("vi-VN")} VND
        </p>

        <p>
          <strong>Giá khởi điểm:</strong>{" "}
          {auction.startPrice?.toLocaleString("vi-VN")} VND
        </p>

        <p>
          <strong>Bước giá tối thiểu:</strong>{" "}
          {auction.minBidStep?.toLocaleString("vi-VN")} VND
        </p>

        <p>
          <strong>Người dẫn đầu:</strong>{" "}
          {auction.highestBidderId
            ? `${auction.highestBidderId.name} - ${auction.highestBidderId.email}`
            : "Chưa có"}
        </p>

        <p>
          <strong>Thời gian còn lại:</strong>{" "}
          {auction.status === "ended"
            ? "Đã kết thúc"
            : getRemainingTime(auction.endTime)}
        </p>

        {/* BẮT ĐẦU PHẦN BỔ SUNG */}
        {auction.status === "ended" && (
          <div style={{ marginTop: "10px", padding: "10px", borderTop: "1px dashed #ccc" }}>
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
              <strong>Trạng thái thanh toán:</strong>{" "}
              {auction.paymentStatus === "paid"
                ? "Đã thanh toán"
                : auction.paymentStatus === "pending"
                ? "Chờ thanh toán"
                : "Chưa thanh toán"}
            </p>
          </div>
        )}
        {/* KẾT THÚC PHẦN BỔ SUNG */}

        {auction.approvalStatus === "approved" && (
          <div style={{ marginTop: "16px" }}>
            <Link to={`/auctions/${auction._id}`}>
              <button className="primary-btn">Xem trang công khai</button>
            </Link>
          </div>
        )}
      </div>

      {/* --- PHẦN 3: LỊCH SỬ ĐẶT GIÁ --- */}
      <div className="detail-card">
        <h2 className="detail-section-title">Lịch sử đặt giá</h2>

        {auction.approvalStatus !== "approved" ? (
          <p>Phiên đấu giá chưa được duyệt công khai nên chưa hiển thị lịch sử đấu giá.</p>
        ) : bids.length === 0 ? (
          <p>Chưa có lượt đặt giá nào.</p>
        ) : (
          <div className="bid-list">
            {bids.map((bid) => (
              <div key={bid._id} className="bid-item">
                <p>
                  <strong>Người đặt:</strong> {bid.userId?.name} - {bid.userId?.email}
                </p>
                <p>
                  <strong>Số tiền:</strong>{" "}
                  {bid.bidAmount?.toLocaleString("vi-VN")} VND
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {new Date(bid.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerAuctionDetailPage;