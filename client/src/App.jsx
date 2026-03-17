import { useEffect, useState } from "react";
import socket from "./socket/socket";

function App() {
  const [auctionId, setAuctionId] = useState("");
  const [userId, setUserId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("auction_joined", (data) => {
      setMessages((prev) => [...prev, `JOIN: ${JSON.stringify(data)}`]);
    });

    socket.on("bid_updated", (data) => {
      setMessages((prev) => [...prev, `BID: ${JSON.stringify(data)}`]);
    });

    socket.on("auction_ended", (data) => {
      setMessages((prev) => [...prev, `ENDED: ${JSON.stringify(data)}`]);
    });

    socket.on("socket_error", (error) => {
      setMessages((prev) => [...prev, `ERROR: ${error.message}`]);
    });

    return () => {
      socket.off("auction_joined");
      socket.off("bid_updated");
      socket.off("auction_ended");
      socket.off("socket_error");
    };
  }, []);

  const handleJoinAuction = () => {
    socket.emit("join_auction", auctionId);
  };

  const handlePlaceBid = () => {
    socket.emit("place_bid", {
      auctionId,
      userId,
      bidAmount: Number(bidAmount),
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Socket Auction</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Auction ID"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
          style={{ width: "400px", marginRight: "10px" }}
        />
        <button onClick={handleJoinAuction}>Join Auction</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: "400px", marginRight: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          style={{ width: "400px", marginRight: "10px" }}
        />
        <button onClick={handlePlaceBid}>Place Bid</button>
      </div>

      <h2>Messages</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

export default App;