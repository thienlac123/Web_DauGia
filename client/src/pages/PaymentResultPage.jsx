import { useLocation, Link } from "react-router-dom";

function PaymentResultPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const success = params.get("success") === "1";
  const message = params.get("message");

  return (
    <div style={{ padding: "24px" }}>
      <h1>{success ? "Thanh toán thành công" : "Thanh toán thất bại"}</h1>
      {message && <p>{decodeURIComponent(message)}</p>}

      <div style={{ marginTop: "16px" }}>
        <Link to="/bidder/dashboard">Về trang buyer</Link>
      </div>
    </div>
  );
}

export default PaymentResultPage;