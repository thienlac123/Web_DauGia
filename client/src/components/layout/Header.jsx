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
        if (!token) {
          setUnreadCount(0);
          return;
        }

        const data = await getUnreadNotificationCount(token);
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUnreadCount();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setOpenMenu(false);
    navigate("/login");
  };

  const handleGoProfile = () => {
    setOpenMenu(false);
    navigate("/profile");
  };

  const handleGoRolePage = () => {
    setOpenMenu(false);

    if (userRole === "buyer") {
      navigate("/my-orders");
      return;
    }

    if (userRole === "seller") {
      navigate("/seller/orders");
      return;
    }

    if (userRole === "admin") {
      navigate("/admin");
    }
  };

  const getRoleMenuLabel = () => {
    if (userRole === "buyer") return "Đơn hàng của tôi";
    if (userRole === "seller") return "Quản lý bàn giao";
    if (userRole === "admin") return "Admin Panel";
    return "Tài khoản";
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
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "white",
            textDecoration: "none",
          }}
        >
          LTD Auction
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="header-link">
            Home
          </Link>

          <Link to="/auctions" className="header-link">
            Danh sách đấu giá
          </Link>

          <Link to="/results" className="header-link">
            Kết quả đấu giá
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
              {userRole === "buyer" && (
                <Link to="/bidder/dashboard" className="header-link">
                  Dashboard người đấu giá
                </Link>
              )}

              {userRole === "seller" && (
                <>
                  <Link to="/seller/dashboard" className="header-link">
                    Dashboard người tạo
                  </Link>

                  <Link to="/create-auction" className="header-link">
                    Tạo phiên đấu giá
                  </Link>
                </>
              )}

              {userRole === "admin" && (
                <Link to="/admin" className="header-link">
                  Admin Panel
                </Link>
              )}

              <Link to="/notifications" className="header-link">
                Thông báo {unreadCount > 0 ? `(${unreadCount})` : ""}
              </Link>

              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenMenu((prev) => !prev)}
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Xin chào, {userName} ▾
                </button>

                {openMenu && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "110%",
                      minWidth: "210px",
                      background: "#fff",
                      color: "#111827",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <button onClick={handleGoProfile} style={menuItemStyle}>
                      Hồ sơ
                    </button>

                    <button onClick={handleGoRolePage} style={menuItemStyle}>
                      {getRoleMenuLabel()}
                    </button>

                    <button
                      onClick={handleLogout}
                      style={{
                        ...menuItemStyle,
                        color: "#dc2626",
                        fontWeight: 700,
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const menuItemStyle = {
  width: "100%",
  textAlign: "left",
  padding: "12px 16px",
  background: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "15px",
  borderBottom: "1px solid #f3f4f6",
};

export default Header;