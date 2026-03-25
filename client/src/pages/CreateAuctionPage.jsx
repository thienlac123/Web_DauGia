import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../services/auctionService";

function CreateAuctionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startPrice: "",
    minBidStep: "",
    startTime: "",
    endTime: "",
    category: "",
    location: "",
    condition: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Bạn cần đăng nhập trước");
        return;
      }

      const images = [formData.image1, formData.image2, formData.image3].filter(
        (img) => img.trim() !== ""
      );

      const payload = {
        title: formData.title,
        description: formData.description,
        startPrice: Number(formData.startPrice),
        minBidStep: Number(formData.minBidStep),
        startTime: formData.startTime,
        endTime: formData.endTime,
        category: formData.category,
        location: formData.location,
        condition: formData.condition,
        images,
      };

      await createAuction(payload, token);

      setMessage("Tạo phiên đấu giá thành công, đang chờ admin duyệt");
      navigate("/seller/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo phiên đấu giá thất bại");
    }
  };

  return (
    <div>
      <h1 className="page-title">Tạo phiên đấu giá</h1>
      <p className="page-subtitle">Điền thông tin sản phẩm và thêm ảnh minh họa.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Tên sản phẩm"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Mô tả sản phẩm"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="category"
              placeholder="Danh mục (ví dụ: Điện thoại, Laptop...)"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder="Địa điểm sản phẩm"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="condition"
              placeholder="Tình trạng sản phẩm"
              value={formData.condition}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="startPrice"
              placeholder="Giá khởi điểm"
              value={formData.startPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="minBidStep"
              placeholder="Bước giá tối thiểu"
              value={formData.minBidStep}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image1"
              placeholder="Link ảnh 1"
              value={formData.image1}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image2"
              placeholder="Link ảnh 2"
              value={formData.image2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="image3"
              placeholder="Link ảnh 3"
              value={formData.image3}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn" type="submit">
            Tạo phiên đấu giá
          </button>
        </form>

        {message && <p className="info-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateAuctionPage;