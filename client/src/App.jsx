import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import BidderDashboardPage from "./pages/BidderDashboardPage";
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auctions" element={<AuctionListPage />} />
          <Route path="/auctions/:id" element={<AuctionDetailPage />} />
          <Route
  path="/create-auction"
  element={
    <RoleProtectedRoute role="seller">
      <CreateAuctionPage />
    </RoleProtectedRoute>
  }
/>
          <Route
            path="/seller/dashboard"
            element={
              <RoleProtectedRoute role="seller">
                <SellerDashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
  path="/bidder/dashboard"
  element={
    <RoleProtectedRoute role="buyer">
      <BidderDashboardPage />
    </RoleProtectedRoute>
  }
/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;