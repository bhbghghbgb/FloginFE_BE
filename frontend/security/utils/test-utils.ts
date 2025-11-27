import { SecurityTestResult } from "../types";

export class SecurityTestReporter {
  private results: SecurityTestResult[] = [];

  addResult(result: SecurityTestResult) {
    this.results.push(result);
    this.logResult(result);
  }

  private logResult(result: SecurityTestResult) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    const severity = `[${result.severity}]`;
    console.log(`${status} ${severity} ${result.testName}`);
    if (!result.passed) {
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual: ${result.actual}`);
      if (result.recommendation) {
        console.log(`   Recommendation: ${result.recommendation}`);
      }
    }
  }

  getResults(): SecurityTestResult[] {
    return this.results;
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;
    const critical = this.results.filter(
      (r) => r.severity === "CRITICAL" && !r.passed
    ).length;

    return {
      total,
      passed,
      failed,
      critical,
      score: Math.round((passed / total) * 100),
    };
  }
}

export function createTestResult(
  testName: string,
  severity: SecurityTestResult["severity"],
  passed: boolean,
  passingExpression: string,
  expected: string,
  actual: string,
  description: string,
  request?: any,
  response?: any,
  recommendation?: string
): SecurityTestResult {
  return {
    testName,
    severity,
    passed,
    passingExpression,
    description,
    request,
    response,
    expected,
    actual,
    recommendation,
  };
}

// Common test payloads
export const SQL_INJECTION_PAYLOADS = [
  "' OR '1'='1",
  "' UNION SELECT username, password FROM users --",
  "'; DROP TABLE users; --",
  "' OR 1=1--",
  "admin'--",
  "' OR 'a'='a",
];

export const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "<svg onload=alert('XSS')>",
  "javascript:alert('XSS')",
  "<body onload=alert('XSS')>",
  "<iframe src='javascript:alert(`XSS`)'>",
];

export const TEST_PRODUCT = {
  name: "Security Test Product",
  price: 1000,
  quantity: 10,
  description: "Test product for security testing",
  category: "Security",
};

export const COMMON_PATHS = [
  "/api/products",
  "/api/auth/login",
  "/api/users",
  "/admin",
  "/backup",
  "/.env",
  "/config.json",
];
