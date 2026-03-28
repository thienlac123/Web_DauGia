import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionById, getAuctionBids } from "../services/auctionService";
import socket from "../socket/socket";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  const userId = localStorage.getItem("userId");

  // Fetch data
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

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Socket setup
  useEffect(() => {
    socket.emit("join_auction", id);
    const handleBidUpdated = (data) => {
      if (data.auction?._id === id) {
        setAuction(data.auction);
        setBids((prev) => [data.bid, ...prev]);
        setMessage("⚡ Có giá đấu mới!");
      }
    };
    socket.on("bid_updated", handleBidUpdated);
    return () => {
      socket.emit("leave_auction", id);
      socket.off("bid_updated", handleBidUpdated);
    };
  }, [id]);

  const handlePlaceBid = () => {
    if (!userId) return setMessage("Vui lòng đăng nhập để đấu giá");
    if (!bidAmount) return setMessage("Vui lòng nhập số tiền");
    socket.emit("place_bid", { auctionId: id, userId, bidAmount: Number(bidAmount) });
    setBidAmount("");
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Đang tải...</div>;
  if (error || !auction) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">{error || "Không tìm thấy"}</div>;

  const isActive = auction.status === "active";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* BỐ CỤC 2 CỘT: TRÁI (INFO) - PHẢI (BIDDING) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- CỘT TRÁI: HÌNH ẢNH & CHI TIẾT --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Hình ảnh */}
            <div className="bg-[#0f172a]/30 border border-white/5 p-4 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auction.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="product"
                    className={`w-full object-cover rounded-3xl border border-white/5 ${index === 0 ? 'md:col-span-2 h-[400px]' : 'h-[200px]'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="bg-[#0f172a]/30 border border-white/5 p-8 md:p-12 rounded-[2.5rem] space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-widest">
                  {auction.category || "Sản phẩm"}
                </span>
                <span className="px-4 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-full text-xs font-bold italic">
                  ID: {auction._id}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight italic uppercase">
                {auction.title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                {auction.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Địa điểm</p>
                  <p className="font-bold text-white">{auction.location || "Online"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tình trạng</p>
                  <p className="font-bold text-white">{auction.condition || "Mới"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Người bán</p>
                  <p className="font-bold text-blue-400 underline">{auction.sellerId?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: TRẠNG THÁI & ĐẶT GIÁ --- */}
          <div className="space-y-8">
            
            {/* Box Đặt giá & Giá hiện tại */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-900/20 border border-blue-500/20 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
               {/* Decor Pulse Light */}
               <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Giá hiện tại</span>
                    <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase">{getStatusLabel(auction.status)}</span>
                  </div>
                  
                  <div className="text-5xl font-black tracking-tighter">
                    {auction.currentPrice?.toLocaleString("vi-VN")} <span className="text-xs text-slate-500 font-normal ml-1 uppercase">VND</span>
                  </div>

                  <div className="bg-[#020617]/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Thời gian còn lại</p>
                    <p className="text-xl font-black text-emerald-400 font-mono">
                       {auction.status === "ended" ? "Đã kết thúc" : getRemainingTime(auction.endTime)}
                    </p>
                  </div>

                  {isActive && (
                    <div className="space-y-3">
                      <input
                        className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all text-xl font-bold"
                        type="number"
                        placeholder="Nhập giá..."
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                      <button onClick={handlePlaceBid} className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                        ĐẶT GIÁ NGAY
                      </button>
                    </div>
                  )}

                  {message && <p className="text-center text-xs font-bold text-amber-400 animate-bounce">{message}</p>}
               </div>
            </div>

            {/* Lịch sử đặt giá (Bảng mini) */}
            <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Lịch sử
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {bids.length === 0 ? (
                  <p className="text-slate-600 italic text-sm text-center py-4">Chưa có lượt đặt giá.</p>
                ) : (
                  bids.map((bid) => (
                    <div key={bid._id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{bid.userId?.name}</p>
                        <p className="text-[10px] text-slate-500">{new Date(bid.createdAt).toLocaleTimeString("vi-VN")}</p>
                      </div>
                      <p className="font-black text-white text-sm">
                        +{bid.bidAmount?.toLocaleString("vi-VN")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetailPage;