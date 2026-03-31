import { Link } from "react-router-dom";
import { compareFields } from "../utils/compareFields";
import {
  getCompareItems,
  removeCompareItem,
  clearCompareItems,
} from "../services/compareStorage";

import { useEffect, useState } from "react";

function ComparePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCompareItems());
  }, []);

  const handleRemove = (id) => {
    const updated = removeCompareItem(id);
    setItems(updated);
  };

  const handleClear = () => {
    clearCompareItems();
    setItems([]);
  };

  const renderValue = (item, key) => {
    if (key === "image") {
      return item.images && item.images.length > 0 ? (
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-32 h-32 object-cover rounded-2xl mx-auto"
        />
      ) : (
        <div className="w-32 h-32 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500 text-sm">
          No Image
        </div>
      );
    }

    if (key === "currentPrice") {
      return `${item.currentPrice?.toLocaleString("vi-VN")} VND`;
    }

    if (key === "endTime") {
      return item.endTime
        ? new Date(item.endTime).toLocaleString("vi-VN")
        : "-";
    }

    if (key === "description") {
      return item.description || "-";
    }

    return item[key] || "-";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
              So sánh sản phẩm
            </h1>
            <p className="text-slate-400">
              Chỉ so sánh các sản phẩm cùng danh mục.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/auctions"
              className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              Quay lại danh sách
            </Link>
            <button
              onClick={handleClear}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 transition font-bold"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        {items.length < 2 ? (
          <div className="bg-[#0f172a]/40 border border-white/5 rounded-[2rem] p-10 text-center">
            <p className="text-slate-300 text-lg font-semibold">
              Vui lòng chọn ít nhất 2 sản phẩm cùng danh mục để so sánh.
            </p>
            <Link
              to="/auctions"
              className="inline-block mt-6 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold"
            >
              Đi đến danh sách đấu giá
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#0f172a]/40">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-slate-300 font-black w-[220px]">
                    Tiêu chí
                  </th>
                  {items.map((item) => (
                    <th
                      key={item._id}
                      className="p-5 text-center border-l border-white/10"
                    >
                      <div className="space-y-4">
                        <div className="text-xl font-black">{item.title}</div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-600 transition text-sm font-bold"
                        >
                          Bỏ khỏi so sánh
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {compareFields.map((field) => (
                  <tr
                    key={field.key}
                    className="border-b border-white/5 align-top"
                  >
                    <td className="p-5 font-bold text-slate-200 bg-white/[0.02]">
                      {field.label}
                    </td>

                    {items.map((item) => (
                      <td
                        key={item._id + field.key}
                        className="p-5 border-l border-white/10 text-slate-300 text-center"
                      >
                        {renderValue(item, field.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;