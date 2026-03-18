import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
        <Link to="/auctions" style={{ marginRight: "12px" }}>
          Danh sách đấu giá
        </Link>
        <Link to="/create-auction">Tạo phiên đấu giá</Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/auctions" />} />
        <Route path="/auctions" element={<AuctionListPage />} />
        <Route path="/auctions/:id" element={<AuctionDetailPage />} />
        <Route path="/create-auction" element={<CreateAuctionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;