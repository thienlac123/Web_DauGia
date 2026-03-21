import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "#0f172a",
        color: "white",
        padding: "18px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/auctions"
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "white",
          }}
        >
          LTD Auction
        </Link>

        <nav className="nav-actions">
          <Link to="/auctions" className="header-link">
            Danh sách đấu giá
          </Link>

          <Link to="/create-auction" className="header-link">
            Tạo phiên đấu giá
          </Link>

          {!token ? (
            <>
              <Link to="/login" className="header-link">
                Đăng nhập
              </Link>
              <Link to="/register" className="header-link">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              {userRole === "seller" && (
                <Link to="/seller/dashboard" className="header-link">
                  Dashboard người tạo
                </Link>
              )}
              <span>Xin chào, {userName}</span>
              <button className="primary-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;