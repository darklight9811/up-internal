---
applyTo: "**/*.test.ts **/*.test.tsx, **/*.test.js, **/*.test.jsx"
---

# Test Creation Instructions

When creating tests, please follow these guidelines to ensure consistency and quality across the codebase.

## Testing Framework

We use `bun:test` for our testing framework. Please use `describe`, `it`, `expect`, and other utilities from `bun:test`.

## File Naming

Test files should be named with the `.test.ts` suffix. For example, a service file named `service.server.ts` should have a corresponding test file named `service.server.test.ts`.

## Mocking

- **Mock Dependencies**: All external dependencies for the module under test should be mocked. This is especially important for database access, external APIs, or any other module that is not part of the unit being tested.
- **`mock.module`**: Use `bun:test`'s `mock.module` to mock entire modules. This ensures that the mocked version is imported by the module under test.
- **Import after Mocking**: The service or module you are testing should be imported *after* you have set up the mocks.

```typescript
// Example
import { mock } from "bun:test";

// Mock the SQL module
const mockSQL = {
  // ... mock functions
};

// Mock the actual SQL import
mock.module("./sql.server", () => ({
  sql: mockSQL,
}));

// Import the service after mocking
import { service } from "./service.server";
```

## Test Structure

- **`describe` blocks**: Use `describe` to group related tests. There should be a main `describe` block for the module/service under test, and nested `describe` blocks for each function or method.
- **`beforeEach`**: Use `beforeEach` to reset mocks and any other state before each test runs. This ensures test isolation.
- **`it` blocks**: Use `it` to define individual test cases. The description should clearly state what the test is verifying.
- **Arrange, Act, Assert**: Structure your tests following the Arrange, Act, Assert pattern.
  1.  **Arrange**: Set up the test, including mock data and mock function implementations (`mockResolvedValue`, `mockReturnValue`, etc.).
  2.  **Act**: Call the function or method you are testing.
  3.  **Assert**: Use `expect` to check the outcome. Verify the return value and that mock functions were called with the expected arguments (`toHaveBeenCalledWith`).

## Mock Data

- **Schema Mocks**: When you need mock data that conforms to a schema, use the mock generator from the corresponding `schema.mock.ts` file (e.g., `mockResource.single()`, `mockUser.many(5)`). This helps ensure your test data is consistent with your data models.
