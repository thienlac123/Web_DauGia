import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setMessage("");

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      navigate("/auctions");
    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] p-4 relative">
      {/* Background Decor tương tự trang Register */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200/30 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white">
          
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-slate-900 tracking-tight mb-3"
            >
              Chào mừng trở lại
            </motion.h1>
            <p className="text-slate-500 font-medium text-sm">
              Đăng nhập để tiếp tục tham gia phiên đấu giá
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </motion.div>
            </div>

            <div className="flex justify-end px-2">
               <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Quên mật khẩu?
               </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-900 text-white font-bold rounded-[20px] shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all duration-300 mt-6"
              type="submit"
            >
              Đăng nhập ngay
            </motion.button>
          </form>

          {message && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-red-500 text-sm font-semibold bg-red-50 py-2 rounded-lg italic"
            >
              ⚠️ {message}
            </motion.p>
          )}

          <div className="mt-10 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm font-medium">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 underline-offset-4 hover:underline">
                Tạo tài khoản mới
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;