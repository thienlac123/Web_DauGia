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

  const getRoleColor = (role) => {
    if (role === "admin") return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    if (role === "seller") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "👨‍💼 Quản trị viên";
    if (role === "seller") return "🏪 Người bán";
    return "👤 Người mua";
  };

  const getStatusColor = (isBlocked) => {
    return isBlocked
      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  };

  const getStatusLabel = (isBlocked) => {
    return isBlocked ? "🔒 Đã khóa" : "✅ Hoạt động";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400">Đang tải admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black uppercase tracking-widest text-white italic">Admin Panel</h1>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-rose-500 to-transparent"></div>
          </div>
          <p className="text-slate-400 font-medium"></p>
        </div>

        {/* SECTION 1: USER MANAGEMENT */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Quản lý người dùng</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>

          {users.length === 0 ? (
            <div className="py-16 text-center bg-[#0f172a]/40 border-2 border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-slate-300 font-bold text-lg uppercase tracking-wide">Không có người dùng</p>
              <p className="text-slate-500 mt-2">Danh sách người dùng sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="group relative bg-[#0f172a]/40 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-1 backdrop-blur-sm"
                >
                  {/* Avatar */}
                  <div className="mb-4 pb-4 border-b border-white/10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-slate-600 rounded-xl flex items-center justify-center text-2xl border border-blue-500/30">
                      👤
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">ID: {user._id?.slice(-6)}</p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Email</p>
                      <p className="text-sm text-slate-300 font-medium break-all">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Vai trò</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Trạng thái</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(user.isBlocked)}`}>
                        {getStatusLabel(user.isBlocked)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleBlock(user._id)}
                      className={`w-full py-2 font-bold rounded-lg transition-all duration-200 text-sm uppercase tracking-wider ${
                        user.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-rose-600 hover:bg-rose-700 text-white"
                      }`}
                    >
                      {user.isBlocked ? "🔓 Mở khóa" : "🔒 Khóa tài khoản"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: PENDING AUCTIONS */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Kiểm duyệt đấu giá</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-amber-500 to-transparent"></div>
          </div>

          {pendingAuctions.length === 0 ? (
            <div className="py-16 text-center bg-[#0f172a]/40 border-2 border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-slate-300 font-bold text-lg uppercase tracking-wide">Không có phiên nào chờ duyệt</p>
              <p className="text-slate-500 mt-2">Tất cả phiên đấu giá đã được xử lý</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingAuctions.map((auction) => (
                <div
                  key={auction._id}
                  className="group relative bg-[#0f172a]/40 border border-amber-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="p-6">
                    {/* Pending Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold uppercase">
                        ⏳ Chờ duyệt
                      </span>
                    </div>

                    {/* Auction Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {auction.title}
                    </h3>

                    {/* Auction Description */}
                    <p className="text-slate-400 mb-4 line-clamp-2">
                      {auction.description || "Không có mô tả"}
                    </p>

                    {/* Seller Info & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Người đăng</p>
                        <p className="text-sm text-slate-300 font-semibold">{auction.sellerId?.name}</p>
                        <p className="text-xs text-slate-500">{auction.sellerId?.email}</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Giá khởi điểm</p>
                        <p className="text-lg font-black text-blue-400">
                          {auction.startPrice?.toLocaleString("vi-VN")}đ
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-wide mb-1">Danh mục</p>
                        <p className="text-sm text-slate-300 font-semibold bg-slate-800/50 px-3 py-1 rounded-lg border border-white/10 inline-block">
                          {auction.category || "Khác"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleApprove(auction._id)}
                        className="flex-1 min-w-[150px] py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl transition-all duration-300 uppercase text-sm tracking-wider shadow-lg hover:shadow-emerald-500/30"
                      >
                        ✅ Duyệt
                      </button>

                      <button
                        onClick={() => handleReject(auction._id)}
                        className="flex-1 min-w-[150px] py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl transition-all duration-300 uppercase text-sm tracking-wider shadow-lg hover:shadow-rose-500/30"
                      >
                        ❌ Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanelPage;