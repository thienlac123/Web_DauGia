import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar() {
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

  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
      <Link to="/auctions" style={{ marginRight: "12px" }}>
        Danh sách đấu giá
      </Link>

      <Link to="/create-auction" style={{ marginRight: "12px" }}>
        Tạo phiên đấu giá
      </Link>

      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: "12px" }}>
            Đăng nhập
          </Link>
          <Link to="/register">Đăng ký</Link>
        </>
      ) : (
        <>
          <span style={{ marginRight: "12px" }}>Xin chào, {userName}</span>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/auctions" />} />
        <Route path="/auctions" element={<AuctionListPage />} />
        <Route path="/auctions/:id" element={<AuctionDetailPage />} />
        <Route
          path="/create-auction"
          element={
            <ProtectedRoute>
              <CreateAuctionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;