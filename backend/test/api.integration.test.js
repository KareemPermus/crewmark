const ROUTES = [
  {
    "method": "GET",
    "path": "/api/health",
    "request_path": "/api/health",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "status"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/employees",
    "request_path": "/api/employees",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/employees/:id",
    "request_path": "/api/employees/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "avatarUrl",
      "createdAt",
      "department",
      "email",
      "firstName",
      "id",
      "jobTitle",
      "lastName",
      "location",
      "phone"
    ],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/employees",
    "request_path": "/api/employees",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "avatarUrl",
      "createdAt",
      "department",
      "email",
      "firstName",
      "id",
      "jobTitle",
      "lastName",
      "location",
      "phone"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/employees/:id",
    "request_path": "/api/employees/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "avatarUrl",
      "createdAt",
      "department",
      "email",
      "firstName",
      "id",
      "jobTitle",
      "lastName",
      "location",
      "phone"
    ],
    "expects_json": true
  },
  {
    "method": "DELETE",
    "path": "/api/employees/:id",
    "request_path": "/api/employees/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "success"
    ],
    "expects_json": true
  }
];
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3001";

function authHeaders(route) {
  if (!route.auth_required) return {};
  const token = process.env.TEST_AUTH_TOKEN || "test-token";
  return { Authorization: `Bearer ${token}` };
}

describe("API integration contracts", () => {
  for (const route of ROUTES) {
    it(`${route.method} ${route.path} should return ${route.success_status}`, async () => {
      const hasBody = route.sample_body && typeof route.sample_body === "object" && !Array.isArray(route.sample_body);
            const requestPath = route.request_path || route.path;
            const response = await fetch(`${BASE_URL}${requestPath}`, {
        method: route.method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(route),
        },
        body: hasBody ? JSON.stringify(route.sample_body) : undefined,
      });

      expect(response.status).toBe(route.success_status);

      if (route.expects_json) {
        const body = await response.json();
        if (Array.isArray(route.response_keys) && route.response_keys.length && body && !Array.isArray(body)) {
          for (const key of route.response_keys) {
            expect(body).toHaveProperty(key);
          }
        }
      }
    });
  }
});
