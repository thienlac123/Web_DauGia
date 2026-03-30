const KEY = "compare_auctions";

export const getCompareItems = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const addCompareItem = (auction) => {
  const current = getCompareItems();

  const existed = current.find((item) => item._id === auction._id);
  if (existed) {
    throw new Error("Sản phẩm này đã có trong danh sách so sánh");
  }

  if (current.length > 0) {
    const firstCategory = current[0].category || "";
    const nextCategory = auction.category || "";

    if (firstCategory !== nextCategory) {
      throw new Error("Chỉ có thể so sánh các sản phẩm cùng danh mục");
    }
  }

  if (current.length >= 4) {
    throw new Error("Chỉ được so sánh tối đa 4 sản phẩm");
  }

  const next = [...current, auction];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const removeCompareItem = (auctionId) => {
  const next = getCompareItems().filter((item) => item._id !== auctionId);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const clearCompareItems = () => {
  localStorage.removeItem(KEY);
};