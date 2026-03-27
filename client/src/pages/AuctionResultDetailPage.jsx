import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionResultById } from "../services/auctionService";
import { createVNPayPayment, mockPayment } from "../services/paymentService";
function AuctionResultDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getAuctionResultById(id);
        setResult(data.result);
      } catch (error) {
        console.log(error);
        setMessage("Không tải được chi tiết kết quả đấu giá");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handlePay = async () => {
    try {
      setPaying(true);
      setMessage("");
      const data = await createVNPayPayment(id, token);
      window.location.href = data.paymentUrl;
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tạo được link thanh toán");
    } finally {
      setPaying(false);
    }
  };
  const handleMockPay = async () => {
  try {
    setPaying(true);
    setMessage("");
    await mockPayment(id, token);
    setMessage("Thanh toán demo thành công");
    window.location.reload();
  } catch (error) {
    setMessage(error.response?.data?.message || "Thanh toán demo thất bại");
  } finally {
    setPaying(false);
  }
};

  if (loading) return <h2>Đang tải chi tiết kết quả...</h2>;
  if (!result) return <h2>Không tìm thấy kết quả đấu giá</h2>;

  const isWinner = String(result.winner?._id) === String(userId);
  const canPay = isWinner && result.paymentStatus !== "paid";

  return (
    <div>
      <div className="detail-card">
        <h1 className="page-title">{result.title}</h1>
        <p className="page-subtitle">{result.description}</p>

        {result.images?.length > 0 && (
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

        <p><strong>Danh mục:</strong> {result.category || "Khác"}</p>
        <p><strong>Địa điểm:</strong> {result.location || "Chưa cập nhật"}</p>
        <p><strong>Tình trạng:</strong> {result.condition || "Chưa cập nhật"}</p>
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

        <p>
          <strong>Trạng thái thanh toán:</strong>{" "}
          {result.paymentStatus === "paid"
            ? "Đã thanh toán"
            : result.paymentStatus === "pending"
            ? "Chờ thanh toán"
            : result.paymentStatus === "failed"
            ? "Thanh toán thất bại"
            : "Chưa thanh toán"}
        </p>

        <p>
          <strong>Giá cuối:</strong> {result.finalPrice?.toLocaleString("vi-VN")} VND
        </p>
        <p><strong>Số lượt bid:</strong> {result.bidCount}</p>
        <p>
          <strong>Thời gian kết thúc:</strong>{" "}
          {new Date(result.endTime).toLocaleString("vi-VN")}
        </p>

        {canPay && (
  <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
    <button className="primary-btn" onClick={handlePay} disabled={paying}>
      {paying ? "Đang chuyển sang VNPay..." : "Thanh toán VNPay"}
    </button>

    <button className="primary-btn" onClick={handleMockPay} disabled={paying}>
      {paying ? "Đang xử lý..." : "Thanh toán demo"}
    </button>
  </div>
)}

        {message && (
          <p
            className="info-message"
            style={{
              marginTop: "10px",
              color: message.includes("thành công") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <div className="detail-card">
        <h2 className="detail-section-title">Lịch sử đặt giá</h2>
        {!result.bids || result.bids.length === 0 ? (
          <p>Không có lịch sử đặt giá.</p>
        ) : (
          <div className="bid-list">
            {result.bids.map((bid) => (
              <div key={bid._id} className="bid-item">
                <p>
                  <strong>Người đặt:</strong> {bid.userId?.name} - {bid.userId?.email}
                </p>
                <p>
                  <strong>Số tiền:</strong> {bid.bidAmount?.toLocaleString("vi-VN")} VND
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