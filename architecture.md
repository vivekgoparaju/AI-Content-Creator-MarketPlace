# Architecture — AI Content Creator Marketplace

## 1. Purpose

This document defines the system architecture, application modules, technology boundaries, data flow, database design, API responsibilities, and security requirements for the AI Content Creator Marketplace.

The platform connects AI-native creative professionals with brands and creative agencies. It enables creators to showcase AI-generated work and production workflows while helping brands discover suitable creators, publish creative briefs, and use AI to structure their campaign requirements.

All implementation decisions must follow this document, `project-overview.md`, `code-standards.md`, `ui-context.md`, `ai-workflow-rules.md`, and `progress-tracker.md`.

## 2. Architecture Principles

- Use a modular frontend and backend architecture.
- Keep presentation, business logic, API handling, and database access separate.
- Use React for the user interface and Python for backend business logic.
- Use MySQL as the persistent source of truth.
- Enforce authentication, authorization, and input validation on the backend.
- Use reusable React components and shared UI conventions.
- Keep AI-assisted functionality isolated behind a backend service.
- Build features incrementally and verify them independently.
- Avoid unnecessary microservices and infrastructure complexity during the hackathon.
- Keep the initial implementation simple enough to run and demonstrate locally.

## 3. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React | UI components and application screens |
| Frontend tooling | Vite | Development server and production builds |
| Styling | Tailwind CSS | Responsive styling and design consistency |
| Backend | Python | Business logic, validation, and APIs |
| API | REST over HTTP/JSON | Frontend-backend communication |
| Database | MySQL | Persistent users, profiles, portfolios, and briefs |
| Authentication | Secure session or token-based authentication | Identity verification and access control |
| AI integration | Backend AI service adapter | Structured creative brief generation |
| Configuration | Environment variables | Database credentials and external service secrets |
| Version control | Git | Source control and collaboration |

### Technology constraints

- Use the existing Python backend framework if one is already configured.
- If the backend framework has not been selected, use FastAPI as the default recommendation.
- Do not introduce another database or a separate microservice without an approved requirement.
- Keep AI provider integration replaceable so the application is not tightly coupled to one provider.
- Use the package manager and dependency versions already established in the repository wherever possible.

## 4. High-Level System Architecture

The application uses a three-layer architecture: presentation, application/backend, and data persistence.

```mermaid
flowchart TD
    U[Users: Creators and Brands/Agencies]

    subgraph FE[Frontend Layer]
        UI[React + Vite + Tailwind CSS]
        AUTHUI[Authentication UI]
        PROFILE[Creator Profiles and Portfolios]
        DISCOVERY[Creator Search and Filters]
        BRIEFUI[Brief Management UI]
        AIUI[AI-Assisted Brief Builder]
    end

    subgraph BE[Python Backend Layer]
        API[REST API and Request Validation]
        AUTH[Authentication and Authorization]
        USERS[User and Creator Profile Service]
        PORTFOLIO[Portfolio Service]
        SEARCH[Discovery and Filtering Service]
        BRIEFS[Creative Brief Service]
        AISERVICE[AI Brief Generation Service]
    end

    subgraph DATA[Persistence and External Services]
        DB[(MySQL Database)]
        AI[External AI Provider]
        STORAGE[Portfolio Media Storage]
    end

    U --> UI
    UI --> AUTHUI
    UI --> PROFILE
    UI --> DISCOVERY
    UI --> BRIEFUI
    UI --> AIUI

    AUTHUI --> API
    PROFILE --> API
    DISCOVERY --> API
    BRIEFUI --> API
    AIUI --> API

    API --> AUTH
    API --> USERS
    API --> PORTFOLIO
    API --> SEARCH
    API --> BRIEFS
    API --> AISERVICE

    AUTH --> DB
    USERS --> DB
    PORTFOLIO --> DB
    SEARCH --> DB
    BRIEFS --> DB
    AISERVICE --> AI
    BRIEFS --> DB
    PORTFOLIO --> STORAGE
```

### Architecture explanation

1. Users interact with the React application through role-aware screens.
2. The frontend sends HTTP requests to the Python REST API.
3. The backend authenticates the user and checks permissions before protected operations.
4. Application services validate requests and execute business rules.
5. Services read and write persistent records in MySQL.
6. The AI Brief Generation Service communicates with the configured AI provider when AI assistance is requested.
7. AI-generated output is validated by the backend and returned for user review.
8. Portfolio media is stored in an appropriate file or object storage service, while MySQL stores its metadata and references.

For the hackathon prototype, portfolio media may use configured local uploads or externally hosted URLs, provided the storage approach is documented and validated. MySQL should not be used to store large media files directly.

## 5. Main Application Modules

### 5.1 Authentication Module

**Responsibilities**

- Register users and authenticate existing users.
- Support the Creator and Brand/Agency roles.
- Maintain the authenticated user's identity.
- Provide logout functionality.
- Restrict protected screens and API operations.
- Enforce backend authorization for role-specific actions.

**Rules**

- A user must be authenticated before accessing protected resources.
- Creator-only operations must not be available to Brand/Agency users unless explicitly authorized.
- Brand/Agency-only operations must not be available to Creators unless explicitly authorized.
- Frontend route guards improve the user experience but do not replace backend authorization.
- Authentication secrets and passwords must never be exposed in API responses or logs.

### 5.2 Creator Profile Module

**Responsibilities**

- Create and retrieve creator profiles.
- Manage biographies, skills, specialization, and experience.
- Store AI tools and models used by creators.
- Expose profile information to the discovery service.
- Support profile editing by authorized creators.

**Core fields**

- Display name
- Biography
- Specializations
- Skills
- Tools and models
- Experience or relevant background
- Profile image or avatar reference
- Portfolio items
- Verification indicators, when supported by evidence

Creator profile data must be separated from authentication credentials.

### 5.3 AI Portfolio Module

**Responsibilities**

- Create and display portfolio items.
- Associate each item with its creator.
- Record media references and content types.
- Record tools and models used.
- Describe relevant workflows.
- Store supported output formats and aspect ratios.
- Record commercial-use or licensing information when known.
- Provide visible verification status where applicable.

**Supported content types**

- AI-generated images and graphics
- AI-generated videos and short films
- AI animations
- Other approved generative media

Each portfolio item should clearly distinguish self-reported metadata from independently verified information.

### 5.4 Creator Discovery Module

**Responsibilities**

- Retrieve searchable creator profiles.
- Filter creators by skills, specialization, tools, and content type.
- Support combinations of filters.
- Return predictable results and pagination where needed.
- Provide a clear empty state when no creators match.

**Filtering behavior**

- Multiple selected filters should be combined according to documented search semantics.
- Within a filter category, selected values may match any selected value.
- Across different filter categories, results must satisfy all active categories.
- Empty filters should not restrict the results.
- Invalid filter values must be rejected or safely ignored according to the API contract.
- Search results must not expose private account information.

Example: selecting the `Video` content type and `Runway` tool should return creators whose portfolios match the selected content type and tool criteria.

### 5.5 Creative Brief Module

**Responsibilities**

- Create campaign briefs for authenticated Brand/Agency users.
- Retrieve and display authorized briefs.
- Update and delete briefs subject to ownership and permissions.
- Store creative requirements and commercial-use needs.
- Maintain publication status where supported by the implemented workflow.

**Core brief fields**

- Campaign title
- Campaign description or original idea
- Campaign objective
- Required content types
- Desired visual style
- Aspect ratio
- Output format
- Quantity of deliverables, when specified
- Target audience, when specified
- Commercial-use requirements
- Licensing or usage details
- Additional constraints
- Brief status
- Creator or agency ownership reference

The system must not treat unspecified commercial-use or licensing requirements as approved by default.

### 5.6 AI-Assisted Brief Builder Module

**Responsibilities**

- Accept a rough creative idea from a Brand/Agency user.
- Convert the idea into a structured creative brief.
- Suggest relevant content types, styles, formats, and campaign requirements.
- Identify missing information.
- Return editable fields to the frontend.
- Allow the user to review and correct generated suggestions.
- Save the brief only through the normal authorized brief workflow.

**Processing flow**

1. The user enters a natural-language campaign idea.
2. The frontend submits the idea to the Python backend.
3. The backend authenticates the request and validates the input.
4. The AI service generates structured brief suggestions.
5. The backend validates the response against the expected schema.
6. Missing or uncertain information is marked for clarification.
7. The frontend displays the editable brief.
8. The user reviews and approves the content.
9. The frontend submits the approved brief to the brief creation endpoint.
10. The backend validates authorization and persists the brief in MySQL.

**Rules**

- AI-generated suggestions are not automatically treated as user-approved requirements.
- Never invent explicit campaign requirements, licensing permissions, or commercial-use approval.
- Invalid AI responses must not be stored as valid briefs.
- AI service failures must return safe, actionable error messages.
- The backend must keep external AI credentials secret.
- The AI integration must be isolated so that the provider can be changed without rewriting the brief management module.

### 5.7 Creator Verification Module

**Responsibilities**

- Represent verification states for tools, workflows, and portfolio work.
- Associate verification evidence with the relevant creator or portfolio item.
- Display trust indicators in creator profiles and portfolio views.
- Distinguish verified, unverified, and pending claims.

**Verification principles**

- A self-reported tool must not automatically become a verified tool.
- Verification indicators must correspond to an actual verification record or defined verification process.
- Verification evidence should include its subject, status, and verification method.
- Do not display a verified badge merely because a creator uploaded a portfolio item.

For the initial prototype, verification may be represented by clearly labeled statuses backed by stored records. Any manual verification process must be documented as such.

## 6. Frontend Architecture

The frontend is responsible for presentation, navigation, form interactions, and API communication.

### Suggested directory structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── creators/
│   │   ├── portfolio/
│   │   ├── briefs/
│   │   └── discovery/
│   ├── pages/
│   │   ├── auth/
│   │   ├── creator/
│   │   ├── brand/
│   │   └── shared/
│   ├── hooks/
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── creators.js
│   │   ├── portfolio.js
│   │   ├── discovery.js
│   │   └── briefs.js
│   ├── context/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

This is a suggested structure, not a requirement to recreate an existing project. Preserve established repository conventions if the frontend already exists.

### Frontend responsibilities

- Render responsive layouts using React and Tailwind CSS.
- Separate pages from reusable components.
- Keep API communication in service modules.
- Handle loading, success, empty, and error states.
- Validate forms for immediate user feedback.
- Treat backend validation as authoritative.
- Display role-appropriate navigation.
- Support creator portfolio browsing and brief editing.
- Never store sensitive backend credentials in frontend code.

## 7. Backend Architecture

The Python backend exposes REST endpoints and coordinates application services, authorization, database operations, and AI integration.

### Suggested directory structure

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── creators.py
│   │   ├── portfolio.py
│   │   ├── discovery.py
│   │   ├── briefs.py
│   │   └── ai_brief.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── creator_service.py
│   │   ├── portfolio_service.py
│   │   ├── discovery_service.py
│   │   ├── brief_service.py
│   │   └── ai_brief_service.py
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   └── db/
│       ├── session.py
│       └── base.py
├── tests/
├── migrations/
├── requirements.txt
└── .env.example
```

### Backend responsibilities

- Expose API routes and validate incoming requests.
- Apply authentication and authorization.
- Execute business rules in service modules.
- Persist and retrieve data through database access modules.
- Keep database queries out of API route handlers where practical.
- Validate AI provider responses.
- Return consistent JSON responses and suitable HTTP status codes.
- Apply pagination and bounded query parameters to list endpoints.
- Log operational errors without exposing secrets or private data.

Use the existing Python framework and folder conventions if already established. If the project is new, FastAPI is the recommended starting point.

## 8. Database Architecture

MySQL stores persistent application records. The database schema must support the creator, portfolio, discovery, brief, and authentication workflows without unnecessary duplication.

### 8.1 Users

Stores authentication and account information.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Unique user identifier |
| email | VARCHAR(255), unique | Login email |
| password_hash | VARCHAR(255) | Password hash when password login is used |
| role | ENUM or validated role field | CREATOR or BRAND |
| is_active | BOOLEAN | Account status |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

Do not store plaintext passwords. If a different authentication provider is selected, adapt credential fields to the provider's identity model.

### 8.2 Creator Profiles

Stores public creator-specific information.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Profile identifier |
| user_id | BIGINT, unique foreign key | Associated user |
| display_name | VARCHAR(150) | Public name |
| bio | TEXT | Creator biography |
| specialization | VARCHAR(150) | Primary creative specialization |
| experience_years | INT, nullable | Experience when provided |
| avatar_url | VARCHAR(2048), nullable | Profile image reference |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### 8.3 Skills

Stores reusable creator skills.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Skill identifier |
| name | VARCHAR(100), unique | Skill name |

### 8.4 Creator Skills

Associates creators with skills.

| Field | Type | Description |
|---|---|---|
| creator_profile_id | BIGINT, foreign key | Creator profile |
| skill_id | BIGINT, foreign key | Skill |

Use a composite primary key on `creator_profile_id` and `skill_id`.

### 8.5 AI Tools

Stores supported AI tools and models.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Tool identifier |
| name | VARCHAR(150) | Tool or model name |
| provider | VARCHAR(150), nullable | Provider name |
| category | VARCHAR(100), nullable | Tool category |

### 8.6 Portfolio Items

Stores metadata for each portfolio item.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Portfolio item identifier |
| creator_profile_id | BIGINT, foreign key | Owning creator |
| title | VARCHAR(200) | Project title |
| description | TEXT, nullable | Project description |
| content_type | VARCHAR(50) | Image, video, animation, or other |
| media_url | VARCHAR(2048) | Media location |
| aspect_ratio | VARCHAR(30), nullable | Example: 16:9 or 9:16 |
| output_format | VARCHAR(50), nullable | Example: MP4, PNG |
| workflow_description | TEXT, nullable | Production workflow |
| commercial_use_status | VARCHAR(50), nullable | Known usage status |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

### 8.7 Portfolio Tools

Associates portfolio items with tools and models.

| Field | Type | Description |
|---|---|---|
| portfolio_item_id | BIGINT, foreign key | Portfolio item |
| tool_id | BIGINT, foreign key | AI tool or model |
| usage_description | TEXT, nullable | How the tool was used |

Use a composite primary key on `portfolio_item_id` and `tool_id` if each tool appears only once per portfolio item.

### 8.8 Verification Records

Stores evidence-based verification status.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Verification identifier |
| creator_profile_id | BIGINT, foreign key | Associated creator |
| portfolio_item_id | BIGINT, nullable foreign key | Related portfolio item |
| tool_id | BIGINT, nullable foreign key | Related AI tool |
| verification_type | VARCHAR(50) | TOOL, WORKFLOW, or PORTFOLIO |
| status | VARCHAR(30) | PENDING, VERIFIED, or UNVERIFIED |
| verification_method | VARCHAR(150), nullable | How the claim was checked |
| verified_at | DATETIME, nullable | Verification timestamp |

Only authorized verification operations may change a record to VERIFIED. Define which evidence is accepted before implementing real verification.

### 8.9 Creative Briefs

Stores campaign requirements created by brands or agencies.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Brief identifier |
| brand_user_id | BIGINT, foreign key | Owning Brand/Agency user |
| title | VARCHAR(200) | Campaign title |
| original_idea | TEXT | Original campaign idea |
| objective | TEXT, nullable | Campaign objective |
| content_type | JSON or normalized relation | Requested content types |
| visual_style | VARCHAR(150), nullable | Desired creative style |
| aspect_ratio | VARCHAR(30), nullable | Requested aspect ratio |
| output_format | VARCHAR(50), nullable | Requested format |
| quantity | INT, nullable | Number of deliverables |
| target_audience | TEXT, nullable | Intended audience |
| commercial_use_required | BOOLEAN, nullable | Whether commercial use is required |
| licensing_requirements | TEXT, nullable | Additional usage requirements |
| additional_requirements | TEXT, nullable | Other constraints |
| status | VARCHAR(30) | DRAFT, PUBLISHED, or other defined state |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

Use a JSON column for content types only if the selected MySQL version supports it and the implementation needs flexible values. A normalized `brief_content_types` table is preferable if individual content types need frequent filtering or validation.

An unspecified commercial-use requirement must remain distinguishable from an explicit decision that commercial use is not required. Use a nullable field or an explicit unknown state if the brief workflow needs to represent uncertainty.

### 8.10 AI Brief Generations

Stores optional generation history for debugging or revision workflows.

| Field | Type | Description |
|---|---|---|
| id | BIGINT, primary key | Generation identifier |
| brand_user_id | BIGINT, foreign key | Requesting user |
| original_idea | TEXT | Submitted idea |
| generated_brief | JSON | Validated suggested fields |
| model_name | VARCHAR(150), nullable | AI model identifier |
| status | VARCHAR(30) | SUCCESS or FAILED |
| created_at | DATETIME | Generation timestamp |

Store only the history needed by the product. Do not persist sensitive prompts or provider responses unnecessarily. AI generation history is not a substitute for an approved creative brief.

### 8.11 Database Relationships

```mermaid
erDiagram
    USERS ||--o| CREATOR_PROFILES : owns
    USERS ||--o{ CREATIVE_BRIEFS : creates
    CREATOR_PROFILES ||--o{ CREATOR_SKILLS : has
    SKILLS ||--o{ CREATOR_SKILLS : describes
    CREATOR_PROFILES ||--o{ PORTFOLIO_ITEMS : owns
    PORTFOLIO_ITEMS ||--o{ PORTFOLIO_TOOLS : uses
    AI_TOOLS ||--o{ PORTFOLIO_TOOLS : identifies
    CREATOR_PROFILES ||--o{ VERIFICATION_RECORDS : has
    PORTFOLIO_ITEMS o|--o{ VERIFICATION_RECORDS : references
    AI_TOOLS o|--o{ VERIFICATION_RECORDS : references
    USERS ||--o{ AI_BRIEF_GENERATIONS : requests
```

Implement foreign keys, unique constraints, and appropriate indexes. The diagram expresses the intended relationships; adapt optional associations to the final schema.

## 9. API Architecture

The frontend communicates with the Python backend through versioned REST endpoints.

Recommended base path:

`/api/v1`

### 9.1 Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a user |
| POST | `/api/v1/auth/login` | Authenticate a user |
| POST | `/api/v1/auth/logout` | End the authenticated session |
| GET | `/api/v1/auth/me` | Retrieve the current user's safe account details |

The exact endpoints depend on the selected session or token strategy.

### 9.2 Creator APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/creators` | List or search creator profiles |
| GET | `/api/v1/creators/{id}` | Retrieve a public creator profile |
| PUT | `/api/v1/creators/me` | Update the authenticated creator's profile |
| GET | `/api/v1/creators/me/portfolio` | Retrieve the authenticated creator's portfolio |
| POST | `/api/v1/portfolio` | Create a portfolio item |
| GET | `/api/v1/portfolio/{id}` | Retrieve a portfolio item |
| PUT | `/api/v1/portfolio/{id}` | Update an authorized portfolio item |
| DELETE | `/api/v1/portfolio/{id}` | Delete an authorized portfolio item |

### 9.3 Discovery API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/creators` | Search and filter creators |

Example query:

`/api/v1/creators?skill=animation&tool=Runway&content_type=video&page=1&page_size=12`

Supported parameters may include:

- `q` — text search
- `skill` — skill filter
- `specialization` — specialization filter
- `tool` — AI tool or model filter
- `content_type` — portfolio content type
- `page` — page number
- `page_size` — bounded page size

Define exact matching, case sensitivity, repeated parameter behavior, and filter combination semantics in the API implementation. Reject or normalize invalid pagination values.

### 9.4 Creative Brief APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/briefs` | Create a brief |
| GET | `/api/v1/briefs` | List briefs owned by the authenticated Brand/Agency user |
| GET | `/api/v1/briefs/{id}` | Retrieve an authorized brief |
| PUT | `/api/v1/briefs/{id}` | Update an authorized brief |
| DELETE | `/api/v1/briefs/{id}` | Delete an authorized brief, if supported |

### 9.5 AI Brief Builder APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/ai/brief-builder` | Generate structured brief suggestions |

Example request:

```json
{
  "idea": "Create a cinematic product launch video for a new running shoe.",
  "additional_context": {
    "content_type": "video",
    "aspect_ratio": "9:16"
  }
}
```

Example response:

```json
{
  "suggested_brief": {
    "title": "Running Shoe Product Launch",
    "objective": "Introduce the product through a cinematic launch video",
    "content_type": ["video"],
    "visual_style": "cinematic",
    "aspect_ratio": "9:16",
    "output_format": null,
    "commercial_use_required": null,
    "missing_information": [
      "Output format",
      "Commercial-use requirements"
    ]
  }
}
```

This example illustrates the contract. The actual schema must be defined and validated in the backend. Null fields and missing-information indicators must be supported consistently.

Generating a suggested brief must not automatically publish or save a campaign. The user must explicitly approve the content and submit it through the authorized brief creation workflow.

## 10. API Response and Error Handling

Use consistent response structures.

Example success response:

```json
{
  "data": {
    "id": 101,
    "title": "Example Campaign"
  }
}
```

Example error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields."
  }
}
```

Recommended HTTP status codes:

- `200 OK` — successful retrieval or update.
- `201 Created` — resource successfully created.
- `204 No Content` — successful operation with no response body.
- `400 Bad Request` — malformed or invalid request.
- `401 Unauthorized` — missing or invalid authentication.
- `403 Forbidden` — authenticated user lacks permission.
- `404 Not Found` — resource does not exist or is not accessible under the chosen privacy policy.
- `409 Conflict` — conflicting operation or uniqueness violation.
- `422 Unprocessable Content` — semantically invalid input, when used by the chosen framework.
- `429 Too Many Requests` — rate limit exceeded.
- `500 Internal Server Error` — unexpected server failure.
- `502 Bad Gateway` or `503 Service Unavailable` — relevant upstream service failure.

Use a consistent policy for framework-generated validation errors. Do not expose stack traces, SQL errors, provider secrets, or internal implementation details to the frontend.

## 11. Authentication and Authorization Flow

1. A user registers or logs in.
2. The backend verifies credentials or the configured identity provider.
3. The backend establishes an authenticated session or issues credentials according to the chosen strategy.
4. The frontend uses the authenticated state to render appropriate navigation.
5. Protected API requests include the required session or token credentials.
6. The backend validates identity and checks role and resource ownership.
7. The backend performs the operation only if authorization succeeds.

### Authorization rules

- Creators can edit their own profiles and portfolio items.
- Brands/Agencies can create and manage their own briefs.
- Users cannot modify other users' resources without explicit permission.
- Public creator profiles may be accessible without authentication if the product design permits it.
- Private briefs and account information must not be exposed through public endpoints.
- Verification status can only be changed through authorized verification operations.

For browser-based authentication, choose secure cookie settings appropriate to the deployment environment. If cookies are used for authenticated state-changing requests, define CSRF protection. If bearer tokens are used, define secure storage and token lifecycle rules.

## 12. Search and Filtering Strategy

For the hackathon prototype, use MySQL-backed filtering rather than introducing a separate search engine.

### Search flow

1. The user enters a search query or selects filters.
2. The frontend serializes the selected criteria into query parameters.
3. The backend validates and normalizes the criteria.
4. The discovery service queries creators and relevant portfolio metadata.
5. MySQL returns matching results using appropriate joins and indexes.
6. The backend returns paginated results and total counts where needed.
7. The frontend renders profile cards or a helpful empty state.

### Search considerations

- Index frequently queried fields where appropriate.
- Avoid duplicate creator results when joining multiple skills or portfolio tools.
- Use parameterized database queries or a safe ORM query builder.
- Bound pagination values.
- Keep filtering logic in the backend.
- Do not load the entire creator database into the browser to filter it.
- Make empty, loading, and error states distinct.
- Keep search behavior predictable when users clear filters.

## 13. AI Integration Architecture

The AI integration belongs in a dedicated backend service.

### Responsibilities

- Build the AI request from validated user input.
- Request structured output from the configured AI provider.
- Validate the result against the brief schema.
- Normalize supported values.
- Identify incomplete or ambiguous fields.
- Return a safe response to the frontend.
- Handle timeouts, rate limits, and provider failures.

### Constraints

- Keep provider API keys exclusively on the backend.
- Never assume model output is valid JSON or conforms to the expected schema.
- Validate enums, lengths, and allowed values.
- Never silently convert an uncertain commercial-use requirement into approval.
- Never automatically persist generated content as an approved campaign.
- Avoid logging confidential campaign ideas unless explicitly required.
- Provide a useful manual brief-creation path when AI assistance is unavailable.

## 14. File and Media Storage

Portfolio items may contain images, videos, and other creative assets.

For the prototype:

- Store media files in configured file or object storage.
- Store only metadata and media references in MySQL.
- Validate permitted file types and enforce upload size limits.
- Generate safe file names and avoid trusting client-provided paths.
- Apply access controls where assets are private.
- Validate external media URLs before accepting them.
- Use an approved media delivery method for public portfolios.

Local storage is suitable for local demonstrations but may not persist across deployments. If local uploads are used, document their limitations. Do not assume local files will work across multiple backend instances.

## 15. Configuration and Environment Variables

Use environment variables for environment-specific configuration.

Example `.env.example`:

```dotenv
APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=8000

DATABASE_URL=mysql+driver://user:password@localhost:3306/creator_marketplace

FRONTEND_URL=http://localhost:5173

AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

The database URL is illustrative. Replace `mysql+driver` with the actual SQLAlchemy-compatible driver or connection configuration selected by the project.

Rules:

- Commit only placeholder values in `.env.example`.
- Never commit real credentials or production secrets.
- Configure the actual database driver and ORM consistently.
- Validate required environment variables at startup.
- Keep the frontend API base URL configurable.
- Do not expose backend-only environment variables through Vite client-side configuration.
- Use separate configuration values for development and deployment.

## 16. Error Handling and Observability

- Centralize common API error handling.
- Log unexpected backend failures with enough context for debugging.
- Avoid logging passwords, tokens, API keys, or sensitive campaign content.
- Return actionable validation errors to the frontend.
- Handle database connectivity failures gracefully.
- Handle AI provider timeouts and malformed responses.
- Show loading states during asynchronous operations.
- Preserve user-entered form data when safe and practical after recoverable errors.
- Provide an empty state when discovery returns no matches.
- Keep user-facing error messages understandable and avoid exposing internal stack traces.

## 17. Testing Strategy

### Frontend

- Verify routing and role-aware navigation.
- Test creator profile and portfolio rendering.
- Test search, filter combinations, and empty results.
- Test brief forms and validation feedback.
- Test AI-generated brief review and editing.
- Test loading, success, and failure states.
- Run the production build.

### Backend

- Test registration and authentication.
- Test role-based authorization and resource ownership.
- Test creator profile and portfolio endpoints.
- Test search filtering and pagination.
- Test brief creation, retrieval, update, and deletion.
- Test malformed requests and validation errors.
- Test AI output validation and provider failure handling.

### Database

- Verify schema creation and migrations.
- Verify primary keys, foreign keys, and uniqueness constraints.
- Verify creator-to-portfolio and user-to-brief relationships.
- Verify filtering queries do not create duplicate creator results.
- Verify ownership constraints are enforced by the application.
- Verify transactions and rollback behavior where relevant.

### End-to-end acceptance scenarios

1. A creator registers and creates a profile.
2. The creator adds a portfolio item with content type, tools, skills, and workflow information.
3. A Brand/Agency user searches for creators using multiple filters.
4. The discovery page displays matching profiles or a clear empty state.
5. The Brand/Agency user creates a campaign brief.
6. The user submits a rough idea to the AI Brief Builder.
7. The system returns structured, editable suggestions and highlights missing requirements.
8. The user edits and approves the brief before saving it.
9. Unauthorized users cannot modify another user's resources.
10. Verification indicators appear only when supported by stored verification records.

## 18. Deployment Architecture

For the hackathon prototype, use a simple deployment model:

- Deploy the React/Vite frontend as a static web application.
- Run the Python backend as an API service.
- Use a MySQL database instance accessible to the backend.
- Configure secrets through the deployment environment.
- Set the correct frontend origin and backend API base URL.
- Configure HTTPS and secure authentication settings for public deployment.
- Ensure the deployed backend can access portfolio media storage and the configured AI provider.

Do not expose MySQL directly to browser clients. Only the backend should access database credentials.

## 19. Development Priorities

Implement the architecture in small, demonstrable increments.

### Phase 1 — Foundation

- Establish the frontend and backend structure.
- Configure MySQL connectivity and schema management.
- Implement authentication and role-based access.
- Establish consistent API validation and error handling.

### Phase 2 — Core Marketplace

- Implement creator profiles.
- Implement portfolio item management.
- Implement creator search and filtering.
- Implement brief creation and management.

### Phase 3 — Differentiating Features

- Implement the AI-Assisted Brief Builder.
- Add structured output validation and missing-field detection.
- Implement evidence-backed creator verification indicators.

### Phase 4 — Integration and Demo

- Verify the complete creator-to-brand workflow.
- Test search, empty states, permissions, and error handling.
- Refine responsive layouts and portfolio presentation.
- Prepare a short, reliable demo with realistic sample data.

Keep the implementation aligned with the hackathon evaluation priorities: creator profiles and portfolios, brief definition, discovery and filtering, user experience, and presentation.

## 20. Architectural Invariants

These rules must remain true throughout development:

1. React communicates with the Python backend through documented APIs.
2. The Python backend is the only application layer that accesses MySQL directly.
3. MySQL remains the source of truth for persisted application data.
4. Authentication and authorization are enforced by the backend.
5. Creators own their profiles and portfolio items, subject to explicitly defined permissions.
6. Brands/Agencies own the briefs they create.
7. Creator discovery supports the documented search and filtering rules.
8. AI-generated briefs remain suggestions until reviewed and approved by the user.
9. Commercial-use and licensing requirements must not be fabricated or silently assumed.
10. Verification indicators must be backed by actual verification records.
11. Secrets must never be exposed in frontend bundles or committed to source control.
12. Architecture changes must be documented and reflected in the relevant Markdown context files.

Any change that violates these invariants must be reviewed and explicitly approved before implementation.

## 21. Open Decisions

Record unresolved decisions in `progress-tracker.md` and finalize them before implementing the dependent feature.

- Which Python framework is already installed, or should FastAPI be introduced?
- Which authentication strategy will be used: secure cookie-based sessions or bearer tokens?
- Which AI provider and model will power the brief builder?
- Will portfolio media use local uploads, external URLs, or object storage?
- Will creator verification be manual, automated, or represented as demo-only sample records?
- Should brands be able to save drafts, publish briefs, or both in the initial prototype?
- Are AI generation histories necessary for the hackathon demo?
- Which MySQL driver, ORM, and migration tool are already configured?

Choose the simplest solution that satisfies the approved product requirements. Document decisions in this file and the relevant project context files before they affect implementation.