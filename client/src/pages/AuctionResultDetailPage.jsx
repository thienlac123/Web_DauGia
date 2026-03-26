import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionResultById, payAuction } from "../services/auctionService";

function AuctionResultDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bổ sung các state mới
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getAuctionResultById(id);
        setResult(data.result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  // Bổ sung hàm handlePay
  const handlePay = async () => {
    try {
      await payAuction(result._id, token);
      setMessage("Thanh toán thành công");
      // Load lại dữ liệu để cập nhật trạng thái paymentStatus mới từ server
      const data = await getAuctionResultById(id);
      setResult(data.result);
    } catch (error) {
      setMessage(error.response?.data?.message || "Thanh toán thất bại");
    }
  };

  if (loading) return <h2>Đang tải chi tiết kết quả...</h2>;
  if (!result) return <h2>Không tìm thấy kết quả đấu giá</h2>;

  return (
    <div>
      <div className="detail-card">
        <h1 className="page-title">{result.title}</h1>
        <p className="page-subtitle">{result.description}</p>

        {result.images && result.images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {result.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${result.title}-${index}`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>
        )}

        <p>
          <strong>Danh mục:</strong> {result.category || "Khác"}
        </p>
        <p>
          <strong>Địa điểm:</strong> {result.location || "Chưa cập nhật"}
        </p>
        <p>
          <strong>Tình trạng:</strong> {result.condition || "Chưa cập nhật"}
        </p>
        <p>
          <strong>Người bán:</strong>{" "}
          {result.sellerId
            ? `${result.sellerId.name} - ${result.sellerId.email}`
            : "Không có"}
        </p>
        <p>
          <strong>Người thắng:</strong>{" "}
          {result.winner
            ? `${result.winner.name} - ${result.winner.email}`
            : "Không có"}
        </p>

        {/* Bổ sung trạng thái thanh toán */}
        <p>
          <strong>Trạng thái thanh toán:</strong>{" "}
          {result.paymentStatus === "paid"
            ? "Đã thanh toán"
            : result.paymentStatus === "pending"
            ? "Chờ thanh toán"
            : "Chưa thanh toán"}
        </p>

        <p>
          <strong>Giá cuối:</strong>{" "}
          {result.finalPrice?.toLocaleString("vi-VN")} VND
        </p>
        <p>
          <strong>Số lượt bid:</strong> {result.bidCount}
        </p>
        <p>
          <strong>Thời gian kết thúc:</strong>{" "}
          {new Date(result.endTime).toLocaleString("vi-VN")}
        </p>

        {/* Bổ sung nút thanh toán và thông báo */}
        {result.winner && result.winner._id === userId && result.paymentStatus !== "paid" && (
          <div style={{ marginTop: "16px" }}>
            <button className="primary-btn" onClick={handlePay}>
              Thanh toán ngay
            </button>
          </div>
        )}

        {message && (
          <p 
            className="info-message" 
            style={{ marginTop: "10px", color: message.includes("thành công") ? "green" : "red" }}
          >
            {message}
          </p>
        )}
      </div>

      <div className="detail-card">
        <h2 className="detail-section-title">Lịch sử đặt giá</h2>
        {result.bids.length === 0 ? (
          <p>Không có lịch sử đặt giá.</p>
        ) : (
          <div className="bid-list">
            {result.bids.map((bid) => (
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

export default AuctionResultDetailPage;