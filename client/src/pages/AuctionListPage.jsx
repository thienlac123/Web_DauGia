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

  if (loading) return <h2>Đang tải danh sách phiên đấu giá...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách phiên đấu giá</h1>

      <Link to="/create-auction">
        <button style={{ marginBottom: "20px" }}>Tạo phiên đấu giá</button>
      </Link>

      {auctions.length === 0 ? (
        <p>Chưa có phiên đấu giá nào.</p>
      ) : (
        auctions.map((auction) => (
          <div
            key={auction._id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
          >
            <h2>{auction.title}</h2>
            <p>{auction.description}</p>

            <p>
              <strong>Giá hiện tại:</strong>{" "}
              {auction.currentPrice?.toLocaleString("vi-VN")} VND
            </p>

            <p>
              <strong>Trạng thái:</strong> {getStatusLabel(auction.status)}
            </p>

            <p>
              <strong>Thời gian bắt đầu:</strong>{" "}
              {new Date(auction.startTime).toLocaleString("vi-VN")}
            </p>

            <p>
              <strong>Thời gian kết thúc:</strong>{" "}
              {new Date(auction.endTime).toLocaleString("vi-VN")}
            </p>

            <p>
              <strong>Thời gian còn lại:</strong>{" "}
              {auction.status === "ended"
                ? "Đã kết thúc"
                : getRemainingTime(auction.endTime)}
            </p>

            <p>
              <strong>Người bán:</strong> {auction.sellerId?.name || "N/A"}
            </p>

            <Link to={`/auctions/${auction._id}`}>
              <button>Xem chi tiết</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default AuctionListPage;