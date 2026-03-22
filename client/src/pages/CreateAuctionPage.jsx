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

      const payload = {
        ...formData,
        startPrice: Number(formData.startPrice),
        minBidStep: Number(formData.minBidStep),
      };

     const data = await createAuction(payload, token);

setMessage("Tạo phiên đấu giá thành công, đang chờ admin duyệt");
navigate("/seller/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo phiên đấu giá thất bại");
    }
  };

  return (
    <div>
      <h1 className="page-title">Tạo phiên đấu giá</h1>
      <p className="page-subtitle">Điền thông tin để mở một phiên đấu giá mới.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Mô tả"
              value={formData.description}
              onChange={handleChange}
              rows="4"
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