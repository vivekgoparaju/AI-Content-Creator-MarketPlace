# Code Standards — AI Content Creator Marketplace

## 1. Purpose

This document defines the coding conventions, folder organization, naming rules, component design, API contracts, database practices, security requirements, and testing standards for the AI Content Creator Marketplace.

All AI-generated and manually written code must follow these standards.

Before implementing a feature, review:

- `project-overview.md` — product requirements and feature scope.
- `architecture.md` — system boundaries, modules, APIs, and database design.
- `ai-workflow-rules.md` — implementation workflow and development constraints.
- `ui-context.md` — design system and UI behavior.
- `progress-tracker.md` — implementation status and unresolved decisions.

Do not introduce conflicting conventions without updating the relevant context files.

## 2. General Coding Principles

- Write readable, maintainable, modular code.
- Prefer simple solutions over unnecessary abstractions.
- Use descriptive names that communicate purpose.
- Keep functions and components focused on one responsibility.
- Avoid duplicating business logic.
- Reuse established utilities and shared components.
- Validate data at application boundaries.
- Handle expected errors explicitly.
- Avoid hardcoded secrets, credentials, and environment-specific URLs.
- Remove unused imports, dead code, and temporary debugging statements.
- Avoid unrelated refactoring while implementing a feature.
- Do not claim functionality is implemented or tested unless it has been verified.

## 3. Project Technology Standards

| Layer | Standard |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| Styling | Tailwind CSS |
| Frontend language | Follow the existing JavaScript or TypeScript setup |
| Backend | Python |
| Backend framework | Use the existing framework; use FastAPI for a new setup unless otherwise approved |
| Database | MySQL |
| API communication | REST with JSON |
| Authentication | One consistently implemented secure session or token strategy |
| Configuration | Environment variables |
| Version control | Git |

Do not migrate JavaScript to TypeScript, replace the backend framework, or introduce new libraries without a clear requirement.

Use the dependency versions already installed whenever possible.

## 4. Naming Conventions

### 4.1 React and Frontend

| Element | Convention | Example |
|---|---|---|
| React components | PascalCase | `CreatorCard.jsx` |
| Page components | PascalCase | `CreatorProfilePage.jsx` |
| Custom hooks | camelCase with `use` prefix | `useAuth.js` |
| Service modules | camelCase | `creatorService.js` |
| Utility modules | camelCase | `formatDate.js` |
| Variables | camelCase | `creatorProfile` |
| Functions | camelCase | `fetchCreators()` |
| Constants | UPPER_SNAKE_CASE for true constants | `MAX_PAGE_SIZE` |
| CSS utility classes | Tailwind conventions | `flex items-center gap-4` |
| Boolean variables | Descriptive boolean names | `isLoading`, `hasResults` |
| Event handlers | `handle` prefix | `handleBriefSubmit()` |

Use `.jsx` for React components in a JavaScript project. If the project already uses TypeScript, use `.tsx` for components and follow the existing convention.

### 4.2 Python Backend

| Element | Convention | Example |
|---|---|---|
| Modules | snake_case | `creator_service.py` |
| Functions | snake_case | `get_creator_profile()` |
| Variables | snake_case | `creator_profile` |
| Classes | PascalCase | `CreatorService` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Private helpers | Leading underscore where appropriate | `_validate_brief()` |
| Database models | PascalCase | `CreatorProfile` |
| Request/response schemas | PascalCase with descriptive suffixes | `BriefCreate`, `BriefResponse` |
| Test functions | `test_` prefix | `test_creator_search()` |

### 4.3 Database

- Use `snake_case` for table and column names.
- Use consistent primary-key names, preferably `id`.
- Use foreign-key names such as `creator_profile_id` and `brand_user_id`.
- Use explicit names for indexes and constraints where practical.
- Store timestamps consistently.
- Use plural or singular table names consistently with the existing schema; do not mix conventions arbitrarily.

Example:

```sql
CREATE TABLE creator_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    display_name VARCHAR(150) NOT NULL,
    bio TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This is an illustrative example. Follow the project's actual schema and migration process before creating or changing tables.

## 5. Frontend Code Standards

### 5.1 Component Design

- Keep components small and focused.
- Extract reusable UI into shared components.
- Keep page-level orchestration separate from reusable presentation.
- Avoid large components containing unrelated forms, data-fetching logic, and business rules.
- Use props to pass data and callbacks explicitly.
- Use React state and hooks consistently.
- Do not mutate React state directly.
- Use stable keys when rendering lists.
- Avoid unnecessary effects and duplicated state.
- Follow the existing routing approach.

Example:

```jsx
function CreatorCard({ creator, onSelect }) {
  return (
    <article className="rounded-xl border p-4">
      <h2 className="font-semibold">
        {creator.display_name}
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        {creator.specialization}
      </p>

      <button
        type="button"
        onClick={() => onSelect(creator.id)}
        className="mt-4 rounded-lg px-4 py-2"
      >
        View Profile
      </button>
    </article>
  );
}

export default CreatorCard;
```

The example demonstrates component structure. Adapt field names to the actual API response contract.

### 5.2 State Management

- Use local component state for isolated UI interactions.
- Use shared context or the existing state-management solution for cross-screen authentication state.
- Avoid adding a global state library without a clear need.
- Keep derived values derived rather than storing unnecessary duplicates.
- Reset state when switching between unrelated records where appropriate.
- Keep form input behavior predictable.
- Prevent duplicate submissions when requests are in progress.

### 5.3 API Communication

- Keep HTTP requests in the established service layer.
- Do not scatter direct `fetch()` calls across unrelated components.
- Use a shared API client where appropriate.
- Handle network failures and unsuccessful responses.
- Validate response assumptions before accessing nested fields.
- Avoid embedding backend business rules in frontend components.
- Read API base URLs from the appropriate frontend environment configuration.
- Never put backend secrets in Vite environment variables exposed to browser code.

Example:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function fetchCreators(params = {}) {
  const url = new URL(
    `${API_BASE_URL}/api/v1/creators`
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to load creators.");
  }

  return response.json();
}
```

This example assumes cookie-based authentication. If bearer-token authentication is selected, use the established authorization-header strategy instead. The shared API client must follow the actual backend response and CSRF contracts.

### 5.4 UI States

Every data-dependent screen must handle the states relevant to its workflow:

- Loading
- Success
- Empty results
- Validation errors
- Network or server errors
- Unauthorized access

For creator discovery, show a helpful empty state when no profiles match the active filters.

For portfolio pages, handle missing optional media and metadata without breaking the layout.

For AI-assisted briefs, preserve the user's original input when generation fails, when safe to do so.

### 5.5 Accessibility and Responsive Design

- Use semantic HTML elements.
- Provide accessible names for form fields and interactive controls.
- Associate validation messages with relevant inputs.
- Support keyboard navigation.
- Maintain readable text contrast.
- Use meaningful alternative text for informative images.
- Avoid communicating verification status using color alone.
- Use responsive Tailwind utilities for mobile, tablet, and desktop layouts.
- Provide visible focus states.
- Do not use clickable non-interactive elements where buttons or links are appropriate.

## 6. Tailwind CSS Standards

- Use Tailwind CSS utilities for normal styling.
- Follow the existing Tailwind configuration and version.
- Reuse shared UI components for repeated patterns.
- Keep class names readable and logically grouped.
- Use responsive modifiers where required.
- Use the project's existing design tokens or theme configuration.
- Avoid arbitrary values when an established design token already meets the requirement.
- Do not introduce inline styles for ordinary layout or styling without a specific reason.
- Avoid adding another CSS framework.
- Keep complex conditional class logic readable; use the project's existing helper if available.

Maintain consistent styling for:

- Buttons and links
- Form fields and validation messages
- Cards and portfolio grids
- Navigation and page layouts
- Loading indicators and empty states
- Verification labels
- Dialogs and confirmation actions

Do not redesign unrelated screens while implementing a feature.

## 7. Python Backend Standards

### 7.1 Code Organization

Follow the separation defined in `architecture.md`:

- `api/` — HTTP endpoints and request handling.
- `services/` — application and business logic.
- `schemas/` — request and response validation.
- `models/` — database models.
- `repositories/` — database access, where this layer is used.
- `core/` — configuration, security, and shared dependencies.
- `db/` — database connection and session management.
- `tests/` — automated tests.

Do not create duplicate layers if the existing application already uses a simpler, consistent structure.

### 7.2 Python Style

- Follow PEP 8 conventions.
- Use descriptive function and variable names.
- Prefer type hints for function parameters and return values.
- Use docstrings for public functions and non-obvious business logic.
- Keep functions focused and avoid deeply nested conditionals.
- Use explicit exception handling.
- Avoid bare `except:` clauses.
- Avoid mutable default arguments.
- Use the project's established formatter and linter when configured.

Example:

```python
def normalize_content_type(content_type: str) -> str:
    """Normalize a supported portfolio content type."""
    return content_type.strip().lower()
```

Normalization must not replace validation against the application's supported content types.

### 7.3 API Route Handlers

- Keep endpoint functions focused on HTTP concerns.
- Validate request data before executing business operations.
- Delegate non-trivial business logic to service functions.
- Apply authentication and authorization consistently.
- Return documented response schemas.
- Use appropriate HTTP status codes.
- Avoid returning ORM objects directly when doing so could expose unintended fields.
- Do not reveal database exceptions or stack traces to clients.

### 7.4 Error Handling

- Handle expected failures explicitly.
- Use the backend framework's standard exception mechanism.
- Return consistent error codes and user-safe messages.
- Log unexpected failures without logging credentials or sensitive content.
- Do not silently swallow exceptions.
- Avoid returning a successful response when the underlying operation failed.

## 8. Database and ORM Standards

- Use parameterized queries or safe ORM query construction.
- Keep SQL injection prevention at the database access boundary.
- Use explicit foreign keys and appropriate constraints.
- Use transactions for operations that must succeed or fail together.
- Avoid N+1 query patterns where practical.
- Add indexes for frequent search and relationship queries.
- Use migrations or a controlled schema-update process.
- Do not modify production schemas manually without recording the change.
- Avoid destructive schema changes without explicit approval.
- Keep schema definitions consistent with API validation and application models.

### Relationship rules

- A creator profile must reference a valid user.
- A portfolio item must reference a valid creator profile.
- Portfolio-tool relationships must reference valid portfolio items and AI tools.
- A creative brief must reference its owning Brand/Agency user.
- Verification records must reference valid subjects.
- Referential integrity must be maintained when deleting or updating related records.

Choose and document an appropriate deletion policy, such as restricted deletion or deliberate cascading, before implementing destructive operations.

## 9. Authentication and Security Standards

- Never store plaintext passwords.
- Use a suitable password-hashing algorithm if local password authentication is implemented.
- Use the approved authentication mechanism consistently.
- Enforce permissions on the backend.
- Verify resource ownership before updates and deletions.
- Protect authenticated state-changing requests according to the chosen authentication strategy.
- Validate user input on the backend.
- Apply appropriate request-size limits.
- Restrict CORS to approved frontend origins.
- Keep API keys, database credentials, and signing secrets outside source control.
- Use secure transport for public deployments.
- Avoid exposing unnecessary personal information in API responses.
- Never rely on hidden frontend buttons as the only authorization mechanism.

### Resource ownership

Creators may edit their own profiles and portfolio items.

Brands/Agencies may manage their own creative briefs.

Any exception must be explicitly defined in the product and architecture specifications.

## 10. API Standards

- Use the documented REST API prefix `/api/v1`.
- Use HTTP methods according to the intended operation.
- Use JSON for API request and response bodies unless an endpoint requires another content type.
- Keep endpoint naming consistent.
- Validate request bodies, path parameters, and query parameters.
- Document response schemas and error behavior.
- Use pagination for potentially large result sets.
- Bound page sizes and other user-controlled query limits.
- Keep API behavior consistent with the frontend service layer.

### Example endpoint conventions

| Operation | Method | Endpoint |
|---|---|---|
| Search creators | GET | `/api/v1/creators` |
| Retrieve creator | GET | `/api/v1/creators/{id}` |
| Update own profile | PUT | `/api/v1/creators/me` |
| Create portfolio item | POST | `/api/v1/portfolio` |
| Create creative brief | POST | `/api/v1/briefs` |
| Generate brief suggestions | POST | `/api/v1/ai/brief-builder` |

Do not introduce duplicate endpoints for the same behavior without a documented reason.

## 11. AI-Assisted Brief Builder Standards

- Keep AI provider calls in a dedicated backend service.
- Keep provider-specific implementation details out of frontend components.
- Use an explicit schema for generated brief data.
- Validate AI responses before returning them to the frontend.
- Treat model output as untrusted input.
- Restrict generated values to supported formats and enumerations.
- Identify missing or uncertain information explicitly.
- Distinguish user-provided information from AI-generated suggestions.
- Never fabricate licensing rights, commercial-use permissions, creator credentials, or verification status.
- Do not save or publish a brief automatically merely because generation succeeded.
- Allow users to review and edit suggestions before saving.
- Handle timeouts, rate limits, malformed responses, and unavailable providers.
- Keep API credentials on the backend.
- Avoid unnecessary generation requests and duplicate submissions.
- Do not log confidential prompts or generated content unless there is a documented need.

### Brief field handling

- Required fields must satisfy backend validation before saving.
- Optional fields may remain empty.
- Unspecified commercial-use requirements must remain unknown.
- Inferred styles and formats must be presented as suggestions until approved.
- Invalid AI output must not be treated as a valid saved brief.

## 12. Creator Portfolio and Verification Standards

### Portfolio metadata

Portfolio items should capture applicable information about:

- Content type
- Skills demonstrated
- AI tools and models used
- Workflow information
- Aspect ratio and output format
- Commercial-use or licensing information, when known

Do not require optional metadata that the product specification does not make mandatory.

### Verification indicators

- Keep self-reported and verified claims distinguishable.
- Never hardcode a verified status merely to improve the appearance of a profile.
- Do not infer independent verification from the presence of a portfolio item.
- Update verification status only through the defined verification process.
- Ensure verification labels accurately describe what was checked.

Demo data may contain illustrative verification records if they are clearly identified as sample data.

## 13. Environment Configuration

- Store environment-specific configuration in environment variables.
- Keep real `.env` files out of Git.
- Maintain `.env.example` with placeholders only.
- Validate required settings during application startup.
- Use a configurable frontend API base URL.
- Never expose backend-only credentials through Vite client-side variables.

Example frontend configuration:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Example backend configuration:

```dotenv
APP_ENV=development
DATABASE_URL=
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

These files contain examples, not production credentials. Use the actual connection format and authentication settings chosen by the project.

## 14. Testing Standards

### Frontend tests

- Test critical user interactions.
- Test form validation and submission.
- Test creator search and filter combinations.
- Test empty and error states.
- Test AI-generated brief editing.
- Test role-aware navigation.
- Run the production build.

### Backend tests

- Test request validation and response formats.
- Test authentication and role permissions.
- Test creator profile and portfolio operations.
- Test filtering and pagination.
- Test brief ownership and CRUD operations.
- Test AI output validation and provider failures.
- Test expected error status codes.

### Database tests

- Verify schema relationships and constraints.
- Verify uniqueness rules.
- Verify migrations.
- Verify search queries against representative data.
- Verify transaction behavior where applicable.

### Test data

- Use isolated test data and a test database where possible.
- Do not run destructive tests against production data.
- Keep test credentials separate from real credentials.
- Avoid relying on an external AI provider for every automated test; mock the provider where appropriate.

## 15. Git and File Management Standards

- Make focused changes for one feature at a time.
- Use descriptive commit messages if commits are part of the workflow.
- Do not commit secrets, temporary files, local database dumps, or build artifacts.
- Do not edit generated dependency files manually unless required.
- Do not overwrite unrelated user changes.
- Avoid broad formatting changes during feature development.
- Keep Markdown context files synchronized with approved decisions.
- Review the changed-file list before completing a feature.

## 16. Performance and Reliability

- Avoid unnecessary React re-renders and repeated network requests.
- Paginate creator search results.
- Add database indexes based on actual query needs.
- Avoid fetching complete portfolio media files when only metadata is needed.
- Apply sensible request and upload size limits.
- Handle AI provider timeouts.
- Prevent duplicate form submissions where appropriate.
- Provide a manual brief-creation path if the AI service is unavailable.
- Avoid introducing caching or background processing unless justified by the requirements.

## 17. Code Review Checklist

Before considering a feature complete, verify the following:

### General

- [ ] Changes match the approved specifications.
- [ ] Naming conventions are consistent.
- [ ] No unnecessary dependencies were added.
- [ ] No unrelated files were modified.

### Frontend

- [ ] Components have clear responsibilities.
- [ ] API calls use the service layer.
- [ ] Loading, success, error, and empty states are handled.
- [ ] Forms are accessible and validated.
- [ ] Responsive layouts follow `ui-context.md`.

### Backend

- [ ] Input validation is enforced.
- [ ] Authentication and authorization are checked.
- [ ] Resource ownership is verified.
- [ ] Errors use consistent response formats.
- [ ] Sensitive information is not exposed.

### Database

- [ ] Schema and application models agree.
- [ ] Relationships and constraints are valid.
- [ ] Migrations or schema changes are documented.
- [ ] Queries are safe and appropriately bounded.

### AI features

- [ ] AI output is schema-validated.
- [ ] Missing information is handled transparently.
- [ ] Commercial-use requirements are not invented.
- [ ] User approval is required before saving generated suggestions as a brief.
- [ ] Provider failures are handled safely.

### Verification

- [ ] Relevant tests were executed.
- [ ] Frontend build passes when frontend code changes.
- [ ] `progress-tracker.md` reflects the actual implementation status.
- [ ] Remaining limitations and open questions are documented.

## 18. Final Rule

All code must follow this document and the approved architecture.

Prefer simple, secure, readable implementations that support the hackathon's core evaluation criteria: creator profiles and AI portfolios, creative brief definition, creator discovery and filtering, user experience, and a reliable demonstration.

When a coding decision conflicts with an approved specification, do not silently override the specification. Record the conflict in `progress-tracker.md` and resolve it before proceeding.