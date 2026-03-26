import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuctionResults } from "../services/auctionService";

function AuctionResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAuctionResults();
        setResults(data.auctions || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <h2>Đang tải kết quả đấu giá...</h2>;

  return (
    <div>
      <h1 className="page-title">Kết quả đấu giá</h1>
      <p className="page-subtitle">
        Danh sách các phiên đấu giá đã kết thúc và được công khai kết quả.
      </p>

      {results.length === 0 ? (
        <div className="detail-card">
          <p>Chưa có kết quả đấu giá nào.</p>
        </div>
      ) : (
        <div className="auction-grid">
          {results.map((auction) => (
            <div key={auction._id} className="auction-card">
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
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
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

              <p>
                <strong>Giá cuối:</strong>{" "}
                {auction.finalPrice?.toLocaleString("vi-VN")} VND
              </p>

              <p>
                <strong>Người thắng:</strong>{" "}
                {auction.winner
                  ? `${auction.winner.name} - ${auction.winner.email}`
                  : "Không có"}
              </p>

              <p>
                <strong>Số lượt bid:</strong> {auction.bidCount}
              </p>

              <p>
                <strong>Kết thúc lúc:</strong>{" "}
                {new Date(auction.endTime).toLocaleString("vi-VN")}
              </p>

              <Link to={`/results/${auction._id}`}>
                <button className="secondary-btn">Xem kết quả chi tiết</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuctionResultsPage;