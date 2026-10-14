# CreatorAI — UI Context

## 1. Purpose

This document defines the visual identity, layout rules, component patterns, and user experience requirements for CreatorAI.

CreatorAI is a modern AI content creator marketplace connecting brands and agencies with AI filmmakers, animators, motion designers, and generative artists.

The interface should feel like a premium creative technology platform—not a generic admin dashboard.

**Primary UX goal:** Help brands discover talented AI creators and turn creative ideas into structured project briefs with minimal friction.

## 2. Design Principles

Follow these principles across the entire application:

1. **Visual-first:** Creator portfolios and creative work should receive the most visual attention.
2. **Simple navigation:** Users should always understand where they are and what to do next.
3. **Clear hierarchy:** Use typography, spacing, and layout to distinguish primary actions from secondary information.
4. **AI-assisted, human-controlled:** AI-generated content must be editable and must never feel final until the user confirms it.
5. **Consistent components:** Reuse shared components rather than creating a different visual style for every page.
6. **Responsive by default:** Design for desktop first where appropriate, while ensuring mobile usability.
7. **Meaningful feedback:** Every important action should communicate loading, success, failure, or an empty state.
8. **Authenticity:** Clearly distinguish verified information from creator-provided information.

## 3. Visual Identity

### 3.1 Overall Style

Use a premium, modern creative-tech aesthetic inspired by professional creator platforms and contemporary SaaS products.

The design should combine:
- Clean layouts.
- Generous whitespace.
- Strong typography.
- Large portfolio thumbnails.
- Subtle borders and restrained shadows.
- Rounded cards and inputs.
- Carefully selected accent colors.
- Minimal, purposeful animation.

Avoid:
- Excessive gradients.
- Too many competing accent colors.
- Overuse of glassmorphism.
- Heavy shadows on every element.
- Unnecessary decorative graphics.
- Dense dashboard layouts.
- Emoji used as the primary icon system.
- Excessively rounded controls that make the interface look childish.

### 3.2 Color Palette

Use a dark ink/navy foundation, a vivid violet accent, and restrained neutral surfaces.

Suggested design tokens:

| Token | Suggested value | Purpose |
|---|---|---|
| Primary | `#6D5EF7` | Main actions and selected states |
| Primary hover | `#5848E5` | Hover and pressed states |
| Primary soft | `#EEEAFE` | Selected filters and subtle highlights |
| Background | `#F8F9FC` | Main light page background |
| Surface | `#FFFFFF` | Cards, panels, and modals |
| Text primary | `#171923` | Headings and main content |
| Text secondary | `#646B7A` | Supporting text |
| Border | `#E6E8EF` | Dividers and control outlines |
| Success | `#17845D` | Successful operations |
| Warning | `#A96512` | Warnings and pending states |
| Danger | `#C43D4B` | Errors and destructive actions |

Use colors consistently through Tailwind theme tokens or CSS variables.

Do not hardcode slightly different versions of the same color across individual components.

### 3.3 Typography

Use a clean sans-serif font such as Inter or a similar available font.

Typography hierarchy:
- **Hero heading:** Large, bold, and concise.
- **Page heading:** Clear and prominent.
- **Section heading:** Medium weight with sufficient spacing.
- **Card title:** Semibold and easy to scan.
- **Body text:** Comfortable line height and readable size.
- **Metadata:** Smaller, muted text that remains legible.
- **Form labels:** Clear, medium-weight labels above controls.

Use consistent line heights and avoid oversized headings on every page.

### 3.4 Spacing and Layout

Use a consistent spacing scale based on multiples of four pixels.

Guidelines:
- Main content should have a clear maximum width on large screens.
- Use consistent horizontal page padding.
- Separate sections with meaningful vertical spacing.
- Keep forms aligned and easy to scan.
- Avoid cards nested inside several unnecessary card layers.
- Use whitespace to distinguish content groups.

Suggested desktop content width: approximately `1200–1440px`, depending on the page.

## 4. Application Shell and Navigation

### 4.1 Top Navigation

Create a consistent navigation bar with:
- CreatorAI logo or wordmark.
- Discover.
- AI Brief Studio.
- Relevant navigation for the authenticated role.
- Sign in or profile menu.
- A primary call-to-action where appropriate.

Example navigation:

`CreatorAI | Discover | AI Brief Studio | My Workspace | Profile`

Only show links the current user is authorized to access.

On smaller screens, collapse navigation into an accessible mobile menu.

### 4.2 Navigation Behavior

- The active page must have a clear visual indicator.
- The logo should navigate to the landing page or dashboard.
- The profile menu should provide access to relevant account actions.
- Unauthenticated users should be directed to sign in when accessing protected functionality.
- Avoid duplicate navigation links or unrelated actions in the header.

### 4.3 Footer

Use a restrained footer for public pages containing relevant links such as:
- About.
- Contact.
- Terms.
- Privacy.

Do not let the footer distract from creator portfolios or primary actions.

## 5. Landing Page

### Purpose

Explain the platform quickly and direct visitors toward creator discovery or the AI Brief Studio.

### Layout

#### Section A: Hero

Use a two-column desktop layout.

Left column:
- Small eyebrow label such as “The AI Creator Marketplace”.
- Strong headline communicating the value proposition.
- Short supporting description.
- Primary CTA: “Explore Creators”.
- Secondary CTA: “Build a Creative Brief”.

Right column:
- A curated visual composition of AI-generated creative work.
- A few portfolio preview cards with varied aspect ratios.
- Subtle decorative elements, if useful.

Example headline:

**Find the creators behind your next big idea.**

Example supporting text:

“Discover AI filmmakers, generative artists, and creative specialists. Turn your campaign idea into a clear, actionable brief with AI.”

Use genuine project assets or clearly identified demonstration assets. Do not imply that demo content represents verified real clients.

#### Section B: Discovery Preview

Show a small selection of creator cards.

Each card may display:
- Avatar.
- Creator name.
- Specialization.
- Selected skills or tools.
- Portfolio thumbnail.
- Profile link.

CTA: “Explore all creators”.

#### Section C: How It Works

Use three simple steps:
1. Discover creative talent.
2. Describe your campaign.
3. Build a clear brief with AI.

#### Section D: AI Brief Studio Preview

Show a preview of the prompt-to-brief workflow with:
- A natural-language prompt.
- A structured brief preview.
- A CTA to open the studio.

#### Section E: Final CTA

Encourage brands to explore creators or build a brief.

Keep the landing page focused. Avoid adding many unrelated feature sections.

## 6. Creator Discovery Page

### Purpose

Allow brands and agencies to find suitable AI creators quickly.

### Layout

Desktop:
- Page title and short description.
- Search input near the top.
- Filter sidebar or filter toolbar.
- Results count.
- Creator grid.
- Pagination or a “Load more” control if needed.

Mobile:
- Search input across the width.
- Filters accessible through a drawer or collapsible panel.
- One-column or two-column card layout depending on available width.
- Clear access to reset filters.

### Search and Filters

Include supported filters for:
- Keyword.
- Specialization.
- Skills.
- AI tools or models.
- Content type.
- Verification status, if available.

Interaction rules:
- Search should reflect real API data.
- Multiple filters should work together.
- Selected filters should be visually apparent.
- Users must be able to clear individual filters or reset all filters.
- Do not show a filter as functional unless its behavior is implemented.
- Debounce keyword input if needed to avoid excessive API requests.

### Creator Card

Each card should contain:
- Portfolio cover image or representative thumbnail.
- Creator avatar.
- Creator name.
- Primary specialization.
- Short description or biography excerpt.
- A few skill/tool tags.
- Verification indicator, if applicable.
- “View Profile” action.

Visual requirements:
- Keep card heights and spacing consistent.
- Preserve image aspect ratios.
- Use subtle hover states.
- Avoid excessive text inside cards.
- Make the card or its main action keyboard-accessible.
- Do not use a verification badge unless the corresponding status is available and meaningful.

### Discovery States

**Loading:** Show skeleton cards that resemble the final layout.

**Empty:** Explain that no creators match the current search and offer a reset action.

**Error:** Show a clear message and a retry action.

**Success:** Show the result count and matching creator cards.

## 7. Creator Profile Page

### Purpose

Help brands evaluate a creator's skills, style, tools, and creative output.

### Layout

#### Profile Header

Display:
- Avatar.
- Creator name.
- Specialization.
- Short biography.
- Skill tags.
- AI tool/model tags.
- Verification information, if applicable.
- Relevant external links, if supported.

For authenticated profile owners, provide an “Edit Profile” action.

Do not display owner-only editing actions to visitors.

#### Portfolio Section

Use a visually prominent portfolio grid.

Each portfolio item should display:
- Thumbnail or preview.
- Title.
- Content type.
- Optional short description.
- Relevant tool or model tags.

Use a flexible grid that accommodates different image aspect ratios without causing layout shifts.

#### Portfolio Detail View

When a portfolio item is opened, show:
- Larger media preview.
- Title and description.
- Content type.
- Tools and models used.
- Workflow description.
- Creator's role or contribution.
- Licensing information, if supplied.

For video, use an appropriate video player when a valid video asset is available.

For unavailable media, display a useful fallback rather than a broken image or player.

### Verification Presentation

Use explicit, understandable labels such as:
- Verified.
- Pending review.
- Not verified.

Only display statuses supported by stored data.

If a specific workflow or tool has been checked, identify that scope. Do not imply that all of a creator's work has been authenticated based on a limited check.

## 8. Creator Dashboard and Editors

### Creator Dashboard

Provide a simple workspace showing:
- Profile completion status, if calculated from real data.
- Portfolio management entry point.
- Profile preview.
- Verification status, if available.
- Helpful next steps.

Do not display invented analytics or fabricated engagement metrics.

### Profile Editor

Organize profile editing into clear sections:
- Basic information.
- Specialization.
- Skills.
- AI tools and models.
- External links, where supported.

Requirements:
- Use visible labels and contextual help.
- Validate fields before submission.
- Show field-specific errors.
- Provide Save and Cancel actions.
- Warn users about losing unsaved changes when appropriate.
- Provide visible save confirmation.

### Portfolio Manager

Show the creator's existing portfolio items in a manageable list or grid.

Include:
- Add item.
- Edit item.
- Delete item with confirmation.
- Media preview.
- Relevant metadata.

If file upload is supported, show upload progress and validation errors.

If uploads are not implemented, allow the supported media URL workflow instead. Never display a fake upload action.

## 9. Creative Brief Pages

### Brief List

Show:
- Page title.
- “Create Brief” action.
- “Build with AI” action.
- Brief title.
- Content type.
- Last updated date.
- Status, if supported.
- Open/edit action.

Use a table on wide screens or compact cards on mobile.

Show a helpful empty state when no briefs exist.

### Create/Edit Brief Form

Group fields into logical sections.

**Section 1: Project**
- Project title.
- Objective.
- Brand or product context.

**Section 2: Audience and Creative Direction**
- Target audience.
- Content type.
- Visual style.
- Platform or channel.

**Section 3: Deliverables**
- Quantity.
- Duration, if relevant.
- Aspect ratio or format.
- Output requirements.

**Section 4: Commercial Details**
- Budget range, if provided.
- Deadline.
- Licensing and commercial-use requirements.

**Section 5: Additional Notes**
- Supporting context.
- References.
- Other requirements.

Use conditional fields where useful. For example, video duration may be relevant to video deliverables but not static graphics.

Requirements:
- Clearly mark required fields.
- Use dropdowns for standardized values when appropriate.
- Use text areas for longer creative descriptions.
- Keep labels above inputs.
- Validate values on both frontend and backend.
- Do not erase entered values after a validation error.
- Display a clear save result.

## 10. AI Brief Builder Studio

### Purpose

This is the signature interface of CreatorAI.

It should transform a rough creative idea into an editable, structured brief in a way that feels like a creative collaboration.

### Design Concept

Use a focused studio layout rather than a generic chat screen or a long, overwhelming form.

On desktop, use a two-panel layout:

**Left panel: Prompt and context**
- Studio heading.
- Short explanation.
- Large natural-language input.
- Optional reference/context fields if implemented.
- Generate button.
- Helpful prompt example.

**Right panel: Generated brief**
- Editable structured fields.
- Missing-information indicators.
- AI suggestion labels where needed.
- Save Draft or Save Brief action.

Before generation, the right panel may show an attractive empty state explaining what will appear after the prompt is submitted.

On mobile, stack the prompt and brief panels vertically. After generation, make it easy to move between the prompt and generated output.

### Example Prompt

“Create a premium 20-second product video for a skincare launch. Use a clean, futuristic visual style for Instagram Reels. The campaign should feel elegant and minimal.”

Display example prompts as optional, clickable suggestions if implemented.

### Generation Interaction

1. User enters a prompt.
2. User clicks “Generate Brief”.
3. The button enters a loading state.
4. The application sends the request to the backend.
5. The generated structured brief appears.
6. The user edits fields directly.
7. The user saves the brief.

While generating:
- Disable duplicate submissions where appropriate.
- Show a clear progress indicator.
- Preserve the original prompt.
- Do not pretend that generation has completed before the API returns a result.

### Generated Brief Editor

Use distinct field controls appropriate to each value:
- Text input for title.
- Text area for objective and description.
- Select controls for standardized content types.
- Editable tags for supported skills or styles.
- Suitable controls for duration, quantity, or format.
- Optional sections for budget and licensing.

Every generated field should be editable.

Distinguish:
- User-provided details.
- AI-suggested details.
- Missing information requiring confirmation.

Do not treat inferred values as confirmed user instructions.

### Missing Information

If information is incomplete, show a subtle message such as:

“Your brief is ready to review. Add a deadline and confirm the licensing requirements before sharing it.”

Do not block the entire brief merely because optional information is missing.

### Save Behavior

Provide a prominent primary action:
- “Save Draft” for a draft workflow.
- “Save Brief” for the normal save action.

Use the action names that match the backend's actual supported status transitions.

After saving:
- Show a confirmation message.
- Navigate to the brief detail page or update the current view.
- Ensure the saved record can be retrieved from the backend.

### AI Error State

If generation fails:
- Keep the prompt in the input.
- Show a concise error message.
- Provide a retry action.
- Avoid losing user-entered content.
- Do not show invented generated fields as if they came from the AI.

### Accessibility

- Label the prompt input.
- Announce generation status accessibly.
- Ensure all fields are keyboard-accessible.
- Use visible focus states.
- Do not communicate errors only through color.

## 11. Authentication Screens

### Login

Include:
- CreatorAI wordmark.
- Page title.
- Email field.
- Password field.
- Show/hide password control, if implemented.
- Login button.
- Link to registration.
- Clear validation and server errors.

### Registration

Include:
- Name.
- Email.
- Password.
- Account role selection for creator or brand/agency.
- Registration button.
- Link to login.

Keep registration concise. Avoid asking for full profile or campaign details during account creation.

Requirements:
- Provide password guidance.
- Clearly communicate account creation errors.
- Never expose password values in logs or URLs.
- Do not assume that a frontend role selection grants administrative privileges.

## 12. Reusable Component System

Create reusable components where they reduce duplication and improve consistency.

Suggested shared components:
- `AppLayout`
- `Navbar`
- `Footer`
- `PageHeader`
- `Button`
- `Input`
- `Textarea`
- `Select`
- `Tag`
- `CreatorCard`
- `PortfolioCard`
- `PortfolioGrid`
- `SearchBar`
- `FilterPanel`
- `VerificationBadge`
- `BriefCard`
- `BriefForm`
- `BriefField`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `Modal`
- `Toast` or notification component

Component names may be adjusted to fit the existing repository conventions.

Requirements:
- Reuse common styles and behavior.
- Avoid creating abstractions for one-off elements unless they simplify the design.
- Keep components focused.
- Separate API/data logic from presentation where appropriate.
- Use consistent button sizes, input heights, border radii, and spacing.

## 13. Interaction Standards

### Buttons

Use three clear levels:
- **Primary:** The most important action in a section.
- **Secondary:** A supporting action.
- **Tertiary or text:** Low-emphasis navigation or optional actions.

Requirements:
- Buttons must have real behavior.
- Show loading states during asynchronous operations.
- Prevent duplicate submissions when necessary.
- Use disabled states only when justified.
- Provide hover, focus, and pressed states.

### Forms

- Labels must remain visible when fields contain values.
- Validation messages should appear near relevant fields.
- Required and optional fields must be distinguishable.
- Preserve entered values after errors.
- Use confirmation before destructive actions.

### Cards

- Keep card spacing consistent.
- Make clickable regions obvious.
- Avoid placing unrelated actions inside a clickable card.
- Use subtle hover states instead of dramatic motion.
- Preserve image proportions.

### Modals and Drawers

- Use for focused tasks, confirmations, or mobile filters.
- Keep the content concise.
- Support keyboard navigation and appropriate focus handling.
- Allow users to close them in an understandable way.

### Notifications

Use concise messages:
- “Profile updated.”
- “Brief saved.”
- “Unable to generate the brief. Please try again.”
- “No creators match these filters.”

Do not use browser alerts as the default notification system.

## 14. Responsive Design

Use responsive Tailwind utilities and test at common viewport sizes.

### Desktop
- Full navigation.
- Multi-column creator and portfolio grids.
- Two-panel AI Brief Studio.
- Comfortable form widths.

### Tablet
- Reduced grid columns.
- Flexible navigation.
- Narrower sidebars.
- AI Studio panels that adapt to available width.

### Mobile
- Compact navigation.
- Single-column forms.
- Stacked AI Studio panels.
- Accessible filter drawer.
- Large enough touch targets.
- No horizontal overflow.
- Readable card text and metadata.

The interface must remain usable at narrow widths, not merely shrink to fit.

## 15. Motion and Microinteractions

Use subtle, purposeful motion for:
- Card hover feedback.
- Button interaction states.
- Filter drawer transitions.
- Loading indicators.
- Brief generation progress.
- Success feedback.

Avoid:
- Excessive parallax.
- Constant animation.
- Distracting background effects.
- Long transitions that delay interaction.

Respect reduced-motion preferences where possible.

## 16. Accessibility

Follow accessible interface practices:
- Semantic HTML.
- Correct heading hierarchy.
- Labels for form controls.
- Keyboard navigation.
- Visible focus indicators.
- Adequate color contrast.
- Alternative text for meaningful images.
- Accessible status announcements.
- Clear validation messages.
- Descriptive button labels.

Do not rely solely on color to communicate selected, verified, pending, or error states.

## 17. Frontend Implementation Rules

- Use React with Vite.
- Use Tailwind CSS for styling.
- Follow the project's existing folder structure where established.
- Use reusable components for repeated UI patterns.
- Keep business logic and API calls out of unnecessarily complex presentation components.
- Use the project's existing API client if available.
- Handle loading, success, empty, and error states for API-driven pages.
- Keep frontend types or schemas aligned with backend API responses.
- Avoid hardcoded production data.
- Use demo data only when clearly intended for local development or the hackathon demo.
- Do not add dependencies without a clear need.
- Keep secrets and AI provider keys out of frontend code.
- Ensure all visible buttons, filters, links, and form controls have meaningful behavior.

## 18. UI Quality Checklist

Before considering a page complete, verify:

- [ ] The page has a clear purpose and heading.
- [ ] The primary action is obvious.
- [ ] The layout follows the shared design system.
- [ ] Text and controls are readable.
- [ ] Spacing and alignment are consistent.
- [ ] API data is displayed correctly.
- [ ] Loading states are present where needed.
- [ ] Empty states are helpful.
- [ ] Errors are understandable and recoverable.
- [ ] Forms preserve values after errors.
- [ ] Buttons and filters perform their advertised actions.
- [ ] Desktop and mobile layouts work.
- [ ] Keyboard focus is visible.
- [ ] No broken images, placeholder links, or unintended horizontal scrolling remain.
- [ ] The UI does not make unsupported claims about creators or verification.

## 19. Priority for UI Implementation

Implement the interface in this order:

1. Shared application layout, navigation, typography, and design tokens.
2. Creator discovery page and creator cards.
3. Creator profile and portfolio views.
4. Authentication and role-aware navigation.
5. Creative brief list and form.
6. AI Brief Builder Studio.
7. Creator profile and portfolio editing.
8. Loading, error, empty, and responsive states.
9. Visual polish and demo preparation.

If the repository already contains working pages, improve them incrementally rather than rebuilding them without reason.

## 20. Final UI Principle

**CreatorAI should make creative talent easy to discover and complex campaign ideas easy to structure.**

Every screen should support one of those goals. Prefer clarity, real functionality, and a cohesive visual system over decorative complexity.