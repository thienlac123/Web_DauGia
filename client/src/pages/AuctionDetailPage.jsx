import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAuctionById,
  getAuctionBids,
} from "../services/auctionService";
import socket from "../socket/socket";

function AuctionDetailPage() {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAuctionDetail = async () => {
      try {
        const auctionRes = await getAuctionById(id);
        const bidsRes = await getAuctionBids(id);

        setAuction(auctionRes.auction);
        setBids(bidsRes.bids || []);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi tải chi tiết đấu giá");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  useEffect(() => {
    socket.emit("join_auction", id);

    const handleAuctionJoined = (data) => {
      if (data.auction?._id === id) {
        setAuction(data.auction);
      }
    };

    const handleBidUpdated = (data) => {
      if (data.auction?._id === id) {
        setAuction(data.auction);
        setBids((prev) => [data.bid, ...prev]);
        setMessage("Có giá đấu mới");
      }
    };

    const handleAuctionEnded = (data) => {
      if (data.auction?._id === id) {
        setAuction(data.auction);
        setMessage("Phiên đấu giá đã kết thúc");
      }
    };

    const handleSocketError = (error) => {
      setMessage(error.message || "Có lỗi socket");
    };

    socket.on("auction_joined", handleAuctionJoined);
    socket.on("bid_updated", handleBidUpdated);
    socket.on("auction_ended", handleAuctionEnded);
    socket.on("socket_error", handleSocketError);

    return () => {
      socket.emit("leave_auction", id);
      socket.off("auction_joined", handleAuctionJoined);
      socket.off("bid_updated", handleBidUpdated);
      socket.off("auction_ended", handleAuctionEnded);
      socket.off("socket_error", handleSocketError);
    };
  }, [id]);

  const handlePlaceBid = () => {
    setMessage("");

    if (!userId) {
      setMessage("Không tìm thấy userId, hãy đăng nhập lại");
      return;
    }

    if (!bidAmount) {
      setMessage("Vui lòng nhập số tiền muốn đấu giá");
      return;
    }

    socket.emit("place_bid", {
      auctionId: id,
      userId,
      bidAmount: Number(bidAmount),
    });

    setBidAmount("");
  };

  if (loading) return <h2>Đang tải chi tiết phiên đấu giá...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!auction) return <h2>Không tìm thấy phiên đấu giá</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{auction.title}</h1>
      <p>{auction.description}</p>

      <p>
        <strong>Giá khởi điểm:</strong>{" "}
        {auction.startPrice?.toLocaleString("vi-VN")} VND
      </p>

      <p>
        <strong>Giá hiện tại:</strong>{" "}
        {auction.currentPrice?.toLocaleString("vi-VN")} VND
      </p>

      <p>
        <strong>Bước giá tối thiểu:</strong>{" "}
        {auction.minBidStep?.toLocaleString("vi-VN")} VND
      </p>

      <p>
        <strong>Trạng thái:</strong> {auction.status}
      </p>

      <p>
        <strong>Người bán:</strong> {auction.sellerId?.name} -{" "}
        {auction.sellerId?.email}
      </p>

      <p>
        <strong>Người đang trả giá cao nhất:</strong>{" "}
        {auction.highestBidderId
          ? `${auction.highestBidderId.name} - ${auction.highestBidderId.email}`
          : "Chưa có"}
      </p>

      <p>
        <strong>Thời gian bắt đầu:</strong>{" "}
        {new Date(auction.startTime).toLocaleString("vi-VN")}
      </p>

      <p>
        <strong>Thời gian kết thúc:</strong>{" "}
        {new Date(auction.endTime).toLocaleString("vi-VN")}
      </p>

      <hr />

      <h2>Đặt giá</h2>

      {auction.status !== "active" ? (
        <p>Phiên đấu giá hiện không cho phép đặt giá.</p>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="number"
            placeholder="Nhập số tiền đấu giá"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            style={{ width: "300px", marginRight: "10px" }}
          />
          <button onClick={handlePlaceBid}>Đặt giá</button>
        </div>
      )}

      {message && <p>{message}</p>}

      <hr />

      <h2>Lịch sử đặt giá</h2>

      {bids.length === 0 ? (
        <p>Chưa có lượt đặt giá nào.</p>
      ) : (
        bids.map((bid) => (
          <div
            key={bid._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
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
        ))
      )}
    </div>
  );
}

export default AuctionDetailPage;