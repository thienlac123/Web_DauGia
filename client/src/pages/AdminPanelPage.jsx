import { useEffect, useState } from "react";
import {
  getAllUsers,
  toggleBlockUser,
  getPendingAuctions,
  approveAuction,
  rejectAuction,
} from "../services/adminService";

function AdminPanelPage() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [pendingAuctions, setPendingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const usersData = await getAllUsers(token);
      const auctionsData = await getPendingAuctions(token);

      setUsers(usersData.users || []);
      setPendingAuctions(auctionsData.auctions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBlock = async (id) => {
    await toggleBlockUser(id, token);
    fetchAdminData();
  };

  const handleApprove = async (id) => {
    await approveAuction(id, token);
    fetchAdminData();
  };

  const handleReject = async (id) => {
    const note = prompt("Nhập lý do từ chối:") || "";
    await rejectAuction(id, note, token);
    fetchAdminData();
  };

  if (loading) return <h2>Đang tải admin panel...</h2>;

  return (
    <div>
      <h1 className="page-title">Admin Panel</h1>

      <div className="detail-card">
        <h2 className="detail-section-title">Quản lý người dùng</h2>

        {users.length === 0 ? (
          <p>Không có người dùng.</p>
        ) : (
          <div className="bid-list">
            {users.map((user) => (
              <div key={user._id} className="bid-item">
                <p><strong>Tên:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Vai trò:</strong> {user.role}</p>
                <p><strong>Trạng thái:</strong> {user.isBlocked ? "Đã khóa" : "Hoạt động"}</p>

                <button
                  className="secondary-btn"
                  onClick={() => handleToggleBlock(user._id)}
                >
                  {user.isBlocked ? "Mở khóa" : "Khóa tài khoản"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="detail-card">
        <h2 className="detail-section-title">Kiểm duyệt đấu giá</h2>

        {pendingAuctions.length === 0 ? (
          <p>Không có phiên nào chờ duyệt.</p>
        ) : (
          <div className="bid-list">
            {pendingAuctions.map((auction) => (
              <div key={auction._id} className="bid-item">
                <p><strong>Tên sản phẩm:</strong> {auction.title}</p>
                <p><strong>Mô tả:</strong> {auction.description}</p>
                <p><strong>Người đăng:</strong> {auction.sellerId?.name} - {auction.sellerId?.email}</p>
                <p><strong>Giá khởi điểm:</strong> {auction.startPrice?.toLocaleString()} VND</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    className="primary-btn"
                    onClick={() => handleApprove(auction._id)}
                  >
                    Duyệt
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => handleReject(auction._id)}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanelPage;