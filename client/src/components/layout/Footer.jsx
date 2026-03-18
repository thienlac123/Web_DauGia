import { Link } from "react-router-dom";

function Footer() {
  const footerLinkStyle = {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    marginBottom: "8px",
    transition: "color 0.2s"
  };

  return (
    <footer
      style={{
        background: "#0f172a",
        color: "white",
        padding: "60px 24px 20px 24px", // Tăng padding top để thoáng hơn
        marginTop: "80px", // Cách xa nội dung trang trên một chút
        borderTop: "1px solid #1e293b"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Tự động chia cột
          gap: "40px",
          marginBottom: "40px"
        }}
      >
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 style={{ color: "#38bdf8", marginBottom: "20px", fontSize: "18px" }}>🔨 WEB ĐẤU GIÁ</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
            Nền tảng đấu giá trực tuyến hiện đại, minh bạch và an toàn. 
            Nơi bạn có thể tìm thấy những món đồ độc bản với giá tốt nhất.
          </p>
        </div>

        {/* Cột 2: Điều hướng nhanh */}
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "16px" }}>Khám phá</h4>
          <Link to="/auctions" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Danh sách phiên</Link>
          <Link to="/create-auction" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Bắt đầu đấu giá</Link>
          <Link to="/rules" style={footerLinkStyle} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Quy định & Chính sách</Link>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h4 style={{ marginBottom: "20px", fontSize: "16px" }}>Liên hệ</h4>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📧 Email: hotro@daugia.vn</p>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📞 Hotline: 1900 1234</p>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📍 Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>

      {/* Dòng bản quyền dưới cùng */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "20px",
          borderTop: "1px solid #1e293b",
          textAlign: "center",
          color: "#64748b",
          fontSize: "13px"
        }}
      >
        <p>© 2026 Web Đấu Giá Trực Tuyến. Designed with ❤️ by LDL.</p>
      </div>
    </footer>
  );
}

export default Footer;