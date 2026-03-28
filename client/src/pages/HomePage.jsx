import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* --- Hiệu ứng ánh sáng nền (Glow Effect) --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full"></div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 relative z-10">
        
        {/* --- HERO SECTION --- */}
        {/* Thay đổi: Dùng gradient nhẹ hơn, tăng padding và bo góc lớn hơn */}
        <div className="hero-banner relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-blue-600/20 via-slate-900/50 to-[#020617] p-12 md:p-24 text-center shadow-2xl">
          
          {/* Badge nhỏ ở trên */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-blue-400/20 bg-blue-400/5 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Auction Platform
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
            Hệ thống đấu giá <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              trực tuyến
            </span>{" "}
            thời gian thực
          </h1>

          

          {/* Decor: Thêm hiệu ứng lưới mờ dưới nền banner */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        {/* --- DETAIL SECTION --- */}
        {/* Tối ưu: Dùng Layout đối xứng để cân bằng thị giác */}
        <div className="mt-16 p-10 md:p-16 rounded-[2.5rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Khám phá hệ thống</h2>
              <p className="text-slate-400 leading-relaxed text-lg font-light">
                Người dùng có thể dễ dàng quản lý phiên đấu giá, tìm kiếm sản phẩm thông minh 
                và trải nghiệm cảm giác đặt giá kịch tính theo từng giây.
              </p>

              <div className="pt-4">
                <Link to="/auctions">
                  <button className="px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-blue-500/25">
                    Xem danh sách đấu giá
                  </button>
                </Link>
              </div>
            </div>

            {/* Phần đồ họa mô phỏng (Visual Placeholder) */}
            {/* Thay thế phần khung trống bằng các Feature Cards nhỏ có Icon */}
<div className="flex-1 w-full grid grid-cols-2 gap-4">
  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-white/10 flex flex-col items-center justify-center text-center">
    <div className="text-3xl mb-2">🔨</div>
    <div className="text-sm font-bold text-white">Đấu giá nhanh</div>
  </div>
  <div className="p-6 mt-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/10 flex flex-col items-center justify-center text-center">
    <div className="text-3xl mb-2">⏱️</div>
    <div className="text-sm font-bold text-white">Real-time</div>
  </div>
</div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;