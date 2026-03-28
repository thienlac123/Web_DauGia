import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSellerAuctions,
  getSellerAnalytics,
} from "../services/userService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function SellerDashboardPage() {
  const [auctions, setAuctions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Bạn cần đăng nhập");
          setLoading(false);
          return;
        }

        const [auctionData, analyticsData] = await Promise.all([
          getSellerAuctions(token),
          getSellerAnalytics(token),
        ]);

        setAuctions(auctionData.auctions || []);
        setAnalytics(analyticsData.analytics || null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải dashboard người tạo"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    if (status === "active") return "px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider";
    if (status === "upcoming") return "px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider";
    if (status === "ended") return "px-3 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider";
    return "px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider";
  };

  const getStatusDot = (status) => {
    if (status === "active") return "bg-emerald-500";
    if (status === "upcoming") return "bg-amber-500";
    if (status === "ended") return "bg-slate-400";
    return "bg-red-500";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Đang tải dashboard người tạo...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center max-w-md">
        <p className="text-rose-400 font-semibold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans selection:bg-blue-500/30">
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-slate-400 bg-clip-text text-transparent uppercase italic">
              Dashboard 
            </h1>
            <p className="text-slate-400 text-lg font-medium border-l-4 border-blue-500 pl-4">
              Quản lý phiên đấu giá, theo dõi kết quả và doanh thu của bạn.
            </p>
          </div>
          <Link to="/create-auction">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 uppercase tracking-wider text-sm">
              ➕ Tạo phiên mới
            </button>
          </Link>
        </div>
      </div>

      {/* --- ANALYTICS SECTION --- */}
      {analytics && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Thống kê tổng quan</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Total Auctions */}
            <div className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-blue-500/30">
                  📊
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng số</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{analytics.totalAuctions}</p>
              <p className="text-sm text-slate-400 font-medium">Phiên đã tạo</p>
            </div>

            {/* Card 2: Approved */}
            <div className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-emerald-500/30">
                  ✅
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phê duyệt</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{analytics.approvedAuctions}</p>
              <p className="text-sm text-slate-400 font-medium">Phiên đã duyệt</p>
            </div>

            {/* Card 3: Ended */}
            <div className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 hover:border-slate-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-slate-500/30">
                  ⏱️
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Kết thúc</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{analytics.endedAuctions}</p>
              <p className="text-sm text-slate-400 font-medium">Phiên đã kết thúc</p>
            </div>

            {/* Card 4: Successful */}
            <div className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:border-green-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-green-500/30">
                  🎯
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thành công</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{analytics.successfulAuctions}</p>
              <p className="text-sm text-slate-400 font-medium">Phiên bán thành công</p>
            </div>

            {/* Card 5: Total Bids */}
            <div className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:border-purple-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-purple-500/30">
                  🏷️
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bids</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{analytics.totalBids}</p>
              <p className="text-sm text-slate-400 font-medium">Tổng lượt bid</p>
            </div>

            {/* Card 6: Revenue */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:border-amber-500/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform border border-amber-500/30">
                  💰
                </div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Revenue</span>
              </div>
              <p className="text-3xl font-black text-amber-300 mb-1">{analytics.totalRevenue?.toLocaleString("vi-VN")}đ</p>
              <p className="text-sm text-amber-400 font-medium">Tổng doanh thu</p>
            </div>
          </div>
        </div>
      )}

      {/* --- AUCTIONS SECTION --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Phiên đấu giá của bạn</h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
        </div>

        {auctions.length === 0 ? (
          <div className="py-20 text-center bg-[#0f172a]/40 border-2 border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-300 font-bold text-lg uppercase tracking-wide">Bạn chưa tạo phiên đấu giá nào.</p>
            <p className="text-slate-500 mt-2 mb-6">Hãy tạo phiên đấu giá đầu tiên của bạn để bắt đầu!</p>
            <Link to="/create-auction">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
                Tạo phiên mới
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction) => (
              <div key={auction._id} className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:border-blue-500/50 hover:-translate-y-1 backdrop-blur-sm">
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className={getStatusClass(auction.status)}>
                    {getStatusLabel(auction.status)}
                  </span>
                </div>

                {/* Image */}
                <div className="relative h-52 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {auction.images && auction.images.length > 0 ? (
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                      <span className="text-5xl mb-2">🖼️</span>
                      <span className="text-sm font-semibold">Không có ảnh</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-black text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors italic">
                    {auction.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 font-medium">
                    {auction.description || "Không có mô tả"}
                  </p>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Danh mục:</span>
                    <span className="text-sm font-semibold text-slate-300 bg-slate-800/50 px-3 py-1 rounded-lg border border-white/10">
                      {auction.category || "Khác"}
                    </span>
                  </div>

                  {/* Approval Status */}
                  <div className="mb-4 pb-4 border-b border-white/5">
                    <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-2">Trạng thái duyệt:</p>
                    <div>
                      {auction.approvalStatus === "pending" && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold uppercase">⏳ Chờ duyệt</span>
                      )}
                      {auction.approvalStatus === "approved" && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold uppercase">✅ Đã duyệt</span>
                      )}
                      {auction.approvalStatus === "rejected" && (
                        <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase">❌ Bị từ chối</span>
                      )}
                    </div>
                    {auction.approvalStatus === "rejected" && auction.approvalNote && (
                      <p className="text-xs text-rose-400 mt-2 font-semibold italic">Lý do: {auction.approvalNote}</p>
                    )}
                  </div>

                  {/* Price Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Giá hiện tại</span>
                      <span className="text-lg font-black text-blue-400">
                        {auction.currentPrice?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Bước giá</span>
                      <span className="text-sm font-bold text-slate-300">
                        {auction.minBidStep?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  {/* Bidder & Time Info */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Người dẫn đầu</span>
                      <span className="text-sm font-bold text-slate-300">
                        {auction.highestBidderId ? auction.highestBidderId.name : "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Thời gian còn lại</span>
                      <span className={`text-sm font-bold ${auction.status === "ended" ? "text-slate-400" : "text-emerald-400"}`}>
                        {auction.status === "ended" ? "Đã kết thúc" : getRemainingTime(auction.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Winner Info (if ended) */}
                  {auction.status === "ended" && (
                    <div className="mb-4 pb-4 border-b border-white/5 bg-[#020617]/40 -mx-6 px-6 py-4 rounded-none">
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-2">Kết quả đấu giá:</p>
                      <p className="text-sm font-bold text-slate-300 mb-3">
                        👤 {auction.winnerId ? `${auction.winnerId.name} (${auction.winnerId.email})` : "Không có"}
                      </p>
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Giá chốt:</p>
                      <p className="text-lg font-black text-blue-400 mb-3">
                        {auction.currentPrice?.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Thanh toán:</p>
                      {auction.paymentStatus === "paid" && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold uppercase">✅ Đã thanh toán</span>
                      )}
                      {auction.paymentStatus === "pending" && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-bold uppercase">⏳ Chờ thanh toán</span>
                      )}
                      {auction.paymentStatus === "unpaid" && (
                        <span className="px-2 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs font-bold uppercase">❌ Chưa thanh toán</span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link to={`/seller/auctions/${auction._id}`} className="block">
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all duration-300 uppercase text-sm tracking-wider shadow-lg hover:shadow-blue-500/30">
                      Xem chi tiết & quản lý →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboardPage;