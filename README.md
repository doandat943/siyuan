# SiYuan Client

Ứng dụng desktop client cho SiYuan Knowledge Base.

## Yêu cầu hệ thống

- Node.js 14.0.0 trở lên
- npm 6.0.0 trở lên
- Windows 10 trở lên

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/siyuan-client.git
cd siyuan-client
```

2. Cài đặt dependencies:
```bash
npm install
cd app
npm install
cd ..
```

## Phát triển

Để chạy ứng dụng trong môi trường phát triển:

```bash
npm run dev
```

Lệnh này sẽ:
- Khởi động React development server
- Khởi động Electron với hot reload

## Build ứng dụng

1. Build React app:
```bash
npm run build
```

2. Đóng gói ứng dụng:
```bash
npm run package
```

Sau khi build xong, file cài đặt sẽ được tạo trong thư mục `dist`.

## Cấu trúc thư mục

```
siyuan-client/
├── app/                  # React application
│   ├── src/             # Source code
│   ├── public/          # Static files
│   └── package.json     # React dependencies
├── build/               # Build output
├── dist/                # Packaged application
├── main.js             # Electron main process
└── package.json        # Project configuration
```

## Tính năng

- Kết nối với SiYuan server
- Xác thực người dùng
- Quản lý notebook và document
- Chế độ offline
- Đồng bộ hóa dữ liệu

## Giấy phép

MIT
