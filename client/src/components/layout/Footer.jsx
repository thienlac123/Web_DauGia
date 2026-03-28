function Footer() {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Cột 1: Brand & Bio */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">
              LTD<span className="text-blue-500">.</span>AUCTION
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8 font-medium">
              Hệ thống đấu giá trực tuyến an toàn, minh bạch và thời gian thực. 
              Mang lại trải nghiệm mua sắm công bằng và kịch tính cho mọi người dùng.
            </p>
            <div className="flex gap-4">
              {['facebook', 'github', 'linkedin', 'twitter'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  <i className={`fa-brands fa-${social} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Cột 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Khám phá</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Trang chủ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Đấu giá đang diễn ra</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Kết quả đấu giá</a></li>
            </ul>
          </div>

          {/* Cột 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Hỗ trợ</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-semibold">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Hướng dẫn đấu giá</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[13px] font-medium tracking-wide">
            © 2026 Designed by <span className="text-blue-500 font-black">Yuda</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-slate-500 text-[12px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Server Status: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;