# Akoka Federal Academy — Users & Permissions Screen

## Purpose

Implement the **Users & Permissions** screen from the supplied reference image in the existing React Native application. Follow the project's current conventions and reuse the dashboard's shared layout, sidebar, top bar, theme handling, typography, spacing, colors, icons, and reusable components.

> This specification describes the screen UI and interactions. Adapt file paths, component names, navigation, and styling APIs to the existing codebase rather than creating a separate design system.

## Screen layout

Create a `UsersPermissionsScreen` (or the equivalent screen name used by the project).

### 1. Shared application shell

- Reuse the existing application sidebar and top bar; do not duplicate their implementation.
- Highlight **Users & Permissions** in the sidebar.
- Keep the shared notification bell with its red count badge, theme toggle, administrator avatar, and account menu.
- The screen title is **Users & Permissions**.
- Subtitle: `Manage school staff, teaching assignments, and account roles.`
- Match the reference image's white/light content background, dark-green accents, pale borders, subtle shadows, rounded cards, and compact school-administration dashboard density.
- Keep the layout responsive to the available React Native window width. On narrow screens, stack the directory and user-details panel instead of forcing the desktop two-column layout.

### 2. Summary cards

Show four cards across the top of the content area:

| Card | Value | Supporting text |
|---|---:|---|
| Total Users | 18 | ↑ 2 new this term |
| Active Users | 16 | ↑ 1 new this term |
| Teachers | 12 | ↑ 1 new this term |
| Administrators | 2 | — No change |

Use a distinct pale icon background for each card. Use compact labels, prominent numeric values, and green/teal supporting text. On narrow screens, wrap cards into fewer columns.

### 3. User directory

Below the summary cards, show the user directory with these controls:

- Search field with placeholder: `Search by name, email or phone...`
- Role filter, default `All Roles`
- Status filter, default `All Statuses`

Display a table-like directory with columns:

1. Name
2. Email
3. Phone
4. Role
5. Assigned Classes
6. Assigned Subjects
7. Status
8. Actions

Use the following initial sample records from the reference image:

| Name | Email | Phone | Role | Assigned Classes | Assigned Subjects | Status |
|---|---|---|---|---|---|---|
| Adebayo Johnson | adebayo.johnson@akoka.edu.ng | 0803 456 7890 | Administrator | — | — | Active |
| Mrs. Grace Okafor | grace.okafor@akoka.edu.ng | 0806 123 4567 | Form Teacher | JSS1A | Mathematics, English Language | Active |
| Emmanuel Ibe | emmanuel.ibe@akoka.edu.ng | 0812 345 6789 | Subject Teacher | SS1B, SS2B | Physics, Chemistry | Active |
| Blessing Adekunle | blessing.adekunle@akoka.edu.ng | 0703 987 6543 | Subject Teacher | JSS3A, SS3A | Biology, Agricultural Science | Active |
| Samuel Tunde | samuel.tunde@akoka.edu.ng | 0809 111 2233 | Form Teacher | SS2A | — | Active |
| Oluwaseun Lawal | lawal.oluwaseun@akoka.edu.ng | 0814 555 6677 | Subject Teacher | SS1A, SS1B | English Language, Literature-in-English | Active |
| Fatima Hashim | fatima.hashim@akoka.edu.ng | 0706 222 3344 | Subject Teacher | JSS2B, JSS3B | Civic Education, Government | Active |
| Ahmed Bello | ahmed.bello@akoka.edu.ng | 0807 888 9999 | Exam Officer | — | — | Active |
| Zainab Musa | zainab.musa@akoka.edu.ng | 0815 666 7788 | Librarian | — | — | Active |
| Ibrahim Kanu | ibrahim.kanu@akoka.edu.ng | 0708 444 5566 | ICT Support | — | — | Inactive |

- Highlight the selected row with a pale green background and border.
- Use colored circular initials avatars.
- Use compact role badges with role-specific colors.
- Use green `Active` badges and a muted/red `Inactive` badge.
- Add a three-dot action control to each row.
- Show `Showing 1–10 of 18 users` below the table.
- Pagination controls: previous, page 1 (selected), page 2, next.
- Add a prominent dark-green **Add User** button above the directory table. Place it consistently with the reference's directory controls.

### 4. User details panel

On the right side at desktop widths, show a bordered details panel for the selected user, initially **Mrs. Grace Okafor**. Include a close icon in the panel header.

Header content:
- Initials avatar: `MO`
- Name: `Mrs. Grace Okafor`
- Role badge: `Form Teacher`
- Email: `GRACE.Okafor@akoka.edu.ng`
- Phone: `0806 123 4567`
- Status badge: `Active`

Provide three actions:
- **Edit User**
- **View Profile**
- **Reset Password**

#### Basic Information

Present the information in two columns:

- Full Name: Mrs. Grace Okafor
- Role: Form Teacher
- Email: grace.okafor@akoka.edu.ng
- Gender: Female
- Phone: 0806 123 4567
- Date Joined: Aug 12, 2024

#### Assigned Classes

Show a section title and badge `2 classes`, followed by chips:
- JSS1A
- JSS1B

#### Assigned Subjects

Show a section title and badge `2 subjects`, followed by chips:
- Mathematics
- English Language

#### Assignment and activity tabs

Provide two tabs:
- **Assignments** (selected by default)
- **Activity Log**

The Assignments tab shows an **Add Assignment** card/form.

Form fields:
- Assignment Type radio selection:
  - Form Teacher (Class Arm)
  - Subject Teacher (Subject + Class)
- Class dropdown, required
- Arm dropdown, required
- Subject dropdown, optional
- Cancel and **Save Assignment** buttons

The reference shows Form Teacher selected. Use sample options appropriate to the displayed data, such as JSS1, SS1, JSS2, SS2, JSS3, SS3 for classes and A/B/C for arms. Filter arm options when a class is selected if the current app supports dependent selects.

The Activity Log tab should show a concise timeline/list of sample user activity. Clearly treat sample activity as demo data unless the application already has real audit/activity records.

## Interaction requirements

Implement these behaviors using the project's established patterns and state-management approach:

1. **Search:** filter the user list by name, email, or phone as the user types.
2. **Role filter:** filter users by their role.
3. **Status filter:** filter users by Active/Inactive status.
4. **Row selection:** selecting a user updates the details panel.
5. **Close details:** hide or collapse the details panel. On small screens, this should return to the directory.
6. **Pagination:** previous/next and page buttons update the visible page. Use a page size of 10 for the demo data and keep the page indicator consistent.
7. **Add User:** open the project's standard add-user form/modal or navigate to the existing user-creation route. Do not invent a backend endpoint.
8. **Row actions:** expose the existing actions menu pattern, with options such as View, Edit, and Deactivate/Activate. Wire actions only where the project has corresponding behavior; otherwise present a clearly labeled placeholder/modal rather than claiming data was saved.
9. **Edit User:** open the existing edit form or a local editable form consistent with the app.
10. **View Profile:** open the profile view/route if one exists.
11. **Reset Password:** show a confirmation dialog before proceeding. If no password-reset integration exists, explain that this is a UI-only placeholder.
12. **Assignment type:** selecting Form Teacher or Subject Teacher updates the assignment form fields and labels appropriately.
13. **Save Assignment:** validate required fields and update the local assignment state if there is no backend integration. Do not claim server persistence.
14. **Cancel:** reset the unsaved assignment form.
15. **Tabs:** switch between Assignments and Activity Log.
16. **Theme:** use the existing app-wide theme toggle rather than implementing a screen-specific theme system.

## Implementation conventions

- First inspect the existing dashboard and neighboring screens to follow the repository's exact conventions.
- Reuse existing shared components and tokens; do not copy the entire sidebar/top bar into this screen.
- Use the project's installed icon library and React Native-compatible components.
- Use `View`, `Text`, `TextInput`, `Pressable`, `ScrollView`, `FlatList`, and the project's established UI primitives as appropriate. Do not use web-only elements such as `div`, `table`, or HTML inputs in a native React Native screen.
- Follow the project's existing navigation, TypeScript/JavaScript choice, styling approach, and state-management patterns.
- If this project uses Expo Router, follow its current route/file conventions; otherwise use its existing navigation structure.
- Avoid adding dependencies unless the project already uses them or a dependency is necessary and explicitly justified.
- Keep the code modular: separate the screen, user data/types, and small repeated UI elements only where that matches existing repository conventions.
- Preserve accessibility labels and usable touch targets for interactive controls.
- Use consistent formatting and avoid unrelated refactors.

## Acceptance checklist

- [ ] The screen uses the existing shared application shell.
- [ ] Users & Permissions is highlighted in the sidebar.
- [ ] Four summary cards match the reference values.
- [ ] Search, role filter, and status filter work together.
- [ ] Selecting a directory row updates the detail panel.
- [ ] The selected user details include the specified sections and actions.
- [ ] Assignment tabs and form controls are interactive.
- [ ] Pagination correctly reflects the visible page.
- [ ] Narrow layouts stack the detail panel appropriately.
- [ ] No web-only HTML elements are used.
- [ ] No backend integration or successful persistence is falsely claimed.
