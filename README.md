# 🔨 LTD Auction - Hệ thống Đấu giá Trực tuyến Thời gian thực

**Đồ án môn học:** Công cụ và Môi trường Phát triển Phần mềm  
[cite_start]**Trường:** Đại học Công nghệ TP.HCM (HUTECH) - Chương trình Việt-Nhật (VJIT)   
[cite_start]**Nhóm thực hiện:** Nhóm LTD (Nguyễn Thành Lộc & Cộng sự) 

---

## 📝 Giới thiệu Dự án
LTD Auction là nền tảng đấu giá trực tuyến hiện đại, cho phép người dùng tham gia đấu giá các sản phẩm công nghệ (iPhone, MacBook...) với dữ liệu cập nhật theo thời gian thực. Dự án tập trung vào trải nghiệm người dùng mượt mà và quy trình quản trị dự án chuyên nghiệp.

## 🚀 Công nghệ Sử dụng (Tech Stack)
* [cite_start]**Frontend:** React.js, Vite, Tailwind CSS.
* [cite_start]**Backend:** Node.js, Express.js.
* [cite_start]**Database:** MongoDB.
* [cite_start]**Real-time:** Socket.io (Cập nhật giá thầu tức thì).
* [cite_start]**DevOps:** Docker (Đóng gói ứng dụng)[cite: 35].

## 🛠 Quy trình Phát triển & Quản trị (Workflow)

### [cite_start]1. Quản lý mã nguồn (GitHub) [cite: 17]
Nhóm tuân thủ nghiêm ngặt mô hình phân nhánh chuyên nghiệp:
* [cite_start]`master`: Nhánh sản phẩm ổn định cuối cùng[cite: 19, 23].
* [cite_start]`dev`: Môi trường tích hợp và phát triển chung[cite: 19].
* [cite_start]`feature/tên-nhiệm-vụ/mô-tả`: Nhánh cá nhân cho từng tính năng[cite: 20].
* [cite_start]**Phân quyền:** Nhóm trưởng thực hiện Review Code và Merge tập trung vào nhánh Develop[cite: 22].

### [cite_start]2. Quản trị dự án (Jira) [cite: 24]
* Vận hành theo mô hình Agile/Scrum.
* [cite_start]Quy mô: 10 Epics, 20 Stories và hơn 30 Tasks kỹ thuật[cite: 27].
* [cite_start]Kết nối trực tiếp giữa Jira và GitHub để theo dõi tiến độ[cite: 30].

### [cite_start]3. Kiểm thử & Triển khai [cite: 12, 32]
* [cite_start]Sử dụng Chrome DevTools để kiểm thử Responsive và hiệu suất API[cite: 13, 15].
* [cite_start]Triển khai trên môi trường Cloud (AWS/Azure) thông qua Docker Container[cite: 34, 35].

## [cite_start]🤖 Ứng dụng Trí tuệ nhân tạo (A.I) [cite: 6]
Dự án bắt buộc ứng dụng AI xuyên suốt các giai đoạn:
* [cite_start]**Thiết kế:** Dùng AI hỗ trợ xây dựng Wireframe và phối màu UI trên Figma[cite: 6].
* [cite_start]**Lập trình:** Tối ưu hóa thuật toán xử lý Socket và truy vấn MongoDB[cite: 6].
* [cite_start]**Tài liệu:** AI hỗ trợ soạn thảo nội dung README và báo cáo chi tiết[cite: 6].

## 📦 Hướng dẫn Cài đặt nhanh với Docker
Để đảm bảo môi trường đồng nhất cho cả nhóm, vui lòng sử dụng Docker:

```bash
# Clone dự án
git clone [https://github.com/thienlac123/Web_DauGia.git](https://github.com/thienlac123/Web_DauGia.git)

# Chạy toàn bộ hệ thống (App + Database)
docker-compose up --build
