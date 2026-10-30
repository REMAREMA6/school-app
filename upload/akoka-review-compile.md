# Akoka Federal Academy — Review & Compile Screen

## Goal

Implement the **Review & Compile** screen shown in the supplied reference image in the existing React Native application. Follow the repository's established conventions. Reuse the dashboard's shared sidebar, top bar, theme handling, design tokens, typography, icons, buttons, badges, and card components.

Before coding, inspect the existing dashboard, Upload Results screen, user/student models, assessment configuration, and navigation. Adapt file paths and component names to the actual codebase. Do not duplicate the shared application shell or introduce a separate design system.

## Shared application shell

- Highlight **Review & Compile** in the sidebar.
- Page title: `Review & Compile`
- Subtitle: `Review imported scores, correct errors, verify results, and prepare compilation.`
- Reuse the shared notification badge, theme toggle, and administrator profile.
- Match the reference's light background, dark-green accents, thin pale borders, compact tables, status chips, and rounded cards.
- At narrow widths, stack the batch list, review workspace, and student details panel vertically. Avoid forcing the desktop three-column layout onto small screens.

## 1. Summary cards

At the top of the content area, render four clickable summary cards:

| Card | Value | Supporting text |
|---|---:|---|
| Draft Records Awaiting Review | 42 | From 6 batches |
| Unmatched Students | 12 | Requires attention |
| Invalid Scores | 8 | Need correction |
| Uncertain Values | 6 | Needs verification |

Use distinct icon tiles: amber for draft records, blue for unmatched students, red for invalid scores, and purple for uncertain values. Each card has a right chevron. Clicking a card should apply the corresponding review filter or focus the relevant issue list; it should not be decorative.

## 2. Uploaded Batches panel (left column)

Panel heading: `Uploaded Batches`

Controls:
- Search input: `Search batches...`
- Status dropdown: `All Statuses`

Display six batch cards using the sample data below. Each card shows batch name, class arm, subject, source type, upload date/time, and status badge. Highlight the selected batch using a pale-green background and green border.

| Batch Name | Class Arm | Subject | Source | Uploaded By | Upload Date | Status |
|---|---|---|---|---|---|---|
| JSS1A_Maths_T2_2025 | JSS1A | Mathematics | Excel/CSV | Tunde Balogun | Aug 24, 2025 10:32 AM | Under Review |
| SS2B_Eng_T2_2025 | SS2B | English Language | PDF | Adebayo Johnson | Aug 23, 2025 04:17 PM | Draft |
| JSS3A_Sci_T2_2025 | JSS3A | Biology | Excel/CSV | Emmanuel Ibe | Aug 22, 2025 11:45 AM | Verified |
| SS1B_Comp_T2_2025 | SS1B | Computer Studies | PDF | Grace Okafor | Aug 21, 2025 02:20 PM | Rejected |
| JSS2A_Eng_T2_2025 | JSS2A | English Language | Excel/CSV | Blessing Adekunle | Aug 20, 2025 09:15 AM | Draft |
| SS3C_Gov_T2_2025 | SS3C | Government | Excel/CSV | Fatima Hashim | Aug 18, 2025 03:42 PM | Under Review |

The first batch, `JSS1A_Maths_T2_2025`, is selected initially.

Show `Showing 1–6 of 6 batches` below the list. Batch search and status filtering must work together.

## 3. Main review workspace (center column)

### Selected batch header

For the initially selected batch, show:
- Spreadsheet icon
- Batch name: `JSS1A_Maths_T2_2025`
- Status: `Under Review`
- Class: `JSS1A`
- Subject: `Mathematics`
- Source: `Excel/CSV`
- Uploaded by: `Tunde Balogun`
- Upload date: `Aug 24, 2025 10:32 AM`

### Review progress

Show a progress bar and these values:
- `67%`
- `34 of 50 records reviewed`

The progress should be derived from reviewed-record state if implemented; otherwise initialize it with the reference's sample values and update it consistently as records are reviewed.

### Validation warning

Show a red/pale-red alert:
`There are 3 unmatched students and 2 invalid scores in this batch. Please review and correct before confirming.`

The warning should reflect the selected batch's issue counts, not be hardcoded for every batch if batch-specific data exists.

### Review toolbar

Provide:
- Student sort dropdown, initially `Student Name (A–Z)`
- Search input: `Search students...`
- Match-status dropdown, initially `All Match Statuses`
- **Bulk Actions** button
- Three-dot menu for additional supported actions

Search and filters must update the displayed student records. Bulk actions should act on selected checkboxes and show only actions the implementation supports.

### Student score table

Use a horizontally scrollable table-like layout or responsive native row layout with columns:

1. Selection checkbox
2. Student Name / Admission No.
3. CA Components
   - Assgn.
   - T1
   - T2
   - Prac.
   - Proj.
4. Exam
5. Total
6. Match Status
7. Validation Status
8. Actions

Use these initial records, matching the values visible in the reference:

| Student | Admission No. | Assgn. | T1 | T2 | Prac. | Proj. | Exam | Total | Match Status | Validation Status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Hajara Abubakar | AK/2024/0012 | 5 | 5 | 5 | 5 | 20 | 58 | 98 | Matched | Valid |
| Chukwuemeka Okafor | AK/2023/0084 | 5 | 5 | 5 | 5 | 20 | 56 | 96 | Unmatched | Valid |
| Amina Ibrahim | AK/2024/0031 | 5 | 5 | 4 | 5 | 19 | 52 | 90 | Matched | Invalid |
| Oluwaseun Adeyemi | AK/2022/0068 | 5 | 5 | 5 | 5 | 20 | 60 | 100 | Matched | Valid |
| Ifeoma Nwosu | AK/2023/0045 | 5 | 5 | 5 | 5 | 20 | 48 | 88 | Matched | Valid |
| Abdulrahman Bello | AK/2024/0076 | 5 | 5 | 5 | 5 | 20 | 54 | 94 | Matched | Uncertain |
| Zainab Yusuf | AK/2023/0029 | 5 | 4 | 5 | 5 | 20 | 50 | 89 | Matched | Valid |
| Tunde Balogun | AK/2024/0057 | 5 | 5 | 5 | 5 | 20 | 55 | 95 | Matched | Valid |
| Fatima Hashim | AK/2024/0061 | 5 | 5 | 4 | 5 | 19 | 49 | 87 | Matched | Invalid |
| Ibrahim Musa | AK/2023/0074 | 5 | 5 | 5 | 5 | 20 | 57 | 97 | Unmatched | Valid |

The reference includes ten visible rows. Use a pale red/pink row tint for issue rows where appropriate. Use status chips:
- Match: `Matched` green; `Unmatched` amber
- Validation: `Valid` green; `Invalid` red; `Uncertain` purple

Row actions:
- Edit score (pencil icon)
- Remove/reject record (trash icon) with confirmation before changing state

Implement selection checkboxes and a selected-record count for bulk actions. Avoid implying that the demo rows came from an actual parsed file unless that data is wired up.

## 4. Student details panel (right column)

Initially show the details for **Chukwuemeka Okafor**, with a close icon.

Header:
- Avatar initials: `CO`
- Name: `Chukwuemeka Okafor`
- Admission number: `AK/2023/0084`
- Match status: `Unmatched`

Tabs:
- `Details` (selected by default)
- `Scores`
- `Activity`

### Details tab

#### Student Information
- Full Name: Chukwuemeka Okafor
- Gender: Male
- Date of Birth: Mar 12, 2008 (17 years)

#### Guardian Information
- Name: Mr. Emmanuel Okafor
- Phone: 0806 123 4567
- Relationship: Father

#### Academic Information
- Class: JSS1A
- Admission Number: AK/2023/0084
- Current Session: 2024/2025

#### Add Assignment

Show a compact form:
- Assignment Type radio options:
  - Form Teacher (Class Arm)
  - Subject Teacher (Subject + Class)
- Class Arm dropdown, required
- Subject dropdown, required
- **Add Assignment** button

The assignment UI should reuse the application's existing user-assignment patterns if available. If no assignment service exists, keep changes local and do not claim backend persistence.

### Scores tab

Show this selected student's CA component scores, exam score, total, match status, and validation status. Allow editing only if supported by the existing score editor. Changes should update the current local record consistently.

### Activity tab

Show a concise activity timeline for this record, using actual audit data if available. If not, use clearly understood demo events; do not represent fabricated events as real audit history.

## 5. Review Summary (right column)

Below the student detail/assignment area, show a `Review Summary` card with four counts:

- Total Rows: 50
- Unmatched: 3
- Invalid: 2
- Uncertain: 6

Use matching icon colors and keep counts consistent with the selected batch when its underlying issue data is available. The reference shows a total of 50 rows, 3 unmatched, 2 invalid, and 6 uncertain.

## 6. Bottom actions

At the bottom of the right panel, provide:
- **Save Draft**
- **Reject Batch**
- **Confirm Batch** (disabled while blocking issues remain)

Behavior:
- **Save Draft** saves current progress through the existing backend service if one exists; otherwise update local state only and clearly treat it as a demo.
- **Reject Batch** opens a confirmation dialog and then changes the local/backend status only through a supported implementation.
- **Confirm Batch** stays disabled while unmatched students, invalid scores, or other configured blocking issues remain. Show a concise reason when disabled.
- After successful confirmation, update status/progress only when the implemented service reports success.
- Include the footer note: `Results will be verified before becoming official score data.`

## Interactions and state requirements

Use the application's established state-management conventions and derive dependent UI from shared state.

1. Selecting a batch updates its metadata, status, review progress, records, warning counts, and summary.
2. Batch search and status filter work together.
3. Selecting a summary card applies/focuses the corresponding issue filter.
4. Student search and match-status filter work together.
5. Student sorting supports at least name ascending.
6. Selecting a student row updates the right-hand details panel.
7. Details, Scores, and Activity tabs switch content.
8. Checkboxes support individual and select-all selection.
9. Bulk Actions operates on selected records and reports what was changed.
10. Edit score opens an editor with validation based on the configured assessment maximums.
11. Record removal/rejection requires confirmation.
12. Add Assignment validates required fields and updates local state or the existing backend.
13. Save Draft, Reject Batch, and Confirm Batch have explicit loading/success/error states where real service operations exist.
14. Confirm Batch cannot proceed with blocking validation issues.
15. Close details collapses the panel; on mobile, return to the main review workspace.
16. The app-wide theme toggle continues to use the shared theme state.

## Implementation conventions

- Inspect existing dashboard, Upload Results, Students, Assessment Configuration, and Users & Permissions implementations before coding.
- Reuse shared shell and reusable components; do not copy the sidebar or top bar into this screen.
- Follow the repository's current TypeScript/JavaScript choice, navigation, styling, and state-management conventions.
- Use React Native-compatible primitives and existing project components. Do not use web-only `div`, `table`, or HTML form controls in a native screen.
- Use the icon library already installed.
- Avoid new dependencies unless justified by the current implementation.
- Do not invent backend endpoints or claim saved/verified data without a real successful operation.
- Preserve accessible labels and adequate touch targets.
- Keep the implementation focused; do not refactor unrelated screens.

## Acceptance checklist

- [ ] Shared app shell is reused and Review & Compile is highlighted.
- [ ] Four summary cards match the reference values.
- [ ] Batch search/status filter and selection work.
- [ ] Review progress and batch metadata update on selection.
- [ ] Score table displays the ten sample rows and status indicators.
- [ ] Student search, status filtering, sorting, selection, and row actions work.
- [ ] Selecting a student updates the details panel and tabs.
- [ ] Assignment form validates required fields.
- [ ] Review Summary counts are visible and consistent with the selected batch data.
- [ ] Confirm Batch is blocked while required issues remain.
- [ ] Responsive layout works on narrow screens.
- [ ] Existing React Native project conventions are followed.
- [ ] No unsupported backend persistence or verification is falsely claimed.
