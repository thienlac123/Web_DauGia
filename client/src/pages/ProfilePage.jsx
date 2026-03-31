import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../services/userService";

function ProfilePage() {
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    phone: "",
    avatar: "",
    address: {
      province: "",
      district: "",
      ward: "",
      detail: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile(token);
      const user = data.user;
      setUserData(user);
      setFormData({
        name: user.name || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        address: {
          province: user.address?.province || "",
          district: user.address?.district || "",
          ward: user.address?.ward || "",
          detail: user.address?.detail || "",
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Không tải được hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["province", "district", "ward", "detail"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = await updateMyProfile(formData, token);
      alert(data.message || "Cập nhật hồ sơ thành công");
      setUserData(data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <i className="fa-solid fa-user-gear text-blue-600"></i>
          Hồ sơ cá nhân
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card: Thông tin hiển thị (Bên trái) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4 flex justify-center">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="avatar"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-slate-400 text-2xl shadow-sm">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                  )}
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{userData?.name || "Người dùng"}</h2>
                  <p className="text-sm text-slate-500">{userData?.email}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Họ và tên:</span>
                    <span className="font-semibold text-slate-700">{userData?.fullName || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="font-semibold text-slate-700">{userData?.phone || "—"}</span>
                  </div>
                  <div className="flex flex-col border-b border-slate-50 pb-2">
                    <span className="text-slate-500 mb-1">Địa chỉ:</span>
                    <span className="font-semibold text-slate-700 leading-relaxed">
                      {[userData?.address?.detail, userData?.address?.ward, userData?.address?.district, userData?.address?.province].filter(Boolean).join(", ") || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${userData?.isProfileCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {userData?.isProfileCompleted ? '● Đã hoàn thiện' : '○ Chưa hoàn thiện'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form: Chỉnh sửa (Bên phải) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 transition-all hover:shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Chỉnh sửa hồ sơ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên hiển thị</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="VD: Thành Lê"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="Nhập đầy đủ họ tên"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="09xxx..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Ảnh đại diện</label>
                  <input
                    type="text"
                    name="avatar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                    placeholder="https://..."
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỉnh / Thành</label>
                  <input
                    type="text"
                    name="province"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.address.province}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quận / Huyện</label>
                  <input
                    type="text"
                    name="district"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.address.district}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phường / Xã</label>
                  <input
                    type="text"
                    name="ward"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.address.ward}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="detail"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  placeholder="Số nhà, tên đường..."
                  value={formData.address.detail}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
                    saving 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"
                  }`}
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {saving ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;