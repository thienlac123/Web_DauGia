import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <div className="hero-banner">
        <h1>Hệ thống đấu giá trực tuyến thời gian thực</h1>
        <p>
          Theo dõi các sản phẩm đang đấu giá, tham gia đặt giá và cập nhật realtime.
        </p>
      </div>

      <div className="detail-card">
        <h2 className="detail-section-title">Khám phá hệ thống</h2>
        <p className="page-subtitle">
          Người dùng có thể xem danh sách phiên đấu giá, tìm kiếm sản phẩm,
          theo dõi thời gian còn lại và tham gia đặt giá trực tiếp.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/auctions">
            <button className="primary-btn">Xem danh sách đấu giá</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;