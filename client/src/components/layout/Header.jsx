
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Style chung cho các Link để tránh lặp code
  const linkStyle = {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  return (
    <header
      style={{
        background: "#0f172a", // Màu tối sâu hơn trông sang trọng hơn
        color: "white",
        padding: "0 24px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          to="/auctions"
          style={{
            color: "#38bdf8", // Màu xanh dương highlight
            textDecoration: "none",
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{ fontSize: "28px" }}>🔨</span> WEB ĐẤU GIÁ
        </Link>

        {/* Menu Điều hướng */}
        <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/auctions" style={linkStyle} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}>
            Danh sách
          </Link>

          <Link
            to="/create-auction"
            style={{
              ...linkStyle,
              background: "rgba(56, 189, 248, 0.1)",
              padding: "6px 12px",
              borderRadius: "8px",
              color: "#38bdf8"
            }}
          >
            + Tạo phiên
          </Link>

          <div style={{ height: "20px", width: "1px", background: "#334155" }}></div>

          {!token ? (
            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/login" style={linkStyle}>Đăng nhập</Link>
              <Link 
                to="/register" 
                style={{
                  ...linkStyle,
                  background: "#38bdf8",
                  color: "#0f172a",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "bold"
                }}
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Xin chào,</div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>{userName || "Thành viên"}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#ef4444";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#ef4444";
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;