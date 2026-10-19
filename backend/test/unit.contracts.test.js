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

describe("API unit contracts", () => {
  describe("missing required field → 400/422", () => {
    for (const route of ROUTES) {
      const body = route.sample_body;
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length < 2) continue;
      for (const omitKey of Object.keys(body)) {
        it(`${route.method} ${route.path} missing '${omitKey}' → 400/422`, async () => {
          const partial = Object.fromEntries(Object.entries(body).filter(([k]) => k !== omitKey));
          const requestPath = route.request_path || route.path;
          const response = await fetch(`${BASE_URL}${requestPath}`, {
            method: route.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partial),
          });
          expect([400, 422]).toContain(response.status);
        });
      }
    }
  });

  describe("auth rejection → 401", () => {
    for (const route of ROUTES) {
      if (!route.auth_required) continue;
      it(`${route.method} ${route.path} without token → 401`, async () => {
        const requestPath = route.request_path || route.path;
        const response = await fetch(`${BASE_URL}${requestPath}`, { method: route.method });
        expect(response.status).toBe(401);
      });
    }
  });

  describe("wrong method → 405", () => {
    for (const route of ROUTES) {
      const wrong = route.method === "GET" ? "POST" : "GET";
      it(`wrong method ${wrong} on ${route.path} → 405`, async () => {
        const requestPath = route.request_path || route.path;
        const response = await fetch(`${BASE_URL}${requestPath}`, { method: wrong });
        expect(response.status).toBe(405);
      });
    }
  });
});
