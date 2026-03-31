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
        ...formData,
        startPrice: Number(formData.startPrice),
        minBidStep: Number(formData.minBidStep),
        images,
      };

      await createAuction(payload, token);
      setMessage("Tạo phiên đấu giá thành công, đang chờ admin duyệt ✅");
      setTimeout(() => navigate("/seller/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo phiên đấu giá thất bại");
    }
  };

  const inputStyle = "w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600";
  const labelStyle = "text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2 block ml-2";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase italic bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            Tạo đấu giá mới
          </h1>
          <p className="text-slate-500 text-lg border-l-2 border-blue-500 pl-4">
            Cung cấp thông tin chi tiết để thu hút những người đấu giá tiềm năng nhất.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* PHẦN 1: THÔNG TIN SẢN PHẨM */}
          <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-xl font-black mb-8 uppercase italic flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs not-italic">01</span>
              Thông tin sản phẩm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelStyle}>Tên sản phẩm</label>
                <input type="text" name="title" className={inputStyle} placeholder="Ví dụ: iPhone 15 Pro Max New 100%" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Mô tả chi tiết</label>
                <textarea name="description" className={inputStyle} rows="4" placeholder="Mô tả các đặc điểm nổi bật..." value={formData.description} onChange={handleChange} />
              </div>
              <div>
  <label className={labelStyle}>Danh mục</label>
  <select 
    name="category" 
    className={inputStyle + " appearance-none cursor-pointer"} 
    value={formData.category} 
    onChange={handleChange}
    required
  >
    <option value="" className="bg-[#020617]">-- Chọn danh mục --</option>
    <option value="Điện thoại" className="bg-[#020617]">ĐIỆN THOẠI</option>
    <option value="Đồng hồ" className="bg-[#020617]">ĐỒNG HỒ</option>
    <option value="Giày" className="bg-[#020617]">GIÀY</option>
    <option value="Máy tính" className="bg-[#020617]"> MÁY TÍNH</option>
    <option value="Máy ảnh" className="bg-[#020617]">MÁY ẢNH</option>
    <option value="Bàn phím" className="bg-[#020617]">BÀN PHÍM</option>
  </select>
</div>
              <div>
                <label className={labelStyle}>Tình trạng</label>
                <input type="text" name="condition" className={inputStyle} placeholder="Mới, Like New, 99%..." value={formData.condition} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Địa điểm</label>
                <input type="text" name="location" className={inputStyle} placeholder="Hà Nội, TP. HCM..." value={formData.location} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* PHẦN 2: GIÁ & THỜI GIAN */}
          <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-xl font-black mb-8 uppercase italic flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs not-italic">02</span>
              Giá & Thời gian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Giá khởi điểm (VND)</label>
                <input type="number" name="startPrice" className={inputStyle} placeholder="0" value={formData.startPrice} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelStyle}>Bước giá tối thiểu (VND)</label>
                <input type="number" name="minBidStep" className={inputStyle} placeholder="50.000" value={formData.minBidStep} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelStyle}>Ngày bắt đầu</label>
                <input type="datetime-local" name="startTime" className={inputStyle} value={formData.startTime} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelStyle}>Ngày kết thúc</label>
                <input type="datetime-local" name="endTime" className={inputStyle} value={formData.endTime} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* PHẦN 3: HÌNH ẢNH */}
          <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h2 className="text-xl font-black mb-8 uppercase italic flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs not-italic">03</span>
              Hình ảnh minh họa
            </h2>
            <div className="space-y-4">
              <input type="text" name="image1" className={inputStyle} placeholder="Link ảnh chính (URL)" value={formData.image1} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="image2" className={inputStyle} placeholder="Link ảnh phụ 1" value={formData.image2} onChange={handleChange} />
                <input type="text" name="image3" className={inputStyle} placeholder="Link ảnh phụ 2" value={formData.image3} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* NÚT SUBMIT */}
          <div className="pt-6">
            <button type="submit" className="w-full py-6 bg-white text-[#020617] font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-500/10 uppercase tracking-[0.2em]">
              KÍCH HOẠT PHIÊN ĐẤU GIÁ
            </button>
            {message && (
              <p className={`mt-6 text-center text-sm font-bold p-4 rounded-xl border ${
                message.includes("thành công") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}>
                {message}
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateAuctionPage;