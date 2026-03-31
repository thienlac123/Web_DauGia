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
        const [auctionData, bidData] = await Promise.all([
          getBidderAuctions(token),
          getMyBids(token)
        ]);
        setAuctions(auctionData.auctions || []);
        setBids(bidData.bids || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-400 via-white to-slate-500 bg-clip-text text-transparent uppercase italic">
          Bảng điều khiển
        </h1>
        <p className="text-slate-500 text-lg font-medium border-l-2 border-blue-500 pl-4">
          Theo dõi các phiên đấu giá bạn tham gia và lịch sử đặt giá cá nhân.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* --- SECTION 1: AUCTIONS PARTICIPATED --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest italic text-slate-200">Phiên đã tham gia</h2>
            <div className="h-[1px] flex-grow bg-white/5"></div>
          </div>

          {auctions.length === 0 ? (
            <div className="py-20 text-center bg-[#0f172a]/20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-slate-600 font-bold italic uppercase">Bạn chưa tham gia phiên đấu giá nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {auctions.map((auction) => {
                const isLeading = auction.highestBidderId?._id === userId || auction.highestBidderId === userId;
                return (
                  <div key={auction._id} className={`group relative bg-[#0f172a]/30 border rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-[#0f172a]/60 ${isLeading ? 'border-emerald-500/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                    
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                        {getStatusLabel(auction.status)}
                      </span>
                      {isLeading ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Đang dẫn đầu
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                          Bị vượt giá
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black mb-4 group-hover:text-blue-400 transition-colors line-clamp-1 italic uppercase tracking-tighter">
                      {auction.title}
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Giá hiện tại</span>
                        <span className="text-xl font-black text-white italic">
                          {auction.currentPrice?.toLocaleString("vi-VN")} <small className="text-[10px] text-slate-500 font-normal ml-1">VND</small>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Còn lại:</span>
                        <span className="font-bold text-blue-400 font-mono">
                          {auction.status === "ended" ? "Hết hạn" : getRemainingTime(auction.endTime)}
                        </span>
                      </div>
                    </div>

                    <Link to={`/auctions/${auction._id}`}>
                      <button className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-[#020617] border border-white/10 font-black rounded-2xl transition-all duration-300 active:scale-95 uppercase text-xs tracking-widest">
                        Quản lý bid
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- SECTION 2: BID HISTORY --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest italic text-slate-200">Lịch sử đặt giá</h2>
            <div className="h-[1px] flex-grow bg-white/5"></div>
          </div>

          {bids.length === 0 ? (
            <p className="text-slate-600 italic">Chưa có lịch sử giao dịch.</p>
          ) : (
            <div className="overflow-hidden bg-[#0f172a]/20 border border-white/5 rounded-[2.5rem]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phiên đấu giá</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Số tiền</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {bids.map((bid) => (
                      <tr key={bid._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{bid.auctionId?.title}</p>
                          <p className="text-[10px] text-slate-600 font-medium tracking-tight">ID: {bid._id.substring(0,8)}</p>
                        </td>
                        <td className="px-8 py-6 font-black text-white italic">
                          {bid.bidAmount?.toLocaleString("vi-VN")} <span className="text-[10px] text-slate-600 font-normal">VND</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-sm font-bold text-slate-400">{new Date(bid.createdAt).toLocaleDateString("vi-VN")}</p>
                          <p className="text-[10px] text-slate-600">{new Date(bid.createdAt).toLocaleTimeString("vi-VN")}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BidderDashboardPage;