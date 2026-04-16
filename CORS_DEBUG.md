# 🔧 CORS Debugging Guide

## Các vấn đề phổ biến và cách kiểm tra:

### 1. **Kiểm tra Network tab trong Browser**

- Mở DevTools (F12) → Network tab
- Gọi 1 API
- Tìm request, nếu thấy preflight (OPTIONS) request
  - Nếu OPTIONS thành công (200) ✅
  - Nếu OPTIONS thất bại (CORS error) ❌

### 2. **Response Headers cần có**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 3. **Cách gọi API từ React**

```typescript
// ✅ ĐÚNG - chỉ cần path, không cần full URL
const { data } = useTanstack({
  apiName: "/patients", // Only path
});

// ❌ SAI - không dùng full URL
const { data } = useTanstack({
  apiName: "http://localhost:3000/api/patients", // Full URL
});
```

### 4. **Environment Variables**

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 5. **Console Logs để Debug**

- Xem Console tab trong Browser DevTools
- Sẽ thấy:
  ```
  Request URL: http://localhost:3000/api/patients
  ```

### 6. **Kiểm tra Backend**

- Terminal backend phải show:
  ```
  API Server running on port 3000
  Swagger UI available at http://localhost:3000/api-docs
  ```

## ⚡ Các bước khắc phục:

1. **npm install cors** (nếu chưa)
2. **Restart Electron backend** (Ctrl+C rồi chạy lại)
3. **Clear React cache** (Ctrl+C rồi chạy lại vite)
4. **Kiểm tra Network tab** xem CORS headers có không
5. **Xem Console log** để biết URL được gọi

## 🚨 Nếu vẫn lỗi:

1. Xác nhận backend PORT = 3000
2. Xác nhận React PORT = 5173
3. Xác nhận Origin URL match chính xác (không có `/api`)
4. Kiểm tra allowedHeaders có Authorization không
