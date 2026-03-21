import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
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
          <Route
  path="/seller/dashboard"
  element={
    <RoleProtectedRoute role="seller">
      <SellerDashboardPage />
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