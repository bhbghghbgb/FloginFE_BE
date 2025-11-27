# Flogin - Full Stack Authentication & Product Management System

A full-stack web application demonstrating modern software testing practices with React frontend and Spring Boot backend, featuring authentication, product management, and comprehensive testing including security, performance, and CI/CD pipeline implementation.

## 📋 Project Overview

Flogin is a comprehensive full-stack application built for educational purposes to demonstrate various software testing methodologies including:

- Unit Testing
- Integration Testing
- Mock Testing
- End-to-End (E2E) Testing
- Performance Testing
- Security Testing
- CI/CD Pipeline Implementation

The application provides user authentication with JWT tokens and CRUD operations for product management with a complete security testing suite.

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

### Testing & Security

- **k6** - Performance and load testing
- **OWASP ZAP** - Automated security scanning
- **Vitest Security Tests** - Manual security test scenarios
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
│   │   │   ├── controller/  # REST controllers
│   │   │   ├── service/     # Business logic
│   │   │   ├── repository/  # Data access layer
│   │   │   ├── entity/      # JPA entities
│   │   │   ├── dto/         # Data transfer objects
│   │   │   └── exception/   # Custom exception handling
│   │   └── test/           # Backend tests
│   └── pom.xml             # Maven dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components with tests
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utilities and validation
│   │   └── mocks/          # MSW mock handlers
│   ├── e2e/               # Playwright E2E tests
│   ├── performance/       # k6 performance tests
│   ├── security/          # Security testing suite
│   │   ├── manual-tests/  # Manual security test scenarios
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Security test utilities
│   │   └── zap-config.yml # OWASP ZAP configuration
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
- **Docker** (for OWASP ZAP security scanning)

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

#### Security Testing

```bash
cd frontend

# Run manual security tests
yarn test:security

# Run OWASP ZAP security scan (see Security Testing section for details)
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

# Run breaking point tests
yarn perf:breaking

# Run all performance tests
yarn perf:all
```

## 🛡️ Security Testing

The project includes comprehensive security testing with both automated and manual approaches.

### Manual Security Tests

Manual security tests are written in Vitest and cover common security scenarios:

```bash
cd frontend

# Run all security tests
yarn test:security
```

**Test Scenarios Covered:**

- **SQL Injection** - Input validation and parameterized queries
- **XSS Attacks** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery defenses
- **Authentication Bypass** - Role and permission validation
- **Input Validation** - Data sanitization and validation
- **Rate Limiting** - API abuse prevention
- **Security Headers** - HTTP security headers verification
- **Data Sanitization** - Output encoding and data cleaning

### Automated Security Scanning with OWASP ZAP

#### Local Setup

1. **Ensure Docker is installed and running**

2. **Start the backend in production mode:**

```bash
cd backend
java -jar target/*.jar --spring.profiles.active=prod
```

3. **Run OWASP ZAP scan:**

```bash
cd frontend

docker run --rm \
  --network host \
  -u root \
  -v $(pwd)/zap-reports:/zap/reports:rw \
  -v $(pwd)/security/zap-config.yml:/zap/config.yml:ro \
  -e TEST_USERNAME=testuser \
  -e TEST_PASSWORD=Test123 \
  -t zaproxy/zap-stable zap.sh \
  -cmd -autorun /zap/config.yml \
  -config proxy.port=8090
```

4. **View reports:** Reports will be generated in `frontend/zap-reports/`

#### ZAP Configuration

The `security/zap-config.yml` file configures:

- **Target URL**: Application endpoints to scan
- **Authentication**: Form-based login with test credentials
- **Scan Policies**: Active and passive scanning rules
- **Report Formats**: HTML, JSON, and XML reports
- **Context**: Application context and excluded URLs

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

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

The application will be available at:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **API Documentation**: http://localhost/api/swagger-ui.html

### Docker Architecture

- **Frontend Container**: Serves built React app
- **Backend Container**: Spring Boot application
- **Nginx**: Reverse proxy handling API routing

## 📈 Testing Strategy

### 1. Unit Testing

- **Backend**: JUnit + Mockito for service layer testing
- **Frontend**: Vitest + React Testing Library for component testing

### 2. Integration Testing

- **Backend**: Spring Boot Test with @SpringBootTest
- **Frontend**: Component integration with MSW

### 3. Security Testing

- **Manual Tests**: Vitest-based security scenarios
- **Automated Scanning**: OWASP ZAP comprehensive security audit
- **Coverage**: SQL injection, XSS, CSRF, authentication bypass, etc.

### 4. Performance Testing

- **k6**: Load testing, stress testing, and capacity planning
- **Multiple Scenarios**: Smoke, load, stress, and breaking point tests

### 5. E2E Testing

- **Playwright**: Cross-browser E2E tests with Page Object Model

### 6. CI/CD Pipeline

- **GitHub Actions**: Automated testing on push/PR
- **Test Reports**: Automated report generation and deployment to GitHub Pages

## 🤖 CI/CD Pipeline

The project includes comprehensive GitHub Actions workflows:

### 1. CI - Build and Test (`ci.yml`)

- Runs on push and pull requests to main branch
- Executes frontend, backend, E2E, performance, and security tests
- Generates and uploads test reports as artifacts
- Includes OWASP ZAP automated security scanning

### 2. Deploy GitHub Pages (`pages.yml`)

- Triggers after CI workflow completes
- Deploys test reports to GitHub Pages
- Provides accessible test results dashboard including security and performance metrics

## 🎯 Key Features

### Authentication & Security

- JWT-based authentication with Spring Security
- Role-based authorization (USER/ADMIN)
- Secure password storage with BCrypt
- Comprehensive security testing suite
- Input validation and sanitization

### Product Management

- CRUD operations for products
- Form validation with Yup schemas
- Protected routes with role-based access
- Responsive UI with React components

### Testing Coverage

- Comprehensive test suites at all levels
- Security testing with OWASP ZAP and manual tests
- Performance and load testing with k6
- Code coverage reporting
- Automated test execution and reporting

## 🔧 Configuration

### Backend Configuration

**`application.properties`**:

```properties
server.port=8080
spring.datasource.url=jdbc:sqlite:flogin.db
spring.jpa.hibernate.ddl-auto=update
```

### Frontend Configuration

**Environment Variables**:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🔍 Troubleshooting

### Common Issues

1. **Security Test Dependencies**

   - Ensure Docker is running for OWASP ZAP scans
   - Backend must be running on port 8080 for security tests

2. **Performance Testing**

   - Install k6 using platform-specific instructions
   - Backend must be running for performance tests

3. **Port Conflicts**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Use `yarn dev --port 3000`

## 📚 Additional Documentation

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [k6 Documentation](https://k6.io/docs)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

## 👥 Development

This project was developed as part of a University Software Testing course to demonstrate comprehensive testing methodologies in a full-stack application environment, including security testing, performance testing, and CI/CD integration.

---

_For detailed test reports, security scan results, coverage analysis, and performance metrics, check the GitHub Pages deployment after running the CI/CD pipeline._
