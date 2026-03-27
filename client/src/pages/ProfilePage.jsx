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
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const data = await updateMyProfile(formData, token);
      alert(data.message || "Cập nhật hồ sơ thành công");

      setUserData(data.user);

      setFormData({
        name: data.user.name || "",
        fullName: data.user.fullName || "",
        phone: data.user.phone || "",
        avatar: data.user.avatar || "",
        address: {
          province: data.user.address?.province || "",
          district: data.user.address?.district || "",
          ward: data.user.address?.ward || "",
          detail: data.user.address?.detail || "",
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h2>Đang tải hồ sơ...</h2>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Hồ sơ cá nhân</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Thông tin hiển thị</h2>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="avatar"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "3px solid #ddd",
                }}
              />
            ) : (
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "#666",
                }}
              >
                Chưa có ảnh
              </div>
            )}
          </div>

          <p><strong>Tên hiển thị:</strong> {userData?.name || "Chưa cập nhật"}</p>
          <p><strong>Họ và tên:</strong> {userData?.fullName || "Chưa cập nhật"}</p>
          <p><strong>Email:</strong> {userData?.email || "Chưa cập nhật"}</p>
          <p><strong>Số điện thoại:</strong> {userData?.phone || "Chưa cập nhật"}</p>
          <p>
            <strong>Địa chỉ:</strong>{" "}
            {[
              userData?.address?.detail,
              userData?.address?.ward,
              userData?.address?.district,
              userData?.address?.province,
            ]
              .filter(Boolean)
              .join(", ") || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Trạng thái hồ sơ:</strong>{" "}
            {userData?.isProfileCompleted ? "Đã hoàn thiện" : "Chưa hoàn thiện"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 12,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Chỉnh sửa hồ sơ</h2>

          <input
            type="text"
            name="name"
            placeholder="Tên hiển thị"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="avatar"
            placeholder="Link ảnh đại diện hoặc base64"
            value={formData.avatar}
            onChange={handleChange}
          />

          {formData.avatar && (
            <div style={{ textAlign: "center" }}>
              <img
                src={formData.avatar}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #ddd",
                }}
              />
            </div>
          )}

          <input
            type="text"
            name="province"
            placeholder="Tỉnh / Thành phố"
            value={formData.address.province}
            onChange={handleChange}
          />

          <input
            type="text"
            name="district"
            placeholder="Quận / Huyện"
            value={formData.address.district}
            onChange={handleChange}
          />

          <input
            type="text"
            name="ward"
            placeholder="Phường / Xã"
            value={formData.address.ward}
            onChange={handleChange}
          />

          <input
            type="text"
            name="detail"
            placeholder="Địa chỉ chi tiết"
            value={formData.address.detail}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Cập nhật hồ sơ"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;