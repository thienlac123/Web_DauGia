import { placeBidService } from "../services/bidService.js";
import { getAuctionByIdService } from "../services/auctionService.js";

export const registerAuctionSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_auction", async (auctionId) => {
      try {
        socket.join(auctionId);
        console.log(`Socket ${socket.id} joined auction ${auctionId}`);

        const auction = await getAuctionByIdService(auctionId);

        io.to(auctionId).emit("auction_joined", {
          message: "Đã tham gia phòng đấu giá",
          auction,
        });

        if (auction.status === "ended") {
          io.to(auctionId).emit("auction_ended", {
            message: "Phiên đấu giá đã kết thúc",
            auction,
          });
        }
      } catch (error) {
        socket.emit("socket_error", { message: error.message });
      }
    });

    socket.on("leave_auction", (auctionId) => {
      socket.leave(auctionId);
      console.log(`Socket ${socket.id} left auction ${auctionId}`);
    });

    socket.on("place_bid", async ({ auctionId, userId, bidAmount }) => {
      try {
        const bid = await placeBidService(auctionId, userId, bidAmount);
        const updatedAuction = await getAuctionByIdService(auctionId);

        io.to(auctionId).emit("bid_updated", {
          message: "Có giá đấu mới",
          bid,
          auction: updatedAuction,
        });

        if (updatedAuction.status === "ended") {
          io.to(auctionId).emit("auction_ended", {
            message: "Phiên đấu giá đã kết thúc",
            auction: updatedAuction,
          });
        }
      } catch (error) {
        socket.emit("socket_error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};