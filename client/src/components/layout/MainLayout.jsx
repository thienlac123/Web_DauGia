import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc", // Màu nền xám xanh rất nhẹ (Slate 50)
      }}
    >
      {/* Header sẽ luôn dính trên cùng nhờ CSS mình đã viết ở bước trước */}
      <Header />

      <main
        style={{
          flex: 1, // Đẩy Footer xuống cuối trang nếu nội dung ngắn
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 20px", // Tăng khoảng cách trên dưới cho thoáng
          boxSizing: "border-box", // Đảm bảo padding không làm vỡ layout
        }}
      >
        {/* Đây là nơi nội dung các trang (Login, Create Auction...) hiển thị */}
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;