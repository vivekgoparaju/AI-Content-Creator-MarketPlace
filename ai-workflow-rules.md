# AI Workflow Rules

## Approach

Build the AI Content Creator Marketplace incrementally using a spec-driven development workflow.

The Markdown context files define the project's requirements, architecture, coding standards, UI expectations, and current implementation progress. Always use these files as the source of truth when planning, implementing, testing, and modifying the application.

### Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python
- **Database:** MySQL
- **Authentication:** Secure authentication with role-based access for Brands/Agencies and Creators
- **AI Features:** AI-Assisted Brief Builder that converts rough creative ideas into structured campaign briefs
- **Development Environment:** Antigravity with Markdown-based project context

### Product Scope

The application connects AI-native creators with brands and creative agencies.

The core product features are:

1. **Creator Profiles and AI Portfolios**
   - Creator name, bio, skills, specialization, and experience
   - AI-generated videos, animations, images, and other creative work
   - Tools and models used for each portfolio item
   - Workflow descriptions and relevant production details
   - Content formats and commercial-use information

2. **Brand and Agency Brief Management**
   - Create and manage creative campaign briefs
   - Define campaign objectives and requirements
   - Specify content type, visual style, aspect ratio, and output format
   - Define commercial-use and licensing requirements

3. **Creator Discovery and Filtering**
   - Search creators by skills, specialization, tools, and content type
   - Apply multiple relevant filters
   - Display clear results and helpful empty states
   - Provide access to creator profiles and portfolio details

4. **AI-Assisted Brief Builder**
   - Accept a rough creative idea in natural language
   - Convert the idea into a structured creative brief
   - Extract campaign objectives, content types, style, formats, and commercial-use requirements when specified
   - Allow users to review and edit generated fields before saving
   - Never silently invent missing campaign requirements

5. **Creator Verification Signals**
   - Display verification indicators for tools, workflows, and past work when supported by actual verification records
   - Distinguish verified claims from self-reported information
   - Never mark a creator, tool, workflow, or portfolio item as verified without a defined verification process

6. **Authentication and Authorization**
   - Support the Creator and Brand/Agency user roles
   - Restrict protected operations according to the authenticated user's role and permissions
   - Ensure users can modify only the resources they are authorized to manage

Prioritize the features explicitly required by the hackathon. Avoid implementing unrelated features unless they are approved in the project specifications.

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, verifiable increments over large speculative changes.
- Implement the minimum complete end-to-end version of a feature before adding enhancements.
- Do not combine unrelated frontend, backend, database, authentication, and AI workflow changes into one implementation step.
- Reuse existing components, services, utilities, and patterns whenever appropriate.
- Avoid unnecessary dependencies, abstractions, and premature optimization.
- Keep the interface responsive, accessible, and consistent with `ui-context.md`.
- Use `architecture.md` to determine system boundaries and data flow.
- Use `code-standards.md` for naming, formatting, error handling, and implementation conventions.
- Use `project-overview.md` to understand the product scope and requirements.
- Use `progress-tracker.md` to identify completed features, pending tasks, blockers, and open questions.
- Treat `ai-workflow-rules.md` as the governing document for AI-assisted implementation practices.

## When to Split Work

Split an implementation step if it combines:

- Frontend UI changes with unrelated backend or background processing changes.
- Multiple unrelated API routes or database operations.
- Authentication changes with unrelated feature development.
- Database schema migrations with unrelated UI redesigns.
- AI prompt design, AI integration, and frontend workflow changes that cannot be tested independently.
- Multiple unrelated creator profile, portfolio, brief, or discovery features.
- Changes to architecture, security, or data ownership without an explicit specification.
- Behavior that is not clearly defined in the context files.
- Multiple features that cannot be verified independently.

For example, implement creator profile display first, then portfolio item details, then creator search and filtering. Integrate and test each unit before moving to the next.

If a change cannot be verified end to end quickly, the scope is too broad and must be split.

## Implementation Workflow

For every feature, follow these steps:

1. **Read Context**
   - Review the relevant sections of `project-overview.md`, `architecture.md`, `code-standards.md`, `ui-context.md`, and `progress-tracker.md`.
   - Identify existing code and reusable components before making changes.

2. **Define Scope**
   - Specify the feature objective, expected behavior, affected files, dependencies, and acceptance criteria.
   - Identify database, API, authentication, and UI implications.
   - Record unresolved requirements in `progress-tracker.md`.

3. **Plan Implementation**
   - Break the feature into small, ordered tasks.
   - Follow the existing architecture and technology stack.
   - Avoid modifying unrelated files.

4. **Implement**
   - Write maintainable, modular, and readable code.
   - Follow the established coding standards.
   - Validate user input on both the frontend and backend where appropriate.
   - Enforce authorization on the backend rather than relying on frontend visibility alone.

5. **Verify**
   - Run relevant frontend build checks, backend tests, API checks, and database validation.
   - Verify normal, error, empty, loading, and unauthorized states where applicable.
   - Confirm that the feature works across the frontend, backend, and database when all three are involved.

6. **Document**
   - Update relevant context files if requirements, architecture, conventions, or scope have changed.
   - Record completed work, tests, blockers, and next steps in `progress-tracker.md`.

7. **Review**
   - Check for regressions, unnecessary changes, security issues, and violations of architectural constraints.
   - Move to the next feature only after the current unit satisfies its acceptance criteria.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, clarify it in the relevant context file before implementing it.
- If a requirement is missing, record it as an open question in `progress-tracker.md`.
- If an assumption is necessary for a small implementation detail, choose the simplest safe option consistent with the existing specifications and document it.
- Do not silently change agreed product requirements, API contracts, database relationships, or user permissions.
- Do not invent AI-generated brief fields or treat inferred information as confirmed user input.
- If required information is missing from an AI-assisted brief, leave the field empty, mark it as needing clarification, or ask the user.
- Do not fabricate creator verification records, portfolio history, ratings, or credentials.

## Database and API Rules

- MySQL is the source of truth for persistent application data.
- Use explicit database schema definitions and maintain consistent relationships between users, creator profiles, portfolio items, and creative briefs.
- Use migrations or a controlled schema-update process for database changes.
- Never commit database passwords, API keys, authentication secrets, or other sensitive configuration.
- Keep database access and business logic out of React UI components.
- Use the Python backend as the boundary for business rules, authorization, validation, and database operations.
- Keep API request and response formats consistent with the established backend contracts.
- Return appropriate HTTP status codes and safe, understandable error messages.
- Validate all incoming data on the backend.
- Prevent unauthorized users from accessing, modifying, or deleting other users' resources.
- Use transactions when related database operations must succeed or fail together.
- Never expose internal exceptions, credentials, or sensitive database details to clients.

## Authentication and Security Rules

- Protect private routes and API endpoints.
- Enforce role-based permissions for Creators and Brands/Agencies.
- Verify resource ownership before allowing profile, portfolio, or brief modifications.
- Apply the chosen secure session or token strategy consistently.
- Store passwords using an appropriate password-hashing algorithm if password authentication is implemented.
- Keep secrets in environment variables and provide a safe example environment file when needed.
- Never rely exclusively on frontend checks for authorization.
- Do not expose private user information or unpublished campaign briefs to unauthorized users.

## AI Workflow Rules

- Treat the AI-Assisted Brief Builder as an assistive feature, not an authority that overrides the user.
- Convert rough creative ideas into structured, editable brief data.
- Preserve the user's original intent when generating a brief.
- Separate explicitly provided information from AI-inferred suggestions.
- Identify missing or ambiguous requirements instead of presenting assumptions as facts.
- Allow users to review, modify, and approve the brief before saving or publishing it.
- Validate AI-generated output against the expected schema before storing it.
- Handle AI service failures and malformed responses gracefully.
- Keep AI API keys and provider credentials on the backend.
- Avoid unnecessary AI calls and use deterministic application logic for ordinary validation, filtering, and formatting.
- Do not claim that a creator's work, tools, or workflow have been independently verified unless the application has evidence supporting that claim.

## Protected Files

Do not modify the following without a clear requirement and explicit instruction:

- `architecture.md` — established architecture, system boundaries, and data flow.
- `code-standards.md` — agreed coding conventions.
- `project-overview.md` — approved product scope and requirements.
- `ui-context.md` — approved design system and interaction conventions.
- `progress-tracker.md` — preserve completed work and historical progress when updating status.
- Environment files containing secrets, credentials, or API keys.
- Database migration history and production data.
- Third-party library internals.
- Generated files, dependency directories, and build outputs unless explicitly required.
- Existing shared UI components unless the feature requires a compatible, deliberate change.

Context files may be updated when a specification change is explicitly approved. Record important architectural or behavioral changes in the relevant documentation.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes affect:

- System architecture, module boundaries, or data flow.
- Database tables, relationships, constraints, or persistence decisions.
- API endpoints, request/response contracts, or error behavior.
- Authentication, authorization, or resource ownership.
- Creator profile or AI portfolio requirements.
- Brief creation, editing, publication, or commercial-use requirements.
- Search, filtering, sorting, and empty-state behavior.
- AI prompt structure, output schema, validation, or failure handling.
- Creator verification rules and evidence requirements.
- UI design conventions, reusable components, or navigation.
- Coding standards, testing requirements, or dependencies.

Do not update documentation with unimplemented functionality as though it were complete. Clearly distinguish planned, in-progress, implemented, and verified features.

## Testing and Verification

- Run `npm run build` from the frontend project directory after relevant frontend changes.
- Run the backend's configured tests and validation commands after relevant Python changes.
- Verify database connectivity, schema changes, and persistence when relevant.
- Test API validation, error handling, authentication, authorization, and resource ownership.
- Test creator search with matching results, multiple filters, and empty results.
- Test creator profile and portfolio rendering with complete and optional metadata.
- Test brief creation with required fields, optional fields, and commercial-use requirements.
- Test the AI-Assisted Brief Builder with incomplete, ambiguous, and malformed inputs.
- Confirm that AI-generated suggestions can be reviewed and edited before saving.
- Do not claim that a test passed unless it was actually executed and passed.
- If a check cannot run because of missing dependencies, credentials, services, or configuration, document the limitation.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. All acceptance criteria for the unit have been checked.
3. No invariant defined in `architecture.md` has been violated.
4. Relevant frontend, backend, API, database, and security checks have been completed.
5. `progress-tracker.md` reflects the actual implementation status and remaining work.
6. Relevant context files have been updated when necessary.
7. `npm run build` passes for frontend changes, when the frontend build environment is available.
8. No unrelated files or features have been modified unnecessarily.
9. Any unresolved issues or open questions are documented.
10. The next implementation unit is clearly identified.

## Hackathon Priorities

Prioritize implementation in the following order unless `progress-tracker.md` specifies otherwise:

1. Authentication and role-aware navigation.
2. Creator profiles and rich AI portfolios.
3. Brand/Agency creative brief creation.
4. Creator discovery, search, filtering, and empty states.
5. AI-Assisted Brief Builder.
6. Creator verification indicators backed by defined evidence.
7. End-to-end integration, responsive UI, testing, and demo preparation.

The first four priorities cover the core prototype requirements. The AI-Assisted Brief Builder and credible verification indicators provide additional differentiation for the judges.

Optimize for a reliable, demonstrable working prototype rather than an unnecessarily complex production system.

## Final Rule

Always follow the approved context files, implement one verifiable feature at a time, preserve existing working functionality, and keep implementation status accurate. When requirements conflict, stop and document the conflict instead of silently choosing a behavior.