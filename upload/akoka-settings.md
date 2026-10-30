# Akoka Federal Academy — Settings Screen

## Goal

Implement the **Settings** screen shown in the supplied reference image in the existing React Native application. Follow the repository's established conventions and reuse the existing dashboard shell, shared components, styling tokens, icons, navigation, theme state, and state-management approach.

Before coding, inspect the current dashboard and existing screens to identify the real component structure, shared header/sidebar, settings conventions, and any existing preferences or audit-log data. Adapt file paths and component names to the repository. Do not duplicate the app shell or introduce a separate design system.

## Page header and shell

- Sidebar active item: `Settings`.
- Page title: `Settings`
- Subtitle: `Customize application preferences and result compilation workflows.`
- Reuse the existing top-right notification icon with unread badge, theme toggle, and administrator profile.
- Preserve the existing dark-green sidebar, pale background, white cards, subtle borders, compact typography, and green accent buttons.
- At narrow screen widths, stack the General Settings, Notifications, Security, and Audit Log areas vertically without horizontal overflow.

## Tabs

Display four tabs at the top of the page:

1. `General` — selected initially
2. `Notifications`
3. `Security`
4. `Audit Log`

Use the app's existing tab component if available. Switching tabs should navigate to or focus the relevant section and make the selected tab visually clear. The reference shows General selected while all four settings sections are visible together on desktop; preserve that desktop arrangement if it fits the existing application layout. On narrow screens, tabs may switch the visible section to conserve space.

## Layout

Desktop layout:
- Left column: General Settings card.
- Upper-right area: Notifications card on the left and Security card on the right.
- Lower-right area: Audit Log card spanning the right-side columns.

Use a responsive layout rather than fixed screenshot coordinates.

## 1. General Settings card

Heading: `General Settings`

Description: `Configure basic application settings and school information.`

Provide the following labeled controls:

### School Name
- Required text input
- Initial value: `Akoka Federal Academy`

### Academic Year Start
- Required academic-session/year input
- Initial value: `2024/2025`
- Helper text: `Format: YYYY/YYYY`
- Calendar icon where supported by the existing component library

### Grading Scale
- Required dropdown
- Initial value: `A1 - F9 (9-point)`
- Reuse grading-scale options from School Configuration if available.

### Language
- Required dropdown
- Initial value: `English`

### Time Zone
- Required dropdown
- Initial value: `Africa/Lagos (WAT)`
- Helper text: `Current time: Aug 26, 2025 10:22 AM` (reference sample text; do not treat it as live time)

### Continuous Assessment Maximum
- Required numeric input
- Initial value: `40`
- Helper text: `Must be between 10 and 60`
- Validate the value as numeric and between 10 and 60.

Buttons:
- `Reset to Default`
- `Save Changes`

Behavior:
- Required fields must be validated.
- Reset to Default restores the screen's default values after confirmation if the project convention requires it.
- Save Changes uses the existing settings persistence service if one exists. Otherwise, update local state only and do not imply that settings were saved remotely.
- Show a visible success or error message based on the actual outcome.

## 2. Notifications card

Heading: `Notifications`

Description: `Manage when and how you receive notifications.`

Render four notification preference rows with an icon, title, description, and toggle:

| Preference | Description | Initial state |
|---|---|---|
| New Result Uploads | Get notified when new result batches are uploaded. | On |
| Batch Status Updates | Receive updates on batch review and verification status. | On |
| Report Card Updates | Get notified about report card approvals and publications. | On |
| System Alerts | Important system and security notifications. | On |

Toggles must be interactive and reflect shared/local preference state. Use the application's existing switch component and touch-target conventions.

## 3. Security card

Heading: `Security`

Description: `Configure security and workflow settings.`

Render these controls:

| Setting | Description | Initial state |
|---|---|---|
| Require Approval for Publishing | Enable approval workflow before publishing report cards. | On |
| Allow Bulk Operations | Permit bulk actions for multiple records. | On |
| Two-Factor Authentication | Require 2FA for administrator accounts. | Off |

Also include:
- `Session Timeout` dropdown, initial value `30 minutes`
- `Save Changes` button

Behavior:
- Switches and timeout selection update state.
- Save Changes uses the existing persistence layer if available; otherwise only update local state.
- Do not claim two-factor authentication is enabled at the account/backend level merely because the local toggle is switched on. If no 2FA integration exists, label the control as a preference or indicate that setup is required.

## 4. Audit Log card

Heading: `Audit Log`

Description: `Latest 50 activity events in the system.`

Include a `View Full Log` action. It should open the existing audit-log screen or navigate to a full log view if one exists. Do not invent a route; inspect the project's navigation first.

Display a compact table with these columns:
- Timestamp
- User
- Action
- Affected Record
- Event Details

Use the following sample rows from the reference:

| Timestamp | User | Action | Affected Record | Event Details |
|---|---|---|---|---|
| Aug 26, 2025 10:12 AM | Tunde Balogun | Score Correction | JSS1A - Mathematics | Corrected score from 72 to 78 for Hajara Abubakar |
| Aug 26, 2025 09:45 AM | Grace Okafor | Batch Confirmed | JSS1A_Maths_T2_2025 | Batch confirmed for 42 records |
| Aug 26, 2025 08:30 AM | Emmanuel Ibe | Student Updated | AK/2024/0012 | Updated guardian contact information |
| Aug 26, 2025 07:15 AM | Fatima Hashim | Report Card Published | AK/2024/0061 | Published JSS3 report card for Ibrahim Musa |
| Aug 25, 2025 04:22 PM | Adebayo Johnson | Batch Under Review | SS2B_Eng_T2_2025 | Moved batch to review stage |
| Aug 25, 2025 11:03 AM | Mrs. Grace Okafor | User Login | System | Administrator login from 196.0.0.45 |
| Aug 24, 2025 03:17 PM | Chukwuemeka Okafor | Subject Assignment | Mathematics - JSS1A | Assigned Mathematics to JSS1A |
| Aug 24, 2025 10:56 AM | Ibrahim Kanu | Result Upload | JSS3A_Sci_T2_2025 | Uploaded 36 records from Excel file |

Use compact action badges with distinct colors where appropriate:
- Score Correction: blue
- Batch Confirmed: green
- Student Updated: purple
- Report Card Published: teal
- Batch Under Review: amber
- User Login: neutral blue/gray
- Subject Assignment: purple
- Result Upload: blue

Use the existing table/list patterns. On small screens, use horizontally scrollable rows or compact stacked event cards.

## State and interaction requirements

1. General tab selection and all other tabs work.
2. General fields are editable and validation messages are clear.
3. Reset to Default restores default settings.
4. General Save Changes validates and reports the real save outcome.
5. Each notification toggle works independently.
6. Security toggles and session timeout selection work.
7. Security Save Changes reports the real save outcome.
8. View Full Log invokes an existing route/action or shows a supported full-log view.
9. Audit log action badges are visually distinct and readable.
10. Shared theme toggle continues to use the app-wide theme state.
11. Responsive layouts avoid clipped fields, tables, and buttons.

## Implementation conventions

- Inspect and reuse the current dashboard shell and existing settings, school configuration, and audit-log components before creating new ones.
- Follow the project's existing React Native language, file structure, navigation, styling, and state-management conventions.
- Use React Native-compatible primitives and existing UI components. Do not use web-only `div`, `table`, HTML inputs, or CSS frameworks in a native screen.
- Use the icon and switch libraries already installed; avoid unnecessary new dependencies.
- Reuse the grading scale and academic session conventions from School Configuration where possible.
- Do not invent backend endpoints, audit records, or persistence behavior.
- If the shown audit rows are only mock data, keep them explicitly as sample/demo data unless connected to a real audit service.
- Keep this implementation focused on Settings; do not refactor unrelated screens.

## Acceptance checklist

- [ ] Existing app shell is reused and Settings is highlighted in the sidebar.
- [ ] Four tabs are displayed and functional.
- [ ] General Settings form matches the reference values and validates input.
- [ ] Reset to Default and Save Changes behave correctly.
- [ ] Four notification preferences have working toggles.
- [ ] Security preferences and timeout dropdown work.
- [ ] Audit Log displays the eight sample events with action badges.
- [ ] View Full Log uses a real existing route/action or supported view.
- [ ] Layout responds to narrow screens.
- [ ] No web-only elements are used in the React Native implementation.
- [ ] No unsupported backend persistence or security features are falsely claimed.
