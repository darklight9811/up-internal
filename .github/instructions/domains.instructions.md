---
applyTo: "**/domains/**"
---

# Service Files Architecture Guidelines

This project follows a domain-driven architecture with tRPC for API layer. Each domain follows a consistent pattern with clear separation of concerns.

## Domain Structure Pattern
Each domain should follow this exact structure:
```
domains/
  {domain-name}/
    index.ts              # Public exports
    schema.ts             # Zod schemas and types
    hooks.ts              # Client-side hooks (optional)
    components/           # React components (optional)
    helpers/              # Shared utilities (optional)
    server/
      index.ts            # Server exports
      table.server.ts     # Drizzle table definitions
      sql.server.ts       # Database access layer
      service.server.ts   # Business logic layer
      router.server.ts    # tRPC router definitions
```

## File Patterns

### table.server.ts
- Define Drizzle schema using `c.table()` from `../../../utils/db/columns`
- Use descriptive column names with proper types
- Include timestamps: `createdAt`, `updatedAt`
- Export table definitions for use in other files

### sql.server.ts
- Contains all database operations for the domain
- Export const object named `{domain}SQL`
- Methods should match service operations: `index`, `show`, `update`, `delete`, `create`
- Use Drizzle query builder with proper error handling
- Include JSDoc comments with `### MARK:` for method sections
- Return appropriate data structures (arrays for index, single objects for show)

### service.server.ts
- Contains business logic and validation
- Export const object named `{domain}Service`
- Thin layer that delegates to SQL layer
- Handle authentication and authorization
- Validate input data before passing to SQL layer
- Transform data as needed for business requirements

### router.server.ts
- Define tRPC routes using `t.router()`
- Export const named `{domain}Router`
- Use appropriate protection: `t.route` (public) or `t.protected` (authenticated)
- Include input validation with Zod schemas
- Handle context (user, cookies) appropriately
- Delegate business logic to service layer

## Coding Standards

### Imports
- Group imports by: external packages, internal utils, domain-specific
- Use absolute imports from `@repo/*` when available
- Import types with `type` keyword when possible

### Error Handling
- Use `TRPCError` for API errors with appropriate codes
- Provide descriptive error messages
- Handle database constraints gracefully

### Naming Conventions
- Service objects: `{domain}Service`
- SQL objects: `{domain}SQL`
- Router objects: `{domain}Router`
- Table objects: descriptive names (plural)

### Type Safety
- Use proper TypeScript types from schema files
- Define input/output types using Zod schemas
- Leverage Drizzle's type inference

### Authentication Pattern
- Protected routes require `UserSystemSchema` user parameter
- Use `ctx.user` from tRPC context
- Validate user permissions in service layer when needed

### Database Operations
- Use transactions for multi-table operations
- Implement proper pagination with `limit` and `offset`
- Include `with` clauses for related data when needed
- Use `returning()` for insert/update operations that need response data

### Response Format
- Index operations return `[data[], pagination]` tuple
- Single item operations return the item directly
- Mutations return the modified/created item
- Use consistent error response format
