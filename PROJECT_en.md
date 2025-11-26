# Flogin - Full Stack Authentication & Product Management System

A full-stack web application demonstrating modern software testing practices with React frontend and Spring Boot backend, featuring authentication, product management, and comprehensive testing including performance testing with k6.

## 📋 Project Overview

Flogin is a comprehensive full-stack application built for educational purposes to demonstrate various software testing methodologies including:

- Unit Testing
- Integration Testing
- Mock Testing
- End-to-End (E2E) Testing
- Performance Testing
- CI/CD Pipeline Implementation

The application provides user authentication with JWT tokens and CRUD operations for product management.

## 🛠 Technologies Used

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking
- **React Hook Form** - Form management
- **Yup** - Validation schemas

### Backend

- **Spring Boot 3.5.8** - Java framework
- **Java 21** - Runtime environment
- **Maven** - Dependency management
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework
- **JaCoCo** - Code coverage
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **SQLite** - Database
- **H2** - Test database
- **Spring Data JPA** - Data persistence

### Testing & Performance

- **k6** - Performance and load testing
- **GitHub Actions** - CI/CD pipelines
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **Playwright** - E2E testing

## 📁 Project Structure

```
FloginFE_BE/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/flogin/backend/
│   │   │   ├── config/      # Security, JWT, OpenAPI configuration
│   │   │   ├── controller/  # REST controllers (Auth, Product, Test)
│   │   │   ├── service/     # Business logic (Auth, Product services)
│   │   │   ├── repository/  # Data access layer
│   │   │   ├── entity/      # JPA entities (User, Product, Role)
│   │   │   ├── dto/         # Data transfer objects
│   │   │   └── exception/   # Custom exception handling
│   │   └── test/java/com/flogin/backend/  # Backend tests
│   └── pom.xml             # Maven dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── __tests__/  # Component tests
│   │   ├── contexts/       # React contexts (AuthContext)
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utilities and validation
│   │   └── mocks/          # MSW mock handlers
│   ├── e2e/               # Playwright E2E tests
│   ├── performance/       # k6 performance tests
│   │   ├── login.test.ts
│   │   ├── product.test.ts
│   │   ├── breaking-point.test.ts
│   │   └── k6.config.ts
│   └── package.json       # Frontend dependencies
├── docker-compose.yml     # Multi-container setup
├── nginx.conf            # Nginx configuration
├── Dockerfile.backend    # Backend container
├── Dockerfile.frontend   # Frontend container
└── test-results-index.html # Test reports index
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20** or higher
- **Java 21** or higher
- **Maven 3.9+**
- **Yarn 4.11.0** (enabled via corepack)
- **k6** (for performance testing)

### Local Development

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# The backend will start on http://localhost:8080
# API documentation available at http://localhost:8080/swagger-ui.html
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Enable corepack and install dependencies
corepack enable
yarn install

# Start development server
yarn dev

# The frontend will start on http://localhost:5173
```

### Testing the Application

#### Backend Testing

```bash
cd backend

# Run all tests
mvn test

# Run tests with coverage report
mvn test jacoco:report

# Generate surefire reports
mvn surefire-report:report-only
```

#### Frontend Testing

```bash
cd frontend

# Run unit tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run integration tests
yarn test:integration

# Run mock tests
yarn test:mock

# Run E2E tests (requires backend running)
yarn test:e2e

# Run E2E tests in headed mode
yarn test:e2e:headed
```

#### Performance Testing with k6

```bash
cd frontend

# Install k6 (if not already installed)
# See installation instructions in performance testing section

# Run login performance tests
yarn perf:login

# Run product API performance tests
yarn perf:product

# Run breaking point tests (load capacity)
yarn perf:breaking

# Run all performance tests and generate reports
yarn perf:all
```

#### View Test Reports

After running tests, you can view various reports:

- **Backend Coverage**: `backend/target/site/jacoco/index.html`
- **Backend Unit Tests**: `backend/target/surefire-reports/`
- **Frontend Coverage**: `frontend/coverage/index.html`
- **Frontend HTML Reports**: `frontend/html/`
- **E2E Reports**: `frontend/playwright-report/`
- **Performance Reports**: `frontend/performance/k6-report/`

## 🐳 Docker Deployment

### Production Deployment with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

The application will be available at:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **API Documentation**: http://localhost/api/swagger-ui.html

### Docker Architecture

The Docker setup uses:

- **Frontend Container**: Serves built React app
- **Backend Container**: Spring Boot application
- **Nginx**: Reverse proxy handling API routing (/api → backend)

## 📊 Performance Testing

The project includes comprehensive performance testing using k6 to measure application performance under various load conditions.

### Installation

**macOS:**

```bash
brew install k6
```

**Windows:**

```bash
choco install k6
```

**Linux:**

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Test Scenarios

#### Login Performance Tests

- Smoke tests (1 user) to verify functionality
- Load tests (10-50 concurrent users) for normal load
- Stress tests (100+ users) to identify bottlenecks
- Measures authentication response times and token generation performance

#### Product API Performance Tests

- Product listing under concurrent load
- CRUD operations performance
- Search and filter functionality under stress
- Database query performance metrics

#### Breaking Point Tests

- Gradual load increase to find system limits
- Spike testing for sudden traffic bursts
- Endurance testing for sustained loads
- Identifies maximum concurrent user capacity

### Customization

Use environment variables to customize tests:

```bash
export BASE_URL=http://localhost:8080/api
export USERNAME=testuser
export PASSWORD=Test123
export VUS=10
export DURATION=30s

yarn perf:login
```

## 🔧 Configuration

### Backend Configuration

**`backend/src/main/resources/application.properties`**:

```properties
server.port=8080
spring.datasource.url=jdbc:sqlite:flogin.db
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**E2E Test Configuration** (`application-e2e.properties`):

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
```

### Frontend Configuration

**Environment Variables** (copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📈 Testing Strategy

### 1. Unit Testing

- **Backend**: JUnit + Mockito for service layer testing
- **Frontend**: Vitest + React Testing Library for component testing

### 2. Integration Testing

- **Backend**: Spring Boot Test with @SpringBootTest
- **Frontend**: Component integration with MSW

### 3. Mock Testing

- **Backend**: Mockito for dependency mocking
- **Frontend**: MSW for API mocking

### 4. E2E Testing

- **Playwright**: Cross-browser E2E tests with Page Object Model

### 5. Performance Testing

- **k6**: Load testing, stress testing, and capacity planning
- **Multiple Scenarios**: Smoke, load, stress, and breaking point tests

### 6. CI/CD Pipeline

- **GitHub Actions**: Automated testing on push/PR
- **Test Reports**: Automated report generation and deployment to GitHub Pages

## 🤖 CI/CD Pipeline

The project includes two GitHub Actions workflows:

### 1. CI - Build and Test (`ci.yml`)

- Runs on push and pull requests to main branch
- Executes frontend, backend, E2E, and performance tests
- Generates and uploads test reports as artifacts
- Performance tests run against live backend instance

### 2. Deploy GitHub Pages (`pages.yml`)

- Triggers after CI workflow completes
- Deploys test reports to GitHub Pages
- Provides accessible test results dashboard including performance metrics

## 🎯 Key Features

### Authentication

- JWT-based authentication
- Role-based authorization (USER/ADMIN)
- Secure password storage with BCrypt
- Login/Logout functionality

### Product Management

- CRUD operations for products
- Form validation
- Protected routes
- Responsive UI

### Testing Coverage

- Comprehensive test suites at all levels
- Performance and load testing
- Code coverage reporting
- Automated test execution
- Visual test reports

## 📝 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/test/public` - Public endpoint
- `GET /api/test/user` - User role required
- `GET /api/test/admin` - Admin role required

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (ADMIN)
- `PUT /api/products/{id}` - Update product (ADMIN)
- `DELETE /api/products/{id}` - Delete product (ADMIN)

## 🔍 Troubleshooting

### Common Issues

1. **Node.js version mismatch**

   ```bash
   # Use Node 20 or higher
   node --version
   ```

2. **Java version issues**

   ```bash
   # Ensure Java 21 is installed
   java --version
   ```

3. **Yarn installation**

   ```bash
   # Enable corepack for Yarn 4
   corepack enable
   ```

4. **k6 installation**

   - Follow platform-specific installation instructions above
   - Verify with `k6 version`

5. **Port conflicts**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Use `yarn dev --port 3000`

## 📚 Additional Documentation

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [k6 Documentation](https://k6.io/docs)

## 👥 Development

This project was developed as part of a University Software Testing course to demonstrate comprehensive testing methodologies in a full-stack application environment, including performance testing and CI/CD integration.

---

_For detailed test reports, coverage analysis, and performance metrics, check the GitHub Pages deployment after running the CI/CD pipeline._
