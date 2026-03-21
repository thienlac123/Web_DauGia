import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBidderAuctions, getMyBids } from "../services/bidderService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function BidderDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionData = await getBidderAuctions(token);
        const bidData = await getMyBids(token);

        setAuctions(auctionData.auctions || []);
        setBids(bidData.bids || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2>Đang tải dashboard...</h2>;

  return (
    <div>
      <h1 className="page-title">Dashboard người đấu giá</h1>

      {/* AUCTIONS */}
      <div className="detail-card">
        <h2 className="detail-section-title">Phiên đã tham gia</h2>

        {auctions.length === 0 ? (
          <p>Chưa tham gia phiên nào.</p>
        ) : (
          <div className="auction-grid">
            {auctions.map((auction) => {
              const isLeading =
                auction.highestBidderId?._id === userId;

              return (
                <div key={auction._id} className="auction-card">
                  <h2>{auction.title}</h2>

                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {getStatusLabel(auction.status)}
                  </p>

                  <p>
                    <strong>Giá hiện tại:</strong>{" "}
                    {auction.currentPrice?.toLocaleString()} VND
                  </p>

                  <p>
                    <strong>Thời gian còn lại:</strong>{" "}
                    {auction.status === "ended"
                      ? "Đã kết thúc"
                      : getRemainingTime(auction.endTime)}
                  </p>

                  <p>
                    <strong>Kết quả:</strong>{" "}
                    {isLeading ? "Bạn đang dẫn đầu" : "Đang bị vượt giá"}
                  </p>

                  <Link to={`/auctions/${auction._id}`}>
                    <button className="secondary-btn">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BIDS */}
      <div className="detail-card">
        <h2 className="detail-section-title">Lịch sử đặt giá</h2>

        {bids.length === 0 ? (
          <p>Chưa có lịch sử bid.</p>
        ) : (
          <div className="bid-list">
            {bids.map((bid) => (
              <div key={bid._id} className="bid-item">
                <p>
                  <strong>Phiên:</strong>{" "}
                  {bid.auctionId?.title}
                </p>

                <p>
                  <strong>Số tiền:</strong>{" "}
                  {bid.bidAmount?.toLocaleString()} VND
                </p>

                <p>
                  <strong>Thời gian:</strong>{" "}
                  {new Date(bid.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BidderDashboardPage;