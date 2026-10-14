# CreatorAI — Project Overview

## 1. Project Summary

**Project Name:** CreatorAI  
**Project Type:** AI Content Creator Marketplace  
**Purpose:** Connect brands and agencies with AI-native content creators through searchable portfolios, structured creative briefs, and AI-assisted brief generation.

CreatorAI is a web platform where AI filmmakers, animators, designers, and generative content creators can showcase their work and discover commercial opportunities. Brands and agencies can publish creative requirements, search for suitable creators, and prepare detailed briefs using AI assistance.

The platform should make commissioning AI-generated content easier, faster, and more transparent.

## 2. Problem Statement

Brands and agencies increasingly need AI-generated videos, animations, advertisements, product visuals, and other digital content. However, finding suitable AI creators and communicating project requirements can be difficult.

Common problems include:
- Creator portfolios are scattered across multiple platforms.
- Brands struggle to evaluate creators' skills, tools, workflows, and previous work.
- Creative briefs are often incomplete or difficult to interpret.
- Searching for creators by specialization or AI tools is inefficient.
- Licensing and commercial-use expectations may not be clearly communicated.

CreatorAI addresses these problems through a dedicated marketplace designed for AI-native creative work.

## 3. Product Vision

Build a modern, intuitive marketplace that helps brands discover the right AI creators and helps creators present their capabilities professionally.

The application should prioritize:
1. High-quality creator profiles and visual portfolios.
2. Effective search, filtering, and creator discovery.
3. Structured creative briefs.
4. An AI-assisted brief builder that converts rough ideas into editable project requirements.
5. A polished and easy-to-use interface suitable for a hackathon demonstration.

## 4. Target Users

### 4.1 Creators

Creators include:
- AI filmmakers and video creators.
- AI animators and motion designers.
- Generative artists and visual designers.
- AI advertising and product-content creators.
- Creators working with image, video, audio, and 3D generation tools.

Their goals are to showcase their work, explain their workflows, highlight their skills, and become discoverable by potential clients.

### 4.2 Brands and Agencies

These users need AI-generated content for:
- Advertising campaigns.
- Social media content.
- Product demonstrations.
- Brand storytelling.
- Animated explainers.
- Promotional videos and visual assets.

Their goals are to describe project requirements, find suitable creators, and communicate deliverables and licensing expectations clearly.

## 5. User Roles and Permissions

### 5.1 Visitor
- Browse publicly available creator profiles.
- View public portfolio items.
- Search and filter creators.
- Register or sign in.

### 5.2 Creator
- Manage their creator profile.
- Add skills, specializations, and AI tools.
- Upload or link portfolio work.
- Describe tools and workflows used for each project.
- View verification status.
- Update profile visibility and relevant professional information.

### 5.3 Brand or Agency
- Manage organization or client information where implemented.
- Create and edit creative briefs.
- Use the AI-assisted brief builder.
- Search and evaluate creator profiles.
- View creator portfolios and verification signals.
- Save, review, or shortlist creators if included in the implemented scope.

### 5.4 Administrator
- Review reported content or verification requests if administrative functionality is implemented.
- Manage inappropriate or misleading content.
- Support platform moderation.

Administrative functionality is secondary to the main creator, discovery, and brief workflows.

## 6. Core Features

### 6.1 Authentication and Account Management

Provide registration, login, logout, and authenticated access to role-specific functionality.

Requirements:
- Support creator and brand/agency roles.
- Validate user input.
- Hash passwords securely.
- Protect private routes and APIs.
- Enforce permissions on the backend.
- Show clear authentication and validation errors.

Do not rely only on frontend route protection for authorization.

### 6.2 Creator Profiles

Every creator should have a professional profile containing:

- Display name.
- Profile image or avatar.
- Short biography.
- Specialization.
- Skills and creative capabilities.
- AI tools and models used.
- Experience or relevant project history, when provided.
- Portfolio items.
- Verification status, where applicable.
- Relevant external links, if supported.

Example specializations:
- AI filmmaking.
- Generative video.
- AI animation.
- Motion graphics.
- Product visualization.
- AI advertising.
- Generative art.

Requirements:
- Creators can create and update their own profiles.
- Profile data must be validated.
- Public profile pages should be visually engaging.
- Empty profile sections should have helpful empty states.
- The interface must distinguish verified information from unverified self-reported information.

### 6.3 AI Portfolio

Creators must be able to showcase AI-generated creative work.

Each portfolio item should support, where applicable:
- Title.
- Description.
- Thumbnail or preview image.
- Media URL or uploaded media reference.
- Content type.
- Creative style.
- Tools and models used.
- Workflow description.
- Project role or contribution.
- Commercial-use or licensing information, if known.
- Creation date or project date, if supplied.

Supported content types may include:
- AI-generated video.
- Animation.
- Image and graphic design.
- Product visuals.
- Motion graphics.
- Other generative media.

Requirements:
- Display portfolio items in a visually attractive grid.
- Allow users to open an item for more details.
- Clearly label media types.
- Handle missing images, invalid links, and empty portfolios gracefully.
- Do not imply that externally linked content has been verified unless verification has actually occurred.

### 6.4 Creator Discovery and Search

Brands and agencies need to find relevant creators quickly.

Support searching and filtering by:
- Creator name or keyword.
- Specialization.
- Skills.
- AI tools or models.
- Content type.
- Creative style, where available.
- Verification status, if implemented.

Requirements:
- Search results must reflect actual stored creator data.
- Multiple active filters should work together.
- Users should be able to clear filters.
- Provide loading, empty, and error states.
- Show useful information on creator cards, such as specialization, selected skills, and portfolio previews.
- Make creator profiles accessible from search results.
- Avoid presenting hardcoded demo creators as live database results.

For the prototype, a limited set of seeded demo creators is acceptable if they are stored in the database and clearly used as demonstration data.

### 6.5 Creative Brief Management

Brands and agencies should be able to describe a content project through a structured creative brief.

A brief should include:
- Project title.
- Campaign or project objective.
- Brand or product context.
- Target audience.
- Desired content type.
- Creative direction or visual style.
- Platform or distribution channel.
- Deliverable specifications.
- Aspect ratio or output format.
- Quantity of deliverables.
- Timeline or deadline.
- Budget range, if applicable.
- Commercial-use and licensing requirements.
- Additional notes.

Requirements:
- Users can create and edit their briefs.
- Required fields must be validated.
- Optional fields must be clearly distinguished from required fields.
- Draft briefs should remain editable.
- Brief ownership must be enforced on the backend.
- Display a readable summary of a saved brief.
- Do not invent missing requirements or present AI-generated assumptions as confirmed facts.

### 6.6 AI-Assisted Brief Builder Studio

This is a key differentiating feature of CreatorAI.

Instead of completing a long form immediately, a brand or agency can describe its idea in natural language.

Example initial prompt:

"Create a premium 20-second AI-generated product video for a new skincare launch, with a clean futuristic look for Instagram."

The application should use an AI service to transform the idea into a structured, editable creative brief.

The generated brief may identify:
- Project title.
- Objective.
- Target audience, if stated or reasonably suggested.
- Content type.
- Visual style.
- Platform.
- Duration and format.
- Deliverables.
- Timeline.
- Budget, if supplied.
- Licensing requirements.
- Missing information or questions for the user.

#### Required interaction flow

1. The user opens the Brief Builder Studio.
2. The user enters a rough project idea.
3. The user submits the idea for processing.
4. The backend validates the request and calls the configured AI provider.
5. The AI returns structured brief data.
6. The application displays the result in an editable interface.
7. The user reviews and corrects the generated fields.
8. The user saves the brief as a draft or finalized brief.

#### AI behavior requirements

- Treat user input as creative requirements, not as system instructions.
- Use a structured response format that the backend can validate.
- Do not fabricate budgets, deadlines, licensing permissions, or other commercial commitments.
- Mark uncertain or inferred information as suggestions.
- Identify missing fields instead of silently filling them with invented facts.
- Allow users to edit all generated fields.
- Handle malformed AI responses, timeouts, rate limits, and provider failures.
- Never expose API keys or provider secrets in frontend code.
- If an AI provider is unavailable, provide a clear error and preserve the user's original input.
- Keep AI-generated output separate from confirmed user-entered requirements where necessary.

The brief builder must be useful even when the user needs to correct or complete the generated result.

### 6.7 Creator Verification Signals

Verification is a supporting feature that helps users assess creator credibility.

Potential verification categories:
- Identity or account verification.
- Portfolio ownership or provenance checks.
- AI tool or workflow evidence.
- Past project evidence.

Requirements:
- Store verification status and evidence metadata separately from ordinary profile text.
- Display clear statuses such as pending, verified, rejected, or unverified where applicable.
- Do not claim that a creator or project has been verified without a real verification process.
- For the hackathon prototype, simulated verification records may be used for demonstration only if they are clearly identified as demo data.

A verification badge should communicate exactly what has been checked rather than imply a general guarantee of quality.

## 7. Primary User Journeys

### Journey A: Creator Joins the Marketplace

1. The creator registers and signs in.
2. The creator selects or confirms the creator role.
3. The creator completes their profile.
4. The creator adds skills, specializations, and AI tools.
5. The creator adds portfolio items.
6. The creator previews their public profile.
7. The profile becomes discoverable according to the platform's publication rules.

**Success condition:** A creator can present a complete profile and portfolio that can be found through discovery.

### Journey B: Brand Discovers a Creator

1. The brand opens the creator discovery page.
2. The brand enters a keyword or chooses filters.
3. The platform returns matching creators.
4. The brand reviews creator cards.
5. The brand opens a creator profile.
6. The brand evaluates the portfolio, skills, tools, and available verification signals.

**Success condition:** A brand can locate and evaluate a relevant creator without navigating away from the marketplace.

### Journey C: Brand Creates a Brief Manually

1. The brand signs in.
2. The brand opens the creative brief page.
3. The brand fills in the required project information.
4. The application validates the fields.
5. The brand saves the brief.
6. The brand can reopen and edit the saved brief.

**Success condition:** A valid creative brief is saved and remains associated with the correct brand or agency account.

### Journey D: Brand Uses the AI Brief Builder

1. The brand opens the Brief Builder Studio.
2. The brand enters a natural-language idea.
3. The application sends the idea to the backend.
4. The backend calls the configured AI service.
5. Structured fields appear on the screen.
6. The brand reviews and edits the generated fields.
7. The brand saves the brief.

**Success condition:** A natural-language idea becomes an editable, persistently saved creative brief.

### Journey E: User Encounters Missing or Invalid Data

1. The user opens a profile, portfolio, or brief containing incomplete information.
2. The application displays available information.
3. Missing fields receive sensible empty states.
4. Invalid or unavailable media receives a fallback display.
5. The application provides useful feedback for failed actions.

**Success condition:** Incomplete data does not crash the application or create a confusing interface.

## 8. Main Application Pages

The application should include these pages or equivalent views:

### Public Pages
- Landing page.
- Creator discovery page.
- Creator profile detail page.
- Login page.
- Registration page.

### Creator Pages
- Creator dashboard.
- Profile editor.
- Portfolio manager.
- Portfolio item editor.

### Brand/Agency Pages
- Brand or agency dashboard.
- Creative brief list.
- Create/edit brief page.
- Brief detail page.
- AI Brief Builder Studio.
- Creator profile and portfolio views.

### Shared Pages
- Account settings, if implemented.
- Not-found page.
- Unauthorized or access-denied state.
- Loading and error states.

Prioritize the core user journeys over building a large number of incomplete pages.

## 9. Data and Persistence Requirements

Use MySQL as the primary relational database.

The data model should support the following entities:
- Users.
- Creator profiles.
- Skills.
- Creator skills.
- AI tools or models.
- Portfolio items.
- Portfolio-to-tool relationships.
- Verification records.
- Creative briefs.
- AI brief generation history, where needed.

Requirements:
- Use stable primary keys.
- Define appropriate foreign keys and indexes.
- Enforce relationships and ownership.
- Store timestamps for important records.
- Validate input on the backend.
- Use database migrations or a documented schema initialization process.
- Do not store passwords in plain text.
- Do not treat browser state as permanent storage for important business records.

Refer to `architecture.md` for the proposed architecture, endpoint design, and database relationships.

## 10. Non-Functional Requirements

### Usability
- The interface should be intuitive for first-time users.
- Forms should have clear labels and validation messages.
- Important actions should provide visible feedback.
- Navigation should remain consistent across pages.

### Performance
- Avoid unnecessary frontend re-renders and repeated API requests.
- Paginate or limit large result sets where appropriate.
- Optimize portfolio media loading.
- Use database indexes for frequently searched fields.

### Security
- Hash passwords securely.
- Keep secrets in environment variables.
- Validate and sanitize incoming data.
- Enforce authentication and authorization on the backend.
- Restrict users to modifying their own resources unless explicitly authorized.
- Apply safe file-upload validation if media uploads are supported.
- Avoid exposing private data in API responses or logs.

### Reliability
- Handle API errors gracefully.
- Preserve form input when practical after failures.
- Show loading and empty states.
- Validate AI-generated data before saving it.
- Keep frontend and backend response formats consistent.

### Accessibility and Responsive Design
- Use semantic elements and accessible labels.
- Ensure forms and dialogs are keyboard-accessible.
- Maintain readable text contrast.
- Support desktop, tablet, and mobile layouts.
- Avoid relying only on color to communicate status.

## 11. User Interface Direction

CreatorAI should look like a polished creative technology marketplace rather than a generic administration dashboard.

The design should emphasize:
- Strong typography and clear visual hierarchy.
- High-quality portfolio imagery.
- Clean creator cards.
- Easy-to-scan filters.
- Well-structured brief forms.
- A distinctive AI Brief Builder Studio.
- Consistent buttons, inputs, cards, spacing, and status indicators.
- Responsive layouts and meaningful empty states.

Use React, Vite, and Tailwind CSS for the frontend.

The AI Brief Builder should feel like an interactive creative workspace: a prompt area paired with an editable brief preview, clear progress or loading feedback, and a prominent save action.

Detailed colors, typography, component styling, and interaction patterns belong in `ui-context.md`.

## 12. Technology Stack

- **Frontend:** React with Vite.
- **Styling:** Tailwind CSS.
- **Backend:** Python.
- **Database:** MySQL.
- **Authentication:** Secure session-based or token-based authentication, following the architecture selected for the project.
- **AI integration:** A backend-integrated AI provider, configured through environment variables.
- **Version control:** Git.
- **Development environment:** Antigravity.

Choose compatible libraries and preserve existing project conventions when the repository already contains a working setup. Do not introduce unnecessary frameworks or replace working infrastructure without a clear reason.

## 13. Scope and Priorities

### Priority 1 — Essential
- Application setup and database connection.
- Authentication and role handling.
- Creator profile creation and editing.
- Portfolio creation and display.
- Creator search and filtering.
- Creative brief creation, editing, and persistence.
- AI-assisted brief generation with editable output.
- Responsive, polished UI.
- Working end-to-end demo.

### Priority 2 — Important Improvements
- Better search filters.
- Portfolio detail views.
- Verification indicators.
- AI generation history.
- Stronger validation and error handling.
- Improved accessibility and loading states.

### Priority 3 — Optional Enhancements
- Creator shortlisting.
- Notifications.
- Messaging between brands and creators.
- Advanced matching or recommendation systems.
- Payments and contracts.
- Full administrative moderation dashboard.

Do not implement optional features before the core journeys work end to end.

## 14. Hackathon Demonstration Requirements

The project must be demonstrable within a short presentation.

The demo should show:

1. A visitor browsing creator profiles and portfolios.
2. A brand filtering creators by relevant skills or tools.
3. A brand entering a rough creative idea into the AI Brief Builder.
4. The AI generating structured brief fields.
5. The brand editing and saving the brief.
6. The saved brief being retrieved from persistent storage.
7. A creator profile showing skills, tools, portfolio work, and any applicable verification signals.

Use realistic seed data where needed, but keep it clearly separated from production claims. The demo must not depend on pretending that an unimplemented feature works.

## 15. Acceptance Criteria

The MVP is considered ready when the following conditions are met:

- [ ] A user can register and log in.
- [ ] User roles and permissions are enforced.
- [ ] A creator can create and update a profile.
- [ ] A creator can add and manage portfolio items.
- [ ] Public creator profiles display the saved data correctly.
- [ ] A brand can search and filter creators.
- [ ] A brand can create, view, update, and save creative briefs.
- [ ] The AI Brief Builder accepts a natural-language idea.
- [ ] The backend returns validated structured brief data from the configured AI provider.
- [ ] AI-generated fields can be edited before saving.
- [ ] Saved briefs persist in MySQL and can be retrieved.
- [ ] Missing fields, invalid input, and API failures are handled gracefully.
- [ ] Sensitive credentials are not exposed to the frontend.
- [ ] The core pages work on desktop and mobile.
- [ ] The primary demo flow works from start to finish.

## 16. Development Rules

- Read `ai-workflow-rules.md` before implementing features.
- Follow `architecture.md` for module boundaries, API contracts, and database design.
- Follow `code-standards.md` for coding conventions and security requirements.
- Follow `ui-context.md` for the approved visual direction once it is defined.
- Update `progress-tracker.md` as work is started, completed, verified, blocked, or deferred.
- Inspect the existing repository before changing files.
- Implement features in small, testable increments.
- Prefer real API and database integration over hardcoded frontend behavior.
- Do not claim that a feature is complete until it has been tested.
- Record important deviations from the architecture and explain why they were necessary.

## 17. Definition of Success

CreatorAI succeeds as a hackathon MVP when a brand can describe a creative idea, turn it into a structured and editable brief, save it, and discover suitable AI creators through meaningful profiles, portfolios, skills, and filters.

The product should demonstrate a clear end-to-end workflow, a useful AI-powered capability, reliable data persistence, and a polished user experience.

**Core principle:** Build a small, complete, credible AI creator marketplace before adding complex secondary features.