# 🧪 FloginFE_BE – Ứng dụng Đăng nhập & Quản lý Sản phẩm  
**Môn học:** Kiểm Thử Phần Mềm – Trường Đại học Sài Gòn  
**GVHD:** Từ Lãng Phiêu  
**Công nghệ:** React 18 + Spring Boot 3.5 + Java 21 + Jest + JUnit5 + Mockito + Cypress + GitHub Actions

---

## 📁 Cấu trúc tổng thể dự án

```
FloginFE_BE/
│
├── frontend/                 # React App (Login + Product)
│   ├── src/
│   │   ├── components/       # Login, ProductForm, ProductList, ProductDetail
│   │   ├── services/         # authService.js, productService.js
│   │   ├── utils/            # validation.js, productValidation.js
│   │   ├── tests/            # Unit, Integration, Mock tests
│   │   └── App.js
│   ├── cypress/              # E2E automation tests
│   ├── package.json
│   └── jest.config.js
│
└── backend/                  # Spring Boot API (Login + Product)
    ├── src/
    │   ├── main/java/com/flogin/
    │   │   ├── controller/   # AuthController, ProductController
    │   │   ├── service/      # AuthService, ProductService
    │   │   ├── repository/   # ProductRepository
    │   │   ├── entity/       # User, Product
    │   │   └── dto/          # LoginRequest, LoginResponse, ProductDto
    │   └── test/java/com/flogin/
    │       ├── AuthServiceTest.java
    │       ├── ProductServiceTest.java
    │       ├── AuthControllerIntegrationTest.java
    │       └── ProductControllerIntegrationTest.java
    └── pom.xml
```

---

## ⚙️ Frontend Setup – React 18 + Jest + Cypress

### 1️⃣ Tạo ứng dụng React
```bash
npx create-react-app frontend
cd frontend
```

### 2️⃣ Cài đặt thư viện cần thiết

#### 🔹 Core
```bash
npm install axios
```

#### 🔹 Testing & Mocking
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-fetch-mock
```

#### 🔹 E2E Automation
```bash
npm install --save-dev cypress
```

#### 🔹 Lint / Format (tùy chọn)
```bash
npm install --save-dev eslint prettier
```

---

### 3️⃣ Cấu hình Jest (`package.json`)
```json
"jest": {
  "testEnvironment": "jsdom",
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov"],
  "moduleDirectories": ["node_modules", "src"]
}
```

---

### 4️⃣ Chạy thử frontend
| Mục đích | Lệnh |
|-----------|------|
| Chạy ứng dụng | `npm start` |
| Chạy unit tests | `npm test` |
| Chạy integration test Login | `npm test -- --testPathPattern=Login` |
| Chạy E2E test | `npx cypress open` hoặc `npm run test:e2e` |
| Sinh báo cáo coverage | `npm test -- --coverage` |

---

## ☕ Backend Setup – Spring Boot 3.5 + Java 21 + JUnit 5 + Mockito

### 1️⃣ Tạo project qua [https://start.spring.io](https://start.spring.io)

**Cấu hình:**
- Spring Boot: `3.5.x`
- Java: `21`
- Project: Maven  
- Group: `com.flogin`
- Artifact: `backend`

**Thêm dependencies:**
- Spring Web  
- Spring Data JPA  
- Lombok  
- Spring Boot DevTools  
- Spring Validation  
- H2 Database *(cho test)*  
- Spring Boot Starter Test  
- Mockito  

---

### 2️⃣ Cấu trúc thư mục (chuẩn Assignment)
```
backend/
├── src/main/java/com/flogin/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── dto/
└── src/test/java/com/flogin/
    ├── AuthServiceTest.java
    ├── ProductServiceTest.java
    ├── AuthControllerIntegrationTest.java
    └── ProductControllerIntegrationTest.java
```

---

### 3️⃣ File `pom.xml` (Spring Boot 3.5 + Java 21)
```xml
<properties>
    <java.version>21</java.version>
    <spring-boot.version>3.5.0</spring-boot.version>
</properties>
```

---

### 4️⃣ Các lệnh chính backend
| Mục đích | Lệnh |
|-----------|------|
| Chạy ứng dụng | `mvn spring-boot:run` |
| Build project | `mvn clean install` |
| Chạy tất cả test | `mvn test` |
| Báo cáo coverage (Jacoco) | `mvn clean test` → `target/site/jacoco/index.html` |

---

## 🔁 CI/CD Setup – GitHub Actions

Tạo file: `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Java
        uses: actions/setup-java@v2
        with:
          java-version: '21'

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Backend Tests
        run: |
          cd backend
          ./mvnw clean test

      - name: Frontend Tests
        run: |
          cd frontend
          npm install
          npm test -- --coverage
```

---

## 🧠 Test Types theo Assignment

| Loại Test | Mục tiêu | Công cụ |
|------------|-----------|----------|
| **Unit Test** | Kiểm tra hàm `validateUsername()`, `validateProduct()` (TDD) | Jest, JUnit5 |
| **Integration Test** | Test component React & API Spring Boot | RTL, MockMvc |
| **Mock Test** | Mock `authService`, `productRepository` | Jest mock, Mockito |
| **E2E Test** | Test toàn bộ flow Login & CRUD Product | Cypress |
| **CI/CD** | Tự động build + test + báo cáo | GitHub Actions |

---

## 🏁 Tác giả
**Nhóm sinh viên:**  
- [Tên thành viên 1]  
- [Tên thành viên 2]  
- [Tên thành viên 3]  
- [Tên thành viên 4]  
- [Tên thành viên 5]  
- [Tên thành viên 6]

**Khoa Công Nghệ Thông Tin – Đại học Sài Gòn**
