# Project Structure

## Chạy ứng dụng

### Installation

```bash
# Cài đặt tất cả dependencies
npm run install:all
```

### Development

```bash
# Chạy cả client và server
npm run dev
# hoặc
npm start
```

### Build

```bash
# Build production
npm run build
```

## Package.json Breakdown

### Root (package.json)

- Workspace coordinator
- Scripts để chạy client + server cùng lúc
- Dependencies: `concurrently`, `wait-on`

### ClientApp (package.json)

- React + Vite frontend
- Dependencies: `react`, `react-dom`
- DevDependencies: Vite, TypeScript, React types

### Electron (package.json)

- Electron main process + server
- Dependencies: `better-sqlite3` (SQLite)
- DevDependencies: `electron`

## Lợi ích

✅ Tách biệt dependencies client/server
✅ Dễ maintain từng phần riêng
✅ Có thể scale backend độc lập
✅ Clear folder structure
