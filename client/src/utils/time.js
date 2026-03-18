export const getRemainingTime = (endTime) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return "Đã kết thúc";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "upcoming":
      return "Sắp diễn ra";
    case "active":
      return "Đang đấu giá";
    case "ended":
      return "Đã kết thúc";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};