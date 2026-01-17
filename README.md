# Todo List Application - Multi-Tier Architecture

Ứng dụng Todo List được xây dựng với kiến trúc multi-tier gồm Frontend (React), Backend (Node.js/Express), và Database (PostgreSQL), được đóng gói bằng Docker và Docker Compose.

## 🏗️ Kiến trúc

```
┌─────────────┐
│  Frontend   │  React + Nginx (Port 3000)
│   (React)   │
└──────┬──────┘
       │
       │ HTTP REST API
       │
┌──────▼──────┐
│   Backend   │  Node.js + Express (Port 5000)
│   (API)     │
└──────┬──────┘
       │
       │ PostgreSQL Protocol
       │
┌──────▼──────┐
│  Database   │  PostgreSQL (Port 5432)
│ (PostgreSQL)│
└─────────────┘
```

## 📁 Cấu trúc Project

```
.
├── backend/          # Backend API server
│   ├── server.js    # Express server và routes
│   ├── package.json
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Cách chạy với Docker Compose

### 1. Chuẩn bị môi trường

Copy file `.env.example` thành `.env` (hoặc dùng giá trị mặc định):

```bash
cp .env.example .env
```

### 2. Build và chạy tất cả services

```bash
docker-compose up --build
```

Lệnh này sẽ:
- Build images cho frontend và backend
- Tạo PostgreSQL database container
- Chạy tất cả services trên Docker network

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api/todos
- **Health Check**: http://localhost:5001/health

> **Lưu ý**: Backend port mặc định là 5001 để tránh conflict với AirPlay Receiver trên macOS (port 5000).

### 4. Dừng services

```bash
docker-compose down
```

Để xóa cả volumes (database data):

```bash
docker-compose down -v
```

## 📝 API Endpoints

- `GET /api/todos` - Lấy tất cả todos
- `GET /api/todos/:id` - Lấy todo theo ID
- `POST /api/todos` - Tạo todo mới
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo
- `GET /health` - Health check

## 🎨 Tính năng

- ✅ Thêm todo với title và description
- ✅ Đánh dấu hoàn thành/chưa hoàn thành
- ✅ Xóa todo
- ✅ Giao diện tối giản, hiện đại với gradient màu tím
- ✅ Responsive design
- ✅ Real-time updates

## 🐳 Docker Images

- **Frontend**: Multi-stage build với React build và Nginx
- **Backend**: Node.js 18 Alpine
- **Database**: PostgreSQL 15 Alpine

## 📦 Đóng gói

Tất cả các components đã được đóng gói và sẵn sàng cho CI/CD pipeline:

- Dockerfiles cho từng service
- Docker Compose file để orchestrate
- Health checks cho tất cả services
- Network isolation với Docker networks
- Volume persistence cho database

## 🔧 Development

### Chạy riêng từng service (không dùng Docker):

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Database:** Cần PostgreSQL chạy trên localhost:5432

## 📄 License

MIT
