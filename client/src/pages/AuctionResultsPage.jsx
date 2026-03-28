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

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent uppercase italic">
          Kết quả đấu giá
        </h1>
        <p className="text-slate-500 text-lg font-medium border-l-2 border-blue-500 pl-4">
          Danh sách các phiên đấu giá đã kết thúc và được công khai kết quả.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {results.length === 0 ? (
          <div className="text-center py-24 bg-[#0f172a]/20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-slate-600 font-bold italic tracking-widest uppercase">Chưa có kết quả đấu giá nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((auction) => (
              <div key={auction._id} className="group bg-[#0f172a]/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-[#0f172a]/60 hover:border-blue-500/30 transition-all duration-500 shadow-xl flex flex-col">
                
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-black text-emerald-400 uppercase">
                    Đã kết thúc
                  </div>
                  
                  {auction.images && auction.images.length > 0 ? (
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.3] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700 font-black tracking-tighter uppercase italic">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight uppercase italic">
                    {auction.title}
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Giá chốt cuối</span>
                      <span className="text-xl font-black text-white">
                        {auction.finalPrice?.toLocaleString("vi-VN")} <small className="text-[10px] text-slate-500 font-normal ml-1">VND</small>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Người chiến thắng</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-[10px]">🏆</div>
                        <p className="text-sm font-bold text-slate-300 line-clamp-1">
                          {auction.winner ? auction.winner.name : "Vắng mặt"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] font-bold text-slate-500 pt-2">
                      <span>Số lượt bid: {auction.bidCount}</span>
                      <span>{new Date(auction.endTime).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  <Link to={`/results/${auction._id}`} className="mt-auto">
                    <button className="w-full py-4 bg-white/5 hover:bg-white text-white hover:text-[#020617] border border-white/10 font-black rounded-2xl transition-all duration-300 active:scale-95 uppercase tracking-tighter text-sm">
                      Chi tiết kết quả
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

export default AuctionResultsPage;