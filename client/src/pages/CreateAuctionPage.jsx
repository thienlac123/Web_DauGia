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

      setMessage("Tạo phiên đấu giá thành công");
      navigate(`/auctions/${data.auction._id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo phiên đấu giá thất bại");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tạo phiên đấu giá</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="startPrice"
            placeholder="Giá khởi điểm"
            value={formData.startPrice}
            onChange={handleChange}
            required
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="minBidStep"
            placeholder="Bước giá tối thiểu"
            value={formData.minBidStep}
            onChange={handleChange}
            required
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            style={{ width: "400px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            style={{ width: "400px" }}
          />
        </div>

        <button type="submit">Tạo phiên đấu giá</button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
    </div>
  );
}

export default CreateAuctionPage;