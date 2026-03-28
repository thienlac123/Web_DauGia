import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllAuctions } from "../services/auctionService";
import { getRemainingTime, getStatusLabel } from "../utils/time";

function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [, setTick] = useState(0);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = { search, status, sort };
      const data = await getAllAuctions(params);
      setAuctions(data.auctions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi tải danh sách đấu giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuctions(); }, []);
  useEffect(() => {
    const interval = setInterval(() => { setTick((prev) => prev + 1); }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAuctions();
  };

  const getStatusClass = (auctionStatus) => {
    const base = "absolute top-4 left-4 z-20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ";
    if (auctionStatus === "active") return base + "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (auctionStatus === "upcoming") return base + "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (auctionStatus === "ended") return base + "bg-rose-500/20 text-rose-400 border-rose-500/30";
    return base + "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
          Danh sách sản phẩm đấu giá
        </h1>
        <p className="text-slate-500 text-lg font-medium">Tìm kiếm, lọc và theo dõi các phiên đấu giá theo thời gian thực.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* --- BỘ LỌC (Cùng màu nền, border tinh tế) --- */}
        <div className="bg-[#0f172a]/40 border border-white/5 p-6 rounded-[2rem] mb-12 backdrop-blur-sm">
          <form onSubmit={handleFilter} className="flex flex-col lg:flex-row gap-4">
            <input
              className="flex-grow bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-4">
              <select
                className="bg-[#020617] border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-blue-500/50 min-w-[160px] cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Trạng thái</option>
                <option value="active">Đang diễn ra</option>
                <option value="upcoming">Sắp tới</option>
                <option value="ended">Đã kết thúc</option>
              </select>
              <select
                className="bg-[#020617] border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-blue-500/50 min-w-[160px] cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sắp xếp</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20" type="submit">
                Lọc kết quả
              </button>
            </div>
          </form>
        </div>

        {/* --- GRID DANH SÁCH --- */}
        {auctions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-medium italic">Không có phiên đấu giá nào được tìm thấy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {auctions.map((auction) => (
              <div key={auction._id} className="group relative bg-[#0f172a]/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-[#0f172a]/60 hover:border-blue-500/30 transition-all duration-500 shadow-xl flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className={getStatusClass(auction.status)}>
                    {getStatusLabel(auction.status)}
                  </div>
                  {auction.images && auction.images.length > 0 ? (
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600 italic font-bold uppercase tracking-widest">No Image</div>
                  )}
                  {/* Overlay phủ ảnh cho text nổi bật */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-1 rounded-md">
                      {auction.category || "General"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold italic opacity-60">
                      ID: {auction._id.substring(0,6)}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-2 group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">
                    {auction.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium h-10 leading-relaxed">
                    {auction.description || "Sản phẩm đấu giá chất lượng cao."}
                  </p>

                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Giá hiện tại</span>
                        <div className="text-2xl font-black text-white leading-none">
                          {auction.currentPrice?.toLocaleString("vi-VN")} <span className="text-xs text-slate-500 ml-1">VND</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Kết thúc</span>
                        <div className="text-xs font-bold text-slate-400">{new Date(auction.endTime).toLocaleDateString("vi-VN")}</div>
                      </div>
                    </div>
                    
                    {/* Time Counter Bar */}
                    <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl flex justify-between items-center group-hover:border-blue-500/20 transition-all">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Thời gian còn lại</span>
                      <span className={`text-sm font-black ${auction.status === "active" ? "text-emerald-400" : "text-rose-500"}`}>
                        {auction.status === "ended" ? "Hết hạn" : getRemainingTime(auction.endTime)}
                      </span>
                    </div>

                    <Link to={`/auctions/${auction._id}`} className="block pt-2">
                      <button className="w-full py-4 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-transparent text-white font-black rounded-2xl transition-all duration-300 active:scale-[0.98]">
                        XEM CHI TIẾT
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuctionListPage;