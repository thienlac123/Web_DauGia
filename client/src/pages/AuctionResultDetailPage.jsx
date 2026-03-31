import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionResultById } from "../services/auctionService";
import { createVNPayPayment, mockPayment } from "../services/paymentService";

function AuctionResultDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getAuctionResultById(id);
        setResult(data.result);
      } catch (error) {
        setMessage("Không tải được chi tiết kết quả đấu giá");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handlePay = async () => {
    try {
      setPaying(true);
      const data = await createVNPayPayment(id, token);
      window.location.href = data.paymentUrl;
    } catch (error) {
      setMessage(error.response?.data?.message || "Không tạo được link thanh toán");
    } finally {
      setPaying(false);
    }
  };

  const handleMockPay = async () => {
    try {
      setPaying(true);
      await mockPayment(id, token);
      setMessage("Thanh toán demo thành công ✅");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Thanh toán demo thất bại");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!result) return <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-bold">Không tìm thấy kết quả</div>;

  const isWinner = String(result.winner?._id) === String(userId);
  const canPay = isWinner && result.paymentStatus !== "paid";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        
        {/* --- HEADER: THÔNG BÁO CHIẾN THẮNG --- */}
        {isWinner && result.paymentStatus !== "paid" && (
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-[2rem] text-center animate-pulse">
            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-widest">🏆 Chúc mừng bạn đã thắng giải!</h2>
            <p className="text-slate-400 text-sm mt-1">Vui lòng hoàn tất thanh toán để nhận sản phẩm.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* CỘT CHÍNH: THÔNG TIN SẢN PHẨM (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h1 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">{result.title}</h1>
              <p className="text-slate-500 mb-8 leading-relaxed italic">{result.description}</p>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {result.images?.map((img, index) => (
                  <img key={index} src={img} className="w-full h-48 object-cover rounded-3xl border border-white/10 hover:scale-[1.02] transition-transform" alt="result" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 text-sm">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Danh mục</p>
                  <p className="font-bold text-white">{result.category || "Khác"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tình trạng</p>
                  <p className="font-bold text-white">{result.condition || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Người bán</p>
                  <p className="font-bold text-blue-400">{result.sellerId?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Kết thúc vào</p>
                  <p className="font-bold text-slate-400">{new Date(result.endTime).toLocaleString("vi-VN")}</p>
                </div>
              </div>
            </div>

            {/* Lịch sử đặt giá */}
            <div className="bg-[#0f172a]/20 border border-white/5 p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-black mb-6 uppercase tracking-tighter">Lịch sử giao dịch</h3>
              <div className="space-y-4">
                {result.bids?.map((bid) => (
                  <div key={bid._id} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div>
                      <p className="text-sm font-bold">{bid.userId?.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{new Date(bid.createdAt).toLocaleTimeString("vi-VN")}</p>
                    </div>
                    <p className="font-black text-blue-400">+{bid.bidAmount?.toLocaleString("vi-VN")} <small className="text-[8px]">VND</small></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHỤ: TRẠNG THÁI THANH TOÁN (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0f172a]/50 border border-white/10 p-8 rounded-[2.5rem] sticky top-8 shadow-2xl">
              <div className="text-center space-y-4">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Giá chốt cuối cùng</p>
                <div className="text-4xl font-black tracking-tighter text-white">
                  {result.finalPrice?.toLocaleString("vi-VN")} <span className="text-xs text-slate-500 font-normal">VND</span>
                </div>
                
                <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  result.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {result.paymentStatus === "paid" ? "Đã thanh toán ✅" : "Đang chờ thanh toán"}
                </div>
              </div>

              <div className="mt-10 space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Người thắng cuộc:</span>
                  <span className="font-bold text-white">{result.winner?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Số lượt bid:</span>
                  <span className="font-bold text-white">{result.bidCount} lượt</span>
                </div>
              </div>

              {canPay && (
                <div className="mt-10 space-y-3">
                  <button 
                    onClick={handlePay} 
                    disabled={paying}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {paying ? "Đang xử lý..." : "THANH TOÁN VNPAY"}
                  </button>
                  <button 
                    onClick={handleMockPay} 
                    disabled={paying}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-95"
                  >
                    THANH TOÁN DEMO
                  </button>
                </div>
              )}

              {message && (
                <p className={`mt-4 text-center text-xs font-bold p-3 rounded-xl border ${
                  message.includes("thành công") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {message}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuctionResultDetailPage;