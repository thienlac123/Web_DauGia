import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#020617",
      }}
    >
      {/* Header sẽ luôn dính trên cùng nhờ CSS mình đã viết ở bước trước */}
      <Header />

      <main
        style={{
          flex: 1,
          width: "100%",
          boxSizing: "border-box",
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