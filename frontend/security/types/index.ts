export interface SecurityTestResult {
  testName: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  passed: boolean;
  passingExpression: string;
  description: string;
  request?: any;
  response?: any;
  expected: string;
  actual: string;
  recommendation?: string;
}

export interface TestConfig {
  baseUrl: string;
  adminCredentials: {
    username: string;
    password: string;
  };
  zap: {
    host: string;
    port: number;
    apiKey?: string;
  };
}

export interface AuthToken {
  token: string;
  timestamp: number;
}
