# Akoka Federal Academy — Upload Results Screen

## Goal

Implement the **Upload Results** screen shown in the supplied reference image in the existing React Native project. Follow the codebase's existing conventions and reuse the dashboard's shared sidebar, top bar, theme, typography, colors, spacing, icons, controls, and card components.

This is an implementation specification for the coding agent. Inspect the existing dashboard and neighboring screens first, then adapt file paths, navigation, component APIs, and styling to the actual repository. Do not rebuild the shared application shell.

## Screen header

- Page title: `Upload Results`
- Subtitle: `Import student scores from spreadsheets or scanned result sheets.`
- Keep the shared top bar with notification badge, theme toggle, and administrator profile.
- Highlight **Upload Results** in the sidebar.
- Add a top-right dark-green **New Upload** button with a plus icon. It should reset the upload wizard to step 1 and clear any unsaved file/form state.

## Main layout

Use the existing app's desktop two-column layout where available, matching the reference image. On narrow screens, stack the source selector and upload details vertically. Avoid web-only HTML elements; use React Native components and project-native UI primitives.

### 1. Start New Upload card

Create one large bordered card with two sections.

#### Left section — Start New Upload

Heading: `Start New Upload`

Helper text: `Choose your source type and provide the required details.`

Display two selectable source cards:

**Excel/CSV Spreadsheet**
- Spreadsheet icon in a pale-green icon tile
- Description: `Upload results from Excel or CSV files.`
- Selected by default
- Selected state uses a green border and a check indicator

**Scanned PDF Result Sheet**
- PDF icon in a pale-red icon tile
- Description: `Upload scanned result sheets (PDF).`
- Unselected by default

Selecting a source updates the active card and accepted-file guidance. Do not imply that PDF OCR is implemented unless the repository already has that capability.

#### Right section — Upload Details

Heading: `Upload Details`

Helper text: `All fields are required`

Show the following fields in a compact grid:

1. **Academic Session** — default `2024/2025`
2. **Term** — default `Second Term`
3. **Class Arm** — default `JSS1A`
4. **Subject** — default `Mathematics`
5. **Assessment Configuration** — default `JSS1 - Mathematics (40/60)`

Use dropdowns consistent with the existing project. The available options should come from existing app data where possible. For demo-only options, provide sensible sample values such as sessions `2024/2025`, `2025/2026`; terms `First Term`, `Second Term`, `Third Term`; class arms such as `JSS1A`, `JSS1B`, `JSS2A`, `SS1A`; and subjects such as Mathematics, English Language, Biology, and Computer Studies. Keep the assessment configuration options consistent with the selected class and subject if the existing data model supports it.

### 2. File picker / drop zone

Under the fields, show a large dashed-border upload area with a cloud-upload icon and these labels:

- `Click to select file or drag and drop`
- `Supports: .xlsx, .csv, .pdf (Max 10MB)`

React Native does not support browser drag-and-drop by default. Implement the upload area as a pressable file-picker trigger using the file-selection library already installed in the project. If no picker exists, inspect the project's Expo/bare React Native setup and use a compatible picker only if adding a dependency is appropriate.

Requirements:
- Accept `.xlsx`, `.csv`, and `.pdf` files, subject to source type and the project's supported parser flow.
- Enforce a 10 MB maximum size.
- Display the selected filename and size.
- Allow replacing/removing the selected file.
- Show clear validation messages for unsupported type, oversize file, or missing file.
- Do not claim the file has been parsed or validated until the code actually does so.
- If the app supports web as well as native, use the existing platform-specific file selection pattern instead of assuming browser APIs are available on native.

Buttons at the bottom-right:
- **Cancel** — reset the unsaved wizard form/file state to its initial state.
- **Next: Preview & Edit →** — validate required fields and file selection, then move to step 2. Disable it or show validation feedback until the form is valid.

## 3. Upload workflow stepper

Below the main upload card, render a horizontal three-step progress card matching the reference.

### Step 1
- Number: `1`
- Label: `Select Source`
- Description: `Choose file type and upload your file`
- Active by default; use a dark-green filled circle and green label.

### Step 2
- Number: `2`
- Label: `Preview & Edit`
- Description: `Review data, fix errors, and map columns`

### Step 3
- Number: `3`
- Label: `Confirm Upload`
- Description: `Save and submit for verification`

Use connecting lines/arrows between steps. Style completed, active, and upcoming states differently. The stepper must reflect actual wizard state, not be decorative.

## 4. Preview & Edit step

When the user proceeds from step 1:
- Show the selected file details and a preview/edit screen consistent with the shared design system.
- For spreadsheet files, parse the file only if a compatible parser already exists or is added deliberately. Display a tabular preview of parsed rows and provide column mapping/validation where supported.
- For PDFs, show a PDF preview or extraction/review workflow only if the app supports it. If OCR or extraction is not implemented, clearly explain the limitation and provide a safe way to return to step 1.
- Provide controls to return to step 1 and continue to step 3 only after the preview/review requirements implemented by the project are satisfied.
- Do not create fake parsed rows and present them as real uploaded file data.

## 5. Confirm Upload step

At step 3, show a summary of:
- Academic session
- Term
- Class arm
- Subject
- Assessment configuration
- File name and size
- Number of records, only if actually determined from parsed content

Provide **Back** and a final confirmation action. On confirmation, use the existing upload service/API if one exists. Otherwise, keep the action local and explicitly label it as a demo flow; do not claim that the file was saved to the backend or submitted for verification.

## 6. Upload History card

Below the stepper, display a large bordered card.

Heading: `Upload History`

Description: `View and manage your uploaded result files. Uploaded data is reviewed before it becomes verified score data.`

### Search and filters

- Search placeholder: `Search uploads...`
- Source filter: `All Sources`
- Status filter: `All Statuses`
- **Clear Filters** button resets search and both filters.

### Table-like list

Use these columns:

1. Batch Name
2. Source Type
3. Class Arm
4. Subject
5. Uploaded By
6. Upload Date
7. Records
8. Status
9. Actions

Use these initial demo rows, clearly treated as sample data unless connected to real upload records:

| Batch Name | Source Type | Class Arm | Subject | Uploaded By | Upload Date | Records | Status |
|---|---|---|---|---|---|---:|---|
| JSS1A_Maths_T2_2025 | Excel/CSV | JSS1A | Mathematics | Tunde Balogun | Aug 24, 2025 10:32 AM | 42 | Under Review |
| SS2B_Eng_T2_2025 | PDF | SS2B | English Language | Adebayo Johnson | Aug 23, 2025 04:17 PM | 38 | Draft |
| JSS3A_Sci_T2_2025 | Excel/CSV | JSS3A | Biology | Emmanuel Ibe | Aug 22, 2025 11:45 AM | 36 | Verified |
| SS1B_Comp_T2_2025 | PDF | SS1B | Computer Studies | Grace Okafor | Aug 21, 2025 02:20 PM | 41 | Rejected |
| JSS2A_Eng_T2_2025 | Excel/CSV | JSS2A | English Language | Blessing Adekunle | Aug 20, 2025 09:15 AM | 40 | Under Review |
| SS3C_Gov_T2_2025 | Excel/CSV | SS3C | Government | Fatima Hashim | Aug 18, 2025 03:42 PM | 37 | Verified |

Style source types with spreadsheet/PDF icons. Use status badges:
- `Under Review`: amber
- `Draft`: blue
- `Verified`: green
- `Rejected`: red

For each row:
- **View** button with an eye icon opens the batch details using the project's existing route/modal pattern.
- Three-dot action control opens the available row actions. Do not show actions that the project cannot support, and do not imply backend deletion/reprocessing exists if it does not.

Footer:
- `Showing 1–6 of 6 uploads`
- Pagination controls matching the reference. Since the initial demo data has six rows, page 1 should be selected and the count should stay consistent with filters.

## Interactions and state

Use the project's established state-management conventions. If the screen uses local state, keep all dependent UI derived from that state.

1. Source cards select Excel/CSV or PDF.
2. Dropdown fields retain and display selected values.
3. Changing class arm or subject updates assessment configuration options when supported by the data model.
4. File selection validates extension/type and file size.
5. Cancel and New Upload reset the draft wizard.
6. Next validates required fields and advances to Preview & Edit.
7. Stepper status reflects the current step and completed steps.
8. Preview and confirmation actions follow the actual supported parsing/upload flow.
9. Upload History search matches batch name, source, class arm, subject, uploader, and status.
10. Source and status filters work together with search.
11. Clear Filters resets all history filters.
12. View opens the selected upload's details.
13. Row action menus use existing application patterns.
14. Theme changes use the shared app-wide theme state.

## Implementation conventions

- Inspect the existing dashboard and related screens before coding.
- Reuse the shared sidebar/top bar and established components; do not duplicate the app shell.
- Follow the project's existing navigation, TypeScript/JavaScript choice, file organization, styling approach, and state-management patterns.
- Use React Native-compatible primitives (`View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `FlatList`, etc.) or existing project components. Do not use web-only `div`, `table`, or HTML inputs in a native screen.
- Reuse the icon library already installed in the project.
- Avoid new dependencies unless needed for file picking or parsing and compatible with the current app setup.
- Do not invent backend endpoints or claim persistence, OCR, parsing, or verification without implemented support.
- Keep accessibility labels and touch targets appropriate for interactive controls.

## Acceptance checklist

- [ ] Shared app shell is reused and Upload Results is highlighted in the sidebar.
- [ ] Source selector and upload details match the reference layout.
- [ ] Required fields and file constraints are validated.
- [ ] Upload workflow stepper updates with wizard state.
- [ ] Preview and confirmation do not fabricate parsed data.
- [ ] History table shows the six supplied sample records.
- [ ] Search, source/status filters, and Clear Filters work together.
- [ ] View and row actions behave according to existing app capabilities.
- [ ] Responsive layout stacks cleanly on narrow screens.
- [ ] React Native conventions and existing project patterns are followed.
- [ ] No unsupported backend/OCR/persistence capability is falsely claimed.
