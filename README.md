# 236983_TranMinhNhieu

Đề tài: Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng đám mây.
Đã cấu hình MongoDB Atlas: Database 236983_TranMinhNhieu, collection foods.

## Triển khai (Deployment)

- **Frontend đã triển khai:** [https://web-236983.onrender.com](https://web-236983.onrender.com) (Docker Image: `nhieu236983/frontend:latest`, Biến môi trường: `BACKEND_URL=https://api-236983.onrender.com`)
- **Backend API đã triển khai:** [https://api-236983.onrender.com](https://api-236983.onrender.com) (Docker Image: `nhieu236983/backend:latest`, Biến môi trường: `MONGODB_URI`)
  - Kiểm tra trạng thái: [https://api-236983.onrender.com/health](https://api-236983.onrender.com/health)
  - API danh sách món ăn: [https://api-236983.onrender.com/api/foods](https://api-236983.onrender.com/api/foods)

## Thông tin nộp bài

| Trường               | Giá trị                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Link_GitHub          | `https://github.com/tranminhnhieu1091-ctrl/236983_TranMinhNhieu`                               |
| Link_Docker_Backend  | `https://hub.docker.com/r/nhieu236983/backend`                                                 |
| Link_Docker_Frontend | `https://hub.docker.com/r/nhieu236983/frontend`                                                |
| Link_Render_App      | `https://web-236983.onrender.com`                                                              |
| Link_Render_API      | `https://api-236983.onrender.com/api/foods`                                                    |
| Link_Data_MongoDB    | Cluster: `cluster0.hqulsdk.mongodb.net`, Database: `236983_TranMinhNhieu`, Collection: `foods` |
