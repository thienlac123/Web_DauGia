function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "white",
        padding: "24px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "700" }}>
          Web Đấu Giá Trực Tuyến
        </p>
        <p className="footer-text" style={{ margin: 0 }}>
          © 2026 Hệ thống đấu giá trực tuyến thời gian thực bằng JavaScript.
        </p>
      </div>
    </footer>
  );
}

export default Footer;