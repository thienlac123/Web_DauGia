import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await registerUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      navigate("/auctions");
    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-4">
      {/* Nền mờ trang trí phía sau (tạo cảm giác Figma cao cấp) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/30 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white">
          
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-slate-900 tracking-tight mb-3"
            >
              Tạo tài khoản
            </motion.h1>
            <p className="text-slate-500 font-medium text-sm">
              Gia nhập cộng đồng đấu giá chuyên nghiệp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "name", type: "text", placeholder: "Họ và tên" },
                { name: "email", type: "email", placeholder: "Email" },
                { name: "password", type: "password", placeholder: "Mật khẩu" },
              ].map((field, idx) => (
                <motion.div 
                  key={field.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3 }}
                >
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                  />
                </motion.div>
              ))}
            </div>

            {/* Switch Role Designer Style */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex p-1.5 bg-slate-100 rounded-2xl relative"
            >
              {['buyer', 'seller'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData(p => ({...p, role: r}))}
                  className={`relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    formData.role === r ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {formData.role === r && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10"
                    />
                  )}
                  {r.toUpperCase()}
                </button>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-900 text-white font-bold rounded-[20px] shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all duration-300 mt-6"
              type="submit"
            >
              Đăng ký ngay
            </motion.button>
          </form>

          {message && (
            <p className="mt-4 text-center text-red-500 text-sm font-semibold bg-red-50 py-2 rounded-lg italic">
              ⚠️ {message}
            </p>
          )}

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 underline-offset-4 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;