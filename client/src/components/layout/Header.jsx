import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getUnreadNotificationCount } from "../../services/notificationService";

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const [unreadCount, setUnreadCount] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        if (!token) return;
        const data = await getUnreadNotificationCount(token);
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnreadCount();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setOpenMenu(false);
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          LTD<span style={{ color: "white" }}>Auction</span>
        </Link>

        <nav style={navStyle}>
          <Link to="/" className="header-link-modern">Home</Link>
          <Link to="/auctions" className="header-link-modern">Đấu giá</Link>
          <Link to="/results" className="header-link-modern">Kết quả</Link>

          {token && (
            <>
              {/* HIỂN THỊ LẠI DASHBOARD TRỰC TIẾP TẠI ĐÂY */}
              {userRole === "buyer" && (
                <Link to="/bidder/dashboard" className="header-link-modern">📊 Dashboard</Link>
              )}
              {userRole === "seller" && (
                <>
                  <Link to="/seller/dashboard" className="header-link-modern">📊 Dashboard</Link>
                  {/* <Link to="/create-auction" className="header-link-modern">➕ Tạo đấu giá</Link> */}
                </>
              )}
              {userRole === "admin" && (
                <Link to="/admin" className="header-link-modern">🛡️ Admin</Link>
              )}
            </>
          )}

          {!token ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/login" style={authButtonStyle}>Đăng nhập</Link>
              <Link to="/register" style={{ ...authButtonStyle, background: "#38bdf8", color: "#0f172a" }}>Đăng ký</Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <Link to="/notifications" style={notifIconStyle}>
                🔔 {unreadCount > 0 && <span style={badgeStyle}>{unreadCount}</span>}
              </Link>

              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button onClick={() => setOpenMenu(!openMenu)} style={userButtonStyle}>
                  <div style={avatarCircle}>{userName?.charAt(0).toUpperCase()}</div>
<span style={{ marginLeft: "8px" }}>{userName} ▾</span>
                </button>

                {openMenu && (
                  <div style={dropdownMenuStyle}>
                    <button onClick={() => {navigate("/profile"); setOpenMenu(false)}} style={menuItemStyle}>👤 Hồ sơ</button>
                    {/* Link phụ trong menu nếu cần */}
                    {userRole === "buyer" && <button onClick={() => {navigate("/my-orders"); setOpenMenu(false)}} style={menuItemStyle}>📦 Đơn hàng của tôi</button>}
                    {userRole === "seller" && <button onClick={() => {navigate("/seller/orders"); setOpenMenu(false)}} style={menuItemStyle}>🚚 Quản lý bàn giao</button>}
                    <button onClick={handleLogout} style={{ ...menuItemStyle, color: "#ef4444" }}>🚪 Đăng xuất</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

// Styles (Rút gọn để bạn dễ nhìn logic)
const headerStyle = { background: "#0f172a", color: "white", padding: "14px 24px", position: "sticky", top: 0, zIndex: 1000, borderBottom: "1px solid rgba(255,255,255,0.1)" };
const containerStyle = { maxWidth: "1250px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoStyle = { fontSize: "24px", fontWeight: "800", color: "#38bdf8", textDecoration: "none" };
const navStyle = { display: "flex", alignItems: "center", gap: "18px" };
const authButtonStyle = { padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600", color: "white", border: "1px solid #38bdf8" };
const userButtonStyle = { background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center" };
const avatarCircle = { width: "26px", height: "26px", background: "#38bdf8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontWeight: "bold" };
const badgeStyle = { position: "absolute", top: "-5px", right: "-8px", background: "#ef4444", color: "white", fontSize: "10px", padding: "2px 5px", borderRadius: "10px" };
const notifIconStyle = { position: "relative", textDecoration: "none", color: "white", fontSize: "18px" };
const dropdownMenuStyle = { position: "absolute", right: 0, top: "120%", minWidth: "200px", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" };
const menuItemStyle = { width: "100%", textAlign: "left", padding: "12px 16px", background: "white", border: "none", cursor: "pointer", color: "#333" };

export default Header;