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
import AdminPanelPage from "./pages/AdminPanelPage";
import NotificationsPage from "./pages/NotificationsPage";
import SellerAuctionDetailPage from "./pages/SellerAuctionDetailPage";
import AuctionResultsPage from "./pages/AuctionResultsPage";
import AuctionResultDetailPage from "./pages/AuctionResultDetailPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import ProfilePage from "./pages/ProfilePage";
import ComparePage from "./pages/ComparePage";


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auctions" element={<AuctionListPage />} />
          <Route path="/compare" element={<ComparePage />} />
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
            path="/seller/auctions/:id"
            element={
              <RoleProtectedRoute role="seller">
                <SellerAuctionDetailPage />
              </RoleProtectedRoute>
            }
          />
          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
          <Route
            path="/seller/orders"
            element={
              <RoleProtectedRoute role="seller">
                <SellerOrdersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RoleProtectedRoute role="buyer">
                <MyOrdersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RoleProtectedRoute role="admin">
                <AdminOrdersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
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
          <Route path="/results" element={<AuctionResultsPage />} />
          <Route path="/results/:id" element={<AuctionResultDetailPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute role="admin">
                <AdminPanelPage />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;